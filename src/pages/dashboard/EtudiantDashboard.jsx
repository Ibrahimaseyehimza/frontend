import useAuth from "../../hooks/useAuth";

export default function EtudiantDashboard() {
  const { logout } = useAuth();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600">
        🎓 Dashboard Étudiant
      </h1>
      <p className="mt-2">Suivi du stage, livrables, messagerie...</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Déconnexion
      </button>
    </div>
  );
}
