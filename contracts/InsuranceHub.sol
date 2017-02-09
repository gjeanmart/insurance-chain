pragma solidity ^0.4.8;

import './common/Ownable.sol';

//*********************************************************************
//* @title InsuranceHub
//* @dev Registry for the Insurance company. This contract acts as an entry point for the Policy Administration System
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************
contract InsuranceHub is Ownable {

    //***********************
    //* Structure and enums     
    //*
    struct Product {
        address     productAddress;
        bytes32     name;
        bytes32     description;
        uint        dateCreated;
        bool        active;
    }
    struct Person {
        address     personAddress;
        bytes32     firstName;
        bytes32     surname;
        uint        dob;
        Sex         sex;
    }
    enum Sex {
        MALE,
        FEMALE,
        UNKNOW
    }
    //***********************/

    //***********************
    //* Data                
    //*
     
    // Constant
    //uint constant EX = 1;
    
    // Variables
    mapping(address => Product) products;
    uint public                 nbProducts;
    
    mapping(uint    => Person)  persons;
    
    //***********************/
    
    
    //***********************
    //* Modifier    
    //*
    //modifier isActive {
    //    if(endDate > now && ended == false) {
    //        _;
    //    }
    //}
    //***********************
    
    
    //***********************
    //* Events      
    //*
    event ProductRegistered(address productAddress, bytes32 name, bytes32 description);
    event ProductEnabled(address productAddress, bytes32 name);
    event ProductDisabled(address productAddress, bytes32 name);
    //***********************/
    
    
    //***********************
    //* Constructor    
    //*
    function InsuranceHub() {
        nbProducts = 0;
    }
    //***********************/

    //***********************
    //* Public functions    
    //*
    function registerProduct(address _address, bytes32 _name, bytes32 _description) onlyOwner {
        
        Product memory product; 
        product.productAddress  = _address;
        product.name            = _name;
        product.description     = _description;
        product.active          = true;
        product.dateCreated     = now;
        
        products[_address] = product;
        
        nbProducts += 1;
        
        // Trigger event
        ProductRegistered(_address, _name, _description);
    }
    
    function enableProduct(address _address) onlyOwner {
        products[_address].active  = true;
        
        // Trigger event
        ProductEnabled(_address, products[_address].name);
    }
    
    function disableProduct(address _address) onlyOwner {
        products[_address].active  = false;
        
        // Trigger event
        ProductDisabled(_address, products[_address].name);
    }
     
    function getProductsList() constant returns (address[] _address, bytes32[] _name, bytes32[] _description, bool[] _active, uint[] _dateCreated, uint) {
    
        uint length = nbProducts;
    
        address[]   memory productAddressArray      = new address[](nbProducts);
        bytes32[]   memory productNameArray         = new bytes32[](nbProducts);
        bytes32[]   memory productDescArray         = new bytes32[](nbProducts);
        bool[]      memory productActivetArray      = new bool[](nbProducts);
        uint[]      memory productDateCreatedArray  = new uint[](nbProducts);

        for (var i = 0; i < length ; i++) { 
            Product memory product = products[i];
        
            productAddressArray[i]      = product.productAddress;
            productNameArray[i]         = product.name;
            productDescArray[i]         = product.description;
            productActivetArray[i]      = product.active;
            productDateCreatedArray[i]  = product.dateCreated;
        }
        
        return (productAddressArray, productNameArray, productDescArray, productActivetArray, productDateCreatedArray, length); 
    }
     
    //***********************/
     
     
     
    //***********************
    //* Private functions       
    //*
    
    //***********************/
    

}
