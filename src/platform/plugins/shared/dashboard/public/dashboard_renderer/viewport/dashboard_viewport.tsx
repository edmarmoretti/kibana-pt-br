/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
//Edmar Moretti e Leandro Celes inclusão do acordion no bloco de filtros

import { EuiPortal, UseEuiTheme, EuiAccordion, EuiText, EuiTitle, EuiTextColor } from '@elastic/eui';
import { EmbeddableRenderer } from '@kbn/embeddable-plugin/public';
import { ExitFullScreenButton } from '@kbn/shared-ux-button-exit-full-screen';

import { CONTROL_GROUP_TYPE } from '@kbn/controls-plugin/common';
import { ControlGroupApi } from '@kbn/controls-plugin/public';
import { useBatchedPublishingSubjects } from '@kbn/presentation-publishing';
import { useMemoCss } from '@kbn/css-utils/public/use_memo_css';
import { CONTROL_GROUP_EMBEDDABLE_ID } from '../../dashboard_api/control_group_manager';
import { useDashboardApi } from '../../dashboard_api/use_dashboard_api';
import { useDashboardInternalApi } from '../../dashboard_api/use_dashboard_internal_api';
import { DashboardGrid } from '../grid';
import { DashboardEmptyScreen } from './empty_screen/dashboard_empty_screen';

