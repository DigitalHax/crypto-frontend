import clsx from 'clsx';
import { useEffect, useState } from 'react';

export const Pagination = ({
  perPage,
  page,
  setPage,
  totalResults,
  onChangeOffset
}: {
  perPage: number;
  page: number;
  setPage: (value: number) => void;
  totalResults: number;
  onChangeOffset: (offset: number) => void;
}) => {
  const [indexes, setIndexes] = useState([1, Math.min(perPage, totalResults)]);

  useEffect(() => {
    const startIndex = 1 + page * perPage;
    const endIndex = Math.min(perPage * (page + 1), totalResults);

    setIndexes([startIndex, endIndex]);
    onChangeOffset(startIndex - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalResults, page]);

  const changePage = (direction: 1 | -1) => {
    if (direction == -1 && page == 0) return;
    if (direction == 1 && indexes[1] >= totalResults) return;

    const newPage = page + direction;
    setPage(newPage);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <nav
        className="mb-4 sm:mb-0 sm:order-1"
        role="navigation"
        aria-label="Navigation"
      >
        <ul className="flex justify-center">
          <li className="ml-3 first:ml-0">
            <button
              className={clsx(
                'btn bg-white rounded-lg px-5 py-2 border border-slate-200 flex items-center space-x-1',
                page == 0
                  ? 'cursor-not-allowed text-slate-300'
                  : 'text-indigo-500 hover:border-slate-300'
              )}
              onClick={() => changePage(-1)}
            >
              Previous
            </button>
          </li>
          <li className="ml-3 first:ml-0">
            <button
              className={clsx(
                'btn bg-white rounded-lg px-5 py-2 border border-slate-200 flex items-center',
                indexes[1] >= totalResults
                  ? 'cursor-not-allowed text-slate-300'
                  : 'text-indigo-500 hover:border-slate-300'
              )}
              onClick={() => changePage(1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      {totalResults >= 0 ? (
        <div className="text-sm text-slate-500 text-center sm:text-left">
          Showing{' '}
          <span className="font-medium text-slate-600">
            {totalResults ? indexes[0] : 0}
          </span>{' '}
          to <span className="font-medium text-slate-600">{indexes[1]}</span> of{' '}
          <span className="font-medium text-slate-600">
            {totalResults >= 10000 ? '10000+' : totalResults}
          </span>{' '}
          results
        </div>
      ) : (
        <span className="text-sm text-slate-300">Loading...</span>
      )}
    </div>
  );
};
