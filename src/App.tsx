import './App.css'
import WaitingRoom from "./pages/WaitingRoom/WaitingRoom.tsx";
import {ModalProvider} from "./components/Modals/ModalProvider.tsx";

function App() {
    return (
        <ModalProvider>
            <WaitingRoom />
        </ModalProvider>
    )
}

export default App;