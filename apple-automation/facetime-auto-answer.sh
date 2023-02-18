#!/bin/sh

osascript -l JavaScript $(cd `dirname $0`;pwd)/facetime-auto-answer.js >> /usr/local/var/log/facetime-auto-answer-$(date '+%Y-%m-%d').log 2>&1
