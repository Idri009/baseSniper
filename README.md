# Base Token 監控工具

監控 Coinbase Smart Wallet (`0x2211d1D0020DAEA8039E46Cf1367962070d77DA9`) 在 Base 鏈上的活動，第一時間獲取新 token 的合約地址。

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 查看錢包歷史（選用）

先運行這個了解錢包的歷史行為：

```bash
npm run check
```

### 3. 開始監控

**在今晚 1:00 之前啟動監控**：

```bash
npm run monitor
```

程式會：
- ✅ 實時監控錢包的所有交易
- ✅ 自動捕獲新合約創建
- ✅ 提取 token 合約地址
- ✅ 顯示 Basescan 連結

按 `Ctrl + C` 停止監控。

## 手動查詢方法（備用）

如果自動監控失敗，可以手動查看：

### 方法 1: 使用 Basescan（最簡單）

1. **訪問錢包頁面**：
   ```
   https://basescan.org/address/0x2211d1D0020DAEA8039E46Cf1367962070d77DA9
   ```

2. **在發行時間後（1:00 之後）**：
   - 點擊 **"Transactions"** 標籤頁
   - 重新整理頁面（F5）
   - 查看最新的交易

3. **查看交易詳情**：
   - 點擊最新交易的 **交易哈希**
   - 檢查以下區域：
     - **"Logs"** 標籤：查看事件日誌中的地址
     - **"Internal Txns"**：查看內部交易創建的合約
     - **"State"** 變化：新出現的合約地址

4. **確認 Token 地址**：
   - 新 token 地址通常會顯示為 `ERC20 Token Transfer` 事件
   - 或在 "Internal Txns" 中顯示為 `Contract Creation`

### 方法 2: 使用 Basescan API

如果你有 Basescan API key（免費註冊：https://basescan.org/apis）：

```bash
# 查詢錢包的最新交易
curl "https://api.basescan.org/api?module=account&action=txlist&address=0x2211d1D0020DAEA8039E46Cf1367962070d77DA9&startblock=0&endblock=99999999&sort=desc&page=1&offset=10&apikey=YOUR_API_KEY"

# 查詢錢包創建的內部合約
curl "https://api.basescan.org/api?module=account&action=txlistinternal&address=0x2211d1D0020DAEA8039E46Cf1367962070d77DA9&startblock=0&endblock=99999999&sort=desc&apikey=YOUR_API_KEY"
```

### 方法 3: 使用區塊瀏覽器的通知功能

1. 在 Basescan 註冊帳號
2. 添加地址監控
3. 設定郵件/推送通知
4. 當錢包有新交易時會收到通知

## 提升監控速度的建議

### 使用付費 RPC（推薦）

免費的公共 RPC 可能有延遲。為了第一時間獲取資訊，建議使用：

#### 1. Alchemy（推薦）
```javascript
// 在 monitor_wallet.js 中修改：
const BASE_RPC = 'https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY';
```
- 註冊：https://www.alchemy.com/
- 免費方案：每月 300M requests

#### 2. QuickNode
```javascript
const BASE_RPC = 'YOUR_QUICKNODE_ENDPOINT';
```
- 註冊：https://www.quicknode.com/
- 更快的響應速度

#### 3. Infura
```javascript
const BASE_RPC = 'https://base-mainnet.infura.io/v3/YOUR_API_KEY';
```
- 註冊：https://infura.io/

## 重要注意事項

### ⚠️ 安全警告

1. **新 Token 風險**：
   - 新發行的 token 可能是詐騙
   - 檢查合約是否開源驗證
   - 確認流動性池是否鎖定
   - 小心 rug pull 風險

2. **不要盲目投資**：
   - 獲得地址後先分析合約
   - 檢查是否有後門函數
   - 查看代幣分配是否合理
   - 確認團隊背景

3. **交易安全**：
   - 使用硬體錢包
   - 設定滑點保護
   - 不要授權過多權限

### 📝 使用技巧

1. **提前準備**：
   - 在 12:45 左右啟動監控腳本
   - 確保網路連接穩定
   - 準備好錢包和 Gas 費

2. **多重驗證**：
   - 同時使用自動監控和手動查詢
   - 開啟 Basescan 頁面隨時刷新
   - 加入相關 Telegram/Discord 群組

3. **快速反應**：
   - 腳本會立即顯示合約地址
   - 複製地址後可直接在 DEX 交易
   - 或先在 Basescan 驗證合約

## 故障排查

### 問題：連接失敗
**解決方案**：
- 更換 RPC 端點
- 檢查網路連接
- 使用付費 RPC 服務

### 問題：沒有偵測到交易
**可能原因**：
- 發行時間延遲
- 不是從這個地址發行
- 透過其他合約發行

**解決方案**：
- 確認發行時間和地址
- 手動查看 Basescan
- 檢查是否有公告更新

### 問題：無法確定 Token 地址
**解決方案**：
- 查看所有顯示的可能地址
- 在 Basescan 上逐一檢查
- 尋找有 ERC20 代碼的合約
- 查看交易的 Logs 事件

## 其他資源

- Base 官方文檔：https://docs.base.org/
- Basescan：https://basescan.org/
- Base Discord：https://discord.gg/base
- Ethers.js 文檔：https://docs.ethers.org/

## 聯絡與支援

如有問題，可以：
1. 查看 Basescan 的交易詳情
2. 在 Base 社群詢問
3. 檢查項目官方公告

---

**祝你順利獲得 Token 地址！記得做好風險管理。** 🚀
