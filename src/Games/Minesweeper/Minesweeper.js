import React, { useEffect, useState } from "react";
import "./Minesweeper.scss";

const gameBoard = {
  dimensions: 10,
  mines: 10
};

function Minesweeper() {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    let initialBoard = [];
    for (let i = 0; i < gameBoard.dimensions; i++) {
      initialBoard.push([]);
      for (let j = 0; j < gameBoard.dimensions; j++) {
        initialBoard[i].push({
          x: j,
          y: i,
          hasMine: false,
          isOpen: false
        });
      }
    }

    for (let mines = 0; mines < gameBoard.mines; mines++) {
      let randomRowMine = Math.floor(Math.random() * gameBoard.dimensions);
      let randomColMine = Math.floor(Math.random() * gameBoard.dimensions);

      if (initialBoard[randomRowMine][randomColMine].hasMine === true) {
        mines--;
      }

      initialBoard[randomRowMine][randomColMine].hasMine = true;
    }

    const boardData = [...initialBoard];
    setBoard(boardData);
  }, []);

  console.log(board);
  return (
    <div className="Minesweeper">
      <div className="Minesweeper__container">
        <p>Minesweeper</p>
        <div className="board">
          {board.map(row => {
            return (
              <div className="row">
                {row.map(col => {
                  return (
                    <div className={`col ${col.hasMine && "col-hasmine"}`} />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Minesweeper;
