/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback, useMemo } from 'react';
import { EuiFlexGroup, EuiSpacer, EuiTitle, EuiButtonEmpty } from '@elastic/eui';
import { useExpandableFlyoutContext } from '@kbn/expandable-flyout';
import { get } from 'lodash/fp';
import type { FieldsData } from '../../../common/components/event_details/types';
import { useInvestigationTimeEnrichment } from '../../../common/containers/cti/event_enrichment';
import { useBasicDataFromDetailsData } from '../../../timelines/components/side_panel/event_details/helpers';
import {
  filterDuplicateEnrichments,
  getEnrichmentFields,
  getEnrichmentIdentifiers,
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
  const { eventId, indexName, browserFields, dataFormattedForFieldBrowser } =
    useRightPanelContext();
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

  const parsedEnrichments = allEnrichments.map((enrichment, index) => {
    const { field, type, feedName, value } = getEnrichmentIdentifiers(enrichment);
    const eventData = (dataFormattedForFieldBrowser || []).find((item) => item.field === field);
    const category = eventData?.category ?? '';
    const browserField = get([category, 'fields', field ?? ''], browserFields);

    const fieldsData: FieldsData = {
      field: field ?? '',
      format: browserField?.format ?? '',
      type: browserField?.type ?? '',
      isObjectArray: eventData?.isObjectArray ?? false,
    };

    return {
      fieldsData,
      type,
      feedName,
      index,
      field,
      browserField,
      value,
    };
  });

  console.log('parsedEnrichments', parsedEnrichments);

  if (!eventId || !dataFormattedForFieldBrowser) {
    return null;
  }

  const data: SummaryPanelData[] = [
    {
      icon: 'image',
      value: 10,
      text: 'threat matches detected',
      color: 'red',
    },
    {
      icon: 'warning',
      value: 18,
      text: 'fields enriched with threat intelligence',
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
