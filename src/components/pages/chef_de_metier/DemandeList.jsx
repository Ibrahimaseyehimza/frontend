import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiBriefcase,
  FiCheckCircle,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import { BsBuilding, BsSearch } from "react-icons/bs";
import api from "../../../api/axios";

const DemandeList = () => {
  const [stats, setStats] = useState({});
  const [demandes, setDemandes] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedEntreprise, setSelectedEntreprise] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ récupération réelle des données depuis ton backend Laravel
  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const [statsRes, demandesRes, entreprisesRes] = await Promise.all([
  //       // api.get("/chef-metier/statistiques"),
  //       api.get("/chef-metier/demandes"),
  //       api.get("/chef-metier/entreprises-disponibles"),
  //     ]);

  //     // setStats(statsRes.data.data || {});
  //     setDemandes(demandesRes.data.data || []);
  //     setEntreprises(entreprisesRes.data.data || []);
  //   } catch (error) {
  //     console.error("Erreur:", error);
  //     alert("❌ Erreur lors du chargement des données");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


const fetchData = async () => {
  try {
    setLoading(true);
    
    // Charger les demandes
    console.log("🔄 Chargement des demandes...");
    const demandesRes = await api.get("/chef-metier/demandes");
    console.log("✅ Demandes reçues:", demandesRes.data);
    
    // Charger les entreprises
    console.log("🔄 Chargement des entreprises...");
    const entreprisesRes = await api.get("/chef-metier/entreprises-disponibles");
    console.log("✅ Entreprises reçues:", entreprisesRes.data);

    // Vérifier que les données existent avant d'accéder à .data
    if (demandesRes && demandesRes.data) {
      setDemandes(demandesRes.data.data || []);
      console.log("📊 Demandes dans state:", demandesRes.data.data);
    }
    
    if (entreprisesRes && entreprisesRes.data) {
      setEntreprises(entreprisesRes.data.data || []);
      console.log("📊 Entreprises dans state:", entreprisesRes.data.data);
    }

  } catch (error) {
    console.error("❌ Erreur complète:", error);
    console.error("❌ Message:", error.message);
    console.error("❌ Response:", error.response?.data);
    alert(`❌ Erreur: ${error.response?.data?.message || error.message}`);
  } finally {
    setLoading(false);
  }
};

  const openModal = (demande, type) => {
    setSelectedDemande(demande);
    setActionType(type);
    setSelectedEntreprise(
      type === "accepter" ? demande.entreprise?.id || "" : ""
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDemande(null);
    setActionType(null);
    setSelectedEntreprise("");
  };

  // ✅ actions reliées à ton backend
  const handleAction = async () => {
    if (!selectedDemande) return;

    try {
      if (actionType === "accepter") {
        const entrepriseId = selectedEntreprise || selectedDemande.entreprise?.id;
        if (!entrepriseId) {
          alert("⚠️ Veuillez sélectionner une entreprise");
          return;
        }

        await api.post(`/chef-metier/demandes/${selectedDemande.id}/accepter`, {
          entreprise_id: parseInt(entrepriseId),
        });
        alert("✅ Étudiant accepté et affecté avec succès !");
      } else if (actionType === "refuser") {
        await api.post(`/chef-metier/demandes/${selectedDemande.id}/refuser`);
        alert("❌ Demande refusée");
      } else if (actionType === "reorienter") {
        if (!selectedEntreprise) {
          alert("⚠️ Veuillez sélectionner une entreprise");
          return;
        }

        await api.post(`/chef-metier/demandes/${selectedDemande.id}/reorienter`, {
          nouvelle_entreprise_id: parseInt(selectedEntreprise),
        });
        alert("🔄 Étudiant réorienté avec succès !");
      }

      closeModal();
      fetchData();
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur: " + (error.response?.data?.message || error.message));
    }
  };

  const filteredDemandes = demandes.filter((d) => {
    const matchSearch =
      d.etudiant?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.etudiant?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.campagne?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.entreprise?.nom?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatut = filterStatut === "all" || d.statut === filterStatut;

    return matchSearch && matchStatut;
  });

  const getStatutBadge = (statut) => {
    const styles = {
      en_attente: "bg-yellow-100 text-yellow-700",
      acceptee: "bg-green-100 text-green-700",
      refusee: "bg-red-100 text-red-700",
      reorientee: "bg-blue-100 text-blue-700",
    };
    const labels = {
      en_attente: "⏳ En attente",
      acceptee: "✅ Acceptée",
      refusee: "❌ Refusée",
      reorientee: "🔄 Réorientée",
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          styles[statut] || ""
        }`}
      >
        {labels[statut] || statut}
      </span>
    );
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
          📊 Dashboard Chef de Métier
        </h1>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
            <FiUsers className="mx-auto text-blue-500 mb-2" size={32} />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.totalApprenants || 0}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Apprenants</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
            <FiBriefcase className="mx-auto text-green-500 mb-2" size={32} />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.totalDemandes || 0}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Demandes reçues</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
            <FiCheckCircle className="mx-auto text-purple-500 mb-2" size={32} />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.stagesValides || 0}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Stages validés</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
            <FiAlertCircle className="mx-auto text-red-500 mb-2" size={32} />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.entreprisesSaturees || 0}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Entreprises pleines</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white p-4 shadow-md rounded-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <BsSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher un apprenant, campagne ou entreprise..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="acceptee">Acceptée</option>
              <option value="refusee">Refusée</option>
              <option value="reorientee">Réorientée</option>
            </select>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Liste des demandes de stage ({filteredDemandes.length})
          </h2>

          {filteredDemandes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">Aucune demande trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDemandes.map((demande) => (
                <div
                  key={demande.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Infos étudiant */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-lg">
                            {demande.etudiant?.nom?.charAt(0)}
                            {demande.etudiant?.prenom?.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {demande.etudiant?.nom} {demande.etudiant?.prenom}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {demande.etudiant?.email}
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">
                              <strong>Campagne:</strong>{" "}
                              {demande.campagne?.titre}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <BsBuilding size={14} />
                              <strong>Entreprise souhaitée:</strong>{" "}
                              {demande.entreprise?.nom}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Adresse:</strong> {demande.adresse_1}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Statut et Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {getStatutBadge(demande.statut)}

                      {demande.statut === "en_attente" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(demande, "accepter")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <FiCheck size={16} />
                            Accepter
                          </button>
                          <button
                            onClick={() => openModal(demande, "reorienter")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <FiRefreshCw size={16} />
                            Réorienter
                          </button>
                          <button
                            onClick={() => openModal(demande, "refuser")}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <FiX size={16} />
                            Refuser
                          </button>
                        </div>
                      )}

                      {demande.statut === "acceptee" && (
                        <button
                          onClick={() => openModal(demande, "reorienter")}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                          <FiRefreshCw size={16} />
                          Réorienter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedDemande && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {actionType === "accepter" && "✅ Accepter la demande"}
                {actionType === "refuser" && "❌ Refuser la demande"}
                {actionType === "reorienter" && "🔄 Réorienter l'étudiant"}
              </h3>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Étudiant:</strong>{" "}
                  {selectedDemande.etudiant?.nom}{" "}
                  {selectedDemande.etudiant?.prenom}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Entreprise actuelle:</strong>{" "}
                  {selectedDemande.entreprise?.nom}
                </p>
              </div>

              {(actionType === "accepter" || actionType === "reorienter") && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {actionType === "accepter"
                      ? "Confirmer l'entreprise"
                      : "Nouvelle entreprise"}
                  </label>
                  <select
                    value={selectedEntreprise}
                    onChange={(e) => setSelectedEntreprise(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Sélectionner --</option>
                    {entreprises
                      .filter((e) => e.places_restantes > 0)
                      .map((ent) => (
                        <option key={ent.id} value={ent.id}>
                          {ent.nom} ({ent.places_restantes} places restantes)
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Seules les entreprises avec des places disponibles sont
                    affichées
                  </p>
                </div>
              )}

              {actionType === "refuser" && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="text-sm text-red-700">
                    ⚠️ Êtes-vous sûr de vouloir refuser cette demande ?
                    Cette action est irréversible.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAction}
                  className={`flex-1 px-4 py-3 rounded-lg text-white font-medium transition-colors ${
                    actionType === "accepter"
                      ? "bg-green-600 hover:bg-green-700"
                      : actionType === "refuser"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandeList;
