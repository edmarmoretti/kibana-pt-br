#!/usr/bin/env bash

set -euo pipefail

node .buildkite/scripts/jobs/flaky_test_suite_runner_inputs.js | buildkite-agent pipeline upload
