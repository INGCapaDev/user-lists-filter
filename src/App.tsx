import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { UsersList } from './components/UsersList';
import { SortBy, type User } from './types.d';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const originalUsers = useRef<User[]>([]);
  // useRef -> para guardar un valor
  // que queremos que se comparta entre renderizados
  // pero que al cambiar, no vuelva a renderizar el componente

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const toggleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSortingValue);
  };

  const handleReset = () => {
    setUsers(originalUsers.current);
  };

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email);
    setUsers(filteredUsers);
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(
      `https://randomuser.me/api?results=10&seed=ingcapadev&page=${currentPage}`
    )
      .then(async (res) => {
        // Manejo de errores en la peticion
        if (!res.ok) throw new Error('Hubo un error al obtener los usuarios');
        return await res.json();
      })
      .then((res) => {
        setUsers((prev) => {
          const newUsers = prev.concat(res.results);
          originalUsers.current = newUsers;
          return newUsers;
        });
      })
      .catch((err) => {
        // catch -> para captar errores
        setError(true);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const filteredUsers = useMemo(() => {
    console.log('calculate filteredUsers');
    return filterCountry != null && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    console.log('calculate sortedUsers');

    if (sorting === SortBy.NONE) return filteredUsers;

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: (user) => user.location.country,
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last,
    };

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredUsers, sorting]);

  // const filteredUsers = (() => {
  //   console.log('calculate filteredUsers')
  //   return filterCountry != null && filterCountry.length > 0
  //     ? users.filter(user => {
  //       return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
  //     })
  //     : users
  // })()

  // const sortedUsers = (() => {
  //   console.log('calculate sortedUsers')

  //   return sortByCountry
  //     ? filteredUsers.toSorted(
  //       (a, b) => a.location.country.localeCompare(b.location.country)
  //     )
  //     : filteredUsers
  // })()

  return (
    <div className='App'>
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={toggleColors}>Colorear files</button>

        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY
            ? 'No ordenar por país'
            : 'Ordenar por país'}
        </button>

        <button onClick={handleReset}>Resetear estado</button>

        <input
          placeholder='Filtra por país'
          onChange={(e) => {
            setFilterCountry(e.target.value);
          }}
        />
      </header>
      <main>
        {users.length > 0 && (
          <UsersList
            changeSorting={handleChangeSort}
            deleteUser={handleDelete}
            showColors={showColors}
            users={sortedUsers}
          />
        )}
        {loading && (
          <div>
            <strong>Cargando ...</strong>
          </div>
        )}
        {!loading && error && <div>Hubo un error</div>}
        {!loading && !error && users.length === 0 && <div>No hay usuarios</div>}

        {!loading && !error && (
          <button onClick={() => setCurrentPage((prev) => prev + 1)}>
            Cargar mas resultados
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
