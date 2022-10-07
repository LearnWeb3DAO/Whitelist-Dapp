const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Whitelist", function () {

  async function deployWhitelistWith10Positions() {

    // Contracts are deployed using the first signer/account by default (owner in this case)
    const [owner, otherAccount] = await ethers.getSigners();

    const maxWhitelistedAddresses = 10
    const Whitelist = await ethers.getContractFactory("Whitelist");
    const whitelist = await Whitelist.deploy(maxWhitelistedAddresses);

    return { whitelist, maxWhitelistedAddresses, owner, otherAccount };
  }

  it("Should set the right maxWhitelistedAddresses", async function () {
    const {  whitelist, maxWhitelistedAddresses, owner, otherAccount } = await loadFixture(deployWhitelistWith10Positions);

    expect(await whitelist.maxWhitelistedAddresses()).to.equal(maxWhitelistedAddresses);
  })

  it("Should addAddressToWhitelist", async function () {

    const {  whitelist, maxWhitelistedAddresses, owner, otherAccount } = await loadFixture(deployWhitelistWith10Positions);

    await whitelist.addAddressToWhitelist()

    const addedContract = await whitelist.whitelistedAddresses(owner.address); 
    expect(addedContract).to.be.true

    // Check that the otherAccount is not on the Whitelist
    const notAddedContract = await whitelist.whitelistedAddresses(otherAccount.address); 
    expect(notAddedContract).to.be.false

    expect(await whitelist.numAddressesWhitelisted()).to.be.equal(1)
  })

  it("Should revert if we try to addAddressToWhitelist more than 1 time", async function () {
    const {  whitelist, maxWhitelistedAddresses, owner, otherAccount } = await loadFixture(deployWhitelistWith10Positions);

    await whitelist.addAddressToWhitelist()
    await expect(whitelist.addAddressToWhitelist()).to.be.revertedWith("Sender has already been whitelisted");
  })

  it("Should revert if we try to addAddressToWhitelist and the list is full", async function () {

    const [owner, otherAccount] = await ethers.getSigners();
    const maxWhitelistedAddresses = 1
    const Whitelist = await ethers.getContractFactory("Whitelist");
    const whitelist = await Whitelist.deploy(maxWhitelistedAddresses);

    await whitelist.addAddressToWhitelist()

    await expect(whitelist.connect(otherAccount).addAddressToWhitelist()).to.be.revertedWith("More addresses cant be added, limit reached");
  })

})