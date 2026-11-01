const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiManagerReward Contract", function () {
  let rewardContract;
  let owner, manager1, manager2, manager3, nonManager;

  beforeEach(async function () {
    [owner, manager1, manager2, manager3, nonManager] = await ethers.getSigners();

    const MultiManagerReward = await ethers.getContractFactory("MultiManagerReward");
    // 3명의 매니저 등록
    rewardContract = await MultiManagerReward.deploy([
      manager1.address,
      manager2.address,
      manager3.address
    ]);
  });

  it("매니저가 아닌 주소가 실행 시 'You are not a manager' 에러 발생", async function () {
    await expect(
      rewardContract.connect(nonManager).setRewardPerBlock(100)
    ).to.be.revertedWith("You are not a manager");
  });

  it("모든 매니저가 confirm하지 않은 상황에서 실행 시 'Not all confirmed yet' 에러 발생", async function () {
    await rewardContract.connect(manager1).confirm();
    await rewardContract.connect(manager2).confirm();

    await expect(
      rewardContract.connect(manager3).setRewardPerBlock(100)
    ).to.be.revertedWith("Not all confirmed yet");
  });

  it("모든 매니저가 confirm을 완료하면 정상적으로 setRewardPerBlock 실행", async function () {
    await rewardContract.connect(manager1).confirm();
    await rewardContract.connect(manager2).confirm();
    await rewardContract.connect(manager3).confirm();

    await rewardContract.connect(manager1).setRewardPerBlock(100);
    expect(await rewardContract.rewardPerBlock()).to.equal(100);
  });
});