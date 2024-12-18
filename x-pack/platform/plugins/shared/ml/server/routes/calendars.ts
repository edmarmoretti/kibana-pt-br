/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ML_INTERNAL_BASE_PATH } from '../../common/constants/app';
import { wrapError } from '../client/error_wrapper';
import type { RouteInitialization } from '../types';
import { calendarSchema, calendarIdSchema, calendarIdsSchema } from './schemas/calendars_schema';
import type { Calendar, FormCalendar } from '../models/calendar';
import { CalendarManager } from '../models/calendar';
import type { MlClient } from '../lib/ml_client';

function getAllCalendars(mlClient: MlClient) {
  const cal = new CalendarManager(mlClient);
  return cal.getAllCalendars();
}

function getCalendar(mlClient: MlClient, calendarId: string) {
  const cal = new CalendarManager(mlClient);
  return cal.getCalendar(calendarId);
}

function newCalendar(mlClient: MlClient, calendar: FormCalendar) {
  const cal = new CalendarManager(mlClient);
  return cal.newCalendar(calendar);
}

function updateCalendar(mlClient: MlClient, calendarId: string, calendar: Calendar) {
  const cal = new CalendarManager(mlClient);
  return cal.updateCalendar(calendarId, calendar);
}

function deleteCalendar(mlClient: MlClient, calendarId: string) {
  const cal = new CalendarManager(mlClient);
  return cal.deleteCalendar(calendarId);
}

function getCalendarsByIds(mlClient: MlClient, calendarIds: string[]) {
  const cal = new CalendarManager(mlClient);
  return cal.getCalendarsByIds(calendarIds);
}

export function calendars({ router, routeGuard }: RouteInitialization) {
  router.versioned
    .get({
      path: `${ML_INTERNAL_BASE_PATH}/calendars`,
      access: 'internal',
      security: {
        authz: {
          requiredPrivileges: ['ml:canGetCalendars'],
        },
      },
      summary: 'Gets calendars',
      description: 'Gets calendars - size limit has been explicitly set to 10000',
    })
    .addVersion(
      {
        version: '1',
        validate: false,
      },
      routeGuard.fullLicenseAPIGuard(async ({ mlClient, response }) => {
        try {
          const resp = await getAllCalendars(mlClient);

          return response.ok({
            body: resp,
          });
        } catch (e) {
          return response.customError(wrapError(e));
        }
      })
    );

  router.versioned
    .get({
      path: `${ML_INTERNAL_BASE_PATH}/calendars/{calendarIds}`,
      access: 'internal',
      security: {
        authz: {
          requiredPrivileges: ['ml:canGetCalendars'],
        },
      },
      summary: 'Gets a calendar',
      description: 'Gets a calendar by id',
    })
    .addVersion(
      {
        version: '1',
        validate: {
          request: {
            params: calendarIdsSchema,
          },
        },
      },
      routeGuard.fullLicenseAPIGuard(async ({ mlClient, request, response }) => {
        let returnValue;
        try {
          const calendarIds = request.params.calendarIds.split(',');

          if (calendarIds.length === 1) {
            returnValue = await getCalendar(mlClient, calendarIds[0]);
          } else {
            returnValue = await getCalendarsByIds(mlClient, calendarIds);
          }

          return response.ok({
            body: returnValue,
          });
        } catch (e) {
          return response.customError(wrapError(e));
        }
      })
    );

  router.versioned
    .put({
      path: `${ML_INTERNAL_BASE_PATH}/calendars`,
      access: 'internal',
      security: {
        authz: {
          requiredPrivileges: ['ml:canCreateCalendar'],
        },
      },
      summary: 'Creates a calendar',
      description: 'Creates a calendar',
    })
    .addVersion(
      {
        version: '1',
        validate: {
          request: {
            body: calendarSchema,
          },
        },
      },
      routeGuard.fullLicenseAPIGuard(async ({ mlClient, request, response }) => {
        try {
          const body = request.body;
          // @ts-expect-error event interface incorrect
          const resp = await newCalendar(mlClient, body);

          return response.ok({
            body: resp,
          });
        } catch (e) {
          return response.customError(wrapError(e));
        }
      })
    );

  router.versioned
    .put({
      path: `${ML_INTERNAL_BASE_PATH}/calendars/{calendarId}`,
      access: 'internal',
      security: {
        authz: {
          requiredPrivileges: ['ml:canCreateCalendar'],
        },
      },
      summary: 'Updates a calendar',
      description: 'Updates a calendar',
    })
    .addVersion(
      {
        version: '1',
        validate: {
          request: {
            params: calendarIdSchema,
            body: calendarSchema,
          },
        },
      },
      routeGuard.fullLicenseAPIGuard(async ({ mlClient, request, response }) => {
        try {
          const { calendarId } = request.params;
          const body = request.body;
          // @ts-expect-error event interface incorrect
          const resp = await updateCalendar(mlClient, calendarId, body);

          return response.ok({
            body: resp,
          });
        } catch (e) {
          return response.customError(wrapError(e));
        }
      })
    );

  router.versioned
    .delete({
      path: `${ML_INTERNAL_BASE_PATH}/calendars/{calendarId}`,
      access: 'internal',
      security: {
        authz: {
          requiredPrivileges: ['ml:canDeleteCalendar'],
        },
      },
      summary: 'Deletes a calendar',
      description: 'Deletes a calendar',
    })
    .addVersion(
      {
        version: '1',
        validate: {
          request: {
            params: calendarIdSchema,
          },
        },
      },
      routeGuard.fullLicenseAPIGuard(async ({ mlClient, request, response }) => {
        try {
          const { calendarId } = request.params;
          const resp = await deleteCalendar(mlClient, calendarId);

          return response.ok({
            body: resp,
          });
        } catch (e) {
          return response.customError(wrapError(e));
        }
      })
    );
}
