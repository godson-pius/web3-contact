import React from 'react'
import { ethers } from 'ethers'
import contactContract from './contactContract.json'

const contract = () => {
    const address = "0x40398617709fB1b11E855f07C515595B362dE206";

    if (window.ethereum) {
        const provider = ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(address, contactContract.output.abi, signer);

        return contract;
    }
}

const c = () => {
   console.log('dd')
}

export { c, contract }