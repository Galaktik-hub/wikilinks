import {useEffect, useState} from "react";
import {Timer} from "./Timer";
import {PlayButton} from "./PlayButton";
import {PlayerCount} from "./PlayerCount";
import AndroidSVG from "../../../../assets/Home/AndroidSVG.tsx";
import TrophySVG from "../../../../assets/Home/TrophySVG.tsx";
import {useNavigate} from "react-router-dom";
import {isAndroid} from "../../../../functions/androidCheck.ts";
import {useWebSocket} from "../../../../context/WebSocketContext";

const DailyChallengeSection = () => {
    const socketContext = useWebSocket();
    const [challengeCount, setChallengeCount] = useState<number>(0);
    const [articleName, setArticleName] = useState<string>("");

    useEffect(() => {
        if (socketContext.messages.length > 0) {
            const lastMessage = socketContext.messages[socketContext.messages.length - 1];
            if (lastMessage.kind === "all_sessions") {
                setChallengeCount(lastMessage.challengeCount);
                setArticleName(lastMessage.challengeArticle);
            }
        }
    }, [socketContext.messages]);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/challenge");
    };

    if (isAndroid()) {
        // Display the daily challenge for mobile only if it's on Android
        return (
            <div className="font-inter bg-gradient-to-br from-[#EA580C] to-[#DC2626] rounded-2xl p-6 text-white flex flex-col gap-4 w-[90%] md:w-[600px] mx-auto my-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-bold">Défi du jour</h2>
                    <Timer />
                </div>
                <h2 className="text-2xl md:text-3xl text-center my-4">{articleName.replace(/_/g, " ")}</h2>
                <PlayerCount count={challengeCount} />
                <PlayButton onClick={handleClick} />
            </div>
        );
    } else {
        // Display the ad for non Android app users
        return (
            <div className="font-inter bg-gradient-to-br from-[#EA580C] to-[#DC2626] rounded-2xl p-6 md:p-8 text-white mx-4 my-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 relative z-10">
                    {/* Text Section */}
                    <div className="w-full md:w-3/5 flex flex-col gap-3">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Découvrez les défis quotidiens</h2>
                        <p className="font-light text-sm sm:text-base md:text-lg">
                            Affrontez les joueurs du monde entier à travers des défis quotidiens basés sur votre position !
                        </p>
                        <div className="mt-3">
                            <PlayerCount count={challengeCount} />
                        </div>
                    </div>

                    {/* Button Section */}
                    <div className="w-full md:w-auto flex justify-center md:justify-end">
                        <button
                            className="font-righteous text-base sm:text-lg inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#10B981] rounded-full hover:bg-[#0D9668] transition-colors min-w-[160px] sm:min-w-[180px] relative z-20"
                            onClick={() => console.log("Download clicked")}>
                            <AndroidSVG className="w-5 h-5 sm:w-6 sm:h-6" />
                            Télécharger
                        </button>
                    </div>
                </div>

                {/* Trophy */}
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-4 transform -rotate-2 translate-x-2 translate-y-2 sm:translate-x-4 sm:translate-y-4 opacity-90 pointer-events-none z-0">
                    <TrophySVG />
                </div>
            </div>
        );
    }
};

export default DailyChallengeSection;
