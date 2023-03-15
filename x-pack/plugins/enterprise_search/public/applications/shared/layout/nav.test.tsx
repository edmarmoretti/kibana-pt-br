/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

jest.mock('./nav_link_helpers', () => ({
  generateNavLink: jest.fn(({ to, items }) => ({ href: to, items })),
}));

import { setMockValues, mockKibanaValues } from '../../__mocks__/kea_logic';

import { EuiSideNavItemType } from '@elastic/eui';

import { DEFAULT_PRODUCT_FEATURES } from '../../../../common/constants';
import { ProductAccess } from '../../../../common/types';

import { useEnterpriseSearchNav, useEnterpriseSearchEngineNav } from './nav';

const DEFAULT_PRODUCT_ACCESS: ProductAccess = {
  hasAppSearchAccess: true,
  hasSearchEnginesAccess: false,
  hasWorkplaceSearchAccess: true,
};

describe('useEnterpriseSearchContentNav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockKibanaValues.uiSettings.get.mockReturnValue(false);
  });

  it('returns an array of top-level Enterprise Search nav items', () => {
    const fullProductAccess: ProductAccess = DEFAULT_PRODUCT_ACCESS;
    setMockValues({ productAccess: fullProductAccess, productFeatures: DEFAULT_PRODUCT_FEATURES });

    expect(useEnterpriseSearchNav()).toEqual([
      {
        href: '/app/enterprise_search/overview',
        id: 'es_overview',
        name: 'Overview',
      },
      {
        id: 'content',
        items: [
          {
            href: '/app/enterprise_search/content/search_indices',
            id: 'search_indices',
            name: 'Indices',
          },
          {
            href: '/app/enterprise_search/content/settings',
            id: 'settings',
            items: undefined,
            name: 'Settings',
          },
        ],
        name: 'Content',
      },
      {
        id: 'enterpriseSearchAnalytics',
        items: [
          {
            href: '/app/enterprise_search/analytics',
            id: 'analytics_collections',
            name: 'Collections',
          },
        ],
        name: 'Behavioral Analytics',
      },
      {
        id: 'search',
        items: [
          {
            href: '/app/enterprise_search/elasticsearch',
            id: 'elasticsearch',
            name: 'Elasticsearch',
          },
          {
            href: '/app/enterprise_search/search_experiences',
            id: 'searchExperiences',
            name: 'Search Experiences',
          },
          {
            href: '/app/enterprise_search/app_search',
            id: 'app_search',
            name: 'App Search',
          },
          {
            href: '/app/enterprise_search/workplace_search',
            id: 'workplace_search',
            name: 'Workplace Search',
          },
        ],
        name: 'Search',
      },
    ]);
  });

  it('excludes legacy products when the user has no access to them', () => {
    const noProductAccess: ProductAccess = {
      ...DEFAULT_PRODUCT_ACCESS,
      hasAppSearchAccess: false,
      hasWorkplaceSearchAccess: false,
    };

    setMockValues({ productAccess: noProductAccess, productFeatures: DEFAULT_PRODUCT_FEATURES });
    mockKibanaValues.uiSettings.get.mockReturnValue(false);

    const esNav = useEnterpriseSearchNav();
    const searchNav = esNav?.find((item) => item.id === 'search');
    expect(searchNav).not.toBeUndefined();
    expect(searchNav).toEqual({
      id: 'search',
      items: [
        {
          href: '/app/enterprise_search/elasticsearch',
          id: 'elasticsearch',
          name: 'Elasticsearch',
        },
        {
          href: '/app/enterprise_search/search_experiences',
          id: 'searchExperiences',
          name: 'Search Experiences',
        },
      ],
      name: 'Search',
    });
  });

  it('excludes App Search when the user has no access to it', () => {
    const workplaceSearchProductAccess: ProductAccess = {
      ...DEFAULT_PRODUCT_ACCESS,
      hasAppSearchAccess: false,
      hasWorkplaceSearchAccess: true,
    };

    setMockValues({
      productAccess: workplaceSearchProductAccess,
      productFeatures: DEFAULT_PRODUCT_FEATURES,
    });

    const esNav = useEnterpriseSearchNav();
    const searchNav = esNav?.find((item) => item.id === 'search');
    expect(searchNav).not.toBeUndefined();
    expect(searchNav).toEqual({
      id: 'search',
      items: [
        {
          href: '/app/enterprise_search/elasticsearch',
          id: 'elasticsearch',
          name: 'Elasticsearch',
        },
        {
          href: '/app/enterprise_search/search_experiences',
          id: 'searchExperiences',
          name: 'Search Experiences',
        },
        {
          href: '/app/enterprise_search/workplace_search',
          id: 'workplace_search',
          name: 'Workplace Search',
        },
      ],
      name: 'Search',
    });
  });

  it('excludes Workplace Search when the user has no access to it', () => {
    const appSearchProductAccess: ProductAccess = {
      ...DEFAULT_PRODUCT_ACCESS,
      hasWorkplaceSearchAccess: false,
    };

    setMockValues({
      productAccess: appSearchProductAccess,
      productFeatures: DEFAULT_PRODUCT_FEATURES,
    });

    const esNav = useEnterpriseSearchNav();
    const searchNav = esNav?.find((item) => item.id === 'search');
    expect(searchNav).not.toBeUndefined();
    expect(searchNav).toEqual({
      id: 'search',
      items: [
        {
          href: '/app/enterprise_search/elasticsearch',
          id: 'elasticsearch',
          name: 'Elasticsearch',
        },
        {
          href: '/app/enterprise_search/search_experiences',
          id: 'searchExperiences',
          name: 'Search Experiences',
        },
        {
          href: '/app/enterprise_search/app_search',
          id: 'app_search',
          name: 'App Search',
        },
      ],
      name: 'Search',
    });
  });

  it('excludes engines when feature flag is off', () => {
    const fullProductAccess: ProductAccess = DEFAULT_PRODUCT_ACCESS;
    setMockValues({ productAccess: fullProductAccess, productFeatures: DEFAULT_PRODUCT_FEATURES });

    const esNav = useEnterpriseSearchNav();
    expect(esNav?.find((item) => item.id === 'enginesSearch')).toBeUndefined();
  });
});

