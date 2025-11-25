import { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import WebApp from '@twa-dev/sdk';
import { useShogiGame } from './hooks/useShogiGame';
import { Board } from './components/Board';
import { Hand } from './components/Hand';
import { PromotionDialog } from './components/PromotionDialog';
import { StyleSelector } from './components/StyleSelector';
import { ColorSelector } from './components/ColorSelector';
import { Color } from 'shogi.js';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: var(--tg-theme-bg-color, #ffffff);
    color: var(--tg-theme-text-color, #000000);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    overflow-y: auto;
  }
  
  #root {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  padding: 10px;
  gap: 10px;
  box-sizing: border-box;
`;

const TopPanel = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
`;

const PlayerControls = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`;

const PlayerHeader = styled.button<{ $player: Color }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${props => props.$player === Color.Black
    ? 'var(--tg-theme-button-color, #2481cc)'
    : 'var(--tg-theme-secondary-bg-color, #efeff3)'};
  color: ${props => props.$player === Color.Black
    ? 'var(--tg-theme-button-text-color, #ffffff)'
    : 'var(--tg-theme-text-color, #000000)'};
  border: ${props => props.$player === Color.White ? '2px solid var(--tg-theme-hint-color, #999)' : 'none'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  width: 100%;
  
  &:active {
    opacity: 0.8;
  }
`;

const PlayerIcon = styled.span`
  font-size: 1.1rem;
`;

const ExpandIcon = styled.span<{ $isExpanded: boolean }>`
  margin-left: auto;
  transition: transform 0.2s;
  transform: ${props => props.$isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const ControlsContent = styled.div<{ $isExpanded: boolean }>`
  display: ${props => props.$isExpanded ? 'flex' : 'none'};
  gap: 8px;
  flex-wrap: wrap;
  padding: 5px;
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  background-color: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #ffffff);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  
  &:active {
    opacity: 0.8;
  }
`;

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: center;
  width: 100%;
  max-width: 500px;
`;

const TurnIndicator = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  padding: 6px 12px;
  background-color: var(--tg-theme-secondary-bg-color, #f0f0f0);
  border-radius: 8px;
`;

function App() {
  const {
    board,
    hands,
    turn,
    selected,
    possibleMoves,
    pendingPromotion,
    handleBoardClick,
    handleHandClick,
    handlePromotionChoice,
    resetGame
  } = useShogiGame();

  const [whiteControlsExpanded, setWhiteControlsExpanded] = useState(false);
  const [blackControlsExpanded, setBlackControlsExpanded] = useState(false);

  useEffect(() => {
    // Initialize Telegram Web App
    WebApp.ready();
    WebApp.expand();

    // Configure appearance
    WebApp.setHeaderColor(WebApp.themeParams.bg_color || '#ffffff');
    WebApp.setBackgroundColor(WebApp.themeParams.bg_color || '#ffffff');

    // Enable close confirmation to prevent accidental exits
    WebApp.enableClosingConfirmation();

    // Configure viewport for better mobile experience
    if (WebApp.isVersionAtLeast('6.1')) {
      WebApp.disableVerticalSwipes();
    }

    // Show back button
    WebApp.BackButton.show();

    // Handle back button click
    const handleBackButton = () => {
      if (window.confirm('¿Estás seguro de que quieres salir del juego?')) {
        WebApp.close();
      }
    };

    WebApp.BackButton.onClick(handleBackButton);

    // Cleanup
    return () => {
      WebApp.BackButton.offClick(handleBackButton);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <TopPanel>
          <TurnIndicator>
            Turno: {turn === Color.Black ? '⚫ Black (Sente)' : '⚪ White (Gote)'}
          </TurnIndicator>
          <ResetButton onClick={resetGame}>Reset</ResetButton>
        </TopPanel>

        <GameArea>
          {/* White Player Controls */}
          <PlayerControls $isExpanded={whiteControlsExpanded}>
            <PlayerHeader
              $player={Color.White}
              onClick={() => setWhiteControlsExpanded(!whiteControlsExpanded)}
            >
              <PlayerIcon>⚪</PlayerIcon>
              White (Gote)
              <ExpandIcon $isExpanded={whiteControlsExpanded}>▼</ExpandIcon>
            </PlayerHeader>
            <ControlsContent $isExpanded={whiteControlsExpanded}>
              <StyleSelector player={Color.White} />
              <ColorSelector player={Color.White} />
            </ControlsContent>
          </PlayerControls>

          {/* White Hand */}
          <Hand
            hands={hands}
            color={Color.White}
            onPieceClick={handleHandClick}
            selected={selected && !('x' in selected) ? selected : null}
          />

          <Board
            board={board}
            onSquareClick={handleBoardClick}
            selected={selected && 'x' in selected ? selected : null}
            possibleMoves={possibleMoves}
          />

          {/* Black Hand */}
          <Hand
            hands={hands}
            color={Color.Black}
            onPieceClick={handleHandClick}
            selected={selected && !('x' in selected) ? selected : null}
          />

          {/* Black Player Controls */}
          <PlayerControls $isExpanded={blackControlsExpanded}>
            <PlayerHeader
              $player={Color.Black}
              onClick={() => setBlackControlsExpanded(!blackControlsExpanded)}
            >
              <PlayerIcon>⚫</PlayerIcon>
              Black (Sente)
              <ExpandIcon $isExpanded={blackControlsExpanded}>▼</ExpandIcon>
            </PlayerHeader>
            <ControlsContent $isExpanded={blackControlsExpanded}>
              <StyleSelector player={Color.Black} />
              <ColorSelector player={Color.Black} />
            </ControlsContent>
          </PlayerControls>
        </GameArea>

        {/* Promotion Dialog */}
        {pendingPromotion && (
          <PromotionDialog
            onPromote={() => handlePromotionChoice(true)}
            onDecline={() => handlePromotionChoice(false)}
          />
        )}
      </AppContainer>
    </>
  );
}

export default App;
