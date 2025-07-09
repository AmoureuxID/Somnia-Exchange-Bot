# Somnia Exchange Bot

An automated Node.js bot designed to perform continuous wrapping and swapping tasks on the Somnia Testnet. Built for farming interaction points, it automates the core DeFi actions on the Somnia Exchange.

---

## 🚀 Features

- **Automated DeFi Interactions**  
  Performs a cycle of on-chain actions to build a rich transaction history:
    - **Wrapping & Unwrapping:** Converts STT <> WSTT automatically.
    - **Swapping:** Executes swaps between STT <> NIA.

- **Automated Point Claiming**  
  After every successful transaction, the bot automatically attempts to claim `make-swap` task points from the Somnia API.

- **Modular Configuration via `config.json`**  
  Easily enable/disable specific tasks (wrap, swap, etc.), set transaction counts, and define amounts directly from a single config file.

- **Continuous Looping & Delays**  
  Runs in a continuous loop with customizable delays between transactions, modules, and full cycles to mimic human behavior.

- **Simple & Clean CLI**  
  Minimalist and easy-to-read terminal output to monitor bot activity.

---

## 🏁 Getting Started

### 1. Explore the Somnia Exchange

Familiarize yourself with the dApp and its features.  
👉 Go to [Somnia Exchange](https://somnia.exchange/)

### 2. Join the AmoureuxID Community

For updates, tips, and airdrop info:  
🔗 [Join AmoureuxID on Telegram](https://t.me/AmoureuxID)

---

## ⚙️ Installation

### Prerequisites

- Node.js (v16.x or newer)
- npm

### 1. Clone & Install

```bash
git clone https://github.com/AmoureuxID/Somnia-Exchange-Bot.git
cd Somnia-Exchange-Bot
npm install ethers dotenv axios
```

### 2. Configuration

#### a. Environment Variables (`.env` file)

Create a `.env` file in the project root. Add your wallet's private key.

```env
# Add your wallet private key here (without the 0x prefix)
PRIVATE_KEY=your_private_key_here
```

#### b. Main Configuration (`config.json` file)

This file is the control center for the bot. You can customize all bot actions here.

```json
{
  "loopSettings": {
    "enabled": true,
    "delayBetweenCyclesInSeconds": { "min": 300, "max": 600 }
  },
  "mainSettings": {
    "delayBetweenModulesInSeconds": { "min": 5, "max": 10 },
    "delayBetweenTransactionsInSeconds": { "min": 5, "max": 10 }
  },
  "modules": {
    "wrapSTT": {
      "enabled": true,
      "count": 1,
      "amount": "0.01"
    },
    "swapSttToNia": {
      "enabled": true,
      "count": 2,
      "amount": { "min": 0.01, "max": 0.02 }
    }
    // ... etc
  }
}
```
- **`loopSettings`**: Set `enabled` to `true` to run the bot continuously.
- **`mainSettings`**: Control the delays between different stages of the bot.
- **`modules`**: Enable or disable specific tasks (`"enabled": true/false`) and set how many times each task should run (`"count": 5`).

---

## 🖥️ Usage

Start the bot with:
```bash
node index.js
```

**Bot flow in the terminal:**
- The bot will start a cycle, displaying your initial token balances.
- It will execute each enabled module (wrap, swap, unwrap) in the specified order.
- For each transaction, it will print the transaction hash and attempt to claim points.
- After completing a full cycle, it will wait for the configured delay and then start the next cycle.

---

## 📁 Project Structure

```
Somnia-Exchange-Bot/
├── index.js           # Main bot script
├── config.json       # Main configuration file for tasks and delays
├── .env              # Your secret private key
├── package.json      # Project dependencies
└── README.md         # This documentation file
```

---

## ⚠️ Important Notes

- **For educational purposes only! Use at your own risk.**
- Testnet Instability: Testnets can be slow or unstable. Some transactions may fail due to network issues.
- Respect platform limitations & ToS. The bot includes delays between actions to avoid spamming the network, but use it responsibly.

---

## ❓ FAQ & Troubleshooting

- **"JSON Parse Error" or "Cannot read properties of undefined"**  
  This is almost always a syntax error in your `config.json` file. Check for missing commas (`,`) or closing curly braces (`}`). You can use an online JSON validator to check your file.

- **"Insufficient balance..." or "Insufficient NIA..."**  
  Your wallet doesn't have enough STT, WSTT, or NIA to perform the transaction. Make sure you have claimed from a faucet or have sufficient funds for the amounts you've configured.

- **"Error: Point claim failed..."**  
  This can happen if the Somnia API is temporarily down or if there's an issue with the request. The bot will continue its on-chain tasks regardless.

---

## 🤗 Contributing

1. Fork this repository.
2. Create a new feature branch (`git checkout -b feature/NewFeature`).
3. Commit and push your changes.
4. Open a Pull Request.

---

## 📜 License & Attribution

For educational purposes only — use at your own risk.  
Developed by **AmoureuxID**.

---

## 📬 Support & Contact

- Telegram: [@AmoureuxID](https://t.me/AmoureuxID)
- GitHub Issues: [Open an Issue](https://github.com/AmoureuxID/Somnia-Exchange-Bot/issues)

---

## 🧋 Buy Me a Coffee

If you find this project helpful, your support is appreciated!

- **EVM:** 0xcee2713694211aF776E0a3c1B0E4d9B5B45167c1
- **TON:** UQAGw7KmISyrILX807eYYY1sxPofEGBvOUKtDGo8QPtYY_SL
- **SOL:** 9fYY9YkPmaumkPUSqjD6oaYxvxNo3wETpC9A7nE3Pbza
- **SUI:** 0x2f4b127951b293e164056b908d05c826011a258f81910f2685a8c433158a7b9b

---

⭐ If you enjoy this project, please star the repository!

**à la folie.**