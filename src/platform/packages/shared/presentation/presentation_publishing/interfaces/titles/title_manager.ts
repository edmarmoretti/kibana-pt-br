/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { WithAllKeys } from '../../state_manager';
import { initializeStateManager } from '../../state_manager/state_manager';
import { StateComparators, StateManager } from '../../state_manager/types';
import { PublishesWritableDescription } from './publishes_description';
import { PublishesTitle, PublishesWritableTitle } from './publishes_title';
import { PublishesWritablePanelTitleNotes } from './publishes_panel_title_notes';
import { PublishesWritablePanelTitleSummary } from './publishes_panel_title_summary';
import { PublishesHideBorder } from './publishes_hide_border';
import { PublishesHideShadow } from './publishes_hide_shadow';
import { PublishesHideHover } from './publishes_hide_hover';

export interface SerializedTitles {
  title?: string;
  description?: string;
  hidePanelTitles?: boolean;
  titleNotes?: string;
  titleSummary?: string;
  hideBorder?: boolean;
  hideShadow?: boolean;
  hideHover?: boolean;
}

const defaultTitlesState: WithAllKeys<SerializedTitles> = {
  title: undefined,
  description: undefined,
  hidePanelTitles: undefined,
  titleNotes: undefined,
  titleSummary: undefined,
  hideBorder: undefined,
  hideShadow: undefined,
  hideHover: undefined,
};

export const titleComparators: StateComparators<SerializedTitles> = {
  title: 'referenceEquality',
  description: 'referenceEquality',
  titleNotes: 'referenceEquality',
  titleSummary: 'referenceEquality',
  hidePanelTitles: (a, b) => Boolean(a) === Boolean(b),
  hideBorder: (a, b) => Boolean(a) === Boolean(b),
  hideShadow: (a, b) => Boolean(a) === Boolean(b),
  hideHover: (a, b) => Boolean(a) === Boolean(b),
};

export const stateHasTitles = (state: unknown): state is SerializedTitles => {
  return (
    (state as SerializedTitles)?.title !== undefined ||
    (state as SerializedTitles)?.description !== undefined ||
    (state as SerializedTitles)?.titleNotes !== undefined ||
    (state as SerializedTitles)?.titleSummary !== undefined ||
    (state as SerializedTitles)?.hidePanelTitles !== undefined ||
    (state as SerializedTitles)?.hideBorder !== undefined ||
    (state as SerializedTitles)?.hideShadow !== undefined ||
    (state as SerializedTitles)?.hideHover !== undefined
  );
};

export interface TitlesApi extends PublishesWritableTitle, PublishesWritableDescription, PublishesWritablePanelTitleNotes, PublishesWritablePanelTitleSummary, PublishesHideBorder, PublishesHideShadow, PublishesHideHover {}

export const initializeTitleManager = (
  initialTitlesState: SerializedTitles
): StateManager<SerializedTitles> & {
  api: {
    hideTitle$: PublishesTitle['hideTitle$'];
    setHideTitle: PublishesWritableTitle['setHideTitle'];
  };
} => {
  const stateManager = initializeStateManager(initialTitlesState, defaultTitlesState);
  return {
    ...stateManager,
    api: {
      ...stateManager.api,
      // SerializedTitles defines hideTitles as hidePanelTitles
      // This state is persisted and this naming conflict will be resolved TBD
      // add named APIs that match interface names as a work-around
      hideTitle$: stateManager.api.hidePanelTitles$,
      setHideTitle: stateManager.api.setHidePanelTitles,
    },
  };
};
