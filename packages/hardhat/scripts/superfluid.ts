import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { Web3Provider, InfuraProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import fetchActiveProposals from "../api";
let privateKey = "b382bd608d9d07f17dbbea942c8657fd346e8f3cc0dbb9993a6461e96c44fd67";

let provider = new InfuraProvider("goerli", {
  projectId: "9f3370d63f484b24a73fc28c6b487ee4"
});


function delay(ms:any) { 
  return new Promise( resolve => setTimeout(resolve, ms) );
}

let web3walletSigner = new Web3Provider((provider as any));

let walletWithProvider = new ethers.Wallet(privateKey, provider);
let walletSigner = walletWithProvider.connect(provider);
// let web3walletSigner = new Web3Provider((provider as any));

const sf = new SuperfluidSDK.Framework({
  ethers: walletSigner,
});

let initProposals = [];

async function init() {
  let initProposals = await fetchActiveProposals;
  console.log(initProposals);
}  

async function loopFn() {
    let activeProposals = await fetchActiveProposals;
    console.log(initProposals.length, activeProposals.length);

    if(initProposals.length < activeProposals.length){
      console.log("New active Proposal detected", activeProposals[0], activeProposals.length);
      testm(activeProposals[0], activeProposals.length);
      initProposals = activeProposals;
    }
}


async function testm(activeProposal:any, proposalId:number) {
  await sf.initialize();
  const project = sf.user({
    address: walletWithProvider.address,
    token: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
  });
  const details = await project.details();
  console.log("Project's - ", details);

  //This is the IDA portion
  try{
  let currentProposal = JSON.parse(activeProposal["body"]);
  console.log(currentProposal);
  let recipientaddresses = currentProposal["address"];
  let recipientshares = currentProposal["shares"];
  
  await project.createPool({ poolId: proposalId });
  for (let x = 0; x < recipientaddresses.length; x++){
  await project.giveShares({
    poolId: proposalId,
    recipient: recipientaddresses[x],
    shares: recipientshares[x],
  });
  }
  await project.distributeToPool({ poolId: 1, amount: 1000 });

  const detailsPostAction = await project.details();
  console.log("Project's - ", detailsPostAction);
}
catch(e){
  console.log(e)
}
}
init();
setInterval(loopFn,60000);