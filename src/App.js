import { useState } from "react";

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i])
      return;
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player is " + (xIsNext ? "X" : "O");
  }

  let boardSquares = [];

  for (let row = 0; row < 3; row++) {
      let boardRow = [];

      for (let i = row * 3; i < (row + 1) * 3; i++) {
          boardRow.push(<Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)}/>);
      };
      boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
  };
  return (
      <>
        <div className="status">{status}</div>
        {boardSquares}
      </>
    )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortState, setSortState] = useState("ASC"); 
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
      setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;

    if (move > 0) {
      description = "Go to move №" + move;
    } else {
      description = "Go to start";
    }

    const moveType = {
      start: (
        <li className="game-current-move" key={move}>
          <div>You are at start</div>
        </li>
      ),
      current: (
        <li className="game-current-move" key={move}>
          <div>You are at move №{move}</div>
        </li>
      ),
      other: (
        <li className="game-move" key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      )
    };
    
    if (move === currentMove && move === 0) {
      return moveType.start;
    } else if (move === currentMove) {
      return moveType.current;
    }
    return moveType.other;
  })

  const sortMethods = {
    "ASC": undefined,
    "DESC": (a, b) => (a > b ? 1 : -1)
  };

  return (
    <>
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
              <button onClick={() => setSortState(sortState === "ASC" ? "DESC" : "ASC")}>
                Sort
              </button>
              <ol>
                {moves.sort(sortMethods[sortState])}
                </ol>
            </div>
        </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for(let i=0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}
