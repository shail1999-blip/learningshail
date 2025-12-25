
// function closeGame() {
//     const confirmClose = confirm("Are you sure you want to close the game?");
//     if (confirmClose) {
//         window.close();
//         // Fallback for browsers that don't allow window.close()
//         document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #1a1a2e; color: white;">Game closed. You can now close this tab.</div>';
//     }
// }

const board = document.getElementById('board');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('bestScore');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const messageEl = document.getElementById('message');
const gameOverEl = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const finalBestScoreDisplay = document.getElementById('finalBestScore');
const homeScreen = document.getElementById('homeScreen');
const gameContainer = document.getElementById('gameContainer');
const bestScoresList = document.getElementById('bestScoresList');

let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
let bestScores = JSON.parse(localStorage.getItem('bestScores') || '[]');
let movesLeft = 10;
let timeLeft = 30;
let timer;
let selectedCell = null;
let queenPosition = null;
let targetPosition = null;
let obstacles = [];

function updateBestScores() {
    bestScores.push(score);
    bestScores.sort((a, b) => b - a);
    bestScores = bestScores.slice(0, 5); // Keep only top 5 scores
    localStorage.setItem('bestScores', JSON.stringify(bestScores));
    displayBestScores();
}

function displayBestScores() {
    bestScoresList.innerHTML = '';
    bestScores.forEach(score => {
        const li = document.createElement('li');
        li.textContent = score;
        bestScoresList.appendChild(li);
    });
}

function showHome() {
    gameContainer.classList.remove('active');
    homeScreen.classList.add('active');
    if (timer) clearInterval(timer);
    displayBestScores();
}

function startGame() {
    homeScreen.classList.remove('active');
    gameContainer.classList.add('active');
    resetGame();
}

function showBestScores() {
    showMessage(`Top 5 Best Scores:\n${bestScores.slice(0, 5).join(', ')}`, 3000);
}

function showMessage(text, duration = 2000) {
    messageEl.textContent = text;
    messageEl.style.display = 'block';
    setTimeout(() => messageEl.style.display = 'none', duration);
}

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(i + j) % 2 === 0 ? 'white' : 'black'}`;
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => handleCellClick(i, j));
            board.appendChild(cell);
        }
    }
}

function getCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function placeObstacles() {
    obstacles = [];
    for (let i = 0; i < 3; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 8);
            col = Math.floor(Math.random() * 8);
        } while (
            (row === queenPosition?.row && col === queenPosition?.col) ||
            (row === targetPosition?.row && col === targetPosition?.col) ||
            obstacles.some(obs => obs.row === row && obs.col === col)
        );

        obstacles.push({ row, col });
        const cell = getCell(row, col);
        cell.classList.add('obstacle');
        cell.innerHTML = '<span class="obstacle-piece">🪨</span>';
    }
}

function placeQueenRandomly() {
    const row = Math.floor(Math.random() * 8);
    const col = Math.floor(Math.random() * 8);
    queenPosition = { row, col };
    const cell = getCell(row, col);
    cell.innerHTML = '<span class="queen">♛</span>';
}

function placeTargetRandomly() {
    let row, col;
    do {
        row = Math.floor(Math.random() * 8);
        col = Math.floor(Math.random() * 8);
    } while (
        (row === queenPosition.row && col === queenPosition.col) ||
        obstacles.some(obs => obs.row === row && obs.col === col)
    );

    targetPosition = { row, col };
    const cell = getCell(row, col);
    cell.innerHTML = '<span class="target">★</span>';
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    // Check if destination has obstacle
    if (obstacles.some(obs => obs.row === toRow && obs.col === toCol)) {
        return false;
    }

    // Check if path is clear
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    // Check basic queen movement
    if (!(fromRow === toRow || fromCol === toCol ||
        Math.abs(rowDiff) === Math.abs(colDiff))) {
        return false;
    }

    // Check for obstacles in path
    const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
    const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        if (obstacles.some(obs => obs.row === currentRow && obs.col === currentCol)) {
            return false;
        }
        currentRow += rowStep;
        currentCol += colStep;
    }

    return true;
}

function showValidMoves(row, col) {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('valid-move');
    });

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (isValidMove(row, col, i, j) && (i !== row || j !== col)) {
                getCell(i, j).classList.add('valid-move');
            }
        }
    }
}

function handleCellClick(row, col) {
    if (timeLeft <= 0 || movesLeft <= 0) return;

    const cell = getCell(row, col);

    if (row === queenPosition.row && col === queenPosition.col) {
        if (selectedCell) {
            selectedCell.classList.remove('selected');
            document.querySelectorAll('.cell').forEach(c =>
                c.classList.remove('valid-move'));
            selectedCell = null;
        } else {
            cell.classList.add('selected');
            selectedCell = cell;
            showValidMoves(row, col);
        }
        return;
    }

    if (selectedCell && isValidMove(queenPosition.row, queenPosition.col, row, col)) {
        movesLeft--;
        movesDisplay.textContent = movesLeft;

        selectedCell.innerHTML = '';
        selectedCell.classList.remove('selected');
        cell.innerHTML = '<span class="queen">♛</span>';
        queenPosition = { row, col };

        document.querySelectorAll('.cell').forEach(c =>
            c.classList.remove('valid-move'));
        selectedCell = null;

        if (row === targetPosition.row && col === targetPosition.col) {
            score += 100;
            scoreDisplay.textContent = score;
            if (score > bestScore) {
                bestScore = score;
                bestScoreDisplay.textContent = bestScore;
                localStorage.setItem('bestScore', bestScore);
            }
            showMessage('Target captured! +100 points');

            // Clear obstacles
            obstacles.forEach(obs => {
                const obsCell = getCell(obs.row, obs.col);
                obsCell.classList.remove('obstacle');
                obsCell.innerHTML = '';
            });

            placeTargetRandomly();
            placeObstacles();
        }

        if (movesLeft <= 0) {
            endGame();
        }
    }
}

function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    updateBestScores();
    finalScoreDisplay.textContent = score;
    finalBestScoreDisplay.textContent = bestScore;
    gameOverEl.style.display = 'block';
}

function resetGame() {
    score = 0;
    movesLeft = 10;
    timeLeft = 30;
    selectedCell = null;
    queenPosition = null;
    targetPosition = null;
    obstacles = [];

    scoreDisplay.textContent = score;
    bestScoreDisplay.textContent = bestScore;
    movesDisplay.textContent = movesLeft;
    timerDisplay.textContent = timeLeft;
    gameOverEl.style.display = 'none';

    createBoard();
    placeQueenRandomly();
    placeTargetRandomly();
    placeObstacles();
    startTimer();
}

// Initialize
bestScoreDisplay.textContent = bestScore;
displayBestScores();