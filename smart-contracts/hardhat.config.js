// Only requiring hardhat-waffle here because it depends on hardhat-ethers so adding both isn't necessary.
require("@nomiclabs/hardhat-waffle");
require('hardhat-docgen');
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 1337,  // Adaptation for development with Metamask
      mining: {
        auto: false,
        interval: 3000
      }
    },
    ropsten: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: false,
  },
  etherscan: {
    apiKey: {
        mainnet: `${ETHERSCAN_API_KEY}`,
        ropsten: `${ETHERSCAN_API_KEY}`,
        rinkeby: `${ETHERSCAN_API_KEY}`,
        goerli: `${ETHERSCAN_API_KEY}`,
        kovan: `${ETHERSCAN_API_KEY}`
    }
  }
};
