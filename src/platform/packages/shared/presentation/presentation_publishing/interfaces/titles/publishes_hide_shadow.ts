/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */


//Edmar Moretti - adiciona interface para poder esconder a sombra do quadro
import type { PublishingSubject } from '../../publishing_subject';

export interface PublishesHideShadow {
  hideShadow$: PublishingSubject<boolean | undefined>;
}

export type PublishesWritableHideShadow = PublishesHideShadow & {
  setHideShadow: (hideShadow: boolean | undefined) => void;
};

export const apiPublishesHideShadow = (
  unknownApi: unknown | null
): unknownApi is PublishesHideShadow =>
  Boolean(unknownApi && (unknownApi as PublishesHideShadow).hideShadow$);

export const apiPublishesWritableHideShadow = (
  unknownApi: unknown | null
): unknownApi is PublishesWritableHideShadow =>
  Boolean(
    apiPublishesHideShadow(unknownApi) && (unknownApi as PublishesWritableHideShadow).setHideShadow
  );



export function getHideShadow(api: Partial<PublishesHideShadow>): boolean | undefined {
  return api.hideShadow$?.value;
}

