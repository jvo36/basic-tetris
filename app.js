document.addEventListener('DOMContentLoaded', () => {
  // look through the document and look at grid
  const grid = document.querySelector('.grid');
  // make grid into an array
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;

  // colors in order l, z, t, o, i
  const colors = ['#0027E3', '#E30000', '#F863F6', '#FFDF01', '#29D5FF'];

  // all the tetrominoes in a form of arrays
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  // randomly select a Tetromino and it's first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // draw the first rotation in the first teromino
  // current have the array of the tetrominoes
  // squres is the array of the grid div
  // tetromino is in style.css
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  // undraw the tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }

  // make the tetromino move down every second
  timerId = setInterval(autoDown, 1000);

  // assign functions to keyCodes to press any keys to move. Part of js methods
  function control(e) {
    // press left key
    if (e.keyCode === 37) {
      moveLeft();
      // press up key, rotate tetromino
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
      // press down key, move tetromino down faster
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener('keyup', control);

  function autoDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains('taken')
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add('taken')
      );
      //start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // move the tetromino left, unless is at the edge or there's a blockage
  function moveLeft() {
    undraw();
    const leftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!leftEdge) {
      currentPosition -= 1;
    }

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition += 1;
    }

    draw();
  }

  function moveRight() {
    undraw();
    const rightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!rightEdge) {
      currentPosition += 1;
    }

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  }

  //move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // function to rotate the tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      // if the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    //  checkRotatedPosition();
    draw();
  }

  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  const displayIndex = 0;

  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ];

  // function display the tetromino in the mini display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  //add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  // function to add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  //function for game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      scoreDisplay.innerHTML = 'GAME OVER';
      clearInterval(timerId);
    }
  }
});
