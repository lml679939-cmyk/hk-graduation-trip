// ================================================================
// Google Apps Script — 旅費分帳後端
// ================================================================
//
// 【設定步驟】
//
// Step A：建立 Google Sheets
//   1. 開啟 https://sheets.google.com，建立一個新的試算表
//   2. 複製網址列中間那段 ID（格式：1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms）
//   3. 貼到下方 SPREADSHEET_ID 變數
//
// Step B：部署 Apps Script
//   1. 在試算表中點選「擴充功能」→「Apps Script」
//   2. 刪除預設的 myFunction()，貼上本檔案的全部內容
//   3. 修改 SPREADSHEET_ID 與 ALLOWED_EMAILS（可選）
//   4. 點「部署」→「新增部署作業」
//      - 類型：網頁應用程式
//      - 說明：旅費分帳 API
//      - 執行身分：我（你的帳號）
//      - 誰可以存取：所有人
//   5. 按「部署」，授權後複製「網頁應用程式 URL」
//   6. 將該 URL 貼到 assets/split.js 的 SPLIT_CONFIG.APPS_SCRIPT_URL
//
// Step C：設定 Google OAuth Client ID（用於網頁的 Google 登入按鈕）
//   1. 開啟 https://console.cloud.google.com
//   2. 建立新專案（或使用現有的）
//   3. 左側選「API 和服務」→「憑證」
//   4. 點「建立憑證」→「OAuth 2.0 用戶端 ID」
//      - 應用程式類型：網頁應用程式
//      - 已授權的 JavaScript 來源：https://lml679939-cmyk.github.io
//        （本機測試用：http://localhost:5500）
//   5. 複製「用戶端 ID」（格式：xxxx.apps.googleusercontent.com）
//   6. 貼到 split.html 的 data-client_id 屬性
//
// ================================================================

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // ← 填入 Google Sheets ID
const SHEET_NAME     = '分帳記錄';
const ALLOWED_EMAILS = [
  // 填入 13 位成員的 Gmail（留空 = 不限制，任何人都可操作）
  // 'member01@gmail.com',
  // 'member02@gmail.com',
];

// ── 權限檢查 ──────────────────────────────────────────────────

function isAllowed(email) {
  if (ALLOWED_EMAILS.length === 0) return true;
  return ALLOWED_EMAILS.includes(email);
}

// ── 取得（或建立）工作表 ──────────────────────────────────────

function getSheet() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['ID', '時間戳記', '日期', '費用說明', '金額(HKD)',
                     '付款人(JSON)', '分攤成員(JSON)', '記帳人', '記帳人Email', '收據圖片']);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ── doGet：所有操作（讀取、新增、刪除）都透過 GET 參數傳遞 ───

function doGet(e) {
  const action = e.parameter.action || 'list';

  try {
    if (action === 'list') {
      return listExpenses();
    }

    if (action === 'add') {
      const expense = JSON.parse(decodeURIComponent(e.parameter.d || '{}'));
      if (!isAllowed(expense.submittedByEmail || '')) {
        return json({ ok: false, error: '帳號不在允許名單' });
      }
      return addExpense(expense);
    }

    if (action === 'delete') {
      const id    = e.parameter.id    || '';
      const email = e.parameter.email || '';
      if (!isAllowed(email)) {
        return json({ ok: false, error: '帳號不在允許名單' });
      }
      return deleteExpense(id, email);
    }

    return json({ ok: false, error: '未知的 action' });

  } catch (err) {
    return json({ ok: false, error: err.message });
  }
}

// ── 列出所有費用 ─────────────────────────────────────────────

function listExpenses() {
  const rows = getSheet().getDataRange().getValues().slice(1); // 跳過標題行
  const expenses = rows
    .filter(r => r[0]) // 過濾空行
    .map(r => {
      let paidBy;
      try {
        const parsed = JSON.parse(r[5]);
        paidBy = Array.isArray(parsed) ? parsed : [String(r[5])];
      } catch { paidBy = [String(r[5])]; }
      return {
        id:               String(r[0]),
        timestamp:        r[1] ? new Date(r[1]).getTime() : 0,
        date:             r[2],
        desc:             r[3],
        amount:           parseFloat(r[4]) || 0,
        paidBy,
        participants:     JSON.parse(r[6] || '[]'),
        submittedBy:      r[7],
        submittedByEmail: r[8],
        receiptData:      r[9] || ''
      };
    });
  return json({ ok: true, expenses });
}

// ── 新增費用 ─────────────────────────────────────────────────

function addExpense(exp) {
  if (!exp.id || !exp.desc || !exp.amount || !exp.paidBy) {
    return json({ ok: false, error: '資料不完整' });
  }
  const paidByArr = Array.isArray(exp.paidBy) ? exp.paidBy : [exp.paidBy];
  getSheet().appendRow([
    exp.id,
    new Date(),
    exp.date             || '',
    exp.desc,
    exp.amount,
    JSON.stringify(paidByArr),
    JSON.stringify(exp.participants || []),
    exp.submittedBy      || '',
    exp.submittedByEmail || '',
    exp.receiptData      || ''
  ]);
  return json({ ok: true });
}

// ── 刪除費用（僅記帳人本人可刪） ─────────────────────────────

function deleteExpense(id, email) {
  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      if (ALLOWED_EMAILS.length > 0 && rows[i][8] !== email) {
        return json({ ok: false, error: '只有記帳人本人可以刪除' });
      }
      sheet.deleteRow(i + 1);
      return json({ ok: true });
    }
  }
  return json({ ok: false, error: '找不到此筆記錄' });
}

// ── 回傳 JSON ─────────────────────────────────────────────────

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
