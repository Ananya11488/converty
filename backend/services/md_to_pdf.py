from pathlib import Path


def convert_md_to_pdf(input_path: Path, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("PDF conversion placeholder", encoding="utf-8")


