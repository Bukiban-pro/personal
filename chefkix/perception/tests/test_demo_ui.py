from pathlib import Path


def test_demo_ui_contains_required_contract_elements() -> None:
    html = Path("ui/index.html").read_text(encoding="utf-8").lower()
    assert "run inference" in html
    assert "label hint" in html
    assert "fetch('http://127.0.0.1:8000/infer'" in html
    assert "standalone ingredient perception smoke demo" in html
