/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

//Edmar Moretti - Novo arquivo - função de exportação para PNG. É necessário baixar o arquivo html2canvas e armazenar nessa mesma pasta

import html2canvas from './html2canvas.min';
import { Action } from '@kbn/ui-actions-plugin/public';
//import { Datatable } from '@kbn/expressions-plugin/public';
//import { downloadMultipleAs } from '@kbn/share-plugin/public';
//import { FormatFactory } from '@kbn/field-formats-plugin/common';
import type { IEmbeddable } from '@kbn/embeddable-plugin/public';

import { dashboardExportPngActionStrings } from './_dashboard_actions_strings';
//import { pluginServices } from '../../services/plugin_services';

export const ACTION_EXPORT_PNG = 'ACTION_EXPORT_PNG';

export interface ExportContext {
  embeddable?: IEmbeddable;
  // used for testing
  asString?: boolean;
}

/**
 * This is "Export PNG" action which appears in the context
 * menu of a dashboard panel.
 */
export class ExportPNGAction implements Action<ExportContext> {
  public readonly id = ACTION_EXPORT_PNG;
  public readonly type = ACTION_EXPORT_PNG;
  public readonly order = 5;

  //private fieldFormats;
  //private uiSettings;

  constructor() {
    /*
    ({
      data: { fieldFormats: this.fieldFormats },
      settings: { uiSettings: this.uiSettings },
    } = pluginServices.getServices());
    */
  }

  public getIconType() {
    return 'exportAction';
  }

  public readonly getDisplayName = (context: ExportContext): string =>
    dashboardExportPngActionStrings.getDisplayName();

  public async isCompatible(context: ExportContext): Promise<boolean> {
    return true;
  }
  private exportPNG = async (context: ExportContext) => {
    let quadro = (context.embeddable.domNode || context.embeddable._domNode).parentNode.parentNode;

    html2canvas(quadro).then(function(canvas: { toDataURL: (arg0: string) => string | URL; }) {
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function () {
          let a = document.createElement('a');
          a.href = window.URL.createObjectURL(xhr.response);
          a.download = 'kibana_grafico.png';
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          a.remove();
        };
        xhr.open('GET', canvas.toDataURL('image/png')); // This is to download the canvas Image
        xhr.send();
    });


    //debugger;
  };

  public async execute(context: ExportContext): Promise<void> {
    return await this.exportPNG(context);
  }
}
