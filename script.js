/* -------- Sample data & persistence -------- */
// Note: This script depends on parts.js being loaded first, which defines SAMPLE_PARTS.

const PARTS_KEY = "tpp_parts_v1_html";
const BUILD_KEY = "tpp_build_v1_html";
const USER_KEY = "tpp_user_v1_html";

let parts = loadParts();
let build = loadBuild();
let currentUser = loadUser();
let selectedForCompare = [];

/* -------- DOM elements -------- */
const partsTableBody = document.querySelector("#partsTable tbody");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("search");
const sortBySelect = document.getElementById("sortBy");
const buildList = document.getElementById("buildList");
const compatBox = document.getElementById("compatBox");
const totalPriceEl = document.getElementById("totalPrice");

const importPartsInput = document.getElementById("importParts");
const addSampleBtn = document.getElementById("addSample");
const exportBuildBtn = document.getElementById("exportBuild");
const clearBuildBtn = document.getElementById("clearBuild");
const clearPartsBtn = document.getElementById("clearParts");

// New elements
const navBtns = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");
const compareCategory = document.getElementById("compareCategory");
const comparePartsList = document.getElementById("comparePartsList");
const compareBtn = document.getElementById("compareBtn");
const compareTable = document.getElementById("compareTable");
const productsList = document.getElementById("productsList");
const loginForm = document.getElementById("loginForm");
const accountInfo = document.getElementById("accountInfo");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userDisplay = document.getElementById("userDisplay");
const savedBuilds = document.getElementById("savedBuilds");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

/* -------- Initialize UI -------- */
function loadParts(){
  try {
    const raw = localStorage.getItem(PARTS_KEY);
    if(!raw) { localStorage.setItem(PARTS_KEY, JSON.stringify(SAMPLE_PARTS)); return [...SAMPLE_PARTS]; }
    return JSON.parse(raw);
  } catch(e){ localStorage.removeItem(PARTS_KEY); localStorage.setItem(PARTS_KEY, JSON.stringify(SAMPLE_PARTS)); return [...SAMPLE_PARTS]; }
}
function loadBuild(){
  try {
    const raw = localStorage.getItem(BUILD_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e){ localStorage.removeItem(BUILD_KEY); return {}; }
}
function loadUser(){
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e){ return null; }
}
function saveParts(){ localStorage.setItem(PARTS_KEY, JSON.stringify(parts)); renderParts(); }
function saveBuild(){ localStorage.setItem(BUILD_KEY, JSON.stringify(build)); renderBuild(); }
function saveUser(user){ localStorage.setItem(USER_KEY, JSON.stringify(user)); currentUser = user; }

/* -------- Navigation -------- */
navBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    navBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    sections.forEach(sec => sec.classList.remove("active"));
    const target = btn.id.replace("nav", "").toLowerCase() + "Section";
    document.getElementById(target).classList.add("active");
    if (target === "homeSection") renderParts();
    if (target === "compareSection") renderCompare();
    if (target === "productsSection") renderProducts();
    if (target === "accountSection") renderAccount();
    if (target === "cartSection") renderCart();
  });
});

/* -------- Rendering -------- */
function getCategories(){
  const cats = new Set(parts.map(p=>p.category));
  return ["All", ...Array.from(cats).sort()];
}

function renderCategoryFilter(){
  categoryFilter.innerHTML = "";
  compareCategory.innerHTML = "";
  getCategories().forEach(cat=>{
    const opt1 = document.createElement("option");
    opt1.textContent = cat;
    categoryFilter.appendChild(opt1);
    const opt2 = document.createElement("option");
    opt2.textContent = cat;
    compareCategory.appendChild(opt2);
  });
}

function renderParts(){
  const q = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value || "All";
  const sortBy = sortBySelect.value;
  let list = parts.slice();
  if(category !== "All") list = list.filter(p=>p.category === category);
  if(q) list = list.filter(p => (p.name||"").toLowerCase().includes(q));
  if(sortBy === "price") list.sort((a,b)=>(a.price||0)-(b.price||0));
  if(sortBy === "name") list.sort((a,b)=> (a.name||"").localeCompare(b.name||""));
  if(sortBy === "category") list.sort((a,b)=> (a.category||"").localeCompare(b.category||""));

  partsTableBody.innerHTML = "";
  if(list.length===0){
    partsTableBody.innerHTML = "<tr><td colspan='5' class='muted small'>No parts match.</td></tr>";
    return;
  }

  list.forEach(p=>{
    const tr = document.createElement("tr");
    const details = [];
    if(p.socket) details.push(p.socket);
    if(p.ramType) details.push(p.ramType);
    if(p.capacityGB) details.push(p.capacityGB+"GB");
    if(p.interface) details.push(p.interface);
    if(p.wattage) details.push(p.wattage+"W");
    if(p.tdp) details.push("TDP:"+p.tdp+"W");

    tr.innerHTML = `
      <td><strong>${escapeHtml(p.name)}</strong><div class="small muted">${p.id}</div></td>
      <td class="small">${escapeHtml(p.category)}</td>
      <td class="small">${escapeHtml(details.join(" • "))}</td>
      <td class="small">$${Number(p.price||0).toFixed(2)}</td>
      <td style="text-align:right"><button data-id="${p.id}" class="addBtn">Add</button></td>
    `;
    partsTableBody.appendChild(tr);
  });

  // wire add buttons
  partsTableBody.querySelectorAll(".addBtn").forEach(btn=>{
    btn.onclick = ()=> {
      const id = Number(btn.dataset.id);
      const p = parts.find(x=>x.id===id);
      if(p) addToBuild(p);
    };
  });
}

