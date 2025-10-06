import useAuth from "../../hooks/useAuth";

export default function TuteurDashboard() {
  const { logout } = useAuth();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-600">
        🧑‍🏫 Dashboard Tuteur
      </h1>
      <p className="mt-2">Gestion des tâches, évaluations, suivi étudiants...</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Déconnexion
      </button>
    </div>
  );
}
