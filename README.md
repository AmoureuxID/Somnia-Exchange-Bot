# Somnia Exchange Bot

An automated Node.js bot designed to perform continuous wrapping and swapping tasks on the Somnia Testnet. Built for farming interaction points, it automates the core DeFi actions on the Somnia Exchange.

---

## 🚀 Features

- **Automated DeFi Interactions**  
  Performs a cycle of on-chain actions to build a rich transaction history:
  - **Wrapping & Unwrapping**: Converts STT <> WSTT automatically.
  - **Swapping**: Executes swaps between STT <> NIA.

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
👉 [Somnia Exchange](https://somnia.exchange/)

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
npm install
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
    // Add more modules here
  }
}
```

- **`loopSettings`**: Set `enabled` to `true` to run the bot continuously.
- **`mainSettings`**: Control the delays between different stages of the bot.
- **`modules`**: Enable/disable specific tasks and set how many times each should run.

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
- After completing a full cycle, it will wait for the configured delay before starting the next one.

---

## 📁 Project Structure

```
Somnia-Exchange-Bot/
├── index.js           # Main bot script
├── config.json        # Task and delay settings
├── .env               # Your wallet private key
├── package.json       # Project dependencies
└── README.md          # This documentation file
```

---

## ⚠️ Important Notes

- **For educational purposes only! Use at your own risk.**
- Testnets can be unstable. Some transactions may fail.
- Respect Somnia's rules. Avoid spamming the network.

---

## ❓ FAQ & Troubleshooting

- **"JSON Parse Error" / "Cannot read properties of undefined"**  
  Usually a syntax issue in your `config.json`. Use a JSON validator.

- **"Insufficient balance..."**  
  Make sure your wallet has enough STT, WSTT, and NIA tokens.

- **"Error: Point claim failed..."**  
  May occur if Somnia's API is down. Bot will still continue.

---

## 🤗 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/NewFeature`)
3. Commit your changes
4. Submit a Pull Request

---

## 📜 License & Attribution

**Educational use only.** Use at your own risk.  
Built with ❤️ by **AmoureuxID**.

---

## 📬 Support & Contact

- Telegram: [@AmoureuxID](https://t.me/AmoureuxID)
- GitHub Issues: [Open an Issue](https://github.com/AmoureuxID/Somnia-Exchange-Bot/issues)

---

## 🧋 Buy Me a Coffee

If you find this project helpful, feel free to donate:

- **EVM**: `0xcee2713694211aF776E0a3c1B0E4d9B5B45167c1`
- **TON**: `UQAGw7KmISyrILX807eYYY1sxPofEGBvOUKtDGo8QPtYY_SL`
- **SOL**: `9fYY9YkPmaumkPUSqjD6oaYxvxNo3wETpC9A7nE3Pbza`
- **SUI**: `0x2f4b127951b293e164056b908d05c826011a258f81910f2685a8c433158a7b9b`

---

⭐ If you enjoy this project, please star the repository!

**à la folie.**
