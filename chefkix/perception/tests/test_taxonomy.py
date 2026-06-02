from pathlib import Path

from chefkix.perception.core import load_taxonomy


def test_taxonomy_parses_and_ids_are_unique() -> None:
    taxonomy = load_taxonomy(Path(__file__).resolve().parents[1] / "labels" / "taxonomy.yaml")
    assert taxonomy.ontology_name == "chefkix_phase1_ingredients"
    assert len(taxonomy.classes) == 12
    assert len(set(taxonomy.class_ids)) == len(taxonomy.class_ids)
    assert taxonomy.classes_by_name["milk_carton"].class_id == 9

