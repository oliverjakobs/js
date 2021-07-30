
const TILE_STATUS = {
    HIDDEN: "hidden",
    MINE: "mine",
    FLAG: "flag",
    SAFE: "safe"
}

const BOARD_SIZE = 10
const MINE_COUNT = 8

let board = []
const boardElement = document.querySelector(".board")
const statusText = document.querySelector(".status")

boardElement.addEventListener("contextmenu", e => { e.preventDefault() })
boardElement.style.setProperty("--size", BOARD_SIZE)

startGame()

function startGame() {
    // potential cleanup from previous game
    boardElement.textContent = ""
    boardElement.removeEventListener("click", stopProp, { capture: true })
    boardElement.removeEventListener("contextmenu", stopProp, { capture: true })

    board = createBoard(BOARD_SIZE, MINE_COUNT)
    board.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener("click", () => {
            revealTile(tile)
            updateGameState()
        })
        tile.element.addEventListener("contextmenu", () => {
            markTile(tile)
            countMinesLeft()
        })
    })
    countMinesLeft()
}

function createBoard(size, minecount) {
    // generate mines
    const mines = []
    while (mines.length < minecount) {
        const pos = {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE)
        }

        if (!mines.some(positionMatch.bind(null, pos))) {
            mines.push(pos)
        }
    }

    // create board
    const board = []
    for (let i = 0; i < (size * size); i++) {
        const element = document.createElement("div")
        element.dataset.status = TILE_STATUS.HIDDEN
        
        const tile = {
            element,
            index: i,
            mine: false,
            set status(value) {
                this.element.dataset.status = value
            },
            get status() {
                return this.element.dataset.status
            }
        }
        tile.mine = mines.some(positionMatch.bind(null, tilePosition(tile)))
        board.push(tile)
    }
    return board
}

function markTile(tile) {
    if (tile.status === TILE_STATUS.FLAG) {
        tile.status = TILE_STATUS.HIDDEN
    } else if (tile.status === TILE_STATUS.HIDDEN) {
        tile.status = TILE_STATUS.FLAG
    }
}

function revealTile(tile) {
    if (tile.status !== TILE_STATUS.HIDDEN) {
        return
    }

    if (tile.mine) {
        tile.status = TILE_STATUS.MINE
        return
    }

    tile.status = TILE_STATUS.SAFE

    const adjacent = adjacentTiles(tile)
    const mines = adjacent.filter(t => t.mine)
    if (mines.length == 0) {
        adjacent.forEach(revealTile.bind(null))
    } else {
        tile.element.textContent = mines.length
    }
}

function adjacentTiles(tile) {
    const tiles = []
    const center = tilePosition(tile)

    const startx = Math.max(center.x - 1, 0)
    const starty = Math.max(center.y - 1, 0)
    const endx = Math.min(center.x + 1, BOARD_SIZE - 1)
    const endy = Math.min(center.y + 1, BOARD_SIZE - 1)

    for (let x = startx; x <= endx; x++) {
        for (let y = starty; y <= endy; y++) {
            if (!positionMatch(center, {x,y})) {
                tiles.push(board[y * BOARD_SIZE + x])
            }
        }
    }

    return tiles
}

// TODO: improve
function getGameState() {
    if (board.every(tile => { 
            return tile.status == TILE_STATUS.SAFE || 
                (tile.mine && (tile.status == TILE_STATUS.HIDDEN || tile.status == TILE_STATUS.FLAG))
        })) {
        return 1
    } 
            
    if (board.some(tile => { return tile.status === TILE_STATUS.MINE })) return -1
    return 0
}

function updateGameState() {
    const state = getGameState()

    if (state === 0) return 
    
    boardElement.addEventListener("click", stopProp, { capture: true })
    boardElement.addEventListener("contextmenu", stopProp, { capture: true })

    // won
    if (state > 0) {
        statusText.textContent = "You won."
    }

    // lost
    if (state < 0) {
        statusText.textContent = "You lost."
        board.forEach(tile => {
            if (tile.mine) {
                if (tile.status === TILE_STATUS.FLAG) markTile(tile)
                revealTile(tile)
            }
        })
    }
}

function tilePosition(tile) {
    return { x: (tile.index % BOARD_SIZE), y: Math.floor(tile.index / BOARD_SIZE) }
}

function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y
}

function countMinesLeft() {
    const marked = board.filter(tile => tile.status === TILE_STATUS.FLAG).length
    statusText.textContent = "Mines left: " + (MINE_COUNT - marked)
}

function stopProp(e) {
    e.stopImmediatePropagation()
}