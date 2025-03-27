import './App.css'
import '@mantine/core/styles.css';
import AppRoutes from "./route";
import { MantineProvider } from '@mantine/core';
import { ModalProvider } from "./components/Modals/ModalProvider.tsx";
import { ChatProvider } from "./context/ChatContext";

function App() {
    return (
        <MantineProvider>
            <ModalProvider>
                <ChatProvider>
                    <AppRoutes />
                </ChatProvider>
            </ModalProvider>
        </MantineProvider>
    )
}

export default App;
