pragma solidity ^0.4.25;

import "./mortal.sol";

/** @title Chequebook for Ethereum micropayments
  * @author Daniel A. Nagy <daniel@ethereum.org>, Dean Vaessen <hello@deanvaessen.com>
  */

contract chequebook is mortal {

    constructor( string alias ) public {
        // We register an alias for the cheque book, a string signed with the owner's private key
        emit AliasRegistered( alias );
    }

    event AliasRegistered( string alias );

    // Cumulative paid amount in wei to each beneficiary
    mapping ( address => uint256 ) public sent;

    /// @notice Overdraft event
    event Overdraft( address deadbeat );

    // Allow sending ether to the chequebook.
    function() public payable { }


    /** @notice Cash cheque
      * @param beneficiary beneficiary address
      * @param amount cumulative amount in wei
      * @param sig_v signature parameter v
      * @param sig_r signature parameter r
      * @param sig_s signature parameter s
      *
      * The digital signature is calculated on the concatenated triplet of:
      * contract address, beneficiary address and cumulative amount
      */
    function cash( address beneficiary, uint256 amount, uint8 sig_v, bytes32 sig_r, bytes32 sig_s ) public {

        // Check if the cheque is old.
        // Only cheques that are more recent than the last cashed one are considered.
        require( amount > sent[ beneficiary ]);

        // Check the digital signature of the cheque.
        bytes32 hash = keccak256( abi.encodePacked( address( this ), beneficiary, amount ) );
        require( owner == ecrecover( hash, sig_v, sig_r, sig_s ) );

        // Attempt sending the difference between the cumulative amount on the cheque
        // and the cumulative amount on the last cashed cheque to beneficiary.
        uint256 diff = amount - sent[ beneficiary ];

        if ( diff <= address( this ).balance ) {
            // update the cumulative amount before sending
            sent[ beneficiary ] = amount;
            beneficiary.transfer( diff );
        } else {
            // Upon failure, punish owner for writing a bounced cheque.
            // owner.sendToDebtorsPrison();
            emit Overdraft( owner );
            // Compensate beneficiary.
            selfdestruct( beneficiary );
        }
    }
}