import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { Web3Provider, InfuraProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import fetchactiveProposals from "../api"
let privateKey = "";
let wallet = new ethers.Wallet(privateKey);
let activeProposals = await fetchactiveProposals
console.log(activeProposals)
// Connect a wallet to mainnet
let provider = new InfuraProvider("goerli", {
  projectId: "9f3370d63f484b24a73fc28c6b487ee4",
  projectSecret: "842ae53c537e44d8bc22769c41d3cbd7"
});

let walletWithProvider = new ethers.Wallet(privateKey, provider);
const walletSigner = walletWithProvider.connect(provider);

const sf = new SuperfluidSDK.Framework({
    ethers: walletSigner
});

async function testm(){
  await sf.initialize();
  const project = sf.user({
    address: walletWithProvider.address,
    token: '0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00'
});
const details = await project.details();
console.log("Project's - ",details);

//Graphql queries and calls
  



//This is the IDA portion

let x=0;
let recipientaddresses[]=activeProposals["body"]["address"];
let recipientshares[]=activeProposals["body"]["percentages"];

await project.createPool({ poolId: 1 });
await project.giveShares({ poolId: 1, recipient: recipientaddresses[x], shares: recipientshares[x] });
x++;
await project.giveShares({ poolId: 1, recipient: recipientaddresses[x], shares: recipientshares[x] });

await project.distributeToPool({ poolId: 1, amount: 1000 });

const detailsPostAction = await project.details();
console.log("Project's - ",detailsPostAction);
}


testm();
