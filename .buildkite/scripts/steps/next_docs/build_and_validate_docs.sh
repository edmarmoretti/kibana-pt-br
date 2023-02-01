#!/usr/bin/env bash

set -euo pipefail

source .buildkite/scripts/common/util.sh

echo "--- Build docs"

echo "⚠️ run 'node scripts/validate_next_docs --debug' locally to debug ⚠️"
node scripts/validate_next_docs



