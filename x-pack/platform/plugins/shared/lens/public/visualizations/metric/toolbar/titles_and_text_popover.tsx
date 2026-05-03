/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { FC } from 'react';

import { EuiFormRow, EuiFieldText, EuiButtonGroup, EuiIconTip } from '@elastic/eui';
import { i18n } from '@kbn/i18n';

import { useDebouncedValue } from '@kbn/visualization-utils';
import { MetricStyle } from '@elastic/charts';
import { ToolbarPopover, ToolbarPopoverProps } from '../../../shared_components';
import { MetricVisualizationState, ValueFontMode } from '../types';
import { metricStateDefaults } from '../constants';

export interface TitlesAndTextPopoverProps {
  state: MetricVisualizationState;
  setState: (newState: MetricVisualizationState) => void;
  groupPosition?: ToolbarPopoverProps['groupPosition'];
}
//Edmar Moretti - firstTermPosition
export const TitlesAndTextPopover: FC<TitlesAndTextPopoverProps> = ({
  state,
  setState,
  groupPosition,
}) => {
  return (
    <ToolbarPopover
      title={i18n.translate('xpack.lens.metric.toolbarTitlesText.label', {
        defaultMessage: 'Títulos e texto',
      })}
      type="titlesAndText"
      groupPosition={groupPosition}
      buttonDataTestSubj="lnsTextOptionsButton"
    >
      {!state.breakdownByAccessor && (
        <SubtitleOption
          value={state.subtitle}
          onChange={(subtitle) => {
            setState({ ...state, subtitle });
          }}
        />
      )}

      <TitlesAlignmentOption
        value={state.titlesTextAlign ?? metricStateDefaults.titlesTextAlign}
        onChange={(titlesTextAlign) => {
          setState({ ...state, titlesTextAlign });
        }}
      />

      {state.icon && state.icon !== 'empty' && (
        <IconAlignmentOption
          value={state.iconAlign ?? metricStateDefaults.iconAlign}
          onChange={(iconAlign) => {
            setState({ ...state, iconAlign });
          }}
        />
      )}

      <ValuesAlignmentOption
        value={state.valuesTextAlign ?? metricStateDefaults.valuesTextAlign}
        onChange={(valuesTextAlign) => {
          setState({ ...state, valuesTextAlign });
        }}
      />

      <ValueFontSizeOption
        value={state.valueFontMode ?? metricStateDefaults.valueFontMode}
        onChange={(value) => {
          setState({ ...state, valueFontMode: value });
        }}
      />

      <FirstTermPositionOption
        value={state.firstTermPosition ?? metricStateDefaults.firstTermPosition}
        onChange={(firstTermPosition) => {
          setState({ ...state, firstTermPosition });
        }}
      />

    </ToolbarPopover>
  );
};

function SubtitleOption({
  value = '',
  onChange,
}: {
  value?: string;
  onChange: (subtitle: string) => void;
}) {
  const { inputValue, handleInputChange } = useDebouncedValue<string>(
    {
      onChange,
      value,
    },
    { allowFalsyValue: true }
  );

  return (
    <EuiFormRow
      label={i18n.translate('xpack.lens.metric.subtitleLabel', {
        defaultMessage: 'Subtítulo',
      })}
      fullWidth
      display="columnCompressed"
    >
      <EuiFieldText
        compressed
        data-test-subj="lens-metric-subtitle-field"
        value={inputValue}
        onChange={({ target: { value: newValue } }) => handleInputChange(newValue)}
      />
    </EuiFormRow>
  );
}

const valueFontModes: Array<{
  id: ValueFontMode;
  label: string;
}> = [
  {
    id: 'default',
    label: i18n.translate('xpack.lens.metric.toolbarTitlesText.default', {
      defaultMessage: 'Default',
    }),
  },
  {
    id: 'fit',
    label: i18n.translate('xpack.lens.metric.toolbarTitlesText.fit', {
      defaultMessage: 'Ajustado',
    }),
  },
];

function ValueFontSizeOption({
  value,
  onChange,
}: {
  value: (typeof valueFontModes)[number]['id'];
  onChange: (mode: ValueFontMode) => void;
}) {
  const label = i18n.translate('xpack.lens.metric.toolbarTitlesText.valueFontSize', {
    defaultMessage: 'Tamanho da fonte para os valores',
  });

  return (
    <EuiFormRow
      display="columnCompressed"
      label={
        <span>
          {label}{' '}
          <EuiIconTip
            content={i18n.translate('xpack.lens.metric.toolbarTitlesText.valueFontSizeTip', {
              defaultMessage: 'Tamanho da fonte para o valor da métrica principal',
            })}
            iconProps={{
              className: 'eui-alignTop',
            }}
            color="subdued"
            position="top"
            size="s"
            type="question"
          />
        </span>
      }
    >
      <EuiButtonGroup
        isFullWidth
        legend={label}
        data-test-subj="lens-value-font-mode-btn"
        buttonSize="compressed"
        idSelected={value}
        options={valueFontModes}
        onChange={(mode) => {
          onChange(mode as ValueFontMode);
        }}
      />
    </EuiFormRow>
  );
}

const alignmentOptions: Array<{
  id: MetricStyle['titlesTextAlign'] | MetricStyle['valuesTextAlign'];
  label: string;
}> = [
  {
    id: 'left',
    label: i18n.translate('xpack.lens.shared.left', {
      defaultMessage: 'Esquerda',
    }),
  },
  {
    id: 'center',
    label: i18n.translate('xpack.lens.shared.center', {
      defaultMessage: 'Centro',
    }),
  },
  {
    id: 'right',
    label: i18n.translate('xpack.lens.shared.right', {
      defaultMessage: 'Direita',
    }),
  },
];

