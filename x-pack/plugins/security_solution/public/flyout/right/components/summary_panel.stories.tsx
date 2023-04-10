/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import type { Story } from '@storybook/react';
import { css } from '@emotion/react';
import type { SummaryPanelData } from './summary_panel';
import { SummaryPanel } from './summary_panel';

export default {
  component: SummaryPanel,
  title: 'Flyout/SummaryPanel',
};

export const Default: Story<void> = () => {
  const data: SummaryPanelData[] = [
    {
      icon: 'image',
      value: 'This is a test for red',
      color: 'rgb(189,39,30)',
    },
    {
      icon: 'warning',
      value: 'This is test for orange',
      color: 'rgb(255,126,98)',
    },
    {
      icon: 'warning',
      value: 'This is test for yellow',
      color: 'rgb(241,216,11)',
    },
  ];
  return (
    <div
      css={css`
        width: 500px;
      `}
    >
      <SummaryPanel data={data} />
    </div>
  );
};

export const InvalidColor: Story<void> = () => {
  const data: SummaryPanelData[] = [
    {
      icon: 'image',
      value: 'This is a test for an invalid color (abc)',
      color: 'abc',
    },
  ];
  return (
    <div
      css={css`
        width: 500px;
      `}
    >
      <SummaryPanel data={data} />
    </div>
  );
};

export const LongText: Story<void> = () => {
  const data: SummaryPanelData[] = [
    {
      icon: 'image',
      value:
        'This is an extremely long text to verify it is properly cut off and there is a tooltip displaying everything',
      color: 'abc',
    },
  ];
  return (
    <div
      css={css`
        width: 500px;
      `}
    >
      <SummaryPanel data={data} />
    </div>
  );
};
export const NoData: Story<void> = () => {
  const data: SummaryPanelData[] = [];
  return (
    <div
      css={css`
        width: 500px;
      `}
    >
      <SummaryPanel data={data} />
    </div>
  );
};
