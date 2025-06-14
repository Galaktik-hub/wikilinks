import {useState, useEffect} from "react";

const phrases = ["Initialisation des données", "Récupération des pages de Wikipédia", "Analyse des statistiques d'audience", "Préparation de la partie"];

interface LoadingScreenProps {
    title: string;
    phrases?: string[];
}

export default function LoadingScreen(props: LoadingScreenProps) {
    const title = props.title;
    const phrasesToDisplay = props.phrases ?? phrases;

    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [dotCount, setDotCount] = useState(0);

    // Animation des points : incrémente de 0 à 3 puis recommence
    useEffect(() => {
        const dotInterval = setInterval(() => {
            setDotCount(prev => (prev + 1) % 4);
        }, 500);
        return () => clearInterval(dotInterval);
    }, []);

    // Changement de phrase toutes les 4 secondes
    useEffect(() => {
        const phraseInterval = setInterval(() => {
            setCurrentPhraseIndex(prev => (prev + 1) % phrasesToDisplay.length);
            setDotCount(0);
        }, 4000);
        return () => clearInterval(phraseInterval);
    }, [phrasesToDisplay.length]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="card-container w-[400px] flex flex-col gap-4 items-center">
                <span className="blue-title-effect w-full text-center text-xl">{title}</span>
                <span className="w-full text-lg text-gray-400 italic">
                    {phrasesToDisplay[currentPhraseIndex]}
                    {".".repeat(dotCount)}
                </span>
            </div>
        </div>
    );
}
