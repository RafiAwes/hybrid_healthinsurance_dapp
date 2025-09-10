// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HealthInsurance {
    address public admin;

    struct Buyer {
        string cid; // CID of buyer JSON stored on Storacha/IPFS
    }

    mapping(address => Buyer) public buyers;
    address[] public buyerAddresses; // Track all buyer addresses

    // Track claims & premiums by buyer address (list of CIDs)
    mapping(address => string[]) public claimsByBuyer;
    mapping(address => string[]) public premiumsByBuyer;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Add new buyer
    function addBuyer(address buyerAddress, string memory cid) public onlyAdmin {
        // If this is a new buyer, add to the list
        if (bytes(buyers[buyerAddress].cid).length == 0) {
            buyerAddresses.push(buyerAddress);
        }
        buyers[buyerAddress] = Buyer(cid);
    }

    // Get all buyer addresses
    function getAllBuyers() public view returns (address[] memory) {
        return buyerAddresses;
    }

    // Record claim CID for a buyer
    function recordClaim(address buyerAddress, string memory cid) public onlyAdmin {
        claimsByBuyer[buyerAddress].push(cid);
    }

    // Record premium payment CID for a buyer
    function recordPremiumPayment(address buyerAddress, string memory cid) public onlyAdmin {
        premiumsByBuyer[buyerAddress].push(cid);
    }

    // Pay premium: admin records payment and transfers from buyer to admin
    function payPremium(address buyerAddress, uint amount) public view onlyAdmin {
        require(bytes(buyers[buyerAddress].cid).length != 0, "Buyer not registered");
        require(amount > 0, "Amount must be greater than 0");

        // Transfer from buyer to admin
        // Note: This requires the buyer to have approved the contract or use a different mechanism
        // For simplicity, we'll assume the transfer is handled off-chain or via direct send
    }

    // Get all claims CIDs for a buyer
    function getClaimsByBuyer(address buyerAddress) public view returns (string[] memory) {
        return claimsByBuyer[buyerAddress];
    }

    // Get all premium payment CIDs for a buyer
    function getPremiumsByBuyer(address buyerAddress) public view returns (string[] memory) {
        return premiumsByBuyer[buyerAddress];
    }

    // Get buyer CID
    function getBuyerCID(address buyerAddress) public view returns (string memory) {
        return buyers[buyerAddress].cid;
    }

    // Optional: transfer admin
    function transferAdmin(address newAdmin) public onlyAdmin {
        admin = newAdmin;
    }
}



