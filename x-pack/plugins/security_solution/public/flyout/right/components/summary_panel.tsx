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
import { ENTITY_PANEL_ICON_TEST_ID } from './test_ids';

export interface SummaryPanelData {
  /**
   *
   */
  icon: string;
  /**
   *
   */
  value: string;
  /**
   *
   */
  color: string;
}

export interface SummaryPanelProps {
  /**
   *
   */
  data: SummaryPanelData[];
}

/**
 * Panel showing summary information in the Threat Intelligence, Correlations, Prevalence and Results section
 * under Insights section, overview tab.
 */
export const SummaryPanel: VFC<SummaryPanelProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <EuiPanel hasShadow={false} hasBorder={true} paddingSize="s">
      <EuiFlexGroup direction="column" gutterSize="none">
        {data.map((row) => (
          <EuiFlexGroup gutterSize="none" justifyContent={'spaceBetween'} alignItems={'center'}>
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                data-test-subj={ENTITY_PANEL_ICON_TEST_ID}
                aria-label={'entity-icon'}
                color="text"
                display="empty"
                iconType={row.icon}
                size="s"
              />
            </EuiFlexItem>
            <EuiFlexItem
              css={css`
                word-break: break-word;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
              `}
            >
              {row.value}
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiHealth color={row.color} />
            </EuiFlexItem>
          </EuiFlexGroup>
        ))}
      </EuiFlexGroup>
    </EuiPanel>
  );
};

SummaryPanel.displayName = 'ThreatIntelligenceOverview';
