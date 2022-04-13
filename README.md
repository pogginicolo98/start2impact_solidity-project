<h1 align="center">Start2Impact Solidity Project:<br>Echoes Of The Past</h1>

### Description:
Prototype of a fantasy themed NFT marketplace.  
This is a decentralized application through which NFTs can be minted and sold for the platform's token.  
Minting and sale are managed by smart contracts, while the metadata are saved via the IPFS protocol.

### Notes for use:
  * In order to interact with the dapp you must connect the **[Metamask](https://metamask.io/)** wallet and select the **Ropsten network**, in addition you will need some Ethers (**$rETH**) to be able to pay the gas fees. You can get **$rETH** for free via a **faucet**. (**[Dimensions](https://faucet.dimensions.network/)**, **[Egorfine](https://faucet.egorfine.com/)**, **[Ropsten faucet](https://ropsten.faucet.kr/)**)
  * You can get the platform token (**[$WISP](https://ropsten.etherscan.io/address/0xF5D0ae294Cd5a45A14d77E3f3d7c3beA2e19Ea43)**) for free via this **[faucet](http://13.38.213.148/welcome-chest)**.
  * The dapp recognizes only the NFTs of the **[TreasureNFT](https://ropsten.etherscan.io/address/0x7d8cA9EC5556a42b1B4F458a4DE1E7D10FA90F37)** smart contract. You can mint them from the appropriate form in the "**[Den](http://13.38.213.148/den)**" section.

### Disclaimer:
This project is for **illustrative** and **educational** purposes only, therefore some structural choices such as index sales management and the absence of a back-end or sub-graphs are **not intended as definitive and suitable solutions for a real use case**.

**Docs:** [Project presentation slides](https://github.com/pogginicolo98/start2impact_final-project/blob/f6252fbec2a5c0d103f4663f683b39d397eb60f8/docs/Project%20presentation.pdf)  
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

### Welcome chest
...

### Den
...

### Merchant
...

### NFT detail
...

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
	* Description: 213

### Front-end
...

### Storage
...

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
* ipfs
* nginx
