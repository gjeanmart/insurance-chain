pragma solidity ^0.4.4;

contract Insurance {
	address public owner;

	modifier onlyOwner() {
		if (msg.sender == owner) _;
	}

	function Insurance() {
		owner = msg.sender;
	}

}
