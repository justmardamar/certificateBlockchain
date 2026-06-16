// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract CertificateRegistry{
    struct Certificate{
        string recipientName;
        string seminarName;
        uint256 issueDate;
        bool isValid; 
    }

    mapping (string=>Certificate) public certificates;

    function issueCertificate(string memory _hash, string memory _name, string memory _seminar) public {
        require(!certificates[_hash].isValid, "Sertifikat sudah ada");
        certificates[_hash] = Certificate(_name, _seminar, block.timestamp, true);
    }

    function verifyCertificate(string memory _hash) public view returns (bool, string memory, string memory, uint256) {
        Certificate memory cert = certificates[_hash];
        return (cert.isValid, cert.recipientName, cert.seminarName, cert.issueDate);
    }

}