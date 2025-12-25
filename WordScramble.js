
const words = [
    { word: "elephant", hint: "A large animal with a trunk" },
    { word: "giraffe", hint: "Tall animal with a long neck" },
    { word: "strawberry", hint: "A red fruit with tiny seeds" },
    { word: "laptop", hint: "Portable computer" },
    { word: "keyboard", hint: "Used to type on a computer" },
    { word: "apple", hint: "A round red or green fruit" },
    { word: "banana", hint: "A long yellow fruit" },
    { word: "cherry", hint: "A small red fruit with a pit" },
    { word: "grape", hint: "A small round fruit, grows in bunches" },
    { word: "orange", hint: "A citrus fruit with a thick peel" },
    { word: "pineapple", hint: "A tropical fruit with spiky skin" },
    { word: "blueberry", hint: "A small blue fruit" },
    { word: "watermelon", hint: "A large fruit with green skin and red inside" },
    { word: "mango", hint: "A tropical fruit with a large seed" },
    { word: "peach", hint: "A fuzzy fruit with a pit" },
    { word: "carrot", hint: "An orange vegetable, often eaten raw" },
    { word: "broccoli", hint: "A green vegetable with a tree-like top" },
    { word: "potato", hint: "A starchy vegetable, often fried" },
    { word: "tomato", hint: "A red fruit often used as a vegetable" },
    { word: "cucumber", hint: "A long green vegetable, often in salads" },
    { word: "onion", hint: "A vegetable that makes you cry when cut" },
    { word: "lettuce", hint: "A leafy green vegetable used in salads" },
    { word: "spinach", hint: "A green leafy vegetable, rich in iron" },
    { word: "pepper", hint: "A spicy or sweet vegetable, comes in many colors" },
    { word: "pumpkin", hint: "A large orange vegetable, popular in fall" },
    { word: "dog", hint: "A common pet that barks" },
    { word: "cat", hint: "A small pet that purrs" },
    { word: "lion", hint: "The king of the jungle" },
    { word: "tiger", hint: "A big cat with orange fur and black stripes" },
    { word: "rabbit", hint: "A small animal with long ears" },
    { word: "bear", hint: "A large animal that hibernates" },
    { word: "dolphin", hint: "An intelligent sea creature" },
    { word: "shark", hint: "A powerful sea predator with sharp teeth" },
    { word: "whale", hint: "The largest animal in the ocean" },
    { word: "horse", hint: "A fast-running animal used for riding" },
    { word: "cow", hint: "A farm animal that gives milk" },
    { word: "goat", hint: "A farm animal that often has horns" },
    { word: "sheep", hint: "A fluffy farm animal" },
    { word: "chicken", hint: "A bird that lays eggs" },
    { word: "penguin", hint: "A flightless bird that lives in cold regions" },
    { word: "parrot", hint: "A colorful bird that can mimic sounds" },
    { word: "eagle", hint: "A large bird of prey" },
    { word: "owl", hint: "A nocturnal bird with large eyes" },
    { word: "zebra", hint: "A black-and-white striped animal" },
    { word: "cheetah", hint: "The fastest land animal" },
    { word: "car", hint: "A vehicle with four wheels" },
    { word: "bicycle", hint: "A two-wheeled vehicle powered by pedaling" },
    { word: "train", hint: "A long vehicle that runs on tracks" },
    { word: "airplane", hint: "A flying vehicle" },
    { word: "helicopter", hint: "A flying vehicle with rotating blades" },
    { word: "motorcycle", hint: "A two-wheeled motorized vehicle" },
    { word: "bus", hint: "A large vehicle for transporting people" },
    { word: "boat", hint: "A vehicle that moves on water" },
    { word: "rocket", hint: "A spacecraft used for space travel" },
    { word: "submarine", hint: "A watercraft that travels underwater" },
    { word: "television", hint: "A device used to watch shows and movies" },
    { word: "radio", hint: "A device used to listen to music and news" },
    { word: "phone", hint: "A device used for calling and messaging" },
    { word: "tablet", hint: "A touchscreen device larger than a phone" },
    { word: "printer", hint: "A device that prints documents" },
    { word: "camera", hint: "A device used to take pictures" },
    { word: "microwave", hint: "A kitchen appliance for heating food" },
    { word: "refrigerator", hint: "An appliance that keeps food cold" },
    { word: "oven", hint: "Used for baking and roasting food" },
    { word: "vacuum", hint: "A device used for cleaning floors" },
    { word: "watch", hint: "A small device worn on the wrist to tell time" },
    { word: "clock", hint: "A device that shows the time" },
    { word: "mirror", hint: "A reflective surface used to see oneself" },
    { word: "pencil", hint: "Used for writing and can be erased" },
    { word: "pen", hint: "Used for writing with ink" },
    { word: "paper", hint: "A thin material used for writing or printing" },
    { word: "book", hint: "A collection of written pages" },
    { word: "newspaper", hint: "A printed publication with news" },
    { word: "magazine", hint: "A periodical publication with articles" },
    { word: "dictionary", hint: "A book with word meanings" },
    { word: "chair", hint: "A piece of furniture for sitting" },
    { word: "table", hint: "A piece of furniture with a flat surface" },
    { word: "bed", hint: "A piece of furniture for sleeping" },
    { word: "sofa", hint: "A comfortable seat for multiple people" },
    { word: "door", hint: "A movable barrier for entry and exit" },
    { word: "window", hint: "An opening in a wall with glass" },
    { word: "curtain", hint: "A cloth used to cover windows" },
    { word: "lamp", hint: "A device that provides light" },
    { word: "pillow", hint: "A soft cushion for the head" },
    { word: "blanket", hint: "A large cloth used for warmth" },
    { word: "rug", hint: "A floor covering made of fabric" },
    { word: "glasses", hint: "Worn to improve vision" },
    { word: "shoes", hint: "Worn on the feet" },
    { word: "hat", hint: "A head covering" },
    { word: "umbrella", hint: "Used to protect from rain" },
    { word: "backpack", hint: "A bag worn on the back" },
    { word: "ball", hint: "A round object used in sports" }
];

