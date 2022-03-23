/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import readline from 'readline';
import { createReadStream } from 'fs';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { resolve } from 'path';
import { KIBANA_ROOT } from '@kbn/test';

const showFile = (x: any) => {
  process.stderr.write(`### showing file: ${x}\n`);
  const rl = readline.createInterface({ input: createReadStream(x) });
  const line$ = fromEvent(rl, 'line').pipe(takeUntil(fromEvent(rl, 'close')));
  line$.subscribe(
    (line: any) => process.stderr.write(`${line}\n`),
    (err) => process.stderr.write(err),
    () => process.stderr.write(`### showed file: ${x}\n`)
  );
};

// relativeArchivePath = 'x-pack/test/functional/fixtures/kbn_archiver/reporting/sales'
export const saveAndShow = (relativeArchivePath: string) => async (kibanaServer: any) => {
  const resolvedArchivePath = resolve(KIBANA_ROOT, relativeArchivePath);
  await kibanaServer.importExport.save(resolvedArchivePath, {
    types: [
      'search',
      'index-pattern',
      'visualization',
      'dashboard',
      'lens',
      'map',
      'graph-workspace',
      'query',
      'tag',
      'url',
      'canvas-workpad',
    ],
  });
  showFile(`${resolvedArchivePath}.json`);
};
