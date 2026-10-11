const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MTToken approve and transferFrom test", function () {
  let mtToken;
  let signer0;
  let signer1;

  beforeEach(async function () {
    [signer0, signer1] = await ethers.getSigners();

    const MTToken = await ethers.getContractFactory("MTToken");
    mtToken = await MTToken.deploy();

    await mtToken.waitForDeployment();
  });

  it("signer1 transfers signer0's MTToken to signer1 using approve and transferFrom", async function () {
    const amount = ethers.parseEther("10");

    const signer0Address = await signer0.getAddress();
    const signer1Address = await signer1.getAddress();

    const signer0BalanceBefore = await mtToken.balanceOf(signer0Address);
    const signer1BalanceBefore = await mtToken.balanceOf(signer1Address);

    await mtToken.connect(signer0).approve(signer1Address, amount);

    expect(
      await mtToken.allowance(signer0Address, signer1Address)
    ).to.equal(amount);

    await mtToken.connect(signer1).transferFrom(
      signer0Address,
      signer1Address,
      amount
    );

    const signer0BalanceAfter = await mtToken.balanceOf(signer0Address);
    const signer1BalanceAfter = await mtToken.balanceOf(signer1Address);

    expect(signer0BalanceAfter).to.equal(signer0BalanceBefore - amount);
    expect(signer1BalanceAfter).to.equal(signer1BalanceBefore + amount);
  });
});
