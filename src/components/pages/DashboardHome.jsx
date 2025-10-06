import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    metiers: 0,
    chefsMetier: 0,
    entreprises: 0,
    campagnes: 0,
    stages: 0,
  });

  useEffect(() => {
    // 🔹 Exemple d'appel API (adapte les routes selon ton backend)
    const fetchStats = async () => {
      try {
        const [metiersRes, chefsRes, entreprisesRes, campagnesRes, stagesRes] =
          await Promise.all([
            api.get("/metiers"),
            api.get("/users?role=chef_metier"),
            api.get("/entreprises"),
            api.get("/campagnes"),
            api.get("/stages"),
          ]);

        setStats({
          metiers: metiersRes.data.data?.length || 0,
          chefsMetier: chefsRes.data.data?.length || 0,
          entreprises: entreprisesRes.data.data?.length || 0,
          campagnes: campagnesRes.data.data?.length || 0,
          stages: stagesRes.data.data?.length || 0,
        });
      } catch (err) {
        console.error("Erreur lors du chargement des stats :", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tableau de bord général 📊</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-blue-700">Métiers</h3>
          <p className="text-3xl font-bold">{stats.metiers}</p>
        </div>

        <div className="bg-green-100 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-green-700">Chefs de métier</h3>
          <p className="text-3xl font-bold">{stats.chefsMetier}</p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-yellow-700">Entreprises</h3>
          <p className="text-3xl font-bold">{stats.entreprises}</p>
        </div>

        <div className="bg-purple-100 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-purple-700">Campagnes</h3>
          <p className="text-3xl font-bold">{stats.campagnes}</p>
        </div>

        <div className="bg-red-100 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-red-700">Stages</h3>
          <p className="text-3xl font-bold">{stats.stages}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
