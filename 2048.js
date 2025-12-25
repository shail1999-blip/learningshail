document.addEventListener("DOMContentLoaded", () => {
  // Game constants
  const GRID_SIZE = 4
  const CELL_SIZE = 100
  const CELL_GAP = 15

  // DOM elements
  const gameContainer = document.querySelector(".game-container")
  const tileContainer = document.querySelector(".tile-container")
  const scoreDisplay = document.getElementById("score")
  const bestScoreDisplay = document.getElementById("best-score")
  const gameMessage = document.querySelector(".game-message")
  const retryButton = document.querySelector(".retry-button")

  // Game variables
  let grid = []
  let score = 0
  let bestScore = localStorage.getItem("bestScore") || 0
  let gameOver = false
  let touchStartX = 0
  let touchStartY = 0

  // Initialize the game
  function initGame() {
    // Reset game state
    grid = createEmptyGrid()
    score = 0
    gameOver = false
    scoreDisplay.textContent = "0"
    bestScoreDisplay.textContent = bestScore
    gameMessage.style.display = "none"

    // Clear the tile container
    tileContainer.innerHTML = ""

    // Add initial tiles
    addRandomTile()
    addRandomTile()
  }

  // Create an empty grid
  function createEmptyGrid() {
    const newGrid = []
    for (let i = 0; i < GRID_SIZE; i++) {
      newGrid[i] = []
      for (let j = 0; j < GRID_SIZE; j++) {
        newGrid[i][j] = 0
      }
    }
    return newGrid
  }

  // Add a random tile (2 or 4) to an empty cell
  function addRandomTile() {
    if (isFull()) return

    const emptyCells = []
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push({ row: i, col: j })
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      const value = Math.random() < 0.9 ? 2 : 4
      grid[randomCell.row][randomCell.col] = value

      // Create and add the tile element
      const tile = document.createElement("div")
      tile.classList.add("tile", `tile-${value}`, "tile-new")
      tile.textContent = value

      // Position the tile
      const position = getTilePosition(randomCell.row, randomCell.col)

      tile.style.top = `${position.top}px`
      tile.style.left = `${position.left}px`
      tile.style.marginTop = `${position.marrginn}px`


      // Add data attributes for position
      tile.setAttribute("data-row", randomCell.row)
      tile.setAttribute("data-col", randomCell.col)
      //tile.style.marginTop = `${position.marrginn}px`

      tileContainer.appendChild(tile)
    }
  }

  // Check if the grid is full
  function isFull() {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) return false
      }
    }
    return true
  }

  // Get the pixel position for a tile
  function getTilePosition(row, col) {
    const cellSize = getCellSize()
    const gap = getCellGap()
    const discripancy = row * 10

    return {
      top: row * (cellSize + gap),
      left: col * (cellSize + gap),
      marrginn: discripancy,
    }
  }

  // Get the current cell size based on container dimensions
  function getCellSize() {
    const containerWidth = tileContainer.offsetWidth
    return (containerWidth - (GRID_SIZE - 1) * getCellGap()) / GRID_SIZE
  }

  // Get the current cell gap based on container dimensions
  function getCellGap() {
    return CELL_GAP
  }

  // Move tiles in a direction
  function moveTiles(direction) {
    if (gameOver) return

    let moved = false
    const oldGrid = JSON.parse(JSON.stringify(grid))

    // Process the grid based on direction
    switch (direction) {
      case "up":
        moved = moveUp()
        break
      case "right":
        moved = moveRight()
        break
      case "down":
        moved = moveDown()
        break
      case "left":
        moved = moveLeft()
        break
    }

    // If tiles moved, add a new random tile and check game status
    if (moved) {
      updateTileDisplay()
      setTimeout(() => {
        addRandomTile()
        checkGameStatus()
      }, 150)
    }
  }

  // Move tiles up
  function moveUp() {
    let moved = false

    for (let col = 0; col < GRID_SIZE; col++) {
      // Process each column from top to bottom
      for (let row = 1; row < GRID_SIZE; row++) {
        if (grid[row][col] !== 0) {
          let currentRow = row

          // Move the tile up as far as possible
          while (currentRow > 0 && grid[currentRow - 1][col] === 0) {
            grid[currentRow - 1][col] = grid[currentRow][col]
            grid[currentRow][col] = 0
            currentRow--
            moved = true
          }

          // Check if we can merge with the tile above
          if (currentRow > 0 && grid[currentRow - 1][col] === grid[currentRow][col]) {
            grid[currentRow - 1][col] *= 2
            grid[currentRow][col] = 0
            score += grid[currentRow - 1][col]
            updateScore()
            moved = true
          }
        }
      }
    }

    return moved
  }

  // Move tiles right
  function moveRight() {
    let moved = false

    for (let row = 0; row < GRID_SIZE; row++) {
      // Process each row from right to left
      for (let col = GRID_SIZE - 2; col >= 0; col--) {
        if (grid[row][col] !== 0) {
          let currentCol = col

          // Move the tile right as far as possible
          while (currentCol < GRID_SIZE - 1 && grid[row][currentCol + 1] === 0) {
            grid[row][currentCol + 1] = grid[row][currentCol]
            grid[row][currentCol] = 0
            currentCol++
            moved = true
          }

          // Check if we can merge with the tile to the right
          if (currentCol < GRID_SIZE - 1 && grid[row][currentCol + 1] === grid[row][currentCol]) {
            grid[row][currentCol + 1] *= 2
            grid[row][currentCol] = 0
            score += grid[row][currentCol + 1]
            updateScore()
            moved = true
          }
        }
      }
    }

    return moved
  }

  // Move tiles down
  function moveDown() {
    let moved = false

    for (let col = 0; col < GRID_SIZE; col++) {
      // Process each column from bottom to top
      for (let row = GRID_SIZE - 2; row >= 0; row--) {
        if (grid[row][col] !== 0) {
          let currentRow = row

          // Move the tile down as far as possible
          while (currentRow < GRID_SIZE - 1 && grid[currentRow + 1][col] === 0) {
            grid[currentRow + 1][col] = grid[currentRow][col]
            grid[currentRow][col] = 0
            currentRow++
            moved = true
          }

          // Check if we can merge with the tile below
          if (currentRow < GRID_SIZE - 1 && grid[currentRow + 1][col] === grid[currentRow][col]) {
            grid[currentRow + 1][col] *= 2
            grid[currentRow][col] = 0
            score += grid[currentRow + 1][col]
            updateScore()
            moved = true
          }
        }
      }
    }

    return moved
  }

  // Move tiles left
  function moveLeft() {
    let moved = false

    for (let row = 0; row < GRID_SIZE; row++) {
      // Process each row from left to right
      for (let col = 1; col < GRID_SIZE; col++) {
        if (grid[row][col] !== 0) {
          let currentCol = col

          // Move the tile left as far as possible
          while (currentCol > 0 && grid[row][currentCol - 1] === 0) {
            grid[row][currentCol - 1] = grid[row][currentCol]
            grid[row][currentCol] = 0
            currentCol--
            moved = true
          }

          // Check if we can merge with the tile to the left
          if (currentCol > 0 && grid[row][currentCol - 1] === grid[row][currentCol]) {
            grid[row][currentCol - 1] *= 2
            grid[row][currentCol] = 0
            score += grid[row][currentCol - 1]
            updateScore()
            moved = true
          }
        }
      }
    }

    return moved
  }

  // Update the score display
  function updateScore() {
    scoreDisplay.textContent = score

    if (score > bestScore) {
      bestScore = score
      bestScoreDisplay.textContent = bestScore
      localStorage.setItem("bestScore", bestScore)
    }
  }

  // Update the tile display based on the grid
  function updateTileDisplay() {
    // Remove all existing tiles
    const tiles = document.querySelectorAll(".tile")
    tiles.forEach((tile) => {
      const row = Number.parseInt(tile.getAttribute("data-row"))
      const col = Number.parseInt(tile.getAttribute("data-col"))

      if (grid[row][col] === 0) {
        // Tile has been moved or merged
        tile.remove()
      } else {
        // Update tile position and value
        const position = getTilePosition(row, col)
        tile.style.top = `${position.top}px`
        tile.style.left = `${position.left}px`
        tile.style.marginTop = `${position.marrginn}px`

        // Update tile value if it changed (due to merge)
        const value = grid[row][col]
        if (Number.parseInt(tile.textContent) !== value) {
          tile.textContent = value
          tile.className = ""
          tile.classList.add("tile", `tile-${value}`, "tile-merged")
        }

        // Update data attributes
        tile.setAttribute("data-row", row)
        tile.setAttribute("data-col", col)
      }
    })

    // Create new tiles for cells that don't have a corresponding DOM element
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] !== 0) {
          const existingTile = document.querySelector(`.tile[data-row="${i}"][data-col="${j}"]`)

          if (!existingTile) {
            const value = grid[i][j]
            const tile = document.createElement("div")
            tile.classList.add("tile", `tile-${value}`)
            tile.textContent = value

            const position = getTilePosition(i, j)
            tile.style.top = `${position.top}px`
            tile.style.left = `${position.left}px`
            tile.style.marginTop = `${position.marrginn}px`

            tile.setAttribute("data-row", i)
            tile.setAttribute("data-col", j)

            tileContainer.appendChild(tile)
          }
        }
      }
    }
  }

  // Check if the game is over or won
  function checkGameStatus() {
    // Check for 2048 tile (win condition)
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 2048) {
          showGameMessage("You Win!", "game-won")
          return
        }
      }
    }

    // Check if the grid is full
    if (!isFull()) return

    // Check if any moves are possible
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const value = grid[i][j]

        // Check adjacent cells
        if ((i < GRID_SIZE - 1 && grid[i + 1][j] === value) || (j < GRID_SIZE - 1 && grid[i][j + 1] === value)) {
          return // Moves are still possible
        }
      }
    }

    // No moves possible, game over
    showGameMessage("Game Over!")
  }

  // Show game message (win or game over)
  function showGameMessage(message, className = "") {
    gameOver = true
    gameMessage.querySelector("p").textContent = message
    gameMessage.className = "game-message"
    if (className) {
      gameMessage.classList.add(className)
    }
    gameMessage.style.display = "flex"
  }

  // Handle keyboard events
  function handleKeyDown(event) {
    if (gameOver) return

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault()
        moveTiles("up")
        break
      case "ArrowRight":
        event.preventDefault()
        moveTiles("right")
        break
      case "ArrowDown":
        event.preventDefault()
        moveTiles("down")
        break
      case "ArrowLeft":
        event.preventDefault()
        moveTiles("left")
        break
    }
  }

  // Handle touch events for mobile
  function handleTouchStart(event) {
    if (gameOver) return

    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY

    event.preventDefault()
  }

  function handleTouchEnd(event) {
    if (gameOver) return

    const touchEndX = event.changedTouches[0].clientX
    const touchEndY = event.changedTouches[0].clientY

    const dx = touchEndX - touchStartX
    const dy = touchEndY - touchStartY

    // Determine the direction of the swipe
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 50) {
        moveTiles("right")
      } else if (dx < -50) {
        moveTiles("left")
      }
    } else {
      // Vertical swipe
      if (dy > 50) {
        moveTiles("down")
      } else if (dy < -50) {
        moveTiles("up")
      }
    }

    event.preventDefault()
  }

  // Handle window resize
  function handleResize() {
    updateTileDisplay()
  }

  // Event listeners
  document.addEventListener("keydown", handleKeyDown)
  gameContainer.addEventListener("touchstart", handleTouchStart, { passive: false })
  gameContainer.addEventListener("touchend", handleTouchEnd, { passive: false })
  window.addEventListener("resize", handleResize)
  retryButton.addEventListener("click", initGame)

  // Add a click event listener to the game container
  gameContainer.addEventListener("click", () => {
    if (!gameOver) {
      moveTiles("up")
    }
  })


  // Initialize the game
  initGame()
})
