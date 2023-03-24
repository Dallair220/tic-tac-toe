'use strict';

// store players in objects
// create an object to control the flow of the game

// MAIN GOAL: as little global code as possible
// -> use modules and factory.

const gameBoardModule = (() => {
  const board = {
    row1: ['X', 'O', ''],
    row2: ['', 'X', ''],
    row3: ['', 'O', 'X'],
  };

  const boardToArray = () => {
    return board.row1.concat(board.row2).concat(board.row3);
  };

  return {
    boardToArray,
  };
})();

const playerFF = (name, isPlayerOne) => {
  const marker = isPlayerOne ? 'X' : 'O';

  return {
    marker,
    name,
    isPlayerOne,
  };
};

const displayControllerModule = (() => {
  const draw = () => {
    const fields = document.querySelectorAll('.container > div');

    fields.forEach((item, index) => {
      item.textContent = gameBoardModule.boardToArray()[index];
    });
  };

  draw(); // temporary

  const p1 = playerFF('Player 1', true);
  const p2 = playerFF('Player 2', false);
})();
