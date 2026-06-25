import csv
import json
from pathlib import Path


def convert_csv_to_json(input_path: Path, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with input_path.open(newline="", encoding="utf-8") as csv_file:
        reader = csv.DictReader(csv_file)
        rows = list(reader)

    with output_path.open("w", encoding="utf-8") as json_file:
        json.dump(rows, json_file, ensure_ascii=False, indent=2)


