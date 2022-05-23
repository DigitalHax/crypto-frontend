import { useCoinList } from '@/api/getCoinList';
import { useCoinsInfo } from '@/api/getCoinsInfo';
import { Coin, CoinInfo } from '@/types';
import { numberWithAbbrev, numberWithCommas } from '@/utils/format';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';
import { Pagination } from './Pagination';
import { SearchForm } from './SearchForm';

export const CryptosWidget = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleFilterChange(search);
  };

  const handleFilterChange = (value: string) => {
    setOffset(0);
    setPage(0);
    setFilter(value);
  };

  // Query the API, get list of all coins
  const coinsListQuery = useCoinList();

  // Display query error and loading states
  if (
    !coinsListQuery.data ||
    coinsListQuery.data.length == 0 ||
    coinsListQuery.isError ||
    coinsListQuery.isLoadingError
  )
    return <ErrorState />;

  if (coinsListQuery.isLoading) return <LoadingState />;

  return (
    <div className="bg-white rounded-md border border-slate-300 p-4">
      <div className="sm:flex flex-row sm:justify-between items-center mb-3">
        <h1 className="mb-4 text-xl font-bold">Crypto List</h1>

        <form className="inline-flex space-x-2 items-center">
          <SearchForm
            value={search}
            onChange={(value) => {
              setSearch(value);
              if (value == '') handleFilterChange('');
            }}
            placeholder="Search by name / symbol"
          />
          <button
            type="submit"
            className={clsx(
              'btn bg-indigo-500 text-white rounded-lg px-5 py-1.5 border border-slate-200 flex items-center'
            )}
            onClick={handleSubmit}
          >
            Search
          </button>
        </form>
      </div>
      <div>
        <CoinFilteringContainer
          offset={offset}
          filter={filter}
          allCoins={coinsListQuery.data}
          setTotalResults={setTotalResults}
        />
        <div className="px-5">
          <Pagination
            perPage={10}
            page={page}
            setPage={setPage}
            totalResults={totalResults}
            onChangeOffset={setOffset}
          />
        </div>
        <div className="text-center w-full text-slate-400 text-sm">
          Made with ❤️ by Jared Fernando
        </div>
      </div>
    </div>
  );
};

const CoinFilteringContainer = ({
  filter,
  allCoins,
  offset,
  setTotalResults
}: {
  filter: string;
  allCoins: Coin[];
  offset: number;
  setTotalResults: (value: number) => void;
}) => {
  // Filter by whether the symbol or name includes the search string
  const filterLowercase = filter.toLowerCase();
  let coinList =
    allCoins.filter((coin) => {
      if (!filter) return true;

      if (coin.symbol?.toLowerCase().includes(filterLowercase)) return true;
      if (coin.name?.toLowerCase().includes(filterLowercase)) return true;
    }) || [];

  setTotalResults(coinList.length);
  // Remove any exact matches from the coin list and put them first
  // Find exact matches
  const exactMatches = coinList.filter((coin) => {
    if (!filter) return false;

    if (coin.symbol?.toLowerCase() === filterLowercase) return true;
    if (coin.name?.toLowerCase() === filterLowercase) return true;
  });

  // Filter out the exact matches from the coin list
  const exactMatchIds = exactMatches.map((coin) => coin.id);
  if (exactMatchIds.length > 0) {
    coinList = coinList.filter((coin) => {
      return exactMatchIds.indexOf(coin.id) == -1;
    });
  }
  // Then join the exact matches list and coin list together.
  const displayCoins = exactMatches.concat(coinList).slice(offset, offset + 10);

  return (
    <CoinTable coinIdsString={displayCoins.map((coin) => coin.id).join(',')} />
  );
};

const CoinTable = ({ coinIdsString }: { coinIdsString: string }) => {
  // Query the API, get detailed info for the displayed coins
  const coinsInfoQuery = useCoinsInfo({
    coinIds: coinIdsString
  });

  // Refetch when the list changes
  useEffect(() => {
    coinsInfoQuery.refetch();
  }, [coinIdsString]);

  // Display query error and loading states
  if (coinsInfoQuery.isError || coinsInfoQuery.isLoadingError)
    return <ErrorState />;

  if (coinsInfoQuery.isFetching) {
    return <LoadingState />;
  }

  // Display empty state
  if (
    coinIdsString === '' ||
    !coinsInfoQuery.data ||
    coinsInfoQuery.data.length == 0
  ) {
    return (
      <div className="w-full text-center p-16 text-slate-500 text-sm">
        No results found. Try adjusting the filters.
      </div>
    );
  }

  return (
    <table className="table-auto w-full mb-px">
      <thead className="text-sm font-semibold uppercase text-slate-500 bg-slate-50 rounded-md">
        <tr>
          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
            <div className="font-semibold text-left">Coin</div>
          </th>
          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
            <div className="font-semibold text-left">Price (AUD)</div>
          </th>
          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
            <div className="font-semibold text-left">24h Change</div>
          </th>
          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
            <div className="font-semibold text-left">Volume</div>
          </th>
          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
            <div className="font-semibold text-left">Mkt Cap</div>
          </th>
        </tr>
      </thead>
      <tbody className="text-sm divide-y divide-slate-200">
        {coinsInfoQuery.data.map((coinInfo, index) => (
          <CoinTableRow key={index} coinInfo={coinInfo} />
        ))}
      </tbody>
    </table>
  );
};

const CoinTableRow = ({ coinInfo }: { coinInfo: CoinInfo }) => {
  return (
    <tr>
      <td className="px-2 text-lg first:pl-5 last:pr-5 py-2.5 whitespace-nowrap">
        <div className="flex items-center">
          <img className="inline-flex mr-3 h-8 w-8" src={coinInfo.image} />
          <div className="text-sm text-slate-800 flex flex-col">
            <span className="font-semibold text-slate-800 inline-flex items-center gap-x-2">
              {coinInfo.name}
            </span>
            <span className="text-xs text-slate-500">
              {coinInfo.symbol.toUpperCase()}
            </span>
          </div>
        </div>
      </td>
      <td className="px-2 text-sm first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <span className="text-left font-medium">
          {coinInfo.current_price
            ? '$' + numberWithCommas(coinInfo.current_price)
            : '-'}
        </span>
      </td>
      <td className="px-2 text-sm first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <span className="text-left font-medium">
          {coinInfo.price_change_percentage_24h
            ? coinInfo.price_change_percentage_24h.toFixed(2) + '%'
            : '-'}
        </span>
      </td>
      <td className="px-2 text-sm first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <span className="text-left font-medium">
          {coinInfo.total_volume
            ? '$' + numberWithCommas(coinInfo.total_volume)
            : '-'}
        </span>
      </td>
      <td className="px-2 text-sm first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <span className="text-left font-medium">
          {coinInfo.market_cap
            ? '$' + numberWithAbbrev(coinInfo.market_cap)
            : '-'}
        </span>
      </td>
    </tr>
  );
};
