const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Votingコントラクト", function() {
    let Voting;
    let voting;
    const Arr = ["Alice", "Bob"];
    let owner;
    let addr1;

    beforeEach(async function() {
        [owner, addr1] = await ethers.getSigners();
        Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy(Arr);
        await voting.deployed();
        await voting.vote([1,4]);
    });


    it("デプロイアドレスがownerに設定されるべき",async function(){
        expect(await voting.owner()).to.equal(owner.address);
    });
    it("voteのたびにnumOfVotersが増えるべき", async function() {
        expect().to.equal(0);
    });
    it("owner以外は投票終了に失敗すべき", async function() {
        expect().to.equal(0);
    });
    it("ownerは他人の投票結果を見れるべき", async function() {
        expect().to.equal(0);
    });
    it("owner以外は他人の投票結果を見るのを失敗すべき", async function() {
        expect().to.equal(0);
    });
})