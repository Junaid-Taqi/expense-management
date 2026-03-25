import React from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/formatCurrency';

const ConvertedAmount = ({ amount, baseCode = 'USD' }) => {
  const { code, symbol, rates } = useSelector((state) => state.currency);
  
  // If baseCode is same as current display code, just format
  if (baseCode === code) {
    return <span>{formatCurrency(amount, symbol)}</span>;
  }

  // If we have rates, convert
  if (rates && rates[code]) {
    // Basic logic: amount / rate(base) * rate(target)
    // Since we fetch relative to baseCode in Header, we might just need amount * rates[code]
    // But to be safe, let's assume rates are relative to USD
    const usdAmount = baseCode === 'USD' ? amount : amount / (rates[baseCode] || 1);
    const converted = usdAmount * rates[code];
    
    return (
      <span title={`Original: ${formatCurrency(amount, baseCode)}`}>
        {formatCurrency(converted, symbol)}
      </span>
    );
  }

  // Fallback to original if rates not loaded
  return <span>{formatCurrency(amount, baseCode === 'USD' ? '$' : baseCode)}</span>;
};

export default ConvertedAmount;
