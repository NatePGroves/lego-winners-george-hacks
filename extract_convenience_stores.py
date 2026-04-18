#!/usr/bin/env python3

from __future__ import annotations

import argparse
import csv
from datetime import datetime
from pathlib import Path


DEFAULT_CATEGORY = "Grocery Store"
DEFAULT_STATUS = "Active"
DATE_FORMAT = "%Y/%m/%d %H:%M:%S+00"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Filter the DC licensing dataset down to convenience-store-style "
            "licenses and write the matches to a new CSV."
        )
    )
    parser.add_argument(
        "--input",
        default="datasets/Basic_Business_Licenses.csv",
        help="Source licensing CSV.",
    )
    parser.add_argument(
        "--output",
        default="datasets/Convenience_Stores_From_Licenses.csv",
        help="Destination CSV for filtered rows.",
    )
    parser.add_argument(
        "--categories",
        nargs="+",
        default=[DEFAULT_CATEGORY],
        help=(
            "License categories to treat as convenience stores. "
            f"Defaults to {DEFAULT_CATEGORY!r}."
        ),
    )
    parser.add_argument(
        "--status",
        default=DEFAULT_STATUS,
        help=(
            "License status to keep. Use '*' to keep every status. "
            f"Defaults to {DEFAULT_STATUS!r}."
        ),
    )
    parser.add_argument(
        "--no-dedupe",
        action="store_true",
        help="Keep every matching row instead of the newest row per site/entity.",
    )
    return parser.parse_args()


def parse_date(raw_value: str) -> datetime:
    value = raw_value.strip()
    if not value:
        return datetime.min

    try:
        return datetime.strptime(value, DATE_FORMAT)
    except ValueError:
        return datetime.min


def business_key(row: dict[str, str]) -> tuple[str, str]:
    site_address = row.get("SITE_ADDRESS", "").strip()
    business_name = (
        row.get("ENTITY_NAME", "").strip()
        or row.get("BILLING_NAME", "").strip()
        or "UNKNOWN BUSINESS"
    )
    return site_address, business_name


def row_rank(row: dict[str, str]) -> tuple[datetime, datetime, datetime]:
    return (
        parse_date(row.get("LICENSE_ISSUE_DATE", "")),
        parse_date(row.get("LICENSE_START_DATE", "")),
        parse_date(row.get("DCS_LAST_MOD_DTTM", "")),
    )


def should_keep(
    row: dict[str, str], categories: set[str], status: str
) -> bool:
    if status != "*" and row.get("LICENSESTATUS", "").strip() != status:
        return False

    return row.get("LICENSECATEGORY", "").strip() in categories


def dedupe_rows(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    newest_by_store: dict[tuple[str, str], dict[str, str]] = {}

    for row in rows:
        key = business_key(row)
        current = newest_by_store.get(key)
        if current is None or row_rank(row) > row_rank(current):
            newest_by_store[key] = row

    return sorted(
        newest_by_store.values(),
        key=lambda row: (
            row.get("SITE_ADDRESS", "").strip(),
            row.get("ENTITY_NAME", "").strip() or row.get("BILLING_NAME", "").strip(),
        ),
    )


def main() -> None:
    args = parse_args()
    input_path = Path(args.input)
    output_path = Path(args.output)
    categories = {category.strip() for category in args.categories if category.strip()}

    with input_path.open("r", newline="", encoding="utf-8-sig") as source_file:
        reader = csv.DictReader(source_file)
        fieldnames = reader.fieldnames
        if not fieldnames:
            raise ValueError(f"No columns found in {input_path}")

        matches = [
            row
            for row in reader
            if should_keep(row, categories=categories, status=args.status)
        ]

    filtered_rows = matches if args.no_dedupe else dedupe_rows(matches)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", newline="", encoding="utf-8") as destination_file:
        writer = csv.DictWriter(destination_file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(filtered_rows)

    print(
        f"Wrote {len(filtered_rows)} rows to {output_path} "
        f"from {len(matches)} matching license rows."
    )


if __name__ == "__main__":
    main()
