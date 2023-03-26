// store players in objects
// create an object to control the flow of the game

// MAIN GOAL: as little global code as possible
// -> use modules and factory.

const gameBoardModule = (() => {
  const board = {
    row1: ['', '', ''],
    row2: ['', '', ''],
    row3: ['', '', ''],
  };

  const boardToArray = () => board.row1.concat(board.row2).concat(board.row3);

  const isPlayerOneNext = true;

  return {
    boardToArray,
    board,
    isPlayerOneNext,
  };
})();

const playerFF = (name, isPlayerOne) => {
  const marker = isPlayerOne ? 'X' : 'O';

  const addMarker = (item) => {
    item.addEventListener('click', () => {
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

  return { draw };
})();
