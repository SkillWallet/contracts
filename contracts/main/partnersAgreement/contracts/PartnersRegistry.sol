//SPDX-License-Identifier: MIT
pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "../interfaces/IPartnersRegistry.sol";
import "../interfaces/IPartnersAgreementFactory.sol";
import "../interfaces/IPartnersAgreement.sol";
import "../../../imported/CommonTypes.sol";
import "../../Community.sol";

contract PartnersRegistry is IPartnersRegistry, Initializable {
    //versioning
    uint256 public version;

    // agreements
    address[] public agreements;
    mapping(address => uint256) public agreementIds;

    // factories
    address public partnersAgreementFactory;
    address skillWalletAddress;

    function initialize(
        address _skillWalletAddress,
        address _partnersAgreementFactoryAddress
    ) public initializer {
        skillWalletAddress = _skillWalletAddress;
        partnersAgreementFactory = _partnersAgreementFactoryAddress;

        version = 1;
    }

    //TODO: for tests only should be removed one upgradability is implemented
    //Also possible to create PA factory and move version there
    function setVersion(uint256 _version) public override {
        version = _version;
    }

    function setPAFactory(address factory) public {
        partnersAgreementFactory = factory;
    }

    function getPartnerAgreementAddresses()
        public
        view
        override
        returns (address[] memory)
    {
        return agreements;
    }

    function create(
        string memory metadata,
        uint256 template,
        uint256 rolesCount,
        uint256 commitmentLevel,
        address partnersContractAddress,
        uint256 membersAllowed,
        uint256 coreTeamMembers,
        bool isPermissioned
    ) public override {
        require(
            template >= 0 && template <= 2,
            "Template should be between 0 and 2"
        );
        require(
            commitmentLevel > 0 && commitmentLevel <= 10,
            "CommitmentLevel should be between 1 and 10"
        );
        address communityAddress = address(
            new Community(
                metadata,
                template,
                membersAllowed,
                msg.sender,
                address(0),
                version,
                skillWalletAddress,
                isPermissioned,
                coreTeamMembers
            )
        );

        if (partnersContractAddress == address(0))
            partnersContractAddress = communityAddress;

        address[] memory partnersContracts = new address[](1);
        partnersContracts[0] = partnersContractAddress;
        address paAddr = IPartnersAgreementFactory(partnersAgreementFactory)
            .createPartnersAgreement(
                skillWalletAddress,
                Types.PartnersAgreementData(
                    version,
                    msg.sender,
                    communityAddress,
                    partnersContracts,
                    rolesCount,
                    address(0),
                    commitmentLevel
                )
            );

        agreementIds[paAddr] = agreements.length;
        agreements.push(paAddr);

        emit PartnersAgreementCreated(paAddr, communityAddress);
    }

    function migrate(address _agreement, bool _migrateCommunity)
        public
        override
    {
        uint256 agreementId = agreementIds[_agreement];

        require(
            agreements[agreementId] == _agreement,
            "wrong agreement address"
        );

        Types.PartnersAgreementData memory pa = IPartnersAgreement(_agreement)
            .getAgreementData();

        require(pa.version < version, "already latest version");
        require(pa.owner == msg.sender, "not agreement owner");

        if (_migrateCommunity) {
            address commAddr = IPartnersAgreement(_agreement)
                .communityAddress();

            address newComm = address(
                new Community(
                    "",
                    0,
                    0,
                    address(0),
                    commAddr,
                    version,
                    address(0),
                    false,
                    0
                )
            );

            pa.communityAddress = newComm;
        }
        pa.version = version;

        // todo: fix hard coded core team members
        address agreement = IPartnersAgreementFactory(partnersAgreementFactory)
            .createPartnersAgreement(skillWalletAddress, pa);

        agreements[agreementId] = agreement;
        delete agreementIds[_agreement];
        agreementIds[agreement] = agreementId;
    }
}
