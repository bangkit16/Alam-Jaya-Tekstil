"use client";

import { useState } from "react";

import UserManagement from "./screen/UserManagement";
import AddUser from "./screen/AddUser";
import EditUser from "./screen/EditUser";
import DeleteUser from "./screen/DeleteUser";

type ScreenType = "userManagement" | "addUser" | "editUser" | "deleteUser";

interface SuperAdminMobileProps {
  handleLogout?: () => void;
}

export default function SuperAdminMobile(props: SuperAdminMobileProps) {
  const handleLogout = props?.handleLogout || (() => {});

  // 🔥 STATE UTAMA
  const [screen, setScreenState] = useState<ScreenType>("userManagement");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // 🔥 CUSTOM SETSCREEN (SUPPORT KIRIM DATA USER)
  const setScreen = (screen: ScreenType, user?: any) => {
    setScreenState(screen);
    if (user) setSelectedUser(user);
  };

  return (
    <>
      {screen === "userManagement" && (
        <UserManagement
          key="userManagement"
          setScreen={setScreen}
          handleLogout={handleLogout}
        />
      )}

      {screen === "addUser" && <AddUser key="addUser" setScreen={setScreen} />}

      {screen === "editUser" && (
        <EditUser
          key="editUser"
          setScreen={setScreen}
          selectedUser={selectedUser}
        />
      )}

      {screen === "deleteUser" && (
        <DeleteUser
          key="deleteUser"
          setScreen={setScreen}
          selectedUser={selectedUser}
        />
      )}
    </>
  );
}
