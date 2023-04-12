const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {
  let dappcord,deployer,user; 
  
  beforeEach(async ()=> {
      const Dappcord = await ethers.getContractFactory("Dappcord");
      dappcord = await Dappcord.deploy("DevCord","DC");
      [deployer,user] = await ethers.getSigners();

      const transaction = await dappcord.connect(deployer).createChannel("general",tokens(1));
      await transaction.wait();
      
  }) 
  
  describe("Deployment",() => {
      
      
      it("sets the name &symbol",async ()=>{
        // const Dappcord = await ethers.getContractFactory("Dappcord");
        // dappcord = await Dappcord.deploy("Devcord","DC")

        let result = await dappcord.name()
        expect(result).to.equal("DevCord");
        result = await dappcord.symbol();
        expect(result).to.equal("DC");

      });
      it("Sets owner ",async ()=> {
        let result = await dappcord.owner();
        expect(result).to.equal(deployer.address);
      });

      describe("Create Channels",()=>{

        it("Returns total channels",async ()=> {
            const result = await dappcord.totalChannels();
            expect(result).to.be.equal(1);
        });
      });

     
  });

  describe("Joining channels",() => {
      const Id = 1;
      const AMOUNT = ethers.utils.parseUnits('1','ether');

      beforeEach(async()=> {
        const transaction = await dappcord.connect(user).mint(Id,{value  :AMOUNT});
        await transaction.wait()
      })

      it("Joins the user",async ()=> {
        const result =await dappcord.hasJoined(Id,user.address);
        expect(result).to.be.equal(true);
      });

      it("Increases total supply",async ()=> {
        const result =await dappcord.totalSupply();
        expect(result).to.be.equal(1);
      });

      it("Updates contract balance",async ()=> {
        const result =await ethers.provider.getBalance(dappcord.address);
        expect(result).to.be.equal(AMOUNT);
      });
  });

  describe("Withrawing" , ()=>{
    const ID =1;
    const AMOUNT = ethers.utils.parseUnits('10','ether');
    let balanceBefore;

    beforeEach(async() => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await dappcord.connect(user).mint(ID,{ value : AMOUNT});
      await transaction.wait();

      transaction = await dappcord.connect(deployer).withdraw();
      await transaction.wait()
    });

    it("Update owner balance",async ()=> {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Update contract balance",async ()=> {
      const balanceOFContract = await ethers.provider.getBalance(dappcord.address);
      expect(balanceOFContract).to.be.equal(0);
    });

  });

})
