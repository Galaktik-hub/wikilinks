import './App.css'
import '@mantine/core/styles.css';
import AppRoutes from "./route";
import { MantineProvider } from '@mantine/core';
import { ModalProvider } from "./components/Modals/ModalProvider.tsx";
import { ChatProvider } from "./context/ChatContext";
import { WebSocketProvider } from "./context/WebSocketProvider";

function App() {
    return (
        <MantineProvider>
            <ModalProvider>
                <WebSocketProvider>
                    <ChatProvider>
                        <AppRoutes />
                    </ChatProvider>
                </WebSocketProvider>
            </ModalProvider>
        </MantineProvider>
    )
}

export default App;
