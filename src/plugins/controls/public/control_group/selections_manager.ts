/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import deepEqual from 'fast-deep-equal';
import { Filter } from '@kbn/es-query';
import { combineCompatibleChildrenApis } from '@kbn/presentation-containers';
import {
  apiPublishesFilters,
  apiPublishesTimeslice,
  PublishesFilters,
  PublishesTimeslice,
} from '@kbn/presentation-publishing';
import { ControlGroupApi } from './types';

export function initSelectionsManager(
  controlGroupApi: Pick<ControlGroupApi, 'autoApplySelections$' | 'children$' | 'untilInitialized'>
) {
  const filters$ = new BehaviorSubject<Filter[] | undefined>([]);
  const unpublishedFilters$ = new BehaviorSubject<Filter[] | undefined>([]);
  const timeslice$ = new BehaviorSubject<[number, number] | undefined>(undefined);
  const unpublishedTimeslice$ = new BehaviorSubject<[number, number] | undefined>(undefined);
  const hasUnappliedSelections$ = new BehaviorSubject(false);
  
  // Leandro Celes - Adicionando variaveis para salvar o ultimo filtro aplicado
  // TODO - Fix temporario é resetar, e nao voltar o ultimo filtro aplicado
  const lastAppliedFilters$ = new BehaviorSubject<Filter[] | undefined>([]);
  const lastAppliedTimeslice$ = new BehaviorSubject<[number, number] | undefined>(undefined);

  const subscriptions: Subscription[] = [];
  controlGroupApi.untilInitialized().then(() => {
    const initialFilters: Filter[] = [];
    let initialTimeslice: undefined | [number, number];
    Object.values(controlGroupApi.children$.value).forEach((controlApi) => {
      if (apiPublishesFilters(controlApi) && controlApi.filters$.value) {
        initialFilters.push(...controlApi.filters$.value);
      }
      if (apiPublishesTimeslice(controlApi) && controlApi.timeslice$.value) {
        initialTimeslice = controlApi.timeslice$.value;
      }
    });
    if (initialFilters.length) {
      filters$.next(initialFilters);
      unpublishedFilters$.next(initialFilters);
    }
    if (initialTimeslice) {
      timeslice$.next(initialTimeslice);
      unpublishedTimeslice$.next(initialTimeslice);
    }

    subscriptions.push(
      combineCompatibleChildrenApis<PublishesFilters, Filter[]>(
        controlGroupApi,
        'filters$',
        apiPublishesFilters,
        []
      ).subscribe((newFilters) => unpublishedFilters$.next(newFilters))
    );

    subscriptions.push(
      combineCompatibleChildrenApis<PublishesTimeslice, [number, number] | undefined>(
        controlGroupApi,
        'timeslice$',
        apiPublishesTimeslice,
        undefined,
        // flatten method
        (values) => {
          // control group should never allow multiple timeslider controls
          // return last timeslider control value
          return values.length === 0 ? undefined : values[values.length - 1];
        }
      ).subscribe((newTimeslice) => unpublishedTimeslice$.next(newTimeslice))
    );

    subscriptions.push(
      combineLatest([filters$, unpublishedFilters$, timeslice$, unpublishedTimeslice$]).subscribe(
        ([filters, unpublishedFilters, timeslice, unpublishedTimeslice]) => {
          const next =
            !deepEqual(timeslice, unpublishedTimeslice) || !deepEqual(filters, unpublishedFilters);
          if (hasUnappliedSelections$.value !== next) {
            hasUnappliedSelections$.next(next);
          }
        }
      )
    );

    subscriptions.push(
      combineLatest([
        controlGroupApi.autoApplySelections$,
        unpublishedFilters$,
        unpublishedTimeslice$,
      ]).subscribe(([autoApplySelections]) => {
        if (autoApplySelections) {
          applySelections();
        }
      })
    );
  });

  function applySelections() {
    if (!deepEqual(filters$.value, unpublishedFilters$.value)) {
      lastAppliedFilters$.next(unpublishedFilters$.value);
      filters$.next(unpublishedFilters$.value);
    }
    if (!deepEqual(timeslice$.value, unpublishedTimeslice$.value)) {
      lastAppliedTimeslice$.next(unpublishedTimeslice$.value);
      timeslice$.next(unpublishedTimeslice$.value);
    }
  }

  // Leandro Celes - Adicionando função para cancelar os filtros
  function cancelSelections() {
    Object.values(controlGroupApi.children$.value).forEach((controlApi: any) => {
      if (controlApi.resetUnsavedChanges) {
        // TODO - Fix temporario é resetar, e nao voltar o ultimo filtro aplicado
        controlApi.resetUnsavedChanges();
      }
    });

    // TODO - TODO - Ver opção reverter a alterações desde a ultima aplicação dos filtros
    // Reverter para o último estado salvo
    // filters$.next(lastAppliedFilters$.value);
    // unpublishedFilters$.next(lastAppliedFilters$.value);
    // timeslice$.next(lastAppliedTimeslice$.value);
    // unpublishedTimeslice$.next(lastAppliedTimeslice$.value);
    
    setTimeout(() => {
      applySelections();
    }, 200);
  }

  return {
    api: {
      filters$,
      timeslice$,
    },
    applySelections,
    // Leandro Celes - Adicionando função para selecionar o estado atual
    cancelSelections,
    cleanup: () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    },
    hasUnappliedSelections$,
  };
}
