/* ====== 旅費分帳 split.js ======
   設定步驟 2：將 APPS_SCRIPT_URL 換成你部署後的 Apps Script Web App URL
   設定步驟 3（選用）：在 ALLOWED_EMAILS 填入 13 位成員的 Gmail，可防止外人登入
                        留空陣列 = 任何 Google 帳號均可登入
*/

const SPLIT_CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbx5NP0dO-Dp4JBXaPPBhmSjRuf9cCYKc-vZbGmMqtcOIkI2EhYI0mjoE8ojaysaIwph-w/exec',
  ALLOWED_EMAILS: [
    'lml679939@gmail.com',       // 葉祐誠
    'joey930531@gmail.com',      // 吳孟剛
    'yenyingho0203@gmail.com',   // 何姸穎
    'amooli99054@gmail.com',     // 徐睿君
    '040116panda@gmail.com',     // 鍾宜珊
    'yuxuann.0218@gmail.com',    // 陳禹璇
    'ken0965453937@gmail.com',   // 張旭廷
    'a0981024358@gmail.com',     // 劉映彤
    'chenpotsunnnn@gmail.com',   // 陳柏村
    'csy.shunyiutw@gmail.com',   // 張舜堯（原始大寫 C 已轉小寫）
    'rita.happybear@gmail.com',  // 陳思妤
    'linyvonne9313@gmail.com',   // 林苡婕
    // 第 13 位成員 — 待補
  ],
  DEFAULT_RATE: 4.2
};

const MEMBERS = [
  "鍾宜珊", "陳禹璇", "吳孟剛", "林苡婕", "葉祐誠", "陳思妤",
  "陳柏村", "張舜堯", "徐睿君", "何姸穎", "劉映彤", "張旭廷"
];

const EMAIL_TO_NAME = {
  'lml679939@gmail.com':       '葉祐誠',
  'joey930531@gmail.com':      '吳孟剛',
  'yenyingho0203@gmail.com':   '何姸穎',
  'amooli99054@gmail.com':     '徐睿君',
  '040116panda@gmail.com':     '鍾宜珊',
  'yuxuann.0218@gmail.com':    '陳禹璇',
  'ken0965453937@gmail.com':   '張旭廷',
  'a0981024358@gmail.com':     '劉映彤',
  'chenpotsunnnn@gmail.com':   '陳柏村',
  'csy.shunyiutw@gmail.com':   '張舜堯',
  'rita.happybear@gmail.com':  '陳思妤',
  'linyvonne9313@gmail.com':   '林苡婕',
};

function displayName(email, fallback) {
  return EMAIL_TO_NAME[email] || fallback;
}

const DATE_LABELS = {
  '2026-06-29': 'Day 1 · 6/29（一）旺角',
  '2026-06-30': 'Day 2 · 6/30（二）灣仔・堅尼地城・尖沙咀',
  '2026-07-01': 'Day 3 · 7/1（三）',
  '2026-07-02': 'Day 4 · 7/2（四）'
};

let currentUser = null;
let expenses    = [];
let rate        = SPLIT_CONFIG.DEFAULT_RATE;

/* ── Google Sign-In（全域函式，由 GSI library 呼叫） ── */

function handleCredentialResponse(response) {
  const payload = decodeJWT(response.credential);

  if (SPLIT_CONFIG.ALLOWED_EMAILS.length > 0 &&
      !SPLIT_CONFIG.ALLOWED_EMAILS.includes(payload.email)) {
    alert(`帳號 ${payload.email} 不在成員名單，無法登入。`);
    return;
  }

  currentUser = {
    name:    payload.name,
    email:   payload.email,
    picture: payload.picture || ''
  };
  localStorage.setItem('split_user', JSON.stringify(currentUser));
  showApp();
}

function decodeJWT(token) {
  const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64 + '='.repeat((4 - b64.length % 4) % 4);
  return JSON.parse(decodeURIComponent(
    atob(pad).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
  ));
}

/* ── App 啟動 ── */

function showApp() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('appSection').style.display   = '';
  renderUserBar();
  initRateBar();
  startRateRefresh();
  initForm();
  initEditModal();
  loadExpenses();
}

