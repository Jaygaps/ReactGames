import React, { useEffect, useState } from "react";
import { bounceIn } from "react-animations";
import styled, { keyframes } from "styled-components";
import Timer from "react-compound-timer";
import axios from "axios";
import cheerio from "cheerio";
import "./Minesweeper.scss";

const pulseAnimation = keyframes`${bounceIn}`;

const PulseDiv = styled.div`
  animation: 1.5s ${pulseAnimation};
`;

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
  const [gameBoard, setGameBoard] = useState({ dimensions: 10, mines: 10 });
  const [board, setBoard] = useState([]);
  const [flagCount, setFlagCount] = useState(10);
  const [gameLevel, setGameLevel] = useState(0);
  const [gameStatus, setGameStatus] = useState("INITIAL");

  useEffect(() => {
    if (gameStatus !== "ACTIVE") {
      if (gameLevel === 0) {
        setGameBoard({ dimensions: 10, mines: 10 });
        setFlagCount(10);
      }

      if (gameLevel === 1) {
        setGameBoard({ dimensions: 10, mines: 15 });
        setFlagCount(15);
      }

      if (gameLevel === 2) {
        setGameBoard({ dimensions: 10, mines: 20 });
        setFlagCount(20);
      }
    }
  }, [gameLevel, gameStatus]);

  useEffect(() => {
    if (gameStatus === "INITIAL") {
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
    }
  }, [gameStatus]);

  function revealEmpty(cell, board) {
    if (!board[cell.x][cell.y].hasFlag) {
      findNeighbours(cell.x, cell.y, (a, b) => {
        if (
          (!board[a][b].isEmpty ||
            !board[a][b].hasMine ||
            !board[a][b].hasFlag) &&
          !board[a][b].isRevealed
        ) {
          board[a][b].isRevealed = true;

          if (board[a][b].isEmpty && !board[a][b].hasFlag) {
            revealEmpty(board[a][b], board);
          }
        }
      });
    }
    return board;
  }

  function openCell(cell, props) {
    setGameStatus("ACTIVE");
    let selectedBoard = [...board];
    if (selectedBoard[cell.x][cell.y].hasFlag) return null;
    if (selectedBoard[cell.x][cell.y].isRevealed) return null;

    if (
      selectedBoard[cell.x][cell.y].isEmpty &&
      !selectedBoard[cell.x][cell.y].hasFlag
    ) {
      selectedBoard = revealEmpty(cell, selectedBoard);
    }
    if (selectedBoard[cell.x][cell.y].hasMine) {
      props.pause();
      setGameStatus("LOST");
    } else {
      props.start();
    }
    selectedBoard[cell.x][cell.y].isOpen = true;

    selectedBoard = checkGameResult(selectedBoard);

    setBoard(selectedBoard);
  }

  function checkGameResult(board) {
    let checkWinCounter = 0;
    board.map(row => {
      row.map(col => {
        if (col.isRevealed || col.isOpen) {
          checkWinCounter++;
        }
      });
    });

    if (
      gameBoard.dimensions * gameBoard.dimensions - gameBoard.mines ===
      checkWinCounter
    ) {
      setGameStatus("WON");
    }

    return board;
  }

  function openContextMenu(cell, e) {
    e.preventDefault();
    let selectedBoard = [...board];

    if (
      !selectedBoard[cell.x][cell.y].isOpen &&
      !selectedBoard[cell.x][cell.y].isRevealed
    ) {
      if (flagCount > 0) {
        if (selectedBoard[cell.x][cell.y].hasFlag) {
          selectedBoard[cell.x][cell.y].hasFlag = false;
          setFlagCount(flagCount + 1);
        } else {
          selectedBoard[cell.x][cell.y].hasFlag = true;
          setFlagCount(flagCount - 1);
        }
      }
    }

    setBoard(selectedBoard);
  }

  console.log(board);

  function changeLevel(level) {
    if (gameStatus !== "ACTIVE") {
      setGameLevel(level);
    }
  }

  axios
    .get(
      "https://cors-anywhere.herokuapp.com/https://covid19map.co.nz/assets/js/__cases.v4.json?v=202"
    )
    .then(res => {
      console.log(res);
    });

  return (
    <div className="Minesweeper">
      <div className="Minesweeper__container">
        <p className="title">Minesweeper</p>
        <Timer
          initialTime={0}
          startImmediately={false}
          onStart={() => console.log("onStart hook")}
          onResume={() => console.log("onResume hook")}
          onPause={() => console.log("onPause hook")}
          onStop={() => console.log("onStop hook")}
          onReset={() => console.log("onReset hook")}
        >
          {props => (
            <>
              <div className="timer">
                <div className="flex-item">
                  <Timer.Minutes /> : <Timer.Seconds />
                </div>
                <div className="flex-item">{flagCount}</div>
              </div>
              <div className="levels">
                <div
                  className={`ranks ${gameLevel === 0 && "active"}`}
                  onClick={() => changeLevel(0)}
                >
                  Easy
                </div>
                <div
                  className={`ranks ${gameLevel === 1 && "active"}`}
                  onClick={() => changeLevel(1)}
                >
                  Medium
                </div>
                <div
                  className={`ranks ${gameLevel === 2 && "active"}`}
                  onClick={() => changeLevel(2)}
                >
                  Hard
                </div>
              </div>
              <div className="board">
                <>
                  {board.map(row => {
                    return (
                      <div className="row">
                        {row.map(col => {
                          return (
                            <div
                              className={`col ${col.count === 0 &&
                                col.isRevealed &&
                                "empty"}`}
                              onClick={() => {
                                openCell(col, props);
                              }}
                              onContextMenu={e => openContextMenu(col, e)}
                            >
                              {!col.hasMine && col.isOpen && col.count !== 0 ? (
                                <PulseDiv>{col.count}</PulseDiv>
                              ) : col.isRevealed &&
                                !col.hasMine &&
                                !col.hasFlag &&
                                col.count !== 0 ? (
                                <PulseDiv>{col.count}</PulseDiv>
                              ) : col.isOpen && col.hasMine ? (
                                <span className="mine" />
                              ) : (
                                col.hasFlag && (
                                  <PulseDiv className="flag"></PulseDiv>
                                )
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {gameStatus === "LOST" && (
                    <PulseDiv className="game-lost">
                      <h2>You lost :(</h2>
                      <p>You found a mine!</p>
                      <div
                        className="restart"
                        onClick={() => {
                          setGameStatus("INITIAL");
                          props.reset();
                        }}
                      >
                        Restart
                      </div>
                    </PulseDiv>
                  )}
                  {gameStatus === "WON" && (
                    <PulseDiv className="game-lost">
                      <h2>You Won!!!!!</h2>
                      <p>Wow</p>
                      <div
                        className="restart"
                        onClick={() => {
                          setGameStatus("INITIAL");
                          props.reset();
                        }}
                      >
                        Restart
                      </div>
                    </PulseDiv>
                  )}
                </>
              </div>
            </>
          )}
        </Timer>
      </div>
    </div>
  );
}

export default Minesweeper;
