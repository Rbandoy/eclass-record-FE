const apiUrl = process.env.ENVI === 'prod'
  ? process.env.BE_URL
  : process.env.BE_URL_DEV;

  console.log(apiUrl)

export default {
  apiUrl,
};