export const DashboardViewport = ({
  dashboardContainerRef,
}: {
  dashboardContainerRef?: React.MutableRefObject<HTMLElement | null>;
}) => {
  const dashboardApi = useDashboardApi();
  const dashboardInternalApi = useDashboardInternalApi();
  const [hasControls, setHasControls] = useState(false);
  const [
    controlGroupApi,
    dashboardTitle,
    description,
    expandedPanelId,
    layout,
    viewMode,
    useMargins,
    fullScreenMode,
  ] = useBatchedPublishingSubjects(
    dashboardApi.controlGroupApi$,
    dashboardApi.title$,
    dashboardApi.description$,
    dashboardApi.expandedPanelId$,
    dashboardInternalApi.layout$,
    dashboardApi.viewMode$,
    dashboardApi.settings.useMargins$,
    dashboardApi.fullScreenMode$,
  );

  const onExit = useCallback(() => {
    dashboardApi.setFullScreenMode(false);
  }, [dashboardApi]);

  const { panelCount, visiblePanelCount, sectionCount } = useMemo(() => {
    const panels = Object.values(layout.panels);
    const visiblePanels = panels.filter(({ gridData }) => {
      return !dashboardInternalApi.isSectionCollapsed(gridData.sectionId);
    });
    return {
      panelCount: panels.length,
      visiblePanelCount: visiblePanels.length,
      sectionCount: Object.keys(layout.sections).length,
    };
  }, [layout, dashboardInternalApi]);

  const classes = classNames('dshDashboardViewport', {
    'dshDashboardViewport--empty': panelCount === 0 && sectionCount === 0,
    'dshDashboardViewport--print': viewMode === 'print',
    'dshDashboardViewport--panelExpanded': Boolean(expandedPanelId),
  });

  //Edmar Moretti - inclusão de botão para expandir/recolher os filtros
  //const embed = window.location.href.match(/embed=true/); //leandro
  const controlsRoot = useRef(null);
  const simpleAccordionId = 'simpleAccordionFiltros';
  let aberto = true;
  const windowWidth = window.innerWidth;

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);

  if (isMobile || windowWidth < 1024) {
    aberto = false
  }

  useEffect(() => {
    if (!controlGroupApi) {
      return;
    }
    const subscription = controlGroupApi.children$.subscribe((children) => {
      setHasControls(Object.keys(children).length > 0);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [controlGroupApi]);

  // Bug in main where panels are loaded before control filters are ready
  // Want to migrate to react embeddable controls with same behavior
  // TODO - do not load panels until control filters are ready
  /*
  const [dashboardInitialized, setDashboardInitialized] = useState(false);
  useEffect(() => {
    let ignore = false;
    dashboard.untilContainerInitialized().then(() => {
      if (!ignore) {
        setDashboardInitialized(true);
      }
    });
    return () => {
      ignore = true;
    };
  }, [dashboard]);
  */

  const styles = useMemoCss(dashboardViewportStyles);

  const filters = useMemo(() => {
    if (viewMode === 'print') return null;

    return <div ref={controlsRoot} className={hasControls ? 'dshDashboardViewport-controls' : ''}>
      <EmbeddableRenderer<object, ControlGroupApi>
        key={dashboardApi.uuid}
        hidePanelChrome={true}
        panelProps={{ hideLoader: true }}
        type={CONTROL_GROUP_TYPE}
        maybeId={CONTROL_GROUP_EMBEDDABLE_ID}
        getParentApi={() => {
          return {
            ...dashboardApi,
            reload$: dashboardInternalApi.controlGroupReload$,
          };
        }}
        onApiAvailable={(api) => dashboardInternalApi.setControlGroupApi(api)}
      />
    </div>
  }, [
    controlGroupApi,
    viewMode,
    hasControls,
    dashboardApi,
    dashboardInternalApi
  ]);

  //Edmar Moretti - verifica se deve ocultar ou não os filtros
  const [ocultarFiltrosAtivo, setOcultarFiltros] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    if (!controlGroupApi) return;
    const sub = controlGroupApi.ignoreParentSettings$.subscribe((settings) => {
      // settings pode ser undefined
      setOcultarFiltros(Boolean(settings?.ocultarFiltros));
    });
    return () => sub.unsubscribe();
  }, [controlGroupApi]);

  const accordionFilters = useMemo(() => {
    if (viewMode === 'print') return null;
    if (viewMode === 'edit' && ocultarFiltrosAtivo === true) {
      return null;
    }
    if (isMobile || windowWidth < 1024) {
      return <div id='accordionFilters' css={{ position: 'relative' }}>
        <EuiAccordion
          buttonClassName={'euiAccordionForm__button'} className={'euiAccordionForm'} id={simpleAccordionId} buttonContent="FILTRO" initialIsOpen={aberto}  >
          {filters}
        </EuiAccordion>
      </div>
    } else {
      return <div id='filtros' css={{marginTop:'8px'}}>
        <EuiText size='xs'><p>FILTRO</p></EuiText>
        {filters}
      </div>
    };
  }, [viewMode, isMobile, filters, aberto, simpleAccordionId, windowWidth, ocultarFiltrosAtivo]);

  return (
    <div
      className={classNames('dshDashboardViewportWrapper', {
        'dshDashboardViewportWrapper--defaultBg': !useMargins,
        'dshDashboardViewportWrapper--isFullscreen': fullScreenMode,
      })}
      css={styles.wrapper}
    >
      {!isMobile && windowWidth > 1024 ? accordionFilters : ''}
      {fullScreenMode && (
        <EuiPortal>
          <ExitFullScreenButton onExit={onExit} toggleChrome={!dashboardApi.isEmbeddedExternally} />
        </EuiPortal>
      )}
      <div
        className={classes}
        css={styles.viewport}
        data-shared-items-container
        data-title={dashboardTitle}
        data-description={description}
        data-shared-items-count={visiblePanelCount}
        data-test-subj={'dshDashboardViewport'}
      >
        {isMobile || windowWidth < 1024 ? accordionFilters : ''}
        {panelCount === 0 && sectionCount === 0 ? (
          <DashboardEmptyScreen />
        ) : (
          <DashboardGrid dashboardContainerRef={dashboardContainerRef} />
        )}
      </div>
    </div>
  );
};
//Edmar Moretti - alteração da margem
const dashboardViewportStyles = {
  wrapper: ({ euiTheme }: UseEuiTheme) => ({
    flex: 'auto',
    display: 'flex',
    flexDirection: 'column' as 'column',
    width: '100%',
    '&.dshDashboardViewportWrapper--defaultBg': {
      backgroundColor: euiTheme.colors.emptyShade,
    },
    '.dshDashboardViewport-controls': {
      margin: `0 0`,
      paddingTop: euiTheme.size.s,
    },
  }),
  viewport: {
    width: '100%',
    '&.dshDashboardViewport--empty': {
      height: '100%',
    },
    '&.dshDashboardViewport--panelExpanded': {
      flex: 1,
    },
    '&.dshDashboardViewport--print': {
      '.kbnGrid': {
        display: 'block !important',
      },
      '.kbnGridSectionHeader, .kbnGridSectionFooter': {
        display: 'none',
      },
      '.kbnGridPanel': {
        height: '100% !important',
      },
    },
  },
};
