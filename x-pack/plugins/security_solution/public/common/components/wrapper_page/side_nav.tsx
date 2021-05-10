/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useMemo, useState } from 'react';
import { i18n } from '@kbn/i18n';
import { EuiIcon, EuiSideNav, EuiSideNavItemType } from '@elastic/eui';
import { useLocation } from 'react-router-dom';
import {
  APP_CASES_PATH,
  APP_DETECTIONS_PATH,
  APP_HOSTS_PATH,
  APP_ID,
  APP_NAME,
  APP_NETWORK_PATH,
  APP_OVERVIEW_PATH,
  APP_TIMELINES_PATH,
  APP_MANAGEMENT_PATH,
} from '../../../../common/constants';
import { SecurityPageName } from '../../../app/types';

export const SecuritySolutionSideNav = ({ navigateToApp }) => {
  const location = useLocation();
  const activePath = location.pathname;
  console.log('PATHNAME: ', activePath); // eslint-disable-line
  const [isSideNavOpenOnMobile, setisSideNavOpenOnMobile] = useState(false);

  const toggleOpenOnMobile = () => {
    setisSideNavOpenOnMobile(!isSideNavOpenOnMobile);
  };

  const sideNav: Array<EuiSideNavItemType<unknown>> = useMemo(
    () => [
      {
        name: APP_NAME,
        icon: <EuiIcon type="logoSecurity" />,
        id: APP_ID,
        items: [
          {
            href: APP_OVERVIEW_PATH,
            id: SecurityPageName.overview,
            name: SecurityPageName.overview,
            isSelected: activePath === APP_OVERVIEW_PATH,
          },
          {
            href: APP_DETECTIONS_PATH,
            id: SecurityPageName.detections,
            name: SecurityPageName.detections,
            isSelected: activePath === APP_DETECTIONS_PATH,
          },
          {
            href: APP_HOSTS_PATH,
            id: SecurityPageName.hosts,
            name: SecurityPageName.hosts,
            isSelected: activePath === APP_HOSTS_PATH,
          },
          {
            href: APP_NETWORK_PATH,
            id: SecurityPageName.network,
            name: SecurityPageName.network,
            isSelected: activePath === APP_NETWORK_PATH,
          },
          {
            href: APP_TIMELINES_PATH,
            id: SecurityPageName.timelines,
            name: SecurityPageName.timelines,
            isSelected: activePath === APP_TIMELINES_PATH,
          },
          {
            href: APP_CASES_PATH,
            id: SecurityPageName.case,
            name: SecurityPageName.case,
            isSelected: activePath === APP_CASES_PATH,
          },
          {
            href: APP_MANAGEMENT_PATH,
            id: SecurityPageName.administration,
            name: SecurityPageName.administration,
            isSelected: activePath === APP_MANAGEMENT_PATH,
          },
        ],
      },
    ],
    [activePath]
  );

  return (
    <EuiSideNav
      aria-label="Some example here"
      mobileTitle="Navigate within security"
      toggleOpenOnMobile={() => toggleOpenOnMobile()}
      isOpenOnMobile={isSideNavOpenOnMobile}
      style={{ width: 192 }}
      items={sideNav}
    />
  );
};
