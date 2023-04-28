const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Votingコントラクト", function() {
    let Voting;
    let voting;
    const Arr = ["Alice", "Bob"];
    let owner;
    let signers;

    beforeEach(async function() {
        [owner, ...signers] = await ethers.getSigners();
        Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy(Arr);
        await voting.deployed();
    });

    it("複数アドレスが投票して結果が正しく返されること", async function() {
        for (let i = 0; i < signers.length; i++) {
            const signer = signers[i];
            const address = await signer.getAddress();
            const transaction = await voting.connect(signer).vote([1, 4]);
            await transaction.wait();
            console.log(`Tx${i + 1}: ${address}`);
        }

        // 結果の取得
        const [names, mediansBigNumber, ranksBigNumber] = await voting.getResults();
        const medians = mediansBigNumber.map(num => num.toNumber());
        const ranks = ranksBigNumber.map(num => num.toNumber());

        // 結果の検証
        expect(names).to.deep.equal(["Alice", "Bob"]);
        expect(medians).to.deep.equal([1, 4]);
        expect(ranks).to.deep.equal([2, 1]);
    });
});


///[owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11, addr12, addr13, addr14, addr15, addr16, addr17, addr18, addr19, addr20, addr21, addr22, addr23, addr24, addr25, addr26, addr27, addr28, addr29, addr30, addr31, addr32, addr33, addr34, addr35, addr36, addr37, addr38, addr39, addr40, addr41, addr42, addr43, addr44, addr45, addr46, addr47, addr48, addr49, addr50, addr51, addr52, addr53, addr54, addr55, addr56, addr57, addr58, addr59, addr60, addr61, addr62, addr63, addr64, addr65, addr66, addr67, addr68, addr69, addr70, addr71, addr72, addr73, addr74, addr75, addr76, addr77, addr78, addr79, addr80, addr81, addr82, addr83, addr84, addr85, addr86, addr87, addr88, addr89, addr90, addr91, addr92, addr93, addr94, addr95, addr96, addr97, addr98, addr99, addr100] = await ethers.getSigners();
        
