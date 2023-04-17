/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { VFC } from 'react';
import React from 'react';
import { css } from '@emotion/react';
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiHealth, EuiPanel } from '@elastic/eui';
import { FormattedCount } from '../../../common/components/formatted_number';

export const ICON_TEST_ID = 'Icon';
export const VALUE_TEST_ID = 'Value';
export const COLOR_TEST_ID = 'Color';

export interface SummaryPanelData {
  /**
   * Icon to display on the left side of each row
   */
  icon: string;
  /**
   * Number of results/entries found
   */
  value: number;
  /**
   * Text corresponding of the number of results/entries
   */
  text: string;
  /**
   * Optional parameter for now, will be used to display a dot on the right side
   * (corresponding to some sort of severity?)
   */
  color?: string; // TODO remove optional when we have guidance on what the colors will actually be
}

export interface SummaryPanelProps {
  /**
   * Array of data to display in each row
   */
  data: SummaryPanelData[];
  /**
   *  Prefix data-test-subj because this component will be used in multiple places
   */
  ['data-test-subj']?: string;
}

/**
 * Panel showing summary information in the Threat Intelligence, Correlations, Prevalence and Results section
 * under Insights section, overview tab.
 */
export const SummaryPanel: VFC<SummaryPanelProps> = ({ data, 'data-test-subj': dataTestSubj }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const iconDataTestSubj = dataTestSubj + ICON_TEST_ID;
  const valueDataTestSubj = dataTestSubj + VALUE_TEST_ID;
  const colorDataTestSubj = dataTestSubj + COLOR_TEST_ID;

  return (
    <EuiPanel hasShadow={false} hasBorder={true} paddingSize="s">
      <EuiFlexGroup direction="column" gutterSize="none">
        {data.map((row) => (
          <EuiFlexGroup gutterSize="none" justifyContent={'spaceBetween'} alignItems={'center'}>
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                data-test-subj={iconDataTestSubj}
                aria-label={'entity-icon'}
                color="text"
                display="empty"
                iconType={row.icon}
                size="s"
              />
            </EuiFlexItem>
            <EuiFlexItem
              data-test-subj={valueDataTestSubj}
              css={css`
                word-break: break-word;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
              `}
            >
              <FormattedCount count={row.value} /> {row.text}
            </EuiFlexItem>
            {row.color && (
              <EuiFlexItem grow={false} data-test-subj={colorDataTestSubj}>
                <EuiHealth color={row.color} />
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        ))}
      </EuiFlexGroup>
    </EuiPanel>
  );
};

SummaryPanel.displayName = 'ThreatIntelligenceOverview';
