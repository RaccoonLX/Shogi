import { useEffect } from 'react';
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
    overflow: hidden;
  }
  
  #root {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  gap: 15px;
  box-sizing: border-box;
`;

const InfoPanel = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #ffffff);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  
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

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    
    // Set header color
    WebApp.setHeaderColor(WebApp.themeParams.bg_color || '#ffffff');
  }, []);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <InfoPanel>
          <div>Turn: {turn === Color.Black ? 'Black (Sente)' : 'White (Gote)'}</div>
          <ButtonGroup>
            <StyleSelector />
            <ColorSelector />
            <Button onClick={resetGame}>Reset</Button>
          </ButtonGroup>
        </InfoPanel>

        <GameArea>
          {/* Opponent Hand (White/Gote) */}
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

          {/* My Hand (Black/Sente) */}
          <Hand 
            hands={hands} 
            color={Color.Black} 
            onPieceClick={handleHandClick} 
            selected={selected && !('x' in selected) ? selected : null}
          />
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