function renderUserBar() {
  document.getElementById('userBar').innerHTML = `
    ${currentUser.picture
      ? `<img src="${currentUser.picture}" class="split-avatar" alt="">`
      : ''}
    <span class="split-uname">${currentUser.name}</span>
    <span class="split-uemail">${currentUser.email}</span>
    <button class="split-logout-btn" onclick="signOut()">登出</button>
  `;
}

function signOut() {
  localStorage.removeItem('split_user');
  window.google?.accounts?.id?.disableAutoSelect?.();
  location.reload();
}

/* ── 匯率 ── */

const RATE_CACHE_KEY = 'hkRate_v1';
const RATE_TTL_MS    = 6 * 60 * 60 * 1000; // 6 小時

async function refreshRate() {
  localStorage.removeItem(RATE_CACHE_KEY);
  const btn = document.getElementById('rateRefreshBtn');
  if (btn) { btn.classList.add('spinning'); btn.disabled = true; }
  await initRateBar();
  if (btn) { btn.classList.remove('spinning'); btn.disabled = false; }
}

async function initRateBar() {
  const el = document.getElementById('rateDisplay');
  el.textContent = '載入中…';

  const cached = (() => {
    try { return JSON.parse(localStorage.getItem(RATE_CACHE_KEY)); } catch { return null; }
  })();
  if (cached && Date.now() - cached.ts < RATE_TTL_MS) {
    rate = cached.rate;
    el.innerHTML = `${rate} <small class="rate-source">（實時・${cached.date}）</small>`;
    return;
  }

  try {
    const res  = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/hkd.min.json');
    const data = await res.json();
    const live = data.hkd?.twd;
    if (live && live > 0) {
      rate = Math.round(live * 100) / 100;
      localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ rate, date: data.date, ts: Date.now() }));
      el.innerHTML = `${rate} <small class="rate-source">（實時・${data.date}）</small>`;
    } else {
      throw new Error('無匯率資料');
    }
  } catch {
    rate = SPLIT_CONFIG.DEFAULT_RATE;
    el.innerHTML = `${rate} <small class="rate-source">（預設值）</small>`;
  }
}

function startRateRefresh() {
  setInterval(async () => {
    localStorage.removeItem(RATE_CACHE_KEY);
    await initRateBar();
  }, RATE_TTL_MS);
}

/* ── 新增費用表單 ── */

function initForm() {
  document.getElementById('fDate').value = '2026-06-29';

  const payerEl = document.getElementById('payerChecks');
  MEMBERS.forEach(m => {
    const lbl = document.createElement('label');
    lbl.className = 'split-check-lbl';
    lbl.innerHTML = `<input type="checkbox" name="payer" value="${m}"><span>${m}</span>`;
    payerEl.appendChild(lbl);
  });
  payerEl.addEventListener('change', updatePreview);

  const checksEl = document.getElementById('memberChecks');
  MEMBERS.forEach(m => {
    const lbl = document.createElement('label');
    lbl.className = 'split-check-lbl';
    lbl.innerHTML = `<input type="checkbox" value="${m}" checked><span>${m}</span>`;
    checksEl.appendChild(lbl);
  });

  document.getElementById('btnSelectAll').addEventListener('click', () => {
    checksEl.querySelectorAll('input').forEach(c => c.checked = true);
    updatePreview();
  });
  document.getElementById('btnClearAll').addEventListener('click', () => {
    checksEl.querySelectorAll('input').forEach(c => c.checked = false);
    updatePreview();
  });

  document.getElementById('fAmount').addEventListener('input', updatePreview);
  document.getElementById('fCurrency').addEventListener('change', updatePreview);
  checksEl.addEventListener('change', updatePreview);

  document.getElementById('fReceipt').addEventListener('change', handleReceiptChange);
  document.getElementById('btnSubmit').addEventListener('click', submitExpense);
}

function getChecked() {
  return [...document.querySelectorAll('#memberChecks input:checked')].map(c => c.value);
}

function getPaidBy() {
  return [...document.querySelectorAll('#payerChecks input:checked')].map(c => c.value);
}

let currentReceiptData = '';

async function handleReceiptChange(e) {
  const file = e.target.files[0];
  if (!file) { currentReceiptData = ''; document.getElementById('receiptPreview').style.display = 'none'; return; }
  currentReceiptData = await compressImage(file);
  const prev = document.getElementById('receiptPreview');
  prev.src = currentReceiptData;
  prev.style.display = '';
}

function compressImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = evt => {
      const img = new Image();
      img.onload = () => {
        const MAX = 150;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function updatePreview() {
  const amount   = parseFloat(document.getElementById('fAmount').value) || 0;
  const currency = document.getElementById('fCurrency').value;
  const ppl      = getChecked();
  const el       = document.getElementById('fPreview');
  if (amount <= 0 || !ppl.length) { el.innerHTML = ''; return; }
  const amountHKD = currency === 'TWD' ? amount / rate : amount;
  const per = amountHKD / ppl.length;
  el.innerHTML = `每人 <b>HKD ${per.toFixed(1)}</b>（約 TWD ${Math.round(per * rate)}）· 共 ${ppl.length} 人分攤`;
}

async function submitExpense() {
  const desc         = document.getElementById('fDesc').value.trim();
  const rawAmount    = parseFloat(document.getElementById('fAmount').value);
  const currency     = document.getElementById('fCurrency').value;
  const amount       = currency === 'TWD' ? rawAmount / rate : rawAmount;
  const paidBy       = getPaidBy();
  const date         = document.getElementById('fDate').value;
  const participants = getChecked();

  if (!desc)                      { alert('請填寫費用說明'); return; }
  if (!rawAmount || rawAmount <= 0) { alert('請填寫正確金額'); return; }
  if (!paidBy.length)             { alert('請至少選一位付款人'); return; }
  if (!participants.length)       { alert('請至少選一位分攤成員'); return; }

  const btn = document.getElementById('btnSubmit');
  btn.disabled = true;
  btn.textContent = '送出中⋯';

  try {
    const expense = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      desc, amount, paidBy, date, participants,
      submittedBy:      currentUser.name,
      submittedByEmail: currentUser.email,
      timestamp:        Date.now(),
      receiptData:      currentReceiptData
    };
    await apiGet({ action: 'add', d: JSON.stringify(expense) });

    document.getElementById('fDesc').value   = '';
    document.getElementById('fAmount').value = '';
    document.getElementById('fReceipt').value = '';
    document.getElementById('receiptPreview').style.display = 'none';
    currentReceiptData = '';
    document.querySelectorAll('#payerChecks input').forEach(c => c.checked = false);
    document.querySelectorAll('#memberChecks input').forEach(c => c.checked = true);
    document.getElementById('fPreview').innerHTML = '';
    await loadExpenses();
  } catch (e) {
    alert('新增失敗，請稍後再試。\n' + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = '新增費用';
  }
}

/* ── API（純 GET，繞過 Apps Script POST redirect 的 CORS 問題） ── */

async function apiGet(params) {
  const url = new URL(SPLIT_CONFIG.APPS_SCRIPT_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res  = await fetch(url.toString(), { redirect: 'follow' });
  const data = await res.json();
  if (data.ok === false) throw new Error(data.error || 'API 錯誤');
  return data;
}

async function loadExpenses() {
  const el = document.getElementById('expenseList');
  el.innerHTML = '<p class="split-empty">載入中⋯</p>';
  try {
    const data = await apiGet({ action: 'list' });
    expenses = (data.expenses || []).sort(
      (a, b) => a.date.localeCompare(b.date) || (a.timestamp || 0) - (b.timestamp || 0)
    );
    renderExpenses();
    renderSettlement();
  } catch (e) {
    el.innerHTML = `<p class="split-empty">載入失敗：${e.message}</p>`;
  }
}

/* ── 渲染費用明細 ── */

function renderExpenses() {
  const el = document.getElementById('expenseList');
  if (!expenses.length) {
    el.innerHTML = '<p class="split-empty">尚無費用記錄。</p>';
    return;
  }

  const byDate  = {};
  expenses.forEach(e => { (byDate[e.date] = byDate[e.date] || []).push(e); });
  const totalHKD = expenses.reduce((s, e) => s + e.amount, 0);

  el.innerHTML =
    Object.keys(byDate).sort().map(d => `
      <div class="split-date-group">
        <div class="split-date-head">${DATE_LABELS[d] || d}</div>
        ${byDate[d].map(expenseRowHTML).join('')}
      </div>
    `).join('') +
    `<div class="split-total-row">
       總計 <b>HKD ${totalHKD.toFixed(1)}</b>（約 TWD ${Math.round(totalHKD * rate)}）
     </div>`;

  el.querySelectorAll('.split-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(btn.dataset.id));
  });

  el.querySelectorAll('.split-del-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('確定刪除此費用？')) return;
      btn.disabled = true;
      try {
        await apiGet({ action: 'delete', id: btn.dataset.id, email: currentUser.email });
        await loadExpenses();
      } catch (e) {
        alert('刪除失敗：' + e.message);
        btn.disabled = false;
      }
    });
  });
}

