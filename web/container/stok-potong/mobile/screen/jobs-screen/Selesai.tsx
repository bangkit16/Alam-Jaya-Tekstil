// "use client";

// import { useGetPermintaan } from "@/services/potong/useGetPermintaan";
// import { useGetPermintaanSelesai } from "@/services/potong/useGetPermintaanSelesai";

// export default function Selesai() {
//   const { data, isLoading } = useGetPermintaanSelesai(); // 🔥 filter status

//   return (
//     <div className="flex flex-col gap-3 overflow-y-auto">
//       {isLoading ? (
//         <p className="text-center py-4">Loading...</p>
//       ) : data && data.length > 0 ? (
//         data.map((item: any, index: number) => (
//           <div
//             key={`${item.id_permintaan}-${index}`}
//             className="border border-gray-300 rounded-2xl p-4 flex justify-between items-center"
//           >
//             <div>
//               <p className="text-sm font-semibold text-gray-800">
//                 {item.nama_produk}
//               </p>
//               <p className="text-sm font-semibold text-gray-800">
//                 {item.jumlah}
//               </p>
//               <p className="text-sm font-semibold text-gray-800">
//                 {item.ukuran}
//               </p>
//             </div>
//             <p className="text-xl font-bold">{item.jumlah}</p>
//           </div>
//         ))
//       ) : (
//         <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
//           <p className="text-gray-500 font-medium">Data Selesai Kosong</p>
//         </div>
//       )}
//     </div>
//   );
// }
