import { useState } from "react";
import Button from "../../shared/ui/components/Button";
import { createPosts } from "./services/PostsService";

interface Post {
    title: string;
    caption: string;
    hashtags: string[];
    imageDescription: string;
    callToActionProperties: string;
}

export default function PostCreator() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async() => {
        setIsLoading(true);
        try {
            const response = await createPosts();
            console.log(response);
            setPosts(response.posts);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-start p-2">
                <Button text={isLoading ? "Cargando..." : "Crear publicaciones del mes"} onClick={handleClick} disabled={isLoading} />
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                </div>
            ) : posts.length > 0 && <div className="grid grid-cols-7 gap-4 mt-8">
                {/* Calendar header */}
                <div className="font-semibold text-center">Dom</div>
                <div className="font-semibold text-center">Lun</div>
                <div className="font-semibold text-center">Mar</div>
                <div className="font-semibold text-center">Mié</div>
                <div className="font-semibold text-center">Jue</div>
                <div className="font-semibold text-center">Vie</div>
                <div className="font-semibold text-center">Sáb</div>

                {/* Calendar days */}
                {(() => {
                    const date = new Date();
                    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    const days = [];

                    // Add empty cells for days before the first day of the month
                    for (let i = 0; i < firstDay.getDay(); i++) {
                        days.push(
                            <div key={`empty-${i}`} className="p-4 bg-white rounded-lg"></div>
                        );
                    }

                    // Add cells for each day of the month
                    for (let i = 1; i <= lastDay.getDate(); i++) {
                        days.push(
                            <div key={i} className="p-4 bg-white rounded-lg text-left hover:bg-gray-100 cursor-pointer min-h-[150px]">
                                <div>{i}</div>
                                {(() => {
                                    const group = Math.floor((i - 1) / 7);
                                    const posInGroup = (i - 1) % 7;
                                    
                                    if (group < 3 && posInGroup < 5 && posInGroup % 2 === 0) {
                                        const postIndex = group * 3 + Math.floor(posInGroup / 2);
                                        if (posts[postIndex]) {
                                            return (
                                                <button 
                                                    onClick={() => {
                                                        const post = posts[postIndex];
                                                        const modal = document.getElementById('postModal');
                                                        const title = document.getElementById('modalTitle');
                                                        const caption = document.getElementById('modalCaption');
                                                        const hashtags = document.getElementById('modalHashtags');
                                                        const imageDesc = document.getElementById('modalImageDesc');
                                                        const cta = document.getElementById('modalCTA');
                                                        
                                                        if (title) title.textContent = post.title;
                                                        if (caption) caption.textContent = post.caption;
                                                        if (hashtags) hashtags.innerHTML = post.hashtags.map(tag => `#${tag}`).join(' ');
                                                        if (imageDesc) imageDesc.textContent = post.imageDescription;
                                                        if (cta) cta.textContent = post.callToActionProperties;
                                                        if (modal) modal.classList.remove('hidden');
                                                    }}
                                                    className="w-full font-bold mt-2 p-2 bg-purple-100 text-purple-600 rounded-md text-sm font-medium hover:bg-purple-200"
                                                >
                                                    Publicación
                                                </button>
                                            );
                                        }
                                    }
                                    return null;
                                })()}
                            </div>
                        );
                    }

                    return days;
                })()}
            </div>}

            <div id="postModal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
                    <div className="space-y-4">
                        <h3 id="modalTitle" className="text-xl font-semibold text-purple-600"></h3>
                        <p id="modalCaption" className="text-gray-600"></p>
                        <div id="modalHashtags" className="text-blue-500"></div>
                        <p id="modalImageDesc" className="text-gray-500 italic"></p>
                        <p id="modalCTA" className="text-green-600 font-medium"></p>
                        <button 
                            onClick={() => {
                                const modal = document.getElementById('postModal');
                                if (modal) modal.classList.add('hidden');
                            }}
                            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}