import useAuth from "../../hooks/useAuth";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Bienvenue sur le Dashboard 🎉</h1>
      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Déconnexion
      </button>
    </div>
  );
}
