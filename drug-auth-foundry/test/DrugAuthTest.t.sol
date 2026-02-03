// test/DrugAuthTest.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/DrugAuth.sol";

contract DrugAuthTest is Test {
    DrugAuth drugAuth;

    function setUp() public {
        drugAuth = new DrugAuth();
    }

    function testName() public {
        assertEq(drugAuth.name(), "Drug Authentication");
    }
}
