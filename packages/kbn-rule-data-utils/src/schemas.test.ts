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

alertFieldDescriptorsFromAlertFieldSpreadsheetRows(alertFieldJSON);

describe('alertFieldDescriptorsFromAlertFieldSpreadsheetRows', () => {
  it('can parse the alert fields from json', () => {
    expect(alertFieldDescriptorsFromAlertFieldSpreadsheetRows(alertFieldJSON)).toMatchSnapshot();
  });
  type FailureCaseDescriptor = [
    /** the input is passed to alertFieldDescriptorsFromAlertFieldSpreadsheetRows */
    input: Array<Record<string, unknown>>,
    /** This string is used to match against error that's thrown.
     */
    expectedError: string
  ];
  const failureCases: FailureCaseDescriptor[] = [
    [[/** by passing an empty object, we should get an error */ {}], `Values in array were invalid. The explanations:
* Value at index 0: Values in object were invalid. Explanations:
* Value at key "Signal field(s)": Expected a string, but got a undefined: undefined. ,
* Value at key "Alerts-as-Data Field(s)": Expected a string, but got a undefined: undefined. ,
* Value at key "Required for all rule types": undefined was expected to match one of several conditions, but it did not. Here are the explanations:
* undefined was expected to be "" OR,
* undefined was expected to be "yes" OR,
* undefined was expected to be "Yes" ,
* Value at key "Required for Security, Recommended for all rule types": undefined was expected to match one of several conditions, but it did not. Here are the explanations:
* undefined was expected to be "" OR,
* undefined was expected to be "yes" OR,
* undefined was expected to be "Yes" ,
* Value at key "Optional": undefined was expected to match one of several conditions, but it did not. Here are the explanations:
* undefined was expected to be "" OR,
* undefined was expected to be "yes" OR,
* undefined was expected to be "Yes" ,
* Value at key "Proposed (beyond 7.15)": undefined was expected to match one of several conditions, but it did not. Here are the explanations:
* undefined was expected to be "" OR,
* undefined was expected to be "yes" OR,
* undefined was expected to be "Yes" ,
* Value at key "AAD field definition": Expected a string, but got a undefined: undefined.`],
  ];
  describe.each(failureCases)(
    'when alertFieldDescriptorsFromAlertFieldSpreadsheetRows is called with %p',
    function (input: FailureCaseDescriptor[0], expectedError: FailureCaseDescriptor[1]) {
      it(`should throw an error with: ${expectedError}.`, () => {
        // casing `input`, as it really isn't the correct type
        expect(
          alertFieldDescriptorsFromAlertFieldSpreadsheetRows(input as AlertFieldSpreadsheetRow[])
        ).toThrowError(expectedError);
      });
    }
  );
});
