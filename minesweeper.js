// minesweeper.js

document.addEventListener("DOMContentLoaded", () => {
    const tpl = document.getElementById("minesweeper-template");

    const ROWS = 9;
    const COLS = 9;
    const MINES = 10;

    // Make windows draggable
    function makeDraggable(win) {
        const titleBar = win.querySelector(".title-bar");
        let isDragging = false, offsetX = 0, offsetY = 0;

        titleBar.addEventListener("mousedown", e => {
            isDragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
            if (window.bringToFront) window.bringToFront(win);
        });

        document.addEventListener("mousemove", e => {
            if (!isDragging) return;
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - win.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - win.offsetHeight));
            win.style.left = `${newLeft}px`;
            win.style.top = `${newTop}px`;
        });

        document.addEventListener("mouseup", () => isDragging = false);
    }

    // Game logic
    class Cell {
        constructor() {
            this.mine = false;
            this.revealed = false;
            this.flagged = false;
            this.adjacent = 0;
        }
    }

    class Minesweeper {
        constructor(container, rows, cols, mines, mineCounterEl, timerEl) {
            this.container = container;
            this.rows = rows;
            this.cols = cols;
            this.mines = mines;
            this.board = [];
            this.gameOver = false;
            this.mineCounterEl = mineCounterEl;
            this.timerEl = timerEl;
            this.flagsPlaced = 0;
            this.timerStarted = false;
            this.startTime = null;
            this.timerInterval = null;
            this.init();
        }
        updateMineCounter() {
        if (this.mineCounterEl) {
            updateCounter(this.mineCounterEl, this.mines - this.flagsPlaced);
        }
        }

        updateTimer(seconds) {
        if (this.timerEl) {
            updateCounter(this.timerEl, seconds);
        }
        }

        init() {
            this.board = Array.from({ length: this.rows }, () =>
                Array.from({ length: this.cols }, () => new Cell())
            );

            // Place mines
            let placed = 0;
            while (placed < this.mines) {
                const r = Math.floor(Math.random() * this.rows);
                const c = Math.floor(Math.random() * this.cols);
                if (!this.board[r][c].mine) {
                    this.board[r][c].mine = true;
                    placed++;
                }
            }

            // Calculate adjacent counts
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.board[r][c].adjacent = this.countAdjacent(r, c);
                }
            }

            this.gameOver = false;
            this.flagsPlaced = 0;
            this.timerStarted = false;
            this.startTime = null;
            if (this.timerInterval) clearInterval(this.timerInterval);
            this.updateMineCounter();
            this.updateTimer(0);
            this.render();
        }

        countAdjacent(r, c) {
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                        if (this.board[nr][nc].mine) count++;
                    }
                }
            }
            return count;
        }

        startTimer() {
            if (this.timerStarted) return;
            this.timerStarted = true;
            this.startTime = Date.now();
            this.timerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this.updateTimer(elapsed);
            }, 1000);
        }

        stopTimer() {
            if (this.timerInterval) clearInterval(this.timerInterval);
        }

        updateTimer(seconds) {
            if (this.timerEl) {
                this.timerEl.textContent = seconds.toString().padStart(3, "0");
            }
        }

        updateMineCounter() {
            if (this.mineCounterEl) {
                this.mineCounterEl.textContent = (this.mines - this.flagsPlaced).toString().padStart(2, "0");
            }
        }

        reveal(r, c) {
            const cell = this.board[r][c];
            if (this.gameOver || cell.revealed || cell.flagged) return;

            if (!this.timerStarted) this.startTimer();

            cell.revealed = true;

            if (cell.mine) {
                this.gameOver = true;
                this.stopTimer();
                this.revealAll();
                return;
            }

            if (cell.adjacent === 0) {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                            this.reveal(nr, nc);
                        }
                    }
                }
            }

            this.checkWin();
            this.render();
        }

        flag(r, c) {
            const cell = this.board[r][c];
            if (this.gameOver || cell.revealed) return;
            cell.flagged = !cell.flagged;
            this.flagsPlaced += cell.flagged ? 1 : -1;
            this.updateMineCounter();
            this.render();
        }

        revealAll() {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.board[r][c].revealed = true;
                }
            }
            this.render();
        }

        checkWin() {
            let unrevealed = 0;
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    const cell = this.board[r][c];
                    if (!cell.revealed && !cell.mine) unrevealed++;
                }
            }
            if (unrevealed === 0) {
                this.gameOver = true;
                this.stopTimer();
                alert("🎉 You Win!");
                this.revealAll();
            }
        }

        render() {
            this.container.innerHTML = "";
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    const cell = this.board[r][c];
                    const div = document.createElement("div");
                    div.classList.add("minesweeper-cell");

                    if (cell.revealed) {
                        div.classList.add("revealed");
                        if (cell.mine) {
                            div.classList.add("mine");
                            div.textContent = "💣";
                        } else if (cell.adjacent > 0) {
                            div.textContent = cell.adjacent;
                        }
                    } else if (cell.flagged) {
                        div.classList.add("flag");
                        div.textContent = "🚩";
                    }

                    div.addEventListener("contextmenu", e => {
                        e.preventDefault();
                        this.flag(r, c);
                    });

                    div.addEventListener("click", () => {
                        this.reveal(r, c);
                    });

                    this.container.appendChild(div);
                }
            }
        }
    }
    function updateCounter(counterEl, number) {
    const digits = number.toString().padStart(3, "0").split("");
    const digitEls = counterEl.querySelectorAll(".digit");
    digits.forEach((digit, index) => {
        if (digitEls[index]) digitEls[index].textContent = digit;
    });
    }
    // Open a Minesweeper window
    function openMinesweeper() {
        const win = tpl.content.firstElementChild.cloneNode(true);
        win.style.display = "block";
        win.style.top = Math.random() * 200 + "px";
        win.style.left = Math.random() * 200 + "px";

        // Sounds (optional)
        if (window.SoundFX) {
            SoundFX.open();
            SoundFX.click();
        }

        const board = win.querySelector(".minesweeper-board");
        const newGameBtn = win.querySelector(".new-game-btn");

        // Add mine counter and timer elements if not present
        const mineCounterEl = win.querySelector("#mine-count");
        const timerEl = win.querySelector("#timer");

        let game = new Minesweeper(board, ROWS, COLS, MINES, mineCounterEl, timerEl);

        newGameBtn.addEventListener("click", () => {
            game = new Minesweeper(board, ROWS, COLS, MINES, mineCounterEl, timerEl);
        });

        win.querySelector(".close-btn").addEventListener("click", () => {
            if (window.SoundFX) SoundFX.close();
            if (game) game.stopTimer();
            win.remove();
        });

        makeDraggable(win);
        document.body.appendChild(win);
        if (window.bringToFront) window.bringToFront(win);
    }

    // Desktop icon launcher
    function isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    const icon = document.getElementById("minesweeper-icon");
    const handler = () => openMinesweeper();

    if (isMobile()) {
        icon.addEventListener("click", handler);
    } else {
        icon.addEventListener("dblclick", handler);
    }

    // Auto-launch if needed
    // openMinesweeper(); // Uncomment if you want auto-start
});
