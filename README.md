# Drug Authentication & Anti-Counterfeiting System (Blockchain)

A blockchain-based system to verify the authenticity of pharmaceutical drugs and prevent counterfeiting across the supply chain.  
This project uses smart contracts to register manufacturers, track drug batches, and allow verification by distributors, pharmacies, and consumers.

---

## Problem Statement
Counterfeit medicines are a serious global issue that cause health risks, financial losses, and loss of trust in healthcare systems.  
Traditional supply chains lack transparency and are prone to tampering and data manipulation.

This project solves this by using blockchain to provide:
- Immutable records  
- Transparent tracking of drug batches  
- Public verification of authenticity  

---

## Features
- Manufacturer registration  
- Drug batch creation and tracking  
- Ownership transfer across supply chain  
- Public verification of drug authenticity  
- Immutable on-chain audit trail  
- Role-based access control (manufacturer, distributor, pharmacy, consumer)  

---

## Tech Stack
- **Solidity** – Smart contracts  
- **Foundry** – Development, testing, deployment  
- **Ethereum-compatible network** – Local Anvil / Testnet / Polygon (optional)  
- **Node.js** – (Optional backend integration)  
- **Frontend** – (Optional UI integration)  

---

## Project Structure
drug-authentication-blockchain/
├── src/ # Solidity smart contracts
├── script/ # Deployment scripts
├── test/ # Smart contract test cases
├── lib/ # Foundry dependencies
├── .gitignore
└── README.md

---

## Setup & Run (Local)
forge install
forge build
forge test

---

## Use Cases
-> Pharmaceutical manufacturers
-> Distributors & logistics partners
-> Pharmacies
-> Consumers verifying drug authenticity
-> Regulators and auditors

---

## Future Improvements
-> QR code-based verification
-> Frontend dashboard for tracking
-> Integration with Polygon testnet/mainnet
-> IPFS storage for drug metadata
-> Role management UI

---

## Author
Saksham Gupta
GitHub: https://github.com/saksham0008

---

## 📜 License
MIT License


