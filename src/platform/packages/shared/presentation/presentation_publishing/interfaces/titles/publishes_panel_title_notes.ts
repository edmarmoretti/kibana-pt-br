//Edmar Moretti

import { PublishingSubject } from '../../publishing_subject';

export interface PublishesPanelTitleNotes {
  titleNotes$: PublishingSubject<string | undefined>;
  defaultTitleNotes$?: PublishingSubject<string | undefined>;
}

export function getTitleNotes(api: Partial<PublishesPanelTitleNotes>): string | undefined {
  return api.titleNotes$?.value ?? api.defaultTitleNotes$?.value;
}

export type PublishesWritablePanelTitleNotes = PublishesPanelTitleNotes & {
  setTitleNotes: (newTitle: string | undefined) => void;
};

export const apiPublishesPanelTitleNotes = (
  unknownApi: null | unknown
): unknownApi is PublishesPanelTitleNotes => {
  return Boolean(
    unknownApi &&
      (unknownApi as PublishesPanelTitleNotes)?.titleNotes$ !== undefined
  );
};

export const apiPublishesWritablePanelTitleNotes = (
  unknownApi: null | unknown
): unknownApi is PublishesWritablePanelTitleNotes => {
  return (
    apiPublishesPanelTitleNotes(unknownApi) &&
    (unknownApi as PublishesWritablePanelTitleNotes).setTitleNotes !== undefined &&
    typeof (unknownApi as PublishesWritablePanelTitleNotes).setTitleNotes === 'function' 
  );
};
