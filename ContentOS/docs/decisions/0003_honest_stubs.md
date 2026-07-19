# ADR 0003 — credential-gated honest stubs for external clients

Research and distribution clients are NOT implemented until their current
official APIs are verified (mandate forbids guessing endpoints). Adapters
report themselves unavailable with the exact reason instead of shipping
plausible-but-unverified HTTP code. The interface contract + tests mean a
verified client drops in without touching business logic.
