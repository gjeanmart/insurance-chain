pragma solidity ^0.4.8;

import '../common/Common.sol';
import '../token/Token.sol';

//*********************************************************************
//* @title InsToken
//* @dev TODO
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************
contract InsToken is Token {

    //***********************
    //* Structure and enums     
    //*
    //***********************/

    //***********************
    //* Data                
    //*
     
    // Constant
    
    // Variables
    mapping(address => uint)                        balances;
    mapping(address => mapping(address => uint))    approvals;
    
    uint    public  totalSupply;
    string  public  tokenName;
    address public  centralMinter;
    
    uint256 public sellPrice;
    uint256 public buyPrice;
    //***********************/
    
    
    //***********************
    //* Modifier    
    //*
    modifier onlyMinter () {
        if (msg.sender != centralMinter) throw;
        _;
    }
    //***********************
    
    
    //***********************
    //* Events      
    //*
    //***********************/
    
    
    //***********************
    //* Constructor    
    //*
    function InsToken(
        uint    _initialBalance,
        string  _tokenName, 
        uint256 _sellPrice, 
        uint256 _buyPrice) {
        
        balances[msg.sender]    = _initialBalance;
        totalSupply             = _initialBalance;
        tokenName               = _tokenName;
        centralMinter           = msg.sender;
        sellPrice               = _sellPrice;
        buyPrice                = _buyPrice;
    }
    //***********************/
    
    
    //***********************
    //* Getter   
    //*
    function balanceOf() constant returns (uint value) {
        return balances[msg.sender];
    }
    function balanceOf(address _address) constant returns (uint value) {
        return balances[_address];
    }
    function allowance(address _owner, address _spender) constant returns (uint allowance) {
        return approvals[_owner][_spender];
    }
    //***********************/
    

    //***********************
    //* Public functions    
    //*

    function transfer(address _to, uint _value) returns (bool ok) {
        if(balances[msg.sender] < _value) {
            throw;
        }
        
        if(!safeToAdd(balances[_to], _value)) {
            throw;
        }
        
        balances[msg.sender]    -= _value;
        balances[_to]           += _value;
        
        // Events
        Transfer(msg.sender, _to, _value);
        
        return true;
    }
    

    function transferFrom(address _from, address _to, uint _value) returns (bool ok) {
        // if you don't have enough balance, throw
        if(balances[_from] < _value) {
            throw;
        }
        // if you don't have approval, throw
        if(approvals[_from][msg.sender] < _value) {
            throw;
        }
        if(!safeToAdd(balances[_to], _value)) {
            throw;
        }
        // transfer and return true
        approvals[_from][msg.sender] -= _value;
        balances[_from]              -= _value;
        balances[_to]                += _value;
        
        // Events
        Transfer(_from, _to, _value);
        
        return true;
    }
    

    function approve(address _spender, uint _value) returns (bool ok) {
        // TODO: should increase instead
        approvals[msg.sender][_spender] = _value;
        
        // Events
        Approval(msg.sender, _spender, _value);
        
        return true;
    }
    
    function mintToken(uint256 _mintedAmount) onlyMinter {
        balances[centralMinter]    += _mintedAmount;
        totalSupply                 += _mintedAmount;
        
        // Trigger Events
        Transfer(0, centralMinter, _mintedAmount);
    }
    
    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyMinter {
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
    }
    
    function buy() payable returns (uint _amount){
        _amount = msg.value / buyPrice;
        
        if (balances[centralMinter] < _amount) throw;
        
        balances[msg.sender]    += _amount;
        balances[centralMinter]          -= _amount;
        
        // Trigger Events
        Transfer(centralMinter, msg.sender, _amount); 
        
        return _amount;            
    }

    function sell(uint _amount) returns (uint revenue){
        if (balances[msg.sender] < _amount ) throw;
        
        balances[centralMinter]          += _amount;
        balances[msg.sender]    -= _amount;           
        
        revenue = _amount * sellPrice;
        
        if (!msg.sender.send(revenue)) {           
            throw;
        
        } else {
            // Trigger Events
            Transfer(msg.sender, centralMinter, _amount);
            
            return revenue;    
        }
    }
    //***********************/
     
     
     
    //***********************
    //* Private functions       
    //*
    function safeToAdd(uint a, uint b) internal returns (bool) {
        return (a + b >= a);
    }
    //***********************/
    
}