/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { PublishingSubject, useStateFromPublishingSubject } from '../publishing_subject';

export interface PublishesPanelTitleNotes {
  panelTitleNotes: PublishingSubject<string | undefined>;
  defaultPanelTitleNotes?: PublishingSubject<string | undefined>;
}

export type PublishesWritablePanelTitleNotes = PublishesPanelTitleNotes & {
  setPanelTitleNotes: (newTitle: string | undefined) => void;
};

export const apiPublishesPanelTitleNotes = (
  unknownApi: null | unknown
): unknownApi is PublishesPanelTitleNotes => {
  return Boolean(
    unknownApi && (unknownApi as PublishesPanelTitleNotes)?.panelTitleNotes !== undefined
  );
};

export const apiPublishesWritablePanelTitleNotes = (
  unknownApi: null | unknown
): unknownApi is PublishesWritablePanelTitleNotes => {
  return (
    apiPublishesPanelTitleNotes(unknownApi) &&
    (unknownApi as PublishesWritablePanelTitleNotes).setPanelTitleNotes !== undefined &&
    typeof (unknownApi as PublishesWritablePanelTitleNotes).setPanelTitleNotes === 'function'
  );
};

/**
 * A hook that gets this API's panel description as a reactive variable which will cause re-renders on change.
 */
export const usePanelTitleNotes = (api: Partial<PublishesPanelTitleNotes> | undefined) =>
  useStateFromPublishingSubject(api?.panelTitleNotes);

/**
 * A hook that gets this API's default panel description as a reactive variable which will cause re-renders on change.
 */
export const useDefaultPanelTitleNotes = (api: Partial<PublishesPanelTitleNotes> | undefined) =>
  useStateFromPublishingSubject(api?.defaultPanelTitleNotes);
