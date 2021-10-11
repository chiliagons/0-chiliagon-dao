// import SuperfluidSDK from "@superfluid-finance/js-sdk";
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
import { Web3Provider, InfuraProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
let privateKey =
  "";
// let privateKey =  ""
let provider = new InfuraProvider("goerli", {
  projectId: "9f3370d63f484b24a73fc28c6b487ee4",
});
let walletWithProvider = new ethers.Wallet(privateKey, provider);
class WalletSigner extends ethers.Wallet {
  getNetwork() {
    return provider.getNetwork();
  }
}
const walletSigner_ = new WalletSigner(privateKey, provider);
const sf = new SuperfluidSDK.Framework({
  ethers: walletSigner_,
});
async function distribute() {
  await sf.initialize();
  const project = sf.user({
    address: walletWithProvider.address,
    token: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
  });
  const details = await project.details();

  console.log("Project's - ", details);

  await project.distributeToPool({ poolId: 7, amount: 100 });
}

distribute();
