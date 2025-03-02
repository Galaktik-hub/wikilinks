import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
// import Test from "./pages/test/Test";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* Exemple */}
                {/*<Route path="/test" element={<Test />} />*/}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
