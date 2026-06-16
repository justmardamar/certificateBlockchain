import { ethers } from 'ethers'
import SeminarSertificate from '../../../SertificateBlockchain/artifacts/contracts/SeminarCertificate.sol/SeminarCertificate.json'

const contractAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'

export const getContract = () => {

    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const adminPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const signer = new ethers.Wallet(adminPrivateKey,provider)

    const contract = new ethers.Contract(contractAddress,SeminarSertificate.abi,signer)

    return contract
}