// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract SeminarCertificate {
    
    struct Record {
        string certificateNumber; 
        uint256 timestamp;
        bool isVerified;
    }

    mapping(string => Record) private registry;

    event CertificateIssued(string certHash, string certNumber);

    function issue(string memory _hash, string memory _certNumber) public {
        require(!registry[_hash].isVerified, "Sertifikat sudah ada");
        
        registry[_hash] = Record({
            certificateNumber: _certNumber,
            timestamp: block.timestamp,
            isVerified: true
        });

        emit CertificateIssued(_hash, _certNumber);
    }
    function verify(string memory _hash) public view returns (bool, string memory, uint256) {
        Record memory rec = registry[_hash];
        return (rec.isVerified, rec.certificateNumber, rec.timestamp);
    }
}