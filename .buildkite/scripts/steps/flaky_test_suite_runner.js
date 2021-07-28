const { execSync } = require('child_process');

const keys = execSync('buildkite-agent meta-data keys')
  .toString()
  .split('\n')
  .filter((k) => k.startsWith('ftsr-suite/'));

const testSuites = [];
for (const key of keys) {
  if (!key) {
    continue;
  }

  const value = execSync(`buildkite-agent meta-data get '${key}'`).toString().trim();

  testSuites.push({
    key: key,
    count: parseInt(value),
  });
}

const steps = [];
const pipeline = {
  steps: steps,
};

steps.push({
  command: '.buildkite/scripts/jobs/build.sh',
  label: 'Build Kibana Distribution and Plugins',
  agents: { queue: 'bootstrap' },
  key: 'build',
});

for (const testSuite of testSuites) {
  const TEST_SUITE = testSuite.key;
  const RUN_COUNT = testSuite.count;
  const UUID = TEST_SUITE + process.env.UUID;

  const JOB_PARTS = TEST_SUITE.split('/');
  const IS_XPACK = JOB_PARTS[0] === 'xpack';
  // const JOB = JOB_PARTS.length > 1 ? JOB_PARTS[1] : JOB_PARTS[0];
  const CI_GROUP = JOB_PARTS.length > 2 ? JOB_PARTS[2] : '';

  if (RUN_COUNT < 1) {
    continue;
  }

  if (IS_XPACK) {
    steps.push({
      command: '.buildkite/scripts/xpack-cigroup.sh',
      label: `Default CI Group ${CI_GROUP}`,
      agents: { queue: 'ci-group-6' },
      artifact_paths: 'target/junit/**/*.xml',
      depends_on: 'build',
      parallelism: RUN_COUNT,
      concurrency: 10,
      concurrency_group: UUID,
    });
  } else {
    steps.push({
      command: '.buildkite/scripts/oss-cigroup.sh',
      label: `OSS CI Group ${CI_GROUP}`,
      agents: { queue: 'ci-group-6' },
      artifact_paths: 'target/junit/**/*.xml',
      depends_on: 'build',
      parallelism: RUN_COUNT,
      concurrency: 10,
      concurrency_group: UUID,
    });
  }
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