describe('useEnterpriseSearchContentNav Engines feature flag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an array of top-level Enterprise Search nav items', () => {
    const fullProductAccess: ProductAccess = {
      ...DEFAULT_PRODUCT_ACCESS,
      hasSearchEnginesAccess: true,
    };
    setMockValues({ productAccess: fullProductAccess, productFeatures: DEFAULT_PRODUCT_FEATURES });

    expect(useEnterpriseSearchNav()).toEqual([
      {
        href: '/app/enterprise_search/overview',
        id: 'es_overview',
        name: 'Overview',
      },
      {
        id: 'content',
        items: [
          {
            href: '/app/enterprise_search/content/search_indices',
            id: 'search_indices',
            name: 'Indices',
          },
          {
            href: '/app/enterprise_search/content/settings',
            id: 'settings',
            items: undefined,
            name: 'Settings',
          },
        ],
        name: 'Content',
      },
      {
        id: 'enginesSearch',
        name: 'Search',
        items: [
          {
            href: '/app/enterprise_search/elasticsearch',
            id: 'elasticsearch',
            name: 'Elasticsearch',
          },
          {
            id: 'enterpriseSearchEngines',
            name: 'Engines',
            href: '/app/enterprise_search/content/engines',
          },
          {
            id: 'searchExperiences',
            name: 'Search Experiences',
            href: '/app/enterprise_search/search_experiences',
          },
        ],
      },
      {
        id: 'enterpriseSearchAnalytics',
        items: [
          {
            href: '/app/enterprise_search/analytics',
            id: 'analytics_collections',
            name: 'Collections',
          },
        ],
        name: 'Behavioral Analytics',
      },
      {
        id: 'standaloneExperiences',
        items: [
          {
            href: '/app/enterprise_search/app_search',
            id: 'app_search',
            name: 'App Search',
          },
          {
            href: '/app/enterprise_search/workplace_search',
            id: 'workplace_search',
            name: 'Workplace Search',
          },
        ],
        name: 'Standalone Experiences',
      },
    ]);
  });

  it('excludes standalone experiences when the user has no access to them', () => {
    const fullProductAccess: ProductAccess = {
      ...DEFAULT_PRODUCT_ACCESS,
      hasAppSearchAccess: false,
      hasSearchEnginesAccess: true,
      hasWorkplaceSearchAccess: false,
    };
    setMockValues({ productAccess: fullProductAccess, productFeatures: DEFAULT_PRODUCT_FEATURES });

    const esNav = useEnterpriseSearchNav();
    expect(esNav?.find((item) => item.id === 'standaloneExperiences')).toBeUndefined();
  });
  it('excludes App Search when the user has no access to it', () => {
    const fullProductAccess: ProductAccess = {
      ...DEFAULT_PRODUCT_ACCESS,
      hasAppSearchAccess: false,
      hasSearchEnginesAccess: true,
    };
    setMockValues({ productAccess: fullProductAccess, productFeatures: DEFAULT_PRODUCT_FEATURES });

    const esNav = useEnterpriseSearchNav();
    const standAloneNav = esNav?.find((item) => item.id === 'standaloneExperiences');
    expect(standAloneNav).not.toBeUndefined();
    expect(standAloneNav).toEqual({
      id: 'standaloneExperiences',
      items: [
        {
          href: '/app/enterprise_search/workplace_search',
          id: 'workplace_search',
          name: 'Workplace Search',
        },
      ],
      name: 'Standalone Experiences',
    });
  });
  it('excludes Workplace Search when the user has no access to it', () => {
    const fullProductAccess: ProductAccess = {
      ...DEFAULT_PRODUCT_ACCESS,
      hasAppSearchAccess: true,
      hasSearchEnginesAccess: true,
      hasWorkplaceSearchAccess: false,
    };
    setMockValues({ productAccess: fullProductAccess, productFeatures: DEFAULT_PRODUCT_FEATURES });

    const esNav = useEnterpriseSearchNav();
    const standAloneNav = esNav?.find((item) => item.id === 'standaloneExperiences');
    expect(standAloneNav).not.toBeUndefined();
    expect(standAloneNav).toEqual({
      id: 'standaloneExperiences',
      items: [
        {
          href: '/app/enterprise_search/app_search',
          id: 'app_search',
          name: 'App Search',
        },
      ],
      name: 'Standalone Experiences',
    });
  });
});