function renderBuild(){
  buildList.innerHTML = "";
  const entries = Object.entries(build);
  if(entries.length === 0){ buildList.innerHTML = "<div class='small muted'>Build is empty</div>"; updateTotalsAndCompatibility(); return; }

  entries.forEach(([slot,p])=>{
    const div = document.createElement("div");
    div.className = "build-item";
    div.innerHTML = `
      <div>
        <div><strong>${escapeHtml(slot)}</strong></div>
        <div class="small muted">${escapeHtml(p.name)}</div>
      </div>
      <div style="text-align:right">
        <div class="small muted">$${Number(p.price||0).toFixed(2)}</div>
        <div style="margin-top:6px"><button class="removeBtn" data-slot="${escapeHtml(slot)}">Remove</button></div>
      </div>
    `;
    buildList.appendChild(div);
  });

  buildList.querySelectorAll(".removeBtn").forEach(b=>{
    b.onclick = ()=> {
      const slot = b.dataset.slot;
      removeFromBuild(slot);
    };
  });

  updateTotalsAndCompatibility();
}

function updateTotalsAndCompatibility(){
  // total price
  const total = Object.values(build).reduce((s,p)=>s + (Number(p.price)||0), 0);
  totalPriceEl.textContent = `$${total.toFixed(2)}`;

  // compatibility
  const issues = computeCompatibilityIssues(build);
  compatBox.innerHTML = "";
  if(issues.length===0){
    compatBox.innerHTML = `<div class="ok">No obvious compatibility issues detected.</div>`;
    return;
  }
  const html = issues.map(i => `<div class="issue">${escapeHtml(i.message)}</div>`).join("");
  compatBox.innerHTML = html;
}

/* -------- Build logic -------- */
function addToBuild(part){
  // allow multiple GPUs (GPU-1, GPU-2...), otherwise one per category.
  if(part.category === "GPU"){
    const gpuCount = Object.keys(build).filter(k=>k.startsWith("GPU")).length;
    build[`GPU-${gpuCount+1}`] = part;
  } else {
    build[part.category] = part;
  }
  saveBuild();
}

function removeFromBuild(slot){
  delete build[slot];
  saveBuild();
}

function clearBuild(){
  build = {};
  saveBuild();
}

/* -------- Compatibility heuristics -------- */
function computeCompatibilityIssues(buildObj){
  const issues = [];
  const values = Object.values(buildObj);
  const cpu = values.find(p=>p.category==="CPU");
  const mobo = values.find(p=>p.category==="Motherboard");
  const ram = values.find(p=>p.category==="RAM");
  const psu = values.find(p=>p.category==="PSU");
  const gpus = Object.keys(buildObj).filter(k=>k.startsWith("GPU")).map(k=>buildObj[k]);

  if(cpu && mobo && cpu.socket && mobo.socket && cpu.socket !== mobo.socket){
    issues.push({type:"socket", message:`CPU socket (${cpu.socket}) doesn't match motherboard socket (${mobo.socket}).`});
  }
  if(mobo && ram && mobo.ramType && ram.ramType && mobo.ramType !== ram.ramType){
    issues.push({type:"ram", message:`Motherboard requires ${mobo.ramType} but selected RAM is ${ram.ramType}.`});
  }

  // Simple PSU check: sum TDPs of CPU+GPUs, multiply by 1.5 margin
  const totalTDP = [cpu, ...gpus].filter(Boolean).reduce((s,p)=>s + (Number(p.tdp)||0), 0);
  if(psu && psu.wattage && totalTDP){
    const required = Math.ceil(totalTDP * 1.5);
    if(Number(psu.wattage) < required){
      issues.push({type:"psu", message:`Selected PSU (${psu.wattage}W) may be insufficient for estimated draw (${totalTDP}W). Consider >= ${required}W.`});
    }
  }

  return issues;
}

