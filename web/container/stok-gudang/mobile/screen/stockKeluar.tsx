export default function StockKeluar({ setScreen }: any) {
  return (
    <div className="p-4">
      <h2>Barang Keluar</h2>
      <button onClick={() => setScreen("home")}>Kembali</button>
    </div>
  );
}
