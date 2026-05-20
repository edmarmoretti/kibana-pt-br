/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */
//Edmar Moretti - This file is a copy of src/plugins/links/public/mocks.ts, but with the necessary adjustments to remove the dependency on the dashboard plugin. This is needed to avoid circular dependencies between the links and dashboard plugins, as the links embeddable is used in the dashboard plugin. Once we have a better solution for this, we can remove this file and use the original one instead.
import { coreMock } from '@kbn/core/public/mocks';
import { dashboardPluginMock } from '@kbn/dashboard-plugin/public/mocks';
import { embeddablePluginMock } from '@kbn/embeddable-plugin/public/mocks';
import { contentManagementMock } from '@kbn/content-management-plugin/public/mocks';
import { presentationUtilPluginMock } from '@kbn/presentation-util-plugin/public/mocks';
import { uiActionsPluginMock } from '@kbn/ui-actions-plugin/public/mocks';
import { BehaviorSubject } from 'rxjs';
import { getMockPresentationContainer } from '@kbn/presentation-publishing/interfaces/containers/mocks';
import type { AggregateQuery, Filter, Query, TimeRange } from '@kbn/es-query';
import { setKibanaServices } from './services/kibana_services';
import type { LinksParentApi } from './types';
import type { LinksEmbeddableState } from '../common';

export const setStubKibanaServices = () => {
  const mockCore = coreMock.createStart();

  const core = {
    ...mockCore,
    application: {
      ...mockCore.application,
      capabilities: {
        ...mockCore.application.capabilities,
        visualize: {
          save: true,
        },
      },
    },
  };

  setKibanaServices(core, {
    dashboard: dashboardPluginMock.createStartContract(),
    embeddable: embeddablePluginMock.createStartContract(),
    contentManagement: contentManagementMock.createStartContract(),
    presentationUtil: presentationUtilPluginMock.createStartContract(),
    uiActions: uiActionsPluginMock.createStartContract(),
  });
};

export const getMockLinksParentApi = (state: LinksEmbeddableState): LinksParentApi => ({
  const titleNotes$ = new BehaviorSubject<string | undefined>(serializedState.titleNotes);
  const titleSummary$ = new BehaviorSubject<string | undefined>(serializedState.titleSummary);

  ...getMockPresentationContainer(),
  type: 'dashboard',
  filters$: new BehaviorSubject<Filter[] | undefined>(undefined),
  query$: new BehaviorSubject<Query | AggregateQuery | undefined>(undefined),
  timeRange$: new BehaviorSubject<TimeRange | undefined>({
    from: 'now-15m',
    to: 'now',
  }),
  timeslice$: new BehaviorSubject<[number, number] | undefined>(undefined),
  savedObjectId$: new BehaviorSubject<string | undefined>('999'),
  hideTitle$: new BehaviorSubject<boolean | undefined>(false),
  title$: new BehaviorSubject<string | undefined>('My Dashboard'),
  description$: new BehaviorSubject<string | undefined>(''),
  titleNotes$: new BehaviorSubject<string | undefined>(''),
  titleSummary$: new BehaviorSubject<string | undefined>(''),
  getSerializedStateForChild: () => state,
});
