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
  const example = sf.user({
    address: walletWithProvider.address,
    token: '0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00'
});
const details = await example.details();
console.log("example's - ",details);


//This is the IDA portion
await example.createPool({ poolId: 1 });
await example.giveShares({ poolId: 1, recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', shares: 90 });
await example.giveShares({ poolId: 1, recipient: '0xb57706887B3C29337BfA121D36b6987Eb5dce79f', shares: 10 });

await example.distributeToPool({ poolId: 1, amount: 1000 });

const detailsPostAction = await example.details();
console.log("example's - ",detailsPostAction);
}


testm();
