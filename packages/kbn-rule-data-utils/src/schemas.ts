/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import * as schemaLib from './schema_lib';

/**
 * This file defines alert fields and rule fields in a declarative format. These are used to generate runtime schemas. These schemas can validate the structure of objects at runtime. This can be used to enforce compliance with the schema in various parts of our code. These declarations can also be used to create Typescript types that can be used to assist in coding against the schema. The types can also assist in statically enforcing schema compliance.
 *
 * These schemas don't seek to prevent incorrect fields from being used. At this time, they focus on ensuring that required fields are present.
 * Later versions will seek to prevent incorrect fields from being used.
 *
 * This file refers to a spreadsheet. This is because the current schema lives in a spreadsheet and this document represents an attempt to port that data into json format.
 **/

/**
 * TODO: make sure that a fieldset and a field don't conflict.
 */

/** A normalized form of the data in a row from the spreadsheet.  */
interface AlertFieldDescriptor {
  /** The name of the equivalent field (or fieldset) in the Security .signal index */
  signalIndexFieldOrFieldsetEquivalent?: string | undefined;
  /** The name of the field or fieldset */
  fieldOrFieldSet: string;
  /** The 'status' determines if the field is required, recommended, optional, or proposed.
   * Required means: Required for all rule types
   * Recommended means: Required for Security, Recommended for all rule types
   * Proposed means: that the field has been proposed but isn't implemented yet
   * Optional is the default.
   */
  level: 'required' | 'recommended' | 'optional' | 'proposed';
  /** A mutliline English description of the field. */
  description?: string | undefined;
}

/** This describes the json format of a row from the alert fields spreadsheet found at: https://docs.google.com/spreadsheets/d/1Cqv0bRx1BgY6VP9PY4FK6kppUEZJ5qMPoFgr5_XQXJI/edit#gid=1775019155 */
export interface AlertFieldSpreadsheetRow {
  'Signal field(s)': string;
  'Alerts-as-Data Field(s)': string;
  'Required for all rule types': string;
  'Required for Security, Recommended for all rule types': string;
  Optional: string;
  'Proposed (beyond 7.15)': string;
  'AAD field definition': string;
  // other stuff isn't important
  [key: string]: string | number;
}

/**
 * Takes an array of row data and returns an array of validated and normalized AlertFieldSpreadsheetRows
 */
export function alertFieldDescriptorsFromAlertFieldSpreadsheetRows(
  dataFromCVS: AlertFieldSpreadsheetRow[]
): AlertFieldDescriptor[] {
  // validate the data before we work on it
  if (isCurrentCSVFormat(dataFromCVS)) {
    const descriptors: AlertFieldDescriptor[] = [];

    for (const descriptor of dataFromCVS) {
      const required = descriptor['Required for all rule types'];
      const recommended = descriptor['Required for Security, Recommended for all rule types'];
      const optional = descriptor.Optional;
      const proposed = descriptor['Proposed (beyond 7.15)'];

      const fieldOrFieldSet = descriptor['Alerts-as-Data Field(s)'];

      if (fieldOrFieldSet === 'None') {
        // Omit anything with a field of 'None'
        continue;
      }

      if (!fieldOrFieldSet) {
        throw new Error(`missing Alerts-as-Data Field(s)`);
      }
      const level = required
        ? 'required'
        : recommended
        ? 'recommended'
        : proposed
        ? 'proposed'
        : optional
        ? 'optional'
        : undefined;

      if (!level) {
        throw new Error(`missing one of:
* Required for all rule types
* Required for Security, Recommended for all rule types
* Optional
* Proposed (beyond 7.15)

in:
${JSON.stringify(descriptor)}
`);
      }

      const description = descriptor['AAD field definition'];
      const signalIndexFieldOrFieldsetEquivalent = descriptor['Signal field(s)'];

      descriptors.push({
        signalIndexFieldOrFieldsetEquivalent: signalIndexFieldOrFieldsetEquivalent
          ? signalIndexFieldOrFieldsetEquivalent
          : undefined,
        fieldOrFieldSet,
        level,
        // replace '' with undefined
        description: description ? description : undefined,
      });
    }
    return descriptors;
  } else {
    throw new Error('invalid data');
  }
}

/** TODO, consider replacing these schemas with a more Kibana idiomatic library */
/** A schema that validates that a value is one of: '', 'Yes', or 'yes' */
const yesOrEmpty = schemaLib.oneOf([
  schemaLib.literal(''),
  schemaLib.literal('yes'),
  schemaLib.literal('Yes'),
]);

/** this is used to validate that the data from the CSV matches the expectations of this code.
 * if this fails, that means the structure of the CSV has changed, but this file hasn't been updated.
 */
const isCurrentCSVFormat = schemaLib.array(
  schemaLib.object({
    'Signal field(s)': schemaLib.string(),
    'Alerts-as-Data Field(s)': schemaLib.string(),
    'Required for all rule types': yesOrEmpty,
    'Required for Security, Recommended for all rule types': yesOrEmpty,
    Optional: yesOrEmpty,
    'Proposed (beyond 7.15)': yesOrEmpty,
    'AAD field definition': schemaLib.string(),
  })
);
