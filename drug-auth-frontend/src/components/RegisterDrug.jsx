import { useState } from "react";
import CryptoJS from "crypto-js";
import { QRCodeCanvas } from "qrcode.react";
import { ethers } from "ethers";
import abi from "../abi.json";

// 🔴 Replace this with the NEW address from your latest deploy
const CONTRACT_ADDRESS = "0x2E983A1Ba5e8b38AAAeC4B440B9dDcFBf72E15d1";

export default function RegisterDrug() {
  const [form, setForm] = useState({
    nameDrug: "",
    batchNo: "",
    manufacturer: "",
    expiryDate: "",
  });

  const [hash, setHash] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setTxHash("");
    setLoading(true);

    try {
      const { nameDrug, batchNo, manufacturer, expiryDate } = form;

      if (!nameDrug || !batchNo || !manufacturer || !expiryDate) {
        setErrorMsg("Please fill all fields.");
        setLoading(false);
        return;
      }

      // 1️⃣ Create hash from drug data (off-chain integrity)
      const rowString = `${nameDrug},${batchNo},${manufacturer},${expiryDate}`;
      const hashValue = CryptoJS.SHA256(rowString).toString();
      setHash(hashValue);

      if (!window.ethereum) {
        setErrorMsg("MetaMask not detected. Please install MetaMask.");
        setLoading(false);
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      // 2️⃣ Call registerDrug(_hash, _nameDrug, _batchNo, _manufacturer, _expiryDate)
      const tx = await contract.registerDrug(
        hashValue,
        nameDrug,
        batchNo,
        manufacturer,
        expiryDate
      );

      const receipt = await tx.wait();
      setTxHash(receipt.hash);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.reason || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-blue-700">
        Register Drug & Generate QR
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="nameDrug"
          placeholder="Drug Name"
          value={form.nameDrug}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="batchNo"
          placeholder="Batch Number"
          value={form.batchNo}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="manufacturer"
          placeholder="Manufacturer"
          value={form.manufacturer}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="expiryDate"
          placeholder="Expiry Date (e.g. 2026-12-31)"
          value={form.expiryDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-60"
        >
          {loading ? "Registering on Blockchain..." : "Register & Generate QR"}
        </button>
      </form>

      {errorMsg && (
        <div className="text-red-600 text-sm bg-red-100 p-2 rounded">
          {errorMsg}
        </div>
      )}

      {hash && (
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Generated Hash (off-chain)</h3>
          <p className="text-xs break-words bg-gray-100 p-2 rounded">
            {hash}
          </p>

          <h3 className="text-lg font-semibold mt-3">QR Code (contains hash)</h3>
          <div className="inline-block bg-white p-3 rounded-xl shadow">
            {/* QR content = hash; later you can change to URL if you want */}
            <QRCodeCanvas value={hash} size={200} />
          </div>
        </div>
      )}

      {txHash && (
        <div className="mt-3">
          <h3 className="text-sm font-semibold">Transaction Hash</h3>
          <p className="text-xs break-words bg-blue-50 p-2 rounded">
            {txHash}
          </p>
        </div>
      )}
    </div>
  );
}
