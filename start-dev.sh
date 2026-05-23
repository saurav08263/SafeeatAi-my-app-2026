#!/bin/bash
cd /home/z/my-project
while true; do
  if ! pgrep -f "next-server" > /dev/null 2>&1; then
    echo "[$(date)] Starting Next.js dev server..." >> /tmp/safeeat-watchdog.log
    npx next dev -p 3000 >> /tmp/safeeat-dev.log 2>&1 &
    sleep 5
  fi
  sleep 3
done
