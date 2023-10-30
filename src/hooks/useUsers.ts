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
