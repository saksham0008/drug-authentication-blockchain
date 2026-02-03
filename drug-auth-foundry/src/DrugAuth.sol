// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DrugAuth {
    string public name = "Drug Authentication";

    struct Drug {
        string nameDrug;
        string batchNo;
        string manufacturer;
        string expiryDate;
        string hash;
        uint256 createdAt;
        address createdBy;
    }

    mapping(string => Drug) private drugs;

    event DrugRegistered(
        string hash,
        string nameDrug,
        string batchNo,
        string manufacturer,
        string expiryDate,
        address indexed createdBy
    );

    function registerDrug(
        string memory _hash,
        string memory _nameDrug,
        string memory _batchNo,
        string memory _manufacturer,
        string memory _expiryDate
    ) public {
        require(bytes(drugs[_hash].hash).length == 0, "Drug already exists");

        drugs[_hash] = Drug({
            nameDrug: _nameDrug,
            batchNo: _batchNo,
            manufacturer: _manufacturer,
            expiryDate: _expiryDate,
            hash: _hash,
            createdAt: block.timestamp,
            createdBy: msg.sender
        });

        emit DrugRegistered(
            _hash,
            _nameDrug,
            _batchNo,
            _manufacturer,
            _expiryDate,
            msg.sender
        );
    }

    function getDrugByHash(
        string memory _hash
    )
        public
        view
        returns (
            string memory nameDrug,
            string memory batchNo,
            string memory manufacturer,
            string memory expiryDate,
            uint256 createdAt,
            address createdBy
        )
    {
        Drug memory d = drugs[_hash];
        require(bytes(d.hash).length != 0, "Drug not found");

        return (
            d.nameDrug,
            d.batchNo,
            d.manufacturer,
            d.expiryDate,
            d.createdAt,
            d.createdBy
        );
    }
}
