import { useEffect } from "react"

interface ButtonProps {
    text: string;
    onClick: () => void;
    disabled?: boolean;
}

export default function Button({ text, onClick, disabled }: ButtonProps) {
    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
            {text}
        </button>
    );
}