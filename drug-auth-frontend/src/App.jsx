import { useState } from "react";
import { getPublicDrugData } from "./services/polygon";
import { getPrivateDrugData } from "./services/fabricAPI";
import DrugInfoCard from "./components/DrugInfoCard";
import RegisterDrug from "./components/RegisterDrug";

export default function App() {
  const [mode, setMode] = useState("verify"); // "verify" | "register"

  const [batchId, setBatchId] = useState("");
  const [publicData, setPublicData] = useState(null);
  const [privateData, setPrivateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!batchId.trim()) {
      setError("Please enter a valid batch ID.");
      return;
    }

    setLoading(true);
    setError("");
    setPublicData(null);
    setPrivateData(null);
    try {
      const pubData = await getPublicDrugData(batchId);
      const privData = await getPrivateDrugData(batchId);
      setPublicData(pubData);
      setPrivateData(privData);
    } catch (err) {
      setError("Drug not found or network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Drug Authentication Portal
        </h1>

        {/* Mode Toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => setMode("verify")}
            className={`flex-1 py-2 rounded-md border ${
              mode === "verify"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-700 border-gray-300"
            }`}
          >
            Verify Batch
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-md border ${
              mode === "register"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-green-700 border-gray-300"
            }`}
          >
            Register & Generate QR
          </button>
        </div>

        {/* Content */}
        {mode === "verify" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter Batch ID"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Searching..." : "Verify Batch"}
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-100 p-2 rounded">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-6">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-12 w-12 animate-spin"></div>
              </div>
            )}

            {publicData && privateData && (
              <DrugInfoCard publicData={publicData} privateData={privateData} />
            )}
          </div>
        )}

        {mode === "register" && <RegisterDrug />}
      </div>
    </div>
  );
}
