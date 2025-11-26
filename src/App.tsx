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
import { MainMenu } from './components/MainMenu';
import { WaitingRoom } from './components/WaitingRoom';
import { AIGameSetup } from './components/AIGameSetup';
import { api } from './services/api';
import { usiEngine } from './services/usiEngine';

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

const ExitButton = styled(ResetButton)`
  background-color: #ff4444;
  margin-left: 10px;
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
  const [view, setView] = useState<'menu' | 'waiting' | 'game' | 'ai-setup'>('menu');
  const [gameMode, setGameMode] = useState<'solo' | 'multiplayer' | 'ai'>('solo');
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const [gameToken, setGameToken] = useState<string | null>(null);
  const [lastMoveIndex, setLastMoveIndex] = useState<number>(0);
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);

  const handleMove = async (move: any, board: any[][], hands: any[][]) => {
    if (gameMode === 'multiplayer' && gameToken) {
      try {
        await api.submitMove(gameToken, move, board, hands);
      } catch (e) {
        console.error('Error submitting move:', e);
        alert('Error submitting move. Please try again.');
      }
    }
  };

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
    resetGame,
    applyMove,
    shogi
  } = useShogiGame(handleMove);

  const [whiteControlsExpanded, setWhiteControlsExpanded] = useState(false);
  const [blackControlsExpanded, setBlackControlsExpanded] = useState(false);

  // Function to make AI move
  const makeAIMove = async () => {
    if (gameMode !== 'ai' || !playerColor || isAIThinking) return;

    // Determine AI's color (opposite of player)
    const isPlayerBlack = playerColor === Color.Black;
    if (isPlayerBlack && turn !== Color.White) return;
    if (!isPlayerBlack && turn !== Color.Black) return;

    setIsAIThinking(true);

    try {
      // Get current position from the ffish engine's board
      const currentSfen = usiEngine.getCurrentSfen();
      console.log('Current SFEN:', currentSfen);

      // Get best move from AI
      const bestMove = await usiEngine.getBestMove(currentSfen);

      if (!bestMove) {
        console.error('No move returned from AI');
        setIsAIThinking(false);
        return;
      }

      console.log('AI best move:', bestMove);

      // Parse the USI move
      const parsedMove = usiEngine.parseUSIMove(bestMove);

      if (!parsedMove) {
        console.error('Failed to parse AI move:', bestMove);
        setIsAIThinking(false);
        return;
      }

      console.log('Parsed move:', parsedMove);

      // Apply the move to both boards
      if (parsedMove.piece) {
        // Drop move
        shogi.drop(parsedMove.toX, parsedMove.toY, parsedMove.piece as any);
        usiEngine.makeMove(bestMove);
      } else if (parsedMove.fromX !== undefined && parsedMove.fromY !== undefined) {
        // Regular move
        shogi.move(parsedMove.fromX, parsedMove.fromY, parsedMove.toX, parsedMove.toY, parsedMove.promote);
        usiEngine.makeMove(bestMove);
      }

      // Force update to reflect the AI move
      // Don't call resetGame, just force update
      setIsAIThinking(false);
      setIsAIThinking(true); // Trigger re-render
    } catch (error) {
      console.error('Error making AI move:', error);
    } finally {
      setIsAIThinking(false);
    }
  };

  // Effect to trigger AI move when it's AI's turn
  useEffect(() => {
    if (gameMode === 'ai' && playerColor !== null && !isAIThinking && !pendingPromotion) {
      const aiColor = playerColor === Color.Black ? Color.White : Color.Black;
      if (turn === aiColor) {
        // Small delay to let UI update before AI thinks
        const timer = setTimeout(() => {
          makeAIMove();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [turn, gameMode, playerColor, isAIThinking, pendingPromotion]);

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
      if (view === 'game') {
        if (window.confirm('¿Estás seguro de que quieres salir del juego?')) {
          setView('menu');
          setGameToken(null);
          setGameMode('solo');
          setPlayerColor(null);
          resetGame();
        }
      } else if (view === 'waiting') {
        if (window.confirm('¿Salir de la aplicación?')) {
          WebApp.close();
        }
      } else {
        WebApp.close();
      }
    };

    WebApp.BackButton.onClick(handleBackButton);

    // Cleanup
    return () => {
      WebApp.BackButton.offClick(handleBackButton);
    };
  }, [view, resetGame]);

  // Polling effect
  useEffect(() => {
    let interval: any;
    if (gameToken) {
      interval = setInterval(async () => {
        try {
          const gameState = await api.getGameState(gameToken);

          if (view === 'waiting' && gameState.status === 'active') {
            setGameMode('multiplayer');
            setPlayerColor(Color.Black); // Creator is Black (Sente)
            setView('game');
            resetGame();
          } else if (view === 'game' && gameState.status === 'active') {
            // Check for new moves
            if (gameState.moves.length > lastMoveIndex) {
              const newMoves = gameState.moves.slice(lastMoveIndex);
              newMoves.forEach(move => {
                const moveColor = move.color; // 0 for Black, 1 for White
                const myColorCode = playerColor === Color.Black ? 0 : 1;

                if (moveColor !== myColorCode) {
                  applyMove(move);
                }
              });
              setLastMoveIndex(gameState.moves.length);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    }
    return () => clearInterval(interval as any);
  }, [view, gameToken, resetGame, lastMoveIndex, playerColor, applyMove]);

  const handleCreateGame = async () => {
    try {
      const { token } = await api.createGame();
      setGameToken(token);
      setView('waiting');
    } catch (e) {
      alert('Error creating game');
    }
  };

  const handleJoinGame = async (token: string) => {
    try {
      await api.joinGame(token);
      setGameToken(token);
      setPlayerColor(Color.White); // Joiner is White (Gote)
      setGameMode('multiplayer');
      setView('game');
      resetGame();
    } catch (e: any) {
      alert('Error joining game: ' + (e.message || 'Unknown error'));
    }
  };

  const handleCancelGame = async () => {
    if (gameToken) {
      await api.cancelGame(gameToken);
      setGameToken(null);
      setView('menu');
    }
  };

  const handleExitGame = () => {
    if (confirm('Exit to menu?')) {
      setView('menu');
      setGameToken(null);
      setGameMode('solo');
      setPlayerColor(null);
      resetGame();
    }
  };

  const onBoardClick = (x: number, y: number) => {
    if (gameMode === 'multiplayer' && playerColor !== null && turn !== playerColor) return;
    handleBoardClick(x, y);
  };

  const onHandClick = (piece: any, color: Color) => {
    if (gameMode === 'multiplayer' && playerColor !== null) {
      if (color !== playerColor) return;
      if (turn !== playerColor) return;
    }
    handleHandClick(piece, color);
  };

  const isFlipped = gameMode === 'multiplayer' && playerColor === Color.White;

  return (
    <>
      <GlobalStyle />
      {view === 'menu' && (
        <MainMenu
          onPlaySolo={() => {
            setGameMode('solo');
            setPlayerColor(null);
            setView('game');
            resetGame();
          }}
          onPlayAI={() => {
            setView('ai-setup');
          }}
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
        />
      )}

      {view === 'ai-setup' && (
        <AIGameSetup
          onStart={async (difficulty, color) => {
            setPlayerColor(color);
            setGameMode('ai');
            setView('game');
            resetGame();

            // Initialize AI engine
            try {
              await usiEngine.initialize();
              usiEngine.setDifficulty(difficulty);

              // If AI plays as Black (starts first), make AI move
              if (color === Color.White) {
                // Small delay to let UI render
                setTimeout(() => {
                  makeAIMove();
                }, 500);
              }
            } catch (error) {
              console.error('Failed to initialize AI:', error);
              alert('Error al inicializar la IA. Volviendo al menú principal.');
              setView('menu');
              setGameMode('solo');
            }
          }}
          onBack={() => setView('menu')}
        />
      )}

      {view === 'waiting' && gameToken && (
        <WaitingRoom
          token={gameToken}
          onCancel={handleCancelGame}
        />
      )}

      {view === 'game' && (
        <AppContainer>
          <TopPanel>
            <TurnIndicator>
              Turno: {turn === Color.Black ? '⚫ Black (Sente)' : '⚪ White (Gote)'}
            </TurnIndicator>
            <ResetButton onClick={resetGame}>Reset</ResetButton>
            <ExitButton onClick={handleExitGame}>Exit</ExitButton>
          </TopPanel>

          <GameArea>
            {/* Top Player (Opponent) */}
            {isFlipped ? (
              // If flipped (I am White), show Black (Opponent) at top
              <>
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

                <Hand
                  hands={hands}
                  color={Color.Black}
                  onPieceClick={onHandClick}
                  selected={selected && !('x' in selected) ? selected : null}
                />
              </>
            ) : (
              // If not flipped (I am Black or Solo), show White (Opponent) at top
              <>
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

                <Hand
                  hands={hands}
                  color={Color.White}
                  onPieceClick={onHandClick}
                  selected={selected && !('x' in selected) ? selected : null}
                />
              </>
            )}

            <Board
              board={board}
              onSquareClick={onBoardClick}
              selected={selected && 'x' in selected ? selected : null}
              possibleMoves={possibleMoves}
              flipped={isFlipped}
            />

            {/* Bottom Player (Me) */}
            {isFlipped ? (
              // If flipped (I am White), show White (Me) at bottom
              <>
                <Hand
                  hands={hands}
                  color={Color.White}
                  onPieceClick={onHandClick}
                  selected={selected && !('x' in selected) ? selected : null}
                />

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
              </>
            ) : (
              // If not flipped (I am Black or Solo), show Black (Me) at bottom
              <>
                <Hand
                  hands={hands}
                  color={Color.Black}
                  onPieceClick={onHandClick}
                  selected={selected && !('x' in selected) ? selected : null}
                />

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
              </>
            )}
          </GameArea>

          {/* Promotion Dialog */}
          {pendingPromotion && (
            <PromotionDialog
              onPromote={() => handlePromotionChoice(true)}
              onDecline={() => handlePromotionChoice(false)}
            />
          )}
        </AppContainer>
      )}
    </>
  );
}

export default App;
