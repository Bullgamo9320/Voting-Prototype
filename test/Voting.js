const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Votingコントラクト", function() {
    let Voting;
    let voting;
    const Arr = ["Alice", "Bob"];
    let owner;

    beforeEach(async function() {
        [owner] = await ethers.getSigners();
        Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy(Arr);
        await voting.deployed();
    });

    it("デプロイアドレスがownerに設定されるべき",async function(){
        expect(await voting.owner()).to.equal(owner.address);
    });
})