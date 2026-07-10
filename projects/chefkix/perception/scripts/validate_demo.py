from __future__ import annotations

import argparse
import json
from pathlib import Path


REQUIRED_SNIPPETS = [
    "run inference",
    "label hint",
    "standalone ingredient perception smoke demo",
    "fetch('http://127.0.0.1:8000/infer'",
]


def validate_demo(html_path: Path) -> dict:
    html = html_path.read_text(encoding="utf-8").lower()
    missing = [snippet for snippet in REQUIRED_SNIPPETS if snippet not in html]
    assert not missing, f"missing required demo snippets: {missing}"
    return {"status": "DONE", "html_path": str(html_path), "missing": missing}


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate the Phase 1 demo UI contract.")
    parser.add_argument("--html", required=True, help="Path to ui/index.html")
    parser.add_argument("--output", required=True, help="Path to write the machine-readable validation report.")
    args = parser.parse_args()

    report = validate_demo(Path(args.html))
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
