/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import type { Story } from '@storybook/react';
import { ExpandableFlyoutContext } from '@kbn/expandable-flyout/src/context';
import { ThreatIntelligenceOverview } from './threat_intelligence_overview';
import { RightPanelContext } from '../context';

const panelContextValue = {
  eventId: 'eventId',
  indexName: 'indexName',
} as unknown as RightPanelContext;
const flyoutContextValue = {
  openLeftPanel: () => window.alert('openLeftPanel'),
} as unknown as ExpandableFlyoutContext;

export default {
  component: ThreatIntelligenceOverview,
  title: 'Flyout/ThreatIntelligenceOverview',
};

export const Default: Story<void> = () => {
  return (
    <ExpandableFlyoutContext.Provider value={flyoutContextValue}>
      <RightPanelContext.Provider value={panelContextValue}>
        <ThreatIntelligenceOverview />
      </RightPanelContext.Provider>
    </ExpandableFlyoutContext.Provider>
  );
};
