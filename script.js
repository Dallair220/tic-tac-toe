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

  const isOver = (brd, isForAI) => {
    let over = false;
    let winMarker = '';

    // check vertical win
    Object.keys(brd).forEach((key) => {
      if (brd[key][0] !== '')
        if (brd[key][0] === brd[key][1] && brd[key][0] === brd[key][2]) {
          over = true;
          // eslint-disable-next-line prefer-destructuring
          winMarker = brd[key][0];
        }
    });

    // check horizontal win
    for (let i = 0; i < 3; i += 1) {
      if (brd.row1[i] !== '')
        if (brd.row1[i] === brd.row2[i] && brd.row1[i] === brd.row3[i]) {
          over = true;
          winMarker = brd.row1[i];
        }
    }

    // check diagonal win #1
    if (brd.row1[0] !== '')
      if (brd.row1[0] === brd.row2[1] && brd.row1[0] === brd.row3[2]) {
        over = true;
        // eslint-disable-next-line prefer-destructuring
        winMarker = brd.row1[0];
      }

    // check diagonal win #2
    if (brd.row3[0] !== '')
      if (brd.row3[0] === brd.row2[1] && brd.row3[0] === brd.row1[2]) {
        over = true;
        // eslint-disable-next-line prefer-destructuring
        winMarker = brd.row3[0];
      }

    if (!isForAI) {
      if (over) displayControllerModule.congratulateWinner(winMarker);
    }

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
      if (gameBoardModule.isOver(gameBoardModule.board)) return;
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
      gameBoardModule.isOver(gameBoardModule.board);

      aiLogicModule.aiMove();
      gameBoardModule.isOver(gameBoardModule.board);
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
      winDisplay.textContent = 'Player won 🎉';
      winDisplay.style.color = 'green';
    }
    if (marker === 'O') {
      winDisplay.textContent = 'AI won 🖕';
      winDisplay.style.color = 'red';
    }

    winDisplay.style.display = 'block';
    document.querySelector('.restart').style.display = 'block';
  };

  // restart functionality
  document.querySelector('.restart').addEventListener('click', () => {
    gameBoardModule.restart();
    draw();
    document.querySelector('h2').style.display = 'none';
    document.querySelector('.restart').style.display = 'none';
  });

  return {
    draw,
    congratulateWinner,
  };
})();

