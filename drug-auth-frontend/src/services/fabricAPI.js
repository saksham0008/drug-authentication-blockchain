import axios from "axios";

const API_URL = "http://your-backend-url/api/drugs"; // Replace with your actual backend URL

export async function getPrivateDrugData(batchId) {
  try {
    const response = await axios.get(`${API_URL}/${batchId}`);
    return response.data; // Return private data for this batch
  } catch (err) {
    console.error("Error fetching data from Fabric:", err);
    throw new Error("Failed to fetch private data from Fabric.");
  }
}
