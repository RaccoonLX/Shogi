import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 30px;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: var(--tg-theme-text-color, #000000);
`;

const TokenDisplay = styled.div`
  font-size: 3rem;
  font-weight: bold;
  letter-spacing: 5px;
  color: var(--tg-theme-button-color, #2481cc);
  padding: 20px;
  border: 2px dashed var(--tg-theme-hint-color, #ccc);
  border-radius: 12px;
  background-color: var(--tg-theme-secondary-bg-color, #f5f5f5);
  user-select: text;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: var(--tg-theme-hint-color, #666);
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid #ff4444;
  border-radius: 8px;
  background-color: transparent;
  color: #ff4444;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #ff4444;
    color: white;
  }
`;

interface WaitingRoomProps {
    token: string;
    onCancel: () => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({ token, onCancel }) => {
    return (
        <Container>
            <Title>Waiting for Opponent</Title>
            <Message>Share this code with your friend:</Message>
            <TokenDisplay>{token}</TokenDisplay>
            <Message>Waiting for them to join...</Message>
            <CancelButton onClick={onCancel}>
                ❌ Cancel
            </CancelButton>
        </Container>
    );
};
