const fs = require("fs");
const memberNFTAddress = require("../memberNFTContract");

const main = async () => {
    const addr1 = "0x2A4b1236d83a32b50210af38dcd197C68d268E32";
    const addr2 = "0xEfe71738025080CAd119BCC0AbcF399c41c7bD55";
    const addr3 = "0xF154A4d12adE3F9fbaC19f83A37D6D688c223507";
    const addr4 = "0x16d2317edEB04f2B8126b55aA3d7fD0CcDFcbdCf";

    // デプロイ
    const VotingTester = await ethers.getContractFactory("VotingTester");
    const votingTester = await VotingTester.deploy(memberNFTAddress);
    await votingTester.deployed();

    console.log(`Contract deployed to: https://goerli.etherscan.io/address/${votingTester.address}`);

    let tx = await votingTester.vote([1,2,3]);
    await tx.wait();

    // フロントエンドアプリが読み込むcontracts.jsを生成
    fs.writeFileSync("./contracts.js",
    `
    export const memberNFTAddress = "${memberNFTAddress}"
    export const tokenBankAddress = "${tokenBank.address}"
    `
    );
}

const VotingTesterDeploy = async () => {
    try{
        await main();
        process.exit(0);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};

VotingTesterDeploy();