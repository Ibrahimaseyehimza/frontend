import React, { useEffect, useState } from "react";
import { FiDownload, FiSend, FiUsers, FiBriefcase, FiAlertCircle, FiFilter } from "react-icons/fi";
import { useAuth } from "../../../AuthContext";
import api from "../../../api/axios"

const Affectations = () => {
  const { user } = useAuth();
  const [affectations, setAffectations] = useState([]);
  const [entreprisesStats, setEntreprisesStats] = useState([]);
  const [metierInfo, setMetierInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedEntreprise, setSelectedEntreprise] = useState("all");

  useEffect(() => {
    fetchAffectations();
  }, []);

  const fetchAffectations = async () => {
    try {
      setLoading(true);
      console.log("🔄 Chargement des affectations pour:", user?.name, "- Métier:", user?.metier_id);
      
      const res = await api.get("/chef-metier/affectations");
      
      console.log("✅ Réponse API:", res.data);
      
      const data = res.data.data || res.data.affectations || [];
      const metier = res.data.metier || null;
      
      // Filtrer les entreprises uniquement pour ce métier
      const entreprisesUniques = {};
      data.forEach(affectation => {
        const entrepriseId = affectation.entreprise?.id;
        const entrepriseNom = affectation.entreprise?.nom;
        
        if (entrepriseId && entrepriseNom) {
          if (!entreprisesUniques[entrepriseId]) {
            entreprisesUniques[entrepriseId] = {
              id: entrepriseId,
              nom: entrepriseNom,
              total_apprenants: 0
            };
          }
          entreprisesUniques[entrepriseId].total_apprenants++;
        }
      });
      
      const entreprises = Object.values(entreprisesUniques);
      
      setAffectations(data);
      setEntreprisesStats(entreprises);
      setMetierInfo(metier);
      
      console.log(`✅ ${data.length} affectation(s) chargée(s) pour le métier ${metier?.nom || 'inconnu'}`);
      console.log(`✅ ${entreprises.length} entreprise(s) concernée(s) par ce métier`);
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert("Erreur lors du chargement des affectations: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSendToRH = async () => {
    if (affectations.length === 0) {
      alert("⚠️ Aucune affectation à envoyer");
      return;
    }

    if (!window.confirm(`Souhaitez-vous vraiment envoyer ${affectations.length} affectation(s) au service RH ?`)) {
      return;
    }

    try {
      setSending(true);
      const res = await api.post("/chef-metier/affectations/envoyer-rh");
      alert(`✅ ${affectations.length} affectation(s) envoyée(s) au service RH avec succès !`);
      
      fetchAffectations();
    } catch (error) {
      console.error("❌ Erreur envoi:", error);
      alert("❌ Erreur lors de l'envoi : " + (error.response?.data?.message || error.message));
    } finally {
      setSending(false);
    }
  };

  const handleDownload = async (type) => {
    try {
      console.log(`📥 Téléchargement du rapport ${type.toUpperCase()}...`);
      
      let endpoint = `/chef-metier/affectations/export?format=${type}`;
      
      // Ajouter le filtre entreprise si sélectionné
      if (selectedEntreprise !== "all") {
        endpoint += `&entreprise_id=${selectedEntreprise}`;
      }
      
      const res = await api.get(endpoint, { responseType: "blob" });

      const blob = new Blob([res.data], {
        type: type === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const entrepriseNom = selectedEntreprise !== "all" 
        ? `_${entreprisesStats.find(e => e.id === parseInt(selectedEntreprise))?.nom || 'entreprise'}`
        : '';
      
      a.download = `affectations_${metierInfo?.nom || 'metier'}${entrepriseNom}_${new Date().toISOString().split('T')[0]}.${type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      console.log("✅ Téléchargement réussi");
    } catch (error) {
      console.error("❌ Erreur téléchargement:", error);
      alert("❌ Erreur lors du téléchargement du rapport: " + (error.response?.data?.message || error.message));
    }
  };

  // Filtrer les affectations par entreprise
  const filteredAffectations = selectedEntreprise === "all"
    ? affectations
    : affectations.filter(a => a.entreprise?.id === parseInt(selectedEntreprise));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement des affectations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec info métier */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                👩‍💼 Affectations - Métier {metierInfo?.nom || ''}
              </h1>
              <p className="text-gray-600 mt-1">
                Chef de métier: <span className="font-semibold">{user?.name}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{affectations.length}</div>
              <p className="text-sm text-gray-500">Apprenant(s) affecté(s)</p>
            </div>
          </div>
        </div>

        {/* Alerte si aucune affectation */}
        {affectations.length === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <FiAlertCircle className="text-yellow-600 mr-3" size={24} />
              <div>
                <p className="text-yellow-800 font-semibold">Aucune affectation pour le moment</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Les apprenants affectés à votre métier apparaîtront ici une fois validés.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques entreprises (uniquement celles du métier) */}
        {entreprisesStats.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FiBriefcase className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                Entreprises partenaires pour le métier {metierInfo?.nom}
              </h2>
              <span className="bg-blue-100 text-dégradé px-3 py-1 rounded-full text-sm font-semibold">
                {entreprisesStats.length} entreprise(s)
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {entreprisesStats.map((e) => (
                <div 
                  key={e.id} 
                  className={`bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-all border-l-4 cursor-pointer ${
                    selectedEntreprise === e.id.toString() 
                      ? 'border-dégradé ring-2 ring-blue-300' 
                      : 'border-dégradé'
                  }`}
                  onClick={() => setSelectedEntreprise(e.id.toString())}
                >
                  <FiBriefcase className="mx-auto text-blue-500 mb-3" size={32} />
                  <h3 className="text-xl font-semibold text-gray-800">{e.nom}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    <span className="font-bold text-blue-600 text-2xl">{e.total_apprenants}</span> apprenant(s)
                  </p>
                  {selectedEntreprise === e.id.toString() && (
                    <div className="mt-2">
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                        Sélectionnée
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtre entreprise */}
        {entreprisesStats.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-600" size={20} />
                <label className="text-sm font-semibold text-gray-700">Filtrer par entreprise:</label>
              </div>
              
              <select
                value={selectedEntreprise}
                onChange={(e) => setSelectedEntreprise(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">Toutes les entreprises ({affectations.length})</option>
                {entreprisesStats.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nom} ({e.total_apprenants} apprenant{e.total_apprenants > 1 ? 's' : ''})
                  </option>
                ))}
              </select>
              
              {selectedEntreprise !== "all" && (
                <button
                  onClick={() => setSelectedEntreprise("all")}
                  className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  Réinitialiser le filtre
                </button>
              )}
              
              <div className="ml-auto text-sm text-gray-600">
                Affichage: <span className="font-bold text-blue-600">{filteredAffectations.length}</span> / {affectations.length} apprenant(s)
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-between items-center bg-white p-5 rounded-xl shadow-md mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">📋 Liste des affectations</h2>
            <p className="text-sm text-gray-500 mt-1">
              Métier: <span className="font-semibold text-gray-700">{metierInfo?.nom || 'N/A'}</span>
              {selectedEntreprise !== "all" && (
                <span className="ml-2 text-blue-600">
                  • Filtré: {entreprisesStats.find(e => e.id === parseInt(selectedEntreprise))?.nom}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => handleDownload("pdf")}
              disabled={filteredAffectations.length === 0}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Télécharger en PDF"
            >
              <FiDownload /> PDF
            </button>
            
            <button
              onClick={() => handleDownload("xlsx")}
              disabled={filteredAffectations.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Télécharger en Excel"
            >
              <FiDownload /> Excel
            </button>
            
            <button
              onClick={handleSendToRH}
              disabled={sending || affectations.length === 0}
              className="flex items-center gap-2 bg-dégradé hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Envoyer la liste complète au service RH"
            >
              <FiSend /> {sending ? "Envoi en cours..." : "Envoyer au RH"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-dégradé">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-white">#</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-white">Nom complet</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-white">Téléphone</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-white">Email</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-white">Entreprise</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-white">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAffectations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <FiUsers className="mx-auto text-gray-400 mb-3" size={48} />
                      <p className="text-gray-500 font-medium">
                        {affectations.length === 0 
                          ? "Aucun apprenant affecté pour ce métier"
                          : "Aucun apprenant pour cette entreprise"}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        {affectations.length === 0
                          ? "Les affectations validées apparaîtront ici"
                          : "Sélectionnez une autre entreprise ou réinitialisez le filtre"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAffectations.map((item, idx) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-700 font-medium">{idx + 1}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-dégradé rounded-full flex items-center justify-center text-white font-bold">
                            {item.etudiant?.prenom?.charAt(0)}
                            {item.etudiant?.nom?.charAt(0)}
                          </div>
                          <div>
                            {item.etudiant?.prenom} {item.etudiant?.nom}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {item.etudiant?.telephone || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {item.etudiant?.email}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <FiBriefcase className="text-blue-500" />
                          <span className="font-medium">{item.entreprise?.nom}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          ✓ Affecté
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Résumé en bas */}
        {affectations.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-600">Total des affectations</p>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedEntreprise === "all" ? affectations.length : filteredAffectations.length} apprenant(s)
                  {selectedEntreprise !== "all" && (
                    <span className="text-base text-gray-600 ml-2">/ {affectations.length} total</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Métier concerné</p>
                <p className="text-lg font-semibold text-gray-800">{metierInfo?.nom || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Entreprises partenaires</p>
                <p className="text-lg font-semibold text-gray-800">{entreprisesStats.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Affectations;