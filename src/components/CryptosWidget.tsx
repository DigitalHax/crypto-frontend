import { useCoinList } from '@/api/getCoinList';
import { useCoinsDetailed } from '@/api/getCoinsDetailed';
import { Coin } from '@/types';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { CoinTable } from './CoinTable';
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
    <CoinDetailsContainer
      coinIdsString={displayCoins.map((coin) => coin.id).join(',')}
    />
  );
};

const CoinDetailsContainer = ({ coinIdsString }: { coinIdsString: string }) => {
  // Query the API, get detailed info for the displayed coins
  const coinsDetailedQuery = useCoinsDetailed({
    coinIds: coinIdsString
  });

  // Refetch when the list changes
  useEffect(() => {
    coinsDetailedQuery.refetch();
  }, [coinIdsString]);

  // Display query error and loading states
  if (coinsDetailedQuery.isError || coinsDetailedQuery.isLoadingError)
    return <ErrorState />;

  if (coinsDetailedQuery.isFetching) {
    return <LoadingState />;
  }

  // Display empty state
  if (
    coinIdsString === '' ||
    !coinsDetailedQuery.data ||
    coinsDetailedQuery.data.length == 0
  ) {
    return (
      <div className="w-full text-center p-16 text-slate-500 text-sm">
        No results found. Try adjusting the filters.
      </div>
    );
  }
  return <CoinTable coinsDetailed={coinsDetailedQuery.data} />;
};
