#!/usr/bin/env bash

set -euo pipefail

export DISABLE_BOOTSTRAP_VALIDATION=true
export BUILD_TS_REFS_DISABLE=true
export DISABLE_CI_STATS_SHIPPING=true

.buildkite/scripts/bootstrap.sh
.buildkite/scripts/build_kibana.sh
.buildkite/scripts/build_kibana_plugins.sh
.buildkite/scripts/post_build_kibana.sh
