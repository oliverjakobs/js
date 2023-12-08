import { wordList } from './wordlist.js';

const ROW_COUNT = 6
const WORD_SIZE = 5

const root = document.documentElement
root.style.setProperty("--rows", ROW_COUNT)
root.style.setProperty("--cols", WORD_SIZE)

const boardElement = document.querySelector(".board")
boardElement.addEventListener("contextmenu", e => { e.preventDefault() })

let currentRow = 0
let guess = ""
let secret = ""

let gameOver = false

startGame()

function startGame() {
    // potential cleanup from previous game
    boardElement.textContent = ""
    currentRow = 0
    guess = ""
    secret = "fewer"//wordList[Math.floor(Math.random() * wordList.length)]
    
    gameOver = false

    for (let r = 0; r < ROW_COUNT; ++r) {
        for (let c = 0; c < WORD_SIZE; ++c) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile${r}${c}`;

            boardElement.appendChild(tile);
        }
    }
}

window.startGame = startGame

document.addEventListener('keydown', (e) => {
    if (gameOver || e.repeat) return;

    if (e.key === 'Enter' && guess.length === 5) {
        if (wordList.includes(guess)) {
            revealGuess()
            checkGameEnd()
            currentRow++
            guess = ""
        } else {
            displayStatus('Not a valid word.')
        }
    } else if (e.key === 'Backspace') {
        if (guess.length > 0) {
            guess = guess.slice(0, -1);
        }
    } else if (e.key.length === 1 && e.key.match(/[a-z]/i)) { // check for letter
        if (guess.length < 5) {
            guess += e.key.toLowerCase()
        }
    }

    updateGuess()
})

function updateGuess() {
    for (let c = 0; c < WORD_SIZE; ++c) {
        const tile = document.getElementById(`tile${currentRow}${c}`);
        tile.textContent = guess[c];
    }
}

function revealGuess() {
    let check = secret

    for (let i = 0; i < WORD_SIZE; i++) {
        const tile = document.getElementById(`tile${currentRow}${i}`)
        if (guess[i] === secret[i]) {
            check = check.replace(guess[i], '')
            tile.classList.add('green')
        }
    }

    for (let i = 0; i < WORD_SIZE; i++) {
        const tile = document.getElementById(`tile${currentRow}${i}`)
        if (check.includes(guess[i]) && guess[i] !== secret[i]) {
            check = check.replace(guess[i], '')
            tile.classList.add('yellow')
        }
        else {
            tile.classList.add('grey')
        }
    }

}

function checkGameEnd() {
    if (secret === guess) {
        displayStatus("You won!")
        gameOver = true
    } else if (currentRow >= ROW_COUNT) {
        displayStatus(`You've run out of guesses! The word was ${secret}.`)
        gameOver = true
    }
}

function displayStatus(status) {
    alert(status)
}

