import './App.css'
import AppRoutes from "./route";
import {ModalProvider} from "./components/Modals/ModalProvider.tsx";

function App() {
    return (
        <ModalProvider>
            <AppRoutes />
        </ModalProvider>
    )
}

export default App;
