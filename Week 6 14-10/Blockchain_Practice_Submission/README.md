# Group 6 — Dynamic Merchant Address Service

## 1. About the System and Team Members

### System overview

This project implements the Dynamic Merchant Address Service described in the blockchain programming practical assignment. It generates Ethereum payment addresses from the assignment's shared mnemonic using an HD wallet and the BIP44 derivation path `m/44'/60'/0'/0/i`.

The backend runs on port 5000 and exposes `GET /api/getMAddress`. A React frontend runs on port 3000 and allows users to request an address by clicking **Get Payment Address**.

The address index starts at 0, increases after each successful API call, and resets to 0 when it reaches 100, as required by the assignment. Addresses repeat after each cycle and after a backend restart. This project covers address generation and frontend integration; it does not process transfers, confirm payments, or manage merchant orders.

### Group 6 members

| Full name | Role |
| --- | --- |
| Trương Mỹ Quyên | Team leader |
| Phạm Thị Ngọc Linh | Team member |
| Lê Thị Thu Thủy | Team member |
| Nguyễn Thị Mai Anh | Team member |
| Lỗ Thị Huyền Trang | Team member |

The team leader submits the project on behalf of Group 6.

## 2. Technical Background

### Technologies and dependencies

| Technology or library | Purpose |
| --- | --- |
| Node.js and CommonJS | JavaScript runtime and module system |
| Express | Backend server and REST API route |
| cors | Allow the frontend origin `http://localhost:3000` |
| bip39 | Convert the 12-word mnemonic into a binary seed |
| hdkey | Create the master node and derive child nodes |
| ethereumjs-util | Calculate public keys, Ethereum addresses, and checksum addresses |
| React and react-dom | Frontend interface |
| esbuild | Bundle the React source for the browser |
| ethers | Independently verify the first two derived addresses |

The five assignment-required libraries are backend dependencies. React, react-dom, esbuild, and ethers are development dependencies. Exact installed versions are recorded in `package-lock.json`.

### Address generation

1. Convert the assignment mnemonic into a seed with `bip39.mnemonicToSeedSync` using an empty BIP39 passphrase.
2. Create the master node with `hdkey.fromMasterSeed`.
3. Construct `m/44'/60'/0'/0/` followed by the current index.
4. Derive the child node with `root.derive`.
5. Convert its private key to a public key using `privateToPublic`.
6. Calculate the Ethereum address using `publicToAddress`.
7. Convert the hexadecimal address to checksum format using `toChecksumAddress`.
8. Increase the index, reset at 100, and return JSON containing `MAddress`.

The public assignment mnemonic is for educational use only and must not be used to receive real funds. The API returns only the public address, not the seed or private key.

## 3. Login Account

No login account is required. The project does not implement authentication, registration, or user accounts. No username or password is needed to use the local frontend or API.

## 4. System Flow and Usage

### Prerequisites

- Node.js and npm. The demonstrated environment used Node.js v24.21.0 and npm 11.19.0 on Windows.
- A web browser.
- Two terminal windows for the backend and frontend.

### Installation

Extract the submitted ZIP into a folder. Open PowerShell in the extracted folder containing `package.json`, then run:

```powershell
npm.cmd ci
```

Install development dependencies as well; they are needed for the React frontend and verification script. On other operating systems, use `npm ci`.

### Start the backend

In terminal 1, run:

```powershell
node app.js
```

Expected startup message:

```text
Dynamic Merchant Address Service running on port 5000
```

Keep terminal 1 open.

### Start the frontend

In terminal 2, open the same project folder and run:

```powershell
node frontend-server.js
```

Expected startup message:

```text
React frontend running at http://localhost:3000
```

Keep terminal 2 open. Use these explicit Node.js commands; `npm start` and `npm test` have not been configured.

### Use the system

1. Open `http://localhost:3000` in the browser. Use `localhost`, as this is the configured CORS origin.
2. Click **Get Payment Address**.
3. React sends a GET request directly to `http://localhost:5000/api/getMAddress`.
4. The backend derives the address and returns HTTP 200 with JSON containing `MAddress`.
5. The page displays **Success - HTTP 200** and the address.
6. Click again to obtain the next indexed address. After 100 successful API requests, the index returns to 0.

Example response at index 0:

```json
{
  "MAddress": "0x38979A730badBdcE4bD6eFD3AfC12CA24C73d01C"
}
```

The index counts all successful API calls, including terminal requests. Restarting the backend resets the index to 0. Restart the frontend server after editing its source files to rebuild the bundle.

### Independent address verification

In another terminal in the project folder, run:

```powershell
node verify-addresses.js
```

This script uses ethers to derive the first two addresses independently. It does not call the API or change the backend index.

| Path | Address observed with both the API and ethers |
| --- | --- |
| `m/44'/60'/0'/0/0` | `0x38979A730badBdcE4bD6eFD3AfC12CA24C73d01C` |
| `m/44'/60'/0'/0/1` | `0x315074C434eca2B79878f4a1A2323d12eE413fdb` |

These outputs differ from the two sample addresses printed in the assignment PDF. `Matches assignment: false` identifies this discrepancy. The API and independent ethers implementation agree for the specified mnemonic, empty passphrase, and paths. The discrepancy is disclosed for instructor review; the API does not hardcode the printed sample addresses.

### Verify the 100-address reset

Restart the backend with **Ctrl+C**, then `node app.js`. Do not issue browser requests during this test. In a separate PowerShell window, run:

```powershell
$addresses = @(
  for ($i = 0; $i -lt 101; $i++) {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/getMAddress"
    $result.MAddress
  }
)

$uniqueCount = ($addresses[0..99] | Sort-Object -Unique).Count
$resetCorrect = $addresses[0] -eq $addresses[100]

Write-Host "Unique addresses in first 100 calls:" $uniqueCount
Write-Host "Call 101 equals call 1:" $resetCorrect
```

Observed results:

```text
Unique addresses in first 100 calls: 100
Call 101 equals call 1: True
```

### Stop the system

Press **Ctrl+C** in each server terminal.

## 5. Submitted Files

```text
app.js
package.json
package-lock.json
verify-addresses.js
frontend-server.js
frontend/
  App.jsx
  index.html
README.md
```

The `node_modules` folder is excluded. Restore dependencies using `npm.cmd ci` after extracting the source package.
