/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
// Leandro Celes - Adicionando o popover para os filtros
import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiToolTip,
  EuiPopover,
  EuiButtonIcon,
  EuiIcon,
} from '@elastic/eui';
import { css } from '@emotion/react';
import { useBatchedPublishingSubjects } from '@kbn/presentation-publishing';

import type { ControlLabelPosition } from '../../../common';
import type { DefaultControlApi } from '../../controls/types';
import { ControlGroupStrings } from '../control_group_strings';
import { ControlsInOrder } from '../init_controls_manager';
import type { ControlGroupApi } from '../types';
import { ControlClone } from './control_clone';
import { ControlRenderer } from './control_renderer';

import './control_group.scss';

interface Props {
  applySelections: () => void;
  cancelSelections: () => void;
  controlGroupApi: ControlGroupApi;
  controlsManager: {
    controlsInOrder$: BehaviorSubject<ControlsInOrder>;
    getControlApi: (uuid: string) => DefaultControlApi | undefined;
    setControlApi: (uuid: string, controlApi: DefaultControlApi) => void;
  };
  hasUnappliedSelections: boolean;
  labelPosition: ControlLabelPosition;
}

export function ControlGroup({
  applySelections,
  cancelSelections,
  controlGroupApi,
  controlsManager,
  labelPosition,
  hasUnappliedSelections,
}: Props) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [autoApplySelections, controlsInOrder] = useBatchedPublishingSubjects(
    controlGroupApi.autoApplySelections$,
    controlsManager.controlsInOrder$
  );

  /** Handle drag and drop */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const onDragEnd = useCallback(
    ({ over, active }: DragEndEvent) => {
      const oldIndex = active?.data.current?.sortable.index;
      const newIndex = over?.data.current?.sortable.index;
      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
        controlsManager.controlsInOrder$.next(arrayMove([...controlsInOrder], oldIndex, newIndex));
      }
      (document.activeElement as HTMLElement)?.blur(); // hide hover actions on drop; otherwise, they get stuck
      setDraggingId(null);
    },
    [controlsInOrder, controlsManager.controlsInOrder$]
  );

  useEffect(() => {
    let ignore = false;
    controlGroupApi.untilInitialized().then(() => {
      if (!ignore) {
        setIsInitialized(true);
      }
    });

    return () => {
      ignore = true;
    };
  }, [controlGroupApi]);

  // Leandro Celes - Adicionando animação e popover para evidenciar aplicação dos filtros
  // --------------------------------------------------

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPopoverManualClosed, setIsPopoverManualClosed] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isInitialized) {
      if (!hasUnappliedSelections) {
        setIsPopoverOpen(false);
      }
    }
  }, [hasUnappliedSelections, isInitialized, applySelections]);

  // Criar uma ref para armazenar o valor atual de hasUnappliedSelections, pois o useEffect com timeout nnao acessa o ultimo valor
  const hasUnappliedSelectionsRef = useRef(hasUnappliedSelections);
  useEffect(() => {
    hasUnappliedSelectionsRef.current = hasUnappliedSelections;
  }, [hasUnappliedSelections]);

  // Animação para verificar quando clicar em uma opção
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'li' || target.closest('li[role="option"]') !== null) {
        const liElement = target.closest('li[role="option"]') as HTMLElement;
        const portalElement = target.closest('[data-euiportal="true"]') as HTMLElement;
        const portalElementContainer = target.closest('.euiPopover__panel') as HTMLElement;
        const elementRectInitial = portalElementContainer?.getBoundingClientRect();
        if (liElement && portalElement) {
          createFilterAnimation(liElement);

          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.removedNodes.forEach((node) => {
                if (node === portalElement) {
                  // createFilterAnimation(portalElement, elementRectInitial);
                  setTimeout(() => {
                    const currentHasUnappliedSelections = hasUnappliedSelectionsRef.current;
                    if (currentHasUnappliedSelections && !isPopoverManualClosed) {
                      setIsPopoverOpen(true);
                    }
                  }, 0);
                  observer.disconnect();
                }
              });
            });
          });
          if (portalElement.parentElement) {
            observer.observe(portalElement.parentElement, {
              childList: true,
              subtree: false,
            });
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isPopoverManualClosed]);

  const manualClosePopover = () => {
    setIsPopoverManualClosed(true);
    setIsPopoverOpen(false);
  };

  // Leandro Celes - Função para criar animação de elemento opcao para o botão de filtro
  const createFilterAnimation = useCallback((element: HTMLElement, elementRectInitial: DOMRect) => {
    if (!element) return;

    // Obter o botão de filtro
    const filterButton = document.querySelector(
      '[data-test-subj="controlGroup--applyFiltersButton"]'
    );
    if (!filterButton) return;

    // Obter as dimensões e posição do elemento original
    const elementRect = elementRectInitial ? elementRectInitial : element.getBoundingClientRect();

    // Obter as dimensões e posição do botão de filtro
    const buttonRect = filterButton.getBoundingClientRect();

    // Criar div para animação
    const animationDiv = document.createElement('div');
    animationDiv.style.position = 'fixed';
    animationDiv.style.left = `${elementRect.left}px`;
    animationDiv.style.top = `${elementRect.top}px`;
    animationDiv.style.width = `${elementRect.width}px`;
    animationDiv.style.height = `${elementRect.height}px`;
    animationDiv.style.backgroundColor = '#3a73cf';
    animationDiv.style.opacity = '0.7';
    animationDiv.style.borderRadius = '4px';
    animationDiv.style.zIndex = '91000';
    animationDiv.style.pointerEvents = 'none';

    // Adicionar ao corpo do documento
    document.body.appendChild(animationDiv);

    // Configurar a animação
    animationDiv.animate(
      [
        {
          left: `${elementRect.left}px`,
          top: `${elementRect.top}px`,
          width: `${elementRect.width}px`,
          height: `${elementRect.height}px`,
          opacity: 0.7,
        },
        {
          left: `${buttonRect.left}px`,
          top: `${buttonRect.top}px`,
          width: `${buttonRect.width}px`,
          height: `${buttonRect.height}px`,
          opacity: 0,
        },
      ],
      {
        duration: 500,
        easing: 'ease-out',
        fill: 'forwards',
      }
    ).onfinish = () => {
      // Remover o elemento após a animação
      document.body.removeChild(animationDiv);
    };
  }, []);
  // fim logica de animação e destaque dos filtros

  // Leandro Celes - Adicionando para aplicar os filtros automaticamente no inicio do render, mesmo que o autoApplySelections seja falso
  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    if (firstRender && hasUnappliedSelections) {
      applySelections();
      // do um tempo ate o hasUnappliedSelections mudar para não da flicker no botao de filtro
      setTimeout(() => {
        setFirstRender(false);
      }, 1000);
    }
  }, [hasUnappliedSelections, applySelections, firstRender]);

  // Tb depois de um tempo, falo que renderizou, pois o hasUnappliedSelections pode ser false sempre se nnao tem nenhum control/filtro salvo no painel
  setTimeout(() => {
    setFirstRender(false);
  }, 2000);

  // Edmar Moretti - altera o ícone de aplicar os filtros para um botão
  // Leandro Celes - Adicionando o botão de resetar filtros e popover para os filtros
  const ApplyButtonComponent = useMemo(() => {

 
    return (
      <div style={{ display: 'flex', gap: '0px', alignItems: 'center' }}>
        <EuiButtonEmpty
          size="s"
          style={{ marginRight: '10px' }}
          iconSize="m"
          color={'text'}
          data-test-subj="controlGroup--resetFiltersButton"
          aria-label={ControlGroupStrings.management.getApplyButtonTitle(hasUnappliedSelections)}
          onClick={cancelSelections}
        >
          <EuiIcon type="eraser" /> Limpar
        </EuiButtonEmpty>

        <EuiButton
          buttonRef={buttonRef}
          size="m"
          disabled={firstRender || (!hasUnappliedSelections && !firstRender)}  // Leandro Celes - Efito o flicker do botao ativo desativo
          iconSize="m"
          color={'success'}
          iconType={'check'}
          data-test-subj="controlGroup--applyFiltersButton"
          aria-label={ControlGroupStrings.management.getApplyButtonTitle(hasUnappliedSelections)}
          onClick={applySelections}
          // className={hasUnappliedSelections ? 'animate-filter-button' : ''}
        >
          Filtrar
        </EuiButton>

        {isPopoverOpen ? (
          <EuiPopover
            button={<></>}
            isOpen={true}
            closePopover={() => {}}
            anchorRef={buttonRef}
            anchorPosition="rightDown"
            repositionOnScroll={true}
            panelStyle={{ '--euiPopoverBackgroundColor': '#4D84DC', color: 'white' }}
            panelClassName="essentialAnimation show-popover-filter-animation"
          >
            <p>
              Aplique os filtros para ver os resultados&emsp;&emsp;
              <EuiButtonIcon
                style={{ color: 'white', position: 'absolute', right: '5px', top: '1px' }}
                iconType="cross"
                onClick={() => manualClosePopover()}
              />
            </p>
          </EuiPopover>
        ) : (
          <></>
        )}
      </div>
    );
  }, [hasUnappliedSelections, applySelections, cancelSelections, isPopoverOpen, firstRender]);

  /*
  const ApplyButtonComponent = useMemo(() => {
    return (
      <EuiButtonIcon
        size="s"
        disabled={!hasUnappliedSelections}
        iconSize="m"
        display="fill"
        color={'success'}
        iconType={'check'}
        data-test-subj="controlGroup--applyFiltersButton"
        aria-label={ControlGroupStrings.management.getApplyButtonTitle(hasUnappliedSelections)}
        onClick={applySelections}
      />
    );
  }, [hasUnappliedSelections, applySelections]);
  */

  if (controlsInOrder.length === 0) {
    return null;
  }

  return (
    <EuiPanel
      css={css`
        display: ${isInitialized ? 'none' : 'default'};
      `}
      borderRadius="m"
      paddingSize="none"
      color={draggingId ? 'success' : 'transparent'}
      className="controlsWrapper"
      data-test-subj="controls-group-wrapper"
    >
      <EuiFlexGroup
        wrap={false}
        gutterSize="s"
        direction="column"
        responsive={false}
        alignItems="stretch"
        justifyContent="center"
        data-test-subj="controls-group"
      >
        <EuiFlexItem>
          <DndContext
            onDragStart={({ active }) => setDraggingId(`${active.id}`)}
            onDragEnd={onDragEnd}
            onDragCancel={() => setDraggingId(null)}
            sensors={sensors}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.BeforeDragging,
              },
            }}
          >
            <SortableContext items={controlsInOrder} strategy={rectSortingStrategy}>
              <EuiFlexGroup className="controlGroup" alignItems="center" gutterSize="s" wrap={true}>
                {controlsInOrder.map(({ id, type }) => (
                  <ControlRenderer
                    key={id}
                    uuid={id}
                    type={type}
                    getParentApi={() => controlGroupApi}
                    onApiAvailable={(controlApi) => {
                      controlsManager.setControlApi(id, controlApi);
                    }}
                    isControlGroupInitialized={isInitialized}
                  />
                ))}
              </EuiFlexGroup>
            </SortableContext>
            <DragOverlay>
              {draggingId ? (
                <ControlClone
                  key={draggingId}
                  labelPosition={labelPosition}
                  controlApi={controlsManager.getControlApi(draggingId)}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </EuiFlexItem>
        {!autoApplySelections && (
          <EuiFlexItem grow={false} className="controlGroup--endButtonGroup">
            {hasUnappliedSelections ? (
              ApplyButtonComponent
            ) : (
              <EuiToolTip content={ControlGroupStrings.management.getApplyButtonTitle(false)}>
                {ApplyButtonComponent}
              </EuiToolTip>
            )}
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    </EuiPanel>
  );
}
