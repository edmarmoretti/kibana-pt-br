/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

export interface Validator<T> {
  (value: unknown): value is T;
  explanation(value: unknown): Explanation;
}
type Explanation =
  | [valid: true, explanation: undefined]
  | [valid: false, explanation: (newlinePrefix?: string) => string];
type TypeOf<V extends Validator<unknown>> = V extends Validator<infer T> ? T : never;

/**
 * Validate that `value` matches at least one of `validators`.
 * Use this to create a predicate for a union type.
 * e.g.
 * ```
 * import * as schema from './schema';
 * const isAscOrDesc: (value: unknown) => value is 'asc' | 'desc' = schema.oneOf([
 *   schema.literal('asc' as const),
 *   schema.literal('desc' as const),
 * ]);
 * ```
 */
export function oneOf<V extends Array<Validator<unknown>>>(
  validators: V
): Validator<V extends Array<Validator<infer ElementType>> ? ElementType : never> {
  validator.explanation = function (value: unknown): Explanation {
    const subExplanations: Array<(newlinePrefix?: string) => string> = [];
    for (const subValidator of validators) {
      const result = subValidator.explanation(value);
      if (result[0]) {
        return [true, undefined];
      } else {
        subExplanations.push(result[1]);
      }
    }
    return [
      false,
      (newlinePrefix: string = '') => `${JSON.stringify(
        value,
        null,
        newlinePrefix
      )} was expected to match one of several conditions, but it did not. Here are the explanations:
      ${subExplanations.map((explanation, index) => {
        return `${newlinePrefix + '\t'}* ${explanation(newlinePrefix + '\t\t')}${
          index < subExplanations.length - 1 ? ' OR' : ''
        }`;
      })}`,
    ];
  };
  return validator;
  function validator(
    value: unknown
  ): value is V extends Array<Validator<infer ElementType>> ? ElementType : never {
    for (const subValidator of validators) {
      if (subValidator(value)) {
        return true;
      }
    }
    return false;
  }
}

/**
 * Validate that `value` is an array and that each of its elements matches `elementValidator`.
 * Use this to create a predicate for an array type.
 * ```
 * import * as schema from './schema';
 * const isAscOrDesc: (value: unknown) => value is 'asc' | 'desc' = schema.oneOf([
 *   schema.literal('asc' as const),
 *   schema.literal('desc' as const),
 * ]);
 * ```
 */
