//Edmar Moretti

import { PublishingSubject } from '../../publishing_subject';

export interface PublishesPanelTitleSummary {
  panelTitleSummary$: PublishingSubject<string | undefined>;
  defaultPanelTitleSummary$?: PublishingSubject<string | undefined>;
}

export function getPanelTitleSummary(api: Partial<PublishesPanelTitleSummary>): string | undefined {
  return api.panelTitleSummary$?.value ?? api.defaultPanelTitleSummary$?.value;
}

export type PublishesWritablePanelTitleSummary = PublishesPanelTitleSummary & {
  setPanelTitleSummary: (newTitle: string | undefined) => void;
};

export const apiPublishesPanelTitleSummary = (unknownApi: null | unknown): unknownApi is PublishesPanelTitleSummary => {
  return Boolean(
    unknownApi &&
      (unknownApi as PublishesPanelTitleSummary)?.panelTitleSummary$ !== undefined
  );
};

export const apiPublishesWritablePanelTitleSummary = (
  unknownApi: null | unknown
): unknownApi is PublishesWritablePanelTitleSummary => {
  return (
    apiPublishesPanelTitleSummary(unknownApi) &&
    (unknownApi as PublishesWritablePanelTitleSummary).setPanelTitleSummary !== undefined &&
    typeof (unknownApi as PublishesWritablePanelTitleSummary).setPanelTitleSummary === 'function' 
  );
};
