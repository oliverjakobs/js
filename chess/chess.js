const boardElement = document.querySelector(".board")
const squareElements = document.querySelectorAll('.square')

function createPiece(name, color, text) {
    return `<div class="piece ${name}" id="${name}" color="${color}" draggable="true">${text}</div>`
}

// pieces
const bK = createPiece("king", "black", "&#x265A;")
const bQ = createPiece("queen", "black", "&#x265B;")
const bR = createPiece("rook", "black", "&#x265C;")
const bB = createPiece("bishop", "black", "&#x265D;")
const bN = createPiece("knight", "black", "&#x265E;")
const bP = createPiece("pawn", "black", "&#x265F;")

const wK = createPiece("king", "white", "&#x2654;")
const wQ = createPiece("queen", "white", "&#x2655;")
const wR = createPiece("rook", "white", "&#x2656;")
const wB = createPiece("bishop", "white", "&#x2657;")
const wN = createPiece("knight", "white", "&#x2658;")
const wP = createPiece("pawn", "white", "&#x2659;")

const setup = [
    bR, bK, bB, bQ, bK, bB, bK, bR,
    bP, bP, bP, bP, bP, bP, bP, bP,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    wP, wP, wP, wP, wP, wP, wP, wP,
    wR, wK, wB, wQ, wK, wB, wK, wR,
]

let turn = 0

function setupPieces() {
    squareElements.forEach((square, i) => {
        square.innerHTML = setup[i]
        square.addEventListener("dragover", (e) => { e.preventDefault() })
        square.addEventListener("drop", drop)

        let row = 8 - Math.floor(i/8)           // row is a number from 1 to 8
        let col = String.fromCharCode(97+(i%8)) // col is a letter from 'a' to 'h'
        square.id = col+row

        let piece = square.firstChild
        if (piece) {
            piece.addEventListener("dragstart", drag)
            piece.id += square.id
        }
    })
}

setupPieces()

function drag(e) {
    const piece = e.target
    const color = piece.getAttribute('color')

    if ((turn == 0 && color == "white") || (turn == 1 && color == "black"))
        e.dataTransfer.setData('text', piece.id)
}

function drop(e) {
    e.preventDefault()
    let data = e.dataTransfer.getData('text')
    const piece = document.getElementById(data)
    const dst = e.currentTarget
    dst.appendChild(piece)
    turn = !turn
}