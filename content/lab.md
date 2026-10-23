# The House

Not a rack. Not a server closet. It's a Raspberry Pi, a network of Sonos speakers, and a house full of sensors — plus the agents that keep an eye on all of it.

## One box, two jobs

The hub of the house is a Raspberry Pi — `klipperpi` on the network, `ssh klipperpi.local` from anywhere in the house — that does two jobs at once:

1. **3D-printer server.** Klipper, Moonraker, and Fluidd for the [Anet A8](/printer).
2. **Home-automation hub.** [Home Assistant](https://github.com/home-assistant/core), plus the stack around it: [InfluxDB](https://github.com/influxdata/influxdb) for history, [Mosquitto](https://github.com/eclipse/mosquitto) for MQTT, [Zigbee2MQTT](https://github.com/Koenkk/zigbee2mqtt) for the radio devices, [Prometheus](https://github.com/prometheus/prometheus) for metrics, and a camera streamer.

It's administered the same way I administer everything else: **agents over SSH**. tmux sessions, changes made in small reviewed chunks, and a standing habit of reading the logs before touching anything. No one logs into a Pi with a web browser at 2 a.m. — the agents do, and they leave a paper trail.

## What the automation actually does

- **Climate.** An Ecobee thermostat, room temperature and humidity sensors, and an attic fan, all in [Home Assistant](https://github.com/home-assistant/core). The sensors earned their keep this summer: I watched how the AC actually cooled each room, and the map pointed at the house, not the thermostat. Some places needed weather stripping, and the bathroom fans that vent into the attic were letting hot air leak back in. I sealed both problems, and the AC works better.
- **Radio devices.** Zigbee2MQTT handles the zigbee sensors — the boring, unglamorous kind of automation that just works and never phones you.
- **Cameras.** A few, including the one on the printer. The local model can look.

The rule for this corner of the house: **if it needs the cloud, it doesn't live here.** Home Assistant and local services do the thinking; the cloud gets a status message at best.

## The Sonos theater

Six devices, one **5.1.2** theater:

| Device | Role |
|---|---|
| Beam (Gen 2) | Center, over the TV via HDMI EARC — the anchor of the whole system |
| Sub (Gen 3) | The low end |
| Era 300 ×2 | Rear surrounds, in a true-stereo pair |
| One SL ×2 | Front left / right satellites |

All on current firmware, all wireless. One practical detail: the Sonos **cloud** API (via its MCP server) reports the theater as *one player* — the Beam — because the other five are subordinated to it. Each device's local HTTP API reports the details; the five subordinates all answer "I'm part of a home theater, my primary is the Beam."

The agents use both views. A first pass mapped all six devices, their roles, and their firmware. Day to day, they can trigger the right music for a situation, and if the theater misbehaves they can analyze the network between the speakers. Music is Apple Music everywhere, with the Beam anchoring the mix.