function expenseRowHTML(e) {
  const per    = e.amount / e.participants.length;
  const payers = Array.isArray(e.paidBy) ? e.paidBy : [e.paidBy];
  const isMine = e.submittedByEmail === currentUser.email;
  return `
    <div class="split-expense-row">
      <div class="split-exp-top">
        <span class="split-exp-desc">${e.desc}</span>
        <span class="split-exp-amt">HKD ${Number(e.amount).toFixed(1)}</span>
      </div>
      <div class="split-exp-meta">
        <b>${payers.join('、')}</b> 付款 · ${e.participants.length} 人均分
        （每人 HKD ${per.toFixed(1)} ≈ TWD ${Math.round(per * rate)}）
        · 記帳：${displayName(e.submittedByEmail, e.submittedBy)}
        <button class="split-edit-btn" data-id="${e.id}">編輯</button>
        ${isMine ? `<button class="split-del-btn" data-id="${e.id}">刪除</button>` : ''}
      </div>
      ${e.receiptData ? `<img class="split-receipt-thumb" src="${e.receiptData}" alt="收據" title="點擊放大" onclick="window.open(this.src)">` : ''}
    </div>`;
}

/* ── 結算清單 ── */

function renderSettlement() {
  const el = document.getElementById('settlement');
  if (!expenses.length) {
    el.innerHTML = '<p class="split-empty">費用載入後自動計算。</p>';
    return;
  }
  const txns = calcSettlement();
  if (!txns.length) {
    el.innerHTML = '<p class="split-settle-done">✅ 所有費用已結清！</p>';
    return;
  }
  el.innerHTML = txns.map(t => `
    <div class="split-settle-row">
      <span class="settle-from">${t.from}</span>
      <span class="settle-arrow">→ 轉帳 →</span>
      <span class="settle-to">${t.to}</span>
      <span class="settle-amt">
        HKD ${t.amount.toFixed(1)}
        <small>≈ TWD ${Math.round(t.amount * rate)}</small>
      </span>
    </div>`).join('');
}

function calcSettlement() {
  const bal = {};
  MEMBERS.forEach(m => { bal[m] = 0; });

  expenses.forEach(({ amount, paidBy, participants }) => {
    const payers = Array.isArray(paidBy) ? paidBy : [paidBy];
    const payerShare = amount / payers.length;
    payers.forEach(p => { bal[p] = (bal[p] || 0) + payerShare; });
    const share = amount / participants.length;
    participants.forEach(p => { bal[p] = (bal[p] || 0) - share; });
  });

  const cred = Object.entries(bal).filter(([, v]) => v >  0.005).map(([n, v]) => ({ n, v }));
  const debt = Object.entries(bal).filter(([, v]) => v < -0.005).map(([n, v]) => ({ n, v }));
  cred.sort((a, b) => b.v - a.v);
  debt.sort((a, b) => a.v - b.v);

  const txns = [];
  while (debt.length && cred.length) {
    const d = debt[0], c = cred[0];
    const pay = Math.min(-d.v, c.v);
    txns.push({ from: d.n, to: c.n, amount: Math.round(pay * 10) / 10 });
    d.v += pay;
    c.v -= pay;
    if (Math.abs(d.v) < 0.005) debt.shift();
    if (Math.abs(c.v) < 0.005) cred.shift();
  }
  return txns;
}

/* ── 編輯費用 Modal ── */

let editingExpenseId = null;
let editReceiptData  = null;

