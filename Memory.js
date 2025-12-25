
const CARD_PAIRS = 8;
const CARDS = [...Array(CARD_PAIRS).keys()].flatMap(i => [i, i]);

let cards = [];
let flipped = [];
let solved = [];
let disabled = false;
let moves = 0;

const cardGrid = document.getElementById('cardGrid');
const moveCount = document.getElementById('moveCount');
const congratulations = document.getElementById('congratulations');
const newGameButton = document.getElementById('newGameButton');
const backToGamePageButton = document.getElementById('backToGamePageButton');

function shuffleCards() {
    const shuffled = [...CARDS]
        .sort(() => Math.random() - 0.5)
        .map((card, i) => ({ id: i, value: card }));
    cards = shuffled;
    flipped = [];
    solved = [];
    moves = 0;
    moveCount.textContent = moves;
    congratulations.classList.add('hidden');
    backToGamePageButton.classList.add('visible');
    renderCards();
}

function renderCards() {
    cardGrid.innerHTML = '';
    cards.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${flipped.includes(card.id) || solved.includes(card.id) ? 'flipped' : ''}`;
        cardElement.textContent = (flipped.includes(card.id) || solved.includes(card.id)) ? card.value : '';
        cardElement.addEventListener('click', () => handleClick(card.id));
        cardGrid.appendChild(cardElement);
    });
}

function handleClick(id) {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;

    flipped.push(id);
    renderCards();

    if (flipped.length === 2) {
        disabled = true;
        moves++;
        moveCount.textContent = moves;

        const [first, second] = flipped;
        if (cards[first].value === cards[second].value) {
            solved.push(first, second);
            flipped = [];
            disabled = false;
            renderCards();
            if (solved.length === CARDS.length) {
                congratulations.textContent = `Congratulations! You won in ${moves} moves!`;
                congratulations.classList.remove('hidden');
                backToGamePageButton.classList.remove('visible');
            }
        } else {
            setTimeout(() => {
                flipped = [];
                disabled = false;
                renderCards();
            }, 1000);
        }
    }
}

newGameButton.addEventListener('click', shuffleCards);
backToGamePageButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Initialize the game
shuffleCards();