export function array<V extends Validator<unknown>>(
  elementValidator: V
): Validator<Array<V extends Validator<infer ElementType> ? ElementType : never>> {
  validator.explanation = function (value: unknown): Explanation {
    // cast Array.isArray to safer type
    if ((Array.isArray as (value: unknown) => value is unknown[])(value)) {
      const explanations: Array<
        [index: number, explanation: (newlinePrefix?: string) => string]
      > = [];
      for (const [index, element] of value.entries()) {
        const result = elementValidator.explanation(element);
        if (!result[0]) {
          explanations.push([index, result[1]]);
        }
      }
      if (explanations.length) {
        return [
          false,
          (newlinePrefix: string = '') =>
            `Values in array were invalid. The explanations: ${explanations.map(
              ([index, explanation]) => {
                const prefix = ``;
                return `
${newlinePrefix}* Value at index ${index}: ${explanation(newlinePrefix + '\t')}`;
              }
            )}`,
        ];
      } else {
        return [true, undefined];
      }
    }
    return [
      false,
      (newlinePrefix: string = '') =>
        `Expected an array, received ${JSON.stringify(value, null, newlinePrefix)}`,
    ];
  };
  return validator;
  function validator(
    value: unknown
  ): value is Array<V extends Validator<infer ElementType> ? ElementType : never> {
    // This validator doesn't delegate to its explanation function because it short circuits instead.
    // cast Array.isArray to safer type
    if ((Array.isArray as (value: unknown) => value is unknown[])(value)) {
      for (const element of value) {
        const result = elementValidator(element);
        if (!result) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}

/**
 * The keys of `T` where `undefined` is assignable to the corresponding value.
 * Used to figure out which keys could be made optional.
 */
type KeysWithOptionalValues<T extends { [key: string]: unknown }> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

/**
 * `T` with required keys changed to optional if the corresponding value could be `undefined`.
 * Converts a type like `{  key: number | undefined; requiredKey: string }` to a type like `{ key?: number | undefined; requiredKey: string }`
 * This allows us to write object literals that omit a key if the value can accept `undefined`.
 */
type OptionalKeyWhenValueAcceptsUndefined<T extends { [key: string]: unknown }> = {
  [K in Exclude<keyof T, KeysWithOptionalValues<T>>]: T[K];
} &
  {
    [K in KeysWithOptionalValues<T>]?: Exclude<T[K], undefined>;
  };

/**
 * Validate that `value` is an object with string keys. The value at each key is tested against its own validator.
 *
 * Use this to create a predicate for a type like `{ a: string[] }`. For example:
 * ```ts
 * import * as schema from './schema';
 * const myValidator: (value: unknown) => value is { a: string[] } = schema.object({
 *   a: schema.array(schema.string()),
 * });
 * ```
 */
export function object<
  ValidatorDictionary extends {
    [key: string]: Validator<unknown>;
  }
>(
  validatorDictionary: ValidatorDictionary
): Validator<
  OptionalKeyWhenValueAcceptsUndefined<
    {
      [K in keyof ValidatorDictionary]: TypeOf<ValidatorDictionary[K]>;
    }
  >
> {
  valiator.explanation = function (value: unknown): Explanation {
    // This only validates non-null objects
    if (typeof value !== 'object' || value === null) {
      return [
        false,
        (newlinePrefix: string = '') =>
          `Expected a non-null object, but got ${JSON.stringify(value, null, newlinePrefix)}`,
      ];
    }

    // Rebind value as the result type so that we can interrogate it
    const trusted = value as { [K in keyof ValidatorDictionary]: TypeOf<ValidatorDictionary[K]> };

    const explanations: Array<[key: string, explanation: (newlinePrefix?: string) => string]> = [];

    // Get each validator in the validator dictionary and use it to validate the corresponding value
    for (const key of Object.keys(validatorDictionary)) {
      const result: Explanation = validatorDictionary[key].explanation(trusted[key]);
      if (!result[0]) {
        explanations.push([key, result[1]]);
      }
    }
    if (explanations.length) {
      return [
        false,
        (newlinePrefix: string = '') =>
          `Values in object were invalid. Explanations: ${explanations.map(
            ([key, explanation]) => `
${newlinePrefix + '\t'}* Value at key ${JSON.stringify(
              key,
              null,
              newlinePrefix + '\t'
            )}: ${explanation(newlinePrefix + '\t\t')} `
          )}`,
      ];
    } else {
      return [true, undefined];
    }
  };
  return valiator;
  function valiator(
    value: unknown
  ): value is /** If a key can point to `undefined`, then instead make the key optional and exclude `undefined` from the value type. */ OptionalKeyWhenValueAcceptsUndefined<
    {
      [K in keyof ValidatorDictionary]: TypeOf<ValidatorDictionary[K]>;
    }
  > {
    // This only validates non-null objects
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    // Rebind value as the result type so that we can interrogate it
    const trusted = value as { [K in keyof ValidatorDictionary]: TypeOf<ValidatorDictionary[K]> };

    // Get each validator in the validator dictionary and use it to validate the corresponding value
    for (const key of Object.keys(validatorDictionary)) {
      const validator = validatorDictionary[key];
      if (!validator(trusted[key])) {
        return false;
      }
    }
    return true;
  }
}

/**
 * Validate that `value` is strictly equal to `acceptedValue`.
 * Use this for a literal type, for example:
 * ```
 * import * as schema from './schema';
 * const isAscOrDesc: (value: unknown) => value is 'asc' | 'desc' = schema.oneOf([
 *   schema.literal('asc' as const),
 *   schema.literal('desc' as const),
 * ]);
 * ```
 */
export function literal<T>(acceptedValue: T): Validator<T> {
  function validator(value: unknown): value is T {
    return validator.explanation(value)[0];
  }

  validator.explanation = function (value: unknown): Explanation {
    return value === acceptedValue
      ? [true, undefined]
      : [
          false,
          (newlinePrefix: string = '') =>
            `${JSON.stringify(value, null, newlinePrefix)} was expected to be ${JSON.stringify(
              acceptedValue,
              null,
              newlinePrefix
            )}`,
        ];
  };

  return validator;
}

/**
 * Validate that `value` is a string.
 * NB: this is used as `string` externally via named export.
 * Usage:
 * ```
 * import * as schema from './schema';
 * const isString: (value: unknown) => value is string = schema.string();
 * ```
 */
function anyString(): Validator<string> {
  validator.explanation = function (value: unknown): Explanation {
    if (typeof value !== 'string') {
      return [
        false,
        (newlinePrefix: string = '') =>
          `Expected a string, but got a ${typeof value}: ${JSON.stringify(
            value,
            null,
            newlinePrefix
          )}.`,
      ];
    } else {
      return [true, undefined];
    }
  };
  return validator;
  function validator(value: unknown): value is string {
    return validator.explanation(value)[0];
  }
}

/**
 * Validate that `value` is a number.
 * NB: this just checks if `typeof value === 'number'`. It will return `true` for `NaN`.
 * NB: this is used as `number` externally via named export.
 * Usage:
 * ```
 * import * as schema from './schema';
 * const isNumber: (value: unknown) => value is number = schema.number();
 * ```
 */
function anyNumber(): Validator<number> {
  validator.explanation = function (value: unknown): Explanation {
    return typeof value === 'number'
      ? [true, undefined]
      : [
          false,
          (newlinePrefix: string = '') =>
            `Expected a number, got a ${typeof value}: ${JSON.stringify(
              value,
              null,
              newlinePrefix
            )}`,
        ];
  };
  return validator;
  function validator(value: unknown): value is number {
    return validator.explanation(value)[0];
  }
}

/**
 * Export `anyString` as `string`. We can't define a function named `string`.
 * Export `anyNumber` as `number`. We can't define a function named `number`.
 */
export { anyString as string, anyNumber as number };
