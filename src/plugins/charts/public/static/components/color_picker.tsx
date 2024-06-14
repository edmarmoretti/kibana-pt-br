/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { BaseSyntheticEvent, useMemo } from 'react';
import { css } from '@emotion/react';
import {
  EuiButtonEmpty,
  EuiFlexItem,
  EuiIcon,
  euiPaletteColorBlind,
  EuiScreenReaderOnly,
  EuiFlexGroup,
  useEuiTheme,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import { lightenColor } from '../../services/palettes/lighten_color';

// Edmar Moretti
//Inclusão de cores
export const legacyColors: string[] = [ 
  '#3f6833', // A1
  '#967302', // B1
  '#2F575E', // C1
  '#99440A', // D1
  '#58140C', // E1
  '#052B51', // F1
  '#511749', // G1
  '#3F2B5B', // 6 H1
  '#252525', // I1 adicionado
  '#01665e', // J1 adicionado
  '#e5c494', // K1 adicionado
  '#0c2c84', // adicionado
  '#508642', '#CCA300', '#447EBC', '#C15C17', '#890F02', '#0A437C', '#6D1F62', '#584477', // 2
  '#525252', // adicionado
  '#5ab4ac', // adicionado
  '#ffd92f', // adicionado
  '#225ea8', // adicionado
  '#629E51', '#E5AC0E', '#64B0C8', '#E0752D', '#BF1B00', '#0A50A1', '#962D82', '#614D93', // 4
  '#737373', // adicionado
  '#c7eae5', // adicionado
  '#a6d854', // adicionado
  '#1d91c0', // adicionado
  '#7EB26D', '#EAB839', '#6ED0E0', '#EF843C', '#E24D42', '#1F78C1', '#BA43A9', '#705DA0', // Normal
  '#969696', // adicionado
  '#f5f5f5', // adicionado
  '#e78ac3', // adicionado
  '#41b6c4', // adicionado
  '#9AC48A', '#F2C96D', '#65C5DB', '#F9934E', '#EA6460', '#5195CE', '#D683CE', '#806EB7', // 5
  '#bdbdbd', // adicionado
  '#f6e8c3', // adicionado
  '#8da0cb', // adicionado
  '#7fcdbb', // adicionado
  '#B7DBAB', '#F4D598', '#70DBED', '#F9BA8F', '#F29191', '#82B5D8', '#E5A8E2', '#AEA2E0', // 3
  '#d9d9d9', // adicionado
  '#d8b365', // adicionado
  '#fc8d62', // adicionado
  '#c7e9b4', // adicionado
  '#E0F9D7', '#FCEACA', '#CFFAFF', '#F9E2D2', '#FCE2DE', '#BADFF4', '#F9D9F9', '#DEDAF7', // 7
  '#f7f7f7', // adicionado
  '#8c510a', // adicionado
  '#66c2a5', // adicionado
  '#ffffcc' // adicionado
  ];

  /*
export const legacyColors: string[] = [
  '#3F6833',
  '#967302',
  '#2F575E',
  '#99440A',
  '#58140C',
  '#052B51',
  '#511749',
  '#3F2B5B',
  '#508642',
  '#CCA300',
  '#447EBC',
  '#C15C17',
  '#890F02',
  '#0A437C',
  '#6D1F62',
  '#584477',
  '#629E51',
  '#E5AC0E',
  '#64B0C8',
  '#E0752D',
  '#BF1B00',
  '#0A50A1',
  '#962D82',
  '#614D93',
  '#7EB26D',
  '#EAB839',
  '#6ED0E0',
  '#EF843C',
  '#E24D42',
  '#1F78C1',
  '#BA43A9',
  '#705DA0',
  '#9AC48A',
  '#F2C96D',
  '#65C5DB',
  '#F9934E',
  '#EA6460',
  '#5195CE',
  '#D683CE',
  '#806EB7',
  '#B7DBAB',
  '#F4D598',
  '#70DBED',
  '#F9BA8F',
  '#F29191',
  '#82B5D8',
  '#E5A8E2',
  '#AEA2E0',
  '#E0F9D7',
  '#FCEACA',
  '#CFFAFF',
  '#F9E2D2',
  '#FCE2DE',
  '#BADFF4',
  '#F9D9F9',
  '#DEDAF7',
];
*/

export interface ColorPickerProps {
  /**
   * Label that characterizes the color that is going to change
   */
  label: string | number | null;
  /**
   * Callback on the color change
   */
  onChange: (color: string | null, event: BaseSyntheticEvent) => void;
  /**
   * Initial color.
   */
  color: string;
  /**
   * Defines if the compatibility (legacy) or eui palette is going to be used. Defauls to true.
   */
  useLegacyColors?: boolean;
  /**
   * Defines if the default color is overwritten. Defaults to true.
   */
  colorIsOverwritten?: boolean;
  /**
   * Callback for onKeyPress event
   */
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
  /**
   * Optional define the series maxDepth
   */
  maxDepth?: number;
  /**
   * Optional define the layer index
   */
  layerIndex?: number;
}
//const euiColors = euiPaletteColorBlind({ rotations: 4, order: 'group' });

const visColorPickerColorBtnStyle = css`
  position: relative;
  input[type='radio'] {
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 0;
    transform: translate(-50%, -50%);
  }
`;

const visColorPickerValueDotStyle = css`
  cursor: pointer;
  &:hover {
    transform: scale(1.4);
  }
`;

export const ColorPicker = ({
  onChange,
  color: selectedColor,
  label,
  useLegacyColors = true,
  colorIsOverwritten = true,
  onKeyDown,
  maxDepth,
  layerIndex,
}: ColorPickerProps) => {
  //Edmar Moretti
  //const legendColors = useLegacyColors ? legacyColors : euiColors;
  const legendColors = useLegacyColors ? legacyColors : legacyColors;

  const { euiTheme } = useEuiTheme();


  //Edmar Moretti - número de opções de cores
  /*
  const visColorPickerValueStyle = useMemo(
    () => css`
      width: calc(${euiTheme.size.l} * 8);
    `,
    [euiTheme.size.l]
  );
  */

  const visColorPickerValueStyle = useMemo(
    () => css`
      width: calc(${euiTheme.size.l} * 12);
    `,
    [euiTheme.size.l]
  );

  const visColorPickerValueDotSelectedStyle = useMemo(
    () => css`
      border: ${euiTheme.size.xs} solid;
      border-radius: 100%;
    `,
    [euiTheme.size.xs]
  );

  return (
    <div className="visColorPicker">
      <fieldset>
        <EuiScreenReaderOnly>
          <legend>
            <FormattedMessage
              id="charts.colorPicker.setColor.screenReaderDescription"
              defaultMessage="Set color for value {legendDataLabel}"
              values={{ legendDataLabel: label }}
            />
          </legend>
        </EuiScreenReaderOnly>
        <EuiFlexGroup
          wrap={true}
          gutterSize="none"
          css={visColorPickerValueStyle}
          className="visColorPicker__value"
        >
          {legendColors.map((color) => (
            <label
              key={color}
              css={visColorPickerColorBtnStyle}
              className="visColorPicker__colorBtn"
            >
              <input
                type="radio"
                onChange={(e) => onChange(color, e)}
                value={selectedColor}
                name="visColorPicker__radio"
                checked={
                  //Edmar Moretti - marca corretamente a cor selecionada
                  //color === selectedColor
                  color.toLowerCase() === selectedColor.toLowerCase()  
                }
                onKeyDown={onKeyDown}
              />
              <EuiIcon
                type="dot"
                size="l"
                color={selectedColor}
                css={[
                  visColorPickerValueDotStyle,
                  //Edmar Moretti
                  //color === selectedColor ? visColorPickerValueDotSelectedStyle : null,
                  color.toLowerCase() === selectedColor.toLowerCase() ? visColorPickerValueDotSelectedStyle : null,
                ]}
                className="visColorPicker__valueDot"
                style={{ color }}
                data-test-subj={`visColorPickerColor-${color}`}
              />
              <EuiScreenReaderOnly>
                <span>{color}</span>
              </EuiScreenReaderOnly>
            </label>
          ))}
        </EuiFlexGroup>
      </fieldset>
      {legendColors.some(
        (c) =>
          c === selectedColor ||
          (layerIndex && maxDepth && lightenColor(c, layerIndex, maxDepth) === selectedColor)
      ) &&
        colorIsOverwritten && (
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty size="s" onClick={(e: any) => onChange(null, e)}>
              <FormattedMessage id="charts.colorPicker.clearColor" defaultMessage="Reset color" />
            </EuiButtonEmpty>
          </EuiFlexItem>
        )}
    </div>
  );
};
