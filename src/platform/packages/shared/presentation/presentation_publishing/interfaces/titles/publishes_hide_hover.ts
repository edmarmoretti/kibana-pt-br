/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */


//Edmar Moretti - adiciona interface para poder desativar o hover sobre os painéis
import type { PublishingSubject } from '../../publishing_subject';

export interface PublishesHideHover {
  hideHover$: PublishingSubject<boolean | undefined>;
}

export type PublishesWritableHideHover = PublishesHideHover & {
  setHideHover: (hideHover: boolean | undefined) => void;
};

export const apiPublishesHideHover = (
  unknownApi: unknown | null
): unknownApi is PublishesHideHover =>
  Boolean(unknownApi && (unknownApi as PublishesHideHover).hideHover$);

export const apiPublishesWritableHideHover = (
  unknownApi: unknown | null
): unknownApi is PublishesWritableHideHover =>
  Boolean(
    apiPublishesHideHover(unknownApi) && (unknownApi as PublishesWritableHideHover).setHideHover
  );



export function getHideHover(api: Partial<PublishesHideHover>): boolean | undefined {
  return api.hideHover$?.value;
}

