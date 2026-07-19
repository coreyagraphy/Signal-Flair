# ADR 0001 — stdlib sqlite3 + SQL migrations over SQLAlchemy/Alembic

Fewer dependencies to audit, zero ORM magic, WAL + busy_timeout suffice for a
single-machine system, and migrations stay reviewable SQL files applied in
order with a schema_migrations ledger. Revisit only if multi-process write
contention outgrows SQLite.
