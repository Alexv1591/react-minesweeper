
type TileProps = {
    adjacentMines: number;
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    onRightClick: () => void;
    onLeftClick: () => void;
};

export function Tile({
    adjacentMines,
    isMine,
    isRevealed,
    isFlagged,
    onRightClick: onRightClick,
    onLeftClick: onLeftClick,
}: TileProps) {

    const numberColor = () => {
        if (isMine) return "red";
        switch (adjacentMines) {
            case 1:
                return "teal";
            case 2:
                return "green";
            case 3:
                return "orange";
            case 4:
                return "purple";
            case 5:
                return "maroon";
            case 6:
                return "cyan";
            case 7:
                return "black";
            case 8:
                return "gray";
            default:
                return "white";
        }
    };

    const rightClick = () => {
        onRightClick();
    };

    const leftClick = () => {
        onLeftClick();
    };

    return isRevealed ? (
        <div
            className="tile revealed"
            style={{ color: numberColor() }}
            onClick={() => {
                rightClick();
            }}
            onContextMenu={(event) => {
                event.preventDefault();
            }}
        >
            {isMine ? "X" : adjacentMines || ""}
        </div>
    ) : (
        <div
            onClick={() => {
                rightClick();
            }}
            onContextMenu={(event) => {
                event.preventDefault();
                leftClick();
            }}
            className="tile"
        >
            {isFlagged ? "🚩" : ""}
        </div>
    );
}
