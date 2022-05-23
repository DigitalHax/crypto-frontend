import { useQuery } from 'react-query';

import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { axios } from '@/lib/axios';
import { CoinDetailed } from '@/types';

export const getCoinsInfo = async (
  coinIds: string
): Promise<CoinDetailed[]> => {
  return axios.get('/coins/markets', {
    params: { vs_currency: 'aud', ids: coinIds }
  });
};

type QueryFnType = typeof getCoinsInfo;

type UseCoinsInfoOptions = {
  coinIds: string;
  config?: QueryConfig<QueryFnType>;
};

export const useCoinsInfo = ({ config, coinIds }: UseCoinsInfoOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['coins-info'],
    queryFn: () => getCoinsInfo(coinIds),
    keepPreviousData: true
  });
};
