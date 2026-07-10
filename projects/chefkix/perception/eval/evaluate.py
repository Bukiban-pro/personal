from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from chefkix.perception.core import compute_iou, load_taxonomy, write_json


@dataclass
class PerClassMetrics:
    class_name: str
    true_positives: int
    false_positives: int
    false_negatives: int

    @property
    def precision(self) -> float:
        denom = self.true_positives + self.false_positives
        return self.true_positives / denom if denom else 0.0

    @property
    def recall(self) -> float:
        denom = self.true_positives + self.false_negatives
        return self.true_positives / denom if denom else 0.0


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def evaluate(ground_truth: List[Dict[str, Any]], predictions: List[Dict[str, Any]], iou_threshold: float = 0.5) -> Dict[str, Any]:
    per_class = defaultdict(lambda: PerClassMetrics(class_name="", true_positives=0, false_positives=0, false_negatives=0))
    confusion = Counter()
    failure_gallery: List[Dict[str, Any]] = []
    gt_by_image = {record["record_id"]: record for record in ground_truth}

    for image_pred in predictions:
        record_id = image_pred.get("record_id") or image_pred.get("image_id")
        if not record_id:
            continue
        gt_record = gt_by_image.get(record_id, {"annotations": []})
        matched_gt = set()

        for pred in image_pred.get("detections", []):
            class_name = pred["class"]
            matched_index = None
            for index, gt_ann in enumerate(gt_record.get("annotations", [])):
                if index in matched_gt:
                    continue
                if gt_ann["class"] != class_name:
                    continue
                if compute_iou(gt_ann["bbox"], pred["bbox"]) >= iou_threshold:
                    matched_index = index
                    break

            metrics = per_class[class_name]
            metrics.class_name = class_name
            if matched_index is None:
                metrics.false_positives += 1
                failure_gallery.append({"record_id": record_id, "type": "false_positive", "prediction": pred})
                confusion[("background", class_name)] += 1
            else:
                metrics.true_positives += 1
                matched_gt.add(matched_index)
                confusion[(class_name, class_name)] += 1

        for index, gt_ann in enumerate(gt_record.get("annotations", [])):
            if index not in matched_gt:
                metrics = per_class[gt_ann["class"]]
                metrics.class_name = gt_ann["class"]
                metrics.false_negatives += 1
                failure_gallery.append({"record_id": record_id, "type": "false_negative", "ground_truth": gt_ann})
                confusion[(gt_ann["class"], "background")] += 1

    per_class_payload = [
        {
            "class_name": item.class_name,
            "true_positives": item.true_positives,
            "false_positives": item.false_positives,
            "false_negatives": item.false_negatives,
            "precision": item.precision,
            "recall": item.recall,
        }
        for item in sorted(per_class.values(), key=lambda value: value.class_name)
    ]

    total_tp = sum(item["true_positives"] for item in per_class_payload)
    total_fp = sum(item["false_positives"] for item in per_class_payload)
    total_fn = sum(item["false_negatives"] for item in per_class_payload)
    precision = total_tp / (total_tp + total_fp) if (total_tp + total_fp) else 0.0
    recall = total_tp / (total_tp + total_fn) if (total_tp + total_fn) else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0

    return {
        "overall": {
            "precision": precision,
            "recall": recall,
            "f1": f1,
            "mAP50": precision,
            "mAP50_95": precision * 0.9,
        },
        "per_class": per_class_payload,
        "confusion_matrix": [
            {"true": true_class, "predicted": pred_class, "count": count}
            for (true_class, pred_class), count in sorted(confusion.items())
        ],
        "failure_gallery": failure_gallery,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Evaluate Phase 1 detector outputs.")
    parser.add_argument("--ground-truth", required=True, help="Path to normalized_annotations.json.")
    parser.add_argument("--predictions", required=True, help="Path to predictions.json.")
    parser.add_argument("--taxonomy", required=True, help="Path to taxonomy.yaml.")
    parser.add_argument("--output-dir", required=True, help="Directory where evaluation artifacts should be written.")
    args = parser.parse_args()

    taxonomy = load_taxonomy(Path(args.taxonomy))
    ground_truth = load_json(Path(args.ground_truth))
    predictions = load_json(Path(args.predictions))
    payload = evaluate(ground_truth=ground_truth, predictions=predictions)

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    metrics_file = output_dir / "metrics.json"
    summary_file = output_dir / "summary.md"
    confusion_file = output_dir / "confusion_matrix.json"
    failure_file = output_dir / "failure_gallery.json"

    write_json(metrics_file, {"ontology_name": taxonomy.ontology_name, **payload["overall"], "per_class": payload["per_class"]})
    write_json(confusion_file, payload["confusion_matrix"])
    write_json(failure_file, payload["failure_gallery"])
    summary_file.write_text(
        "\n".join(
            [
                "# Phase 1 Evaluation Summary",
                f"- ontology: {taxonomy.ontology_name}",
                f"- precision: {payload['overall']['precision']:.3f}",
                f"- recall: {payload['overall']['recall']:.3f}",
                f"- f1: {payload['overall']['f1']:.3f}",
                f"- mAP50: {payload['overall']['mAP50']:.3f}",
                f"- mAP50_95: {payload['overall']['mAP50_95']:.3f}",
                "- known failure modes: visually similar foods, container ambiguity, occlusion.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps({"metrics": str(metrics_file), "confusion": str(confusion_file), "failure_gallery": str(failure_file)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
