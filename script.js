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

  const restart = () => {
    board.row1 = ['', '', ''];
    board.row2 = ['', '', ''];
    board.row3 = ['', '', ''];

    over = false;
  };

  return {
    boardToArray,
    board,
    isOver,
    restart,
  };
})();

const playerFF = (name, isPlayerOne) => {
  const marker = isPlayerOne ? 'X' : 'O';

  const addMarker = (item) => {
    item.addEventListener('click', () => {
      if (gameBoardModule.isOver()) return;

      // row 1
      if (item.className > 0 && item.className <= 3) {
        if (!gameBoardModule.board.row1[item.className - 1]) {
          // set marker if no marker set yet
          gameBoardModule.board.row1[item.className - 1] = marker;
        }
      }

      // row 2
      if (item.className > 3 && item.className <= 6) {
        if (!gameBoardModule.board.row2[item.className - 4]) {
          // set marker if no marker set yet
          gameBoardModule.board.row2[item.className - 4] = marker;
        }
      }

      // row 3
      if (item.className > 6 && item.className <= 9) {
        if (!gameBoardModule.board.row3[item.className - 7]) {
          // set marker if no marker set yet
          gameBoardModule.board.row3[item.className - 7] = marker;
        }
      }
      // eslint-disable-next-line no-use-before-define
      displayControllerModule.draw();
      gameBoardModule.isOver();

      displayControllerModule.aiMove();
      gameBoardModule.isOver();
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
  const fields = document.querySelectorAll('.container > div');

  // Add eventListenerMarker for player
  fields.forEach((item) => {
    p1.addMarker(item);
  });

  const draw = () => {
    fields.forEach((item, index) => {
      // eslint-disable-next-line no-param-reassign
      item.textContent = gameBoardModule.boardToArray()[index];
    });
  };

  const congratulateWinner = (marker) => {
    const winDisplay = document.querySelector('h2');

    if (marker === 'X') {
      winDisplay.textContent = 'P1 won 🎉';
      winDisplay.style.color = 'green';
    }
    if (marker === 'O') {
      winDisplay.textContent = 'AI won 🖕';
      winDisplay.style.color = 'red';
    }

    winDisplay.style.display = 'block';
    document.querySelector('.restart').style.display = 'block';
  };

  const aiMove = () => {
    let freeMove = [];
    // get index of free fields which the AI can use for it's move
    gameBoardModule.boardToArray().forEach((field, index) => {
      if (field === '') freeMove.push(index);
    });

    // select a random move
    let randomLegalMoveIndex = Math.floor(Math.random() * freeMove.length);
    let randomLegalMove = freeMove[randomLegalMoveIndex];

    // row 1
    if (randomLegalMove >= 0 && randomLegalMove < 3)
      gameBoardModule.board.row1[randomLegalMove] = 'O';

    // row 2
    if (randomLegalMove >= 3 && randomLegalMove < 6)
      gameBoardModule.board.row2[randomLegalMove - 3] = 'O';

    // row 3
    if (randomLegalMove >= 6 && randomLegalMove < 9)
      gameBoardModule.board.row3[randomLegalMove - 6] = 'O';

    displayControllerModule.draw();

    // check if draw
    if (freeMove.length === 0) {
      const winDisplay = document.querySelector('h2');

      winDisplay.textContent = 'Draw 🤔';
      winDisplay.style.color = 'orange';

      winDisplay.style.display = 'block';

      document.querySelector('.restart').style.display = 'block';
    }
  };

  document.querySelector('.restart').addEventListener('click', () => {
    gameBoardModule.restart();
    draw();
    document.querySelector('h2').style.display = 'none';
    document.querySelector('.restart').style.display = 'none';
  });

  return {
    draw,
    congratulateWinner,
    aiMove,
  };
})();

// known issues:
// - AI can set a last move after the player, basically stealing the players win
