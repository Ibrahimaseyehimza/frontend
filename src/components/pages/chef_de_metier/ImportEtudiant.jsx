import React, { useState, useEffect, useRef } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext"; // Import du contexte d'authentification
import { FiUpload, FiDownload, FiSearch, FiRefreshCw, FiUser, FiMail, FiBook } from "react-icons/fi";
import { BsFileEarmarkSpreadsheet, BsCalendar3 } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPen } from "react-icons/fa";

const ImportEtudiant = () => {
  const { user } = useAuth(); // Récupérer l'utilisateur connecté
  const [file, setFile] = useState(null);
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [metierFilter, setMetierFilter] = useState("all");
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchEtudiants();
  }, []);

  const fetchEtudiants = async () => {
    try {
      setLoading(true);
      
      // Récupérer le metier_id du chef connecté
      const metierId = user?.metier_id;
      
      console.log("👤 Chef de métier connecté:", {
        name: user?.name,
        metier_id: metierId
      });

      // Essayer différents endpoints
      let response;
      try {
        response = await api.get("/chef-metier/apprenants");
      } catch (err) {
        try {
          response = await api.get("/apprenants");
        } catch (err2) {
          try {
            response = await api.get("/utilisateurs?role=apprenant");
          } catch (err3) {
            response = await api.get("/etudiants");
          }
        }
      }

      console.log("Réponse complète API:", response.data);
      
      // Extraire les données
      let tousLesEtudiants = [];
      const data = response.data;
      
      if (Array.isArray(data)) {
        tousLesEtudiants = data;
      } else if (data?.data && Array.isArray(data.data)) {
        tousLesEtudiants = data.data;
      } else if (data?.apprenants && Array.isArray(data.apprenants)) {
        tousLesEtudiants = data.apprenants;
      } else if (data?.utilisateurs && Array.isArray(data.utilisateurs)) {
        tousLesEtudiants = data.utilisateurs;
      } else if (data?.etudiants && Array.isArray(data.etudiants)) {
        tousLesEtudiants = data.etudiants;
      }
      
      console.log("📊 Tous les étudiants récupérés:", tousLesEtudiants.length);

      // ========== FILTRAGE PAR MÉTIER ==========
      let etudiantsFiltres = [];
      
      if (metierId) {
        etudiantsFiltres = tousLesEtudiants.filter(etudiant => {
          // Vérifier si l'étudiant est associé au métier du chef
          
          // Cas 1: metier_id direct
          if (etudiant.metier_id === metierId || etudiant.metier_id === parseInt(metierId)) {
            return true;
          }
          
          // Cas 2: Objet métier
          if (etudiant.metier && typeof etudiant.metier === 'object') {
            if (etudiant.metier.id === metierId || etudiant.metier.id === parseInt(metierId)) {
              return true;
            }
          }
          
          // Cas 3: Tableau de métiers (rare mais possible)
          if (etudiant.metiers && Array.isArray(etudiant.metiers)) {
            return etudiant.metiers.some(m => {
              return m.id === metierId || 
                     m.id === parseInt(metierId) || 
                     m === metierId;
            });
          }
          
          return false;
        });
        
        console.log("✅ Étudiants filtrés pour le métier:", {
          total: tousLesEtudiants.length,
          filtres: etudiantsFiltres.length,
          metierId: metierId
        });
      } else {
        // Si pas de metierId (admin), afficher tous les étudiants
        etudiantsFiltres = tousLesEtudiants;
        console.log("⚠️ Pas de metier_id, affichage de tous les étudiants");
      }
      
      setEtudiants(etudiantsFiltres);
      
    } catch (err) {
      console.error("❌ Erreur lors de la récupération:", err);
      console.error("Détails:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("⚠ Veuillez sélectionner un fichier");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    
    // Ajouter le metier_id si disponible
    if (user?.metier_id) {
      formData.append("metier_id", user.metier_id);
    }

    try {
      setLoading(true);
      
      // Essayer différents endpoints
      let response;
      try {
        response = await api.post("/chef-metier/apprenants/import", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (err) {
        // Fallback si le endpoint chef-metier n'existe pas
        response = await api.post("/chef-metier/apprenants/import", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      
      console.log("Réponse import:", response.data);
      
      const stats = response.data.stats || response.data.total_apprenants;
      
      let message = "✅ Importation réussie !";
      if (stats) {
        if (typeof stats === 'number') {
          message += `\n\n${stats} étudiant(s) importé(s)`;
        } else if (stats.total) {
          message += `\n\n${stats.total} étudiant(s) importé(s)`;
          if (stats.success) message += `\n✓ Succès: ${stats.success}`;
          if (stats.errors) message += `\n✗ Erreurs: ${stats.errors}`;
        }
      }
      
      alert(message);
      
      setFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Attendre un peu avant de recharger
      setTimeout(async () => {
        await fetchEtudiants();
      }, 500);
      
    } catch (err) {
      console.error("Erreur complète:", err);
      console.error("Réponse erreur:", err.response?.data);
      
      let errorMessage = "Erreur inconnue";
      
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (Array.isArray(errors)) {
          errorMessage = errors.map(e => {
            // Si c'est une string directe
            if (typeof e === 'string') {
              return e;
            }
            // Si c'est un objet avec errors array
            if (e.errors && Array.isArray(e.errors)) {
              return `Ligne ${e.row}: ${e.errors.join(', ')}`;
            }
            // Sinon stringify
            return JSON.stringify(e);
          }).join('\n');
        } else if (typeof errors === 'object') {
          errorMessage = Object.entries(errors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
        } else {
          errorMessage = JSON.stringify(errors);
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert("❌ Erreur lors de l'importation :\n\n" + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredEtudiants = etudiants.filter((etudiant) => {
    const matchSearch =
      etudiant.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etudiant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etudiant.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etudiant.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchMetier =
      metierFilter === "all" || 
      etudiant.metier?.nom === metierFilter ||
      etudiant.metier?.nom?.toLowerCase() === metierFilter.toLowerCase();

    return matchSearch && matchMetier;
  });

  const metiers = [...new Set(etudiants.map((e) => e.metier?.nom).filter(Boolean))];

  const stats = {
    total: etudiants.length,
    parMetier: metiers.length,
    recent: etudiants.filter(
      (e) => e.created_at && new Date(e.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
  };

  if (loading && etudiants.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">
            Chargement des étudiants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestion de Mes Étudiants
        </h1>
        <p className="text-gray-600 mt-1">
          Importez et gérez les étudiants de votre métier par fichier Excel ou CSV
        </p>
        {user?.metier_id && (
          <p className="text-sm text-blue-600 mt-1">
            📌 Filtré pour votre métier uniquement
          </p>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-gray-600 mt-2">Total Étudiants</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-green-600">{stats.parMetier}</div>
          <div className="text-gray-600 mt-2">Métiers Différents</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl font-bold text-purple-600">{stats.recent}</div>
          <div className="text-gray-600 mt-2">Ajoutés cette semaine</div>
        </div>
      </div>

      {/* Section Import */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiUpload className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Importer des étudiants
            </h2>
            <p className="text-sm text-gray-600">
              Formats acceptés : .xlsx, .csv
            </p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* Zone de dépôt de fichier */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="flex flex-col items-center justify-center text-center">
              <BsFileEarmarkSpreadsheet className="text-gray-400 mb-3" size={48} />
              <label
                htmlFor="file-input"
                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
              >
                Cliquez pour sélectionner un fichier
              </label>
              <input
                id="file-input"
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">
                ou glissez-déposez votre fichier ici
              </p>
            </div>

            {file && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BsFileEarmarkSpreadsheet className="text-blue-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !file}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <FiUpload size={20} />
              {loading ? "Importation en cours..." : "Importer le fichier"}
            </button>
            <a
              href={`${api.defaults.baseURL}/chef-metier/v1/apprenants/template`}
              download
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <FiDownload size={20} />
              Télécharger modèle
            </a>
          </div>
        </form>

        {/* Message informatif */}
        {user?.metier_id && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Les étudiants importés seront automatiquement associés à votre métier
            </p>
          </div>
        )}
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par matricule, nom, prénom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={metierFilter}
            onChange={(e) => setMetierFilter(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les métiers</option>
            {metiers.map((metier) => (
              <option key={metier} value={metier}>
                {metier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Section Liste */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Liste des étudiants ({filteredEtudiants.length})
          </h2>
          <button
            onClick={fetchEtudiants}
            disabled={loading}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} />
            Actualiser
          </button>
        </div>

        {filteredEtudiants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍🎓</div>
            <p className="text-xl text-gray-500 font-semibold">
              {searchTerm || metierFilter !== "all"
                ? "Aucun étudiant ne correspond à votre recherche"
                : "Aucun étudiant importé"}
            </p>
            <p className="text-gray-400 mt-2">
              {!searchTerm && metierFilter === "all" && "Importez votre premier fichier d'étudiants"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matricule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom complet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Métier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'ajout
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEtudiants.map((etudiant) => (
                  <tr key={etudiant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <FiUser className="text-blue-600" size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {etudiant.matricule || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {etudiant.name} {etudiant.prenom || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMail className="mr-2 text-gray-400" size={16} />
                        {etudiant.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {etudiant.metier?.nom ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <FiBook className="mr-1" size={12} />
                          {etudiant.metier.nom}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {etudiant.created_at ? (
                        <div className="flex items-center">
                          <BsCalendar3 className="mr-2 text-gray-400" size={14} />
                          {new Date(etudiant.created_at).toLocaleDateString("fr-FR")}
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                          title="Modifier"
                          onClick={() => console.log("Modifier étudiant:", etudiant.id)}
                        >
                          <FaPen size={14} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer"
                          onClick={() => console.log("Supprimer étudiant:", etudiant.id)}
                        >
                          <RiDeleteBin6Line size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredEtudiants.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Affichage de {filteredEtudiants.length} étudiant(s) sur {etudiants.length} au total
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Précédent
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportEtudiant;