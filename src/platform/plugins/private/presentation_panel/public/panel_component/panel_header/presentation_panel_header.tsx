/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { transparentize, useEuiTheme, EuiTextColor } from '@elastic/eui';
import { css } from '@emotion/react';
import { ViewMode } from '@kbn/presentation-publishing';
import React, { useCallback, useMemo } from 'react';
import { DefaultPresentationPanelApi, PresentationPanelInternalProps } from '../types';
import { PresentationPanelTitle } from './presentation_panel_title';
import { usePresentationPanelHeaderActions } from './use_presentation_panel_header_actions';

export type PresentationPanelHeaderProps<ApiType extends DefaultPresentationPanelApi> = {
  api: ApiType;
  headerId: string;
  viewMode?: ViewMode;
  hideTitle?: boolean;
  panelTitle?: string;
  panelTitleNotes?: string;
  panelTitleSummary?: string;
  panelDescription?: string;
  hideShadow?: boolean;
  setDragHandle: (id: string, ref: HTMLDivElement | null) => void;
} & Pick<PresentationPanelInternalProps, 'showBadges' | 'getActions' | 'showNotifications'>;

const PresentationPanelHeader = <
  ApiType extends DefaultPresentationPanelApi = DefaultPresentationPanelApi
>({
  api,
  viewMode,
  headerId,
  getActions,
  hideTitle,
  panelTitle,
  panelTitleNotes,
  panelTitleSummary,
  panelDescription,
  setDragHandle,
  showBadges = true,
  showNotifications = true,
  hideShadow = false,
}: PresentationPanelHeaderProps<ApiType>) => {
  const { euiTheme } = useEuiTheme();

  const { notificationElements, badgeElements } = usePresentationPanelHeaderActions<ApiType>(
    showNotifications,
    showBadges,
    api,
    getActions
  );

  const memoizedSetDragHandle = useCallback(
    // memoize the ref callback so that we don't call `setDragHandle` on every render
    (ref: HTMLHeadingElement | null) => {
      setDragHandle('panelHeader', ref);
    },
    [setDragHandle]
  );
  //Edmar Moretti - estilos dos títulos, resumo, etc dos quadros

  const { captionStyles, headerStyles, titleSummaryStyles } = useMemo(() => {
    return {
      captionStyles: css`
        .dshLayout--editing &:hover {
          cursor: move;
          background-color: ${transparentize(euiTheme.colors.warning, 0.2)};
        }
          background-color: ${hideShadow ? 'var(--cor-bkg)' : 'var(--cor-panel-bkg)'} !Important;
      `,
      headerStyles: css`
        height: ${euiTheme.size.l};
        overflow: hidden;
        line-height: ${euiTheme.size.l};
        padding: 0px ${euiTheme.size.s};
        height: 60px;
        display: flex;
        flex-wrap: nowrap;
        column-gap: ${euiTheme.size.s};
        align-items: center;
        background-color: ${hideShadow ? 'var(--cor-bkg) !Important' : 'var(--cor-panel-bkg) !Important'} ;
        // all direct children now share the available parent width equally, ensuring consistent layout regardless of their content length
        > * {
          min-width: 0;
          flex: 1 !important;
          max-width: fit-content !important;
        }
      `,
      titleSummaryStyles: css`
        font-size: 12px;
        padding: 8px;
      `,

    };
  }, [euiTheme.colors.warning, euiTheme.size, hideShadow]);

  const showPanelBar =
    (!hideTitle && panelTitle) || badgeElements.length > 0 || notificationElements.length > 0;

  if (!showPanelBar) return null;

  return (
    <>
    <figcaption
      data-test-subj={`embeddablePanelHeading-${(panelTitle || '').replace(/\s/g, '')}`}
      className={'embPanel__header'}
      css={captionStyles}
    >
      <div
        className="embPanel__title"
        ref={memoizedSetDragHandle}
        data-test-subj="dashboardPanelTitle"
        css={headerStyles}
      >
        <PresentationPanelTitle
          api={api}
          headerId={headerId}
          viewMode={viewMode}
          hideTitle={hideTitle}
          panelTitle={panelTitle}
          panelDescription={panelDescription}
          panelTitleSummary={panelTitleSummary}
          panelTitleNotes={panelTitleNotes}
          hideShadow={hideShadow}
        />
        {showBadges && badgeElements}
      </div>
      {showNotifications && notificationElements}
    </figcaption>
    <EuiTextColor css={titleSummaryStyles} color="subdued" className='embPanel__titleSummary'>{panelTitleSummary}</EuiTextColor>
    </>
  );
};
export { PresentationPanelHeader };

