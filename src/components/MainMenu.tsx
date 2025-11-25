import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 20px;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--tg-theme-text-color, #000);
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
  &:hover {
    opacity: 0.9;
  }
`;

const Input = styled.input`
  padding: 8px;
  font-size: 1rem;
  border: 2px solid var(--tg-theme-hint-color, #ccc);
  border-radius: 6px;
  width: 200px;
`;

interface MainMenuProps {
  onPlaySolo: () => void;
  onCreateGame: () => void;
  onJoinGame: (token: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onPlaySolo, onCreateGame, onJoinGame }) => {
  const [joinToken, setJoinToken] = useState('');

  const handleJoin = () => {
    if (joinToken.trim()) {
      onJoinGame(joinToken.trim());
    } else {
      alert('Please enter a token');
    }
  };

  return (
    <Container>
      <Title>Shogi</Title>
      <Button onClick={onPlaySolo}>♟️ Jugar en Solitario</Button>
      <Button onClick={onCreateGame}>🤝 Desafiar a un Amigo</Button>
      <div>
        <Input
          placeholder="Código de 6 dígitos"
          value={joinToken}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJoinToken(e.target.value.toUpperCase())}
        />
        <Button onClick={handleJoin}>✍️ Aceptar Desafío</Button>
      </div>
    </Container>
  );
};
