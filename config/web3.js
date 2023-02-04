const Web3 = require("web3");

const provider = new Web3.providers.HttpProvider(
  // "https://eth-goerli.g.alchemy.com/v2/gJhuRgINSTAxP8v_UqBA_43F3gu0GWT8"
  "https://goerli.infura.io/v3/7333078d0ffd48d1b5b89d7309bd29fc"
);
const web3 = new Web3(provider);
const { ACCOUNT_ADDRESS } = require('../utils/constants');
web3.eth.defaultAccount = ACCOUNT_ADDRESS;

module.exports = { web3 };
