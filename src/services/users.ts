export const fetchUsers = async (pageParam = 1) => {
  return await fetch(
    `https://randomuser.me/api?results=10&seed=ingcapadev&page=${pageParam}`
  )
    .then(async (res) => {
      // Manejo de errores en la peticion
      if (!res.ok) throw new Error('Hubo un error al obtener los usuarios');
      return await res.json();
    })
    .then((res) => {
      const currentPage = Number(res.info.page);
      const nextCursor = currentPage > 3 ? undefined : currentPage + 1;
      return { users: res.results, nextCursor };
    });
};
