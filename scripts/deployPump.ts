import { ethers, network, upgrades } from "hardhat"
import fs from "fs"
import hre from "hardhat"
import { PumpCloneFactory } from "../typechain-types"
import { executeTx } from "./util"

async function main() {
	console.log("Starting deployments")
	const accounts = await hre.ethers.getSigners();
	const deployer = accounts[0];
	const routerAddress = "0xfb8e1c3b833f9e67a71c859a132cf783b645e436"
	const PumpFactoryAddress = "0x802Bbb3924BEE46831cadD23e9CfA9e74B499Efb";

	const PumpFactoryFactory = await ethers.getContractFactory("PumpCloneFactory");
	// const PumpFactory = await PumpFactoryFactory.deploy(routerAddress) as PumpCloneFactory;
	// await PumpFactory.waitForDeployment();
	const PumpFactory = PumpFactoryFactory.attach(PumpFactoryAddress) as PumpCloneFactory;
	console.log("This is PumpFactory address: ", await PumpFactory.getAddress())

	// await executeTx(PumpFactory.connect(deployer).launchToken("First Token", "FST"));
	// console.log("launched token");

	const tokenAddress = "0x46D2Ca057c9B5321C9E66B7203ddEB0AaE4B42ae";
	const token = await ethers.getContractAt("IERC20", tokenAddress);
	await executeTx(PumpFactory.connect(deployer).buyToken(tokenAddress, { value: ethers.parseEther('0.01') }));
	console.log('bought token');

	await executeTx(token.connect(deployer).approve(await PumpFactory.getAddress(), ethers.parseEther('100000000000000')));
	console.log('approved');

	await executeTx(PumpFactory.connect(deployer).sellToken(tokenAddress, ethers.parseEther('100000000')));
	console.log('sold token');

	await executeTx(PumpFactory.connect(deployer).buyToken(tokenAddress, { value: ethers.parseEther('0.04') }));
	console.log('bought token');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
