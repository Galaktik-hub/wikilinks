import './App.css'
import '@mantine/core/styles.css';
import AppRoutes from "./route";
import {ModalProvider} from "./components/Modals/ModalProvider.tsx";
import { MantineProvider } from '@mantine/core';

function App() {
    return (
        <MantineProvider>
            <ModalProvider>
                <AppRoutes />
            </ModalProvider>
        </MantineProvider>
    )
}

export default App;