/* -------- CSV export/import -------- */
function exportBuildCSV(){
  const rows = [["slot","id","name","category","price"]];
  Object.entries(build).forEach(([slot,p])=>{
    rows.push([slot,p.id,p.name,p.category,p.price]);
  });
  const csv = rows.map(r=> r.map(c=> `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "build.csv"; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

function importPartsCSV(file){
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const lines = text.split(/\r?\n/).filter(Boolean);
    if(lines.length < 2) return alert("CSV appears empty or malformed.");
    const headers = lines.shift().split(",").map(s=>s.replace(/^"|"$/g,"").trim());
    const newParts = lines.map(line=>{
      // naive CSV parse (works for simple quoted CSVs)
      const cols = splitCSVLine(line);
      const obj = {};
      cols.forEach((c,i)=> obj[headers[i]] = c.replace(/^"|"$/g,""));
      // normalize fields
      if(obj.id) obj.id = Number(obj.id);
      else obj.id = Date.now() + Math.floor(Math.random()*10000);
      if(obj.price) obj.price = Number(obj.price);
      if(obj.wattage) obj.wattage = Number(obj.wattage);
      if(obj.tdp) obj.tdp = Number(obj.tdp);
      return obj;
    });
    // prepend imported (but don't duplicate ids)
    const existingIds = new Set(parts.map(p=>p.id));
    parts = [...newParts.filter(p=>!existingIds.has(p.id)), ...parts];
    saveParts();
    renderCategoryFilter();
    renderParts();
    alert(`Imported ${newParts.length} rows (duplicates skipped by id).`);
  };
  reader.readAsText(file);
}

function splitCSVLine(line){
  // Simple CSV splitter that supports quoted fields (not fully RFC-compliant but adequate for basic usage)
  const out = []; let cur = "", inQuotes=false;
  for(let i=0;i<line.length;i++){
    const ch = line[i];
    if(ch === '"' ) {
      if(inQuotes && line[i+1] === '"') { cur += '"'; i++; continue; }
      inQuotes = !inQuotes; continue;
    }
    if(ch === ',' && !inQuotes){ out.push(cur); cur=""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

/* -------- Helpers & small UI actions -------- */
function escapeHtml(s){ if(s===undefined||s===null) return ""; return String(s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

/* -------- New Functions for Sections -------- */
function renderCompare(){
  const category = compareCategory.value || "All";
  let list = parts.slice();
  if(category !== "All") list = list.filter(p=>p.category === category);
  comparePartsList.innerHTML = "";
  selectedForCompare = [];
  list.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<input type="checkbox" class="compare-checkbox" data-id="${p.id}" /> ${escapeHtml(p.name)}`;
    comparePartsList.appendChild(div);
  });
  compareTable.innerHTML = "";
}

compareBtn.onclick = () => {
  selectedForCompare = [];
  comparePartsList.querySelectorAll(".compare-checkbox:checked").forEach(cb => {
    const id = Number(cb.dataset.id);
    const p = parts.find(x=>x.id===id);
    if(p) selectedForCompare.push(p);
  });
  if(selectedForCompare.length < 2) return alert("Select at least 2 parts to compare.");
  compareTable.innerHTML = "";
  const table = document.createElement("table");
  table.innerHTML = `
    <thead><tr><th>Spec</th>${selectedForCompare.map(p=>`<th>${escapeHtml(p.name)}</th>`).join("")}</tr></thead>
    <tbody>
      <tr><td>Price</td>${selectedForCompare.map(p=>`<td>$${Number(p.price||0).toFixed(2)}</td>`).join("")}</tr>
      <tr><td>TDP</td>${selectedForCompare.map(p=>`<td>${p.tdp||'N/A'}W</td>`).join("")}</tr>
      <tr><td>Category</td>${selectedForCompare.map(p=>`<td>${escapeHtml(p.category)}</td>`).join("")}</tr>
      <tr><td>Socket/RAM Type</td>${selectedForCompare.map(p=>`<td>${escapeHtml(p.socket||p.ramType||'N/A')}</td>`).join("")}</tr>
    </tbody>
  `;
  compareTable.appendChild(table);
};

function renderProducts(){
  productsList.innerHTML = "";
  parts.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-item";
    div.innerHTML = `
      <div><strong>${escapeHtml(p.name)}</strong> - $${Number(p.price||0).toFixed(2)}</div>
      <button class="toggle-details">Show Details</button>
      <div class="product-details">${Object.entries(p).map(([k,v])=>`<div><strong>${k}:</strong> ${v}</div>`).join("")}</div>
    `;
    productsList.appendChild(div);
  });
  productsList.querySelectorAll(".toggle-details").forEach(btn => {
    btn.onclick = () => {
      const details = btn.nextElementSibling;
      details.style.display = details.style.display === "block" ? "none" : "block";
      btn.textContent = details.style.display === "block" ? "Hide Details" : "Show Details";
    };
  });
}

