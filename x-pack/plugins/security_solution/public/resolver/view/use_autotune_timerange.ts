/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { i18n } from '@kbn/i18n';
import * as selectors from '../store/selectors';
import type { ResolverState } from '../types';
import { useKibana } from '../../common/lib/kibana';
import { useFormattedDate } from './panels/use_formatted_date';

export const useAutotuneTimerange = () => {
  const {
    services: {
      notifications: { toasts },
    },
  } = useKibana();
  const detectedBounds = useSelector((state: ResolverState) => selectors.detectedBounds(state));
  const lastResponseParameters = useSelector(
    (state: ResolverState) => state.data.tree?.lastResponse
  );

  const from = useMemo(() => {
    return detectedBounds && detectedBounds?.from
      ? detectedBounds?.from
      : lastResponseParameters?.parameters.filters.from;
  }, [detectedBounds, lastResponseParameters]);

  const to = useMemo(() => {
    return detectedBounds && detectedBounds?.to
      ? detectedBounds?.to
      : lastResponseParameters?.parameters.filters.to;
  }, [detectedBounds, lastResponseParameters]);

  const formattedFrom = useFormattedDate(from);
  const formattedTo = useFormattedDate(to);

  const toastMessage = useMemo(() => {
    return i18n.translate('xpack.securitySolution.resolver.autotuneTimerange', {
      defaultMessage:
        'No process events were found with your selected time range, however they were found using a start date of {formattedFrom} and an end date of {formattedTo}. Change the time filters in the date picker to use a different time range.',
      values: { formattedFrom, formattedTo },
    });
  }, [formattedFrom, formattedTo]);

  useEffect(() => {
    if (detectedBounds?.from || detectedBounds?.to) {
      toasts.addSuccess(toastMessage);
    }
  }, [toastMessage, toasts, detectedBounds]);
};
