# OpenLabs — Codex CLI plugin

> **TEST ring** — Marvin's dev ring, points at the test backend (`https://test.lab-agent.parallight.ai`, served by the `staging` branch). Not for learners.

Learn to build AI agents by **directing** them, guided by a resident master craftsman — inside Codex CLI. Draw what you want to learn as a teachboard board. Zero API keys (the LLM runs through Parallight's backend).

## Install (Codex CLI)

```
codex plugin marketplace add parallight/lab-codex-test
codex plugin add openlabs-test@parallight-cx-test
```

Restart Codex. Codex has no slash-command routing for plugins, so use `:openlabs-test` / `:lab` style tokens (the skill recognises them) or natural language:

```
:openlabs-test connect   # connect your teachboard account
:lab-login        # sign in with a 6-digit email code
:lab              # browse available labs
```

More: <https://parallight.ai>

---

This repo is the private test Codex CLI marketplace. The MCP server (`plugins/openlabs-test/bundle/`) talks to the Parallight backend; it holds no secrets.
