// import React, { useState } from "react";
// import api from "../../../api/axios";

// const ImportEtudiant = () => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => setFile(e.target.files[0]);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await api.post("/chef-metier/v1/etudiants/import", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Importation réussie ✅");
//     } catch (err) {
//       console.error(err);
//       alert("Erreur d'importation ❌");
//     }
//   };

//   return (
//     <div className="p-6 bg-white shadow rounded">
//       <h2 className="text-2xl font-bold mb-4">Importer des étudiants</h2>
//       <form onSubmit={handleUpload}>
//         <input type="file" accept=".xlsx,.csv" onChange={handleFileChange} required />
//         <button
//           type="submit"
//           className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Importer
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ImportEtudiant;















import React, { useState, useEffect } from "react";
import api from "../../../api/axios";

const ImportEtudiant = () => {
  const [file, setFile] = useState(null);
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les étudiants au montage du composant
  useEffect(() => {
    fetchEtudiants();
  }, []);

  // Récupérer la liste des étudiants
  const fetchEtudiants = async () => {
    try {
      setLoading(true);
      const response = await api.get("/chef-metier/v1/apprenants/");
      setEtudiants(response.data.data);
    } catch (err) {
      console.error("Erreur lors de la récupération:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await api.post("/chef-metier/v1/apprenants/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Importation réussie ✅");
      setFile(null);
      // Recharger la liste après l'import
      fetchEtudiants();
    } catch (err) {
      console.error(err);
      alert("Erreur d'importation ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Section Import */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Importer des étudiants</h2>
        <form onSubmit={handleUpload} className="flex items-center gap-4">
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileChange}
            className="border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Importation..." : "Importer"}
          </button>
        </form>
      </div>

      {/* Section Liste */}
      <div className="bg-white shadow rounded p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Liste des étudiants ({etudiants.length})
          </h2>
          <button
            onClick={fetchEtudiants}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            🔄 Actualiser
          </button>
        </div>

        {loading ? (
          <p className="text-center py-8">Chargement...</p>
        ) : etudiants.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            Aucun étudiant importé
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Matricule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Prénom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Métier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date d'ajout
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {etudiants.map((etudiant) => (
                  <tr key={etudiant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {etudiant.matricule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {etudiant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {etudiant.prenom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {etudiant.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {etudiant.metier?.nom || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(etudiant.created_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportEtudiant;