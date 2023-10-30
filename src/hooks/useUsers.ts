import { fetchUsers } from '../services/users';

import { useInfiniteQuery } from '@tanstack/react-query';

export const useUsers = () => {
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['users'],
      queryFn: ({ pageParam }) => fetchUsers(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    });

  return {
    isLoading,
    isError,
    users: data?.pages.flatMap((page) => page?.users) ?? [],
    refetch,
    fetchNextPage,
    hasNextPage,
  };
};
