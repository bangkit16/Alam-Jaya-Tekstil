import { Request } from "express";

/**
 * Helper 1: Mengambil parameter dari Request dan menyiapkan argumen untuk Prisma.
 * Menangani kasus jika user tidak mengirimkan query page/limit atau mengirimkan teks.
 */
export const getPagination = (req: Request) => {
  const rawPage = parseInt(req.query.page as string);
  const rawLimit = parseInt(req.query.limit as string);

  // Default: Page 1, Limit 10. Memastikan angka selalu positif > 0.
  const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = !isNaN(rawLimit) && rawLimit > 0 ? rawLimit : 10;

  return {
    // Gunakan spread ini di Prisma: ...pg
    prisma: {
      skip: (page - 1) * limit,
      take: limit,
    },
    page,
    limit,
  };
};

/**
 * Helper 2: Membungkus metadata untuk response API.
 * Format ini sangat ramah untuk Infinite Query (Mobile) dan Pagination (Web).
 */
export const wrapPagination = (
  totalData: number,
  page: number,
  limit: number,
) => {
  const totalPages = Math.ceil(totalData / limit);

  return {
    totalData,
    totalPages,
    currentPage: page,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};
