//SPDX-License-Identifier: MIT
pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

interface IPartnersAgreementFactory {

    function createPartnersAgreement(
        uint256 _version,
        address _partnersContract,
        address _owner,
        address _communityAddress,
        uint256 _rolesCount,
        uint256 _numberOfActions,
        address _membershipFactory,
        address _interactionsContract,
        address _membershipContract,
        address _interactionsQueryServer
    ) external returns (address);
}
