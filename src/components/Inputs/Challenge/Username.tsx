import {useEffect, useRef, useState} from "react";
import {getUsername, setUsername} from "../../../utils/Username/UsernameUtils";
import {useChallengeContext} from "../../../context/ChallengeContext";
import {useWebSocket} from "../../../context/WebSocketContext";

/**
 * UsernameInput component
 * - Fetches the username from Android bridge
 * - Validates format, checks uniqueness and registers via WebSocket
 */
export default function UsernameInput() {
    const challengeContext = useChallengeContext();
    const ws = useWebSocket();

    const [username, setLocalUsername] = useState<string>("");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // ref to track which username we’re currently validating/registering
    const pendingUsername = useRef<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const name = await getUsername();
                setLocalUsername(name);
                challengeContext.setUsername(name);
            } catch (err: any) {
                console.error("Error fetching username:", err);
                setError("Impossible de récupérer le pseudo");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        const handler = (data: any) => {
            if (!pendingUsername.current) return;

            if (data.kind === "check_username_response") {
                if (data.available) {
                    ws.send({
                        kind: "register_username_challenge",
                        usernameToRegister: pendingUsername.current,
                        removeOld: !!username, // si on a un ancien pseudo
                        oldUsername: username || undefined, // à supprimer si présent
                    });
                } else {
                    setSaving(false);
                    setError("Le pseudo est déjà pris");
                    pendingUsername.current = null;
                }
            } else if (data.kind === "register_username_response") {
                setSaving(false);
                if (data.success) {
                    (async () => {
                        await setUsername(pendingUsername.current!);
                        setLocalUsername(pendingUsername.current!);
                        challengeContext.setUsername(pendingUsername.current!);
                        setEditMode(false);
                        pendingUsername.current = null;
                    })();
                } else {
                    setError("Impossible de sauvegarder le pseudo");
                    pendingUsername.current = null;
                }
            }
        };

        ws.onMessage(handler);
        return () => {
            ws.offMessage(handler);
        };
    }, [ws, challengeContext, username]);

    const handleSave = () => {
        setError(null);
        const trimmed = inputValue.trim();
        if (!/^[A-Za-z0-9_]{1,20}$/.test(trimmed)) {
            setError("Le pseudo doit contenir entre 1 et 20 caractères alphanumériques ou underscores");
            return;
        }

        setSaving(true);
        pendingUsername.current = trimmed;
        ws.send({kind: "check_username_challenge", usernameToCheck: trimmed});
    };

    const startEditing = () => {
        setInputValue(username);
        setError(null);
        setEditMode(true);
    };

    return (
        <div className="card-container flex flex-col justify-center items-center text-white gap-3">
            <h3 className="blue-title-effect w-full text-center">Pseudo</h3>
            {loading ? (
                <p>Chargement...</p>
            ) : editMode ? (
                <div className="flex flex-col gap-2 w-full">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 focus:outline-none"
                        placeholder="Entrez votre pseudo"
                        disabled={saving}
                    />
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditMode(false)} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-md" disabled={saving}>
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            className={`px-3 py-1 ${saving || inputValue.trim() === "" ? "bg-gray-900" : "bg-green-600 hover:bg-green-500"} rounded-md`}
                            disabled={saving || inputValue.trim() === ""}>
                            {saving ? "Sauvegarde..." : "Sauvegarder"}
                        </button>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            ) : (
                <div className="w-full flex justify-between">
                    <span className="text-lg">{username || "Pas défini"}</span>
                    <button onClick={startEditing} className="px-3 py-1 bg-blueSecondary hover:bg-blue-900 rounded-md">
                        Modifier
                    </button>
                </div>
            )}
        </div>
    );
}
