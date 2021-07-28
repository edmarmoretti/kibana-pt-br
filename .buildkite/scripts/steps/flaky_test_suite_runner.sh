#!/usr/bin/env bash

set -euo pipefail

UUID="$(cat /proc/sys/kernel/random/uuid)"
export UUID

# node .buildkite/scripts/jobs/flaky_test_suite_runner.js | buildkite-agent pipeline upload

node .buildkite/scripts/jobs/flaky_test_suite_runner.js
