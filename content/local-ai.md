# 27B on 32GB

Everything on this page runs on one laptop: a MacBook Pro with an M1 Max chip and 32 GB of unified memory. No cloud APIs, no subscriptions, no "your prompts make the model better." The whole trick is making a 27-billion-parameter model useful inside a 32 GB laptop — and then letting it do actual work.

## The constraint that shapes everything

32 GB of unified memory is the number everything else derives from:

- The model has to fit at 4-bit (roughly 15 GB of weights) *and* leave room for the KV cache, so context windows are deliberately **under** the model's advertised limits — 74K / 64K instead of whatever the README claims.
- One model lives in memory at a time; the engine releases it after ten idle minutes so the laptop can be a laptop again.
- Everything binds to loopback. The model is a coworker at the desk, not a service on the internet.

## What's running

[Splash](https://github.com/incoai/splash) is a local inference engine for Apple silicon: it runs models (MLX checkpoints, GGUF) behind an OpenAI-compatible server, tuned per model family. Upstream targets M3-and-newer GPUs, so the M1 Max runs a community fork that adds the Metal kernels older GPUs need — plus Neural Engine prefill, which makes long prompts about 1.5× faster.

Three local models, three jobs:

| Model | Role |
|---|---|
| Qwen 3.8 27B (4-bit) | The default brain. Dense, 74K context, thinks hard by default. |
| Qwen 3.6 35B-A3B (4-bit) | The fast one. Hybrid MoE — 35B total, ~3B active — for quick turns. |
| Ternary Bonsai 2 27B | The light one. Ternary quant, smallest memory footprint, the compaction workhorse. |

The server sits in a detached tmux session, and a launchd watchdog checks its health every 30 seconds: restart if it's wedged, but with a 10-minute cooldown and a four-per-hour cap, after which it gives up and tells me instead of flapping. Decoding runs around 60 tokens/second on the M1 Max — enough that "thinking for a minute" feels like a pause, not a tax.

## The agent on top

The brain drives [pi](https://github.com/earendil-works/pi), a terminal coding agent. What makes it feel less like a chatbot and more like a coworker:

- **An iMessage bridge.** A small local extension polls Messages — it can receive from, and send to, me and only me. `@task` from my phone lands in a todo store deterministically, never in the model. This is what makes the agent drivable from the couch, the driveway, or with the laptop lid closed.
- **A global todo loop.** A 15-minute launchd worker runs queued tasks when the model is free — one at a time, single-server, with a busy-gate — and texts a summary when each one finishes.
- **MCP servers.** Safari (web research happens in a real browser, not a cloud API), Apple Music, Home Assistant, Sonos, Xcode. The agent acts on the machine; it doesn't pretend to have access it doesn't.
- **Context engineering.** Per-project `AGENTS.md` files, a global system prompt, a cheap dedicated model for session compaction, and findings written to disk *before* compaction so long sessions don't lose the plot.

The security note I actually care about: I audit third-party agent extensions before they touch my machine. One popular iMessage package turned out to ship a code-obfuscator dependency. It's why the bridge here is a small local extension I can read end to end.

## Letting it manage Google Sheets

This is the setup I get asked about most, so here it is — deliberately generic. No sheet names, no IDs, no hints about what the sheets contain. The point is the pattern: **the local model does the thinking, a CLI does the API work, and your own Google account stays yours.**

The pieces:

1. `brew install gogcli` — `gog` is a Google Suite CLI: Sheets, Drive, Docs, Gmail in one binary.
2. In the Google Cloud Console: enable the Sheets and Drive APIs, create a **desktop** OAuth client for your own email — and **publish the app**, or Testing-mode refresh tokens expire every seven days and you'll wonder what just happened.
3. `gog auth credentials`, then `gog auth add`. Tokens land in a local keyring file, mode 0600. Nothing leaves the machine.
4. Tell the agent what you want. It shells out to `gog sheets get` / `update`, shows you the diff, writes, then **reads back to verify**.

The habits that keep it boring (boring is the goal):

- `--dry-run` and `--readonly` for exploration; read before write, always.
- Keep batch writes small — under eight rows. Big batches can silently truncate, and the API will smile while doing it.
- Conditional-formatting formulas need the `=` prefix, and the v4 API rejects some legacy v1beta fields, so certain paths go with plain values.
- `deleted: false` can still mean "it worked." Read back.

The model never sees more of your Google account than the API surface the CLI exposes, and the CLI never talks to anyone but your own account. Your data stays home; the spreadsheet thinking just finally has a brain.

## A day in the life

tmux keeps the model server and the agent alive in detached sessions. I send a text from the driveway, the agent works for twenty minutes, and I get a reply describing what it did — with the logs to prove it. When I want to watch, it's in iTerm. When I don't, the lid closes and the work keeps going.

That remotability — a 27B model you can drive from a phone — is the part I didn't expect to want most.
