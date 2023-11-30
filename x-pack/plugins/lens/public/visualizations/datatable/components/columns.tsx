/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { i18n } from '@kbn/i18n';
import { css } from '@emotion/react';
import {
  EuiDataGridColumn,
  EuiDataGridColumnCellActionProps,
  EuiListGroupItemProps,
} from '@elastic/eui';
import type {
  Datatable,
  DatatableColumn,
  DatatableColumnMeta,
} from '@kbn/expressions-plugin/common';
import { EuiDataGridColumnCellAction } from '@elastic/eui/src/components/datagrid/data_grid_types';
import type { FormatFactory } from '../../../../common/types';
import type { ColumnConfig } from '../../../../common/expressions';
import { LensCellValueAction } from '../../../types';

export const createGridColumns = (
  bucketColumns: string[],
  table: Datatable,
  handleFilterClick:
    | ((
        field: string,
        value: unknown,
        colIndex: number,
        rowIndex: number,
        negate?: boolean
      ) => void)
    | undefined,
  handleTransposedColumnClick:
    | ((
        bucketValues: Array<{ originalBucketColumn: DatatableColumn; value: unknown }>,
        negate?: boolean
      ) => void)
    | undefined,
  isReadOnly: boolean,
  columnConfig: ColumnConfig,
  visibleColumns: string[],
  formatFactory: FormatFactory,
  onColumnResize: (eventData: { columnId: string; width: number | undefined }) => void,
  onColumnHide: ((eventData: { columnId: string }) => void) | undefined,
  alignments: Record<string, 'left' | 'right' | 'center'>,
  headerRowHeight: 'auto' | 'single' | 'custom',
  headerRowLines: number,
  columnCellValueActions: LensCellValueAction[][] | undefined,
  closeCellPopover?: Function,
  columnFilterable?: boolean[]
) => {
  const columnsReverseLookup = table.columns.reduce<
    Record<string, { name: string; index: number; meta?: DatatableColumnMeta }>
  >((memo, { id, name, meta }, i) => {
    memo[id] = { name, index: i, meta };
    return memo;
  }, {});

  const getContentData = ({
    rowIndex,
    columnId,
  }: Pick<EuiDataGridColumnCellActionProps, 'rowIndex' | 'columnId'>) => {
    // incoming data might change and put the current page out of bounds - check whether row actually exists
    const rowValue = table.rows[rowIndex]?.[columnId];
    const column = columnsReverseLookup?.[columnId];
    const contentsIsDefined = rowValue != null;

    const cellContent = formatFactory(column?.meta?.params).convert(rowValue);
    return { rowValue, contentsIsDefined, cellContent };
  };

  return visibleColumns.map((field) => {
    const { name, index: colIndex } = columnsReverseLookup[field];
    //Edmar moretti - remove filtro
    //const filterable = columnFilterable?.[colIndex] || false;
    const filterable = false;
    const columnArgs = columnConfig.columns.find(({ columnId }) => columnId === field);

    const cellActions: EuiDataGridColumnCellAction[] = [];
    if (filterable && handleFilterClick && !columnArgs?.oneClickFilter) {
      cellActions.push(
        ({ rowIndex, columnId, Component }: EuiDataGridColumnCellActionProps) => {
          const { rowValue, contentsIsDefined, cellContent } = getContentData({
            rowIndex,
            columnId,
          });

          const filterForText = i18n.translate(
            'xpack.lens.table.tableCellFilter.filterForValueText',
            {
              defaultMessage: 'Filter for',
            }
          );
          const filterForAriaLabel = i18n.translate(
            'xpack.lens.table.tableCellFilter.filterForValueAriaLabel',
            {
              defaultMessage: 'Filter for: {cellContent}',
              values: {
                cellContent,
              },
            }
          );

          if (!contentsIsDefined) {
            return null;
          }

          return (
            <Component
              aria-label={filterForAriaLabel}
              data-test-subj="lensDatatableFilterFor"
              onClick={() => {
                handleFilterClick(field, rowValue, colIndex, rowIndex);
                closeCellPopover?.();
              }}
              iconType="plusInCircle"
            >
              {filterForText}
            </Component>
          );
        },
        ({ rowIndex, columnId, Component }: EuiDataGridColumnCellActionProps) => {
          const { rowValue, contentsIsDefined, cellContent } = getContentData({
            rowIndex,
            columnId,
          });

          const filterOutText = i18n.translate(
            'xpack.lens.table.tableCellFilter.filterOutValueText',
            {
              defaultMessage: 'Filter out',
            }
          );
          const filterOutAriaLabel = i18n.translate(
            'xpack.lens.table.tableCellFilter.filterOutValueAriaLabel',
            {
              defaultMessage: 'Filter out: {cellContent}',
              values: {
                cellContent,
              },
            }
          );

          if (!contentsIsDefined) {
            return null;
          }

          return (
            <Component
              data-test-subj="lensDatatableFilterOut"
              aria-label={filterOutAriaLabel}
              onClick={() => {
                handleFilterClick(field, rowValue, colIndex, rowIndex, true);
                closeCellPopover?.();
              }}
              iconType="minusInCircle"
            >
              {filterOutText}
            </Component>
          );
        }
      );
    }

    // Add all the column compatible cell actions
    const compatibleCellActions = columnCellValueActions?.[colIndex] ?? [];
    compatibleCellActions.forEach((action) => {
      cellActions.push(({ rowIndex, columnId, Component }: EuiDataGridColumnCellActionProps) => {
        const rowValue = table.rows[rowIndex][columnId];
        const columnMeta = columnsReverseLookup[columnId].meta;
        const data = {
          value: rowValue,
          columnMeta,
        };

        if (rowValue == null) {
          return null;
        }

        return (
          <Component
            aria-label={action.displayName}
            data-test-subj={`lensDatatableCellAction-${action.id}`}
            onClick={() => {
              action.execute([data]);
              closeCellPopover?.();
            }}
            iconType={action.iconType}
          >
            {action.displayName}
          </Component>
        );
      });
    });

    const isTransposed = Boolean(columnArgs?.originalColumnId);
    const initialWidth = columnArgs?.width;
    const isHidden = columnArgs?.hidden;
    const originalColumnId = columnArgs?.originalColumnId;

    const additionalActions: EuiListGroupItemProps[] = [];

    additionalActions.push({
      color: 'text',
      size: 'xs',
      onClick: () => onColumnResize({ columnId: originalColumnId || field, width: undefined }),
      iconType: 'empty',
      label: i18n.translate('xpack.lens.table.resize.reset', {
        defaultMessage: 'Reset width',
      }),
      'data-test-subj': 'lensDatatableResetWidth',
      isDisabled: initialWidth == null,
    });
    if (!isTransposed && onColumnHide) {
      additionalActions.push({
        color: 'text',
        size: 'xs',
        onClick: () => onColumnHide({ columnId: originalColumnId || field }),
        iconType: 'eyeClosed',
        label: i18n.translate('xpack.lens.table.hide.hideLabel', {
          defaultMessage: 'Hide',
        }),
        'data-test-subj': 'lensDatatableHide',
        isDisabled: !isHidden && visibleColumns.length <= 1,
      });
    }

    if (!isReadOnly) {
      if (isTransposed && columnArgs?.bucketValues && handleTransposedColumnClick) {
        const bucketValues = columnArgs?.bucketValues;
        additionalActions.push({
          color: 'text',
          size: 'xs',
          onClick: () => handleTransposedColumnClick(bucketValues, false),
          iconType: 'plusInCircle',
          label: i18n.translate('xpack.lens.table.columnFilter.filterForValueText', {
            defaultMessage: 'Filter for',
          }),
          'data-test-subj': 'lensDatatableHide',
        });

        additionalActions.push({
          color: 'text',
          size: 'xs',
          onClick: () => handleTransposedColumnClick(bucketValues, true),
          iconType: 'minusInCircle',
          label: i18n.translate('xpack.lens.table.columnFilter.filterOutValueText', {
            defaultMessage: 'Filter out',
          }),
          'data-test-subj': 'lensDatatableHide',
        });
      }
    }
    const currentAlignment = alignments && alignments[field];
    const hasMultipleRows = headerRowHeight === 'auto' || headerRowHeight === 'custom';

    const columnStyle = css({
      ...(headerRowHeight === 'custom' && {
        WebkitLineClamp: headerRowLines,
      }),
      ...(hasMultipleRows && {
        whiteSpace: 'normal',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
      }),
      textAlign: currentAlignment,
    });

    const columnDefinition: EuiDataGridColumn = {
      id: field,
      cellActions,
      visibleCellActions: 5,
      display: <div css={columnStyle}>{name}</div>,
      displayAsText: name,
      actions: {
        showHide: false,
        showMoveLeft: false,
        showMoveRight: false,
        showSortAsc: {
          label: i18n.translate('xpack.lens.table.sort.ascLabel', {
            defaultMessage: 'Sort ascending',
          }),
        },
        showSortDesc: {
          label: i18n.translate('xpack.lens.table.sort.descLabel', {
            defaultMessage: 'Sort descending',
          }),
        },
        additional: additionalActions,
      },
    };

    if (initialWidth) {
      columnDefinition.initialWidth = initialWidth;
    }

    return columnDefinition;
  });
};
