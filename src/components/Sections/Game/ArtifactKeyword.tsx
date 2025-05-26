import {useState} from "react";
import {useGameContext} from "../../../context/GameContext";
import {useModalContext} from "../../Modals/ModalProvider";
import {usePlayersContext} from "../../../context/PlayersContext";
import {artifactDefinitions} from "../../../../packages/shared-types/player/inventory";
import {usePopup} from "../../../context/PopupContext";
import {selectArtifact} from "../../../utils/Game/selectArtifact";

interface ArtifactKeywordProps {
    text: string;
}

export default function ArtifactKeyword(props: ArtifactKeywordProps) {
    const {text} = props;
    const gameCtx = useGameContext()!;
    const {openModal, closeModal} = useModalContext();
    const {foundArtifact, usedArtifact} = usePlayersContext();
    const {showPopup} = usePopup();
    const [clicked, setClicked] = useState(false);

    const onClick = () => {
        if (clicked || !gameCtx.artifactInfo.hasArtifact) return;
        setClicked(true);

        const chosen = selectArtifact(gameCtx.artifactInfo);
        if (!chosen) return;

        foundArtifact(chosen);
        gameCtx.setArtifactInfo({hasArtifact: false, luckPercentage: null});

        const def = artifactDefinitions[chosen];
        const defaultOnClose = () => {
            usedArtifact(chosen);
            closeModal();
        };

        if (def.immediate) {
            if (chosen === "Dictateur") {
                usedArtifact("Dictateur");
                return;
            }
            openModal({
                title: `Artefact trouvé : ${chosen}`,
                type: "confirmation",
                content: {
                    message: def.definition,
                    okButton: {
                        label: "Suivant",
                        onClick: () => defaultOnClose(),
                    },
                },
                onClose: () => defaultOnClose(),
            });
        } else {
            showPopup("info", `Artefact trouvé : ${chosen}`);
        }
    };

    return (
        <>
            {clicked ? (
                <>{text}</>
            ) : (
                <button
                    disabled={clicked || !gameCtx.artifactInfo.hasArtifact}
                    onClick={onClick}
                    id="artifact-key-word"
                    title="Découvrir l'artefact"
                    className={`${clicked ? "" : "font-bold leading-none text-bluePrimary text-shadow-sky cursor-pointer"} text-[16px]`}>
                    {text}
                </button>
            )}
        </>
    );
}
