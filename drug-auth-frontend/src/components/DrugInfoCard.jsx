import { motion } from "framer-motion";

export default function DrugInfoCard({ publicData, privateData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow space-y-2"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Drug Details</h2>
      <p><strong>Name:</strong> {publicData.name}</p>
      <p><strong>Manufacturer:</strong> {publicData.manufacturer}</p>
      <p><strong>Batch ID:</strong> {publicData.batchId}</p>
      <p><strong>Expiry:</strong> {publicData.expiryDate}</p>
      <hr className="my-2" />
      <p><strong>Storage Temp:</strong> {privateData.storageTemp}</p>
      <p><strong>Inspection Notes:</strong> {privateData.notes}</p>
      <div className="mt-2">
        <span className="px-3 py-1 bg-green-200 text-green-800 text-sm rounded-full">
          ✅ Verified
        </span>
      </div>
    </motion.div>
  );
}
