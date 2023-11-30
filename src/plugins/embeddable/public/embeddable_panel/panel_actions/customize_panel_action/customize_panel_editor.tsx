/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useState } from 'react';

import {
  EuiFormRow,
  EuiFieldText,
  EuiSwitch,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlyoutBody,
  EuiForm,
  EuiTextArea,
  EuiFlyoutFooter,
  EuiButtonEmpty,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSuperDatePicker,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { TimeRange } from '@kbn/es-query';
import { FormattedMessage } from '@kbn/i18n-react';

import { TimeRangeInput } from './customize_panel_action';
import { canInheritTimeRange } from './can_inherit_time_range';
import { doesInheritTimeRange } from './does_inherit_time_range';
import { IEmbeddable, Embeddable, CommonlyUsedRange, ViewMode } from '../../../lib';

type PanelSettings = {
  title?: string;
  hidePanelTitles?: boolean;
  description?: string;
  timeRange?: TimeRange;
  titleSummary?: string;
  titleNotes?: string;
};

interface CustomizePanelProps {
  embeddable: IEmbeddable;
  timeRangeCompatible: boolean;
  dateFormat?: string;
  commonlyUsedRanges?: CommonlyUsedRange[];
  onClose: () => void;
}

export const CustomizePanelEditor = (props: CustomizePanelProps) => {
  const { onClose, embeddable, dateFormat, timeRangeCompatible } = props;
  const editMode = embeddable.getInput().viewMode === ViewMode.EDIT;
  const [hideTitle, setHideTitle] = useState(embeddable.getInput().hidePanelTitles);
  const [panelDescription, setPanelDescription] = useState(
    embeddable.getInput().description ?? embeddable.getOutput().defaultDescription
  );
  const [panelTitleNotes, setPanelTitleNotes] = useState(
    embeddable.getInput().titleNotes ?? embeddable.getOutput().defaultTitleNotes
  );
  const [panelTitleSummary, setPanelTitleSummary] = useState(
    embeddable.getInput().titleSummary ?? embeddable.getOutput().defaultTitleSummary
  );
  const [panelTitle, setPanelTitle] = useState(
    embeddable.getInput().title ?? embeddable.getOutput().defaultTitle
  );
  const [inheritTimeRange, setInheritTimeRange] = useState(
    timeRangeCompatible ? doesInheritTimeRange(embeddable as Embeddable<TimeRangeInput>) : false
  );
  const [panelTimeRange, setPanelTimeRange] = useState(
    timeRangeCompatible
      ? (embeddable as Embeddable<TimeRangeInput>).getInput().timeRange
      : undefined
  );

  const commonlyUsedRangesForDatePicker = props.commonlyUsedRanges
    ? props.commonlyUsedRanges.map(
        ({ from, to, display }: { from: string; to: string; display: string }) => {
          return {
            start: from,
            end: to,
            label: display,
          };
        }
      )
    : undefined;

  const save = () => {
    const newPanelSettings: PanelSettings = {
      hidePanelTitles: hideTitle,
      title: panelTitle === embeddable.getOutput().defaultTitle ? undefined : panelTitle,
      description:
        panelDescription === embeddable.getOutput().defaultDescription
          ? undefined
          : panelDescription,
      titleSummary:
      panelTitleSummary === embeddable.getOutput().defaultTitleSummary
        ? undefined
        : panelTitleSummary,
      titleNotes:
      panelTitleNotes === embeddable.getOutput().defaultTitleNotes
        ? undefined
        : panelTitleNotes,
    };
    if (Boolean(timeRangeCompatible))
      newPanelSettings.timeRange = !inheritTimeRange ? panelTimeRange : undefined;

    embeddable.updateInput(newPanelSettings);
    onClose();
  };

  const renderCustomTitleComponent = () => {
    if (!editMode) return null;

    return (
      <>
        <EuiFormRow>
          <EuiSwitch
            checked={!hideTitle}
            data-test-subj="customEmbeddablePanelHideTitleSwitch"
            disabled={!editMode}
            id="hideTitle"
            label={
              <FormattedMessage
                defaultMessage="Show title"
                id="embeddableApi.customizePanel.flyout.optionsMenuForm.showTitle"
              />
            }
            onChange={(e) => setHideTitle(!e.target.checked)}
          />
        </EuiFormRow>
        <EuiFormRow
          label={
            <FormattedMessage
              id="embeddableApi.customizePanel.flyout.optionsMenuForm.panelTitleFormRowLabel"
              defaultMessage="Title"
            />
          }
          labelAppend={
            <EuiButtonEmpty
              size="xs"
              data-test-subj="resetCustomEmbeddablePanelTitleButton"
              onClick={() => setPanelTitle(embeddable.getOutput().defaultTitle)}
              disabled={
                hideTitle || !editMode || embeddable.getOutput().defaultTitle === panelTitle
              }
              aria-label={i18n.translate(
                'embeddableApi.customizePanel.flyout.optionsMenuForm.resetCustomTitleButtonAriaLabel',
                {
                  defaultMessage: 'Reset title',
                }
              )}
            >
              <FormattedMessage
                id="embeddableApi.customizePanel.flyout.optionsMenuForm.resetCustomTitleButtonLabel"
                defaultMessage="Reset"
              />
            </EuiButtonEmpty>
          }
        >
          <EuiFieldText
            id="panelTitleInput"
            className="panelTitleInputText"
            data-test-subj="customEmbeddablePanelTitleInput"
            name="title"
            type="text"
            disabled={hideTitle || !editMode}
            value={panelTitle ?? ''}
            onChange={(e) => setPanelTitle(e.target.value)}
            aria-label={i18n.translate(
              'embeddableApi.customizePanel.flyout.optionsMenuForm.panelTitleInputAriaLabel',
              {
                defaultMessage: 'Enter a custom title for your panel',
              }
            )}
          />
        </EuiFormRow>
        <EuiFormRow
          label={
            <FormattedMessage
              id="embeddableApi.customizePanel.flyout.optionsMenuForm.panelTitleSummaryFormRowLabel"
              defaultMessage="Resumo"
            />
          }
          labelAppend={
            <EuiButtonEmpty
              size="xs"
              data-test-subj="resetCustomEmbeddablePanelTitleSummaryButton"
              onClick={() => {
                setPanelTitleSummary(embeddable.getOutput().defaultTitleSummary);
              }}
              disabled={
                hideTitle ||
                !editMode ||
                embeddable.getOutput().defaultTitleSummary === panelTitleSummary
              }
              aria-label={i18n.translate(
                'embeddableApi.customizePanel.flyout.optionsMenuForm.resetCustomTitleSummaryButtonAriaLabel',
                {
                  defaultMessage: 'Reinicia o resumo',
                }
              )}
            >
              <FormattedMessage
                id="embeddableApi.customizePanel.modal.optionsMenuForm.resetCustomTitleSummaryButtonLabel"
                defaultMessage="Reinicia"
              />
            </EuiButtonEmpty>
          }
        >
          <EuiTextArea
            id="panelTitleSummaryInput"
            className="panelTitleSummaryInputText"
            data-test-subj="customEmbeddablePanelTitleSummaryInput"
            disabled={hideTitle || !editMode}
            name="titleSummary"
            value={panelTitleSummary ?? ''}
            onChange={(e) => setPanelTitleSummary(e.target.value)}
            aria-label={i18n.translate(
              'embeddableApi.customizePanel.flyout.optionsMenuForm.panelTitleSummaryAriaLabel',
              {
                defaultMessage: 'Entre com o resumo do seu quadro',
              }
            )}
          />
        </EuiFormRow>
        <EuiFormRow
          label={
            <FormattedMessage
              id="embeddableApi.customizePanel.flyout.optionsMenuForm.panelDescriptionFormRowLabel"
              defaultMessage="Descrição mostrada no mouse over sobre o ícone do título"
            />
          }
          labelAppend={
            <EuiButtonEmpty
              size="xs"
              data-test-subj="resetCustomEmbeddablePanelDescriptionButton"
              onClick={() => {
                setPanelDescription(embeddable.getOutput().defaultDescription);
              }}
              disabled={
                hideTitle ||
                !editMode ||
                embeddable.getOutput().defaultDescription === panelDescription
              }
              aria-label={i18n.translate(
                'embeddableApi.customizePanel.flyout.optionsMenuForm.resetCustomDescriptionButtonAriaLabel',
                {
                  defaultMessage: 'Reset description',
                }
              )}
            >
              <FormattedMessage
                id="embeddableApi.customizePanel.modal.optionsMenuForm.resetCustomDescriptionButtonLabel"
                defaultMessage="Reset"
              />
            </EuiButtonEmpty>
          }
        >
          <EuiTextArea
            id="panelDescriptionInput"
            className="panelDescriptionInputText"
            data-test-subj="customEmbeddablePanelDescriptionInput"
            disabled={hideTitle || !editMode}
            name="description"
            value={panelDescription ?? ''}
            onChange={(e) => setPanelDescription(e.target.value)}
            aria-label={i18n.translate(
              'embeddableApi.customizePanel.flyout.optionsMenuForm.panelDescriptionAriaLabel',
              {
                defaultMessage: 'Entre com a descrição do seu quadro (mostrado no mouse over sobre o ícone)',
              }
            )}
          />
        </EuiFormRow>
        <EuiFormRow
          label={
            <FormattedMessage
              id="embeddableApi.customizePanel.flyout.optionsMenuForm.panelTitleNotesFormRowLabel"
              defaultMessage="Nota de rodapé"
            />
          }
          labelAppend={
            <EuiButtonEmpty
              size="xs"
              data-test-subj="resetCustomEmbeddablePanelTitleNotesButton"
              onClick={() => {
                setPanelTitleNotes(embeddable.getOutput().defaultTitleNotes);
              }}
              disabled={
                hideTitle ||
                !editMode ||
                embeddable.getOutput().defaultTitleNotes === panelTitleNotes
              }
              aria-label={i18n.translate(
                'embeddableApi.customizePanel.flyout.optionsMenuForm.resetCustomTitleNotesButtonAriaLabel',
                {
                  defaultMessage: 'Reinicia as notas',
                }
              )}
            >
              <FormattedMessage
                id="embeddableApi.customizePanel.modal.optionsMenuForm.resetCustomTitleNotesButtonLabel"
                defaultMessage="Reinicia"
              />
            </EuiButtonEmpty>
          }
        >
          <EuiTextArea
            id="panelTitleNotesInput"
            className="panelTitleNotesInputText"
            data-test-subj="customEmbeddablePanelTitleNotesInput"
            disabled={hideTitle || !editMode}
            name="titleNotes"
            value={panelTitleNotes ?? ''}
            onChange={(e) => setPanelTitleNotes(e.target.value)}
            aria-label={i18n.translate(
              'embeddableApi.customizePanel.flyout.optionsMenuForm.panelTitleNotesAriaLabel',
              {
                defaultMessage: 'Entre com as notas de rodapé do seu quadro',
              }
            )}
          />
        </EuiFormRow>
      </>
    );
  };

  const renderCustomTimeRangeComponent = () => {
    if (!timeRangeCompatible) return null;

    return (
      <>
        {canInheritTimeRange(embeddable as Embeddable<TimeRangeInput>) ? (
          <EuiFormRow>
            <EuiSwitch
              checked={!inheritTimeRange}
              data-test-subj="customizePanelShowCustomTimeRange"
              id="showCustomTimeRange"
              label={
                <FormattedMessage
                  defaultMessage="Apply custom time range"
                  id="embeddableApi.customizePanel.flyout.optionsMenuForm.showCustomTimeRangeSwitch"
                />
              }
              onChange={(e) => setInheritTimeRange(!e.target.checked)}
            />
          </EuiFormRow>
        ) : null}
        {!inheritTimeRange ? (
          <EuiFormRow
            label={
              <FormattedMessage
                id="embeddableApi.customizePanel.flyout.optionsMenuForm.panelTimeRangeFormRowLabel"
                defaultMessage="Time range"
              />
            }
          >
            <EuiSuperDatePicker
              start={panelTimeRange?.from ?? undefined}
              end={panelTimeRange?.to ?? undefined}
              onTimeChange={({ start, end }) => setPanelTimeRange({ from: start, to: end })}
              showUpdateButton={false}
              dateFormat={dateFormat}
              commonlyUsedRanges={commonlyUsedRangesForDatePicker}
              data-test-subj="customizePanelTimeRangeDatePicker"
            />
          </EuiFormRow>
        ) : null}
      </>
    );
  };

  return (
    <>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2>
            <FormattedMessage
              id="embeddableApi.customizePanel.flyout.title"
              defaultMessage="Panel settings"
            />
          </h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiForm>
          {renderCustomTitleComponent()}
          {renderCustomTimeRangeComponent()}
        </EuiForm>
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty data-test-subj="cancelCustomizePanelButton" onClick={onClose}>
              <FormattedMessage
                id="embeddableApi.customizePanel.flyout.cancelButtonTitle"
                defaultMessage="Cancel"
              />
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton data-test-subj="saveCustomizePanelButton" onClick={save} fill>
              <FormattedMessage
                id="embeddableApi.customizePanel.flyout.saveButtonTitle"
                defaultMessage="Apply"
              />
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutFooter>
    </>
  );
};
