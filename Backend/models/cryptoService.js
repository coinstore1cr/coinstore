// cryptoService.js
import axios from 'axios';

const getBTCPrice = async () => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    return parseFloat(response.data.price);
  } catch (error) {
    console.error('Failed to fetch BTC price:', error);
    throw new Error('Failed to fetch BTC price');
  }
};

export default getBTCPrice;