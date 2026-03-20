import React, { useMemo, useState } from "react";
import "./App.css";

const PLAYER_X = "X";
const PLAYER_O = "O";

function getInitialBoard() {
  return Array(9).fill(null);
}

function getNextPlayer(xIsNext) {
  return xIsNext ? PLAYER_X : PLAYER_O;
}

function getWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diags
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function isDraw(squares) {
  return squares.every((s) => s !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** Centered Tic Tac Toe UI with local game logic (no backend). */
  const [squares, setSquares] = useState(() => getInitialBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const [startingPlayer, setStartingPlayer] = useState(PLAYER_X);

  const { winner, line } = useMemo(() => getWinner(squares), [squares]);
  const draw = useMemo(() => !winner && isDraw(squares), [winner, squares]);

  const nextPlayer = getNextPlayer(xIsNext);

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (draw) return "It's a draw";
    return `Next: ${nextPlayer}`;
  }, [winner, draw, nextPlayer]);

  function handleSquareClick(index) {
    if (winner || squares[index] !== null) return;

    setSquares((prev) => {
      const copy = prev.slice();
      copy[index] = nextPlayer;
      return copy;
    });
    setXIsNext((prev) => !prev);
  }

  function restartGame({ keepStartingPlayer } = { keepStartingPlayer: true }) {
    setSquares(getInitialBoard());
    if (!keepStartingPlayer) {
      const nextStarter = startingPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
      setStartingPlayer(nextStarter);
      setXIsNext(nextStarter === PLAYER_X);
      return;
    }
    setXIsNext(startingPlayer === PLAYER_X);
  }

  function setStarter(player) {
    setStartingPlayer(player);
    setSquares(getInitialBoard());
    setXIsNext(player === PLAYER_X);
  }

  return (
    <div className="App">
      <main className="ttt-page" aria-label="Tic Tac Toe">
        <section className="ttt-card" aria-label="Tic Tac Toe game">
          <header className="ttt-header">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <p className="ttt-subtitle">Play locally — first to 3 in a row wins.</p>
          </header>

          <div className="ttt-status" role="status" aria-live="polite">
            <div className="ttt-statusLeft">
              <span className="ttt-statusLabel">Status</span>
              <span className="ttt-statusValue">{statusText}</span>
            </div>

            <div className="ttt-statusRight" aria-label="Score summary">
              <span className="ttt-pill">
                X: {squares.filter((s) => s === PLAYER_X).length}
              </span>
              <span className="ttt-pill">
                O: {squares.filter((s) => s === PLAYER_O).length}
              </span>
            </div>
          </div>

          <div className="ttt-boardWrap" aria-label="Game board area">
            <div
              className="ttt-board"
              role="grid"
              aria-label="Tic Tac Toe board"
            >
              {squares.map((value, i) => {
                const isWinningCell = line ? line.includes(i) : false;
                const ariaLabel = value
                  ? `Square ${i + 1}, ${value}`
                  : `Square ${i + 1}, empty`;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`ttt-square ${isWinningCell ? "is-winning" : ""}`}
                    onClick={() => handleSquareClick(i)}
                    aria-label={ariaLabel}
                    aria-disabled={winner || value !== null ? "true" : "false"}
                    disabled={Boolean(winner) || value !== null}
                  >
                    <span className={`ttt-mark ${value ? "is-set" : ""}`}>
                      {value ?? ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="ttt-controls" aria-label="Game controls">
            <div className="ttt-controlRow">
              <div className="ttt-controlGroup" aria-label="Starting player">
                <span className="ttt-controlLabel">Starting player</span>
                <div className="ttt-segment" role="radiogroup" aria-label="Pick starting player">
                  <button
                    type="button"
                    className={`ttt-segmentBtn ${
                      startingPlayer === PLAYER_X ? "is-active" : ""
                    }`}
                    onClick={() => setStarter(PLAYER_X)}
                    aria-pressed={startingPlayer === PLAYER_X}
                  >
                    X starts
                  </button>
                  <button
                    type="button"
                    className={`ttt-segmentBtn ${
                      startingPlayer === PLAYER_O ? "is-active" : ""
                    }`}
                    onClick={() => setStarter(PLAYER_O)}
                    aria-pressed={startingPlayer === PLAYER_O}
                  >
                    O starts
                  </button>
                </div>
              </div>

              <div className="ttt-controlGroup" aria-label="Restart options">
                <span className="ttt-controlLabel">Restart</span>
                <div className="ttt-buttons">
                  <button
                    type="button"
                    className="ttt-btn ttt-btnPrimary"
                    onClick={() => restartGame({ keepStartingPlayer: true })}
                  >
                    Restart
                  </button>
                  <button
                    type="button"
                    className="ttt-btn ttt-btnGhost"
                    onClick={() => restartGame({ keepStartingPlayer: false })}
                    title="Restart and alternate who starts"
                  >
                    Restart &amp; Switch Starter
                  </button>
                </div>
              </div>
            </div>

            <p className="ttt-hint">
              Tip: You can restart anytime. The board is always centered.
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
