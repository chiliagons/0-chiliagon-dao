<div align="center">0-chiliagon-dao</div>

A simple DAO-DAO tool to create a flow for organizing and generating revenue for a DAO.
1. Creating a Gnosis Safe and enabling the Zodiac module - [See documentation](https://github.com/gnosis/zodiac-module-reality/blob/main/docs/setup_guide.md)
1. Setup the snapshot as per your requirements
1. Run the superfluid daemon on a server 
1. Create a snapshot proposal with the following template
```
Title
Proposal to develop a Gnosis Safe module for Connext

Body
{
  "address": ["",""],
  "shares":[80,20]
}

Transaction: 
Create a transaction to send funds from Gnosis Safe to Enzyme Vault Manager depositFunds function as WETH.
```
1. TODO: check state of proposal 
1. Superfluid daemon will pick up the proposal and create an IDA
1. No funds will be send because there are no funds in the distribution address
1. At the end of the development phase, we will create a withdraw of enzyme proposal
1. In this proposal we will create a transaction that withdraws and sends the increased amount to the Distribution Address

## Assumptions
1. The external DAO has accepted proposal and granted funds to our Gnosis Safe.
1. Only one proposal will be created at a time