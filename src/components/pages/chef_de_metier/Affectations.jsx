import React, { useEffect, useState } from "react";
import { FiDownload, FiSend, FiUsers, FiBriefcase } from "react-icons/fi";
import api from "../../../api/axios";

const Affectations = () => {
  const [affectations, setAffectations] = useState([]);
  const [entreprisesStats, setEntreprisesStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchAffectations();
  }, []);

  const fetchAffectations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/chef-metier/affectations");
      setAffectations(res.data.data || []);
      setEntreprisesStats(res.data.entreprises || []);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement des affectations");
    } finally {
      setLoading(false);
    }
  };

  const handleSendToRH = async () => {
    if (!window.confirm("Souhaitez-vous vraiment envoyer la liste au service RH ?")) return;
    try {
      setSending(true);
      await api.post("/chef-metier/affectations/envoyer-rh");
      alert("✅ Liste envoyée au service RH avec succès !");
    } catch (error) {
      alert("❌ Erreur lors de l’envoi : " + (error.response?.data?.message || error.message));
    } finally {
      setSending(false);
    }
  };

  const handleDownload = async (type) => {
    try {
      const endpoint = `/chef-metier/affectations/export?format=${type}`;
      const res = await api.get(endpoint, { responseType: "blob" });

      const blob = new Blob([res.data], {
        type: type === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport_affectations.${type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors du téléchargement du rapport");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          👩‍💼 Liste des apprenants affectés
        </h1>

        {/* Statistiques entreprises */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {entreprisesStats.map((e, i) => (
            <div key={i} className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <FiBriefcase className="mx-auto text-blue-500 mb-2" size={32} />
              <h3 className="text-xl font-semibold text-gray-800">{e.nom}</h3>
              <p className="text-gray-500 text-sm mt-1">{e.total_apprenants} apprenant(s)</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-700">📋 Liste complète</h2>
          <div className="flex gap-3">
            <button
              onClick={() => handleDownload("pdf")}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <FiDownload /> PDF
            </button>
            <button
              onClick={() => handleDownload("xlsx")}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <FiDownload /> Excel
            </button>
            <button
              onClick={handleSendToRH}
              disabled={sending}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-70"
            >
              <FiSend /> {sending ? "Envoi..." : "Envoyer au RH"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">#</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Nom complet</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Téléphone</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Entreprise</th>
              </tr>
            </thead>
            <tbody>
              {affectations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    Aucun apprenant affecté
                  </td>
                </tr>
              ) : (
                affectations.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">{idx + 1}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">
                      {item.etudiant?.prenom} {item.etudiant?.nom}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.etudiant?.telephone}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.etudiant?.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.entreprise?.nom}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Affectations;
