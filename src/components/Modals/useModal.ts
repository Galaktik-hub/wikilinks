import {useState} from "react";

interface ModalOptions {
    title: string;
    type: "form" | "confirmation" | "timeline";
    content: any;
    onClose?: () => void;
}

export default function useModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

    const openModal = (options: ModalOptions) => {
        setModalOptions(options);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setTimeout(() => {
            if (modalOptions?.onClose) modalOptions.onClose();
            setModalOptions(null);
        }, 300);
    };

    const updateModal = (options: Partial<ModalOptions>) => {
        setModalOptions(prev => (prev ? {...prev, ...options} : null));
    };

    return {
        isOpen,
        modalOptions,
        openModal,
        closeModal,
        updateModal,
    };
}
