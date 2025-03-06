import React from 'react';
import {TOCItem} from "../../../utils/Game/TOCutils.ts";

interface TOCProps {
    items: TOCItem[];
}

const TOC: React.FC<TOCProps> = ({ items }) => {
    return (
        <div className="toc">
            <h4>Sommaire</h4>
            <ul>
                {items.map((item, index) => (
                    <li key={index} style={{ marginLeft: item.tag === 'H3' ? '1rem' : 0 }}>
                        <a href={`#${item.id}`}>{item.text}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TOC;
