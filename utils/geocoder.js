const NodeGeoCoder = require('node-geocoder');

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;

//https://developer.mapquest.com/user/me/apps
// userid : arindam-dev (arindampaul411@gmail.com)
// Password : Email Password