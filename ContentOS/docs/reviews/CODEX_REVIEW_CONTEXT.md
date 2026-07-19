# Context for the Codex reviewer

- System intent: docs/00_SYSTEM_OVERVIEW.md; architecture: docs/01; honest
  limitations the team already admits: docs/12.
- Build environment was a Linux container; Windows/GPU/Premiere behaviors are
  code-complete but unexecuted there — findings about those paths are still
  in scope (they will run on Windows 11).
- The default operating mode is fully local: no API keys, dry-run
  distribution, template LLM fallback. Anything that breaks that promise is
  P0/P1.
- Prior internal review + resolutions: docs/agents/AGENT_G_REFUTER_REPORT.md.
