/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import alertFieldJSON from './alert_fields.json';

import {
  alertFieldDescriptorsFromAlertFieldSpreadsheetRows,
  AlertFieldSpreadsheetRow,
} from './schemas';

describe('alertFieldDescriptorsFromAlertFieldSpreadsheetRows', () => {
  it('it can parse a single valid record', () => {
    const validJSON = [
      {
        'Signal field(s)': '_id',
        'Alerts-as-Data Field(s)': '_id',
        'Required for all rule types': '',
        'Required for Security, Recommended for all rule types': '',
        Optional: 'Yes',
        'Proposed (beyond 7.15)': '',
        'AAD field definition': 'elasticsearch document ID of the alert document',
      },
    ];
    expect(alertFieldDescriptorsFromAlertFieldSpreadsheetRows(validJSON)).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "elasticsearch document ID of the alert document",
          "fieldOrFieldSet": "_id",
          "level": "optional",
          "signalIndexFieldOrFieldsetEquivalent": "_id",
        },
      ]
    `);
  });
  it('can parse the alert fields from json', () => {
    expect(alertFieldDescriptorsFromAlertFieldSpreadsheetRows(alertFieldJSON)).not.toBe(undefined);
  });
  /*
  it("when a field isn't required, optional, proposed, or recommended, it throws an error", () => {
    const invalidJSON = [
      {
        'Signal field(s)': '_id',
        'Alerts-as-Data Field(s)': '_id',
        'Required for all rule types': '',
        'Required for Security, Recommended for all rule types': '',
        Optional: '',
        'Proposed (beyond 7.15)': '',
        'AAD field definition': 'elasticsearch document ID of the alert document',
      },
    ];
    expect(() => alertFieldDescriptorsFromAlertFieldSpreadsheetRows(invalidJSON)).toThrowError();
  });
  it('when a field is required and optional it throws an error', () => {
    const invalidJSON = [
      {
        'Signal field(s)': '_id',
        'Alerts-as-Data Field(s)': '_id',
        'Required for all rule types': 'Yes',
        'Required for Security, Recommended for all rule types': 'Yes',
        Optional: '',
        'Proposed (beyond 7.15)': '',
        'AAD field definition': 'elasticsearch document ID of the alert document',
      },
    ];
    expect(() => alertFieldDescriptorsFromAlertFieldSpreadsheetRows(invalidJSON)).toThrowError();
  });
  */
});