function renderAccount(){
  if(currentUser){
    loginForm.style.display = "none";
    accountInfo.style.display = "block";
    userDisplay.textContent = currentUser.username;
    savedBuilds.textContent = Object.keys(build).length; // Placeholder
  } else {
    loginForm.style.display = "block";
    accountInfo.style.display = "none";
  }
}

loginBtn.onclick = () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if(!username || !password) return alert("Enter username and password.");
  // Simple check (in real app, hash passwords)
  const users = JSON.parse(localStorage.getItem("tpp_users") || "{}");
  if(users[username] && users[username] === password){
    saveUser({username});
    renderAccount();
  } else {
    alert("Invalid credentials.");
  }
};

registerBtn.onclick = () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if(!username || !password) return alert("Enter username and password.");
  const users = JSON.parse(localStorage.getItem("tpp_users") || "{}");
  if(users[username]) return alert("User already exists.");
  users[username] = password;
  localStorage.setItem("tpp_users", JSON.stringify(users));
  saveUser({username});
  renderAccount();
};

logoutBtn.onclick = () => {
  saveUser(null);
  renderAccount();
};

function renderCart(){
  cartItems.innerHTML = "";
  const entries = Object.entries(build);
  if(entries.length === 0){
    cartItems.innerHTML = "<div class='small muted'>Cart is empty</div>";
    cartTotal.textContent = "$0";
    return;
  }

  entries.forEach(([slot,p])=>{
    const div = document.createElement("div");
    div.className = "build-item";
    div.innerHTML = `
      <div>
        <div><strong>${escapeHtml(slot)}</strong></div>
        <div class="small muted">${escapeHtml(p.name)}</div>
      </div>
      <div style="text-align:right">
        <div class="small muted">$${Number(p.price||0).toFixed(2)}</div>
        <div style="margin-top:6px"><button class="removeBtn" data-slot="${escapeHtml(slot)}">Remove</button></div>
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartItems.querySelectorAll(".removeBtn").forEach(b=>{
    b.onclick = ()=> {
      const slot = b.dataset.slot;
      removeFromBuild(slot);
      renderCart();
    };
  });

  const total = Object.values(build).reduce((s,p)=>s + (Number(p.price)||0), 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

checkoutBtn.onclick = () => {
  if(Object.keys(build).length === 0) return alert("Cart is empty.");
  alert("Checkout successful! Your build has been processed.");
  clearBuild();
  renderCart();
};

/* -------- Event wiring -------- */
searchInput.oninput = ()=> renderParts();
categoryFilter.onchange = ()=> renderParts();
sortBySelect.onchange = ()=> renderParts();

addSampleBtn.onclick = ()=>{
  // open a quick prompt to add a part (simple UX)
  const name = prompt("Part name (e.g. 'Cool Brand 123'):");
  if(!name) return;
  const category = prompt("Category (CPU, Motherboard, RAM, GPU, PSU, Storage, Case, Cooler):","Misc") || "Misc";
  const price = Number(prompt("Price (USD):","0")) || 0;
  const obj = { id: Date.now(), name, category, price };
  const extra = prompt("Extra attributes (key=value pairs comma separated). Example: socket=LGA1700,tdp=125,ramType=DDR5");
  if(extra){
    extra.split(",").forEach(kv=>{
      const [k,v] = kv.split("=").map(s=>s && s.trim());
      if(!k) return;
      // simple conversions
      if(k === "tdp" || k === "wattage" || k === "price" || k === "capacityGB") obj[k] = Number(v);
      else if(k === "supportedSockets") obj[k] = v.split("|");
      else obj[k] = v;
    });
  }
  parts.unshift(obj);
  saveParts();
  renderCategoryFilter();
  renderParts();
};

clearPartsBtn.onclick = ()=> {
  if(!confirm("Reset parts database to built-in sample data? This will replace your saved parts.")) return;
  parts = [...SAMPLE_PARTS];
  saveParts();
  renderCategoryFilter();
  renderParts();
};

importPartsInput.onchange = (e)=>{
  const f = e.target.files[0];
  if(f) importPartsCSV(f);
  importPartsInput.value = "";
};

exportBuildBtn.onclick = exportBuildCSV;
clearBuildBtn.onclick = ()=>{ if(confirm("Clear the current build?")) { clearBuild(); } };

compareCategory.onchange = renderCompare;

/* keyboard: Enter on search to focus first add button (small convenience) */
searchInput.addEventListener("keydown", (e)=>{
  if(e.key === "Enter"){
    const first = partsTableBody.querySelector(".addBtn");
    if(first) first.click();
  }
});

/* initial render */
renderCategoryFilter();
renderParts();
renderAccount();

/* expose save function for parts modifications */
window.saveParts = saveParts;

/* ---- end ---- */