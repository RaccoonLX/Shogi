import React from 'react';
import styled from 'styled-components';

interface PromotionDialogProps {
    onPromote: () => void;
    onDecline: () => void;
}

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const Dialog = styled.div`
    background-color: var(--tg-theme-bg-color, #ffffff);
    color: var(--tg-theme-text-color, #000000);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 300px;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 1.3rem;
    text-align: center;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
`;

const Button = styled.button<{ $primary?: boolean }>`
    flex: 1;
    padding: 12px 20px;
    background-color: ${props => props.$primary 
        ? 'var(--tg-theme-button-color, #2481cc)' 
        : 'var(--tg-theme-secondary-bg-color, #e0e0e0)'};
    color: ${props => props.$primary 
        ? 'var(--tg-theme-button-text-color, #ffffff)' 
        : 'var(--tg-theme-text-color, #000000)'};
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    
    &:active {
        opacity: 0.8;
    }
`;

export const PromotionDialog: React.FC<PromotionDialogProps> = ({ onPromote, onDecline }) => {
    return (
        <Overlay onClick={onDecline}>
            <Dialog onClick={(e) => e.stopPropagation()}>
                <Title>¿Promocionar pieza?</Title>
                <ButtonGroup>
                    <Button onClick={onDecline}>No</Button>
                    <Button $primary onClick={onPromote}>Sí</Button>
                </ButtonGroup>
            </Dialog>
        </Overlay>
    );
};
