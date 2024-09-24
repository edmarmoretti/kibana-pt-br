/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
//incluido useState
import React, { useState, useContext, useEffect } from 'react';
import useObservable from 'react-use/lib/useObservable';
import { EuiDataGridCellValueElementProps, EuiLink } from '@elastic/eui';
import type { CoreSetup } from '@kbn/core/public';
import classNames from 'classnames';
import type { FormatFactory } from '../../../../common/types';
import { getOriginalId } from '../../../../common/expressions/datatable/transpose_helpers';
import type { ColumnConfig } from '../../../../common/expressions';
import type { DataContextType } from './types';
import { getContrastColor, getNumericValue } from '../../../shared_components/coloring/utils';

//Edmar Moretti - componentes para poder abrir link em janela interna
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiButtonEmpty
} from '@elastic/eui';

export const createGridCell = (
  formatters: Record<string, ReturnType<FormatFactory>>,
  columnConfig: ColumnConfig,
  DataContext: React.Context<DataContextType>,
  theme: CoreSetup['theme'],
  fitRowToContent?: boolean
) => {
  return ({ rowIndex, columnId, setCellProps }: EuiDataGridCellValueElementProps) => {
    const { table, alignments, minMaxByColumnId, getColorForValue, handleFilterClick } =
      useContext(DataContext);
    const IS_DARK_THEME: boolean = useObservable(theme.theme$, { darkMode: false }).darkMode;

    const rowValue = table?.rows[rowIndex]?.[columnId];

    const colIndex = columnConfig.columns.findIndex(({ columnId: id }) => id === columnId);
    const { colorMode, palette, oneClickFilter } = columnConfig.columns[colIndex] || {};
    const filterOnClick = oneClickFilter && handleFilterClick;

    let content = formatters[columnId]?.convert(rowValue, filterOnClick ? 'text' : 'html');
    //Edmar Moretti - ajusta os valores decimais removendo ,00 quando necessário
    if (content.substring(0,2) == "R$" && !content.split(',')[1]) {
      content = content + ',00';
    }
    if(content.substring(0,2) !== "R$" && content.split("%").length == 1 && content.split(",00").length == 2){
      content = content.split(",00")[0];
    }
    if(content == '(empty)'){
      content = '';
    }
    const currentAlignment = alignments && alignments[columnId];
    //Edmar Moretti - corrige os nomes dos meses
    //Feb,Apr,May,Aug,Sep,Oct,Dec
    content = content.replace('Feb/','Fev/');
    content = content.replace('Apr/','Abr/');
    content = content.replace('May/','Mai/');
    content = content.replace('Aug/','Ago/');
    content = content.replace('Sep/','Set/');
    content = content.replace('Oct/','Out/');
    content = content.replace('Dec/','Dez/');
    //content = content.replace('July/','Julho/');

    useEffect(() => {
      const originalId = getOriginalId(columnId);
      if (minMaxByColumnId?.[originalId]) {
        if (colorMode !== 'none' && palette?.params && getColorForValue) {
          // workout the bucket the value belongs to
          const color = getColorForValue(
            getNumericValue(rowValue),
            palette.params,
            minMaxByColumnId[originalId]
          );
          if (color) {
            const style = { [colorMode === 'cell' ? 'backgroundColor' : 'color']: color };
            if (colorMode === 'cell' && color) {
              style.color = getContrastColor(color, IS_DARK_THEME);
            }
            setCellProps({
              style,
            });
          }
        }
      }
      // make sure to clean it up when something change
      // this avoids cell's styling to stick forever
      return () => {
        if (minMaxByColumnId?.[originalId]) {
          setCellProps({
            style: {
              backgroundColor: undefined,
              color: undefined,
            },
          });
        }
      };
    }, [
      rowValue,
      columnId,
      setCellProps,
      colorMode,
      palette,
      minMaxByColumnId,
      getColorForValue,
      IS_DARK_THEME,
    ]);

    //Edmar Moretti - cria o botão que abre o link em um iframe quando a url possuir a palavra flyout
    const regex = /<a[^>]*>(.*?)<\/a>/;
    let match = content.match(regex);
    const label = match ? match[1] : "";
    if (content.indexOf('flyout') > 0) {
      // @ts-ignore
      if(typeof window.abreFichaIndicador === 'function'){
        const abreFicha = function(indicador: string){
          // @ts-ignore
          window.abreFichaIndicador(indicador); // eslint-disable-line react/no-danger
        };

        match = content.match(/\/([A-Z]+)-/);
        const codigo = match ? match[1] : '';
        return (
          <div>
          <EuiButtonEmpty iconType="lensApp" size="xs" color='primary' onClick={() => abreFicha(codigo)}>
            {label != "" ? label : "Abrir"}
          </EuiButtonEmpty>
        </div>
        );
      }
      const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
      let iframe = '<iframe class="flyoutIframe" style="position: fixed; height: 100vh; width: 45vw;" src="' + content + '"></iframe>';
      function Iframe(props: { iframe: string; }) {
        return (<div dangerouslySetInnerHTML={ {__html:  props.iframe?props.iframe:""}} />);
      };
      let flyout;
      if (isFlyoutVisible) {
        flyout = (
          <EuiFlyout onClose={() => setIsFlyoutVisible(false)}>
            <EuiFlyoutBody>
              <Iframe iframe={iframe} />
            </EuiFlyoutBody>
          </EuiFlyout>
        );
      }
      
      return (
        <div>
        <EuiButtonEmpty iconType="lensApp" size="xs" color='primary' onClick={() => setIsFlyoutVisible(true)}>
        {label != "" ? label : "Abrir"}
        </EuiButtonEmpty>
        {flyout}
      </div>
      );
    }

    if (filterOnClick) {
      return (
        <div
          data-test-subj="lnsTableCellContent"
          className={classNames({
            'lnsTableCell--multiline': fitRowToContent,
            [`lnsTableCell--${currentAlignment}`]: true,
          })}
        >
          <EuiLink
            onClick={() => {
              handleFilterClick?.(columnId, rowValue, colIndex, rowIndex);
            }}
          >
            {content}
          </EuiLink>
        </div>
      );
    }
    return (
      <div
        /*
         * dangerouslySetInnerHTML is necessary because the field formatter might produce HTML markup
         * which is produced in a safe way.
         */
        dangerouslySetInnerHTML={{ __html: content }} // eslint-disable-line react/no-danger
        data-test-subj="lnsTableCellContent"
        className={classNames({
          'lnsTableCell--multiline': fitRowToContent,
          [`lnsTableCell--${currentAlignment}`]: true,
        })}
      />
    );
  };
};
