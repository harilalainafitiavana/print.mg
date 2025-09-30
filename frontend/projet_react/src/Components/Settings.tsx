
export default function Settings() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">⚙️ Paramètres</h2>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Préférences */}
                <div className="border p-6 rounded-xl shadow-sm bg-white">
                    <h3 className="text-lg font-semibold mb-4">Préférences</h3>
                    <form className="space-y-4">
                        {/* Thème */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thème</label>
                            <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="light">Clair</option>
                                <option value="dark">Sombre</option>
                            </select>
                        </div>

                        {/* Langue */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                            <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="fr">Français</option>
                                <option value="en">Anglais</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Sauvegarder
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}