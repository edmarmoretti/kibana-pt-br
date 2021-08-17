/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as schema from './schema_lib';
import { Validator } from './schema_lib';

interface SortDefinition {
  page?: number;
  sort?: Array<{ field: 'name' | 'ip' | 'date'; direction: 'asc' | 'desc' }>;
}
describe(`a validator made using the 'schema' module which validates that a value has the type:
{
  page?: number;
  sort?: Array<{ field: 'name' | 'ip' | 'date'; direction: 'asc' | 'desc' }>;
}`, () => {
  let validator: Validator<SortDefinition>;
  beforeEach(() => {
    validator = schema.object({
      page: schema.oneOf([schema.literal(undefined), schema.number()]),
      sort: schema.oneOf([
        schema.array(
          schema.object({
            field: schema.oneOf([
              schema.literal('name' as const),
              schema.literal('ip' as const),
              schema.literal('date' as const),
            ]),
            direction: schema.oneOf([
              schema.literal('asc' as const),
              schema.literal('desc' as const),
            ]),
          })
        ),
        schema.literal(undefined),
      ]),
    });
  });
  type TestCaseDescriptor =
    | [value: unknown, valid: true]
    | [value: unknown, valid: false, expectedExplanation: string];
  const testCases: TestCaseDescriptor[] = [
    [
      {
        page: 1,
        sort: [
          {
            field: 'name',
            direction: 'asc',
          },
          {
            field: 'date',
            direction: 'desc',
          },
        ],
      },
      true,
    ],
    [
      {
        // page has the wrong type
        page: '1',
        sort: [
          {
            field: 'name',
            direction: 'asc',
          },
          {
            field: 'date',
            direction: 'desc',
          },
        ],
      },
      false,
      `Values in object were invalid. The explanations:
* Value at key page: "1" was expected to match one of several conditions, but it did not. Here are the explanations:
* "1" was expected to be undefined OR
* Expected a number, got a string: "1" `,
    ],

    [
      {
        sort: [
          {
            // missing direction
            field: 'name',
          },
        ],
      },
      false,
      '',
    ],
    [
      {
        sort: [
          {
            field: 'name',
            // invalid direction
            direction: 'invalid',
          },
        ],
      },
      false,
      '',
    ],
    [
      {
        sort: [
          {
            // missing field
            direction: 'desc',
          },
        ],
      },
      false,
      '',
    ],
    [
      {
        sort: [
          {
            // invalid field
            field: 'invalid',
            direction: 'desc',
          },
        ],
      },
      false,
      '',
    ],
    // nothing in the array
    [{ sort: [] }, true],
    // page only
    [{ page: 1 }, true],
    // empty object (valid because all keys are optional.)
    [{}, true],
    // entirely invalid types
    [null, false, 'Expected a non-null object, but got null'],
    [true, false, 'Expected a non-null object, but got true'],
    ['', false, 'Expected a non-null object, but got ""'],
  ];
  describe.each(testCases)(
    'when the value to be validated is `%j`',
    (value, expected, expectedExplanation?) => {
      it(`${expected ? 'should' : 'should NOT'} be valid`, () => {
        expect(validator(value)).toBe(expected);
      });
      if (expected) {
        it(`should not have any explanation`, () => {
          expect(validator.explanation(value)).toEqual([true, undefined]);
        });
      } else {
        it(`should have the following explanation: ${expectedExplanation}`, () => {
          const actual = validator.explanation(value);
          console.log('explanation');
          console.log(actual[1]!())
          expect([actual[0], actual[1]!()]).toEqual([false, expectedExplanation]);
        });
      }
    }
  );
});
