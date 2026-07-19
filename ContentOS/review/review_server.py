"""Local review server (stdlib only): serves the review package for a job and
accepts feedback at POST /api/review, writing straight into the database.

Run: python contentos_cli.py review <job_id>
Binds to 127.0.0.1 only — this is a local operator tool, not a web service.
"""
from __future__ import annotations

import json
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.config import load_settings          # noqa: E402
from core.database import migrate              # noqa: E402
from core.job_store import JobStore            # noqa: E402
from services import review_service            # noqa: E402

MAX_BODY = 2 * 1024 * 1024


def make_handler(review_dir: Path, settings, store):
    class ReviewHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(review_dir), **kwargs)

        def do_POST(self):
            if self.path != "/api/review":
                self.send_error(404)
                return
            length = int(self.headers.get("Content-Length", 0))
            if length <= 0 or length > MAX_BODY:
                self.send_error(413)
                return
            try:
                payload = json.loads(self.rfile.read(length).decode("utf-8"))
                result = review_service.submit_feedback(
                    settings, store, str(payload["job_id"]),
                    ratings=payload.get("ratings"),
                    decision=str(payload.get("decision", "revision_requested")),
                    notes=payload.get("notes"))
            except Exception as exc:  # report, never crash the server
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(exc)}).encode())
                return
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        def log_message(self, fmt, *args):
            pass  # keep the console quiet

    return ReviewHandler


def serve(job_id: str, port: int = 8765) -> None:
    settings = load_settings()
    migrate(settings.paths)
    store = JobStore(settings)
    review_dir = settings.paths.data_review / job_id
    if not (review_dir / "review.html").exists():
        raise SystemExit(f"No review package for {job_id}; run the pipeline to "
                         "awaiting_review first")
    handler = make_handler(review_dir, settings, store)
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"Review {job_id} at http://127.0.0.1:{port}/review.html  (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("usage: python review/review_server.py <job_id> [port]")
    serve(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 8765)
