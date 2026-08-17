/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import ReactDOM from 'react-dom/server';
import { i18n } from '@kbn/i18n';
import { KBN_FIELD_TYPES } from '@kbn/field-types';
import { FieldFormat } from '../field_format';
import { FIELD_FORMAT_IDS, HtmlContextTypeConvert } from '../types';
//Edmar Moretti - substituição de (empty) por ''
const emptyLabel = i18n.translate('fieldFormats.string.emptyLabel', {
  defaultMessage: ' ',
});

// Edmar Moretti - estilo do gráfico de barras
/** @public */
export class HtmlbarFormat extends FieldFormat {
  static id = FIELD_FORMAT_IDS.HTMLBAR;
  static title = 'HTML Bar';
  static fieldType = [KBN_FIELD_TYPES.STRING, KBN_FIELD_TYPES.NUMBER];


  htmlConvert: HtmlContextTypeConvert = (val: string | number, { hit, field } = {}) => {
    if (val === '') {
      return `<span class="ffString__emptyValue">${emptyLabel}</span>`;
    }


    return ReactDOM.renderToStaticMarkup(
      React.createElement(
        'div',
        {
          style: {
            width: '100%',
            height: '12px',
            backgroundColor: '#e0e4ea',
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            borderTopRightRadius: '999px',
            borderBottomRightRadius: '999px',
            overflow: 'hidden'
          }
        },
        React.createElement('div', {
          style: {
            width: `${val}%`,
            height: '100%',
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            borderTopRightRadius: '999px',
            borderBottomRightRadius: '999px',
            background: `
              repeating-linear-gradient(
                90deg,
                #8a8f98 0px,
                #8a8f98 8px,
                #b0b5bd 8px,
                #b0b5bd 10px
              )
            `
          }
        })
      )
    );
  };
};


