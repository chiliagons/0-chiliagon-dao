// import SuperfluidSDK from "@superfluid-finance/js-sdk";
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
import { Web3Provider, InfuraProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
let privateKey =
  "";
let provider = new InfuraProvider("goerli", {
  projectId: "9f3370d63f484b24a73fc28c6b487ee4",
});
class WalletSigner extends ethers.Wallet {
  getNetwork() {
    return provider.getNetwork();
  }
}
const walletSigner_ = new WalletSigner(privateKey, provider);
const sf = new SuperfluidSDK.Framework({
  ethers: walletSigner_,
});
async function setApproval() {
  await sf.initialize();
  const project = sf.user({
    address: "0x9EDb85517e6b54Fe9968F72D408B45661FA2252e",
    token: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
  });
  const details = await project.details();
  console.log("Project's - ", details);
  await sf.ida.approveSubscription({
    superToken: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
    indexId: 8,
    publisher: "0x9EDb85517e6b54Fe9968F72D408B45661FA2252e", // the publisher
    subscriber: "0x6E9ad3b1815484D6C00D924d867364296c52B310", // who is receiving the units and sending this tx
  });
}

setApproval();
