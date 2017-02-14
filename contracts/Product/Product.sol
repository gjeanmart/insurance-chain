pragma solidity ^0.4.8;

import '../common/Ownable.sol';

//*********************************************************************
//* @title Product
//* @dev
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************
contract Product is Ownable  {

    function getDetails() constant returns (bytes32 _name, bytes32 _desc, uint _totalPremium);
    
    function createProposal(address _assured,address _beneficiary, uint _premium, uint _sumAssured, uint _startDate) returns (bool _success);
    
    function issueProposal(address _policyAddress) returns (bool success);
    
    function notifyPayment(address _policyAddress, uint _amount)  returns (bool success);

}
