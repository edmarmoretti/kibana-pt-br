const TEST_SUITE = process.env.TEST_SUITE;
const RUN_COUNT = process.env.RUN_COUNT;
const UUID = process.env.UUID;

const JOB_PARTS = TEST_SUITE.split(':');
const IS_XPACK = JOB_PARTS[0] === 'xpack';
// const JOB = JOB_PARTS.length > 1 ? JOB_PARTS[1] : JOB_PARTS[0];
const CI_GROUP = JOB_PARTS.length > 2 ? JOB_PARTS[2] : '';

const steps = [];
const pipeline = {
  steps: steps,
};

if (IS_XPACK) {
  steps.push({
    command: '.buildkite/scripts/jobs/build.sh',
    label: 'Build Kibana Distribution',
    agents: { queue: 'bootstrap' },
    key: 'build',
  });

  steps.push({
    command: '.buildkite/scripts/xpack-cigroup.sh',
    label: `Default CI Group ${CI_GROUP}`,
    agents: { queue: 'ci-group-6' },
    artifact_paths: 'target/junit/**/*.xml',
    depends_on: 'build',
    parallelism: RUN_COUNT,
    concurrency: 25,
    concurrency_group: UUID,
  });
} else {
  steps.push({
    command: '.buildkite/scripts/jobs/build_oss.sh',
    label: 'Build OSS Kibana Distribution',
    agents: { queue: 'bootstrap' },
    key: 'build',
  });

  steps.push({
    command: '.buildkite/scripts/oss-cigroup.sh',
    label: `OSS CI Group ${CI_GROUP}`,
    agents: { queue: 'ci-group-6' },
    artifact_paths: 'target/junit/**/*.xml',
    depends_on: 'build',
    parallelism: RUN_COUNT,
    concurrency: 25,
    concurrency_group: UUID,
  });
}

steps.push(
  {
    wait: '~',
    continue_on_failure: true,
  },
  {
    plugins: [
      {
        'junit-annotate#v1.9.0': {
          artifacts: 'target/junit/**/*.xml',
        },
      },
    ],
  }
);

console.log(JSON.stringify(pipeline, null, 2));
