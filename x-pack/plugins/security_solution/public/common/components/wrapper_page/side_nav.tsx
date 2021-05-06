/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState } from 'react';
import { i18n } from '@kbn/i18n';
import { EuiIcon, EuiSideNav, EuiSideNavItemType } from '@elastic/eui';
import { SecurityPageName } from '../../../app/types';

interface NavItemProps {
  id: string;
  items?: Array<EuiSideNavItemType<NavItemProps>>;
  name: string;
  onClick?: () => void;
}

const APP_NAME = i18n.translate('xpack.securitySolution.security.title', {
  defaultMessage: 'Security',
});

export const SecuritySolutionSideNav = () => {
  const [isSideNavOpenOnMobile, setisSideNavOpenOnMobile] = useState(false);

  const toggleOpenOnMobile = () => {
    setisSideNavOpenOnMobile(!isSideNavOpenOnMobile);
  };

  const sideNav: Array<EuiSideNavItemType<NavItemProps>> = [
    {
      name: APP_NAME,
      icon: <EuiIcon type="logoSecurity" />,
      id: APP_NAME,
      items: [
        {
          name: SecurityPageName.overview,
          id: SecurityPageName.overview,
          onClick: () => {},
        },
        {
          name: SecurityPageName.detections,
          id: SecurityPageName.detections,
          onClick: () => {},
        },
        {
          name: SecurityPageName.hosts,
          id: SecurityPageName.hosts,
          onClick: () => {},
        },
        {
          name: SecurityPageName.network,
          id: SecurityPageName.network,
          onClick: () => {},
        },
        {
          name: SecurityPageName.timelines,
          id: SecurityPageName.timelines,
          onClick: () => {},
        },
        {
          name: SecurityPageName.case,
          id: SecurityPageName.case,
          onClick: () => {},
        },
        {
          name: SecurityPageName.administration,
          id: SecurityPageName.administration,
          onClick: () => {},
        },
      ],
    },
  ];

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
