export default function StockMasuk({ setScreen }: any) {
  return (
    <div className="p-4">
      <h2>Barang Masuk</h2>
      <button onClick={() => setScreen("home")}>Kembali</button>
    </div>
  );
}
