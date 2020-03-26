import React, { useEffect, useState } from "react";
import { bounceIn } from "react-animations";
import styled, { keyframes } from "styled-components";

import "./Minesweeper.scss";

const pulseAnimation = keyframes`${bounceIn}`;

const PulseDiv = styled.div`
  animation: 2s ${pulseAnimation};
`;

const gameBoard = {
  dimensions: 10,
  mines: 10
};

function findNeighbours(x, y, callback) {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const row = i + y;
      const col = j + x;

      if (row >= 0 && row < 10 && col >= 0 && col < 10) {
        callback(x + j, y + i);
      }
    }
  }
}
function Minesweeper() {
  const [board, setBoard] = useState([]);
  const [flagCount, setFlagCount] = useState(10);

  useEffect(() => {
    let initialBoard = [];
    for (let i = 0; i < gameBoard.dimensions; i++) {
      initialBoard.push([]);
      for (let j = 0; j < gameBoard.dimensions; j++) {
        initialBoard[i].push({
          x: i,
          y: j,
          hasMine: false,
          isOpen: false,
          isEmpty: false,
          hasFlag: false,
          count: 0
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

    for (let row = 0; row < gameBoard.dimensions; row++) {
      for (let col = 0; col < gameBoard.dimensions; col++) {
        if (!initialBoard[row][col].hasMine) {
          let mine = 0;
          findNeighbours(row, col, (a, b) => {
            if (initialBoard[a][b].hasMine) {
              mine++;
            }
          });

          if (mine === 0) {
            initialBoard[row][col].isEmpty = true;
          }

          initialBoard[row][col].count = mine;
        }
      }
    }

    const boardData = [...initialBoard];
    setBoard(boardData);
  }, []);

  function revealEmpty(cell, board) {
    findNeighbours(cell.x, cell.y, (a, b) => {
      if (
        (!board[a][b].isEmpty || !board[a][b].hasMine) &&
        !board[a][b].isRevealed
      ) {
        board[a][b].isRevealed = true;

        if (board[a][b].isEmpty) {
          revealEmpty(board[a][b], board);
        }
      }
    });
    return board;
  }

  function openCell(cell) {
    let selectedBoard = [...board];
    if (selectedBoard[cell.x][cell.y].hasFlag) return null;
    if (selectedBoard[cell.x][cell.y].isRevealed) return null;
    selectedBoard[cell.x][cell.y].isOpen = true;

    if (selectedBoard[cell.x][cell.y].isEmpty) {
      selectedBoard = revealEmpty(cell, selectedBoard);
    }
    setBoard(selectedBoard);
  }

  function openContextMenu(cell, e) {
    e.preventDefault();
    let selectedBoard = [...board];
    if (selectedBoard[cell.x][cell.y].hasFlag) {
      selectedBoard[cell.x][cell.y].hasFlag = false;
    } else {
      selectedBoard[cell.x][cell.y].hasFlag = true;
    }

    setBoard(selectedBoard);
  }

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
                    <div
                      className={`col ${col.count === 0 &&
                        col.isRevealed &&
                        "empty"}`}
                      onClick={() => openCell(col)}
                      onContextMenu={e => openContextMenu(col, e)}
                    >
                      {!col.hasMine && col.isOpen && col.count !== 0 ? (
                        <PulseDiv>{col.count}</PulseDiv>
                      ) : col.isRevealed && !col.hasMine && col.count !== 0 ? (
                        <PulseDiv>{col.count}</PulseDiv>
                      ) : col.isOpen && col.hasMine ? (
                        <span className="mine" />
                      ) : (
                        col.hasFlag && <PulseDiv className="flag"></PulseDiv>
                      )}
                    </div>
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
