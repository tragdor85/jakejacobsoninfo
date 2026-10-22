#!/bin/bash
# Monitor jakejacobson.info for the Cloudflare NS cutover + Pages activation.
LOG=/tmp/jjs-dns-monitor.log
: > "$LOG"
for i in $(seq 1 144); do  # 144 x 10min = 24h max
  NS=$(dig +short NS jakejacobson.info @1.1.1.1 | head -1)
  A=$(dig +short A jakejacobson.info @1.1.1.1)
  CNAME=$(dig +short CNAME www.jakejacobson.info @1.1.1.1)
  echo "[$(date '+%H:%M:%S')] ns=${NS:-none} apex_a=${A:-none} www_cname=${CNAME:-none}" >> "$LOG"
  case "$NS" in
    *cloudflare*)
      # NS switched over — verify the full chain once
      CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 https://jakejacobson.info)
      WWW=$(curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}" --max-time 30 https://www.jakejacobson.info)
      echo "[$(date '+%H:%M:%S')] NS ON CLOUDFLARE. apex_https=$CODE www=$WWW" >> "$LOG"
      echo "DONE ns=cloudflare apex_https=$CODE www=$WWW" >> "$LOG"
      break
      ;;
  esac
  sleep 600
done
echo "[$(date '+%H:%M:%S')] monitor finished" >> "$LOG"
