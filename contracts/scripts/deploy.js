const fs = require('fs');
const path = require('path');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);
    const Contract = await ethers.getContractFactory("HealthInsurance");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();
    console.log("Deployed to:", contract.target);

    const artifact = await artifacts.readArtifact("HealthInsurance");
    const data = { address: contract.target, abi: artifact.abi };
    fs.writeFileSync(
      path.resolve(__dirname, '../../frontend/src/abi/HealthInsurance.json'),
      JSON.stringify(data, null, 2)
    );
    console.log("✅ Saved to frontend/src/abi/HealthInsurance.json");
}

main()
  .then(() => process.exit(0))
  .catch(err => { console.error(err); process.exit(1); });


