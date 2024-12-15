// Set up a provider for the Goerli testnet (replace with your Infura API URL)
const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/b80939887f1e45f28061652fa9bef683");

// DOM Elements
const generateWalletBtn = document.getElementById("generate-wallet");
const importWalletBtn = document.getElementById("import-wallet");
const privateKeyField = document.getElementById("private-key");
const addressField = document.getElementById("address");
const balanceField = document.getElementById("balance");
const recipientAddressField = document.getElementById("recipient-address");
const amountField = document.getElementById("amount");
const sendButton = document.getElementById("send");

let wallet; // Store wallet instance

// Generate Wallet
generateWalletBtn.addEventListener("click", () => {
  wallet = ethers.Wallet.createRandom();
  addressField.textContent = wallet.address;
  alert("Wallet generated. Save your private key securely.");
  console.log(`Private Key: ${wallet.privateKey}`);
  fetchBalance(); // Fetch balance after generating wallet
});

// Import Wallet
importWalletBtn.addEventListener("click", () => {
  const privateKey = privateKeyField.value.trim();
  try {
    wallet = new ethers.Wallet(privateKey);
    addressField.textContent = wallet.address;
    alert("Wallet imported successfully!");
    fetchBalance(); // Fetch balance after importing wallet
  } catch (error) {
    alert("Invalid private key.");
  }
});

// Fetch Wallet Balance
const fetchBalance = async () => {
  if (!wallet) return;
  const connectedWallet = wallet.connect(provider);
  const balance = await connectedWallet.getBalance();
  balanceField.textContent = ethers.utils.formatEther(balance) + " ETH";
};

// Send Transaction
sendButton.addEventListener("click", async () => {
  if (!wallet) {
    alert("Please generate or import a wallet first.");
    return;
  }

  const recipient = recipientAddressField.value.trim();
  const amount = ethers.utils.parseEther(amountField.value.trim());
  const connectedWallet = wallet.connect(provider);

  try {
    const tx = await connectedWallet.sendTransaction({
      to: recipient,
      value: amount,
    });
    alert(`Transaction sent! Hash: ${tx.hash}`);
    console.log(tx);
    fetchBalance(); // Update balance after the transaction
  } catch (error) {
    console.error(error);
    alert("Transaction failed.");
  }
});

// Fetch balance on load (if wallet is imported or generated)
if (wallet) {
  fetchBalance();
      }
