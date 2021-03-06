pragma solidity ^0.4.8;

import '../common/Ownable.sol';

//*********************************************************************
//* @title Product
//* @dev
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************
contract Product is Ownable  {

    //function createProposal(address _assured,address _beneficiary, uint _sumAssured, uint _startDate) returns (bool success);
    
    function underwrite(address _policyAddress) internal returns (bool success);
    
    function issueProposal(address _policyAddress) internal returns (bool success);
    
    function notifyPremiumPayment(address _policyAddress, uint _amount)  returns (bool success);

}
