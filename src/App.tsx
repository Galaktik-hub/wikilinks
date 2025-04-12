import "./App.css";
import "@mantine/core/styles.css";
import AppRoutes from "./route";
import {MantineProvider} from "@mantine/core";
import {ModalProvider} from "./components/Modals/ModalProvider.tsx";
import {SocketProvider} from "./context/SocketContext.tsx";
import {PopupProvider} from "./context/PopupContext";

function App() {
    return (
        <MantineProvider>
            <PopupProvider>
                <ModalProvider>
                    <SocketProvider>
                        <AppRoutes />
                    </SocketProvider>
                </ModalProvider>
            </PopupProvider>
        </MantineProvider>
    );
}

export default App;
