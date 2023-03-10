const main = async() => {
    Voting = await ethers.getContractFactory("Voting");
    voting = await voting.deploy();
    await voting.deployed();

    console.log(`Contract deployed to: ${voting.address}`);
}

const deploy = async () => {
    try{
        await main();
        process.exit(0);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};

deploy();