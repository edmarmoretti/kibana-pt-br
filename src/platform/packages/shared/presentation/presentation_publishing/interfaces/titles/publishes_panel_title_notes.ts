//Edmar Moretti

import { PublishingSubject } from '../../publishing_subject';

export interface PublishesPanelTitleNotes {
  panelTitleNotes$: PublishingSubject<string | undefined>;
  defaultPanelTitleNotes$?: PublishingSubject<string | undefined>;
}

export function getPanelTitleNotes(api: Partial<PublishesPanelTitleNotes>): string | undefined {
  return api.panelTitleNotes$?.value ?? api.defaultPanelTitleNotes$?.value;
}

export type PublishesWritablePanelTitleNotes = PublishesPanelTitleNotes & {
  setPanelTitleNotes: (newTitle: string | undefined) => void;
};

export const apiPublishesPanelTitleNotes = (
  unknownApi: null | unknown
): unknownApi is PublishesPanelTitleNotes => {
  return Boolean(
    unknownApi &&
      (unknownApi as PublishesPanelTitleNotes)?.panelTitleNotes$ !== undefined
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
