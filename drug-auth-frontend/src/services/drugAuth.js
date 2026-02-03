import { ethers } from "ethers";
import abi from "../abi.json";

const CONTRACT_ADDRESS = "0x2E983A1Ba5e8b38AAAeC4B440B9dDcFBf72E15d1"; // paste your latest deployed address

export async function getDrugByHash(hash) {
  try {
    if (!window.ethereum) throw new Error("MetaMask not detected.");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

    const result = await contract.getDrugByHash(hash);

    return {
      nameDrug: result[0],
      batchNo: result[1],
      manufacturer: result[2],
      expiryDate: result[3],
      createdAt: Number(result[4]),
      createdBy: result[5],
    };
  } catch (err) {
    console.error("Error fetching drug:", err);
    throw err;
  }
}
