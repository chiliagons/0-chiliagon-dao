const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const { Web3Provider, InfuraProvider } = require("@ethersproject/providers");
const {ethers} = require("ethers");

let privateKey = "";
let wallet = new ethers.Wallet(privateKey);

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
  
const fetch = require("node-fetch");
const GRAPHQL_URL = "https://hub.snapshot.org/graphql";
async function fetchProposalData() {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: 
      query {
        proposal(id:"QmWbpCtwdLzxuLKnMW4Vv4MPFd2pdPX71YBKPasfZxqLUS") {
          id
          title
          body
          choices
          start
          end
          snapshot
          state
          author
          created
          plugins
          network
          strategies {
            name
            params
          }
          space {
            id
            name
          }
        }
      }
      ,
    }),
  });

  const responseBody = await response.json();
  console.log(responseBody);
  let addressdata = responseBody["data"]["body"];
  return addressdata;
}


//This is the IDA portion

let x=0;
let recipientaddresses[]=fetchProposalData()["body"]["address"];
let recipientshares[]=fetchProposalData()["body"]["percentages"];

await project.createPool({ poolId: 1 });
await project.giveShares({ poolId: 1, recipient: recipientaddresses[x], shares: recipientshares[x] });
x++;
await project.giveShares({ poolId: 1, recipient: recipientadresses[x], shares: recipientshares[x] });

await project.distributeToPool({ poolId: 1, amount: 1000 });

const detailsPostAction = await project.details();
console.log("Project's - ",detailsPostAction);
}


testm();
