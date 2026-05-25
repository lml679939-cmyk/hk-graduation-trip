/* ====== 旅費分帳 split.js ======
   設定步驟 2：將 APPS_SCRIPT_URL 換成你部署後的 Apps Script Web App URL
   設定步驟 3（選用）：在 ALLOWED_EMAILS 填入 13 位成員的 Gmail，可防止外人登入
                        留空陣列 = 任何 Google 帳號均可登入
*/

const SPLIT_CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbx5NP0dO-Dp4JBXaPPBhmSjRuf9cCYKc-vZbGmMqtcOIkI2EhYI0mjoE8ojaysaIwph-w/exec',
  ALLOWED_EMAILS: ['lml679939@gmail.com'],
  DEFAULT_RATE: 4.2
};

const MEMBERS = [
  "鍾宜珊", "陳禹璇", "吳孟剛", "林苡婕", "葉祐誠", "陳思妤",
  "陳柏村", "張舜堯", "徐睿君", "何姸穎", "劉映彤", "張旭廷"
  // ⚠️ 共 12 人，若有第 13 位成員請在此補上名字
];

const DATE_LABELS = {
  '2026-06-29': 'Day 1 · 6/29（一）旺角',
  '2026-06-30': 'Day 2 · 6/30（二）灣仔・堅尼地城・尖沙咀',
  '2026-07-01': 'Day 3 · 7/1（三）',
  '2026-07-02': 'Day 4 · 7/2（四）'
};

let currentUser = null;
let expenses    = [];
let rate        = parseFloat(localStorage.getItem('hkd_rate') || SPLIT_CONFIG.DEFAULT_RATE);

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
  initForm();
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

function initRateBar() {
  document.getElementById('rateInput').value = rate;
  const saved = localStorage.getItem('rate_updated');
  if (saved) document.getElementById('rateNote').textContent = `（更新於 ${saved}）`;

  document.getElementById('saveRateBtn').addEventListener('click', () => {
    const v = parseFloat(document.getElementById('rateInput').value);
    if (!v || v <= 0) return;
    rate = v;
    const today = new Date().toLocaleDateString('zh-TW');
    localStorage.setItem('hkd_rate', String(rate));
    localStorage.setItem('rate_updated', today);
    document.getElementById('rateNote').textContent = `（更新於 ${today}）`;
    renderExpenses();
    renderSettlement();
  });
}

/* ── 新增費用表單 ── */

function initForm() {
  const paidByEl = document.getElementById('fPaidBy');
  MEMBERS.forEach(m => {
    const o = document.createElement('option');
    o.value = o.textContent = m;
    paidByEl.appendChild(o);
  });

  document.getElementById('fDate').value = '2026-06-29';

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
  document.getElementById('fPaidBy').addEventListener('change', updatePreview);
  checksEl.addEventListener('change', updatePreview);

  document.getElementById('btnSubmit').addEventListener('click', submitExpense);
}

function getChecked() {
  return [...document.querySelectorAll('#memberChecks input:checked')].map(c => c.value);
}

function updatePreview() {
  const amount = parseFloat(document.getElementById('fAmount').value) || 0;
  const ppl    = getChecked();
  const el     = document.getElementById('fPreview');
  if (amount <= 0 || !ppl.length) { el.innerHTML = ''; return; }
  const per = amount / ppl.length;
  el.innerHTML = `每人 <b>HKD ${per.toFixed(1)}</b>（約 TWD ${Math.round(per * rate)}）· 共 ${ppl.length} 人分攤`;
}

async function submitExpense() {
  const desc         = document.getElementById('fDesc').value.trim();
  const amount       = parseFloat(document.getElementById('fAmount').value);
  const paidBy       = document.getElementById('fPaidBy').value;
  const date         = document.getElementById('fDate').value;
  const participants = getChecked();

  if (!desc)               { alert('請填寫費用說明'); return; }
  if (!amount || amount <= 0) { alert('請填寫正確金額'); return; }
  if (!participants.length)   { alert('請至少選一位分攤成員'); return; }

  const btn = document.getElementById('btnSubmit');
  btn.disabled = true;
  btn.textContent = '送出中⋯';

  try {
    const expense = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      desc, amount, paidBy, date, participants,
      submittedBy:      currentUser.name,
      submittedByEmail: currentUser.email,
      timestamp:        Date.now()
    };
    await apiGet({ action: 'add', d: JSON.stringify(expense) });

    document.getElementById('fDesc').value   = '';
    document.getElementById('fAmount').value = '';
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
  const canDel = e.submittedByEmail === currentUser.email;
  return `
    <div class="split-expense-row">
      <div class="split-exp-top">
        <span class="split-exp-desc">${e.desc}</span>
        <span class="split-exp-amt">HKD ${Number(e.amount).toFixed(1)}</span>
      </div>
      <div class="split-exp-meta">
        <b>${e.paidBy}</b> 付款 · ${e.participants.length} 人均分
        （每人 HKD ${per.toFixed(1)} ≈ TWD ${Math.round(per * rate)}）
        · 記帳：${e.submittedBy}
        ${canDel ? `<button class="split-del-btn" data-id="${e.id}">刪除</button>` : ''}
      </div>
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
    const share = amount / participants.length;
    bal[paidBy] = (bal[paidBy] || 0) + amount;
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
