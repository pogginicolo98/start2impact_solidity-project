// Only requiring hardhat-waffle here because it depends on hardhat-ethers so adding both isn't necessary.
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const { API_URL, PRIVATE_KEY } = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 1337  // Adaptation for development with Metamask
    },
    ropsten: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};