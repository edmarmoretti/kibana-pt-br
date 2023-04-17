/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { __IntlProvider as IntlProvider } from '@kbn/i18n-react';
import {
  INSIGHTS_THREAT_INTELLIGENCE_COLOR_TEST_ID,
  INSIGHTS_THREAT_INTELLIGENCE_ICON_TEST_ID,
  INSIGHTS_THREAT_INTELLIGENCE_TEST_ID,
  INSIGHTS_THREAT_INTELLIGENCE_VALUE_TEST_ID,
} from './test_ids';
import type { SummaryPanelData } from './summary_panel';
import { SummaryPanel } from './summary_panel';

describe('<SummaryPanel />', () => {
  it('should render by default', () => {
    const data: SummaryPanelData[] = [
      {
        icon: 'image',
        value: 1,
        text: 'this is a test for red',
        color: 'rgb(189,39,30)',
      },
    ];

    const { getByTestId } = render(
      <IntlProvider locale="en">
        <SummaryPanel data={data} data-test-subj={INSIGHTS_THREAT_INTELLIGENCE_TEST_ID} />
      </IntlProvider>
    );
    expect(getByTestId(INSIGHTS_THREAT_INTELLIGENCE_ICON_TEST_ID)).toBeInTheDocument();
    expect(getByTestId(INSIGHTS_THREAT_INTELLIGENCE_VALUE_TEST_ID)).toHaveTextContent(
      '1 this is a test for red'
    );
    expect(getByTestId(INSIGHTS_THREAT_INTELLIGENCE_COLOR_TEST_ID)).toBeInTheDocument();
  });

  it('should only render null when data is null', () => {
    const data = null as unknown as SummaryPanelData[];

    const { baseElement } = render(<SummaryPanel data={data} />);

    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div />
      </body>
    `);
  });

  it('should handle big number in a compact notation', () => {
    const data: SummaryPanelData[] = [
      {
        icon: 'image',
        value: 160000,
        text: 'this is a test for red',
        color: 'rgb(189,39,30)',
      },
    ];

    const { getByTestId } = render(
      <SummaryPanel data={data} data-test-subj={INSIGHTS_THREAT_INTELLIGENCE_TEST_ID} />
    );

    expect(getByTestId(INSIGHTS_THREAT_INTELLIGENCE_VALUE_TEST_ID)).toHaveTextContent(
      '160k this is a test for red'
    );
  });

  it(`should not show the colored dot if color isn't provided`, () => {
    const data: SummaryPanelData[] = [
      {
        icon: 'image',
        value: 160000,
        text: 'this is a test for no color',
      },
    ];

    const { queryByTestId } = render(
      <SummaryPanel data={data} data-test-subj={INSIGHTS_THREAT_INTELLIGENCE_TEST_ID} />
    );

    expect(queryByTestId(INSIGHTS_THREAT_INTELLIGENCE_COLOR_TEST_ID)).not.toBeInTheDocument();
  });
});
