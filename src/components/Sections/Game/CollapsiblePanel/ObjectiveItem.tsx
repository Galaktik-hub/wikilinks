import * as React from "react";
import CheckCircle from "../../../Check/Game/CheckCircle.tsx";

interface ObjectiveItemProps {
    text: string;
    isReached: boolean;
}

const ObjectiveItem: React.FC<ObjectiveItemProps> = ({
        text,
        isReached,
    }) => {
    return (
        <article
            className={`flex gap-2.5 items-center p-2 w-full rounded min-h-10 ${
                isReached ? "bg-gray-900" : "bg-gray-700"
            }`}
        >
            <CheckCircle checked={isReached} />
            <p className="gap-2.5 self-stretch py-1 my-auto">
                {text}
            </p>
        </article>
    );
};

export default ObjectiveItem;
