import "./Board.scss";
import { Tile } from "./Tile";
import { useEffect, useState } from "react";

type BoardProps = {
    rows: number;
    cols: number;
    mines: number;
};

class Cell {
    public isMine: boolean;
    public isFlagged: boolean = false;
    public adjacentMines: number;
    public isRevealed: boolean;
    constructor(isMine: boolean = false, adjacentMines: number = 0) {
        this.isMine = isMine;
        this.adjacentMines = adjacentMines;
        this.isRevealed = false;
    }
}

export function Board({ rows, cols, mines }: BoardProps) {
    const [board, setBoard] = useState<Cell[][]>(() =>
        Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => new Cell()),
        ),
    );
    const [revealedCells, setRevealedCells] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [minesLeft, setMinesLeft] = useState(mines);
    const [firstClick, setFirstClick] = useState(true);
    const [timer, setTimer] = useState(0);

    const clearBoardInOneSec = () => {
        setTimeout(() => {
            setBoard(
                Array.from({ length: rows }, () =>
                    Array.from({ length: cols }, () => new Cell()),
                ),
            );
            setRevealedCells(0);
            setGameOver(false);
            setMinesLeft(mines);
            setFirstClick(true);
        }, 1000);
    };

    useEffect(() => {
        // Check for win condition after each cell reveal
        if (gameOver) return;
        setTimeout(() => {
            if (revealedCells === rows * cols - mines) {
                setGameOver(true);
                alert("Congratulations! You've cleared the board!");
                clearBoardInOneSec();
            }
        }, 100);
    }, [revealedCells]);

    useEffect(() => {
        // Reset timer on first click and start counting
        if (firstClick) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTimer(0);
            return;
        }
        const interval = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [firstClick]);

    const createBoard = (
        rows: number,
        cols: number,
        mines: number,
        firstRow: number,
        firstCol: number,
    ) => {
        const newBoard: Cell[][] = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => new Cell()),
        );

        const placeMines = () => {
            console.log("Placing mines...");
            let placedMines = 0;
            while (placedMines < mines) {
                const row = Math.floor(Math.random() * rows);
                const col = Math.floor(Math.random() * cols);
                if (
                    newBoard[row][col].isMine ||
                    (row === firstRow && col === firstCol)
                )
                    continue;
                newBoard[row][col].isMine = true;
                placedMines++;
                incrementAdjacentCells(row, col);
            }
        };

        const incrementAdjacentCells = (row: number, col: number) => {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (
                        newRow >= 0 &&
                        newRow < rows &&
                        newCol >= 0 &&
                        newCol < cols
                    ) {
                        newBoard[newRow][newCol].adjacentMines++;
                    }
                }
            }
        };

        if (mines > 0) placeMines();
        return newBoard;
    };

    const revealCell = (rowIdx: number, colIdx: number) => {
        if (board[rowIdx][colIdx].isRevealed) return;
        setBoard((prevBoard) => {
            const newBoard = prevBoard.map((row) => row.slice());
            const queue: [number, number][] = [[rowIdx, colIdx]];
            const visited = new Set<string>();
            visited.add(`${rowIdx},${colIdx}`);

            while (queue.length > 0) {
                const [r, c] = queue.pop()!;
                const cell = newBoard[r][c];
                if (cell.isRevealed) continue;
                setRevealedCells((prev) => prev + 1);

                cell.isRevealed = true;

                if (cell.isMine) {
                    alert("Game Over! You hit a mine.");
                    revealMines();
                    setGameOver(true);
                    clearBoardInOneSec();
                    return newBoard;
                }

                if (cell.adjacentMines === 0) {
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            const newRow = r + i;
                            const newCol = c + j;
                            const key = `${newRow},${newCol}`;
                            if (
                                newRow >= 0 &&
                                newRow < rows &&
                                newCol >= 0 &&
                                newCol < cols &&
                                !visited.has(key)
                            ) {
                                queue.push([newRow, newCol]);
                                visited.add(key);
                            }
                        }
                    }
                }
            }
            return newBoard;
        });
    };

    const autoReveal = (rowIdx: number, colIdx: number) => {
        const queue: [number, number][] = [[rowIdx, colIdx]];
        let flaggedCount = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = rowIdx + i;
                const newCol = colIdx + j;
                if (
                    newRow >= 0 &&
                    newRow < rows &&
                    newCol >= 0 &&
                    newCol < cols &&
                    !board[newRow][newCol].isRevealed
                ) {
                    if (board[newRow][newCol].isFlagged) {
                        flaggedCount++;
                    }
                    queue.push([newRow, newCol]);
                }
            }
        }
        if (flaggedCount === board[rowIdx][colIdx].adjacentMines) {
            queue.forEach(([r, c]) => {
                if (!board[r][c].isFlagged) {
                    revealCell(r, c);
                }
            });
        }
    };

    const revealMines = () => {
        setBoard((prevBoard) => {
            const newBoard = prevBoard.map((row) => row.slice());
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (newBoard[r][c].isMine) {
                        newBoard[r][c].isRevealed = true;
                    }
                }
            }
            return newBoard;
        });
    };

    const handleRightClick = (rowIdx: number, colIdx: number) => {
        if (gameOver || board[rowIdx][colIdx].isFlagged) return;
        if (firstClick) {
            setBoard(createBoard(rows, cols, mines, rowIdx, colIdx));
            setFirstClick(false);
            revealCell(rowIdx, colIdx);
            return;
        }
        if (board[rowIdx][colIdx].isRevealed) {
            autoReveal(rowIdx, colIdx);
        } else {
            revealCell(rowIdx, colIdx);
        }
    };

    const handleLeftClick = (rowIdx: number, colIdx: number) => {
        if (gameOver) return;

        if (board[rowIdx][colIdx].isRevealed) {
            autoReveal(rowIdx, colIdx);
            return;
        }

        setBoard((prevBoard) => {
            const newBoard = prevBoard.map((row) => row.slice());
            const cell = newBoard[rowIdx][colIdx];

            if (cell.isFlagged) {
                setMinesLeft((prev) => prev + 1);
            } else {
                setMinesLeft((prev) => prev - 1);
            }

            cell.isFlagged = !cell.isFlagged;
            return newBoard;
        });
    };

    return (
        <div className="board-container">
            <div className="stats">
                <strong>
                    {"[ "}
                    Level: {rows}x{cols} with {mines} mines
                </strong>
                <strong>
                    {" ] [ "}
                    Revealed cells: {revealedCells}
                </strong>
                <strong>
                    {" ] [ "}
                    Mines left:
                    <span style={{ color: minesLeft < 0 ? "red" : "white" }}>
                        {minesLeft}
                    </span>
                </strong>
                <strong>
                    {" ] [ "}
                    Timer: {timer}s{" ]"}
                </strong>
            </div>

            <div
                className="board"
                onContextMenu={(event) => {
                    event.preventDefault();
                }}
            >
                {board.map((row, rowIdx) => (
                    <div className="board-row">
                        {row.map((cell, colIdx) => (
                            <Tile
                                key={`${rowIdx}-${colIdx}`}
                                adjacentMines={cell.adjacentMines}
                                isMine={cell.isMine}
                                isRevealed={board[rowIdx][colIdx].isRevealed}
                                isFlagged={board[rowIdx][colIdx].isFlagged}
                                onRightClick={() =>
                                    handleRightClick(rowIdx, colIdx)
                                }
                                onLeftClick={() =>
                                    handleLeftClick(rowIdx, colIdx)
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
