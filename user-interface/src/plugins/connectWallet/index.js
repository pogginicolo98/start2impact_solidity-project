import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from "ethers";
import Web3 from "web3";
import store from "../../store";

/**
 * Check chached provider and try to connect.
 * If provider exist => store into vuex
 */
setTimeout(async () => {
  if(window.ethereum?.isMetaMask) {
    const provider = await detectEthereumProvider();
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const web3Instance = new Web3(provider);
    store.commit("SET_WALLET", { address: null, provider, signer: null });

    if (accounts.length !== 0) {
      const signer = ethersProvider.getSigner(accounts[0]);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("disconnect", () => {
        localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
        window.location.reload();
      });

      const targetNetworkId = '0x3';
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      if (currentChainId != targetNetworkId){
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetNetworkId }],
          });
        window.location.reload();
      }

      store.commit("setWeb3Instance", web3Instance);
      store.commit("SET_WALLET", { address: accounts[0], provider, signer });
      store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);

    }
  } else {
    console.log("setTimeout else");
  }

  store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
});

export default {
  async install(Vue) {
    Vue.prototype.$connectWallet = async () => {
      console.log("Connect wallet");
      try {
        let address = "";
        const provider = await detectEthereumProvider();

        if (!provider) {
          return;
        }

        provider.enable();

        if (provider.isMetaMask) {
          address = provider.selectedAddress;
        }

        if (provider.accounts) {
          address = provider.accounts[0];
        }

        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner(address);
        const web3Instance = new Web3(provider);

        provider.on("chainChanged", () => {
          window.location.reload();
        });

        provider.on("accountsChanged", () => {
          window.location.reload();
        });

        provider.on("disconnect", () => {
          localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
          window.location.reload();
        });

        const targetNetworkId = '0x3';
        const currentChainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        if (currentChainId != targetNetworkId){
          await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: targetNetworkId }],
            });
          window.location.reload();
        }

        store.commit("setWeb3Instance", web3Instance);
        store.commit("SET_WALLET", {
          address: address,
          provider: provider,
          signer: signer,
        });

      } catch (error) {
        console.log("Error connecting wallet");
        console.log(error);
      }
    };
  },
};
