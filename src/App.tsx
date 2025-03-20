import './App.css'
import AppRoutes from "./route";

function App() {
    return (
        <ModalProvider>
            <AppRoutes />
        </ModalProvider>
    )
}

export default App;
