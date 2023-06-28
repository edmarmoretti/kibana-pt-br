/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { i18n } from '@kbn/i18n';

export const OptionsListStrings = {
  control: {
    getSeparator: () =>
      i18n.translate('controls.optionsList.control.separator', {
        defaultMessage: ', ',
      }),
    getPlaceholder: () =>
      i18n.translate('controls.optionsList.control.placeholder', {
        defaultMessage: 'Selecione...',
      }),
    getNegate: () =>
      i18n.translate('controls.optionsList.control.negate', {
        defaultMessage: 'Não',
      }),
    getExcludeExists: () =>
      i18n.translate('controls.optionsList.control.excludeExists', {
        defaultMessage: 'Não existe',
      }),
  },
  editor: {
    getAllowMultiselectTitle: () =>
      i18n.translate('controls.optionsList.editor.allowMultiselectTitle', {
        defaultMessage: 'Allow multiple selections in dropdown',
      }),
    getRunPastTimeoutTitle: () =>
      i18n.translate('controls.optionsList.editor.runPastTimeout', {
        defaultMessage: 'Ignore timeout for results',
      }),
    getRunPastTimeoutTooltip: () =>
      i18n.translate('controls.optionsList.editor.runPastTimeout.tooltip', {
        defaultMessage:
          'Wait to display results until the list is complete. This setting is useful for large data sets, but the results might take longer to populate.',
      }),
    getHideExcludeTitle: () =>
      i18n.translate('controls.optionsList.editor.hideExclude', {
        defaultMessage: 'Allow selections to be excluded',
      }),
    getHideExistsQueryTitle: () =>
      i18n.translate('controls.optionsList.editor.hideExistsQuery', {
        defaultMessage: 'Allow exists query',
      }),
    getHideExistsQueryTooltip: () =>
      i18n.translate('controls.optionsList.editor.hideExistsQueryTooltip', {
        defaultMessage:
          'Allows you to create an exists query, which returns all documents that contain an indexed value for the field.',
      }),
  },
  popover: {
    getAriaLabel: (fieldName: string) =>
      i18n.translate('controls.optionsList.popover.ariaLabel', {
        defaultMessage: 'Popover for {fieldName} control',
        values: { fieldName },
      }),
    getLoadingMessage: () =>
      i18n.translate('controls.optionsList.popover.loading', {
        defaultMessage: 'Carregando as opções',
      }),
    getEmptyMessage: () =>
      i18n.translate('controls.optionsList.popover.empty', {
        defaultMessage: 'Nenhuma opção encontrada',
      }),
    getSelectionsEmptyMessage: () =>
      i18n.translate('controls.optionsList.popover.selectionsEmpty', {
        defaultMessage: 'Não há seleções',
      }),
    getAllOptionsButtonTitle: () =>
      i18n.translate('controls.optionsList.popover.allOptionsTitle', {
        defaultMessage: 'Mostrar todas as opções',
      }),
    getSelectedOptionsButtonTitle: () =>
      i18n.translate('controls.optionsList.popover.selectedOptionsTitle', {
        defaultMessage: 'Mostar somente as opções selecionadas',
      }),
    getClearAllSelectionsButtonTitle: () =>
      i18n.translate('controls.optionsList.popover.clearAllSelectionsTitle', {
        defaultMessage: 'Limpar seleções',
      }),
    getTotalCardinalityTooltip: (totalOptions: number) =>
      i18n.translate('controls.optionsList.popover.cardinalityTooltip', {
        defaultMessage: '{totalOptions} opções disponíveis.',
        values: { totalOptions },
      }),
    getTotalCardinalityPlaceholder: (totalOptions: number) =>
      i18n.translate('controls.optionsList.popover.cardinalityPlaceholder', {
        defaultMessage:
          'Localizar em {totalOptions} disponíveis {totalOptions, plural, one {option} other {options}}',
        values: { totalOptions },
      }),
    getInvalidSelectionsTitle: (invalidSelectionCount: number) =>
      i18n.translate('controls.optionsList.popover.invalidSelectionsTitle', {
        defaultMessage: '{invalidSelectionCount} selected options ignored',
        values: { invalidSelectionCount },
      }),
    getInvalidSelectionsSectionTitle: (invalidSelectionCount: number) =>
      i18n.translate('controls.optionsList.popover.invalidSelectionsSectionTitle', {
        defaultMessage:
          'Ignored {invalidSelectionCount, plural, one {selection} other {selections}}',
        values: { invalidSelectionCount },
      }),
    getInvalidSelectionsAriaLabel: () =>
      i18n.translate('controls.optionsList.popover.invalidSelectionsAriaLabel', {
        defaultMessage: 'Deselect all ignored selections',
      }),
    getInvalidSelectionsTooltip: (selectedOptions: number) =>
      i18n.translate('controls.optionsList.popover.invalidSelectionsTooltip', {
        defaultMessage:
          '{selectedOptions} selected {selectedOptions, plural, one {option} other {options}} {selectedOptions, plural, one {is} other {are}} ignored because {selectedOptions, plural, one {it is} other {they are}} no longer in the data.',
        values: { selectedOptions },
      }),
    getIncludeLabel: () =>
      i18n.translate('controls.optionsList.popover.includeLabel', {
        defaultMessage: 'Incluir',
      }),
    getExcludeLabel: () =>
      i18n.translate('controls.optionsList.popover.excludeLabel', {
        defaultMessage: 'Excluir',
      }),
    getIncludeExcludeLegend: () =>
      i18n.translate('controls.optionsList.popover.excludeOptionsLegend', {
        defaultMessage: 'Include or exclude selections',
      }),
  },
  controlAndPopover: {
    getExists: (negate: number = +false) =>
      i18n.translate('controls.optionsList.controlAndPopover.exists', {
        defaultMessage: '{negate, plural, one {Existe} other {Existe}}',
        values: { negate },
      }),
  },
};
