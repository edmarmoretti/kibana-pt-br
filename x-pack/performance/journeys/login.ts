/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Journey } from '@kbn/journeys';
import { subj } from '@kbn/test-subj-selector';

export const journey = new Journey({
  skipAutoLogin: true,
  scalabilitySetup: {
    journeySimulation: {
      warmup: [
        {
          action: 'constantUsersPerSec',
          userCount: 10,
          duration: '30s',
        },
        {
          action: 'rampUsersPerSec',
          minUsersCount: 10,
          maxUsersCount: 200,
          duration: '2m',
        },
      ],
      test: [
        {
          action: 'constantUsersPerSec',
          userCount: 200,
          duration: '5m',
        },
      ],
      maxDuration: '10m',
    },
    endpointSimulation: {
      warmup: [
        {
          action: 'constantUsersPerSec',
          userCount: 10,
          duration: '30s',
        },
      ],
      test: [
        {
          action: 'rampUsersPerSec',
          minUsersCount: 10,
          maxUsersCount: 700,
          duration: '7m',
        },
      ],
      maxDuration: '10m',
    },
  },
}).step('Login', async ({ page, kbnUrl, inputDelays }) => {
  await page.goto(kbnUrl.get());

  await page.type(subj('loginUsername'), 'elastic', { delay: inputDelays.TYPING });
  await page.type(subj('loginPassword'), 'changeme', { delay: inputDelays.TYPING });
  await page.click(subj('loginSubmit'), { delay: inputDelays.MOUSE_CLICK });

  await page.waitForSelector('#headerUserMenu');
});
