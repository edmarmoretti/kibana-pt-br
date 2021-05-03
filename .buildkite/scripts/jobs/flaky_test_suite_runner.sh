#!/usr/bin/env bash

set -euo pipefail

TEST_SUITE="$(buildkite-agent meta-data get 'test-suite')"
export TEST_SUITE

RUN_COUNT="$(buildkite-agent meta-data get 'run-count')"
export RUN_COUNT

UUID="$(cat /proc/sys/kernel/random/uuid)"
export UUID

node .buildkite/scripts/jobs/flaky_test_suite_runner.js | buildkite-agent pipeline upload
