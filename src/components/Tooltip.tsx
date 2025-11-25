import React from 'react';
import styled from 'styled-components';
import type { Kind } from 'shogi.js';

interface TooltipProps {
    kind: Kind;
}

const TooltipContainer = styled.div`
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
    margin-bottom: 5px;
    
    &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.9);
    }
`;

const movementDescriptions: Record<string, string> = {
    'FU': '歩 - Avanza 1 casilla',
    'KY': '香 - Avanza cualquier distancia',
    'KE': '桂 - Salta en L (2 adelante, 1 lateral)',
    'GI': '銀 - 1 casilla diagonal o adelante',
    'KI': '金 - 1 casilla (no diagonal atrás)',
    'KA': '角 - Diagonal cualquier distancia',
    'HI': '飛 - Ortogonal cualquier distancia',
    'OU': '王 - 1 casilla en cualquier dirección',
    'TO': 'と - Como oro (promocionado)',
    'NY': '杏 - Como oro (promocionado)',
    'NK': '圭 - Como oro (promocionado)',
    'NG': '全 - Como oro (promocionado)',
    'UM': '馬 - Diagonal + 1 ortogonal',
    'RY': '龍 - Ortogonal + 1 diagonal'
};

export const Tooltip: React.FC<TooltipProps> = ({ kind }) => {
    const description = movementDescriptions[kind] || kind;
    
    return (
        <TooltipContainer>
            {description}
        </TooltipContainer>
    );
};
