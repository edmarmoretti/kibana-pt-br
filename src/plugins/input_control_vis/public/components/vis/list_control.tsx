/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { PureComponent } from 'react';
import _ from 'lodash';

import { injectI18n, InjectedIntlProps } from '@kbn/i18n-react';
import { EuiFieldText, EuiComboBox, EuiThemeProvider } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormRow } from './form_row';

interface ListControlUiState {
  isLoading: boolean;
}
//Edmar Moretti
//Tradução da palavra Select...
export type ListControlUiProps = InjectedIntlProps & {
  id: string;
  label: string;
  selectedOptions: any[];
  options?: any[];
  formatOptionLabel: (option: any) => any;
  disableMsg?: string;
  multiselect?: boolean;
  dynamicOptions?: boolean;
  partialResults?: boolean;
  controlIndex: number;
  stageFilter: (controlIndex: number, value: any) => void;
  fetchOptions?: (searchValue: string) => void;
  isDarkMode?: boolean;
};

class ListControlUi extends PureComponent<ListControlUiProps, ListControlUiState> {
  static defaultProps = {
    dynamicOptions: false,
    multiselect: true,
    selectedOptions: [],
    options: [],
  };

  private isMounted: boolean = false;

  state = {
    isLoading: false,
  };
  private textInput: HTMLElement | null;

  constructor(props: ListControlUiProps) {
    super(props);
    this.textInput = null;
  }

  componentDidMount = () => {
    if (this.textInput) {
      this.textInput.setAttribute('focusable', 'false'); // remove when #59039 is fixed
    }
    this.isMounted = true;
  };

  componentWillUnmount = () => {
    this.isMounted = false;
  };

  setTextInputRef = (ref: HTMLInputElement | null) => {
    this.textInput = ref;
  };

  handleOnChange = (selectedOptions: any[]) => {
    const selectedValues = selectedOptions.map(({ value }) => {
      return value;
    });
    this.props.stageFilter(this.props.controlIndex, selectedValues);
  };

  debouncedFetch = _.debounce(async (searchValue: string) => {
    if (this.props.fetchOptions) {
      await this.props.fetchOptions(searchValue);
    }

    if (this.isMounted) {
      this.setState({
        isLoading: false,
      });
    }
  }, 300);

  onSearchChange = (searchValue: string) => {
    this.setState(
      {
        isLoading: true,
      },
      this.debouncedFetch.bind(null, searchValue)
    );
  };

  renderControl() {
    const { intl } = this.props;

    if (this.props.disableMsg) {
      return (
        <EuiFieldText
          aria-label={intl.formatMessage({
            id: 'inputControl.vis.listControl.selectTextPlaceholder',
            defaultMessage: 'Selecione...',
          })}
          placeholder={intl.formatMessage({
            id: 'inputControl.vis.listControl.selectTextPlaceholder',
            defaultMessage: 'Selecione...',
          })}
          disabled={true}
        />
      );
    }
    //Edmar Moretti - corrige o sort numérico e ordenamento de mêses
    const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    const options = this.props.options
      ?.map((option) => {
        return {
          label: this.props.formatOptionLabel(option).toString(),
          value: option,
          ['data-test-subj']: `option_${option.toString().replace(' ', '_')}`,
        };
      })
      .sort((a, b) => {
        //return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
        if(typeof a.label==='number' && typeof b.label==='number'){
          if(a.label*1 > b.label*1) return 1;
          if(a.label*1 < b.label*1) return -1;
          return 0;
        } else {
          //compara meses
          if(meses.includes(a.label.toLowerCase()) && meses.includes(b.label.toLowerCase())){
            if(meses.indexOf(a.label.toLowerCase()) > meses.indexOf(b.label.toLowerCase())) return 1;
            if(meses.indexOf(a.label.toLowerCase()) < meses.indexOf(b.label.toLowerCase())) return -1;
            return 0;
          }
          return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
        }
      });
    /*   
    const options = this.props.options
      ?.map((option) => {
        return {
          label: this.props.formatOptionLabel(option).toString(),
          value: option,
          ['data-test-subj']: `option_${option.toString().replace(' ', '_')}`,
        };
      })
      .sort((a, b) => {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
      });
    */

    const selectedOptions = this.props.selectedOptions.map((selectedOption) => {
      return {
        label: this.props.formatOptionLabel(selectedOption).toString(),
        value: selectedOption,
      };
    });

    return (
      <EuiComboBox
        placeholder={intl.formatMessage({
          id: 'inputControl.vis.listControl.selectPlaceholder',
          defaultMessage: 'Selecione...',
        })}
        options={options}
        isLoading={this.state.isLoading}
        async={this.props.dynamicOptions}
        onSearchChange={this.props.dynamicOptions ? this.onSearchChange : undefined}
        selectedOptions={selectedOptions}
        onChange={this.handleOnChange}
        singleSelection={!this.props.multiselect}
        data-test-subj={`listControlSelect${this.props.controlIndex}`}
        inputRef={this.setTextInputRef}
      />
    );
  }

  render() {
    const partialResultsWarningMessage = i18n.translate(
      'inputControl.vis.listControl.partialResultsWarningMessage',
      {
        defaultMessage:
          'Terms list might be incomplete because the request is taking too long. ' +
          'Adjust the autocomplete settings in kibana.yml for complete results.',
      }
    );
//Edmar Moretti - remove a mensagem de demora na busca
    return (
      <EuiThemeProvider colorMode={this.props.isDarkMode ? 'dark' : 'light'}>
        <FormRow
          id={this.props.id}
          label={this.props.label}
          warningMsg={this.props.partialResults ? undefined : undefined}
          controlIndex={this.props.controlIndex}
          disableMsg={this.props.disableMsg}
        >
          {this.renderControl()}
        </FormRow>
      </EuiThemeProvider>
    );
  }
}

export const ListControl = injectI18n(ListControlUi);
