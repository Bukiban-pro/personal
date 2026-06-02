from chefkix.perception.eval.evaluate import evaluate


def test_evaluate_produces_metrics_and_failure_gallery() -> None:
    ground_truth = [
        {"record_id": "record-1", "annotations": [{"class": "egg", "bbox": [10, 10, 50, 50]}]},
        {"record_id": "record-2", "annotations": [{"class": "tomato", "bbox": [20, 20, 60, 60]}]},
    ]
    predictions = [
        {"record_id": "record-1", "detections": [{"class": "egg", "bbox": [12, 12, 48, 48], "score": 0.9}]},
        {"record_id": "record-2", "detections": [{"class": "egg", "bbox": [20, 20, 60, 60], "score": 0.5}]},
    ]

    payload = evaluate(ground_truth=ground_truth, predictions=predictions)
    assert payload["overall"]["precision"] > 0.0
    assert payload["overall"]["recall"] > 0.0
    assert payload["failure_gallery"]

