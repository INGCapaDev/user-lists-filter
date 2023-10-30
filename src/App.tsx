import { useMemo, useState } from 'react';
import './App.css';
import { UsersList } from './components/UsersList';
import { SortBy, type User } from './types.d';
import { useUsers } from './hooks/useUsers';
import Results from './components/Results';

function App() {
  const { fetchNextPage, hasNextPage, isError, isLoading, refetch, users } =
    useUsers();
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  //const originalUsers = useRef<User[]>([]);
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
    void refetch();
  };

  const handleDelete = (email: string) => {
    // const filteredUsers = users.filter((user) => user.email !== email);
    //setUsers(filteredUsers);
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

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

    const compareProperties: Record<string, (user: User) => unknown> = {
      [SortBy.COUNTRY]: (user) => user.location.country,
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last,
    };

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting] as (
        user: User
      ) => string;
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
      <Results />
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
        {isLoading && (
          <div>
            <strong>Cargando ...</strong>
          </div>
        )}
        {!isLoading && isError && <div>Hubo un error</div>}
        {!isLoading && !isError && users.length === 0 && (
          <div>No hay usuarios</div>
        )}

        {!isLoading && !isError && hasNextPage && (
          <button onClick={() => fetchNextPage()}>Cargar mas resultados</button>
        )}
      </main>
    </div>
  );
}

export default App;