describe('useEnterpriseSearchEngineNav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockKibanaValues.uiSettings.get.mockReturnValue(true);
    const fullProductAccess: ProductAccess = {
      ...DEFAULT_PRODUCT_ACCESS,
      hasSearchEnginesAccess: true,
    };
    setMockValues({ productAccess: fullProductAccess, productFeatures: DEFAULT_PRODUCT_FEATURES });
  });

  it('returns an array of top-level Enterprise Search nav items', () => {
    expect(useEnterpriseSearchEngineNav()).toEqual([
      {
        href: '/app/enterprise_search/overview',
        id: 'es_overview',
        name: 'Overview',
      },
      {
        id: 'content',
        items: [
          {
            href: '/app/enterprise_search/content/search_indices',
            id: 'search_indices',
            name: 'Indices',
          },
          {
            href: '/app/enterprise_search/content/settings',
            id: 'settings',
            items: undefined,
            name: 'Settings',
          },
        ],
        name: 'Content',
      },
      {
        id: 'enginesSearch',
        name: 'Search',
        items: [
          {
            href: '/app/enterprise_search/elasticsearch',
            id: 'elasticsearch',
            name: 'Elasticsearch',
          },
          {
            id: 'enterpriseSearchEngines',
            name: 'Engines',
            href: '/app/enterprise_search/content/engines',
          },
          {
            id: 'searchExperiences',
            name: 'Search Experiences',
            href: '/app/enterprise_search/search_experiences',
          },
        ],
      },
      {
        id: 'enterpriseSearchAnalytics',
        items: [
          {
            href: '/app/enterprise_search/analytics',
            id: 'analytics_collections',
            name: 'Collections',
          },
        ],
        name: 'Behavioral Analytics',
      },
      {
        id: 'standaloneExperiences',
        items: [
          {
            href: '/app/enterprise_search/app_search',
            id: 'app_search',
            name: 'App Search',
          },
          {
            href: '/app/enterprise_search/workplace_search',
            id: 'workplace_search',
            name: 'Workplace Search',
          },
        ],
        name: 'Standalone Experiences',
      },
    ]);
  });

  it('returns selected engine sub nav items', () => {
    const engineName = 'my-test-engine';
    const navItems = useEnterpriseSearchEngineNav(engineName);
    expect(navItems?.map((ni) => ni.name)).toEqual([
      'Overview',
      'Content',
      'Search',
      'Behavioral Analytics',
      'Standalone Experiences',
    ]);
    const searchItem = navItems?.find((ni) => ni.id === 'enginesSearch');
    expect(searchItem).not.toBeUndefined();
    expect(searchItem!.items).not.toBeUndefined();
    // @ts-ignore
    const enginesItem: EuiSideNavItemType<unknown> = searchItem?.items?.find(
      (si: EuiSideNavItemType<unknown>) => si.id === 'enterpriseSearchEngines'
    );
    expect(enginesItem).not.toBeUndefined();
    expect(enginesItem!.items).not.toBeUndefined();
    expect(enginesItem!.items).toHaveLength(1);

    // @ts-ignore
    const engineItem: EuiSideNavItemType<unknown> = enginesItem!.items[0];
    expect(engineItem).toEqual({
      href: `/app/enterprise_search/content/engines/${engineName}`,
      id: 'engineId',
      items: [
        {
          href: `/app/enterprise_search/content/engines/${engineName}/overview`,
          id: 'enterpriseSearchEngineOverview',
          name: 'Overview',
        },
        {
          href: `/app/enterprise_search/content/engines/${engineName}/indices`,
          id: 'enterpriseSearchEngineIndices',
          name: 'Indices',
        },
        {
          href: `/app/enterprise_search/content/engines/${engineName}/schema`,
          id: 'enterpriseSearchEngineSchema',
          name: 'Schema',
        },
        {
          href: `/app/enterprise_search/content/engines/${engineName}/preview`,
          id: 'enterpriseSearchEnginePreview',
          name: 'Preview',
        },
        {
          href: `/app/enterprise_search/content/engines/${engineName}/api`,
          id: 'enterpriseSearchEngineAPI',
          name: 'API',
        },
      ],
      name: engineName,
    });
  });

  it('returns selected engine without tabs when isEmpty', () => {
    const engineName = 'my-test-engine';
    const navItems = useEnterpriseSearchEngineNav(engineName, true);
    expect(navItems?.map((ni) => ni.name)).toEqual([
      'Overview',
      'Content',
      'Search',
      'Behavioral Analytics',
      'Standalone Experiences',
    ]);
    const searchItem = navItems?.find((ni) => ni.id === 'enginesSearch');
    expect(searchItem).not.toBeUndefined();
    expect(searchItem!.items).not.toBeUndefined();
    // @ts-ignore
    const enginesItem: EuiSideNavItemType<unknown> = searchItem?.items?.find(
      (si: EuiSideNavItemType<unknown>) => si.id === 'enterpriseSearchEngines'
    );
    expect(enginesItem).not.toBeUndefined();
    expect(enginesItem!.items).not.toBeUndefined();
    expect(enginesItem!.items).toHaveLength(1);

    // @ts-ignore
    const engineItem: EuiSideNavItemType<unknown> = enginesItem!.items[0];
    expect(engineItem).toEqual({
      href: `/app/enterprise_search/content/engines/${engineName}`,
      id: 'engineId',
      name: engineName,
    });
  });
});
