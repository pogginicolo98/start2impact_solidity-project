async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const _wispToken = await ethers.getContractFactory("WispToken");
  const initialSupply= ethers.utils.parseUnits("100000000000", 18);
  const wispToken = await _wispToken.deploy(initialSupply);

  console.log("WispToken contract address:", wispToken.address);

  const _treasureNFT = await ethers.getContractFactory("TreasureNFT");
  const treasureNFT = await _treasureNFT.deploy();

  console.log("TreasureNFT contract address:", treasureNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