const aiLogicModule = (() => {
  const aiMove = () => {
    let freeMoves = [];
    // get index of free fields which the AI can use for it's move
    gameBoardModule.boardToArray().forEach((field, index) => {
      if (field === '') freeMoves.push(index);
    });

    // select winning move
    let legalMove = findWinningMove();
    if (legalMove === -1) legalMove = blockingMove();

    // select blocking move if no winning move available
    function blockingMove() {
      let blockMove = blockPlayersWinningMove();
      return blockMove === -1 ? randomMove() : blockMove;
    }
    // select random move if no blocking move available
    function randomMove() {
      let randomMove = Math.floor(Math.random() * freeMoves.length);
      return freeMoves[randomMove];
    }

    // // row 1
    // if (legalMove >= 0 && legalMove < 3)
    //   gameBoardModule.board.row1[legalMove] = 'O';
    // // row 2
    // if (legalMove >= 3 && legalMove < 6)
    //   gameBoardModule.board.row2[legalMove - 3] = 'O';
    // // row 3
    // if (legalMove >= 6 && legalMove < 9)
    //   gameBoardModule.board.row3[legalMove - 6] = 'O';

    // the same as above, just more efficient
    for (let i = 1; i <= 3; i++) {
      if (legalMove >= (i - 1) * 3 && legalMove < i * 3) {
        console.log(gameBoardModule.board);
        gameBoardModule.board[`row${i}`][legalMove - (i - 1) * 3] = 'O';
      }
    }
    displayControllerModule.draw();

    // check if draw
    if (freeMoves.length === 0) {
      const winDisplay = document.querySelector('h2');

      winDisplay.textContent = 'Draw 🤔';
      winDisplay.style.color = 'orange';

      winDisplay.style.display = 'block';

      document.querySelector('.restart').style.display = 'block';
    }

    function blockPlayersWinningMove() {
      let move = -1;
      // row 1
      for (let i = 0; i < 3; i++) {
        let checkMoveBoard = {
          row1: [...gameBoardModule.board.row1],
          row2: [...gameBoardModule.board.row2],
          row3: [...gameBoardModule.board.row3],
        };
        if (checkMoveBoard.row1[i] === '') checkMoveBoard.row1[i] = 'X';
        if (gameBoardModule.isOver(checkMoveBoard, true)) {
          move = i;
        }
      }
      // row 2
      for (let i = 0; i < 3; i++) {
        let checkMoveBoard = {
          row1: [...gameBoardModule.board.row1],
          row2: [...gameBoardModule.board.row2],
          row3: [...gameBoardModule.board.row3],
        };
        if (checkMoveBoard.row2[i] === '') checkMoveBoard.row2[i] = 'X';
        if (gameBoardModule.isOver(checkMoveBoard, true)) {
          move = i + 3;
        }
      }
      // row 3
      for (let i = 0; i < 3; i++) {
        let checkMoveBoard = {
          row1: [...gameBoardModule.board.row1],
          row2: [...gameBoardModule.board.row2],
          row3: [...gameBoardModule.board.row3],
        };
        if (checkMoveBoard.row3[i] === '') checkMoveBoard.row3[i] = 'X';
        if (gameBoardModule.isOver(checkMoveBoard, true)) {
          move = i + 6;
        }
      }

      // same as above, just more beautiful
      // for (let j = 1; j <= 3; j++) {
      //   for (let i = 0; i < 3; i++) {
      //     let checkMoveBoard = {
      //       row1: [...gameBoardModule.board.row1],
      //       row2: [...gameBoardModule.board.row2],
      //       row3: [...gameBoardModule.board.row3],
      //     };
      //     if (checkMoveBoard[`row${j}`][i] === '') {
      //       checkMoveBoard[`row${j}`][i] = 'X';
      //     }
      //     if (gameBoardModule.isOver(checkMoveBoard, true)) {
      //       move = i + i * 3;
      //     }
      //   }
      // }

      return move;
    }

    function findWinningMove() {
      let move = -1;
      // row 1
      for (let i = 0; i < 3; i++) {
        let checkMoveBoard = {
          row1: [...gameBoardModule.board.row1],
          row2: [...gameBoardModule.board.row2],
          row3: [...gameBoardModule.board.row3],
        };
        if (checkMoveBoard.row1[i] === '') checkMoveBoard.row1[i] = 'O';
        if (gameBoardModule.isOver(checkMoveBoard, true)) {
          move = i;
        }
      }
      // row 2
      for (let i = 0; i < 3; i++) {
        let checkMoveBoard = {
          row1: [...gameBoardModule.board.row1],
          row2: [...gameBoardModule.board.row2],
          row3: [...gameBoardModule.board.row3],
        };
        if (checkMoveBoard.row2[i] === '') checkMoveBoard.row2[i] = 'O';
        if (gameBoardModule.isOver(checkMoveBoard, true)) {
          move = i + 3;
        }
      }
      // row 3
      for (let i = 0; i < 3; i++) {
        let checkMoveBoard = {
          row1: [...gameBoardModule.board.row1],
          row2: [...gameBoardModule.board.row2],
          row3: [...gameBoardModule.board.row3],
        };
        if (checkMoveBoard.row3[i] === '') checkMoveBoard.row3[i] = 'O';
        if (gameBoardModule.isOver(checkMoveBoard, true)) {
          move = i + 6;
        }
      }
      return move;
    }
  };
  return {
    aiMove,
  };
})();

// known issues:
// - AI can set a last move after the player, basically stealing the players win