function initEditModal() {
  const payerEl = document.getElementById('ePayerChecks');
  MEMBERS.forEach(m => {
    const lbl = document.createElement('label');
    lbl.className = 'split-check-lbl';
    lbl.innerHTML = `<input type="checkbox" name="epayer" value="${m}"><span>${m}</span>`;
    payerEl.appendChild(lbl);
  });

  const memberEl = document.getElementById('eMemberChecks');
  MEMBERS.forEach(m => {
    const lbl = document.createElement('label');
    lbl.className = 'split-check-lbl';
    lbl.innerHTML = `<input type="checkbox" name="emember" value="${m}"><span>${m}</span>`;
    memberEl.appendChild(lbl);
  });

  document.getElementById('eBtnSelectAll').addEventListener('click', () =>
    memberEl.querySelectorAll('input').forEach(c => c.checked = true));
  document.getElementById('eBtnClearAll').addEventListener('click', () =>
    memberEl.querySelectorAll('input').forEach(c => c.checked = false));

  document.getElementById('eFReceipt').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    editReceiptData = await compressImage(file);
    const prev = document.getElementById('eReceiptPreview');
    prev.src = editReceiptData;
    prev.style.display = '';
  });

  document.getElementById('btnSaveEdit').addEventListener('click', saveEdit);
  document.getElementById('btnCancelEdit').addEventListener('click', closeEditModal);
  document.getElementById('editModal').addEventListener('click', e => {
    if (e.target.id === 'editModal') closeEditModal();
  });
}

function openEditModal(id) {
  const exp = expenses.find(e => e.id === id);
  if (!exp) return;
  editingExpenseId = id;
  editReceiptData  = exp.receiptData || null;

  document.getElementById('eFDesc').value     = exp.desc;
  document.getElementById('eFAmount').value   = Number(exp.amount).toFixed(1);
  document.getElementById('eFCurrency').value = 'HKD';
  document.getElementById('eFDate').value     = exp.date;
  document.getElementById('eFReceipt').value  = '';

  const payers = Array.isArray(exp.paidBy) ? exp.paidBy : [exp.paidBy];
  document.querySelectorAll('#ePayerChecks input').forEach(c => {
    c.checked = payers.includes(c.value);
  });
  document.querySelectorAll('#eMemberChecks input').forEach(c => {
    c.checked = exp.participants.includes(c.value);
  });

  const prev = document.getElementById('eReceiptPreview');
  if (editReceiptData) { prev.src = editReceiptData; prev.style.display = ''; }
  else                 { prev.style.display = 'none'; }

  document.getElementById('editModal').style.display = '';
  document.body.style.overflow = 'hidden';
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
  document.body.style.overflow = '';
  editingExpenseId = null;
  editReceiptData  = null;
}

async function saveEdit() {
  if (!editingExpenseId) return;
  const desc      = document.getElementById('eFDesc').value.trim();
  const rawAmount = parseFloat(document.getElementById('eFAmount').value);
  const currency  = document.getElementById('eFCurrency').value;
  const amount    = currency === 'TWD' ? rawAmount / rate : rawAmount;
  const date      = document.getElementById('eFDate').value;
  const paidBy       = [...document.querySelectorAll('#ePayerChecks input:checked')].map(c => c.value);
  const participants = [...document.querySelectorAll('#eMemberChecks input:checked')].map(c => c.value);

  if (!desc)                        { alert('請填寫費用說明'); return; }
  if (!rawAmount || rawAmount <= 0) { alert('請填寫正確金額'); return; }
  if (!paidBy.length)               { alert('請至少選一位付款人'); return; }
  if (!participants.length)         { alert('請至少選一位分攤成員'); return; }

  const btn = document.getElementById('btnSaveEdit');
  btn.disabled = true;
  btn.textContent = '儲存中⋯';

  try {
    const orig    = expenses.find(e => e.id === editingExpenseId);
    const updated = {
      id: editingExpenseId,
      desc, amount, paidBy, date, participants,
      submittedBy:      orig.submittedBy,
      submittedByEmail: orig.submittedByEmail,
      timestamp:        orig.timestamp,
      receiptData:      editReceiptData || ''
    };
    await apiGet({ action: 'update', d: JSON.stringify(updated), email: currentUser.email });
    closeEditModal();
    await loadExpenses();
  } catch (e) {
    alert('儲存失敗：' + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = '儲存變更';
  }
}

/* ── 初始化 ── */

document.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('split_user');
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      showApp();
    } catch {
      localStorage.removeItem('split_user');
    }
  }
});
