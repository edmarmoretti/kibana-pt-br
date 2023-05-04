/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { Component, FormEvent } from 'react';

import {
  EuiFormRow,
  EuiFieldText,
  EuiButton,
  EuiSwitch,
  EuiButtonEmpty,
  EuiModalHeader,
  EuiModalFooter,
  EuiModalBody,
  EuiModalHeaderTitle,
  EuiFocusTrap,
  EuiOutsideClickDetector,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import { i18n } from '@kbn/i18n';
import { IEmbeddable } from '../../../..';

//Edmar Moretti - inclusão de updateTitleNotes
interface CustomizePanelProps {
  embeddable: IEmbeddable;
  updateTitle: (newTitle: string | undefined, hideTitle: boolean | undefined, newTitleNotes: string | undefined) => void;
  //updateTitleNotes: (newTitleNotes: string | undefined, hideTitle: boolean | undefined) => void;
  cancel: () => void;
}
//Edmar Moretti - adicionado titleNotes
interface State {
  title: string | undefined;
  hideTitle: boolean | undefined;
  titleNotes: string | undefined;
}

//Edmar Moretti - adicionado titleNotes
export class CustomizePanelModal extends Component<CustomizePanelProps, State> {
  constructor(props: CustomizePanelProps) {
    super(props);
    this.state = {
      hideTitle: props.embeddable.getInput().hidePanelTitles,
      title: props.embeddable.getInput().title ?? this.props.embeddable.getOutput().defaultTitle,
      titleNotes: props.embeddable.getInput().titleNotes ?? '',
    };
  }
  //Edmar Moretti - inclusão de titleNotes
  private reset = () => {
    this.setState({
      title: this.props.embeddable.getOutput().defaultTitle,
      titleNotes: '',
    });
  };

  private onHideTitleToggle = () => {
    this.setState((prevState) => ({
      hideTitle: !prevState.hideTitle,
    }));
  };
 //Edmar Moretti - adicionado newTitleNotes
  private save = () => {
    const newTitle =
      this.state.title === this.props.embeddable.getOutput().defaultTitle
        ? undefined
        : this.state.title;
    const newTitleNotes =
       this.state.titleNotes === ''
          ? undefined
        : this.state.titleNotes;
    //console.log(newTitleNotes);
    this.props.updateTitle(newTitle, this.state.hideTitle, newTitleNotes);
  };

  public render() {
    const titleId = 'customizePanelModalTitle';

    //Edmar Moretti - adicionado as notas de rodapé
    return (
      <EuiFocusTrap clickOutsideDisables={true} initialFocus={'.panelTitleInputText'}>
        <EuiOutsideClickDetector onOutsideClick={this.props.cancel}>
          <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="euiModal__flex">
            <form
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                this.save();
              }}
            >
              <EuiModalHeader>
                <EuiModalHeaderTitle data-test-subj="customizePanelTitle">
                  <h2 id={titleId}>Customize panel</h2>
                </EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiModalBody>
                <EuiFormRow>
                  <EuiSwitch
                    checked={!this.state.hideTitle}
                    data-test-subj="customizePanelHideTitle"
                    id="hideTitle"
                    label={
                      <FormattedMessage
                        defaultMessage="Show panel title"
                        id="embeddableApi.customizePanel.modal.showTitle"
                      />
                    }
                    onChange={this.onHideTitleToggle}
                  />
                </EuiFormRow>
                <EuiFormRow
                  label={i18n.translate(
                    'embeddableApi.customizePanel.modal.optionsMenuForm.panelTitleFormRowLabel',
                    {
                      defaultMessage: 'Panel title',
                    }
                  )}
                >
                  <EuiFieldText
                    id="panelTitleInput"
                    className="panelTitleInputText"
                    data-test-subj="customEmbeddablePanelTitleInput"
                    name="min"
                    type="text"
                    disabled={this.state.hideTitle}
                    value={this.state.title || ''}
                    onChange={(e) => this.setState({ title: e.target.value })}
                    aria-label={i18n.translate(
                      'embeddableApi.customizePanel.modal.optionsMenuForm.panelTitleInputAriaLabel',
                      {
                        defaultMessage: 'Enter a custom title for your panel',
                      }
                    )}
                    append={
                      <EuiButtonEmpty
                        data-test-subj="resetCustomEmbeddablePanelTitle"
                        onClick={this.reset}
                        disabled={this.state.hideTitle}
                      >
                        <FormattedMessage
                          id="embeddableApi.customizePanel.modal.optionsMenuForm.resetCustomDashboardButtonLabel"
                          defaultMessage="Reset"
                        />
                      </EuiButtonEmpty>
                    }
                  />
                </EuiFormRow>
                
                <EuiFormRow
                  label='Nota de rodapé'
                >
                  <EuiFieldText
                    id="panelTitleNotesInput"
                    className="panelTitleNotesInputText"
                    data-test-subj="customEmbeddablePanelTitleNotesInput"
                    name="min"
                    type="text"
                    disabled={this.state.hideTitle}
                    value={this.state.titleNotes || ''}
                    onChange={(e) => this.setState({ titleNotes: e.target.value })}
                    aria-label={i18n.translate(
                      'embeddableApi.customizePanel.modal.optionsMenuForm.panelTitleInputAriaLabel',
                      {
                        defaultMessage: 'Enter a custom title notes for your panel',
                      }
                    )}
                    append={
                      <EuiButtonEmpty
                        data-test-subj="resetCustomEmbeddablePanelTitleNotes"
                        onClick={this.reset}
                        disabled={this.state.hideTitle}
                      >
                        <FormattedMessage
                          id="embeddableApi.customizePanel.modal.optionsMenuForm.resetCustomDashboardButtonLabel"
                          defaultMessage="Reset"
                        />
                      </EuiButtonEmpty>
                    }
                  />
                </EuiFormRow>
              </EuiModalBody>
              <EuiModalFooter>
                <EuiButtonEmpty onClick={() => this.props.cancel()}>
                  <FormattedMessage
                    id="embeddableApi.customizePanel.modal.cancel"
                    defaultMessage="Cancel"
                  />
                </EuiButtonEmpty>

                <EuiButton data-test-subj="saveNewTitleButton" onClick={this.save} fill>
                  <FormattedMessage
                    id="embeddableApi.customizePanel.modal.saveButtonTitle"
                    defaultMessage="Save"
                  />
                </EuiButton>
              </EuiModalFooter>
            </form>
          </div>
        </EuiOutsideClickDetector>
      </EuiFocusTrap>
    );
  }
}
