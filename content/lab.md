# The House

Not a rack. Not a server closet. It's a Raspberry Pi, a network of Sonos speakers, and a house full of sensors — plus the agents that keep an eye on all of it.

## One box, two jobs

The hub of the house is a Raspberry Pi — `klipperpi` on the network, `ssh klipperpi.local` from anywhere in the house — that does two jobs at once:

1. **3D-printer server.** Klipper, Moonraker, and Fluidd for the [Anet A8](/printer).
2. **Home-automation hub.** [Home Assistant](https://github.com/home-assistant/core), plus the stack around it: [InfluxDB](https://github.com/influxdata/influxdb) for history, [Mosquitto](https://github.com/eclipse/mosquitto) for MQTT, [Zigbee2MQTT](https://github.com/Koenkk/zigbee2mqtt) for the radio devices, [Prometheus](https://github.com/prometheus/prometheus) for metrics, and a camera streamer.

It's administered the same way I administer everything else: **agents over SSH**. tmux sessions, changes made in small reviewed chunks, and a standing habit of reading the logs before touching anything. No one logs into a Pi with a web browser at 2 a.m. — the agents do, and they leave a paper trail.

## What the automation actually does

- **Climate.** An Ecobee thermostat, room temperature and humidity sensors, and an attic fan, all in [Home Assistant](https://github.com/home-assistant/core). When the furnace started acting up, an agent paged through months of [InfluxDB](https://github.com/influxdata/influxdb) history and wrote a plain-English summary. I handed the repair tech that instead of "it's weird sometimes."
- **Radio devices.** Zigbee2MQTT handles the zigbee sensors — the boring, unglamorous kind of automation that just works and never phones you.
- **Cameras.** A few, including the one on the printer. The local model can look.

The rule for this corner of the house: **if it needs the cloud, it doesn't live here.** Home Assistant and local services do the thinking; the cloud gets a status message at best.

## The Sonos theater

The fun part. Six devices, one **5.1.2** home theater:

| Device | Role |
|---|---|
| Beam (Gen 2) | Center, over the TV via HDMI EARC — the anchor of the whole system |
| Sub (Gen 3) | The low end |
| Era 300 ×2 | Rear surrounds, in a true-stereo pair |
| One SL ×2 | Front left / right satellites |

All on current firmware, all wireless. And here's the story I didn't expect: ask the Sonos **cloud** API (via its MCP server) what's in the household, and it answers with *one player* — the Beam. The other five are subordinated to the theater and invisible to the cloud view. The local HTTP API on each device tells the truth: all five report "I'm part of a home theater, my primary is the Beam."

So the agent mapped the system the way a network engineer would — cloud view for the system, local API for the details — and produced a map of all six devices, their roles, their firmware levels, and why the "missing" speakers were never missing. Music is Apple Music everywhere, with the Beam anchoring the theater mix.

## How it's driven

Same pattern as the laptop: agents in tmux, driven from iMessage, lid closed. The Pi runs long tmux sessions; a text message is a keyboard. If the house misbehaves, the first responder is usually a well-prompted 27B that has SSH, a habit of reading logs, and no ego about being wrong.
