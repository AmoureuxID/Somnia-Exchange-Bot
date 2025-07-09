// ===================================================================================
// ===                  Somnia Exchange Bot - AmoureuxID                         ===
// ===================================================================================

// 1. LIBRARY IMPORTS
require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const axios = require('axios');

// 2. CONFIG & ENVIRONMENT
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// 3. MINIMALIST LOGGER
const logger = {
  banner: () => {
    console.log("╔═════════════════════════════════════════════╗");
    console.log("║        Somnia Exchange Bot - AmoureuxID     ║");
    console.log("╚═════════════════════════════════════════════╝");
  },
  balance: (stt, wstt, nia) => {
    console.log("\nBalance");
    console.log(`- STT  : ${stt}`);
    console.log(`- WSTT : ${wstt}`);
    console.log(`- NIA  : ${nia}`);
    console.log("=========================================\n");
  },
  moduleHeader: (msg) => console.log(`--- ${msg} ---`),
  txInfo: (msg) => console.log(msg),
  txSuccess: (hash) => console.log(`    ✅ https://shannon-explorer.somnia.network/tx/${hash}`),
  claimSuccess: (msg) => console.log(`    ✓ ${msg}`),
  error: (msg) => console.log(`    ❌ Error: ${msg}`),
  warn: (msg) => console.log(`    ⚠️  Warning: ${msg}`),
};

// 4. CONTRACT ABIs
const WSTT_ABI = ["function deposit() payable", "function withdraw(uint256 amount)", "function balanceOf(address owner) view returns (uint256)"];
const ROUTER_ABI = ['function getAmountsOut(uint amountIn, address[] calldata path) public view returns (uint[] memory amounts)', 'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)', 'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external'];
const ERC20_ABI = ['function balanceOf(address owner) view returns (uint256)', 'function approve(address spender, uint256 amount) external returns (bool)'];

