const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Votingコントラクト", function () {
  let Voting;
  let voting;
  const Arr = ["Alice", "Bob"];
  let owner;
  let signers;

  beforeEach(async function () {
    [owner, ...signers] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(Arr);
    await voting.deployed();

    // 100個のsignerに1 ETHずつ割り当てる
    const ethAmount = ethers.utils.parseEther("1");
    for (let i = 0; i < 50; i++) {
      const wallet = ethers.Wallet.createRandom();
      const signer = new ethers.Wallet(wallet.privateKey, ethers.provider);
      const address = await signer.getAddress();
      await owner.sendTransaction({
        to: address,
        value: ethAmount,
      });
      console.log(`ETH allocated to ${address}`);
      signers.push(signer);
    }
  });

  it("複数アドレスが投票して結果が正しく返されること", async function () {
    // テストの実行
    for (let i = 0; i < signers.length; i++) {
      const signer = signers[i];
      const address = await signer.getAddress();
      const transaction = await voting.connect(signer).vote([1, 1]);
      await transaction.wait();
      console.log(`Tx${i + 1}: ${address}`);
    }

    // 結果の取得
    const [names, mediansBigNumber, ranksBigNumber] = await voting.getResults();
    const medians = mediansBigNumber.map((num) => num.toNumber());
    const ranks = ranksBigNumber.map((num) => num.toNumber());

    // 結果の検証
    expect(names).to.deep.equal(["Alice", "Bob"]);
    expect(medians).to.deep.equal([1, 1]);
    expect(ranks).to.deep.equal([1, 1]);
  });
});
