const API_URL = process.env.API_URL as string;

export const getRootGroups = async () => {
  try {
    const result = await fetch(`${API_URL}/catalog/root-groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // cache: 'no-store',
      next: { revalidate: 3600 },
    });

    const res = await result.json();

    if (res.code !== 200) throw new Error('Server not connect');

    return res.groups;
  } catch (e) {
    console.log('e.getRootGroups', e);
  }
};
