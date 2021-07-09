# Overview
The SkillWallet is a permissionless, open-source protocol for the creation of universal, self-sovereign Identities - based on Skills instead of personal data. <br/>
It comes as an upgradable, Non-Transferable, Non-Fungible-Token (U-NT-NFT) - and it entiles native sybil-resistant properties. <br/>
Moreover, in order to receive their NT-NFT, individual users need to join a Community/Protocol/Platform. By being part of a Community, they can participate in Gigs/Tasks/Projects, that in return provide them Credits (DITO) - in the form of ERC777 - that they can spend across the whole network, including the Partners that integrate the SkillWallet package in their existing Contract. <br/>
Once an individual member's skills are validated (simply by contributing to Gigs), they will be able to spend their Credits, create new tasks/projects, and move to a different Community seamlessly, without losing the Credits & the reputation earned. <br/>
The sybyl-resistance features, together with the portability of the Skills & Benefits acquired, makes the SkillWallet the complementary missing piece in the Multiverse, and the NFT space at large.

## Steps
Behind the hoods, the protocol follows these steps:
- New SkillWallet ID is initiated as a Non-Transferable NFT (NT-NFT), within the community, and initially labeled inactive. 
- By installing the SkillWallet mobile app, a key pair is generated and the public key is stored on-chain and associated to the skill wallet token Id of the user.
- A unique nonce is generated and encoded in a QR code, shown on the Web App
- By scanning the QR code the mobile app signs the nonce and a Chainlink external adapter recovers the pubKey from the signature and verifies it
- If the validation passes the SkillWallet is marked as Active and from now on can be used for signing further transactions.
- At this point, new users will receive their personal NFT ID – and own, de-facto, their universal, non-transferable, self-sovereign identity on the Blockchain.

## Imports

`import skill-wallet/contracts/main/ISkillWallet.sol` <br/>
`import skill-wallet/contracts/main/SkillWallet.sol` <br/>
`import skill-wallet/contracts/main/ISWActionExecutor.sol` <br/>

## Flow

1. After creating and activating the skillWallet through the SW app & DiTo Web, the app can trigger the off-chain signature mechanism
2. The user scans a QR code with encoded nonce & action and the app calls the validate function from the SkillWallet.sol contract
3. The Validate function triggers the external adapter and verifies the signature. 
4. The chainlink callback calls the coresponding SWActionExecutor depending on the action 
4. The contract which is executing the request should implement ISWActionExecutor (The actions are predefined by the SkillWallet contract)
5. By implementing the interface, the contract will be able to gain the benefits of fast and secure, UX friendly signature mechanism.
<br/><br/>
The SkillWallet.sol contract can be used for getting the SW data such as check if it's activated, skillSet, current and history of communities.


## Chainlink 

1. Kovan: <br/> <br/>

Oracle: 0xF405B99ACa8578B9eb989ee2b69D518aaDb90c1F <br/>
JobID: e1b99d23a00549ad97cc2519d7d4f767 <br/>
LinkToken: 
0xa36085f69e2889c224210f603d836748e7dc0088


2. Mumbai <br/> <br/>

Oracle: 0xc8D925525CA8759812d0c299B90247917d4d4b7C <br/>
JobID: 31061086cb2749f7a3f99f2d5179caf7 <br/>
LinkToken: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