// 5. HELPER & UTILITY FUNCTIONS
function silentDelay(minSeconds, maxSeconds) {
    const ms = (Math.random() * (maxSeconds - minSeconds) + minSeconds) * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

async function claimSwapPoints(address) {
    const API_URL = 'https://api.somnia.exchange/api/completeTask';
    const TASK_ID = "make-swap";
    const payload = { address: address, taskId: TASK_ID };
    const headers = { 'accept': 'application/json', 'origin': 'https://somnia.exchange', 'referer': 'https://somnia.exchange/', 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0' };
    try {
        const response = await axios.post(API_URL, payload, { headers });
        if (response.data.success) {
            const points = response.data.data?.task?.actualPointsAwarded || '??';
            logger.claimSuccess(`Points claimed (+${points}).`);
        } else {
            logger.warn(`Point claim failed (Server): ${response.data.message || 'Unknown message.'}`);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        logger.error(`Point claim failed: ${errorMessage}`);
    }
}


// 6. CORE LOGIC MODULES
async function handleWrap(wallet) {
    const { count, amount } = config.modules.wrapSTT;
    if (count <= 0) return;
    const contract = new ethers.Contract(config.contractAddresses.wrappedStt, WSTT_ABI, wallet);
    logger.moduleHeader(`Starting ${count}x Wrap STT > WSTT`);

    for (let i = 1; i <= count; i++) {
        try {
            logger.txInfo(`▶ [${i}/${count}] Wrapping ${amount} STT...`);
            const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
            const receipt = await tx.wait();
            logger.txSuccess(receipt.transactionHash);
            await claimSwapPoints(wallet.address);
            if (i < count) await silentDelay(config.mainSettings.delayBetweenTransactionsInSeconds.min, config.mainSettings.delayBetweenTransactionsInSeconds.max);
        } catch (error) {
            logger.error(`${error.reason || error.message}`);
        }
    }
}

async function handleUnwrap(wallet) {
    const { count, amount } = config.modules.unwrapSTT;
    if (count <= 0) return;
    const contract = new ethers.Contract(config.contractAddresses.wrappedStt, WSTT_ABI, wallet);
    logger.moduleHeader(`Starting ${count}x Unwrap WSTT > STT`);

    for (let i = 1; i <= count; i++) {
        try {
            logger.txInfo(`▶ [${i}/${count}] Unwrapping ${amount} WSTT...`);
            const amountToUnwrap = ethers.utils.parseEther(amount);
            const currentBalance = await contract.balanceOf(wallet.address);
            if (currentBalance.lt(amountToUnwrap)) {
                logger.warn(`Insufficient WSTT balance. Required: ${amount}, Available: ${ethers.utils.formatEther(currentBalance)}`);
                continue;
            }
            const tx = await contract.withdraw(amountToUnwrap);
            const receipt = await tx.wait();
            logger.txSuccess(receipt.transactionHash);
            await claimSwapPoints(wallet.address);
            if (i < count) await silentDelay(config.mainSettings.delayBetweenTransactionsInSeconds.min, config.mainSettings.delayBetweenTransactionsInSeconds.max);
        } catch (error) {
            logger.error(`${error.reason || error.message}`);
        }
    }
}

async function handleSwapSttToNia(wallet) {
    const { count, amount } = config.modules.swapSttToNia;
    if (count <= 0) return;
    const contract = new ethers.Contract(config.contractAddresses.router, ROUTER_ABI, wallet);
    logger.moduleHeader(`Starting ${count}x Swap STT > NIA`);

    for (let i = 1; i <= count; i++) {
        try {
            const randomAmount = getRandomNumber(amount.min, amount.max).toFixed(18);
            logger.txInfo(`▶ [${i}/${count}] Swapping ${parseFloat(randomAmount).toFixed(6)} STT to NIA...`);
            const amountInBN = ethers.utils.parseEther(randomAmount);
            const path = [config.contractAddresses.wstt, config.contractAddresses.nia];
            const amountsOut = await contract.getAmountsOut(amountInBN, path);
            const amountOutMin = amountsOut[1].sub(amountsOut[1].mul(config.mainSettings.slippageTolerancePercent).div(100));
            const tx = await contract.swapExactETHForTokens(amountOutMin, path, wallet.address, Math.floor(Date.now() / 1000) + 600, { value: amountInBN });
            const receipt = await tx.wait();
            logger.txSuccess(receipt.transactionHash);
            await claimSwapPoints(wallet.address);
            if (i < count) await silentDelay(config.mainSettings.delayBetweenTransactionsInSeconds.min, config.mainSettings.delayBetweenTransactionsInSeconds.max);
        } catch (error) {
            logger.error(`${error.reason || error.message}`);
        }
    }
}

async function handleSwapNiaToStt(wallet) {
    const { count, amount } = config.modules.swapNiaToStt;
    if (count <= 0) return;
    const routerContract = new ethers.Contract(config.contractAddresses.router, ROUTER_ABI, wallet);
    const niaContract = new ethers.Contract(config.contractAddresses.nia, ERC20_ABI, wallet);
    logger.moduleHeader(`Starting ${count}x Swap NIA > STT`);

    for (let i = 1; i <= count; i++) {
        try {
            const randomAmount = getRandomNumber(amount.min, amount.max).toFixed(18);
            logger.txInfo(`▶ [${i}/${count}] Swapping ${parseFloat(randomAmount).toFixed(4)} NIA to STT...`);
            const amountInBN = ethers.utils.parseEther(randomAmount);
            const currentNiaBalance = await niaContract.balanceOf(wallet.address);
            if (currentNiaBalance.lt(amountInBN)) {
                logger.warn(`Insufficient NIA. Required: ${parseFloat(randomAmount).toFixed(4)}, Have: ${ethers.utils.formatEther(currentNiaBalance)}`);
                continue;
            }
            const approveTx = await niaContract.approve(config.contractAddresses.router, amountInBN);
            await approveTx.wait();
            const path = [config.contractAddresses.nia, config.contractAddresses.wstt];
            const amountsOut = await routerContract.getAmountsOut(amountInBN, path);
            const amountOutMin = amountsOut[1].sub(amountsOut[1].mul(config.mainSettings.slippageTolerancePercent).div(100));
            const tx = await routerContract.swapExactTokensForETH(amountInBN, amountOutMin, path, wallet.address, Math.floor(Date.now() / 1000) + 600);
            const receipt = await tx.wait();
            logger.txSuccess(receipt.transactionHash);
            await claimSwapPoints(wallet.address);
            if (i < count) await silentDelay(config.mainSettings.delayBetweenTransactionsInSeconds.min, config.mainSettings.delayBetweenTransactionsInSeconds.max);
        } catch (error) {
            logger.error(`${error.reason || error.message}`);
        }
    }
}


// 7. MAIN ORCHESTRATOR FUNCTION
async function main() {
    logger.banner();

    if (!PRIVATE_KEY) {
        console.log("❌ FATAL: PRIVATE_KEY not found in .env file.");
        return;
    }

    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    let cycleCount = 1;

    while (true) {
        console.log(`\n--- Starting Cycle #${cycleCount} ---`);
        try {
            const sttBalance = await wallet.getBalance();
            const wsttContract = new ethers.Contract(config.contractAddresses.wstt, ERC20_ABI, provider);
            const wsttBalance = await wsttContract.balanceOf(wallet.address);
            const niaContract = new ethers.Contract(config.contractAddresses.nia, ERC20_ABI, provider);
            const niaBalance = await niaContract.balanceOf(wallet.address);

            logger.balance(
                ethers.utils.formatEther(sttBalance),
                ethers.utils.formatEther(wsttBalance),
                ethers.utils.formatEther(niaBalance)
            );

            const moduleExecutionOrder = [
                { name: "wrapSTT", handler: handleWrap, config: config.modules.wrapSTT },
                { name: "swapSttToNia", handler: handleSwapSttToNia, config: config.modules.swapSttToNia },
                { name: "swapNiaToStt", handler: handleSwapNiaToStt, config: config.modules.swapNiaToStt },
                { name: "unwrapSTT", handler: handleUnwrap, config: config.modules.unwrapSTT }
            ];

            for (let i = 0; i < moduleExecutionOrder.length; i++) {
                const module = moduleExecutionOrder[i];
                if (module.config.enabled && module.config.count > 0) {
                    await module.handler(wallet);
                    const isLastEnabledModule = moduleExecutionOrder.slice(i + 1).every(m => !m.config.enabled || m.config.count === 0);
                    if (!isLastEnabledModule) {
                        await silentDelay(config.mainSettings.delayBetweenModulesInSeconds.min, config.mainSettings.delayBetweenModulesInSeconds.max);
                    }
                }
            }

        } catch (error) {
            console.log("\n--- An error occurred during the cycle ---");
            console.log(`❌ ${error.message}`);
        }
        
        if (!config.loopSettings.enabled) {
            console.log("\n--- All tasks completed (Looping disabled) ---");
            break; 
        }

        console.log(`\n--- Cycle #${cycleCount} complete ---`);
        const delaySeconds = getRandomNumber(config.loopSettings.delayBetweenCyclesInSeconds.min, config.loopSettings.delayBetweenCyclesInSeconds.max);
        console.log(`Waiting for ${Math.round(delaySeconds / 60)} minutes before next cycle...`);
        await silentDelay(delaySeconds, delaySeconds);
        cycleCount++;
    }
}

// RUN SCRIPT
main();