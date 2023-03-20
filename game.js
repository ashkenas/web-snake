const arrayOfLength = (n) => Array.from(new Array(n));

class PieceType {
    static Empty = Symbol('empty');
    static Snake = Symbol('snake');
    static Food = Symbol('food');
    static toColor = (type) => {
        switch (type) {
            case this.Empty: return '#000000';
            case this.Snake: return '#FFFFFF';
            case this.Food: return '#FF0000';
            default: return 0;
        }
    }
};

class Game {
    constructor (width, height, canvas, fps) {
        this.width = width;
        canvas.width = width;
        this.height = height;
        canvas.height = height;
        this.direction = [1, 0];
        this.x = 0;
        this.y = 0;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.fps = fps;
        this.gameBoard = arrayOfLength(width).map(() =>
            arrayOfLength(height).map(() => PieceType.Empty)
        );
        this.gameBoard[0][0] = PieceType.Snake;
        this.snake = this.piece(this.x, this.y);
        this.placeFood();
        this.refresh();
        this.start();
    }

    piece(x, y, prev = null) {
        let lx = x;
        let ly = y;
        return (nx, ny, front = false) => {
            if (front) {
                if (this.gameBoard[nx][ny] === PieceType.Food) {
                    this.snake = this.piece(nx, ny, this.snake);
                    this.gameBoard[nx][ny] = PieceType.Snake;
                    this.placeFood();
                    return;
                } else if (this.gameBoard[nx][ny] === PieceType.Snake) {
                    this.stop();
                    return;
                }
                this.gameBoard[nx][ny] = PieceType.Snake;
            }
            
            if (prev) prev(lx, ly);
            else this.gameBoard[lx][ly] = PieceType.Empty;

            lx = nx;
            ly = ny;
        };
    }

    placeFood() {
        while (true) {
            let x = Math.floor(Math.random() * this.width);
            let y = Math.floor(Math.random() * this.height);
            if (this.gameBoard[x][y] === PieceType.Empty) {
                this.gameBoard[x][y] = PieceType.Food;
                return;
            }
        }
    }

    tick() {
        this.x += this.direction[0];
        this.y += this.direction[1];
        if (this.x >= this.width ||  this.x < 0 || this.y >= this.height ||  this.y < 0) {
            this.stop();
            return;
        }
        this.snake(this.x, this.y, true);
        this.refresh();
    }

    refresh() {
        for (let c = 0; c < this.gameBoard.length; c++) {
            for (let r = 0; r < this.gameBoard[0].length; r++) {
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.fillStyle = PieceType.toColor(this.gameBoard[c][r]);
                this.ctx.fillRect(c, r, 1, 1);
            }
        }
    }

    setDirection(xDir, yDir) {
        if (xDir === this.direction[0] * -1 && yDir === this.direction[1] * -1)
            return;
        this.direction = [xDir, yDir];
    }

    start() {
        if (!this.over)
            this.interval = setInterval(() => this.tick(), 1000 / this.fps);
    }

    pause() {
        if (this.interval !== null)
            clearInterval(this.interval);
        this.interval = null;
    }

    toggle() {
        if (!this.over && this.interval === null) this.start();
        else this.pause();
    }

    stop() {
        this.pause();
        this.over = true;
    }
};

const game = new Game(16, 4, document.querySelector('canvas'), 4);

addEventListener('keydown', (e) => {
    if (e.key === ' ') game.toggle();
    if (e.key === 'ArrowRight') game.setDirection(1, 0);
    if (e.key === 'ArrowLeft') game.setDirection(-1, 0);
    if (e.key === 'ArrowUp') game.setDirection(0, -1);
    if (e.key === 'ArrowDown') game.setDirection(0, 1);
});
