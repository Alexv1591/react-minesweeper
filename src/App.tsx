import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Board } from "./Components/Board";

function App() {
    const beginner = { rows: 9, cols: 9, mines: 10 };
    const intermediate = { rows: 16, cols: 16, mines: 40 };
    const expert = { rows: 16, cols: 30, mines: 99 };

    const [level, setLevel] = useState(beginner);

    return (
        <>
            <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
            <div className="level-buttons">
                <button onClick={() => setLevel({ ...beginner })}>
                    Beginner
                </button>
                <button onClick={() => setLevel({ ...intermediate })}>
                    Intermediate
                </button>
                <button onClick={() => setLevel({ ...expert })}>Expert</button>
            </div>
            <Board
                key={`${level.rows}-${level.cols}-${level.mines}`}
                rows={level.rows}
                cols={level.cols}
                mines={level.mines}
            />
        </>
    );
}

export default App;
