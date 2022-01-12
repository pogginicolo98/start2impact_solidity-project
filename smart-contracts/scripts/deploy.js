async function main() {
  /*
    Deployment script for the following contracts:
    1) WispToken.sol
    2) TreasureNFT.sol
    3) WelcomeChest.sol
    4) Merchant.sol
  */

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // WispToken.sol
  const _wispToken = await ethers.getContractFactory("WispToken");
  const initialSupply= ethers.utils.parseUnits("100000000000", 18);
  const wispToken = await _wispToken.deploy(initialSupply);
  console.log("WispToken contract address:", wispToken.address);

  // TreasureNFT.sol
  const _treasureNFT = await ethers.getContractFactory("TreasureNFT");
  const treasureNFT = await _treasureNFT.deploy();
  console.log("TreasureNFT contract address:", treasureNFT.address);

  // WelcomeChest.sol
  const _welcomeChest = await ethers.getContractFactory("WelcomeChest");
  const welcomeChest = await _welcomeChest.deploy(wispToken.address);
  console.log("WelcomeChest contract address:", welcomeChest.address);

  // Merchant.sol
  const _merchant = await ethers.getContractFactory("Merchant");
  const merchant = await _merchant.deploy(wispToken.address, treasureNFT.address);
  console.log("Merchant contract address:", merchant.address);

  const amount = ethers.utils.parseUnits("100000", 18);
  await wispToken.transfer(welcomeChest.address, amount);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
