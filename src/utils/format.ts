export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

export const numberWithAbbrev = (number: number, decimals = 0): string => {
  if (number <= 999) return number.toFixed(decimals);

  if (number < 1000000) return (number / 1000).toFixed(decimals) + 'K';

  if (number < 1000000000) return (number / 1000000).toFixed(decimals) + 'M';

  return (number / 1000000000).toFixed(decimals) + 'B';
};
