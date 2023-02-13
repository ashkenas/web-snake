const arrayOfLength = (n) => Array.from(new Array(n));

class PieceType {
    static Empty = Symbol('empty');
    static Snake = Symbol('snack');
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
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.fps = fps;
        this.gameBoard = arrayOfLength(height).map(() =>
            arrayOfLength(width).map(() => PieceType.Empty)
        );
        this.interval = setInterval(this.tick.bind(this), 1000 / fps);
        this.refresh();
    }

    tick() {
        this.refresh();
    }

    refresh() {
        for (let r = 0; r < this.gameBoard.length; r++) {
            for (let c = 0; c < this.gameBoard[0].length; c++) {
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.fillStyle = PieceType.toColor(this.gameBoard[r][c]);
                this.ctx.fillRect(c, r, 1, 1);
            }
        }
    }
};

const game = new Game(16, 4, document.querySelector('canvas'), 2);
