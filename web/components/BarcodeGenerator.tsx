"use client";
import { useBarcode } from "next-barcode";

export default function BarcodeGenerator({ value } : { value: string }) {
  const { inputRef } = useBarcode({
    value: value,
    options: {
      displayValue: false, // Kita sembunyikan teks bawaan karena kamu sudah punya format teks sendiri
      height: 55, // Sesuaikan dengan h-12 (48px) container kamu
      width: 1.6,
      margin: 6,
      background: "transparent",
    },
  });

  return <svg ref={inputRef} className="max-w-full h-auto" />;
}
