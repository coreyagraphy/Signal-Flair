# ADR 0002 — argparse over typer/rich

The CLI is operator-facing but simple; stdlib argparse removes two
dependencies and keeps startup instant. Rich output can be layered later
without changing command contracts.
