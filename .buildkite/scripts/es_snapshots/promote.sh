#!/bin/bash

set -euo pipefail

export SNAPSHOT_MANIFEST="${SNAPSHOT_MANIFEST:-"$(buildkite-agent meta-data get SNAPSHOT_MANIFEST)"}"

node "$(dirname "${0}")/promote_manifest.js" "$SNAPSHOT_MANIFEST"
