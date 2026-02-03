import { useState } from "react";
import QrReader from "react-qr-reader";

export default function QRScanner({ onScan, onClose }) {
  const [error, setError] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-2">Scan QR Code</h2>
        <QrReader
          delay={300}
          onError={(err) => {
            console.error(err);
            setError("Camera access error or unsupported device.");
          }}
          onScan={(result) => {
            if (result) {
              onScan(result);
              onClose();
            }
          }}
          style={{ width: "100%" }}
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
