import './App.css'
import '@mantine/core/styles.css';
import AppRoutes from "./route";
import { MantineProvider } from '@mantine/core';
import { ModalProvider } from "./components/Modals/ModalProvider.tsx";
import { SocketProvider } from './context/SocketContext.tsx';

function App() {
    return (
        <MantineProvider>
            <ModalProvider>
                <SocketProvider>
                    <AppRoutes />
                </SocketProvider>
            </ModalProvider>
        </MantineProvider>
    )
}

export default App;
