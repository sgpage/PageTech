#!/bin/sh
# Add everything, commit with the given message, and push.
# Usage: ./gcp.sh "Commit message"
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 \"Commit message\"" >&2
  exit 1
fi

cd "$(dirname "$0")"
git add -A
git commit -m "$1"
git push
