/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiEmptyPrompt, EuiText } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React from 'react';

interface VisualizationNoResultsProps {
  onInit?: () => void;
}
//Edmar Moretti - tradução Nenhum resultado encontrado
export class VisualizationNoResults extends React.Component<VisualizationNoResultsProps> {
  public render() {
    return (
      <div data-test-subj="visNoResult" className="visError">
        <EuiEmptyPrompt
          iconType="visualizeApp"
          iconColor="default"
          data-test-subj="visualization-error"
          body={
            <EuiText size="xs" className="visualization-error-text">
              {i18n.translate('visualizations.noResultsFoundTitle', {
                defaultMessage: 'Nenhum resultado encontrado',
              })}
            </EuiText>
          }
        />
      </div>
    );
  }

  public componentDidMount() {
    this.afterRender();
  }

  public componentDidUpdate() {
    this.afterRender();
  }

  private afterRender() {
    if (this.props.onInit) {
      this.props.onInit();
    }
  }
}

// eslint-disable-next-line import/no-default-export
export default VisualizationNoResults;
