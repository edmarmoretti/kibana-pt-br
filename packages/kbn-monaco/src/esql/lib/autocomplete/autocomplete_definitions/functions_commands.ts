/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { i18n } from '@kbn/i18n';
import { buildDocumentation } from './utils';

import type { AutocompleteCommandDefinition } from '../types';

export const mathCommandDefinition: AutocompleteCommandDefinition[] = [
  {
    label: 'round',
    insertText: 'round',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.roundDoc', {
      defaultMessage:
        'Returns a number rounded to the decimal, specified by he closest integer value. The default is to round to an integer.',
    }),
    documentation: {
      value: buildDocumentation('round(grouped[T]): aggregated[T]', [
        'from index where field="value" | eval rounded = round(field)',
      ]),
    },
    sortText: 'C',
  },
  {
    label: 'abs',
    insertText: 'abs',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.absDoc', {
      defaultMessage: 'Returns the absolute value.',
    }),
    documentation: {
      value: buildDocumentation('abs(grouped[T]): aggregated[T]', [
        'from index where field="value" | eval abs_value = abs(field)',
      ]),
    },
    sortText: 'C',
  },
  {
    label: 'concat',
    insertText: 'concat',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.concatDoc', {
      defaultMessage: 'Concatenates two or more strings.',
    }),
    documentation: {
      value: buildDocumentation('concat(grouped[T]): aggregated[T]', [
        'from index where field="value" | eval concatenated = concat(field1, "-", field2)',
      ]),
    },
    sortText: 'C',
  },
  {
    label: 'substring',
    insertText: 'substring',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.substringDoc', {
      defaultMessage:
        'Returns a substring of a string, specified by a start position and an optional length. This example returns the first three characters of every last name.',
    }),
    documentation: {
      value: buildDocumentation('substring(grouped[T]): aggregated[T]', [
        'from index where field="value" | eval new_string = substring(field, 1, 3)',
      ]),
    },
    sortText: 'C',
  },
  {
    label: 'starts_with',
    insertText: 'starts_with',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.startsWithDoc', {
      defaultMessage:
        'Returns a boolean that indicates whether a keyword string starts with another string.',
    }),
    documentation: {
      value: buildDocumentation('substring(grouped[T]): aggregated[T]', [
        'from index where field="value" | eval new_string = starts_with(field, "a")',
      ]),
    },
    sortText: 'C',
  },
  {
    label: 'date_format',
    insertText: 'date_format',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.dateFormatDoc', {
      defaultMessage: `Returns a string representation of a date in the provided format. If no format is specified, the "yyyy-MM-dd'T'HH:mm:ss.SSSZ" format is used.`,
    }),
    documentation: {
      value: buildDocumentation('substring(grouped[T]): aggregated[T]', [
        'from index where field="value" | eval hired = date_format(hire_date, "YYYY-MM-dd")',
      ]),
    },
    sortText: 'C',
  },
  {
    label: 'date_trunc',
    insertText: 'date_trunc',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.dateFormatDoc', {
      defaultMessage: `Rounds down a date to the closest interval.`,
    }),
    documentation: {
      value: buildDocumentation('substring(grouped[T]): aggregated[T]', [
        'from index where field="value" | eval year_hired = DATE_TRUNC(hire_date, 1 year)',
      ]),
    },
    sortText: 'C',
  },
];

export const aggregationFunctionsDefinitions: AutocompleteCommandDefinition[] = [
  {
    label: 'avg',
    insertText: 'avg',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.avgDoc', {
      defaultMessage: 'Returns the average of the values in a field',
    }),
    documentation: {
      value: buildDocumentation('avg(grouped[T]): aggregated[T]', [
        'from index | stats average = avg(field)',
      ]),
    },
    sortText: 'C',
  },
  {
    label: 'max',
    insertText: 'max',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.maxDoc', {
      defaultMessage: 'Returns the maximum value in a field.',
    }),
    documentation: {
      value: buildDocumentation('max(grouped[T]): aggregated[T]', [
        'from index | stats max = max(field)',
      ]),
    },
    sortText: 'C',
  },
  {
    label: 'min',
    insertText: 'min',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.minDoc', {
      defaultMessage: 'Returns the minimum value in a field.',
    }),
    documentation: {
      value: buildDocumentation('min(grouped[T]): aggregated[T]', [
        'from index | stats min = min(field)',
      ]),
    },
    sortText: 'C',
  },
  {
    label: 'sum',
    insertText: 'sum',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.sumDoc', {
      defaultMessage: 'Returns the sum of the values in a field.',
    }),
    documentation: {
      value: buildDocumentation('sum(grouped[T]): aggregated[T]', [
        'from index | stats sum = sum(field)',
      ]),
    },
    sortText: 'C',
  },
  {
    label: 'count',
    insertText: 'count',
    kind: 1,
    detail: i18n.translate('monaco.esql.autocomplete.countDoc', {
      defaultMessage: 'Returns the count of the values in a field.',
    }),
    documentation: {
      value: buildDocumentation('count(grouped[T]): aggregated[T]', [
        'from index | stats count = count(field)',
      ]),
    },
    sortText: 'C',
  },
];
