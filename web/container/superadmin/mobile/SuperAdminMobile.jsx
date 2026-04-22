export default function SuperAdminMobile({ handleLogout, session }) {
  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">SUPERADMIN MOBILE</h1>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
