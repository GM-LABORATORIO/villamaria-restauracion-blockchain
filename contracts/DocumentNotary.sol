// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentNotary {
    struct Record {
        string fileName;
        string sha256Hash;
        uint256 timestamp;
        string publicLink;
    }

    // Map from SHA-256 hash to its record
    mapping(string => Record) private records;
    
    // Array of all registered hashes for enumeration
    string[] private registeredHashes;

    address public owner;

    event DocumentRegistered(
        string fileName,
        string sha256Hash,
        string publicLink,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can register documents");
        _;
    }

    /**
     * @dev Register a new document hash.
     * @param _fileName Name of the file.
     * @param _sha256Hash SHA-256 hash of the file.
     * @param _publicLink Public IPFS or web URL.
     */
    function registerDocument(
        string memory _fileName,
        string memory _sha256Hash,
        string memory _publicLink
    ) public onlyOwner {
        require(bytes(records[_sha256Hash].sha256Hash).length == 0, "Document hash already registered");

        records[_sha256Hash] = Record({
            fileName: _fileName,
            sha256Hash: _sha256Hash,
            timestamp: block.timestamp,
            publicLink: _publicLink
        });

        registeredHashes.push(_sha256Hash);

        emit DocumentRegistered(_fileName, _sha256Hash, _publicLink, block.timestamp);
    }

    /**
     * @dev Check if a document is registered and get its details.
     */
    function getRecord(string memory _sha256Hash) public view returns (
        string memory fileName,
        string memory sha256Hash,
        uint256 timestamp,
        string memory publicLink
    ) {
        Record memory r = records[_sha256Hash];
        require(bytes(r.sha256Hash).length > 0, "Document not registered");
        return (r.fileName, r.sha256Hash, r.timestamp, r.publicLink);
    }

    /**
     * @dev Check if a hash exists.
     */
    function isRegistered(string memory _sha256Hash) public view returns (bool) {
        return bytes(records[_sha256Hash].sha256Hash).length > 0;
    }

    /**
     * @dev Get all registered hashes.
     */
    function getAllHashes() public view returns (string[] memory) {
        return registeredHashes;
    }
}
