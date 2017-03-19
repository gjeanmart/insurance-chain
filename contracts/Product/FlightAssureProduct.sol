pragma solidity ^0.4.8;

import '../common/Common.sol';
import '../policy/Policy.sol';
import '../lib/OraclizeI.sol';
import '../lib/strings.sol';
import '../token/InsToken.sol';

//*********************************************************************
//* @title FlightAssureProduct
//* @dev
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************
contract FlightAssureProduct is Product, usingOraclize   {

    using strings for *;

    //***********************
    //* Structure and enums     
    //*

    struct PolicyStruct {
        address         policyAddress;
        Common.State    state;
        uint            departingYear;  
        uint            departingMonth; 
        uint            departingDay;
        string          departingFormatted;
        bytes32         carrier;
        uint            flightNo;
    }
    //***********************/

    //***********************
    //* Data                
    //*
     
    // Constant
    string  constant SLASH = "/";
    address constant oraclizeOAR = 0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475;
    string  constant oraclizeWSBaseURL = "https://api.flightstats.com/flex/schedules/rest/v1/json/flight/";
    
    
    // Variables
    InsToken insTokenFactory;
    string public name;
    string public desc;
    mapping(address => PolicyStruct) policies;
    mapping(uint => address) policiesID;
    uint nbPolicies;
    uint premium;
    
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
	modifier onlyOraclize {	
        if (msg.sender != oraclize_cbAddress()) throw; 
        _;
    } 
	modifier onlyOwnerOrOraclize {	
        if (msg.sender == oraclize_cbAddress() || msg.sender == owner) _; 
        else throw;
    } 
    //***********************
    
    
    //***********************
    //* Events      
    //*
    event newPolicy(address policy);
    event policyAccepted(address policy);
    event policyIssued(address policy);
    event policyDeclined(address policy);
    event payment(address policy, uint amount);
    event oraclizeDebug(string desc, bytes32 queryId);
    //***********************/
    
    
    //***********************
    //* Constructor    
    //*
    function FlightAssureProduct(string _name, string _desc, address _insTokenFactoryAddress, uint _premium) payable {
        OAR = OraclizeAddrResolverI(oraclizeOAR);
        
        name            = _name;
        desc            = _desc;
        premium         = _premium;
        insTokenFactory = InsToken(_insTokenFactoryAddress);
        
    }
    //***********************/

    
    //***********************
    //* Getter   
    //*
    function getProductDetails() constant returns (string, string, uint, uint, uint) {
        return (name, desc, totalPremium, nbPolicies, premium);
    }
    function getBalance() constant returns (uint) {
        return (this.balance);
    }

    function getPoliciesList() constant returns (address[], Common.State[], bytes32[], uint[]) {
    
        address[]         memory policyAddressArray     = new address[](nbPolicies);
        Common.State[]    memory policyStateArray       = new Common.State[](nbPolicies);
        bytes32[]         memory policyCarrier          = new bytes32[](nbPolicies);
        uint[]            memory policyFlightNo         = new uint[](nbPolicies);
 
        for (var i = 0; i < nbPolicies ; i++) {
            PolicyStruct memory policy  = policies[policiesID[i]];
        
            policyAddressArray[i]       = policy.policyAddress;
            policyStateArray[i]         = policy.state;
            policyCarrier[i]            = policy.carrier;
            policyFlightNo[i]           = policy.flightNo;
        }
        
        return (policyAddressArray, policyStateArray, policyCarrier, policyFlightNo); 
    }
    //***********************/
    
    
    //***********************
    //* Public functions    
    //*
    
    //* @title createProposal
    //* @dev Create a new policy in a Proposal state
    function createProposal(address _assured, address _beneficiary, uint _startDate, uint _departingYear, uint _departingMonth, uint _departingDay, bytes32 _carrier, uint _flightNo) returns (bool success) {
    
        // Create policy
        address newPolicyAddress = new Policy(_assured, _beneficiary, _assured, premium, premium * 1000, this, _startDate);
        
        PolicyStruct memory policy; 
        policy.policyAddress        = newPolicyAddress;
        policy.state                = Common.State.PROPOSAL;
        policy.departingYear        = _departingYear;
        policy.departingMonth       = _departingMonth;
        policy.departingDay         = _departingDay;
        policy.departingFormatted   = strConcat(uint2str(_departingYear), SLASH, uint2str(_departingMonth), SLASH, uint2str(_departingDay));
        policy.carrier              = _carrier;
        policy.flightNo             = _flightNo;
        
        policies[newPolicyAddress] = policy;
        policiesID[nbPolicies] = newPolicyAddress;
        nbPolicies++;
        
        // Get Payment if allowed to take it
        if(insTokenFactory.allowance(_assured, this) >= premium) {
            insTokenFactory.transferFrom(_assured, this, premium);
            Policy p = Policy(newPolicyAddress);
            p.payPremium(premium);
        }
        
        // Trigger event
        newPolicy(newPolicyAddress);
        
        // Validate proposal with Oraclize
        callOraclizeToValidateTheData(policy);

        return true;
    }
    
    function callOraclizeToValidateTheData(PolicyStruct policy) internal {
        string memory url = strConcat(
            "json(", 
            oraclizeWSBaseURL, 
            bytes32ToString(policy.carrier), 
            SLASH, 
            strConcat(
                uint2str(policy.flightNo), 
                "/departing/", 
                policy.departingFormatted,  
                "?appId=c5d94f02&appKey=a1ea4243dc3aa9c10a0bd6fa345687f7)",
                ".scheduledFlights"
            )
        );
        
        if (oraclize_getPrice("URL") > this.balance) {
            oraclizeDebug("Oraclize query was NOT sent, please add some ETH to cover for the query fee", "0");
        } else {
            bytes32 queryId = oraclize_query("URL", url);
            policyOraclizeQuery[queryId] = policy.policyAddress;
            
            oraclizeDebug("Oraclize query was sent, standing by for the answer..", queryId);
        }
    }
    
    function __callback(bytes32 _id, string _result) onlyOraclize {     
        oraclizeDebug("Oraclize callback received", _id);
            
        address polAddress = policyOraclizeQuery[_id];
  
        if (bytes(_result).length == 0 || sha3(_result) == sha3('[]')) {
			declinedProposal(polAddress);
        } else {
			underwrite(polAddress);
        }
    }

    
    //* @title underwrite
    //* @dev Accept the policy
    function underwrite(address _policyAddress) onlyIfState(_policyAddress, Common.State.PROPOSAL) onlyOwnerOrOraclize returns (bool success) {
        policies[_policyAddress].state = Common.State.ACCEPTED;
    
        // Calculate sum assured, risk, ...
    
        Policy policy = Policy(_policyAddress);
        policy.underwrite();
    
        // Trigger event
        policyAccepted(_policyAddress);
        
        // Issue Policy (automatic if accepted and premium sent)
        if(policy.getPaidPremium() >= premium) {
            issueProposal(_policyAddress);
        }
        
        return true;
    }
    
    //* @title issueProposal
    //* @dev Activate the policy
    function issueProposal(address _policyAddress) onlyIfState(_policyAddress, Common.State.ACCEPTED) onlyOwnerOrOraclize returns (bool success) {
        policies[_policyAddress].state = Common.State.ACTIVE;
    
        Policy policy = Policy(_policyAddress);
        policy.issuePolicy();
    
        // Trigger event
        policyIssued(_policyAddress);
        
        return true;
    }
    
    //* @title notifyPremiumPayment
    //* @dev Notify a payment in a policy
    function notifyPremiumPayment(address _policyAddress, uint _amount)  onlyPolicy(_policyAddress) returns (bool success) {   
        totalPremium += _amount;
    
        if(_amount >= premium && policies[_policyAddress].state == Common.State.ACCEPTED) {
            issueProposal(_policyAddress);
        }
    
        // Trigger event
        payment(_policyAddress, _amount);
        
        return true;
    }
    
    //* @title declinedProposal
    //* @dev Refuse the policy
    function declinedProposal(address _policyAddress) onlyIfState(_policyAddress, Common.State.PROPOSAL) onlyOwnerOrOraclize returns (bool success) {
        policies[_policyAddress].state = Common.State.DECLINED;
    
        Policy policy = Policy(_policyAddress);
        policy.decline();
    
        // Trigger event
        policyDeclined(_policyAddress);
        
        return true;
    }
    
    
    
    
    //***********************/
     
     
     
    //***********************
    //* Private functions       
    //*
    function stringToBytes32(string memory source) returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }
    
    function bytes32ToString(bytes32 x) constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
    //***********************/


}
