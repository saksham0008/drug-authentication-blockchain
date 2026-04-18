package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Drug defines the structure for a drug record
type Drug struct {
	BatchID            string `json:"batchID"`
	DrugName           string `json:"drugName"`
	CompositionDetails string `json:"compositionDetails"`
	ManufactureDate    string `json:"manufactureDate"`
	Hash               string `json:"hash"` // anti-counterfeit hash
}

// DrugContract provides functions for managing drugs
type DrugContract struct {
	contractapi.Contract
}

// Utility: Generate hash for anti-counterfeit protection
func generateDrugHash(drug Drug) string {
	record := drug.BatchID + drug.DrugName + drug.CompositionDetails + drug.ManufactureDate
	hash := sha256.Sum256([]byte(record))
	return hex.EncodeToString(hash[:])
}

// AddDrug adds a new drug to the ledger
func (dc *DrugContract) AddDrug(ctx contractapi.TransactionContextInterface, batchID, drugName, compositionDetails, manufactureDate string) error {

	exists, err := dc.DrugExists(ctx, batchID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the drug with BatchID %s already exists", batchID)
	}

	drug := Drug{
		BatchID:            batchID,
		DrugName:           drugName,
		CompositionDetails: compositionDetails,
		ManufactureDate:    manufactureDate,
	}

	// Anti-counterfeit hash
	drug.Hash = generateDrugHash(drug)

	drugJSON, err := json.Marshal(drug)
	if err != nil {
		return err
	}

	// Store state
	err = ctx.GetStub().PutState(batchID, drugJSON)
	if err != nil {
		return err
	}

	// Emit event for middleware/Polygon sync
	return ctx.GetStub().SetEvent("DrugAdded", drugJSON)
}

// UpdateDrug modifies an existing drug
func (dc *DrugContract) UpdateDrug(ctx contractapi.TransactionContextInterface, batchID, drugName, compositionDetails, manufactureDate string) error {

	exists, err := dc.DrugExists(ctx, batchID)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("drug with BatchID %s does not exist", batchID)
	}

	drug := Drug{
		BatchID:            batchID,
		DrugName:           drugName,
		CompositionDetails: compositionDetails,
		ManufactureDate:    manufactureDate,
	}

	drug.Hash = generateDrugHash(drug)

	drugJSON, err := json.Marshal(drug)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(batchID, drugJSON)
	if err != nil {
		return err
	}

	return ctx.GetStub().SetEvent("DrugUpdated", drugJSON)
}

// DeleteDrug removes a drug
func (dc *DrugContract) DeleteDrug(ctx contractapi.TransactionContextInterface, batchID string) error {

	exists, err := dc.DrugExists(ctx, batchID)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("drug with BatchID %s does not exist", batchID)
	}

	err = ctx.GetStub().DelState(batchID)
	if err != nil {
		return err
	}

	return ctx.GetStub().SetEvent("DrugDeleted", []byte(batchID))
}

// GetDrug retrieves a drug from the ledger
func (dc *DrugContract) GetDrug(ctx contractapi.TransactionContextInterface, batchID string) (*Drug, error) {

	drugJSON, err := ctx.GetStub().GetState(batchID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if drugJSON == nil {
		return nil, fmt.Errorf("drug with BatchID %s does not exist", batchID)
	}

	var drug Drug
	err = json.Unmarshal(drugJSON, &drug)
	if err != nil {
		return nil, err
	}

	return &drug, nil
}

// QueryAllDrugs retrieves all records from ledger
func (dc *DrugContract) QueryAllDrugs(ctx contractapi.TransactionContextInterface) ([]*Drug, error) {

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var drugs []*Drug

	for resultsIterator.HasNext() {
		result, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var drug Drug
		err = json.Unmarshal(result.Value, &drug)
		if err != nil {
			return nil, err
		}

		drugs = append(drugs, &drug)
	}

	return drugs, nil
}

// GetDrugHistory returns the full history of a drug
func (dc *DrugContract) GetDrugHistory(ctx contractapi.TransactionContextInterface, batchID string) ([]map[string]interface{}, error) {

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(batchID)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var history []map[string]interface{}

	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var drug Drug
		if response.Value != nil {
			_ = json.Unmarshal(response.Value, &drug)
		}

		entry := map[string]interface{}{
			"txID":      response.TxId,
			"timestamp": response.Timestamp,
			"isDelete":  response.IsDelete,
			"drug":      drug,
		}

		history = append(history, entry)
	}

	return history, nil
}

// DrugExists checks if a drug exists
func (dc *DrugContract) DrugExists(ctx contractapi.TransactionContextInterface, batchID string) (bool, error) {

	drugJSON, err := ctx.GetStub().GetState(batchID)
	if err != nil {
		return false, fmt.Errorf("failed to read world state: %v", err)
	}
	return drugJSON != nil, nil
}

// MAIN
func main() {
	chaincode, err := contractapi.NewChaincode(new(DrugContract))
	if err != nil {
		panic(fmt.Sprintf("Error creating drug chaincode: %v", err))
	}

	if err := chaincode.Start(); err != nil {
		panic(fmt.Sprintf("Error starting drug chaincode: %v", err))
	}
}