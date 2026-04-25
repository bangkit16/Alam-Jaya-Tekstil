"use client";

import { useState } from "react";
import { Package, Briefcase, Bell } from "lucide-react";

import UserManagement from "./screen/UserManagement";
import AddUser from "./screen/AddUser";
import EditUser from "./screen/EditUser";
import DeleteUser from "./screen/DeleteUser";

type ScreenType =
  | "home"
  | "userManagement"
  | "addUser"
  | "editUser"
  | "deleteUser";

interface SuperAdminMobileProps {
  handleLogout?: () => void;
}

export default function SuperAdminMobile({
  handleLogout,
}: SuperAdminMobileProps) {
  const [screen, setScreen] = useState<ScreenType>("home");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const goScreen = (screen: ScreenType, user?: any) => {
    setScreen(screen);
    if (user) setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex justify-center items-center p-4">
      {/* 🔥 PHONE FRAME (GLOBAL) */}
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        {/* 🔥 CONTENT SWITCH */}
        <div className="flex-1 overflow-hidden">
          {/* HOME */}
          {screen === "home" && (
            <div className="p-4 flex flex-col h-full">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl p-4 mb-4 shadow-md">
                <p className="text-sm opacity-90">Welcome Back 👋</p>
                <p className="font-bold text-lg">Super Admin</p>
                <p className="text-xs opacity-80">Management Panel</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-3 flex gap-3 items-center mb-4 shadow-sm">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-400">
                  IMG
                </div>

                <div className="text-xs leading-relaxed">
                  <p className="text-gray-500">
                    Nama :{" "}
                    <span className="text-gray-900 font-medium">Admin</span>
                  </p>
                  <p className="text-gray-500">
                    Role :{" "}
                    <span className="text-gray-900 font-medium">
                      SUPERADMIN
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex justify-between mb-6 px-2">
                {[
                  {
                    label: "User",
                    icon: <Package size={26} />,
                    color: "text-orange-500",
                    onClick: () => goScreen("userManagement"),
                  },
                  {
                    label: "Jobs",
                    icon: <Briefcase size={26} />,
                    color: "text-amber-500",
                  },
                  {
                    label: "Report",
                    icon: <Bell size={26} />,
                    color: "text-red-500",
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.onClick}
                    className="flex flex-col items-center"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <div className={item.color}>{item.icon}</div>
                    </div>
                    <span className="text-xs mt-1 text-gray-600">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex-1 bg-gray-50 rounded-2xl p-3 shadow-inner">
                <p className="text-sm text-gray-500">Aktivitas terbaru</p>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    User baru ditambahkan
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    Update data user
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 text-sm text-red-500 font-medium"
              >
                Logout
              </button>
            </div>
          )}

          {/* USER MANAGEMENT */}
          {screen === "userManagement" && (
            <UserManagement setScreen={goScreen} />
          )}

          {screen === "addUser" && <AddUser setScreen={goScreen} />}

          {screen === "editUser" && (
            <EditUser setScreen={goScreen} selectedUser={selectedUser} />
          )}

          {screen === "deleteUser" && (
            <DeleteUser setScreen={goScreen} selectedUser={selectedUser} />
          )}
        </div>
      </div>
    </div>
  );
}
