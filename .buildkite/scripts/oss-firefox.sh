#!/usr/bin/env bash

set -euo pipefail

export DISABLE_BOOTSTRAP_VALIDATION=true
export JOB=kibana-oss-firefox

.buildkite/scripts/bootstrap.sh
.buildkite/scripts/download_build_artifacts.sh

echo "--- Running $JOB"

node scripts/functional_tests \
  --bail --debug \
  --kibana-install-dir "$KIBANA_BUILD_LOCATION" \
  --include-tag "includeFirefox" \
  --config test/functional/config.firefox.js
