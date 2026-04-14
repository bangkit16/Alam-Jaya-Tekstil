export default function Home({ setScreen, handleLogout }: any) {
  return (
    <div className="p-4">
      <h1 className="font-bold mb-4">Stok Gudang</h1>

      <button onClick={() => setScreen("stock")}>Stock</button>
      <button onClick={() => setScreen("stockMasuk")}>Masuk</button>
      <button onClick={() => setScreen("stockKeluar")}>Keluar</button>
      <button onClick={() => setScreen("jobs")}>Jobs</button>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
