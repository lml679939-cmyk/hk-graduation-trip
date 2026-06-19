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
  'lml679939@gmail.com',       // 葉祐誠
  'joey930531@gmail.com',      // 吳孟剛
  'yenyingho0203@gmail.com',   // 何姸穎
  'amooli99054@gmail.com',     // 徐睿君
  '040116panda@gmail.com',     // 鍾宜珊
  'yuxuann.0218@gmail.com',    // 陳禹璇
  'ken0965453937@gmail.com',   // 張旭廷
  'a0981024358@gmail.com',     // 劉映彤
  'chenpotsunnnn@gmail.com',   // 陳柏村
  'csy.shunyiutw@gmail.com',   // 張舜堯
  'rita.happybear@gmail.com',  // 陳思妤
  'linyvonne9313@gmail.com',   // 林苡婕
  // 第 13 位成員 — 待補
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
                     '付款人(JSON)', '分攤成員(JSON)', '記帳人', '記帳人Email', '收據圖片', '人均(HKD)']);
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
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

    if (action === 'update') {
      const expense = JSON.parse(decodeURIComponent(e.parameter.d || '{}'));
      const email   = e.parameter.email || '';
      if (!isAllowed(email)) {
        return json({ ok: false, error: '帳號不在允許名單' });
      }
      return updateExpense(expense, email);
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
        receiptData:      r[9] || '',
        perPerson:        parseFloat(r[10]) || 0
      };
    });
  return json({ ok: true, expenses });
}

// ── 新增費用 ─────────────────────────────────────────────────

function addExpense(exp) {
  if (!exp.id || !exp.desc || !exp.amount || !exp.paidBy) {
    return json({ ok: false, error: '資料不完整' });
  }
  const paidByArr    = Array.isArray(exp.paidBy) ? exp.paidBy : [exp.paidBy];
  const participants = exp.participants || [];
  const perPerson    = participants.length > 0
    ? Math.round((exp.amount / participants.length) * 100) / 100
    : 0;
  getSheet().appendRow([
    exp.id,
    new Date(),
    exp.date             || '',
    exp.desc,
    exp.amount,
    JSON.stringify(paidByArr),
    JSON.stringify(participants),
    exp.submittedBy      || '',
    exp.submittedByEmail || '',
    exp.receiptData      || '',
    perPerson
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

// ── 編輯費用（僅記帳人本人可編輯） ───────────────────────────

function updateExpense(exp, email) {
  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(exp.id)) {
      const paidByArr    = Array.isArray(exp.paidBy) ? exp.paidBy : [exp.paidBy];
      const participants = exp.participants || [];
      const perPerson    = participants.length > 0
        ? Math.round((exp.amount / participants.length) * 100) / 100
        : 0;
      sheet.getRange(i + 1, 3).setValue(exp.date        || '');
      sheet.getRange(i + 1, 4).setValue(exp.desc);
      sheet.getRange(i + 1, 5).setValue(exp.amount);
      sheet.getRange(i + 1, 6).setValue(JSON.stringify(paidByArr));
      sheet.getRange(i + 1, 7).setValue(JSON.stringify(participants));
      sheet.getRange(i + 1, 10).setValue(exp.receiptData || '');
      sheet.getRange(i + 1, 11).setValue(perPerson);
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
