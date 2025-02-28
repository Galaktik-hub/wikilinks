import React, { useState, useEffect } from 'react';

interface ArticleDisplayProps {
    title: string,
    className?: string;
}

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({ title, className }) => {
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const url = `https://fr.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&format=json&origin=*`;
                const response = await fetch(url);
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    if (data.error) {
                        console.log(data.error.info || 'Erreur inconnue');
                    }
                    setContent(data.parse.text['*']);
                } catch (jsonError) {
                    console.error("Erreur de parsing JSON:", jsonError, "Réponse:", text);
                    console.log("La réponse reçue n'est pas au format JSON attendu.");
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Une erreur inconnue s'est produite.");
                }
            }
        };
        fetchArticle();
    }, [title]);

    if (error) return <p>Erreur : {error}</p>;
    if (!content) return <p>Chargement...</p>;

    return (
        <div
            dangerouslySetInnerHTML={{ __html: content }}
            className={className}
        />
    )
};

export default ArticleDisplay;