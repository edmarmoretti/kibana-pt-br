/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { ExpandableFlyoutContext } from '@kbn/expandable-flyout/src/context';
import { RightPanelContext } from '../context';
import {
  THREAT_INTELLIGENCE_CONTENT_TEST_ID,
  THREAT_INTELLIGENCE_HEADER_TEST_ID,
  THREAT_INTELLIGENCE_VIEW_ALL_BUTTON_TEST_ID,
} from './test_ids';
import { TestProviders } from '../../../common/mock';
import { ThreatIntelligenceOverview } from './threat_intelligence_overview';
import { LeftPanelInsightsTabPath, LeftPanelKey } from '../../left';

const panelContextValue = {
  eventId: 'event id',
  indexName: 'indexName',
} as unknown as RightPanelContext;

describe('<ThreatIntelligenceOverview />', () => {
  it('should render by default', () => {
    const { getByTestId } = render(
      <TestProviders>
        <RightPanelContext.Provider value={panelContextValue}>
          <ThreatIntelligenceOverview />
        </RightPanelContext.Provider>
      </TestProviders>
    );
    expect(getByTestId(THREAT_INTELLIGENCE_HEADER_TEST_ID)).toHaveTextContent(
      'Threat Intelligence'
    );
    expect(getByTestId(THREAT_INTELLIGENCE_CONTENT_TEST_ID)).toBeInTheDocument();
    expect(getByTestId(THREAT_INTELLIGENCE_VIEW_ALL_BUTTON_TEST_ID)).toBeInTheDocument();
  });

  it('should only render null when eventId is null', () => {
    const contextValue = {
      eventId: null,
    } as unknown as RightPanelContext;

    const { baseElement } = render(
      <TestProviders>
        <RightPanelContext.Provider value={contextValue}>
          <ThreatIntelligenceOverview />
        </RightPanelContext.Provider>
      </TestProviders>
    );

    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div />
      </body>
    `);
  });

  it('should navigate to left section Insights tab when clicking on button', () => {
    const flyoutContextValue = {
      openLeftPanel: jest.fn(),
    } as unknown as ExpandableFlyoutContext;

    const { getByTestId } = render(
      <TestProviders>
        <ExpandableFlyoutContext.Provider value={flyoutContextValue}>
          <RightPanelContext.Provider value={panelContextValue}>
            <ThreatIntelligenceOverview />
          </RightPanelContext.Provider>
        </ExpandableFlyoutContext.Provider>
      </TestProviders>
    );

    getByTestId(THREAT_INTELLIGENCE_VIEW_ALL_BUTTON_TEST_ID).click();
    expect(flyoutContextValue.openLeftPanel).toHaveBeenCalledWith({
      id: LeftPanelKey,
      path: LeftPanelInsightsTabPath,
      params: {
        id: panelContextValue.eventId,
        indexName: panelContextValue.indexName,
      },
    });
  });
});
