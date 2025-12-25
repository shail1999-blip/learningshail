document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const restartButton = document.getElementById('restart');
    const resetScoresButton = document.getElementById('reset-scores');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    const avgX = document.getElementById('avg-x');
    const avgO = document.getElementById('avg-o');
    const celebration = document.getElementById('celebration');
    const winner = document.getElementById('winner');
    const gameOver = document.getElementById('game-over');
    const finalWinner = document.getElementById('final-winner');
    const newTournamentButton = document.getElementById('new-tournament');

    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = { X: 0, O: 0 };
    let gamesPlayed = 0;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        checkResult();
    }

    function checkResult() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            status.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            updateScores(currentPlayer);
            return;
        }

        if (!gameState.includes('')) {
            status.textContent = "It's a draw!";
            gameActive = false;
            updateScores(null);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }

    function updateScores(winningPlayer) {
        gamesPlayed++;
        if (winningPlayer) {
            scores[winningPlayer]++;
            if (scores[winningPlayer] === 2) {
                celebrateWin(winningPlayer);
                setTimeout(() => {
                    endTournament(winningPlayer);
                }, 5000);
            } else {
                setTimeout(restartGame, 1500);
            }
        } else {
            setTimeout(restartGame, 1500);
        }
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
        avgX.textContent = ((scores.X / gamesPlayed) * 100).toFixed(2) + '%';
        avgO.textContent = ((scores.O / gamesPlayed) * 100).toFixed(2) + '%';
    }

    function celebrateWin(player) {
        winner.textContent = player;
        celebration.style.display = 'flex';
        createConfetti();
        setTimeout(() => {
            celebration.style.display = 'none';
        }, 5000);
    }

    function endTournament(player) {
        finalWinner.textContent = player;
        gameOver.style.display = 'flex';
    }

    function createConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            confetti.style.backgroundColor = getRandomColor();
            document.body.appendChild(confetti);
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function restartGame() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = `Player ${currentPlayer}'s turn`;
        cells.forEach(cell => {
            cell.textContent = '';
        });
    }

    function resetScores() {
        scores = { X: 0, O: 0 };
        gamesPlayed = 0;
        scoreX.textContent = '0';
        scoreO.textContent = '0';
        avgX.textContent = '0%';
        avgO.textContent = '0%';
        gameOver.style.display = 'none';
        restartGame();
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);
    resetScoresButton.addEventListener('click', resetScores);
    newTournamentButton.addEventListener('click', resetScores);

    status.textContent = `Player ${currentPlayer}'s turn`;
});

