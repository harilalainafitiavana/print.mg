import { useState } from "react";

export default function Preferences({ onThemeChange }: { onThemeChange: (theme: string) => void }) {
    const [theme, setTheme] = useState("light");
    const [message, setMessage] = useState("");
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onThemeChange(theme);
      setMessage("✅ Préférences sauvegardées !");
    };
  
    return (
      <div className="border p-6 rounded-xl shadow-sm bg-base-100">
        <h3 className="text-lg font-semibold mb-4">Préférences</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Thème</label>
            <select value={theme} onChange={e => setTheme(e.target.value)} className="select select-bordered w-full">
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
            </select>
          </div>
          <button type="submit" className="btn bg-blue-500 text-white w-full">Sauvegarder</button>
        </form>
        {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
      </div>
    );
  }
  