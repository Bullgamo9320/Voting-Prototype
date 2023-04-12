const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Votingコントラクト", function() {
    it("デプロイアドレスがownerに設定されるべき",async function(){
        const Arr = ["Alice", "Bob"]
        const [owner] = await ethers.getSigners();
        const Voting = await ethers.getContractFactory("Voting");
        const voting = await Voting.deploy(Arr);
        await voting.deployed();
        expect(await voting.owner()).to.equal(owner.address);
    });
})