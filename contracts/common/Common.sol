pragma solidity ^0.4.8;

//*********************************************************************
//* @title Common
//* @dev library
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************

library Common {

    enum State {
        QUOTE,
        PROPOSAL,
        ACCEPTED,
        ACTIVE,
        CANCELLED
    }
}