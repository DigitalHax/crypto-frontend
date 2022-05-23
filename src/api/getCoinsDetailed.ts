import { useQuery } from 'react-query';

import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { axios } from '@/lib/axios';
import { CoinDetailed } from '@/types';

export const getCoinsDetailed = async (
  coinIds: string
): Promise<CoinDetailed[]> => {
  return axios.get('/coins/markets', {
    params: { vs_currency: 'aud', ids: coinIds }
  });
};

type QueryFnType = typeof getCoinsDetailed;

type UseCoinsDetailedOptions = {
  coinIds: string;
  config?: QueryConfig<QueryFnType>;
};

export const useCoinsDetailed = ({
  config,
  coinIds
}: UseCoinsDetailedOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['coins-detailed'],
    queryFn: () => getCoinsDetailed(coinIds),
    keepPreviousData: true
  });
};
