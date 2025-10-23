import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiClock, FiUser, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axios";

export default function TachesMaitre() {
  const { user } = useAuth();
  const [taches, setTaches] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTache, setEditingTache] = useState(null);
  
  const [form, setForm] = useState({
    etudiant_id: "",
    titre: "",
    description: "",
    date_echeance: "",
    priorite: "moyenne",
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Charger les stagiaires et les tâches
  const fetchData = async () => {
    try {
      setLoadingData(true);
      setError(null);
      console.log("🔄 Chargement des données...");
      
      // Récupérer les stagiaires affectés au maître de stage
      try {
        const resStagiaires = await api.get("/maitre-stage/etudiants-affectes");
        const etudiantsData = resStagiaires.data.etudiants || resStagiaires.data.data || [];
        
        setStagiaires(etudiantsData);
        console.log(`✅ ${etudiantsData.length} stagiaire(s) chargé(s)`);
      } catch (err) {
        console.error("⚠️ Erreur chargement stagiaires:", err.response?.status);
        setStagiaires([]);
      }

      // Récupérer les tâches
      try {
        const resTaches = await api.get("/maitre-stage/taches");
        const tachesData = resTaches.data.taches || resTaches.data.data || [];
        setTaches(tachesData);
        console.log(`✅ ${tachesData.length} tâche(s) chargée(s)`);
      } catch (err) {
        console.error("❌ Erreur chargement tâches:", {
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url
        });
        
        if (err.response?.status === 404) {
          setError({
            type: 'endpoint_missing',
            message: "L'endpoint /maitre-stage/taches n'existe pas",
            suggestion: "Créez le endpoint dans Laravel"
          });
        } else if (err.response?.status === 500) {
          setError({
            type: 'server_error',
            message: "Erreur serveur (500)",
            suggestion: "Vérifiez les logs Laravel: php artisan tail",
            details: err.response?.data?.message
          });
        }
        
        setTaches([]);
      }
      
    } catch (err) {
      console.error("❌ Erreur générale:", err);
      setError({
        type: 'general',
        message: "Erreur lors du chargement",
        suggestion: "Vérifiez votre connexion"
      });
    } finally {
      setLoadingData(false);
    }
  };

  // Afficher un message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  // Créer ou modifier une tâche
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("📤 Envoi de la tâche:", form);
      
      let res;
      if (editingTache) {
        // Modification
        res = await api.put(`/maitre-stage/taches/${editingTache.id}`, form);
        showMessage("success", "✅ Tâche modifiée avec succès !");
      } else {
        // Création
        res = await api.post("/maitre-stage/taches", form);
        showMessage("success", "✅ Tâche créée avec succès !");
      }

      // Recharger les tâches
      await fetchData();
      
      // Réinitialiser le formulaire
      resetForm();
      
    } catch (err) {
      console.error("❌ Erreur:", err);
      showMessage("error", err.response?.data?.message || "❌ Erreur lors de l'enregistrement de la tâche");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une tâche
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;

    try {
      await api.delete(`/maitre-stage/taches/${id}`);
      setTaches(taches.filter(t => t.id !== id));
      showMessage("success", "✅ Tâche supprimée avec succès");
    } catch (err) {
      console.error("❌ Erreur suppression:", err);
      showMessage("error", "❌ Erreur lors de la suppression");
    }
  };

  // Éditer une tâche
  const handleEdit = (tache) => {
    setEditingTache(tache);
    setForm({
      etudiant_id: tache.etudiant_id,
      titre: tache.titre,
      description: tache.description || "",
      date_echeance: tache.date_echeance,
      priorite: tache.priorite || "moyenne",
    });
    setShowForm(true);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setForm({
      etudiant_id: "",
      titre: "",
      description: "",
      date_echeance: "",
      priorite: "moyenne",
    });
    setEditingTache(null);
    setShowForm(false);
  };

  // Obtenir la couleur selon la priorité
  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case "haute": return "bg-red-100 text-red-700";
      case "moyenne": return "bg-yellow-100 text-yellow-700";
      case "basse": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Obtenir le badge de statut
  const getStatutBadge = (statut) => {
    switch (statut) {
      case "terminee":
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <FiCheckCircle /> Terminée
        </span>;
      case "en_cours":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
          En cours
        </span>;
      default:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <FiAlertCircle /> En attente
        </span>;
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement des tâches...</p>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur si l'endpoint n'existe pas
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-800 mb-3">
              {error.message}
            </h2>
            <p className="text-red-600 mb-4">{error.suggestion}</p>
            
            {error.details && (
              <div className="bg-white rounded-lg p-4 mb-4 text-left">
                <p className="text-sm text-gray-700 font-mono">{error.details}</p>
              </div>
            )}
            
            {error.type === 'endpoint_missing' && (
              <div className="bg-white rounded-lg p-6 text-left mb-4">
                <h3 className="font-bold text-gray-800 mb-3">📋 Action requise:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Créez le controller: <code className="bg-gray-100 px-2 py-1 rounded">php artisan make:controller MaitreStageController</code></li>
                  <li>Ajoutez les méthodes nécessaires (voir ci-dessous)</li>
                  <li>Enregistrez les routes dans <code className="bg-gray-100 px-2 py-1 rounded">routes/api.php</code></li>
                </ol>
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={fetchData}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                🔄 Réessayer
              </button>
              <button
                onClick={() => window.open('https://laravel.com/docs', '_blank')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                📚 Documentation Laravel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">📝 Gestion des Tâches</h1>
              <p className="text-gray-600 mt-2">
                Assignez des tâches à vos stagiaires et suivez leur progression
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
            >
              <FiPlus size={20} />
              {showForm ? "Annuler" : "Nouvelle tâche"}
            </button>
          </div>
        </div>

        {/* Message de notification */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Avertissement si pas de stagiaires */}
        {stagiaires.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-yellow-800 font-medium">
              ⚠️ Aucun stagiaire affecté. Vous devez d'abord affecter des stagiaires pour créer des tâches.
            </p>
          </div>
        )}

        {/* Formulaire de création/modification */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              {editingTache ? "✏️ Modifier la tâche" : "➕ Créer une nouvelle tâche"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Sélection du stagiaire */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FiUser className="inline mr-2" />
                    Stagiaire *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.etudiant_id}
                    onChange={(e) => setForm({ ...form, etudiant_id: e.target.value })}
                    required
                    disabled={stagiaires.length === 0}
                  >
                    <option value="">-- Sélectionnez un stagiaire --</option>
                    {stagiaires.map((etudiant) => (
                      <option key={etudiant.id} value={etudiant.id}>
                        {etudiant.prenom} {etudiant.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priorité */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Priorité *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.priorite}
                    onChange={(e) => setForm({ ...form, priorite: e.target.value })}
                    required
                  >
                    <option value="basse">🟢 Basse</option>
                    <option value="moyenne">🟡 Moyenne</option>
                    <option value="haute">🔴 Haute</option>
                  </select>
                </div>
              </div>

              {/* Titre */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Titre de la tâche *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Développer le module de connexion"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Décrivez les détails de la tâche..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Date d'échéance */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FiClock className="inline mr-2" />
                  Date d'échéance *
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.date_echeance}
                  onChange={(e) => setForm({ ...form, date_echeance: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || stagiaires.length === 0}
                  className="flex-1 bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enregistrement..." : editingTache ? "💾 Enregistrer les modifications" : "➕ Créer la tâche"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Total des tâches</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{taches.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium">En attente</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {taches.filter(t => t.statut === "en_attente").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Terminées</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {taches.filter(t => t.statut === "terminee").length}
            </p>
          </div>
        </div>

        {/* Liste des tâches */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800">📋 Liste des tâches assignées</h3>

          {taches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 font-medium">Aucune tâche pour le moment</p>
              <p className="text-gray-400 text-sm mt-2">
                Cliquez sur "Nouvelle tâche" pour commencer
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {taches.map((tache) => (
                <div
                  key={tache.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                          {tache.etudiant?.prenom?.charAt(0)}
                          {tache.etudiant?.name?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-lg">{tache.titre}</h4>
                          <p className="text-gray-600 text-sm mt-1">
                            <FiUser className="inline mr-1" />
                            {tache.etudiant?.prenom} {tache.etudiant?.name}
                          </p>
                        </div>
                      </div>

                      {tache.description && (
                        <p className="text-gray-600 text-sm mt-2 mb-3 pl-15">
                          {tache.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 items-center pl-15">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPrioriteColor(tache.priorite)}`}>
                          {tache.priorite === "haute" && "🔴"} 
                          {tache.priorite === "moyenne" && "🟡"} 
                          {tache.priorite === "basse" && "🟢"} 
                          {tache.priorite?.charAt(0).toUpperCase() + tache.priorite?.slice(1)}
                        </span>
                        {getStatutBadge(tache.statut)}
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
                          <FiClock size={14} />
                          {new Date(tache.date_echeance).toLocaleDateString('fr-FR', { 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 md:flex-col">
                      <button
                        onClick={() => handleEdit(tache)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                        title="Modifier"
                      >
                        <FiEdit2 size={16} />
                        <span className="hidden md:inline">Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDelete(tache.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                        title="Supprimer"
                      >
                        <FiTrash2 size={16} />
                        <span className="hidden md:inline">Supprimer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}