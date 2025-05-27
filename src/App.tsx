import "./App.css";
import "@mantine/core/styles.css";
import AppRoutes from "./route";
import {MantineProvider} from "@mantine/core";
import {ModalProvider} from "./components/Modals/ModalProvider.tsx";
import {PopupProvider} from "./context/PopupContext";
import {WebSocketProvider} from "./context/WebSocketContext.tsx";
import {BrowserRouter as Router} from "react-router-dom";
import {AudioProvider} from "./context/AudioContext";

function App() {
    return (
        <Router>
            <MantineProvider>
                <AudioProvider>
                    <PopupProvider>
                        <ModalProvider>
                                <WebSocketProvider>
                                    <AppRoutes />
                                </WebSocketProvider>
                        </ModalProvider>
                    </PopupProvider>
                </AudioProvider>
            </MantineProvider>
        </Router>
    );
}

export default App;
