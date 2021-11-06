// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkyfireDAOToken is ERC20, Ownable {
    constructor() ERC20("Skyfire Dummy Rewards Token", "SDT") {
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // sets the balance of the address
    // this mints/burns the amount depending on the current balance
    function setBalance(address to, uint amount) public onlyOwner {
        uint old = balanceOf(to);
        if (old < amount) {
            _mint(to, amount - old);
        } else if (old > amount) {
            _burn(to, old - amount);
        }
    }
}
