/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback } from 'react';
import { EuiFlexGroup, EuiSpacer, EuiTitle, EuiButtonEmpty } from '@elastic/eui';
import { useExpandableFlyoutContext } from '@kbn/expandable-flyout';
import type { SummaryPanelData } from './summary_panel';
import { SummaryPanel } from './summary_panel';
import { useRightPanelContext } from '../context';
import {
  THREAT_INTELLIGENCE_HEADER_TEST_ID,
  THREAT_INTELLIGENCE_CONTENT_TEST_ID,
  THREAT_INTELLIGENCE_VIEW_ALL_BUTTON_TEST_ID,
} from './test_ids';
import { VIEW_ALL, THREAT_INTELLIGENCE_TITLE, THREAT_INTELLIGENCE_TEXT } from './translations';
import { LeftPanelKey, LeftPanelInsightsTabPath } from '../../left';

/**
 * Threat Intelligence section under Insights section, overview tab.
 */
export const ThreatIntelligenceOverview: React.FC = () => {
  const { eventId, indexName } = useRightPanelContext();
  const { openLeftPanel } = useExpandableFlyoutContext();

  const goToThreatIntelligenceTab = useCallback(() => {
    openLeftPanel({
      id: LeftPanelKey,
      path: LeftPanelInsightsTabPath,
      params: {
        id: eventId,
        indexName,
      },
    });
  }, [eventId, openLeftPanel, indexName]);

  if (!eventId) {
    return null;
  }

  const data: SummaryPanelData[] = [
    {
      icon: 'image',
      value: '10 threat matches detected',
      color: 'red',
    },
    {
      icon: 'warning',
      value: '18 fields enriched with threat intelligence',
      color: 'orange',
    },
  ];

  return (
    <>
      <EuiTitle size="xxs" data-test-subj={THREAT_INTELLIGENCE_HEADER_TEST_ID}>
        <h5>{THREAT_INTELLIGENCE_TITLE}</h5>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiFlexGroup
        data-test-subj={THREAT_INTELLIGENCE_CONTENT_TEST_ID}
        direction="column"
        gutterSize="s"
      >
        <SummaryPanel data={data} />
        <EuiButtonEmpty
          onClick={goToThreatIntelligenceTab}
          iconType="arrowStart"
          iconSide="left"
          size="s"
          data-test-subj={THREAT_INTELLIGENCE_VIEW_ALL_BUTTON_TEST_ID}
        >
          {VIEW_ALL(THREAT_INTELLIGENCE_TEXT)}
        </EuiButtonEmpty>
      </EuiFlexGroup>
    </>
  );
};

ThreatIntelligenceOverview.displayName = 'ThreatIntelligenceOverview';