function TitlesAlignmentOption({
  value,
  onChange,
}: {
  value: MetricStyle['titlesTextAlign'];
  onChange: (alignment: MetricStyle['titlesTextAlign']) => void;
}) {
  const label = i18n.translate('xpack.lens.metric.toolbarTitlesText.titlesAlignment', {
    defaultMessage: 'Alinhamento dos títulos',
  });

  return (
    <EuiFormRow
      display="columnCompressed"
      label={
        <span>
          {label}{' '}
          <EuiIconTip
            content={i18n.translate('xpack.lens.metric.toolbarTitlesText.titlesAlignmentTip', {
              defaultMessage: 'Alinhamento do título e subtítulo',
            })}
            iconProps={{
              className: 'eui-alignTop',
            }}
            color="subdued"
            position="top"
            size="s"
            type="question"
          />
        </span>
      }
    >
      <EuiButtonGroup
        isFullWidth
        legend={label}
        data-test-subj="lens-titles-alignment-btn"
        buttonSize="compressed"
        options={alignmentOptions}
        idSelected={value}
        onChange={(alignment) => {
          onChange(alignment as MetricStyle['titlesTextAlign']);
        }}
      />
    </EuiFormRow>
  );
}

function ValuesAlignmentOption({
  value,
  onChange,
}: {
  value: MetricStyle['valuesTextAlign'];
  onChange: (alignment: MetricStyle['valuesTextAlign']) => void;
}) {
  const label = i18n.translate('xpack.lens.metric.toolbarTitlesText.valuesAlignment', {
    defaultMessage: 'Alinhamento dos valores',
  });

  return (
    <EuiFormRow
      display="columnCompressed"
      label={
        <span>
          {label}{' '}
          <EuiIconTip
            color="subdued"
            content={i18n.translate('xpack.lens.metric.toolbarTitlesText.valuesAlignmentTip', {
              defaultMessage: 'Alinhamento das métricas primárias e secundárias',
            })}
            iconProps={{
              className: 'eui-alignTop',
            }}
            position="top"
            size="s"
            type="question"
          />
        </span>
      }
    >
      <EuiButtonGroup
        isFullWidth
        legend={label}
        data-test-subj="lens-values-alignment-btn"
        buttonSize="compressed"
        options={alignmentOptions}
        idSelected={value}
        onChange={(alignment) => {
          onChange(alignment as MetricStyle['valuesTextAlign']);
        }}
      />
    </EuiFormRow>
  );
}

//Edmar Moretti - FirstTermPosition

const firstTermPositionModes: Array<{
  id: 'default' | 'bottom';
  label: string;
}> = [
  {
    id: 'default',
    label: i18n.translate('xpack.lens.metric.toolbarTitlesText.default', {
      defaultMessage: 'Default',
    }),
  },
  {
    id: 'bottom',
    label: i18n.translate('xpack.lens.metric.toolbarTitlesText.rodape', {
      defaultMessage: 'Rodapé',
    }),
  },
];
function FirstTermPositionOption({
  value,
  onChange,
}: {
  value: MetricStyle['firstTermPosition'];
  onChange: (alignment: MetricStyle['firstTermPosition']) => void;
}) {
  const label = i18n.translate('xpack.lens.metric.toolbarTitlesText.firstTermPosition', {
    defaultMessage: 'Posição do primeiro termo',
  });

  return (
    <EuiFormRow
      display="columnCompressed"
      label={
        <span>
          {label}{' '}
          <EuiIconTip
            content={i18n.translate('xpack.lens.metric.toolbarTitlesText.firstTermPositionTip', {
              defaultMessage: 'Posicionamento do primeiro termo',
            })}
            iconProps={{
              className: 'eui-alignTop',
            }}
            color="subdued"
            position="top"
            size="s"
            type="questionInCircle"
          />
        </span>
      }
    >
      <EuiButtonGroup
        isFullWidth
        legend={label}
        data-test-subj="lens-titles-alignment-btn"
        buttonSize="compressed"
        options={firstTermPositionModes}
        idSelected={value}
        onChange={(alignment) => {
          onChange(alignment as MetricStyle['firstTermPosition']);
        }}
      />
    </EuiFormRow>
  );
}

const iconAlignmentOptions: Array<{
  id: MetricStyle['titlesTextAlign'] | MetricStyle['valuesTextAlign'];
  label: string;
}> = [
  {
    id: 'left',
    label: i18n.translate('xpack.lens.shared.left', {
      defaultMessage: 'Esquerda',
    }),
  },
  {
    id: 'right',
    label: i18n.translate('xpack.lens.shared.right', {
      defaultMessage: 'Direita',
    }),
  },
];

function IconAlignmentOption({
  value,
  onChange,
}: {
  value: MetricStyle['iconAlign'];
  onChange: (alignment: MetricStyle['iconAlign']) => void;
}) {
  const label = i18n.translate('xpack.lens.metric.toolbarTitlesText.iconAlignment', {
    defaultMessage: 'Alinhamento do ícone',
  });

  return (
    <EuiFormRow display="columnCompressed" label={label}>
      <EuiButtonGroup
        isFullWidth
        legend={label}
        data-test-subj="lens-icon-alignment-btn"
        buttonSize="compressed"
        options={iconAlignmentOptions}
        idSelected={value}
        onChange={(alignment) => {
          onChange(alignment as MetricStyle['iconAlign']);
        }}
      />
    </EuiFormRow>
  );
}
