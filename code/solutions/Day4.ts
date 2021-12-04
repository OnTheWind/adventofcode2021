import { Day } from "./Day";

export class Day4 extends Day {
	getName(): string {
		return "Day 4";
	}

	problem1(): string {
        const game = new BingoGame(this.inputArray);
        return game.getFirstWinningBoardTotal().toString();
	}

	problem2(): string {
        const game = new BingoGame(this.inputArray);
        return game.getLastWinningBoardTotal().toString();
    }
}

class BingoGame {
    calledSquareArray: string[];
    bingoBoards: Set<BingoBoard> = new Set<BingoBoard>();
    
    constructor(inputArray: string[]) {
        this.calledSquareArray = inputArray[0].split(",");

        let bingoBoardInputArray: string[] = []
        for (let i = 1; i < inputArray.length; i++) {
            if (inputArray[i].length === 0) {
                if (bingoBoardInputArray.length > 0) {
                    this.bingoBoards.add(new BingoBoard(bingoBoardInputArray));
                }
                bingoBoardInputArray = [];
            }
            else {
                bingoBoardInputArray.push(inputArray[i]);
            }
        }

        if (bingoBoardInputArray.length > 0) {
            this.bingoBoards.add(new BingoBoard(bingoBoardInputArray));
        }
    }

    public getFirstWinningBoardTotal(): number {
        let winningBoard: BingoBoard | undefined;
        let winningSquare: string  = "";
        this.calledSquareArray.some((calledSquare) => {
            this.bingoBoards.forEach((board) => {
                if (board.removeSquare(calledSquare)) {
                    winningBoard = board;
                    return true;
                }
            });
            if (winningBoard !== undefined) {
                winningSquare = calledSquare;
                return true;
            }
        });
        if (winningBoard) {
            return winningBoard?.countRemaining() * +winningSquare;
        }
        return -1;
    }

    public getLastWinningBoardTotal(): number {
        let losingBoard: BingoBoard | undefined;
        let losingSquare: string = "";
        this.calledSquareArray.some((calledSquare) => {
            this.bingoBoards.forEach((board) => {
                if (board.removeSquare(calledSquare)) {
                    if (this.bingoBoards.size === 1) {
                        losingBoard = board;
                        return true;
                    }
                    this.bingoBoards.delete(board);
                }
            });
            if (losingBoard !== undefined) {
                losingSquare = calledSquare;
                return true;
            }
        });

        if (losingBoard) {
            return losingBoard?.countRemaining() * +losingSquare;
        }
        return -1;
    }
}

class BingoBoard {
    board: string[][] = [];
    boardSquares: Set<string> = new Set<string>();
    neededSquares: WinningSet[] = [];

    constructor(inputArray: string[]) {
        const numLines = inputArray.length;

        inputArray.forEach((line, row) => {
            let col = 0;
            line.split(" ").forEach((square) => {
                square = square.trim();
                if (square.length === 0) {
                    return;
                }
                //Add to collection of Squares
                this.boardSquares.add(square);
                //Add to row
                this.addToSet(row, square);
                //Add to column
                this.addToSet(numLines +  col++, square);
            });
        });
    }

    public removeSquare(square: string): boolean {
        let winner = false;

        this.boardSquares.delete(square);
        this.neededSquares.forEach((set) => {
            if (set.removeSquare(square)) {
                winner = true;
            }
        });

        return winner;
    }

    public countRemaining(): number {
        let count = 0;
        this.boardSquares.forEach((square) => {
            count += +square;
        });

        return count;
    }

    private addToSet(index: number, square: string): void {
        if (!this.neededSquares[index]) {
            this.neededSquares[index] = new WinningSet();
        }
        this.neededSquares[index].addSquare(square);
    }
}

class WinningSet {
    remainingSquares: Set<string>;

    constructor() {
        this.remainingSquares = new Set<string>();
    }

    public addSquare(square: string): void {
        this.remainingSquares.add(square);
    }

    /**
     * Call a square in the game
     * @param square square called
     * @returns true if the set is empty
     */
    public removeSquare(square: string): boolean {
        this.remainingSquares.delete(square);
        return this.remainingSquares.size === 0;
    }
}