// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract } from 'ethers';
import { config, ethers } from 'hardhat';
import * as hre from 'hardhat';
import fs from 'fs';

const ComptrollerAddress  = "0x3466c815247594dfd5b4b285f7a388081a5d5dc1";
const WETHAddress  = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // fs.unlinkSync(`${config.paths.artifacts}/contracts/contractAddress.ts`);
  const Token = await ethers.getContractFactory("ERC20");
  let weth = await Token.attach(WETHAddress);


  const MTK = await ethers.getContractFactory('MTK');
  const cMTK = await MTK.deploy();
  await cMTK.deployed();


  // We get the contract to deploy
  const EnzymeVaultManager = await ethers.getContractFactory('EnzymeVaultManager');
  const enzymeVaultManager = await EnzymeVaultManager.deploy(ComptrollerAddress, WETHAddress);
  await enzymeVaultManager.deployed();
  console.log('YourContract deployed to:', enzymeVaultManager.address);

  // await delay(1000);
  // let bal =  await cMTK.balanceOf("0xeF3a1BFa81815e9aD8bd9A746f48188e56f9778E")
  // console.log(bal.toString())
  
  // await cMTK.transfer(enzymeVaultManager.address, ethers.utils.parseUnits("1"))
  // // await cMTK.approve(enzymeVaultManager.address, ethers.utils.parseUnits("1"))
  // await enzymeVaultManager.setApproval("0x7BF0C0259DA2db1Cc9A484945722221c5B800139", ethers.utils.parseUnits("1"))
  // let allowance =  await cMTK.allowance(enzymeVaultManager.address,"0x7BF0C0259DA2db1Cc9A484945722221c5B800139")
  // console.log("allowance----",allowance.toString())
  // console.log("Approval set")
  // await cMTK.transferFrom(enzymeVaultManager.address,"0x7BF0C0259DA2db1Cc9A484945722221c5B800139", ethers.utils.parseUnits("0.01"))  
  // let balcMTK =  await cMTK.balanceOf("0x7BF0C0259DA2db1Cc9A484945722221c5B800139")
  // console.log(balcMTK.toString())
  // await enzymeVaultManager.depositFunds(ethers.utils.parseUnits("0.0001"));

  // // saveFrontendFiles(contract, "YourContract");
  console.log('YourContract deployed to:', enzymeVaultManager.address);
  return {
    'enzymeVaultManager':enzymeVaultManager.address,
  };
}

// https://github.com/nomiclabs/hardhat-hackathon-boilerplate/blob/master/scripts/deploy.js
function saveFrontendFiles(contract: Contract, contractName: string) {
  fs.appendFileSync(
    `${config.paths.artifacts}/contracts/contractAddress.ts`,
    `export const ${contractName} = '${contract.address}'\n`
  );
}

async function verify(contractAddress:any,...args:any) {
  console.log("verifying", contractAddress, ...args);
  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [
      ...args
    ],
  });
}

function delay(ms:any) { 
  return new Promise( resolve => setTimeout(resolve, ms) );
}
main()
.then( async (deployedData) => {
  await delay(50000);
   await verify(deployedData.enzymeVaultManager, ComptrollerAddress, WETHAddress); 
    process.exit(0)
})
.catch(error => {
  console.error(error);
  process.exit(1);
});
