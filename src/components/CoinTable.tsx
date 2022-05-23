import { CoinDetailed } from '@/types';
import { numberWithAbbrev, numberWithCommas } from '@/utils/format';

export const CoinTable = ({
  coinsDetailed
}: {
  coinsDetailed: CoinDetailed[];
}) => {
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
        {coinsDetailed.map((coinDetailed: CoinDetailed, index: React.Key) => (
          <CoinTableRow key={index} coinDetailed={coinDetailed} />
        ))}
      </tbody>
    </table>
  );
};

export const CoinTableRow = ({
  coinDetailed
}: {
  coinDetailed: CoinDetailed;
}) => {
  return (
    <tr>
      <td className="px-2 text-lg first:pl-5 last:pr-5 py-2.5 whitespace-nowrap">
        <div className="flex items-center">
          <img className="inline-flex mr-3 h-8 w-8" src={coinDetailed.image} />
          <div className="text-sm text-slate-800 flex flex-col">
            <span className="font-semibold text-slate-800 inline-flex items-center gap-x-2">
              {coinDetailed.name}
            </span>
            <span className="text-xs text-slate-500">
              {coinDetailed.symbol.toUpperCase()}
            </span>
          </div>
        </div>
      </td>
      <td className="px-2 text-sm first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <span className="text-left font-medium">
          {coinDetailed.current_price
            ? '$' + numberWithCommas(coinDetailed.current_price)
            : '-'}
        </span>
      </td>
      <td className="px-2 text-sm first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <span className="text-left font-medium">
          {coinDetailed.price_change_percentage_24h
            ? coinDetailed.price_change_percentage_24h.toFixed(2) + '%'
            : '-'}
        </span>
      </td>
      <td className="px-2 text-sm first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <span className="text-left font-medium">
          {coinDetailed.total_volume
            ? '$' + numberWithCommas(coinDetailed.total_volume)
            : '-'}
        </span>
      </td>
      <td className="px-2 text-sm first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <span className="text-left font-medium">
          {coinDetailed.market_cap
            ? '$' + numberWithAbbrev(coinDetailed.market_cap)
            : '-'}
        </span>
      </td>
    </tr>
  );
};
