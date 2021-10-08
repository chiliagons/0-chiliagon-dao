pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MTK is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 10000000 * 10 ** decimals());
    }
}