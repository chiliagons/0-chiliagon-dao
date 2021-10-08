//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

interface IComptroller{
    function buyShares(
        address[] calldata _buyers, uint256[] calldata _investmentAmounts, uint256[] calldata _minSharesQuantities
    ) external returns (uint256[] memory sharesReceivedAmounts_);
    function redeemShares()
        external
        returns (address[] memory payoutAssets_, uint256[] memory payoutAmounts_);
    function redeemSharesDetailed(
        uint256 _sharesQuantity,
        address[] calldata _additionalAssets,
        address[] calldata _assetsToSkip
    ) external returns (address[] memory payoutAssets_, uint256[] memory payoutAmounts_);
}


/***dev This contract allows one to deposit into the enzyme vault managed
* by chiligon. Next, it allows one to set Amount per project and how much of pie each project
* has. Then logic is implemented to redeem the amounts partially based on project completion
* and at a periodic rate.
*/
contract EnzymeVaultManager is Ownable, ReentrancyGuard {
  using SafeERC20 for IERC20;

    struct ProjectDetails {
      uint256 sliceOfThePiePerProject;
      uint256 sliceRedeemed;
      uint256 deadline;
    }
    mapping(uint32 => ProjectDetails) public projectDetails;
    IComptroller public enzymeVault;
    IERC20 public weth;

    constructor(address _IComptroller, address _weth) {
      enzymeVault = IComptroller(_IComptroller);
      weth =  IERC20(_weth);
    }

    function setAttributes(uint32 _projectId, uint256 _deadline) public returns(bool){
      projectDetails[_projectId].deadline = _deadline;
      return true;
    }

    function setApproval(address approvedToVault, uint256 amount) public onlyOwner() {
      weth.approve(approvedToVault, amount);
    }

    /***
    *dev for now we only allow WETH deposits */
    function depositFunds(uint256 amountToDeposit) public returns(bool){
      require(weth.allowance(msg.sender,address(this)) >= amountToDeposit, "Not enough allowance");
      console.log("Allowance check done");
      weth.transferFrom(msg.sender, address(this), amountToDeposit);
      console.log("Transfer check done");
      //Allow transfer of WETH from this vault to the actual vault
      address[] memory buyers = new address[](1);
      uint256[] memory amountToBuy = new uint256[](1);
      uint256[] memory minAmountToBuy = new uint256[](1);
  
      buyers[0]=address(this);
      amountToBuy[0]=amountToDeposit;
      minAmountToBuy[0]=amountMin;

      enzymeVault.buyShares(buyers, amountToBuy, minAmountToBuy);
      return true;
      return true;
    }

    /***
    *dev for now we redeem all amounts to contract
    */
    function redeemAllFunds() public nonReentrant() onlyOwner() returns(bool){
      enzymeVault.redeemShares();
      return true;
    }

    /***
    *dev Todo:Implement a redemtion shares function that redeems
    * funds for my project till an allowed proportion as per the work done
    * these funds are then transferred to the superfluid distributor address
    */

    function redeemSharesForMyProject() public nonReentrant() onlyOwner() returns(bool){
      // enzymeVault.redeemShares();
      return true;
    }


}