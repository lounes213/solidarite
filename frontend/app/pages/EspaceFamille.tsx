import React, { useEffect, useState } from "react";

// Remplace cette URL par celle de ton backend si besoin
const API_URL = "http://localhost:3000/api/offres";

export default function EspaceFamille() {
  const [offres, setOffres] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    type: "invitation",
    prix_min: "",
    prix_max: "",
    prix_fixe: "",
    prix_defini_par_app: false,
    description: "",
    localisation: ""
  });
  const [editId, setEditId] = useState(null);

  // Récupérer les offres de la famille (à adapter avec l'id réel de l'hôte connecté)
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setOffres(data.offres || []));
  }, []);

  // Ajouter ou modifier une offre
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/${editId}` : API_URL;
    const body = {
      ...form,
      idHote: "11111111-1111-1111-1111-111111111111" // à remplacer par l'id réel de la famille connectée
    };
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setForm({ titre: "", type: "invitation", prix_min: "", prix_max: "", prix_fixe: "", prix_defini_par_app: false, description: "", localisation: "" });
    setEditId(null);
    // Refresh
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setOffres(data.offres || []));
  };

  // Supprimer une offre
  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setOffres(offres.filter((o: any) => o.id !== id));
  };

  // Pré-remplir le formulaire pour édition
  const handleEdit = (offre: any) => {
    setForm({
      titre: offre.titre,
      type: offre.type,
      prix_min: offre.prix_min || "",
      prix_max: offre.prix_max || "",
      prix_fixe: offre.prix_fixe || "",
      prix_defini_par_app: offre.prix_defini_par_app || false,
      description: offre.description,
      localisation: offre.localisation
    });
    setEditId(offre.id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Espace Famille</h1>
      <form className="flex flex-col gap-2 w-96 mb-8" onSubmit={handleSubmit}>
        <input type="text" placeholder="Titre" className="border rounded px-3 py-2" value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} required />
        <select className="border rounded px-3 py-2" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          <option value="invitation">Invitation</option>
          <option value="panier">Panier</option>
        </select>
        <input type="text" placeholder="Prix min" className="border rounded px-3 py-2" value={form.prix_min} onChange={e => setForm(f => ({ ...f, prix_min: e.target.value }))} />
        <input type="text" placeholder="Prix max" className="border rounded px-3 py-2" value={form.prix_max} onChange={e => setForm(f => ({ ...f, prix_max: e.target.value }))} />
        <input type="text" placeholder="Prix fixe" className="border rounded px-3 py-2" value={form.prix_fixe} onChange={e => setForm(f => ({ ...f, prix_fixe: e.target.value }))} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.prix_defini_par_app} onChange={e => setForm(f => ({ ...f, prix_defini_par_app: e.target.checked }))} /> Prix défini par l'app
        </label>
        <input type="text" placeholder="Description" className="border rounded px-3 py-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
        <input type="text" placeholder="Localisation" className="border rounded px-3 py-2" value={form.localisation} onChange={e => setForm(f => ({ ...f, localisation: e.target.value }))} required />
        <button type="submit" className="bg-blue-600 text-white rounded px-3 py-2">{editId ? "Modifier" : "Ajouter"} l'offre</button>
      </form>
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">Mes offres</h2>
        <ul>
          {offres.map((offre: any) => (
            <li key={offre.id} className="border rounded p-4 mb-2 flex justify-between items-center">
              <div>
                <div className="font-bold">{offre.titre} ({offre.type})</div>
                <div>{offre.description}</div>
                <div className="text-sm text-gray-500">{offre.localisation}</div>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600" onClick={() => handleEdit(offre)}>Éditer</button>
                <button className="text-red-600" onClick={() => handleDelete(offre.id)}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
