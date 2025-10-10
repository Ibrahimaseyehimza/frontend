import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const ChefMetierDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Chef de Métier</h2>
        <nav className="space-y-2">
          <NavLink
            to="campagnes"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            📋 Campagnes
          </NavLink>
          <NavLink
            to="entreprises"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            🏢 Entreprises
          </NavLink>
          <NavLink
            to="stages"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${
                isActive ? "bg-blue-900" : "hover:bg-blue-600"
              }`
            }
          >
            🎓 Stages
          </NavLink>
        </nav>
      </aside>

      {/* Contenu */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default ChefMetierDashboard;
