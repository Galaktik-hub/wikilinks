import "./App.css";
import "@mantine/core/styles.css";
import AppRoutes from "./route";
import {MantineProvider} from "@mantine/core";
import {ModalProvider} from "./components/Modals/ModalProvider.tsx";
import {PopupProvider} from "./context/PopupContext";
import {WebSocketProvider} from "./context/WebSocketContext.tsx";

function App() {
    return (
        <MantineProvider>
            <PopupProvider>
                <ModalProvider>
                    <WebSocketProvider>
                        <AppRoutes />
                    </WebSocketProvider>
                </ModalProvider>
            </PopupProvider>
        </MantineProvider>
    );
}

export default App;
