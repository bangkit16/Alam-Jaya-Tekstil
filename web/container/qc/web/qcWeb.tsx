"use client";

import { useState } from "react";
import { Package, ClipboardList, Archive, CheckCircle } from "lucide-react";

// 🔥 IMPORT API
import { useGetQCMenunggu } from "@/services/qc/useGetQCMenunggu";
import { usePutMulaiQC } from "@/services/qc/usePutMulaiQC";
import { useGetQCProses } from "@/services/qc/useGetQCProses";
import { usePutQCProses } from "@/services/qc/usePutQCProses";
import { useGetQCMasukBox } from "@/services/qc/useGetQCBoxMasuk";
import { useGetPenanggungJawabBox } from "@/services/qc/useGetPenanggungJawabBox";
import { usePostPackingBox } from "@/services/qc/usePostPackingBox";
import { useGetQCSelesai } from "@/services/qc/useGetQCSelesai";
import BarcodeGenerator from "@/components/BarcodeGenerator";

type TabType = "menunggu" | "proses" | "masuk_box" | "selesai";

export default function QCWeb({ handleLogout }: any) {
  const [selected, setSelected] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");

  // 🔥 API
  const { data: qcMenunggu, isLoading } = useGetQCMenunggu();
  const { mutate: mulaiQC, isPending } = usePutMulaiQC();
  const { data: qcProses, isLoading: loadingProses } = useGetQCProses();
  const [selectedProses, setSelectedProses] = useState<any | null>(null);
  const [selectedBox, setSelectedBox] = useState<string[]>([]);
  const [openPacking, setOpenPacking] = useState(false);
  const [namaBox, setNamaBox] = useState("");
  const [penanggungJawabId, setPenanggungJawabId] = useState("");
  const { data: qcSelesai, isLoading: loadingSelesai } = useGetQCSelesai();
  const [selectedSelesai, setSelectedSelesai] = useState<any | null>(null);

  const { data: qcMasukBox, isLoading: loadingBox } = useGetQCMasukBox();
  const { data: listPJ } = useGetPenanggungJawabBox();
  const { mutate: kirimPacking, isPending: loadingPacking } =
    usePostPackingBox();

  const [formQC, setFormQC] = useState({
    idPengecek: [] as string[],
    jumlahLolos: 0,
    jumlahPermak: 0,
    jumlahReject: 0,
    jumlahTurunSize: 0,
    jumlahKotor: 0,
  });

  const { mutate: submitQC, isPending: loadingQC } = usePutQCProses();

  // 🔥 LOCAL STATE (tetap dipakai untuk selain menunggu)
  const [data, setData] = useState<any[]>([
    {
      id: 2,
      nama: "Hoodie Black - M",
      qty: 15,
      status: "proses",
    },
    {
      id: 3,
      nama: "Hoodie Abu - XL",
      qty: 10,
      status: "masuk_box",
    },
  ]);

  // 🔥 FILTER (MENUNGGU = API, lainnya = local)
  const filtered =
    activeTab === "menunggu"
      ? qcMenunggu || []
      : activeTab === "proses"
        ? qcProses || []
        : activeTab === "masuk_box"
          ? qcMasukBox || []
          : activeTab === "selesai"
            ? qcSelesai || []
            : data.filter((d) => d.status === activeTab);

  // ================= ACTION =================
  const updateStatus = (id: any, status: TabType) => {
    setData((prev) => [
      ...prev,
      {
        id: Date.now(),
        nama: "Dari QC Menunggu",
        qty: 0,
        status,
      },
    ]);
  };

  // ================= COUNT =================
  const count = (status: TabType) => {
    if (status === "menunggu") return qcMenunggu?.length || 0;
    if (status === "proses") return qcProses?.length || 0;
    if (status === "selesai") return qcSelesai?.length || 0;
    return data.filter((d) => d.status === status).length;
  };

  const toggleBox = (id: string) => {
    setSelectedBox((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-5 hidden md:flex flex-col">
        <h1 className="text-lg font-semibold mb-6">QC Panel</h1>

        <div className="space-y-2">
          {["menunggu", "proses", "masuk_box", "selesai"].map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveTab(menu as TabType)}
              className={`w-full text-left px-4 py-2 rounded-xl capitalize ${
                activeTab === menu
                  ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {menu.replace("_", " ")}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-50 text-red-500 text-xs py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Dashboard QC</h2>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Stat title="Menunggu" value={count("menunggu")} icon={<Package />} />
          <Stat
            title="Proses"
            value={count("proses")}
            icon={<ClipboardList />}
          />
          <Stat
            title="Masuk Box"
            value={count("masuk_box")}
            icon={<Archive />}
          />
          <Stat
            title="Selesai"
            value={count("selesai")}
            icon={<CheckCircle />}
          />
        </div>

        {activeTab === "proses" && loadingProses && (
          <p className="text-center text-gray-400">Loading data proses...</p>
        )}

        {/* LIST */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-4 capitalize">
            Data {activeTab.replace("_", " ")}
          </h3>

          {/* 🔥 LOADING */}
          {activeTab === "menunggu" && isLoading && (
            <p className="text-center text-gray-400">Loading data QC...</p>
          )}

          <div className="space-y-3">
            {filtered.map((item: any) => {
              const isMenunggu = activeTab === "menunggu";
              const isProses = activeTab === "proses";
              const isSelesai = activeTab === "selesai";
              const isMasukBox = activeTab === "masuk_box";

              return (
                <div
                  key={isMenunggu || isProses ? item.idQC : item.id}
                  onClick={() => {
                    if (isMenunggu) setSelected(item);
                    if (isProses) setSelectedProses(item);
                    if (activeTab === "masuk_box") toggleBox(item.idQC);
                    if (isSelesai) setSelectedSelesai(item);
                  }}
                  className={`bg-white border rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow transition cursor-pointer
${
  activeTab === "masuk_box" && selectedBox.includes(item.idQC)
    ? "border-orange-500 bg-orange-50"
    : ""
}`}
                >
                  <div>
                    <p className="text-sm font-medium">
                      {isMenunggu || isProses
                        ? `${item.namaBarang} - ${item.ukuran}`
                        : isSelesai
                          ? item.namaBox
                          : item.nama}
                    </p>

                    {/* 🔥 DETAIL */}
                    {(isMenunggu || isProses) && (
                      <p className="text-xs text-gray-500">
                        {item.namaPenjahit} • {item.kodeStokPotongan}
                      </p>
                    )}

                    {/* 🔥 MASUK BOX DETAIL */}
                    {activeTab === "masuk_box" && (
                      <div className="text-xs text-gray-500 mt-2 space-y-1">
                        {/* 🔥 SELESAI DETAIL */}
                        {isSelesai && (
                          <div className="text-xs text-gray-500 mt-2 space-y-1">
                            <p>• Nama Box : {item.namaBox}</p>
                            <p>
                              • Penanggung Jawab : {item.namaPenanggungJawab}
                            </p>
                            <p>
                              • Tanggal Masuk :
                              {new Date(
                                item.tanggalMasukStok,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        <p>• Kode Potongan : {item.kodeStokPotongan}</p>
                        <p>• Nama Penjahit : {item.namaPenjahit}</p>
                        <p>
                          • Tanggal Selesai QC :{" "}
                          {new Date(item.tanggalSelesaiQC).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* 🔥 KHUSUS PROSES TAMBAHAN */}
                    {isProses && (
                      <p className="text-xs text-blue-500">
                        Mulai QC:{" "}
                        {new Date(item.tanggalMulaiQC).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      {isMenunggu || isProses
                        ? item.jumlahSelesaiJahit
                        : item.qty}
                    </span>

                    {/* 🔥 URGENT */}
                    {(isMenunggu || isProses) && item.isUrgent && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                        URGENT
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* modal proses */}

          {selectedProses && (
            <div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              onClick={() => setSelectedProses(null)}
            >
              <div
                className="bg-white rounded-2xl p-6 w-[95%] max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-semibold">
                      {selectedProses.namaBarang} - {selectedProses.ukuran}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {selectedProses.kodeStokPotongan}
                    </p>
                  </div>

                  <p className="text-xl font-bold text-orange-500">
                    {selectedProses.jumlahSelesaiJahit}
                  </p>
                </div>

                {/* INFO */}
                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <p>Penjahit: {selectedProses.namaPenjahit}</p>
                  <p>
                    Tgl Selesai:{" "}
                    {new Date(
                      selectedProses.tanggalSelesaiJahit,
                    ).toLocaleDateString()}
                  </p>
                </div>

                {/* STATUS */}
                <div className="bg-gray-100 p-3 rounded-xl mb-4 flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Mulai QC</p>
                    <p className="text-sm">
                      {new Date(selectedProses.tanggalMulaiQC).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Prioritas</p>
                    <p className="text-red-500 font-semibold">
                      {selectedProses.isUrgent ? "URGENT" : "-"}
                    </p>
                  </div>
                </div>

                {/* INPUT */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    ["jumlahLolos", "Lolos"],
                    ["jumlahPermak", "Permak"],
                    ["jumlahReject", "Reject"],
                    ["jumlahTurunSize", "Turun Size"],
                    ["jumlahKotor", "Kotor"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <p className="text-xs mb-1">{label}</p>
                      <input
                        type="number"
                        value={(formQC as any)[key]}
                        onChange={(e) =>
                          setFormQC((prev) => ({
                            ...prev,
                            [key]: Number(e.target.value),
                          }))
                        }
                        className="w-full border rounded-lg px-2 py-1 text-sm"
                      />
                    </div>
                  ))}
                </div>

                {/* ACTION */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedProses(null)}
                    className="px-4 py-1 bg-gray-200 rounded"
                  >
                    Tutup
                  </button>

                  <button
                    onClick={() => {
                      submitQC({
                        idQC: selectedProses.idQC,
                        body: formQC,
                      });
                      setSelectedProses(null);
                    }}
                    disabled={loadingQC}
                    className="px-4 py-1 bg-orange-500 text-white rounded disabled:opacity-50"
                  >
                    {loadingQC ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {filtered.length === 0 && !isLoading && (
            <p className="text-center text-gray-400 text-sm mt-6">
              Tidak ada data
            </p>
          )}

          {/* MODAL SELESAI */}
          {selectedSelesai && (
            <div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              onClick={() => setSelectedSelesai(null)}
            >
              <div
                className="bg-white rounded-2xl p-6 w-[95%] max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-semibold">{selectedSelesai.namaBox}</h2>

                    <p className="text-xs text-gray-500">
                      Penanggung Jawab :{selectedSelesai.namaPenanggungJawab}
                    </p>
                  </div>

                  <p className="text-xl font-bold text-green-500">SELESAI</p>
                </div>

                {/* INFO */}
                <div className="bg-gray-100 p-3 rounded-xl mb-4 text-sm">
                  <p>
                    Tanggal Masuk :
                    {new Date(
                      selectedSelesai.tanggalMasukStok,
                    ).toLocaleDateString("id-ID")}
                  </p>
                </div>

                {/* LIST BARANG */}
                <div className="space-y-2 max-h-60 overflow-auto">
                  {selectedSelesai.stokPotongan?.map((stok: any) => (
                    <div
                      key={stok.idQC}
                      className="border rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {stok.namaBarang} - {stok.ukuran}
                          </p>

                          <p className="text-xs text-gray-500">
                            {stok.kodeStokPotongan}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">{stok.jumlah}</p>

                          {stok.isUrgent && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                              URGENT
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(stok.tanggalSelesaiQC).toLocaleString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                {/* BARCODE */}
                <div className="mt-4 flex flex-col items-center">
                  <BarcodeGenerator value={selectedSelesai.kodeBox} />

                  <span className="text-[10px] text-gray-400 tracking-widest">
                    {selectedSelesai.kodeBox}
                  </span>
                </div>

                {/* BUTTON */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setSelectedSelesai(null)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
          {selected && (
            <div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              onClick={() => setSelected(null)}
            >
              <div
                className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 🔥 HEADER */}
                {selected.isUrgent && (
                  <p className="text-red-500 font-bold mb-1">URGENT</p>
                )}

                <h2 className="text-lg font-semibold mb-2">
                  {selected.namaBarang} - {selected.ukuran}
                </h2>

                {/* 🔥 DETAIL */}
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Kode Potongan: {selected.kodeStokPotongan}</li>
                  <li>• Penjahit: {selected.namaPenjahit}</li>
                  <li>
                    • Tanggal:{" "}
                    {new Date(
                      selected.tanggalSelesaiJahit,
                    ).toLocaleDateString()}
                  </li>
                </ul>

                {/* 🔥 QTY */}
                <div className="text-right text-xl font-bold mb-4">
                  {selected.jumlahSelesaiJahit}
                </div>

                {/* 🔥 ACTION */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-1 rounded bg-gray-200 text-sm"
                  >
                    Tutup
                  </button>

                  <button
                    onClick={() => {
                      mulaiQC(selected.idQC, {
                        onSuccess: () => {
                          setSelected(null);
                          setActiveTab("proses");
                        },
                      });
                    }}
                    disabled={isPending}
                    className="px-4 py-1 rounded bg-orange-500 text-white text-sm disabled:opacity-50"
                  >
                    {isPending ? "Loading..." : "Proses"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {activeTab === "masuk_box" && (
          <div className="mt-4">
            <button
              disabled={selectedBox.length === 0}
              onClick={() => setOpenPacking(true)}
              className="w-full py-3 rounded-xl font-semibold
      bg-orange-500 text-white
      disabled:bg-gray-300"
            >
              PACKING ({selectedBox.length})
            </button>
          </div>
        )}
        {openPacking && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[420px]">
              <h3 className="font-semibold mb-4">Packing Box</h3>

              {/* Penanggung Jawab */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 mb-2">
                  PENANGGUNG JAWAB
                </p>

                <div className="space-y-2 max-h-32 overflow-auto">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 mb-2">
                      PENANGGUNG JAWAB
                    </p>

                    <select
                      value={penanggungJawabId}
                      onChange={(e) => setPenanggungJawabId(e.target.value)}
                      className="w-full border rounded-lg p-2"
                    >
                      <option value="">Pilih Penanggung Jawab</option>

                      {listPJ?.map((pj: any) => (
                        <option key={pj.id} value={pj.id}>
                          {pj.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Dipilih {penanggungJawabId.length} orang
                </p>
              </div>

              {/* Nama Box */}
              <input
                placeholder="Nama Box"
                value={namaBox}
                onChange={(e) => setNamaBox(e.target.value)}
                className="w-full border rounded-lg p-2 mb-4"
              />

              {/* List */}
              <div className="max-h-40 overflow-auto border rounded-lg p-2">
                {qcMasukBox
                  ?.filter((i: any) => selectedBox.includes(i.idQC))
                  .map((i: any) => (
                    <div
                      key={i.idQC}
                      className="flex justify-between text-sm py-1"
                    >
                      <span>{i.namaBarang}</span>
                      <span>{i.jumlahLolos}</span>
                    </div>
                  ))}
              </div>

              {/* Button */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setOpenPacking(false)}
                  className="flex-1 bg-gray-200 py-2 rounded"
                >
                  Batal
                </button>

                <button
                  disabled={!namaBox || penanggungJawabId.length === 0}
                  onClick={() =>
                    kirimPacking(
                      {
                        idPenanggungJawabBox: penanggungJawabId,
                        namaBox,
                        idQc: selectedBox,
                      },
                      {
                        onSuccess: () => {
                          setOpenPacking(false);
                          setSelectedBox([]);
                          setNamaBox("");
                          setPenanggungJawabId("");
                        },
                      },
                    )
                  }
                  className="flex-1 bg-orange-500 text-white py-2 rounded"
                >
                  {loadingPacking ? "Loading..." : "Konfirmasi"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= COMPONENT =================
function Stat({ title, value, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
      <div className="text-orange-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h3 className="text-lg font-bold">{value}</h3>
      </div>
    </div>
  );
}
