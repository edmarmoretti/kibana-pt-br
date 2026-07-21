/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */
//Edmar Moretti - formulário htmlbar para o campo de índice
import React, { Fragment } from 'react';

import { EuiFormRow, EuiSelect } from '@elastic/eui';

import { FormattedMessage } from '@kbn/i18n-react';
import { HtmlbarFormat } from '@kbn/field-formats-plugin/common';
import { DefaultFormatEditor, defaultState } from '../default/default';

import { formatId } from './constants';

export interface HtmlbarFormatEditorFormatParams {
  transform: string;
}

export class HtmlbarFormatEditor extends DefaultFormatEditor<HtmlbarFormatEditorFormatParams> {
  static formatId = formatId;
  state = {
    ...defaultState,
    sampleInputs: [
      'A Quick Brown Fox.',
      'STAY CALM!',
      'com.organizations.project.ClassName',
      'hostname.net',
      'SGVsbG8gd29ybGQ=',
      '%EC%95%88%EB%85%95%20%ED%82%A4%EB%B0%94%EB%82%98',
    ],
  };

  render() {
    const { formatParams, format } = this.props;
    const { error } = this.state;

    return (
      <Fragment>
        <EuiFormRow
          label={
            <FormattedMessage
              id="indexPatternFieldEditor.htmlbar.transformLabel"
              defaultMessage="Gráfico de barras HTML"
            />
          }
          isInvalid={!!error}
          error={error}
        >
          <EuiSelect
            data-test-subj="htmlbarEditorTransform"
            defaultValue={formatParams.transform}
            options={((format.type as typeof HtmlbarFormat).transformOptions || []).map((option: any) => {
              return {
                value: option.kind,
                text: option.text,
              };
            })}
            onChange={(e) => {
              this.onChange({ transform: e.target.value });
            }}
            isInvalid={!!error}
          />
        </EuiFormRow>
      </Fragment>
    );
  }
}
