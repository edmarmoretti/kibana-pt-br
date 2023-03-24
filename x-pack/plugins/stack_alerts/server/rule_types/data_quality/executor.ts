/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { CoreSetup } from '@kbn/core/server';
import { ExecutorOptions } from './types';
import { EsQueryRuleParams } from './rule_type_params';

export async function executor(core: CoreSetup, options: ExecutorOptions<EsQueryRuleParams>) {
  const { state } = options;
  const latestTimestamp: string | undefined = tryToParseAsDate(state.latestTimestamp);

  // eslint-disable-next-line no-console
  console.log('data quality rule executed', JSON.stringify(options));

  return { state: { latestTimestamp } };
}

export function tryToParseAsDate(sortValue?: string | number | null): undefined | string {
  const sortDate = typeof sortValue === 'string' ? Date.parse(sortValue) : sortValue;
  if (sortDate && !isNaN(sortDate)) {
    return new Date(sortDate).toISOString();
  }
}
