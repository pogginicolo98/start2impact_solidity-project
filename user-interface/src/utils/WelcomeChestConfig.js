export default {
  contract: {
    name: "WelcomeChest",
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    abi: [
      {
        "inputs": [
          {
            "internalType": "contract WispToken",
            "name": "wispContract",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "TokensSent",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "amount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "beneficiary",
            "type": "address"
          }
        ],
        "name": "redeemTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "wisp",
        "outputs": [
          {
            "internalType": "contract WispToken",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
  }
};
