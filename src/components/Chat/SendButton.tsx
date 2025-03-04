import SendSVG from "../../assets/WaitingRoom/SendSVG.tsx";
interface SendButtonProps {
    onClick: () => void;
}

export function SendButton({ onClick }: SendButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex gap-2.5 items-center self-stretch px-2 py-3 my-auto w-8 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="Send message"
        >
            <SendSVG />
        </button>
    );
}