import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("etudiant");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, tu pourrais faire un appel API pour vérifier le login et le type
    if (type === "famille") {
      navigate("/espace-famille");
    } else {
      navigate("/espace-etudiant");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <form className="flex flex-col gap-4 w-80" onSubmit={handleSubmit}>
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
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="border rounded px-3 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-3 py-2"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
