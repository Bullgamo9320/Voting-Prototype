const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Votingコントラクト", function() {
    let Voting;
    let voting;
    
    /*
    const name = "MemberNFT";
    const symbol = "MEM";
    let owner;
    let addr1;
    */

    beforeEach(async function() {
        ///[owner, addr1] = await ethers.getSigners();
        Voting = await ethers.getContractFactory("Voting");
        voting = await voting.deploy();
        await voting.deployed();
    });
    
})