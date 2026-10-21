const { HDNodeWallet } = require("ethers");

const mnemonic =
  "share confirm story grocery check soon cool priority doctor cruise subway provide";

const assignmentAddresses = [
  "0x3897B0FA54F0CD211e4fFDd1A48805F04336c285",
  "0x3150247FE43C651DC59A41eEf5ee9bCEdA6E72EB",
];

for (let i = 0; i < 2; i++) {
  const path = "m/44'/60'/0'/0/" + i;

  // Dẫn xuất trực tiếp bằng ethers, không dùng hdkey.
  const wallet = HDNodeWallet.fromPhrase(mnemonic, "", path);

  console.log("Path:", path);
  console.log("Ethers address:", wallet.address);
  console.log("Assignment address:", assignmentAddresses[i]);
  console.log(
    "Matches assignment:",
    wallet.address.toLowerCase() ===
      assignmentAddresses[i].toLowerCase()
  );
  console.log();
}