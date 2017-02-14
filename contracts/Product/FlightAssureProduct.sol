pragma solidity ^0.4.8;

import '../common/Common.sol';
import '../Policy/PolicyC.sol';

//*********************************************************************
//* @title FlightAssureProduct
//* @dev
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************
contract FlightAssureProduct is Product  {

    //***********************
    //* Structure and enums     
    //*

    struct Policy {
        address         policyAddress;
        Common.State    state;
    }
    //***********************/

    //***********************
    //* Data                
    //*
     
    // Constant
    //uint constant EX = 1;
    
    // Variables
    bytes32 public name;
    bytes32 public desc;
    mapping(address => Policy) policies;
    mapping(uint => address) policiesID;
    uint nbPolicies;
    
    uint totalPremium;
    uint totalPayout;
    uint totalClaim;
    //***********************/
    
    
    //***********************
    //* Modifier    
    //*/
    //modifier isActive {
    //    if(endDate > now && ended == false) {
    //        _;
    //    }
    //}
    //***********************
    
    
    //***********************
    //* Events      
    //*
    event newPolicy(address policy);
    event policyIssued(address policy);
    event payment(address policy, uint amount);
    //***********************/
    
    
    //***********************
    //* Constructor    
    //*
    function FlightAssureProduct(bytes32 _name, bytes32 _desc) {
        name = _name;
        desc = _desc;
    }
    //***********************/

    //***********************
    //* Public functions    
    //*
    function getDetails() constant returns (bytes32, bytes32, uint) {
        return (name, desc, totalPremium);
    }

    function getPoliciesList() constant returns (address[] _address, Common.State[] _state, uint) {
    
        uint length = nbPolicies;
    
        address[]         memory policyAddressArray  = new address[](length);
        Common.State[]    memory policyStateArray    = new Common.State[](length);

        for (var i = 0; i < length ; i++) {
            address a = policiesID[i];
            Policy memory policy = policies[a];
        
            policyAddressArray[i]   = policy.policyAddress;
            policyStateArray[i]     = policy.state;
        }
        
        return (policyAddressArray, policyStateArray, length); 
    }
    
    function createProposal(address _assured, address _beneficiary, uint _premium, uint _sumAssured, uint _startDate) returns (bool _success) {
        address newPolicyAddress = new PolicyC(_assured, _beneficiary, _assured, _premium, _sumAssured, this, _startDate);
		
        Policy memory policy; 
		policy.policyAddress = newPolicyAddress;
		policy.state = Common.State.PROPOSAL;
		
		policies[newPolicyAddress] = policy;
        policiesID[nbPolicies] = newPolicyAddress;
        nbPolicies++;
        
        // Trigger event
        newPolicy(newPolicyAddress);
        
        return true;
    }
    
    function issueProposal(address _policyAddress) returns (bool success) {
        policies[_policyAddress].state = Common.State.ACTIVE;
    
        PolicyC policyC= PolicyC(_policyAddress);
        policyC.issuePolicy();
    
        // Trigger event
        policyIssued(_policyAddress);
        
        return true;
    }
    
    function notifyPayment(address _policyAddress, uint _amount)  returns (bool success) {   
        totalPremium += _amount;
    
        // Trigger event
        payment(_policyAddress, _amount);
        
        return true;
    }
    //***********************/
     
     
     
    //***********************
    //* Private functions       
    //*
    
    //***********************/


}
