import { useQuery } from 'react-query';

import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { axios } from '@/lib/axios';
import { Coin } from '@/types';

export const getCoinList = async (): Promise<Coin[]> => {
  return axios.get('/coins/list');
};

type QueryFnType = typeof getCoinList;

type UseCoinListOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useCoinList = ({ config }: UseCoinListOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['coin-list'],
    queryFn: () => getCoinList()
  });
};
