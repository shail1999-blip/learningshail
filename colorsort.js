 
        // Game state
        const COLORS = [
            "#FF6B6B", // Red
            "#45B7D1", // Blue
            "#FFEAA7", // Yellow
        ];

        const INITIAL_TUBES = [
            {
                id: "tube-1",
                balls: [
                    { id: "ball-1", color: "#c70e0eff" }, // Red
                    { id: "ball-2", color: "#45B7D1" }, // Blue
                    { id: "ball-3", color: "#e1ae09ff" }, // Yellow
                    { id: "ball-4", color: "#c70e0eff" }, // Red
                ],
                maxCapacity: 4,
            },
            {
                id: "tube-2",
                balls: [
                    { id: "ball-5", color: "#45B7D1" }, // Blue
                    { id: "ball-6", color: "#e1ae09ff" }, // Yellow
                    { id: "ball-7", color: "#c70e0eff" }, // Red
                    { id: "ball-8", color: "#45B7D1" }, // Blue
                ],
                maxCapacity: 4,
            },
            {
                id: "tube-3",
                balls: [
                    { id: "ball-9", color: "#e1ae09ff" }, // Yellow
                    { id: "ball-10", color: "#c70e0eff" }, // Red
                    { id: "ball-11", color: "#45B7D1" }, // Blue
                    { id: "ball-12", color: "#e1ae09ff" }, // Yellow
                ],
                maxCapacity: 4,
            },
            {
                id: "tube-4",
                balls: [],
                maxCapacity: 4,
            },
        ];

        let tubes = JSON.parse(JSON.stringify(INITIAL_TUBES));
        let selectedTube = null;
        let moves = 0;
        let isWon = false;
        let animatingBall = null;

        // Game functions
        function checkWinCondition(currentTubes) {
            return currentTubes.every((tube) => {
                if (tube.balls.length === 0) return true;
                if (tube.balls.length !== tube.maxCapacity) return false;
                const firstColor = tube.balls[0].color;
                return tube.balls.every((ball) => ball.color === firstColor);
            });
        }

        function canMoveBall(fromTube, toTube) {
            if (fromTube.balls.length === 0) return false;
            if (toTube.balls.length >= toTube.maxCapacity) return false;

            const topBallFrom = fromTube.balls[fromTube.balls.length - 1];

            // Can always move to empty tube
            if (toTube.balls.length === 0) return true;

            // Can only move to tube if top ball colors match
            const topBallTo = toTube.balls[toTube.balls.length - 1];
            return topBallFrom.color === topBallTo.color;
        }

        function handleTubeClick(tubeId) {
            if (isWon) return;

            if (selectedTube === null) {
                const tube = tubes.find((t) => t.id === tubeId);
                if (tube && tube.balls.length > 0) {
                    selectedTube = tubeId;
                    renderGame();
                }
            } else if (selectedTube === tubeId) {
                selectedTube = null;
                renderGame();
            } else {
                const fromTube = tubes.find((t) => t.id === selectedTube);
                const toTube = tubes.find((t) => t.id === tubeId);

                if (canMoveBall(fromTube, toTube)) {
                    const ballToMove = fromTube.balls[fromTube.balls.length - 1];
                    animatingBall = ballToMove.id;
                    renderGame();

                    setTimeout(() => {
                        // Move the ball
                        fromTube.balls.pop();
                        toTube.balls.push(ballToMove);
                        
                        moves++;
                        animatingBall = null;
                        
                        if (checkWinCondition(tubes)) {
                            isWon = true;
                        }
                        
                        renderGame();
                    }, 300);
                }

                selectedTube = null;
            }
        }

        function resetGame() {
            tubes = JSON.parse(JSON.stringify(INITIAL_TUBES));
            selectedTube = null;
            moves = 0;
            isWon = false;
            animatingBall = null;
            renderGame();
        }

        function renderGame() {
            const gameBoard = document.getElementById('game-board');
            const movesElement = document.getElementById('moves');
            const successCard = document.getElementById('success-card');

            // Update moves counter
            movesElement.textContent = moves;

            // Show/hide success card
            if (isWon) {
                successCard.classList.remove('hidden');
            } else {
                successCard.classList.add('hidden');
            }

            // Clear game board
            gameBoard.innerHTML = '';

            // Render tubes
            tubes.forEach((tube) => {
                const tubeContainer = document.createElement('div');
                tubeContainer.className = `tube-container ${selectedTube === tube.id ? 'selected' : ''}`;
                tubeContainer.onclick = () => handleTubeClick(tube.id);

                const tubeElement = document.createElement('div');
                tubeElement.className = 'tube';

                // Tube body
                const tubeBody = document.createElement('div');
                tubeBody.className = 'tube-body';

                // Balls container
                const ballsContainer = document.createElement('div');
                ballsContainer.className = 'balls-container';

                tube.balls.forEach((ball) => {
                    const ballElement = document.createElement('div');
                    ballElement.className = `ball ${animatingBall === ball.id ? 'bouncing' : ''}`;
                    ballElement.style.backgroundColor = ball.color;
                    ballElement.style.boxShadow = `0 2px 8px ${ball.color}40`;
                    ballsContainer.appendChild(ballElement);
                });

                tubeBody.appendChild(ballsContainer);

                // Tube rim
                const tubeRim = document.createElement('div');
                tubeRim.className = 'tube-rim';

                tubeElement.appendChild(tubeBody);
                tubeElement.appendChild(tubeRim);

                // Tube label
                const tubeLabel = document.createElement('div');
                tubeLabel.className = 'tube-label';
                tubeLabel.textContent = `${tube.balls.length}/${tube.maxCapacity}`;

                tubeContainer.appendChild(tubeElement);
                tubeContainer.appendChild(tubeLabel);
                gameBoard.appendChild(tubeContainer);
            });
        }

        function showHowToPlay() {
            document.getElementById('modal').classList.remove('hidden');
        }

        function hideHowToPlay() {
            document.getElementById('modal').classList.add('hidden');
        }

        // Initialize game
        renderGame();
