export const formatCurrency = (amount, symbol) => {
  const numberAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numberAmount)) return `${symbol} 0.00`;

  const formattedAmount = numberAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${symbol}${formattedAmount}`;
};
