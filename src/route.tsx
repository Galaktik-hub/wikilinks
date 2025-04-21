import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home/Home";
import WaitingRoom from "./pages/WaitingRoom/WaitingRoom.tsx";
import Game from "./pages/Game/Game.tsx";
import Result from "./pages/Result/Result.tsx";
import GameChallenge from "./pages/Challenge/Game/Game.tsx";
import ResultChallenge from "./pages/Challenge/Result/Result.tsx";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room" element={<WaitingRoom />} />
                <Route path="/game" element={<Game />} />
                <Route path="/result" element={<Result />} />
                <Route path="/challenge/game" element={<GameChallenge />} />
                <Route path="/challenge/result" element={<ResultChallenge />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
