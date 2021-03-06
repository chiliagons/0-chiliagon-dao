import "dotenv/config";

import '@typechain/hardhat';
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-abi-exporter";
import { HardhatUserConfig, task } from "hardhat/config";
import { removeConsoleLog } from "hardhat-preprocessor";
import "solidity-coverage";

const accounts = {
  mnemonic:
    process.env.MNEMONIC ||
    "test test test test test test test test test test test test",
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: "0.8.3",
  paths: {
    artifacts: "../frontend/artifacts",
  },
  networks: {
    localhost: {
      url: "http://localhost:8545",
      /*
        notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      */
    },
    hardhat: {
      // Seems to be a bug with this, even when false it complains about being unauthenticated.
      // Reported to HardHat team and fix is incoming
      forking: {
        enabled: true,
        url: `https://eth-kovan.alchemyapi.io/v2/HI8npM_DUD5_7FM24hWts9cN_73kDRg3`,
        blockNumber: 27534667,
      },
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/${process.env.INFURA_API_KEY}", 
      accounts,
    },
    kovan: {
      url: "https://eth-kovan.alchemyapi.io/v2/HI8npM_DUD5_7FM24hWts9cN_73kDRg3",
      accounts,
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}", 
      accounts,
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}", 
      accounts,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}", 
      accounts,
    },
    xdai: {
      url: 'https://rpc.xdaichain.com/',
      gasPrice: 1000000000,
      accounts,
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      gasPrice: 1000000000,
      accounts,
    },
  },
  preprocess: {
    eachLine: removeConsoleLog(
      (bre) =>
        bre.network.name !== "hardhat" && bre.network.name !== "localhost"
    ),
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_KEY
  },
  typechain: {
    outDir: "../frontend/types/typechain",
  },
};

export default config;
