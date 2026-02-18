const API_URL = process.env.API_URL as string;

export const getProductsByGroup = async (id: string, page: number) => {
  try {
    const result = await fetch(
      `${API_URL}/catalog/groups/products?id=${id}&page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 },
        // next: { revalidate: 0 },
      },
    );

    const res = await result.json();

    if (res.code !== 200) throw new Error('Server not connect');

    return res;
  } catch (e) {
    console.log('e.getProductsByGroup', e);
    return null; // ✅ обязательно вернуть null
  }
};
