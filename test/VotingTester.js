const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingTesterコントラクト", function() {
    let MemberNFT;
    let memberNFT;
    const tokenURI1 = "hoge1";
    const tokenURI2 = "hoge2";
    const tokenURI3 = "hoge3";
    const tokenURI4 = "hoge4";
    const tokenURI5 = "hoge5";

    let VotingTester;
    let votingTester;
    const name = "VotingTester";
    const symbol = "VT";
    let owner;
    let addr1;
    let addr2;
    let addr3;
});