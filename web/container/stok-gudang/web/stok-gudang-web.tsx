"use client";

import { useState } from "react";
import {
  Package,
  Archive,
  CheckCircle,
  ClipboardList,
  ChevronDown,
  PackageSearch,
  X,
} from "lucide-react";

import {
  useGetBoxMasuk,
  BoxMasuk as IBoxMasuk,
} from "@/services/stok-gudang/useGetBoxMasuk";

import { useGetPenerimaBox } from "@/services/stok-gudang/useGetPenerimaBox";
import { usePutBoxMasuk } from "@/services/stok-gudang/usePutBoxMasuk";

import BarcodeGenerator from "@/components/BarcodeGenerator";

import {
  useGetDatabox,
  DataBox as IDataBox,
} from "@/services/stok-gudang/useGetDataBox";

type TabType = "boxMasuk" | "dataBox" | "permintaanResi" | "mintaPotong";

export default function StokGudangWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("boxMasuk");

  const [data, setData] = useState<any[]>([
    { id: 1, nama: "Hoodie A", qty: 20, status: "dataBox" },
    { id: 2, nama: "Kaos B", qty: 10, status: "boxMasuk" },
  ]);

  const filtered = data.filter((d) => d.status === activeTab);

  const count = (status: TabType) =>
    data.filter((d) => d.status === status).length;

  const menus = [
    { key: "boxMasuk", label: "Box Masuk", icon: <Archive /> },
    { key: "dataBox", label: "Data Box", icon: <Package /> },
    {
      key: "permintaanResi",
      label: "Permintaan Resi",
      icon: <ClipboardList />,
    },
    {
      key: "mintaPotong",
      label: "Minta Potong",
      icon: <CheckCircle />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-5 hidden md:flex flex-col">
        <h1 className="text-lg font-semibold mb-6">Stok Gudang</h1>

        {menus.map((menu) => (
          <button
            key={menu.key}
            onClick={() => setActiveTab(menu.key as TabType)}
            className={`flex items-center gap-2 text-left px-4 py-2 rounded-xl transition ${
              activeTab === menu.key
                ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {menu.icon}
            {menu.label}
          </button>
        ))}

        <button onClick={handleLogout} className="mt-auto text-red-500 text-xs">
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-6">Dashboard Stok Gudang</h2>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Stat
            title="Box Masuk"
            value={count("boxMasuk")}
            icon={<Archive />}
          />
          <Stat title="Data Box" value={count("dataBox")} icon={<Package />} />
          <Stat
            title="Permintaan Resi"
            value={count("permintaanResi")}
            icon={<ClipboardList />}
          />
          <Stat
            title="Minta Potong"
            value={count("mintaPotong")}
            icon={<CheckCircle />}
          />
        </div>

        {/* LIST */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-4">
            {menus.find((m) => m.key === activeTab)?.label}
          </h3>

          {/* 🔥 KHUSUS BOX MASUK */}
          {activeTab === "boxMasuk" ? (
            <BoxMasukWeb />
          ) : activeTab === "dataBox" ? (
            <DataBoxWeb />
          ) : (
            <>
              <div className="space-y-3">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border rounded-xl p-4 flex justify-between items-center"
                  >
                    <p>{item.nama}</p>
                    <b>{item.qty}</b>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-6">
                  Tidak ada data
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= BOX MASUK ================= */
function BoxMasukWeb() {
  const [selected, setSelected] = useState<IBoxMasuk | null>(null);
  const [idPenerimaBox, setIdPenerimaBox] = useState("");
  const [openCollapse, setOpenCollapse] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetBoxMasuk();
  const { data: penerima } = useGetPenerimaBox();
  const mutation = usePutBoxMasuk();

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Error</p>;

  return (
    <>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data?.map((box) => {
          const isOpen = openCollapse === box.idBox;

          return (
            <div key={box.idBox} className="bg-white rounded-2xl border p-4">
              <div onClick={() => setSelected(box)} className="cursor-pointer">
                <p className="font-bold">{box.namaBox}</p>

                <div className="text-xs text-gray-500 mb-2">
                  <p>Penanggung Jawab: {box.namaPenanggungJawab}</p>
                  <p>
                    Tgl Masuk:{" "}
                    {new Date(box.tanggalMasukStok).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCollapse(isOpen ? null : box.idBox);
                }}
                className="w-full flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl border"
              >
                <span className="flex items-center gap-2 text-sm">
                  <PackageSearch size={16} />
                  Lihat Isi Box
                </span>

                <ChevronDown
                  className={`transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="mt-3 space-y-2">
                  {box.stokPotongan.map((item) => (
                    <div
                      key={item.idQC}
                      className="bg-gray-50 border rounded-lg p-3"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {item.namaBarang} - {item.ukuran}
                          </p>

                          <p className="text-xs text-gray-500">
                            Kode Stok Potongan: {item.kodeStokPotongan}
                          </p>

                          <p className="text-xs text-gray-500">
                            Tgl Selesai QC:{" "}
                            {new Date(item.tanggalSelesaiQC).toLocaleDateString(
                              "id-ID",
                            )}
                          </p>
                        </div>

                        <b className="text-lg">{item.jumlah}</b>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-col items-center">
                <BarcodeGenerator value={box.kodeBox} />
                <span className="text-xs mt-1">{box.kodeBox}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-2xl p-5 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <h3 className="font-bold mb-2">{selected.namaBox}</h3>

            <div className="text-xs text-gray-500 mb-3">
              <p>Penanggung Jawab: {selected.namaPenanggungJawab}</p>
              <p>
                Tgl Masuk:{" "}
                {new Date(selected.tanggalMasukStok).toLocaleString("id-ID")}
              </p>
            </div>

            <select
              value={idPenerimaBox}
              onChange={(e) => setIdPenerimaBox(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            >
              <option value="">Pilih Penerima</option>
              {penerima?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>

            <div className="space-y-2 mb-3">
              {selected.stokPotongan.map((item) => (
                <div
                  key={item.idQC}
                  className="bg-gray-50 border rounded-lg p-3"
                >
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{item.namaBarang}</p>
                    <b>{item.jumlah}</b>
                  </div>

                  <p className="text-xs text-gray-500">
                    Kode: {item.kodeStokPotongan}
                  </p>

                  <p className="text-xs text-gray-500">Ukuran: {item.ukuran}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                if (!idPenerimaBox) return alert("Pilih penerima!");

                mutation.mutate(
                  {
                    idBox: selected.idBox,
                    payload: { idPenerimaBox },
                  },
                  {
                    onSuccess: () => {
                      setSelected(null);
                      setIdPenerimaBox("");

                      // 🔥 PINDAH TAB
                      window.location.reload(); // simple dulu
                    },
                  },
                );
              }}
              className="w-full bg-orange-500 text-white py-2 rounded-xl"
            >
              ACC BOX
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function DataBoxWeb() {
  const [selected, setSelected] = useState<IDataBox | null>(null);
  const [openCollapse, setOpenCollapse] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetDatabox();

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Error</p>;

  return (
    <>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data?.map((box) => {
          const isOpen = openCollapse === box.idBox;

          return (
            <div key={box.idBox} className="bg-white border rounded-2xl p-4">
              {/* HEADER */}
              <div onClick={() => setSelected(box)} className="cursor-pointer">
                <p className="font-bold">{box.namaBox}</p>

                <div className="text-xs text-gray-500 mt-1">
                  <p>Penerima: {box.namaPenerimaBox}</p>
                  <p>
                    Tanggal:{" "}
                    {new Date(box.tanggalMasukGudang).toLocaleDateString(
                      "id-ID",
                    )}
                  </p>
                </div>
              </div>

              {/* COLLAPSE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCollapse(isOpen ? null : box.idBox);
                }}
                className="w-full mt-3 flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl border"
              >
                <span className="flex items-center gap-2 text-sm">
                  <PackageSearch size={16} />
                  Lihat Isi Box
                </span>

                <ChevronDown
                  className={`transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* CONTENT */}
              {isOpen && (
                <div className="mt-3 space-y-2">
                  {box.stokPotongan.map((item: any) => (
                    <div
                      key={item.idQC}
                      className="bg-gray-50 border rounded-lg p-2"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm">{item.namaBarang}</p>
                          <p className="text-xs text-blue-600 font-bold">
                            Ukuran: {item.ukuran}
                          </p>
                        </div>

                        <b>{item.jumlah}</b>
                      </div>

                      <div className="text-xs text-gray-500 mt-2 border-t pt-2">
                        {item.isUrgent && (
                          <p className="text-red-500 font-bold mb-1">URGENT</p>
                        )}

                        <p>Kode: {item.kodeStokPotongan}</p>

                        <p>
                          QC Selesai:{" "}
                          {new Date(item.tanggalSelesaiQC).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BARCODE */}
              <div className="mt-4 flex flex-col items-center">
                <BarcodeGenerator value={box.kodeBox} />
                <span className="text-xs mt-1">{box.kodeBox}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl p-5 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <h3 className="font-bold mb-2">{selected.namaBox}</h3>

            <div className="text-sm text-gray-600 mb-3">
              <p>Penerima: {selected.namaPenerimaBox}</p>
              <p>
                Masuk:{" "}
                {new Date(selected.tanggalMasukGudang).toLocaleString("id-ID")}
              </p>
              <p>Kode: {selected.kodeBox}</p>
            </div>

            <p className="text-xs font-bold text-gray-400 mb-2">ISI BOX:</p>

            <div className="space-y-2 max-h-52 overflow-auto">
              {selected.stokPotongan.map((item: any) => (
                <div key={item.idQC} className="bg-gray-50 p-2 rounded">
                  <div className="flex justify-between">
                    <p>{item.namaBarang}</p>
                    <b>{item.jumlah}</b>
                  </div>

                  <p className="text-xs text-blue-600">{item.ukuran}</p>
                  <p className="text-xs text-gray-500">
                    QC:{" "}
                    {new Date(item.tanggalSelesaiQC).toLocaleDateString(
                      "id-ID",
                    )}
                  </p>

                  {item.isUrgent && (
                    <p className="text-xs text-red-500 font-bold">URGENT</p>
                  )}
                </div>
              ))}
            </div>

            <div className="my-4 flex flex-col items-center">
              <BarcodeGenerator value={selected.kodeBox} />
              <span className="text-xs">{selected.kodeBox}</span>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full bg-gray-100 py-2 rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= STAT ================= */
function Stat({ title, value, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl flex items-center gap-3">
      <div className="text-orange-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
