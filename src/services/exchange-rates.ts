export interface ExchangeRates {
  EUR: number;
  USD: number;
  timestamp: string;
}

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: {
    EUR?: number;
    USD?: number;
  };
}

const FRANKFURTER_API_URL = 'https://api.frankfurter.app';

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    const response = await fetch(`${FRANKFURTER_API_URL}/latest?from=RON&to=EUR,USD`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: FrankfurterResponse = await response.json();

    const eurRate = data.rates.EUR ? 1 / data.rates.EUR : 5.0;
    const usdRate = data.rates.USD ? 1 / data.rates.USD : 4.5;

    return {
      EUR: parseFloat(eurRate.toFixed(4)),
      USD: parseFloat(usdRate.toFixed(4)),
      timestamp: data.date,
    };
  } catch (error) {
    console.error('Error fetching exchange rates from Frankfurter:', error);
    return {
      EUR: 5.0,
      USD: 4.5,
      timestamp: new Date().toISOString().split('T')[0],
    };
  }
}

export function shouldUpdateRates(timestamp: string | null): boolean {
  if (!timestamp) return true;

  const lastUpdate = new Date(timestamp);
  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  return hoursSinceUpdate > 24;
}
