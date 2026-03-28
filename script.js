// ★ GASのデプロイURLに書き換えてください
const API_URL = "https://script.google.com/macros/s/AKfycbzyheW4RdB_jYSf1ffYtVL5dg1CghQxCmSbpywaCeO-1ATGX5jX7VXStSscmA3hZj4R/exec";

let templates = [];
let currentTemplate = null;

const els = {
  templateSelect: document.getElementById("templateSelect"),
  templateMeta: document.getElementById("templateMeta"),
  parserSection: document.getElementById("parserSection"),
  formPasteText: document.getElementById("formPasteText"),
  parseButton: document.getElementById("parseButton"),
  fieldsContainer: document.getElementById("fieldsContainer"),
  outputText: document.getElementById("outputText"),
  copyButton: document.getElementById("copyButton"),
  clearButton: document.getElementById("clearButton"),
};

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  await loadTemplates();
});

function bindEvents() {
  els.templateSelect.addEventListener("change", onTemplateChange);
  els.parseButton.addEventListener("click", handleAutoFill);
  els.copyButton.addEventListener("click", copyOutputText);
  els.clearButton.addEventListener("click", clearInputs);
}

async function loadTemplates() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    templates = json.templates || [];
    renderTemplateOptions();
  } catch (error) {
    alert("テンプレートの取得に失敗しました。");
  }
}

function renderTemplateOptions() {
  els.templateSelect.innerHTML = '<option value="">テンプレートを選択してください</option>';
  templates.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.category ? `[${t.category}] ${t.name}` : t.name;
    els.templateSelect.appendChild(opt);
  });
}

function onTemplateChange(e) {
  const id = e.target.value;
  currentTemplate = templates.find(t => t.id === id) || null;
  resetUI();

  if (!currentTemplate) return;

  els.templateMeta.textContent = `ID: ${currentTemplate.id} / 自動解析: ${currentTemplate.enableFormParser ? 'ON' : 'OFF'}`;
  
  if (currentTemplate.enableFormParser) {
    els.parserSection.classList.remove("hidden");
  }

  renderFields(currentTemplate.fields || []);
  updateOutput();
}

function renderFields(fields) {
  els.fieldsContainer.innerHTML = "";
  fields.forEach(f => {
    const div = document.createElement("div");
    div.className = "field-group";
    div.innerHTML = `<label>${f.label}${f.required ? ' *' : ''}</label>`;
    
    const input = f.inputType === "textarea" ? document.createElement("textarea") : document.createElement("input");
    input.dataset.key = f.key;
    input.placeholder = f.placeholder || "";
    input.value = f.defaultValue || "";
    input.addEventListener("input", updateOutput);
    
    div.appendChild(input);
    els.fieldsContainer.appendChild(div);
  });
}

function updateOutput() {
  if (!currentTemplate) return;
  const values = {};
  document.querySelectorAll("[data-key]").forEach(el => {
    values[el.dataset.key] = el.value || `[${el.dataset.key}]`;
  });
  els.outputText.value = replaceTemplate(currentTemplate.body || "", values);
}

// ご指定の置換関数
function replaceTemplate(templateBody, values) {
  let result = templateBody;
  for (const [key, value] of Object.entries(values)) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\$\\{${escapedKey}\\}`, "g");
    result = result.replace(pattern, value);
  }
  return result;
}

function handleAutoFill() {
  if (!currentTemplate) return;
  const rawText = els.formPasteText.value.trim();
  if (!rawText) return;

  const parsed = parseUtageBasic(rawText);
  const allowed = currentTemplate.autoFillFields || [];

  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.dataset.key;
    if (allowed.includes(key) && parsed[key]) {
      el.value = parsed[key];
    }
  });
  updateOutput();
}

function parseUtageBasic(text) {
  return {
    eventName: extractValue(text, /■イベント名：([^\n\r]+)/),
    eventDate: extractValue(text, /■日程：([^\n\r]+)/),
    userName: extractValue(text, /■お名前：([^\n\r]+)/),
  };
}

function extractValue(text, regex) {
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

async function copyOutputText() {
  await navigator.clipboard.writeText(els.outputText.value);
  alert("コピーしました");
}

function clearInputs() {
  document.querySelectorAll("[data-key]").forEach(el => el.value = "");
  els.formPasteText.value = "";
  updateOutput();
}

function resetUI() {
  els.templateMeta.textContent = "";
  els.fieldsContainer.innerHTML = '<p class="placeholder-text">テンプレートを選択してください</p>';
  els.outputText.value = "";
  els.formPasteText.value = "";
  els.parserSection.classList.add("hidden");
}
