/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback, useMemo } from 'react';
import { EuiFlexGroup, EuiSpacer, EuiTitle, EuiButtonEmpty } from '@elastic/eui';
import { useExpandableFlyoutContext } from '@kbn/expandable-flyout';
import { groupBy } from 'lodash';
import { ENRICHMENT_TYPES } from '../../../../common/cti/constants';
import { useInvestigationTimeEnrichment } from '../../../common/containers/cti/event_enrichment';
import { useBasicDataFromDetailsData } from '../../../timelines/components/side_panel/event_details/helpers';
import {
  filterDuplicateEnrichments,
  getEnrichmentFields,
  parseExistingEnrichments,
  timelineDataToEnrichment,
} from '../../../common/components/event_details/cti_details/helpers';
import type { SummaryPanelData } from './summary_panel';
import { SummaryPanel } from './summary_panel';
import { useRightPanelContext } from '../context';
import {
  THREAT_INTELLIGENCE_HEADER_TEST_ID,
  THREAT_INTELLIGENCE_CONTENT_TEST_ID,
  THREAT_INTELLIGENCE_VIEW_ALL_BUTTON_TEST_ID,
  INSIGHTS_THREAT_INTELLIGENCE_TEST_ID,
} from './test_ids';
import { VIEW_ALL, THREAT_INTELLIGENCE_TITLE, THREAT_INTELLIGENCE_TEXT } from './translations';
import { LeftPanelKey, LeftPanelInsightsTabPath } from '../../left';

/**
 * Threat Intelligence section under Insights section, overview tab.
 */
export const ThreatIntelligenceOverview: React.FC = () => {
  const { eventId, indexName, dataFormattedForFieldBrowser } = useRightPanelContext();
  const { openLeftPanel } = useExpandableFlyoutContext();
  const { isAlert } = useBasicDataFromDetailsData(dataFormattedForFieldBrowser);

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

  const eventFields = useMemo(
    () => getEnrichmentFields(dataFormattedForFieldBrowser || []),
    [dataFormattedForFieldBrowser]
  );

  const existingEnrichments = useMemo(
    () =>
      isAlert
        ? parseExistingEnrichments(dataFormattedForFieldBrowser || []).map((enrichmentData) =>
            timelineDataToEnrichment(enrichmentData)
          )
        : [],
    [dataFormattedForFieldBrowser, isAlert]
  );

  const { result: enrichmentsResponse, loading: isEnrichmentsLoading } =
    useInvestigationTimeEnrichment(eventFields);

  const allEnrichments = useMemo(() => {
    if (isEnrichmentsLoading || !enrichmentsResponse?.enrichments) {
      return existingEnrichments;
    }
    return filterDuplicateEnrichments([...existingEnrichments, ...enrichmentsResponse.enrichments]);
  }, [isEnrichmentsLoading, enrichmentsResponse, existingEnrichments]);

  if (!eventId || !dataFormattedForFieldBrowser) {
    return null;
  }

  const {
    [ENRICHMENT_TYPES.IndicatorMatchRule]: threatMatches,
    [ENRICHMENT_TYPES.InvestigationTime]: threatEnrichments,
  } = groupBy(allEnrichments, 'matched.type');

  const threatMatchesCount = (threatMatches || []).length;
  const threatEnrichmentsCount = (threatEnrichments || []).length;

  const data: SummaryPanelData[] = [
    {
      icon: 'image',
      value: threatMatchesCount,
      text: `threat match${threatMatchesCount <= 1 ? '' : 'es'} detected`,
    },
    {
      icon: 'warning',
      value: threatEnrichmentsCount,
      text: `field${threatEnrichmentsCount <= 1 ? '' : 's'} enriched with threat intelligence`,
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
        <SummaryPanel data={data} data-test-subj={INSIGHTS_THREAT_INTELLIGENCE_TEST_ID} />
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
