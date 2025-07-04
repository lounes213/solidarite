import React, { useState } from "react";

export default function Register() {
  const [type, setType] = useState("etudiant");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>
      <form className="flex flex-col gap-4 w-80">
        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="etudiant"
              checked={type === "etudiant"}
              onChange={() => setType("etudiant")}
            />
            Étudiant
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="famille"
              checked={type === "famille"}
              onChange={() => setType("famille")}
            />
            Famille
          </label>
        </div>
        <input
          type="text"
          placeholder="Nom"
          className="border rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-3 py-2"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}
