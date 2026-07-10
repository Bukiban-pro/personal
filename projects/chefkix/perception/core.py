from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, Sequence

import yaml


@dataclass(frozen=True)
class TaxonomyClass:
    class_id: int
    name: str
    aliases: tuple[str, ...] = ()
    notes: str = ""


@dataclass(frozen=True)
class Taxonomy:
    version: int
    ontology_name: str
    classes: tuple[TaxonomyClass, ...]

    @property
    def classes_by_name(self) -> Dict[str, TaxonomyClass]:
        return {item.name: item for item in self.classes}

    @property
    def alias_to_name(self) -> Dict[str, str]:
        mapping: Dict[str, str] = {}
        for item in self.classes:
            for alias in (item.name, *item.aliases):
                mapping[alias.lower()] = item.name
        return mapping

    @property
    def class_ids(self) -> List[int]:
        return [item.class_id for item in self.classes]


def load_yaml(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def load_taxonomy(path: Path) -> Taxonomy:
    raw = load_yaml(path)
    classes = []
    for item in raw.get("classes", []):
        aliases = tuple(item.get("aliases", []) or [])
        classes.append(
            TaxonomyClass(
                class_id=int(item["id"]),
                name=str(item["name"]),
                aliases=aliases,
                notes=str(item.get("notes", "")),
            )
        )
    return Taxonomy(
        version=int(raw.get("version", 1)),
        ontology_name=str(raw.get("ontology_name", "unknown")),
        classes=tuple(classes),
    )


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2, sort_keys=True)
        handle.write("\n")


def canonicalize_label(label: str, taxonomy: Taxonomy) -> str:
    normalized = label.strip().lower().replace(" ", "_")
    return taxonomy.alias_to_name.get(normalized, normalized)


def validate_bbox(bbox: Sequence[float]) -> bool:
    if len(bbox) != 4:
        return False
    x1, y1, x2, y2 = bbox
    return x2 > x1 and y2 > y1


def bbox_to_int_list(bbox: Sequence[float]) -> List[int]:
    return [int(round(value)) for value in bbox]


def hash_bucket(value: str, buckets: Sequence[tuple[str, int]]) -> str:
    digest = hashlib.sha1(value.encode("utf-8")).hexdigest()
    slot = int(digest[:8], 16) % 100
    cumulative = 0
    for name, weight in buckets:
        cumulative += weight
        if slot < cumulative:
            return name
    return buckets[-1][0]


def deterministic_split(record_id: str) -> str:
    return hash_bucket(record_id, [("train", 70), ("validation", 15), ("test", 15)])


def compute_iou(a: Sequence[float], b: Sequence[float]) -> float:
    if len(a) != 4 or len(b) != 4:
        return 0.0
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b
    ix1 = max(ax1, bx1)
    iy1 = max(ay1, by1)
    ix2 = min(ax2, bx2)
    iy2 = min(ay2, by2)
    iw = max(0.0, ix2 - ix1)
    ih = max(0.0, iy2 - iy1)
    intersection = iw * ih
    if intersection <= 0:
        return 0.0
    area_a = max(0.0, ax2 - ax1) * max(0.0, ay2 - ay1)
    area_b = max(0.0, bx2 - bx1) * max(0.0, by2 - by1)
    union = area_a + area_b - intersection
    return intersection / union if union > 0 else 0.0


def unique(seq: Iterable[str]) -> List[str]:
    seen: set[str] = set()
    ordered: List[str] = []
    for item in seq:
        if item not in seen:
            seen.add(item)
            ordered.append(item)
    return ordered
