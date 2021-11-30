const { expectEvent, singletons, constants } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
const { artifacts } = require('hardhat');
const { ZERO_ADDRESS } = constants;
const truffleAssert = require('truffle-assertions');

const MinimumCommunity = artifacts.require('MinimumCommunity');
const LinkToken = artifacts.require('LinkToken');
const MockOracle = artifacts.require('MockOracle');
const PartnersAgreement = artifacts.require('PartnersAgreement');
const RoleUtils = artifacts.require('RoleUtils');
const InteractionNFT = artifacts.require('InteractionNFT');
const Membership = artifacts.require('Membership');
const MembershipFactory = artifacts.require('MembershipFactory');
const SkillWallet = artifacts.require('skill-wallet/contracts/main/SkillWallet');
const metadataUrl = "https://hub.textile.io/thread/bafkwfcy3l745x57c7vy3z2ss6ndokatjllz5iftciq4kpr4ez2pqg3i/buckets/bafzbeiaorr5jomvdpeqnqwfbmn72kdu7vgigxvseenjgwshoij22vopice";
var BN = web3.utils.BN;

contract('Interactions', function (accounts) {
    before(async function () {
        this.erc1820 = await singletons.ERC1820Registry(accounts[1]);

        this.linkTokenMock = await LinkToken.new()
        this.mockOracle = await MockOracle.new(this.linkTokenMock.address)

        this.skillWallet = await SkillWallet.new(this.linkTokenMock.address, this.mockOracle.address);

        this.minimumCommunity = await MinimumCommunity.new(this.skillWallet.address);
        //this.roleUtils = await RoleUtils.new();

        //PartnersAgreement.link(this.roleUtils);
        this.membershipFactory = await MembershipFactory.new(1);

        this.partnersAgreement = await PartnersAgreement.new(
            1,
            ZERO_ADDRESS, // partners contract
            accounts[0],
            this.minimumCommunity.address,
            3,
            100,
            this.membershipFactory.address,
            ZERO_ADDRESS,
            ZERO_ADDRESS,
            accounts[3]
        );

        this.membership = await Membership.at(await this.partnersAgreement.membershipAddress());

        const community = await MinimumCommunity.at(await this.partnersAgreement.communityAddress());
        await community.joinNewMember('', 2000, { from: accounts[0] });
        await this.partnersAgreement.activatePA({ from: accounts[0] });

        await this.linkTokenMock.transfer(
            this.partnersAgreement.address,
            '2000000000000000000',
        )

    });
    describe('Interaction tests', async function () {

        it("PartnersAgreement should deploy and mint correct amount of InteractionNFTs when the roles are 3", async function () {
            const partnersAgreement = await PartnersAgreement.new(
                1,
                ZERO_ADDRESS, // partners contract
                accounts[0],
                this.minimumCommunity.address,
                3,
                100,
                this.membershipFactory.address,
                ZERO_ADDRESS,
                ZERO_ADDRESS,
                accounts[3]
            );

            const community = await MinimumCommunity.at(await partnersAgreement.communityAddress());
            await partnersAgreement.activatePA();

            const interactionNFTAddress = await partnersAgreement.getInteractionNFTContractAddress();
            const interactionNFTContract = await InteractionNFT.at(interactionNFTAddress);

            const balanceRole0 = await interactionNFTContract.balanceOf(partnersAgreement.address, 1);
            const balanceRole1 = await interactionNFTContract.balanceOf(partnersAgreement.address, 2);
            const balanceRole2 = await interactionNFTContract.balanceOf(partnersAgreement.address, 3);


            const totalSupply0 = await interactionNFTContract.totalSupply(1);
            const totalSupply1 = await interactionNFTContract.totalSupply(2);
            const totalSupply2 = await interactionNFTContract.totalSupply(3);

            assert.equal(balanceRole0.toString(), totalSupply0.toString());
            assert.equal(balanceRole1.toString(), totalSupply1.toString());
            assert.equal(balanceRole2.toString(), totalSupply2.toString());

            assert.equal(balanceRole2.toString(), '14');
            assert.equal(balanceRole1.toString(), '29');
            assert.equal(balanceRole0.toString(), '57');

        });
        it("PartnersAgreement should deploy and mint correct amount of InteractionNFTs when the roles are 2", async function () {
            const partnersAgreement = await PartnersAgreement.new(
                1,
                ZERO_ADDRESS, // partners contract
                accounts[1],
                this.minimumCommunity.address,
                2,
                100,
                this.membershipFactory.address,
                ZERO_ADDRESS,
                ZERO_ADDRESS,
                accounts[3],
                { from: accounts[0] }
            );

            const community = await MinimumCommunity.at(await partnersAgreement.communityAddress());
            await community.joinNewMember('', 2000, { from: accounts[1] });
            await partnersAgreement.activatePA({ from: accounts[1] });

            const interactionNFTAddress = await partnersAgreement.getInteractionNFTContractAddress();
            const interactionNFTContract = await InteractionNFT.at(interactionNFTAddress);

            const balanceRole0 = await interactionNFTContract.balanceOf(partnersAgreement.address, 1);
            const balanceRole1 = await interactionNFTContract.balanceOf(partnersAgreement.address, 2);

            const totalSupply0 = await interactionNFTContract.totalSupply(1);
            const totalSupply1 = await interactionNFTContract.totalSupply(2);

            assert.equal(balanceRole0.toString(), totalSupply0.toString());
            assert.equal(balanceRole1.toString(), totalSupply1.toString());

            assert.equal(balanceRole1.toString(), '43');
            assert.equal(balanceRole0.toString(), '57');

        });
    });
});
