import './App.css'
import AppRoutes from "./route";
import { ModalProvider } from "./components/Modals/ModalProvider.tsx";
import { ChatProvider } from "./contexts/ChatContext";

function App() {
    return (
        <ChatProvider>
            <ModalProvider>
                <AppRoutes />
            </ModalProvider>
        </ChatProvider>
    )
}

export default App;
