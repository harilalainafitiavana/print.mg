import { MessageCircle } from "lucide-react";

export default function Chat() {
    return (
        <div>
            {/* Chat */}
            <button
                className="
                    fixed bottom-6 right-6 
                    bg-blue-500 text-white 
                    w-12 h-12 rounded-full 
                    shadow-xl flex items-center justify-center 
                    hover:bg-green-500 transition-transform transform hover:scale-110
                    z-50
                    "
                onClick={() => alert("Boîte de discussion à créer bientôt !")}
            >
                <MessageCircle className="w-10 10-8" />
            </button>
            {/* Chat */}

        </div>
    )
}