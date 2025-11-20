const { ethers } = require('ethers');

// Base 鏈的 RPC 端點
const BASE_RPC = 'https://mainnet.base.org';

// 要查詢的錢包地址
const WALLET_ADDRESS = '0x2211d1D0020DAEA8039E46Cf1367962070d77DA9';

async function checkWalletHistory() {
    const provider = new ethers.JsonRpcProvider(BASE_RPC);

    console.log('='.repeat(60));
    console.log('📊 錢包歷史查詢工具');
    console.log('='.repeat(60));
    console.log(`錢包地址: ${WALLET_ADDRESS}`);
    console.log(`Basescan: https://basescan.org/address/${WALLET_ADDRESS}\n`);

    try {
        // 1. 確認這是什麼類型的地址
        const code = await provider.getCode(WALLET_ADDRESS);
        if (code === '0x') {
            console.log('⚠️  這是一個普通地址（EOA），不是智能合約');
        } else {
            console.log(`✓ 確認這是智能合約（代碼長度: ${code.length} 字元）`);
        }

        // 2. 查詢餘額
        const balance = await provider.getBalance(WALLET_ADDRESS);
        console.log(`💰 當前餘額: ${ethers.formatEther(balance)} ETH\n`);

        // 3. 查詢最近的區塊
        const currentBlock = await provider.getBlockNumber();
        console.log(`當前區塊: ${currentBlock}`);

        // 4. 查詢最近的交易（透過掃描最近的區塊）
        console.log('\n🔍 正在查詢最近的交易（最近 5000 個區塊）...\n');

        const fromBlock = Math.max(0, currentBlock - 5000);
        const transactions = [];

        // 這個方法比較慢但不需要 API key
        for (let i = currentBlock; i >= fromBlock && transactions.length < 10; i--) {
            try {
                const block = await provider.getBlock(i, true);
                if (block && block.transactions) {
                    for (const tx of block.transactions) {
                        // 查找從該地址發出的交易
                        if (tx.from && tx.from.toLowerCase() === WALLET_ADDRESS.toLowerCase()) {
                            const receipt = await provider.getTransactionReceipt(tx.hash);
                            transactions.push({ tx, receipt, block });
                            console.log(`找到交易: ${tx.hash.slice(0, 10)}... (區塊 ${i})`);
                        }
                    }
                }
            } catch (error) {
                // 繼續
            }
        }

        if (transactions.length === 0) {
            console.log('❌ 在最近 5000 個區塊中沒有找到從該地址發出的交易');
            console.log('\n💡 建議：');
            console.log('1. 使用 Basescan 查看完整交易歷史');
            console.log('2. 這個錢包可能還沒有發送過任何交易');
            console.log('3. 或者交易發生在更早的區塊\n');
        } else {
            console.log(`\n✓ 找到 ${transactions.length} 筆交易\n`);
            console.log('='.repeat(60));
            console.log('最近的交易詳情：');
            console.log('='.repeat(60));

            transactions.forEach((item, index) => {
                const { tx, receipt, block } = item;
                const timestamp = new Date(block.timestamp * 1000);

                console.log(`\n交易 #${index + 1}:`);
                console.log(`  時間: ${timestamp.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`);
                console.log(`  哈希: ${tx.hash}`);
                console.log(`  區塊: ${block.number}`);
                console.log(`  接收者: ${tx.to || '(合約創建)'}`);
                console.log(`  狀態: ${receipt.status === 1 ? '✓ 成功' : '✗ 失敗'}`);

                if (receipt.contractAddress) {
                    console.log(`  🎉 創建了新合約: ${receipt.contractAddress}`);
                }

                if (receipt.logs.length > 0) {
                    console.log(`  事件日誌: ${receipt.logs.length} 個`);
                    receipt.logs.slice(0, 3).forEach((log, i) => {
                        console.log(`    日誌 ${i + 1}: ${log.address}`);
                    });
                }

                console.log(`  🔗 https://basescan.org/tx/${tx.hash}`);
            });
        }

        console.log('\n' + '='.repeat(60));
        console.log('💡 手動查詢建議：');
        console.log('='.repeat(60));
        console.log('1. 訪問 Basescan 查看完整交易歷史：');
        console.log(`   https://basescan.org/address/${WALLET_ADDRESS}#transactions`);
        console.log('\n2. 在發行時間後（今晚 1:00 之後）：');
        console.log('   - 重新整理 Basescan 頁面');
        console.log('   - 查看 "Transactions" 標籤頁的最新交易');
        console.log('   - 點擊交易哈希查看詳情');
        console.log('   - 在 "Logs" 或 "Internal Txns" 找到新 token 地址');

    } catch (error) {
        console.error('\n❌ 查詢失敗:', error.message);
        console.log('\n💡 如果是網路問題，建議：');
        console.log('1. 檢查網路連接');
        console.log('2. 更換 RPC 端點');
        console.log('3. 使用 Basescan API（需要 API key）');
    }
}

checkWalletHistory().catch(console.error);
