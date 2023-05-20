const main = async() => {
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(["PJ1","PJ2", "PJ3", "PJ4", "PJ5", "PJ6", "PJ7", "PJ8", "PJ9", "PJ10", "PJ11"]);
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
