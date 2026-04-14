"use client";

import { useState } from "react";
import { useGetProses } from "@/services/potong/useGetProses";
import { usePutProses } from "@/services/potong/usePutProses";
import { useGetPemotong } from "@/services/potong/useGetPemotong";
import { toast } from "sonner";

type prosesType = {
  idPermintaan: string;
  namaBarang: string;
  kategori?: string;
  jumlahMinta: number;
  ukuran: string;
  isUrgent: boolean;
  kodeKain?: string;
  pengecek?: string;
  pemotong?: string;
};

export default function Proses() {
  const [selectedProses, setSelectedProses] = useState<prosesType | null>(null);

  const { data: dataProses, isLoading } = useGetProses();
  const { mutate: mutateProses } = usePutProses();
  const { data: pemotongData } = useGetPemotong();

  const [form, setForm] = useState({
    kode_potongan: "",
    jumlah_lolos: "",
    pengecek: "",
  });

  // ✅ SIMPAN ID (UUID)
  const [pemotongList, setPemotongList] = useState<string[]>([]);

  const handleSelectProses = (proses: prosesType) => {
    setSelectedProses(proses);
    setForm({
      kode_potongan: proses.kodeKain || "",
      jumlah_lolos: "",
      pengecek: "",
    });
    setPemotongList([]);
  };

  const handleCloseModal = () => {
    setSelectedProses(null);
    setForm({
      kode_potongan: "",
      jumlah_lolos: "",
      pengecek: "",
    });
    setPemotongList([]);
  };

  // ✅ helper ambil nama dari id
  const getNamaPemotong = (id: string) => {
    const found = pemotongData?.find((p: any) => p.id === id);
    return found?.nama || id;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!selectedProses) return;

    const kodeKain = form.kode_potongan.trim();
    const jumlahLolos = form.jumlah_lolos.trim();

    // reset error
    const newErrors = {
      kode_potongan: false,
      jumlah_lolos: false,
      pemotong: false,
    };

    let isValid = true;

    if (!kodeKain) {
      newErrors.kode_potongan = true;
      toast.error("Kode kain wajib diisi");
      isValid = false;
    }

    if (!jumlahLolos) {
      newErrors.jumlah_lolos = true;
      toast.error("Jumlah hasil wajib diisi");
      isValid = false;
    }

    if (pemotongList.length === 0) {
      newErrors.pemotong = true;
      toast.error("Minimal pilih 1 pemotong");
      isValid = false;
    }

    if (pemotongList.length > 2) {
      toast.error("Maksimal 2 pemotong");
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    const jumlahHasil = parseInt(jumlahLolos);

    if (isNaN(jumlahHasil)) {
      setErrors((prev) => ({ ...prev, jumlah_lolos: true }));
      toast.error("Jumlah hasil harus angka");
      return;
    }

    if (jumlahHasil <= 0) {
      setErrors((prev) => ({ ...prev, jumlah_lolos: true }));
      toast.error("Jumlah hasil harus lebih dari 0");
      return;
    }

    if (jumlahHasil > selectedProses.jumlahMinta) {
      setErrors((prev) => ({ ...prev, jumlah_lolos: true }));
      toast.error("Tidak boleh melebihi jumlah diminta");
      return;
    }

    const payload = {
      kodeKain: kodeKain,
      jumlahHasil: jumlahHasil,
      idPemotong: pemotongList,
    };

    console.log("PAYLOAD FINAL:", payload);

    mutateProses(
      {
        id: selectedProses.idPermintaan,
        data: payload,
      },
      {
        onSuccess: () => {
          toast.success("Berhasil dipindah ke selesai");
          handleCloseModal();
        },
        onError: (err: any) => {
          console.log("ERROR DETAIL:", err?.response?.data);
          toast.error("Gagal menyimpan");
        },
      },
    );
  };

  const [errors, setErrors] = useState({
    kode_potongan: false,
    jumlah_lolos: false,
    pemotong: false,
  });

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-center py-4">Loading...</p>
        ) : dataProses && dataProses.length > 0 ? (
          dataProses.map((proses: prosesType, index: number) => (
            <div
              key={`${proses.idPermintaan}-${index}`}
              onClick={() => handleSelectProses(proses)}
              className="border border-gray-300 rounded-2xl p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <div className="flex-row w-full justify-between align-middle items-center">
                {proses.isUrgent && (
                  <p className="text-red-500 text-sm uppercase font-semibold">
                    Urgent
                  </p>
                )}

                <p className="text-sm font-semibold text-gray-800 my-1">
                  {proses.namaBarang} - {proses.ukuran}
                </p>

                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    NAMA PRODUK :
                    <span className="font-bold text-gray-600">
                      {proses.namaBarang}
                    </span>
                  </p>

                  <p className="text-xs font-medium text-gray-400 uppercase">
                    UKURAN :
                    <span className="font-bold text-gray-600">
                      {proses.ukuran}
                    </span>
                  </p>

                  <p className="text-xs font-medium text-gray-400 uppercase">
                    JUMLAH DIMINTA :
                    <span className="font-bold text-gray-600">
                      {proses.jumlahMinta}
                    </span>
                  </p>

                  {proses.kodeKain && (
                    <p className="text-xs font-medium text-gray-400 uppercase">
                      KODE PRODUK :
                      <span className="font-bold text-gray-600">
                        {proses.kodeKain}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-800">
                  {proses.jumlahMinta}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Data Kosong</p>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedProses && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleCloseModal}
        >
          <form
            className="bg-white p-5 rounded-2xl w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {selectedProses.namaBarang} - {selectedProses.ukuran}
              </p>

              <p className="text-lg font-bold text-gray-900">
                {selectedProses.jumlahMinta}
              </p>
            </div>

            <div className="h-px bg-gray-200 mb-4" />

            <div className="space-y-3">
              <input
                value={form.kode_potongan}
                onChange={(e) => {
                  setForm({ ...form, kode_potongan: e.target.value });
                  setErrors((prev) => ({ ...prev, kode_potongan: false }));
                }}
                placeholder="Kode Kain"
                className={`w-full rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 
    ${
      errors.kode_potongan
        ? "bg-red-50 border border-red-500 focus:ring-red-400"
        : "bg-gray-100 focus:ring-orange-400"
    }`}
              />

              {/* PEMOTONG */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {pemotongList.map((id, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs"
                    >
                      {getNamaPemotong(id)}
                      <button
                        type="button"
                        onClick={() =>
                          setPemotongList((prev) =>
                            prev.filter((p) => p !== id),
                          )
                        }
                        className="text-red-500 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <select
                  value=""
                  onChange={(e) => {
                    const selectedId = e.target.value;

                    if (!selectedId) return;

                    if (pemotongList.includes(selectedId)) {
                      toast.error("Sudah dipilih");
                      return;
                    }

                    if (pemotongList.length >= 2) {
                      toast.error("Maksimal 2 pemotong");
                      return;
                    }

                    setPemotongList([...pemotongList, selectedId]);
                  }}
                  className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
                >
                  <option value="">Pilih Pemotong</option>
                  {pemotongData?.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
              </div>

              <input
                value={form.jumlah_lolos}
                onChange={(e) => {
                  setForm({ ...form, jumlah_lolos: e.target.value });
                  setErrors((prev) => ({ ...prev, jumlah_lolos: false }));
                }}
                placeholder="Jumlah hasil"
                className={`w-full rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 
    ${
      errors.jumlah_lolos
        ? "bg-red-50 border border-red-500 focus:ring-red-400"
        : "bg-gray-100 focus:ring-orange-400"
    }`}
              />
            </div>

            <div className="flex justify-end mt-5">
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-400 to-amber-500 text-white text-xs px-5 py-2 rounded-xl font-semibold shadow hover:opacity-90 active:scale-95 transition"
              >
                SELESAI
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
