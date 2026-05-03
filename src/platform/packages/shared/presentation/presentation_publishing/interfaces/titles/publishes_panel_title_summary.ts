//Edmar Moretti

import { PublishingSubject } from '../../publishing_subject';

export interface PublishesPanelTitleSummary {
  titleSummary$: PublishingSubject<string | undefined>;
  defaultTitleSummary$?: PublishingSubject<string | undefined>;
}

export function getTitleSummary(api: Partial<PublishesPanelTitleSummary>): string | undefined {
  return api.titleSummary$?.value ?? api.defaultTitleSummary$?.value;
}

export type PublishesWritablePanelTitleSummary = PublishesPanelTitleSummary & {
  setTitleSummary: (newTitle: string | undefined) => void;
};

export const apiPublishesPanelTitleSummary = (unknownApi: null | unknown): unknownApi is PublishesPanelTitleSummary => {
  return Boolean(
    unknownApi &&
      (unknownApi as PublishesPanelTitleSummary)?.titleSummary$ !== undefined
  );
};

export const apiPublishesWritablePanelTitleSummary = (
  unknownApi: null | unknown
): unknownApi is PublishesWritablePanelTitleSummary => {
  return (
    apiPublishesPanelTitleSummary(unknownApi) &&
    (unknownApi as PublishesWritablePanelTitleSummary).setTitleSummary !== undefined &&
    typeof (unknownApi as PublishesWritablePanelTitleSummary).setTitleSummary === 'function' 
  );
};
