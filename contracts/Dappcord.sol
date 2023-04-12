// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Dappcord is ERC721 {
    address public owner;
    uint public totalChannels;
    uint public totalSupply;
    struct Channel{
        uint id;
        string name;
        uint cost;
    }

    mapping(uint => Channel) public channels;
    mapping(uint => mapping(address => bool)) public hasJoined;
    
    constructor(string memory _name,string memory _symbol)
        ERC721(_name, _symbol)
        {
            owner = msg.sender ;
        }    

    modifier onlyOwner{
        require(msg.sender == owner,"YOu are not the owner");
        _;
    }
    function createChannel(string memory _name,uint _cost) public onlyOwner{ 
        
        totalChannels++;
        channels[totalChannels] = Channel(totalChannels,_name,_cost);
    } 

    function mint(uint _id) public payable {
        //_id refers channel id
        require(_id != 0 && _id <= totalChannels,"Wrong ID");
        require(hasJoined[_id][msg.sender] == false, "Already joined");
        require(msg.value >= channels[_id].cost,"Not enough money");


        hasJoined[_id][msg.sender] = true ;
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function getChannel(uint _id) public view returns(Channel memory){
        return channels[_id];
    } 

    function withdraw() public onlyOwner {
        (bool success,) = owner.call{value : address(this).balance}("");
        require(success);
    }
}
