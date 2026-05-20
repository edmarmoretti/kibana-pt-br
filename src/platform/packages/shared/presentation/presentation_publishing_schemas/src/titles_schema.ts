/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { schema } from '@kbn/config-schema';
//Edmar Moretti - 2024-06-17: This file defines the schema for serialized titles used in presentation publishing. It includes fields for title, description, hide_title, hide_border, titleNotes, and titleSummary. Each field is optional and can be of type string or boolean as appropriate.
export const serializedTitlesSchema = schema.object({
  description: schema.maybe(schema.string()),
  hide_title: schema.maybe(schema.boolean()),
  title: schema.maybe(schema.string()),
  hide_border: schema.maybe(schema.boolean()),
  titleNotes: schema.maybe(schema.string()),
  titleSummary: schema.maybe(schema.string()),
});
