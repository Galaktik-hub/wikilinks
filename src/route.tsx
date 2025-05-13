import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home/Home";
import WaitingRoom from "./pages/WaitingRoom/WaitingRoom.tsx";
import Game from "./pages/Game/Game.tsx";
import Result from "./pages/Result/Result.tsx";
import GameChallenge from "./pages/Challenge/Game/Game.tsx";
import Challenge from "./pages/Challenge/Challenge.tsx";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room" element={<WaitingRoom />} />
                <Route path="/game" element={<Game />} />
                <Route path="/result" element={<Result />} />
                <Route path="/challenge" element={<Challenge />} />
                <Route path="/challenge/game" element={<GameChallenge />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
