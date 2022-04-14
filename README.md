<h1 align="center">Start2Impact Solidity Project:<br>Echoes Of The Past</h1>

### Description:
Prototype of a fantasy themed **NFT marketplace**.  
This is a decentralized application through which NFTs can be **minted** and **sold** for the platform's **token**.  
Minting and sale are managed by **smart contracts**, while the metadata are saved via the **IPFS protocol**.

### Notes for use:
  * In order to interact with the dapp you must connect the **[Metamask](https://metamask.io/)** wallet and select the **Ropsten network**, in addition you will need some Ethers (**$rETH**) to be able to pay the gas fees. You can get **$rETH** for free via a **faucet**. (**[Dimensions](https://faucet.dimensions.network/)**, **[Egorfine](https://faucet.egorfine.com/)**, **[Ropsten faucet](https://ropsten.faucet.kr/)**)
  * You can get the platform token (**[$WISP](https://ropsten.etherscan.io/address/0xF5D0ae294Cd5a45A14d77E3f3d7c3beA2e19Ea43)**) for free via this **[faucet](http://13.38.213.148/welcome-chest)**.
  * The dapp recognizes only the NFTs of the **[TreasureNFT](https://ropsten.etherscan.io/address/0x7d8cA9EC5556a42b1B4F458a4DE1E7D10FA90F37)** smart contract. You can mint them from the appropriate form in the "**[Den](http://13.38.213.148/den)**" section.

### Disclaimer:
This project is for **illustrative** and **educational** purposes only, therefore some structural choices such as index sales management and the absence of a back-end or sub-graphs are **not intended as definitive and suitable solutions for a real use case**.

**Docs:** [Project presentation slides](https://github.com/pogginicolo98/start2impact_solidity-project/blob/7caf956b74110d6051b6c93aeed769530ed981d6/docs/start2impact_solidity-project%20presentation.pdf)  
**Live demo:** [Echoes Of The Past](http://13.38.213.148/)

***

# Index
1. [User interface](#User-interface)
	1. [Welcome chest](#Welcome-chest)
	2. [Den](#Den)
	3. [Merchant](#Merchant)
	4. [NFT detail](#NFT-detail)
2. [Components and technologies](#Components-and-technologies)
	1. [Smart contracts](#Smart-contracts)
	2. [Front-end](#Front-end)
	3. [Storage](#Databases)
3. [Deploy in production](#Deploy-in-production)
	1. [Setup](#Setup)
	2. [IPFS](#IPFS)
	3. [Nginx](#Nginx)
	4. [Reboot](#Reboot)
	5. [Debugging](#Debugging)

***

# User interface
The interface is very similar to a common NFT marketplace but with a **customized user experience**. This means that the classic **minting** and **trading** operations are contextualized in a **fantasy** world, where NFTs are simple items to ***craft*** and the sale is brokered by a ***merchant***.  
To facilitate testing, there is a form to request some platform's tokens for free.

### Welcome chest
`/welcome-chest`  
This page is the equivalent of a faucet where you can request free tokens (**$WISP**) in order to interact with the platform without friction.

### Den
`/den`  
This page is similar to a ***profile*** page. The ***Den*** is divided into three sections:
* **Craft new items**  
	In this section you can mint new NFTs, the metadata will be saved via IPFS and associated with the token that is being minted.
* **Your items available**  
	Shown here are your NFTs that are not for sale and available for transfer or sale.
* **Your items for sale**  
	Shown here are your NFTs which are blocked by the **[Merchant](https://ropsten.etherscan.io/address/0x480E600AAA113706d3470A206A138E61dcd7a394)** smart contract for sale.

### Merchant
`/merchant`  
This is the main page, all NFTs for sale are listed here. By clicking on one of them you will be redirected to the dedicated page in order to see the detailed information of the selected NFT and possibly proceed with the purchase.

### NFT detail
`/merchant/<TOKEN_ID>`  
This page shows the complete details of the NFT, if it is yours you can decide to put it on sale or withdraw it if it is already, otherwise if it is not yours and it is for sale you can proceed with the purchase. In addition to these operations, you can consult the description and additional information such as the ID of the token, the standard and the address of the contract that issued it.

***

# Components and technologies

### Smart contracts
The dapp is made up of 4 main smart contracts:

1. **[WispToken](https://ropsten.etherscan.io/address/0xF5D0ae294Cd5a45A14d77E3f3d7c3beA2e19Ea43)**  
	* Standard: **ERC-20**  
	* Description: Token contract that keeps track of the token of the platform, made with [Openzeppelin](https://docs.openzeppelin.com/contracts/4.x/erc20) libraries.
2. **[TreasureNFT](https://ropsten.etherscan.io/address/0x7d8cA9EC5556a42b1B4F458a4DE1E7D10FA90F37)**  
	* Standard: **ERC-721**  
	* Description: NFT contract that keeps track and manage the NFTs of the platform, made with [Openzeppelin](https://docs.openzeppelin.com/contracts/4.x/erc721) libraries.
3. **[WelcomeChest](https://ropsten.etherscan.io/address/0x4A057427E66A3469cDcB626B1df2328759303D83)**  
	* Standard: **None**  
	* Description: Faucet contract that transfers some $WISP from its account to the account provided.
4. **[Merchant](https://ropsten.etherscan.io/address/0x480E600AAA113706d3470A206A138E61dcd7a394)**  
	* Standard: **None**  
	* Description: Contract that manages the sale of NFTs. Users can list NFTs by setting the price in WISP. Once the sales order is created, the smart contract blocks the NFT until the order is executed or canceled. If the order is executed the NFT for sale will be transferred to the buyer and the sum in WISP will be transferred to the seller.

### Front-end
* [Vue.js (2.6)](https://github.com/vuejs/vue#readme) - Core
* [Vue router (3.5)](https://github.com/vuejs/vue-router#readme) - Page routing
* [Vuex (3.6)](https://github.com/vuejs/vuex#readme) - State management
* [Bootstrap (5.1)](https://getbootstrap.com/) - Style
* [Web3.js (1.7)](https://github.com/ChainSafe/web3.js#readme) - Ethereum interface
* [Detect provider (1.2)](https://github.com/MetaMask/detect-provider#readme) - Wallet management
* [IPFS HTTP client (55.0)](https://www.npmjs.com/package/ipfs-http-client) - Decentralized storage

### Storage
The server hosting the webapp also provide an [IPFS](https://ipfs.io/) node to allow users to upload and request metadata and resources quickly.  
The node is publicly accessible at the following routes:
* `/api/v0/add` - Resource upload
* `/ipfs` - Resource request

***

# Deploy in production

### Setup
Clone the repository and install the required packages:
```
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install net-tools nginx
$ git clone https://github.com/pogginicolo98/start2impact_solidity-project.git
```

### IPFS
Download and init IPFS:
```
$ mkdir ipfs-node
ipfs-node$ wget https://dist.ipfs.io/go-ipfs/v0.12.0/go-ipfs_v0.12.0_linux-amd64.tar.gz
ipfs-node$ tar -xvzf go-ipfs_v0.12.0_linux-amd64.tar.gz
ipfs-node$ sudo bash go-ipfs/install.sh
$ ipfs init --profile server
$ sudo systemctl daemon-reload
$ sudo systemctl enable ipfs
$ sudo systemctl start ipfs
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
$ sudo systemctl restart ipfs
```
Check that the service is running correctly:
```
$ sudo systemctl status ipfs
```

### Nginx
Configure Nginx to Proxy Pass to IPFS and serve the vue.js app. It helps to protect the website from attackers.\
Update `/etc/nginx/nginx.conf` Nginx config file in order to upload large files (images in that case)
```
http{
	...
	client_max_body_size 100M; 
}
```
Open `start2impact_solidity-project/setup/PROJECT_NAME` and replace placeholders with production data.\
Then add the website configuration:
```
start2impact_solidity-project$ sudo cp setup/PROJECT_NAME /etc/nginx/sites-available/echoes_of_the_past
$ sudo ln -s /etc/nginx/sites-available/echoes_of_the_past /etc/nginx/sites-enabled/
$ sudo nginx -t
$ sudo systemctl restart nginx
$ sudo systemctl enable nginx
```
Check that the service is running correctly:
```
$ sudo systemctl status nginx
```

### Reboot
If everythings is running correctly reboot the system and then the web-app should be available at the address of the server: `$ sudo reboot`

### Debugging
List of commands useful for debugging possible errors:\
`$ sudo journalctl -u <service>`: Service logs\
`$ sudo systemctl status <service>`: Service status

**Services**
* `ipfs`
* `nginx`
