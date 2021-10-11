// import SuperfluidSDK from "@superfluid-finance/js-sdk";
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
import { Web3Provider, InfuraProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import fetch from "node-fetch";
// import fetchActiveProposals from "../api";
let privateKey =
  "";
const GRAPHQL_URL = "https://hub.snapshot.org/graphql";
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

// let web3walletSigner = new Web3Provider((provider as any));
// walletSigner["getNetwork"] = provider.getNetwork();
const sf = new SuperfluidSDK.Framework({
  ethers: walletSigner_,
});

let initProposals = [];

async function init() {
  initProposals = await fetchActiveProposals();
  console.log("initProposals.length -- ", initProposals.length);
}

let activeProposals = [];
async function loopFn() {
  activeProposals = await fetchActiveProposals();
  console.log("proposal", initProposals.length, activeProposals.length);

  if (initProposals.length < activeProposals.length) {
    console.log(
      "New active Proposal detected",
      activeProposals[0],
      activeProposals.length
    );
    testm(activeProposals[0], activeProposals.length);
    initProposals.push(activeProposals[0]);
  }
}

async function testm(activeProposal: any, proposalId: number) {
  await sf.initialize();
  const project = sf.user({
    address: walletWithProvider.address,
    token: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
  });
  const details = await project.details();
  console.log("Project's - ", details);

  //This is the IDA portion
  try {
    let currentProposal = JSON.parse(activeProposal["body"]);
    // console.log(currentProposal);
    let recipientaddresses = currentProposal["address"];
    let recipientshares = currentProposal["shares"];

    await project.createPool({ poolId: proposalId });
    for (let x = 0; x < recipientaddresses.length; x++) {
      console.log(proposalId, recipientaddresses[x], recipientshares[x]);
      await project.giveShares({
        poolId: proposalId,
        recipient: recipientaddresses[x],
        shares: recipientshares[x],
      });
    }

    const detailsPostAction = await project.details();
    console.log("Project's - ", detailsPostAction);
  } catch (e) {
    console.log(e);
  }
}

init();
setInterval(async () => {
  await loopFn();
}, 20000);
async function fetchActiveProposals() {
  console.log("CALLED FETCH");
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
