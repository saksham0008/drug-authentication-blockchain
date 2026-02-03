import { useState } from "react";
import { getDrugByHash } from "../services/drugAuth";
import { QRCodeCanvas } from "qrcode.react";

export default function VerifyByHash() {
  const [hash, setHash] = useState("");
  const [drug, setDrug] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!hash.trim()) {
      setError("Please enter a valid hash.");
      return;
    }

    setError("");
    setDrug(null);
    setLoading(true);

    try {
      const data = await getDrugByHash(hash);
      setDrug(data);
    } catch (err) {
      setError("Drug not found or invalid hash.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-blue-700">Verify Drug by Hash</h2>

      <input
        type="text"
        placeholder="Enter or paste hash"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded-md"
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Verify Hash"}
      </button>

      {error && (
        <div className="text-red-600 text-sm bg-red-100 p-2 rounded">{error}</div>
      )}

      {drug && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 space-y-2">
          <h3 className="text-xl font-bold text-green-700">✔ AUTHENTIC DRUG</h3>

          <p><strong>Name:</strong> {drug.nameDrug}</p>
          <p><strong>Batch No:</strong> {drug.batchNo}</p>
          <p><strong>Manufacturer:</strong> {drug.manufacturer}</p>
          <p><strong>Expiry Date:</strong> {drug.expiryDate}</p>
          <p><strong>Created By:</strong> {drug.createdBy}</p>

          <p>
            <strong>Created At:</strong>{" "}
            {new Date(drug.createdAt * 1000).toLocaleString()}
          </p>

          <h4 className="text-lg font-semibold mt-4">QR Code (Hash)</h4>
          <div className="inline-block bg-white p-3 rounded-xl shadow">
            <QRCodeCanvas value={hash} size={200} />
          </div>
        </div>
      )}
    </div>
  );
}
