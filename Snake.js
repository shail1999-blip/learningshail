document.addEventListener('DOMContentLoaded', () => {
  // Game elements
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const eatSound = document.getElementById("eatSound");
  const gameOverSound = document.getElementById("gameOverSound");
  const pauseBtn = document.getElementById("pauseBtn");
  const restartBtn = document.getElementById("restartBtn");
  const restartGameBtn = document.getElementById("restartGameBtn");
  const overlay = document.getElementById("overlay");
  const startScreen = document.getElementById("startScreen");
  const startGameBtn = document.getElementById("startGameBtn");
  const themeButtons = document.querySelectorAll('.theme-btn');
  const directionButtons = document.querySelectorAll('.direction-btn');
  const difficultyButtons = document.querySelectorAll('.difficulty-btn');
  const startDifficultyButtons = document.querySelectorAll('.start-difficulty-btn');
  const startThemeButtons = document.querySelectorAll('.start-theme-btn');
  const difficultyDesc = document.getElementById("difficultyDesc");
  
  // Game variables
  let snake, direction, food, score, speed, game, paused = false, timer, timeElapsed = 0;
  let highScore = localStorage.getItem("highScore") || 0;
  let box = 16;
  let currentDifficulty = localStorage.getItem("difficulty") || "easy";
  let currentTheme = localStorage.getItem("theme") || "light";
  let obstacles = [];
  let growthRate = 1;
  let gameStarted = false;
  
  // Difficulty settings
  const DIFFICULTY_SETTINGS = {
    easy: {
      initialSpeed: 150,
      speedIncrement: 5,
      growthRate: 1,
      obstacles: false,
      speedLabel: "Slow",
      growthLabel: "+1",
      obstaclesLabel: "None",
      description: "Slower speed, single growth, no obstacles"
    },
    medium: {
      initialSpeed: 120,
      speedIncrement: 8,
      growthRate: 1,
      obstacles: false,
      speedLabel: "Normal",
      growthLabel: "+1",
      obstaclesLabel: "None",
      description: "Normal speed, single growth, no obstacles"
    },
    hard: {
      initialSpeed: 90,
      speedIncrement: 10,
      growthRate: 2,
      obstacles: true,
      speedLabel: "Fast",
      growthLabel: "+2",
      obstaclesLabel: "Yes",
      description: "Fast speed, double growth, random obstacles"
    }
  };
  
  // Update difficulty info display
  function updateDifficultyInfo() {
    const settings = DIFFICULTY_SETTINGS[currentDifficulty];
    document.getElementById("speedInfo").textContent = settings.speedLabel;
    document.getElementById("growthInfo").textContent = settings.growthLabel;
    document.getElementById("obstaclesInfo").textContent = settings.obstaclesLabel;
    
    // Update active button in game
    difficultyButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty);
    });
    
    // Update active button in start screen
    startDifficultyButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty);
    });
    
    // Update difficulty description
    difficultyDesc.textContent = settings.description;
    
    // Update overlay
    overlay.dataset.difficulty = currentDifficulty;
    document.getElementById("difficultyTag").textContent = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
  }
  
  // Update theme
  function updateTheme(theme) {
    currentTheme = theme;
    document.body.dataset.theme = theme;
    
    // Update active button in game
    themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    
    // Update active button in start screen
    startThemeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    
    // Save theme preference
    localStorage.setItem('theme', theme);
  }
  
  // Set canvas dimensions to match CSS
  function resizeCanvas() {
    const containerWidth = canvas.parentElement.clientWidth;
    canvas.width = Math.min(320, containerWidth - 10);
    canvas.height = canvas.width; // Keep it square
    
    // Adjust box size proportionally to maintain gameplay
    box = Math.floor(canvas.width / 20);
    
    // Redraw if game is active
    if (snake && gameStarted) {
      draw();
    }
  }
  
  // Generate obstacles based on difficulty
  function generateObstacles() {
    obstacles = [];
    
    if (DIFFICULTY_SETTINGS[currentDifficulty].obstacles) {
      const maxX = Math.floor(canvas.width / box);
      const maxY = Math.floor(canvas.height / box);
      
      // Create 3-5 obstacles
      const obstacleCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < obstacleCount; i++) {
        // Ensure obstacles don't spawn on snake or food
        let obstacleX, obstacleY;
        let validPosition = false;
        
        while (!validPosition) {
          obstacleX = Math.floor(Math.random() * (maxX - 2)) + 1;
          obstacleY = Math.floor(Math.random() * (maxY - 2)) + 1;
          
          // Check if position conflicts with snake or food
          const onSnake = snake.some(segment => 
            segment.x === obstacleX * box && segment.y === obstacleY * box
          );
          
          const onFood = food.x === obstacleX * box && food.y === obstacleY * box;
          
          // Check if too close to snake head
          const tooCloseToHead = 
            Math.abs(snake[0].x / box - obstacleX) < 3 && 
            Math.abs(snake[0].y / box - obstacleY) < 3;
          
          validPosition = !onSnake && !onFood && !tooCloseToHead;
        }
        
        // Random obstacle size (1-3 blocks)
        const size = Math.floor(Math.random() * 2) + 1;
        
        obstacles.push({
          x: obstacleX * box,
          y: obstacleY * box,
          width: size * box,
          height: box
        });
      }
    }
  }
  
  // Start the game
  function startGame() {
    gameStarted = true;
    startScreen.style.display = "none";
    initGame();
  }
  
  // Initialize game
  function initGame() {
    // Apply difficulty settings
    const settings = DIFFICULTY_SETTINGS[currentDifficulty];
    speed = settings.initialSpeed;
    growthRate = settings.growthRate;
    
    snake = [{ x: Math.floor(canvas.width / 2 / box) * box, y: Math.floor(canvas.width / 2 / box) * box }];
    direction = "RIGHT";
    food = spawnFood();
    score = 0;
    paused = false;
    timeElapsed = 0;
    pauseBtn.classList.remove('paused');
    
    // Generate obstacles for hard difficulty
    generateObstacles();
    
    updateTimerDisplay();
    document.getElementById("score").textContent = "0";
    document.getElementById("highScore").textContent = highScore;
    overlay.style.display = "none";
    
    clearInterval(game);
    clearInterval(timer);
    
    game = setInterval(draw, speed);
    timer = setInterval(() => {
      if (!paused) {
        timeElapsed++;
        updateTimerDisplay();
      }
    }, 1000);
  }
  
  function updateTimerDisplay() {
    document.getElementById("timer").textContent = timeElapsed + "s";
  }
  
  function togglePause() {
    paused = !paused;
    pauseBtn.classList.toggle('paused');
  }
  
  function changeDirection(newDirection) {
    if (newDirection === "UP" && direction !== "DOWN") direction = "UP";
    else if (newDirection === "DOWN" && direction !== "UP") direction = "DOWN";
    else if (newDirection === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    else if (newDirection === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  }
  
  function spawnFood() {
    const maxX = Math.floor(canvas.width / box) - 1;
    const maxY = Math.floor(canvas.height / box) - 1;
    
    // Make sure food doesn't spawn on snake or obstacles
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * maxX) * box,
        y: Math.floor(Math.random() * maxY) * box,
      };
      
      // Check if on snake
      const onSnake = snake.some(segment => 
        segment.x === newFood.x && segment.y === newFood.y
      );
      
      // Check if on obstacle
      const onObstacle = obstacles.some(obstacle => 
        newFood.x >= obstacle.x && 
        newFood.x < obstacle.x + obstacle.width &&
        newFood.y >= obstacle.y && 
        newFood.y < obstacle.y + obstacle.height
      );
      
      if (!onSnake && !onObstacle) {
        return newFood;
      }
    } while (true);
  }
  
  function draw() {
    if (paused) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw obstacles
    obstacles.forEach(obstacle => {
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    
    // Draw snake
    snake.forEach((segment, index) => {
      const theme = document.body.dataset.theme || 'light';
      ctx.fillStyle = index === 0 ? 
        getComputedStyle(document.documentElement).getPropertyValue('--snake-head') : 
        getComputedStyle(document.documentElement).getPropertyValue('--snake-body');
      
      ctx.fillRect(segment.x, segment.y, box, box);
      
      // Add eyes to head
      if (index === 0) {
        ctx.fillStyle = "#000";
        
        // Position eyes based on direction
        if (direction === "RIGHT" || direction === "LEFT") {
          const eyeX = direction === "RIGHT" ? segment.x + box * 0.75 : segment.x + box * 0.25;
          ctx.beginPath();
          ctx.arc(eyeX, segment.y + box * 0.3, box * 0.1, 0, Math.PI * 2);
          ctx.arc(eyeX, segment.y + box * 0.7, box * 0.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const eyeY = direction === "DOWN" ? segment.y + box * 0.75 : segment.y + box * 0.25;
          ctx.beginPath();
          ctx.arc(segment.x + box * 0.3, eyeY, box * 0.1, 0, Math.PI * 2);
          ctx.arc(segment.x + box * 0.7, eyeY, box * 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
    
    // Draw food with pulsing effect
    const pulseSize = Math.sin(Date.now() / 200) * 0.1 + 0.9;
    const foodSize = box * pulseSize;
    const foodOffset = (box - foodSize) / 2;
    
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--food-color');
    ctx.beginPath();
    ctx.arc(
      food.x + box/2, 
      food.y + box/2, 
      foodSize/2, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Move snake
    let head = { ...snake[0] };
    
    if (direction === "UP") head.y -= box;
    else if (direction === "DOWN") head.y += box;
    else if (direction === "LEFT") head.x -= box;
    else if (direction === "RIGHT") head.x += box;
    
    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
      eatSound.play();
      food = spawnFood();
      score++;
      document.getElementById("score").textContent = score;
      
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById("highScore").textContent = highScore;
      }
      
      // Add growth based on difficulty
      for (let i = 1; i < growthRate; i++) {
        snake.push({...snake[snake.length - 1]});
      }
      
      // Increase speed every 5 points
      if (score % 5 === 0 && speed > 50) {
        speed -= DIFFICULTY_SETTINGS[currentDifficulty].speedIncrement;
        clearInterval(game);
        game = setInterval(draw, speed);
      }
    } else {
      snake.pop();
    }
    
    // Check collision with walls or self
    if (
      head.x < 0 || head.x >= canvas.width ||
      head.y < 0 || head.y >= canvas.height ||
      snake.some(seg => seg.x === head.x && seg.y === head.y) ||
      checkObstacleCollision(head)
    ) {
      gameOverSound.play();
      clearInterval(game);
      clearInterval(timer);
      document.getElementById("finalScore").textContent = `Score: ${score} | Time: ${timeElapsed}s`;
      overlay.style.display = "flex";
      
      // Store high score for this difficulty
      const difficultyHighScore = localStorage.getItem(`highScore_${currentDifficulty}`) || 0;
      if (score > difficultyHighScore) {
        localStorage.setItem(`highScore_${currentDifficulty}`, score);
      }
      
      return;
    }
    
    snake.unshift(head);
  }
  
  // Check if snake collides with obstacles
  function checkObstacleCollision(head) {
    return obstacles.some(obstacle => 
      head.x >= obstacle.x && 
      head.x < obstacle.x + obstacle.width &&
      head.y >= obstacle.y && 
      head.y < obstacle.y + obstacle.height
    );
  }
  
  // Event listeners
  document.addEventListener("keydown", function(event) {
    if (!gameStarted && event.key === "Enter") {
      startGame();
      return;
    }
    
    if (gameStarted) {
      if (event.key === " " || event.key === "Escape") {
        togglePause();
      } else if (event.key === "ArrowUp") {
        changeDirection("UP");
      } else if (event.key === "ArrowDown") {
        changeDirection("DOWN");
      } else if (event.key === "ArrowLeft") {
        changeDirection("LEFT");
      } else if (event.key === "ArrowRight") {
        changeDirection("RIGHT");
      }
    }
  });
  
  pauseBtn.addEventListener("click", togglePause);
  restartBtn.addEventListener("click", initGame);
  restartGameBtn.addEventListener("click", initGame);
  startGameBtn.addEventListener("click", startGame);
  
  directionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      changeDirection(btn.dataset.direction);
    });
  });
  
  // Difficulty selector in game
  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentDifficulty = btn.dataset.difficulty;
      localStorage.setItem("difficulty", currentDifficulty);
      updateDifficultyInfo();
      initGame();
    });
  });
  
  // Difficulty selector in start screen
  startDifficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentDifficulty = btn.dataset.difficulty;
      localStorage.setItem("difficulty", currentDifficulty);
      updateDifficultyInfo();
    });
  });
  
  // Theme switcher in game
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      updateTheme(btn.dataset.theme);
    });
  });
  
  // Theme switcher in start screen
  startThemeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      updateTheme(btn.dataset.theme);
    });
  });
  
  // Load saved theme and difficulty
  updateTheme(currentTheme);
  updateDifficultyInfo();
  
  // Handle window resize
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
  // Initialize the start screen
  // Don't start the game automatically
});