import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import "@nomiclabs/hardhat-etherscan";
import '@typechain/hardhat';
import { task } from 'hardhat/config';
import { HardhatUserConfig } from 'hardhat/types';

const accounts = {
  mnemonic:
    process.env.MNEMONIC ||
    "test test test test test test test test test test test test",
};
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: '0.8.3',
  paths: {
    artifacts: '../frontend/artifacts',
  },
  networks: {
    hardhat: {
      // Seems to be a bug with this, even when false it complains about being unauthenticated.
      // Reported to HardHat team and fix is incoming
      forking: {
        enabled: true,
        url: `https://eth-kovan.alchemyapi.io/v2/HI8npM_DUD5_7FM24hWts9cN_73kDRg3`,
        blockNumber: 27534667
      }
    },
    kovan: {
      url: "https://eth-kovan.alchemyapi.io/v2/HI8npM_DUD5_7FM24hWts9cN_73kDRg3", 
      accounts,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_KEY
  },
  typechain: {
    outDir: '../frontend/types/typechain',
  },
};

export default config;
