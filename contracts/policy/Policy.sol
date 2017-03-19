pragma solidity ^0.4.8;

import '../common/Common.sol';
import '../product/Product.sol';

//*********************************************************************
//* @title Policy
//* @dev Registry for the Insurance company. This contract acts as an entry point for the Policy Administration System
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************
contract Policy is Ownable{

    //***********************
    //* Structure and enums     
    //*
    //***********************/

    //***********************
    //* Data                
    //*
     
    // Constant
    //uint constant EX = 1;
    
    // Variables
    uint            startDate;
    address         product;
    address         assured;
    address         payer;
    address         beneficiary;
    uint            public premium;
    uint            sumAssured;
    Common.State    state;
    //***********************/
    
    
    //***********************
    //* Modifier    
    //*
    modifier onlyAssured {
        if (msg.sender != assured) throw;
        _;
    }
    modifier onlyPayer {
        if (msg.sender != payer) throw;
        _;
    }
    modifier onlyBeneficiary {
        if (msg.sender != beneficiary) throw;
        _;
    }
    modifier onlyActivePolicy {
        if (state != Common.State.ACTIVE) throw;
        _;
    }
	modifier onlyOwnerOrPayer {	
        if (msg.sender == owner || msg.sender == payer) _; 
        else throw;
    } 
    //***********************
    
    
    //***********************
    //* Events      
    //*
    event payment(uint amount);
    //***********************/
    
    
    //***********************
    //* Constructor    
    //*
    function Policy(address _assured, address _beneficiary, address _payer, uint _premium, uint _sumAssured, address _product, uint _startDate) {
         assured        = _assured;
         payer          = _payer;
         beneficiary    = _beneficiary;
         premium        = _premium;
         sumAssured     = _sumAssured;
         state          = Common.State.PROPOSAL;
         premium        = 0;
         product        = _product;
         startDate      = _startDate;

    }
    //***********************/
    
    
    //***********************
    //* Getter   
    //*
    function getPolicyDetails() constant returns (address, address, address, address, uint, uint, Common.State, address, address, uint) {
        return (assured, beneficiary, payer, owner, premium, sumAssured, state, owner, product, startDate);
    }
    function getPaidPremium() constant returns (uint) {
        return (premium);
    }
    //***********************/
    

    //***********************
    //* Public functions    
    //*
    function underwrite() onlyOwner {
         state = Common.State.ACCEPTED;
    }
    
    function issuePolicy() onlyOwner {
         state = Common.State.ACTIVE;
    }
    
    function decline() onlyOwner {
         state = Common.State.DECLINED;
    }
    
    
    function payPremium(uint amount) onlyOwnerOrPayer {
        premium += amount;
        
        Product p = Product(product);
        p.notifyPremiumPayment(this, amount);
        
        // Trigger event
        payment(amount);
    }
    //***********************/
     
     
     
    //***********************
    //* Private functions       
    //*
    
    //***********************/
    

}
