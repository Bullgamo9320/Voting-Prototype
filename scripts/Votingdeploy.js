const fs = require("fs");
const VotingAddress = require("../votingContract")

const main = async () => {

    // デプロイ
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(["Alice", "Bob", "Chris"]);
    await voting.deployed();

    console.log(`Contract deployed to: https://testnet-zkevm.polygonscan.com/address/${voting.address}`);

    //voteする
    let tx = await voting.vote([100,100,100]);
    await tx.wait();
    console.log("Voted");

    //コントラクトアドレスの書き出し
    fs.writeFileSync("./votingContract.js",
    `
    module.exports = "${voting.address}"
    `
    );

    fs.writeFileSync("./argument.js",
    `
    module.exports = [
        "[Alice,Bob,Chris]",
        "${VotingAddress}"
    ]
    `
    );
    //フロントエンドアプリが読み込む
    fs.writeFileSync("./contracts.js",
    `
    export const VotingAddress = "${VotingAddress}"
    `
    );
}

const votingDeploy = async () => {
    try{
        await main();
        process.exit(0);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};

votingDeploy();