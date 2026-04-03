const use_mock = true;

export const getData = async (url: string) => {
  if (use_mock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { id: 1, nama: "Jersey A", status: "menunggu" },
            { id: 2, nama: "Jersey B", status: "menunggu" },
            { id: 3, nama: "Jersey C", status: "menunggu" },
            { id: 4, nama: "Jersey D", status: "menunggu" },
            { id: 5, nama: "Jersey E", status: "menunggu" },
            { id: 6, nama: "Jersey F", status: "menunggu" },
            { id: 7, nama: "Hoodie G", status: "proses" },
            { id: 8, nama: "Hoodie H", status: "proses" },
            { id: 9, nama: "Hoodie I", status: "proses" },
            { id: 10, nama: "Hoodie J", status: "proses" },
            { id: 11, nama: "Kaos K", status: "selesai" },
          ],
        });
      }, 1000);
    });
  } else {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
};