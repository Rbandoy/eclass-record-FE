const axios = require('axios');
const cheerio = require('cheerio');

async function fetchStockData(url) {
  try {
    const { data } = await axios.get(url);
    return parseStockData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function parseStockData(html) {
  const $ = cheerio.load(html);
  const stockData = [];

  // Assuming the data is in a table
  $('table tr').each((index, element) => {
    const row = $(element).find('td');
    if (row.length) {
      const date = $(row[0]).text();
      const open = parseFloat($(row[1]).text());
      const high = parseFloat($(row[2]).text());
      const low = parseFloat($(row[3]).text());
      const close = parseFloat($(row[4]).text());
      stockData.push({ date, open, high, low, close });
    }
  });

  return stockData;
}

function analyzeStockData(stockData) {
  const recentData = stockData.slice(-10); // Last 10 days for analysis
  const supportLevel = Math.min(...recentData.map(d => d.low));
  const resistanceLevel = Math.max(...recentData.map(d => d.high));

  // Determine trend
  const trend = recentData[recentData.length - 1].close > recentData[0].close ? 'upward' : 'downward';

  return {
    supportLevel,
    resistanceLevel,
    trend
  };
}

(async () => {
  const url = 'https://svr2.colfinancial.com/ape/FINAL2_STARTER/chart_apple/OHLC_ALL_D_STOCK.asp?period=2&tme=0&stock=DITO';
  const stockData = await fetchStockData(url);
  const analysis = analyzeStockData(stockData);
  console.log('Technical Analysis:', analysis);
})();
