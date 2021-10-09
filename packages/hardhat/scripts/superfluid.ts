// import SuperfluidSDK from "@superfluid-finance/js-sdk";
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
import { Web3Provider, InfuraProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import fetch from "node-fetch";
// import fetchActiveProposals from "../api";
// let privateKey = "";
// let privateKey =  ""
const GRAPHQL_URL = "https://hub.snapshot.org/graphql";
let provider = new InfuraProvider("goerli", {
  projectId: "9f3370d63f484b24a73fc28c6b487ee4"
});


function delay(ms:any) { 
  return new Promise( resolve => setTimeout(resolve, ms) );
}


let walletWithProvider = new ethers.Wallet(privateKey, provider);

class WalletSigner extends ethers.Wallet {
  getNetwork() {
    return  provider.getNetwork();
  }
}

const walletSigner_ = new WalletSigner(privateKey, provider);

// let web3walletSigner = new Web3Provider((provider as any));
// walletSigner["getNetwork"] = provider.getNetwork();
const sf = new SuperfluidSDK.Framework({
  ethers: walletSigner_,
});

let initProposals = [];

async function init() {
  initProposals = await fetchActiveProposals();
  console.log("initProposals.length -- ",initProposals.length);
}  

let activeProposals = []
async function loopFn() {
  activeProposals = await fetchActiveProposals();
    console.log("proposal" ,initProposals.length, activeProposals.length);

    if(initProposals.length < activeProposals.length){
      console.log("New active Proposal detected", activeProposals[0], activeProposals.length);
      testm(activeProposals[0], activeProposals.length);
      initProposals.push(activeProposals[0]);
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
  // console.log(currentProposal);
  let recipientaddresses = currentProposal["address"];
  let recipientshares = currentProposal["shares"];
  
  await project.createPool({ poolId: proposalId });
  for (let x = 0; x < recipientaddresses.length; x++){
    console.log(proposalId,  "0xeF3a1BFa81815e9aD8bd9A746f48188e56f9778E", recipientshares[x])
    await project.giveShares({
    poolId: proposalId,
    recipient: "0xeF3a1BFa81815e9aD8bd9A746f48188e56f9778E",
    shares: recipientshares[x],
  });
  }

  const detailsPostAction = await project.details();
  console.log("Project's - ", detailsPostAction);
}
catch(e){
  console.log(e)
}
}

async function setApproval(){
await sf.initialize();
const project = sf.user({
  address: "0x1d12f3Fef31A44b956b4bE28d8a7b8E855BB6593",
  token: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
});
const details = await project.details();

console.log("Project's - ", details);

await sf.ida.approveSubscription({
  superToken: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
  indexId: 17,
  publisher:"0x1d12f3Fef31A44b956b4bE28d8a7b8E855BB6593", // the publisher
  subscriber: "0xeF3a1BFa81815e9aD8bd9A746f48188e56f9778E" // who is receiving the units and sending this tx
});

}


async function distribute(){
  await sf.initialize();
  const project = sf.user({
    address: walletWithProvider.address,
    token: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
  });
  const details = await project.details();
  
  console.log("Project's - ", details);
  
  await project.distributeToPool({ poolId: 17, amount: 100 });

  }
  

  
async function claim(){
  await sf.initialize();
  
  await sf.ida.claim({
    superToken: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
    indexId: 16,
    publisher:"0x1d12f3Fef31A44b956b4bE28d8a7b8E855BB6593", // the publisher
    subscriber: "0xeF3a1BFa81815e9aD8bd9A746f48188e56f9778E", // who is receiving the units and sending this tx
    sender: "0x1d12f3Fef31A44b956b4bE28d8a7b8E855BB6593"
  });
  }
  

// init();
//  setInterval(async () => {
//   await loopFn()
//  },20000);



//FOR testing
//Change private key to sender
// testm({body: '{"address":["0x9EDb85517e6b54Fe9968F72D408B45661FA2252e"],"shares":[100]}'}, 17)
//Change private key to receiver
// setApproval();
//Change private key to sender
// distribute();


// claim(); //no need to call this but in case u forget to do setApproval()


async function fetchActiveProposals() {
  console.log("CALLED FETCH")
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
  proposals (
    first: 20,
    skip: 0,
    where: {
      space_in: ["chiliagon.eth"],
      state: "active"
    },
    orderBy: "created",
    orderDirection: desc
  ) {
    id
    title
    body
    choices
    start
    end
    snapshot
    state
    author
    space {
      id
      name
    }
  }
}
      `,
    }),
  });

  const responseBody = await response.json();
  let data = responseBody["data"]["proposals"];
  // console.log("fetch function called", data);
  console.log("fetch function finsihed");

  return data;
}
