// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HealthInsurance {
    struct Buyer {
        string name;
        string nid;
        uint premiumPaidTill;
        string ipfsCid;
    }

    mapping(address => Buyer) public buyers;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function addBuyer(address _buyer, string memory _name, string memory _nid, string memory _cid) public {
        require(msg.sender == admin, "Only admin can add buyers");
        buyers[_buyer] = Buyer(_name, _nid, block.timestamp, _cid);
    }

    function payPremium() public payable {
        require(bytes(buyers[msg.sender].nid).length != 0, "Not a registered buyer");
        require(msg.value > 0, "Pay some ether");
        buyers[msg.sender].premiumPaidTill += 30 days;
    }

    function updateBuyerCid(address _buyer, string memory _cid) public {
        require(msg.sender == admin, "Only admin");
        buyers[_buyer].ipfsCid = _cid;
    }
}