let currentWord = null;
let score = 0;
let timeLeft = 30;
let timer = null;
let gameStatus = "playing";
let usedWords = new Set();

const elements = {
    score: document.getElementById('score'),
    time: document.getElementById('time'),
    scrambledWord: document.getElementById('scrambled-word'),
    userInput: document.getElementById('user-input'),
    hintButton: document.getElementById('hint-button'),
    hintText: document.getElementById('hint-text'),
    checkButton: document.getElementById('check-button'),
    nextButton: document.getElementById('next-button'),
    cancelButton: document.getElementById('cancel-game'),
    playAgain: document.getElementById('play-again'),
    feedback: document.getElementById('feedback'),
    timer: document.querySelector('.timer')
};

function scrambleWord(word) {
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    return scrambled === word ? scrambleWord(word) : scrambled;
}

function showFeedback(message, type) {
    elements.feedback.textContent = message;
    elements.feedback.className = `feedback ${type} visible`;
    setTimeout(() => {
        elements.feedback.classList.remove('visible');
    }, 2000);
}

function loadNewWord() {
    if (usedWords.size === words.length) {
        usedWords.clear();
    }

    const availableWords = words.filter(w => !usedWords.has(w.word));
    currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    usedWords.add(currentWord.word);
    elements.scrambledWord.textContent = scrambleWord(currentWord.word);
    elements.userInput.value = "";
    elements.hintText.classList.add('hidden');
    elements.feedback.classList.add('hidden');

    timeLeft = 30;
    elements.time.textContent = timeLeft;
    elements.timer.classList.remove('low-time');
}

function updateGameState(state) {
    gameStatus = state;
    elements.userInput.disabled = state !== "playing";
    elements.hintButton.disabled = state !== "playing";
    elements.nextButton.disabled = state !== "playing";
    elements.checkButton.classList.toggle('hidden', state !== "playing");
    elements.playAgain.classList.toggle('hidden', state === "playing");

    if (state !== "playing") {
        clearInterval(timer);
        elements.timer.classList.remove('low-time');
    }
}

function checkAnswer() {
    if (gameStatus !== "playing") return;

    const userAnswer = elements.userInput.value.trim().toLowerCase();
    const isCorrect = userAnswer === currentWord.word.toLowerCase();

    if (isCorrect) {
        score += 10;
        elements.score.textContent = score;
        showFeedback("Correct! +10 points", "success");
        setTimeout(loadNewWord, 1000);
    } else {
        showFeedback("Try again!", "error");
    }
}

function startGame() {
    score = 0;
    timeLeft = 30;
    usedWords.clear();
    gameStatus = "playing";
    
    elements.score.textContent = score;
    elements.time.textContent = timeLeft;
    updateGameState("playing");
    loadNewWord();

    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        elements.time.textContent = timeLeft;

        if (timeLeft <= 5) {
            elements.timer.classList.add('low-time');
        }

        if (timeLeft <= 0) {
            updateGameState("over");
            showFeedback("Time's up!", "error");
        }
    }, 1000);
}

// Event Listeners
elements.checkButton.addEventListener('click', checkAnswer);

elements.userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

elements.hintButton.addEventListener('click', () => {
    elements.hintText.textContent = "Hint: " + currentWord.hint;
    elements.hintText.classList.remove('hidden');
});

elements.nextButton.addEventListener('click', () => {
    loadNewWord();
    startTimer();
});

elements.cancelButton.addEventListener('click', () => {
    window.history.back();
});

elements.playAgain.addEventListener('click', startGame);

// Start the game
startGame();