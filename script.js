/* -------- Sample data & persistence -------- */
// Note: This script depends on parts.js being loaded first, which defines SAMPLE_PARTS.

const PARTS_KEY = "tpp_parts_v1_html";
const BUILD_KEY = "tpp_build_v1_html";

let parts = loadParts();
let build = loadBuild();
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
const logoutBtn = document.getElementById("logoutBtn");
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
function saveParts(){ localStorage.setItem(PARTS_KEY, JSON.stringify(parts)); renderParts(); }
function saveBuild(){ localStorage.setItem(BUILD_KEY, JSON.stringify(build)); renderBuild(); }

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
  const html = issues.map(i => `<div class="issue">${
