/* eslint-disable no-alert */

// MAIN GOAL: as little global code as possible
// -> use modules and factory.

const gameBoardModule = (() => {
  let board = {
    row1: ['', '', ''],
    row2: ['', '', ''],
    row3: ['', '', ''],
  };
  const boardToArray = () => board.row1.concat(board.row2).concat(board.row3);

  let isPlayerOneNext = true;

  const restart = () => {
    board = {
      row1: ['', '', ''],
      row2: ['', '', ''],
      row3: ['', '', ''],
    };

    isPlayerOneNext = true;
    gameBoardModule.over = false;
  };

  let over = false;
  const isOver = () => {
    let winMarker = '';

    // check vertical win
    Object.keys(board).forEach((key) => {
      if (board[key][0] !== '')
        if (
          board[key][0] === board[key][1] &&
          board[key][0] === board[key][2]
        ) {
          over = true;
          // eslint-disable-next-line prefer-destructuring
          winMarker = board[key][0];
        }
    });

    // check horizontal win
    for (let i = 0; i < 3; i += 1) {
      if (board.row1[i] !== '')
        if (
          board.row1[i] === board.row2[i] &&
          board.row1[i] === board.row3[i]
        ) {
          over = true;
          winMarker = board.row1[i];
        }
    }

    // check diagonal win #1
    if (board.row1[0] !== '')
      if (board.row1[0] === board.row2[1] && board.row1[0] === board.row3[2]) {
        over = true;
        // eslint-disable-next-line prefer-destructuring
        winMarker = board.row1[0];
      }

    // check diagonal win #2
    if (board.row3[0] !== '')
      if (board.row3[0] === board.row2[1] && board.row3[0] === board.row1[2]) {
        over = true;
        // eslint-disable-next-line prefer-destructuring
        winMarker = board.row3[0];
      }

    // eslint-disable-next-line no-use-before-define
    if (over) displayControllerModule.congratulateWinner(winMarker);

    return over;
  };

  return {
    boardToArray,
    board,
    isPlayerOneNext,
    isOver,
    restart,
  };
})();

const playerFF = (name, isPlayerOne) => {
  const marker = isPlayerOne ? 'X' : 'O';

  const addMarker = (item) => {
    item.addEventListener('click', () => {
      if (gameBoardModule.isOver()) return;
      // check which players turn it is
      // drop out of event if it's wrong turn, let other overwrite
      if (!gameBoardModule.isPlayerOneNext && isPlayerOne) {
        return;
      }

      // row 1
      if (item.className > 0 && item.className <= 3) {
        if (!gameBoardModule.board.row1[item.className - 1]) {
          // set marker if no marker set yet
          gameBoardModule.board.row1[item.className - 1] = marker;
          gameBoardModule.isPlayerOneNext = !gameBoardModule.isPlayerOneNext;
        }
      }

      // row 2
      if (item.className > 3 && item.className <= 6) {
        if (!gameBoardModule.board.row2[item.className - 4]) {
          // set marker if no marker set yet
          gameBoardModule.board.row2[item.className - 4] = marker;
          gameBoardModule.isPlayerOneNext = !gameBoardModule.isPlayerOneNext;
        }
      }

      // row 3
      if (item.className > 6 && item.className <= 9) {
        if (!gameBoardModule.board.row3[item.className - 7]) {
          // set marker if no marker set yet
          gameBoardModule.board.row3[item.className - 7] = marker;
          gameBoardModule.isPlayerOneNext = !gameBoardModule.isPlayerOneNext;
        }
      }
      // eslint-disable-next-line no-use-before-define
      displayControllerModule.draw();
    });
  };

  return {
    marker,
    name,
    isPlayerOne,
    addMarker,
  };
};

const displayControllerModule = (() => {
  // const p1Name = prompt('Player 1 name: ');
  // const p2Name = prompt('Player 2 name: ');
  const p1 = playerFF('Player 1', true);
  const p2 = playerFF('Player 2', false);
  const fields = document.querySelectorAll('.container > div');

  // Add eventListenerMarker for each player
  fields.forEach((item) => {
    p1.addMarker(item);
    p2.addMarker(item);
  });

  const draw = () => {
    fields.forEach((item, index) => {
      // eslint-disable-next-line no-param-reassign
      item.textContent = gameBoardModule.boardToArray()[index];
    });
  };

  document.querySelector('.restart').addEventListener('click', () => {
    gameBoardModule.restart();
    draw();
  });

  const congratulateWinner = (marker) => {
    const winner = marker === 'X' ? p1 : p2;
    alert(`${winner.name} did win!`);
  };

  return {
    draw,
    congratulateWinner,
  };
})();

// TODO:
// 1. fix restart button
// 2. add UI for winner
