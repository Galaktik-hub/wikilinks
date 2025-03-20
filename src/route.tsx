import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import WaitingRoom from "./pages/WaitingRoom/WaitingRoom.tsx";
import Game from "./pages/Game/Game.tsx";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room" element={<WaitingRoom />} />
                <Route path="/game" element={<Game />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
