import io

from fastapi.testclient import TestClient

from chefkix.perception.service.app import app


def test_service_health_and_infer_contract() -> None:
    client = TestClient(app)
    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "ok"

    response = client.post(
        "/infer",
        files={"file": ("egg_sample.jpg", io.BytesIO(b"sample-bytes"), "image/jpeg")},
        data={"label_hint": "egg"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["ontology_name"] == "chefkix_phase1_ingredients"
    assert payload["detections"]
    assert payload["detections"][0]["class_name"] == "egg"

