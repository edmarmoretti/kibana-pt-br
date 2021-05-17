#!/usr/bin/env bash

set -euo pipefail

.buildkite/scripts/bootstrap.sh
.buildkite/scripts/download_build_artifacts.sh

echo '--- Build kbn_sample_panel_action'
cd "$KIBANA_DIR/test/plugin_functional/plugins/kbn_sample_panel_action"
yarn build

cd "$KIBANA_DIR"

echo '--- Plugin functional tests'
node scripts/functional_tests \
    --config test/plugin_functional/config.ts \
    --bail \
    --debug

echo '--- Interpreter functional tests'
node scripts/functional_tests \
  --config test/interpreter_functional/config.ts \
  --bail \
  --debug \
  --kibana-install-dir "$KIBANA_BUILD_LOCATION"
