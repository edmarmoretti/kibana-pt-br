/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';

import { css } from '@emotion/react';
import { EuiScreenReaderOnly, EuiText, EuiToolTip, useEuiTheme } from '@elastic/eui';

import { OptionsListStrings } from './options_list_strings';

export const OptionsListPopoverSuggestionBadge = ({ documentCount }: { documentCount: number }) => {
  const { euiTheme } = useEuiTheme();
// Edmar Moretti - remove o número que aparece em cada item da listagem de opções dos filtros
  return (
    <>
      <EuiToolTip
        content={OptionsListStrings.popover.getDocumentCountTooltip(documentCount)}
        position={'right'}
      >
        <EuiText
          size="xs"
          aria-hidden={true}
          className="eui-textNumber"
          color={euiTheme.colors.subduedText}
          data-test-subj="optionsList-document-count-badge"
          css={css`
            font-weight: ${euiTheme.font.weight.medium} !important;
          `}
        >
          {/*Edmar Moretti `${documentCount.toLocaleString()}`*/}
        </EuiText>
      </EuiToolTip>
      <EuiScreenReaderOnly>
        <div>
          {'" "'} {/* Adds a pause for the screen reader */}
          {OptionsListStrings.popover.getDocumentCountScreenReaderText(documentCount)}
        </div>
      </EuiScreenReaderOnly>
    </>
  );
};
