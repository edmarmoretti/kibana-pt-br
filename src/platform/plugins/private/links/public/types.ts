/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */
//Edmar Moretti - This file is used to define the types for the Links embeddable plugin, which is a part of the presentation publishing framework in Kibana. It includes types for the API of the Links embeddable, as well as types for the resolved links and dashboard items that can be linked to. The types are designed to ensure type safety and consistency across the plugin's implementation.
import type {
  HasEditCapabilities,
  HasLibraryTransforms,
  HasType,
  PublishesDescription,
  PublishesPanelTitleNotes,
  PublishesPanelTitleSummary,
  PublishesTitle,
  PublishesSavedObjectId,
  PublishesUnifiedSearch,
} from '@kbn/presentation-publishing';
import type { DefaultEmbeddableApi } from '@kbn/embeddable-plugin/public';
import type { HasSerializedChildState, PresentationContainer } from '@kbn/presentation-publishing';
import type { LocatorPublic } from '@kbn/share-plugin/common';
import type { DASHBOARD_API_TYPE } from '@kbn/dashboard-plugin/public';
import type { DashboardLocatorParams } from '@kbn/dashboard-plugin/common';
import type { DashboardState } from '@kbn/dashboard-plugin/server';

import type {
  LINKS_EMBEDDABLE_TYPE,
  LinksByReferenceState,
  LinksByValueState,
  LinksEmbeddableState,
} from '../common';
import type { Link } from '../server';

export type LinksParentApi = PresentationContainer &
  HasType<typeof DASHBOARD_API_TYPE> &
  HasSerializedChildState<LinksEmbeddableState> &
  PublishesSavedObjectId &
  PublishesTitle &
  PublishesDescription &
  PublishesPanelTitleNotes &
  PublishesPanelTitleSummary &
  PublishesUnifiedSearch & {
    locator?: Pick<LocatorPublic<DashboardLocatorParams>, 'navigate' | 'getRedirectUrl'>;
  };

export type LinksApi = HasType<typeof LINKS_EMBEDDABLE_TYPE> &
  DefaultEmbeddableApi<LinksEmbeddableState> &
  HasEditCapabilities &
  HasLibraryTransforms<LinksByReferenceState, LinksByValueState>;

export type ResolvedLink = Link & {
  id: string;
  title: string;
  label?: string;
  description?: string;
  error?: Error;
  titleNotes?: string;
  titleSummary?: string;
};

export interface DashboardItem {
  id: string;
  title: DashboardState['title'];
  description?: DashboardState['description'];
  titleNotes?: string;
  titleSummary?: string;
}
