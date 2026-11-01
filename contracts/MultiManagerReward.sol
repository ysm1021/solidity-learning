// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MultiManagerReward {
    uint256 public rewardPerBlock;
    
    address[] public managerList;
    mapping(address => bool) public isManager;
    mapping(address => bool) public isConfirmed;
    
    uint256 public confirmationCount;

    // 1. 3명 이상의 manager를 등록
    constructor(address[] memory _managers) {
        require(_managers.length >= 3, "At least 3 managers required");
        for (uint256 i = 0; i < _managers.length; i++) {
            address manager = _managers[i];
            require(manager != address(0), "Invalid address");
            require(!isManager[manager], "Duplicate manager");

            isManager[manager] = true;
            managerList.push(manager);
        }
    }

    // 매니저 승인 함수
    function confirm() external {
        require(isManager[msg.sender], "You are not a manager");
        require(!isConfirmed[msg.sender], "Already confirmed");

        isConfirmed[msg.sender] = true;
        confirmationCount++;
    }

    // 요구사항: onlyAllConfirmed modifier
    modifier onlyAllConfirmed() {
        require(isManager[msg.sender], "You are not a manager");
        require(confirmationCount == managerList.length, "Not all confirmed yet");
        _;
    }

    function setRewardPerBlock(uint256 _amount) external onlyAllConfirmed {
        rewardPerBlock = _amount;
    }
}