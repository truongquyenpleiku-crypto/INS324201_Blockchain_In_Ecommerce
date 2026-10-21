const express = require("express");
const cors = require("cors");
const bip39 = require("bip39");
const hdkey = require("hdkey");
const ethUtil = require("ethereumjs-util");

const app = express();

// Yêu cầu 1: Cho phép frontend cổng 3000 gọi API.
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
  })
);

// Mnemonic đúng theo đề bài.
const mnemonic =
  "share confirm story grocery check soon cool priority doctor cruise subway provide";

let pathid = 0;

app.get("/api/getMAddress", function (req, res) {
  try {
    // TODO 1: Chuyển mnemonic thành binary seed.
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // TODO 2: Tạo nút master từ seed.
    const root = hdkey.fromMasterSeed(seed);

    // TODO 3: Tạo đường dẫn BIP44 với chỉ số hiện tại.
    const path = "m/44'/60'/0'/0/" + pathid;

    // TODO 4: Dẫn xuất child node.
    const child = root.derive(path);

    // TODO 5: Public Key -> Address Hex -> Checksum Address.
    const publicKey = ethUtil.privateToPublic(child.privateKey);
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const addressHex = "0x" + addressBuffer.toString("hex");
    const MAddress = ethUtil.toChecksumAddress(addressHex);

    // Ghi log phục vụ kiểm thử.
    console.log("Path:", path);
    console.log("MAddress:", MAddress);

    // TODO 6: Tăng chỉ số và reset khi đạt 100.
    pathid++;

    if (pathid >= 100) {
      pathid = 0;
    }

    // TODO 7: Trả JSON chứa MAddress.
    res.set("Cache-Control", "no-store");
    return res.json({ MAddress });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      error: error.message,
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Dynamic Merchant Address Service running on port ${PORT}`
  );
});