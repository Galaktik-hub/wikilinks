import { createContext, useContext, ReactNode } from "react";
import useModal from "./useModal";
import Modal from "./Modal";

interface ModalProviderProps {
    children: ReactNode;
}

const ModalContext = createContext<any>(null);

export function ModalProvider({ children }: ModalProviderProps) {
    const { isOpen, modalOptions, openModal, closeModal, updateModal  } = useModal();

    return (
        <ModalContext.Provider value={{ openModal, closeModal, updateModal, isOpen }}>
            {children}
            {isOpen && modalOptions && (
                <Modal
                    isOpen={isOpen}
                    onClose={closeModal}
                    title={modalOptions.title}
                    type={modalOptions.type}
                    content={modalOptions.content}
                />
            )}
        </ModalContext.Provider>
    );
}

export function useModalContext() {
    return useContext(ModalContext);
}