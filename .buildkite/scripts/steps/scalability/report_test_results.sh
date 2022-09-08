#!/usr/bin/env bash

set -euo pipefail

source .buildkite/scripts/common/util.sh

echo "--- Upload Gatling reports and metadata to GCS"
OUTPUT_REL="$(date +"%d-%m-%Y-%H:%M:%S")"
OUTPUT_DIR="${WORKSPACE}/${OUTPUT_REL}"
GCS_BUCKET="gs://kibana-performance/scalability-test-results"

mkdir -p "${OUTPUT_DIR}"

download_artifact scalability_test_report.tar.gz "${OUTPUT_DIR}/" --build "${KIBANA_BUILD_ID:-$BUILDKITE_BUILD_ID}"
download_artifact meta.log "${OUTPUT_DIR}/" --build "${KIBANA_BUILD_ID:-$BUILDKITE_BUILD_ID}"

cd "${WORKSPACE}"
gsutil -m cp -r "${OUTPUT_REL}" "${GCS_BUCKET}"
