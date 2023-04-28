require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url:`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      //gasLimit: 3000000 ガスリミットの設定
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
};
