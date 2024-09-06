import { useEffect } from "react"

function Button(
    { text, onClick } :
    {
        text: string
        onClick: () => void
    }
) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-black hover:bg-gray-800 transition-all text-white font-bold py-2 px-4 rounded"
        >
            {text}
        </button>
    )
}

export default Button