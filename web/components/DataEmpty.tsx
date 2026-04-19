import { Package } from "lucide-react";
import React from "react";

function DataEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
        <Package size={30} />
      </div>
      <p className="font-semibold text-gray-500 mb-1">Belum ada Jahitan</p>
      <p className="text-xs text-gray-400">Jahitan akan muncul di sini</p>
    </div>
  );
}

export default DataEmpty;
