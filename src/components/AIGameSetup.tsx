import React, { useState } from 'react';
import styled from 'styled-components';
import { Color } from 'shogi.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  gap: 30px;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--tg-theme-text-color, #000);
  margin-bottom: 10px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: var(--tg-theme-text-color, #000);
  margin: 0;
`;

const OptionGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid ${props => props.$selected
        ? 'var(--tg-theme-button-color, #2481cc)'
        : 'var(--tg-theme-hint-color, #ccc)'};
  border-radius: 8px;
  cursor: pointer;
  background-color: ${props => props.$selected
        ? 'var(--tg-theme-button-color, #2481cc)'
        : 'transparent'};
  color: ${props => props.$selected
        ? 'var(--tg-theme-button-text-color, #fff)'
        : 'var(--tg-theme-text-color, #000)'};
  transition: all 0.2s;
  flex: 1;
  min-width: 100px;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const StartButton = styled.button`
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
  margin-top: 20px;
  min-width: 200px;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const BackButton = styled.button`
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 2px solid var(--tg-theme-hint-color, #999);
  border-radius: 8px;
  cursor: pointer;
  background-color: transparent;
  color: var(--tg-theme-text-color, #000);

  &:hover {
    opacity: 0.8;
  }
`;

export type AIDifficulty = 'easy' | 'medium' | 'hard';
export type ColorChoice = 'black' | 'white' | 'random';

interface AIGameSetupProps {
    onStart: (difficulty: AIDifficulty, playerColor: Color) => void;
    onBack: () => void;
}

export const AIGameSetup: React.FC<AIGameSetupProps> = ({ onStart, onBack }) => {
    const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
    const [colorChoice, setColorChoice] = useState<ColorChoice>('black');

    const handleStart = () => {
        let playerColor: Color;

        if (colorChoice === 'random') {
            playerColor = Math.random() < 0.5 ? Color.Black : Color.White;
        } else {
            playerColor = colorChoice === 'black' ? Color.Black : Color.White;
        }

        onStart(difficulty, playerColor);
    };

    return (
        <Container>
            <Title>🤖 Jugar contra la IA</Title>

            <Section>
                <SectionTitle>Dificultad</SectionTitle>
                <OptionGroup>
                    <OptionButton
                        $selected={difficulty === 'easy'}
                        onClick={() => setDifficulty('easy')}
                    >
                        😊 Fácil
                    </OptionButton>
                    <OptionButton
                        $selected={difficulty === 'medium'}
                        onClick={() => setDifficulty('medium')}
                    >
                        🤔 Medio
                    </OptionButton>
                    <OptionButton
                        $selected={difficulty === 'hard'}
                        onClick={() => setDifficulty('hard')}
                    >
                        🔥 Difícil
                    </OptionButton>
                </OptionGroup>
            </Section>

            <Section>
                <SectionTitle>Tu Color</SectionTitle>
                <OptionGroup>
                    <OptionButton
                        $selected={colorChoice === 'black'}
                        onClick={() => setColorChoice('black')}
                    >
                        ⚫ Negro (Sente)
                    </OptionButton>
                    <OptionButton
                        $selected={colorChoice === 'white'}
                        onClick={() => setColorChoice('white')}
                    >
                        ⚪ Blanco (Gote)
                    </OptionButton>
                    <OptionButton
                        $selected={colorChoice === 'random'}
                        onClick={() => setColorChoice('random')}
                    >
                        🎲 Aleatorio
                    </OptionButton>
                </OptionGroup>
            </Section>

            <StartButton onClick={handleStart}>
                ▶️ Iniciar Partida
            </StartButton>

            <BackButton onClick={onBack}>
                ← Volver al Menú
            </BackButton>
        </Container>
    );
};
