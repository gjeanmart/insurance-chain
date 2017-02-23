pragma solidity ^0.4.8;

import '../common/Common.sol';
import '../policy/Policy.sol';
import '../lib/OraclizeI.sol';

//*********************************************************************
//* @title FlightAssureProduct
//* @dev
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************
contract FlightAssureProduct is Product, usingOraclize   {

    //***********************
    //* Structure and enums     
    //*

    struct PolicyStruct {
        address         policyAddress;
        Common.State    state;
        uint            departingYear;  
        uint            departingMonth; 
        uint            departingDay;
        string          carrier;
        uint            flightNo;
        uint            flightID;
        string          ref;
    }
    //***********************/

    //***********************
    //* Data                
    //*
     
    // Constant
	uint     constant oraclizeGas = 500000;
    address  constant oraclizeOAR = 0x6f485c8bf6fc43ea212e93bbf8ce046c7f1cb475;
    
    // Variables
    string public name;
    string public desc;
    mapping(address => PolicyStruct) policies;
    mapping(uint => address) policiesID;
    uint nbPolicies;
    
    uint totalPremium;
    uint totalPayout;
    uint totalClaim;
    
    
    mapping(bytes32 => address) policyOraclizeQuery;
    //***********************/
    
    
    //***********************
    //* Modifier    
    //*/
    modifier onlyIfState (address _policyAddress, Common.State _state) {
        PolicyStruct p = policies[_policyAddress];
        if (p.state != _state) throw;
        _;
    }
    modifier onlyPolicy (address _policyAddress) {
        if (msg.sender != _policyAddress) throw;
        _;
    }
    //***********************
    
    
    //***********************
    //* Events      
    //*
    event newPolicy(address policy);
    event policyAccepted(address policy);
    event policyIssued(address policy);
    event payment(address policy, uint amount);
    //***********************/
    
    
    //***********************
    //* Constructor    
    //*
    function FlightAssureProduct(string _name, string _desc) {
        name = _name;
        desc = _desc;
        
        OAR = OraclizeAddrResolverI(oraclizeOAR);
    }
    //***********************/

    
    //***********************
    //* Getter   
    //*
    function getProductDetails() constant returns (string, string, uint, uint) {
        return (name, desc, totalPremium, nbPolicies);
    }

    function getPoliciesList() constant returns (address[] _address, Common.State[] _state, uint) {
    
        uint length = nbPolicies;
    
        address[]         memory policyAddressArray  = new address[](length);
        Common.State[]    memory policyStateArray    = new Common.State[](length);

        for (var i = 0; i < length ; i++) {
            address a = policiesID[i];
            PolicyStruct memory policy = policies[a];
        
            policyAddressArray[i]   = policy.policyAddress;
            policyStateArray[i]     = policy.state;
        }
        
        return (policyAddressArray, policyStateArray, length); 
    }
    //***********************/
    
    
    //***********************
    //* Public functions    
    //*
    
    //* @title createProposal
    //* @dev Create a new policy in a Proposal state
    function createProposal(address _assured, address _beneficiary, uint _premium, uint _startDate, uint _departingYear, uint _departingMonth, uint _departingDay, string _carrier, uint _flightNo) returns (bool success) {
        uint sumAssured = _premium * 1000;
    
        address newPolicyAddress = new Policy(_assured, _beneficiary, _assured, _premium, sumAssured, this, _startDate);
        
        PolicyStruct memory policy; 
        policy.policyAddress = newPolicyAddress;
        policy.state = Common.State.PROPOSAL;
        policy.departingYear = _departingYear;
        policy.departingMonth = _departingMonth;
        policy.departingDay = _departingDay;
        policy.carrier = _carrier;
        policy.flightNo = _flightNo;
        
        policies[newPolicyAddress] = policy;
        policiesID[nbPolicies] = newPolicyAddress;
        nbPolicies++;
        
        // Trigger event
        newPolicy(newPolicyAddress);
        
        //TODO Validate proposal with Oraclize
        bytes32 queryId = oraclize_query("URL", "json(https://api.flightstats.com/flex/schedules/rest/v1/json/flight/EZY/8681/departing/2017/02/25?appId=c5d94f02&appKey=a1ea4243dc3aa9c10a0bd6fa345687f7).scheduledFlights[0].referenceCode");
        policyOraclizeQuery[queryId] = newPolicyAddress;
        
        return true;
    }
    
    function __callback(bytes32 id, string result) {
        if (msg.sender != oraclize_cbAddress()) throw;
        
        address polAddress = policyOraclizeQuery[id];
        policies[polAddress].ref = result;
    }

    
    //* @title underwrite
    //* @dev Accept the policy
    function underwrite(address _policyAddress) onlyIfState(_policyAddress, Common.State.PROPOSAL) onlyOwner returns (bool success) {
        policies[_policyAddress].state = Common.State.ACCEPTED;
    
        Policy policy = Policy(_policyAddress);
        policy.underwrite();
    
        // Trigger event
        policyAccepted(_policyAddress);
        
        // Issue Policy (automatic if accepted)
        issueProposal(_policyAddress);
        
        return true;
    }
    
    //* @title issueProposal
    //* @dev Activate the policy
    function issueProposal(address _policyAddress) onlyIfState(_policyAddress, Common.State.ACCEPTED) onlyOwner returns (bool success) {
        policies[_policyAddress].state = Common.State.ACTIVE;
    
        Policy policy = Policy(_policyAddress);
        policy.issuePolicy();
    
        // Trigger event
        policyIssued(_policyAddress);
        
        return true;
    }
    
    //* @title issueProposal
    //* @dev Notify a payment in a policy
    function notifyPremiumPayment(address _policyAddress, uint _amount)  onlyIfState(_policyAddress, Common.State.ACTIVE) onlyPolicy(_policyAddress) returns (bool success) {   
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
