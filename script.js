const API_URL = "https://script.google.com/macros/s/AKfycbzEl7xsmRf765t1ejf-JSjosRJAByBiZ4cqsmpDgMWkrczUGcpuXQg5WcYajr_nJ-Hx/exec";

let templates = [];
let currentTemplate = null;

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("templateSelect").addEventListener("change", onTemplateChange);
  document.getElementById("copyButton").addEventListener("click", copyOutputText);

  await loadTemplates();
});

async function loadTemplates() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    templates = data || [];
    renderTemplateOptions();
  } catch (error) {
    console.error(error);
    alert("テンプレートの読み込みに失敗しました");
  }
}

function renderTemplateOptions() {
  const select = document.getElementById("templateSelect");
  select.innerHTML = '<option value="">選択してください</option>';

  templates.forEach(template => {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.category
      ? `${template.name}（${template.category}）`
      : template.name;
    select.appendChild(option);
  });
}

function onTemplateChange(e) {
  const templateId = e.target.value;
  currentTemplate = templates.find(t => t.id === templateId) || null;

  if (!currentTemplate) {
    document.getElementById("fieldsContainer").innerHTML = "";
    document.getElementById("outputText").value = "";
    return;
  }

  renderFields(currentTemplate.fields);
  updateOutput();
}

function renderFields(fields) {
  const container = document.getElementById("fieldsContainer");
  container.innerHTML = "";

  if (!fields || fields.length === 0) {
    container.innerHTML = '<p class="empty-message">入力項目がありません。</p>';
    return;
  }

  fields.forEach(field => {
    const wrapper = document.createElement("div");

    const label = document.createElement("label");
    label.textContent = field.label;

    if (field.required) {
      const required = document.createElement("span");
      required.className = "required";
      required.textContent = " *";
      label.appendChild(required);
    }

    let input;
    if (field.inputType === "textarea") {
      input = document.createElement("textarea");
      input.rows = 3;
    } else {
      input = document.createElement("input");
      input.type = field.inputType || "text";
    }

    input.dataset.key = field.key;
    input.placeholder = field.placeholder || "";
    input.value = field.defaultValue || "";
    input.addEventListener("input", updateOutput);

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    container.appendChild(wrapper);
  });
}

function updateOutput() {
  if (!currentTemplate) return;

  const values = {};
  const inputs = document.querySelectorAll("[data-key]");

  inputs.forEach(input => {
    values[input.dataset.key] = input.value || "";
  });

  const result = replaceTemplate(currentTemplate.body, values);
  document.getElementById("outputText").value = result;
}

function replaceTemplate(templateBody, values) {
  let result = templateBody || "";

  for (const [key, value] of Object.entries(values)) {
    const escapedKey = escapeRegExp(key);
    const pattern = new RegExp(`\\$\\{${escapedKey}\\}`, "g");
    result = result.replace(pattern, value);
  }

  return result;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function copyOutputText() {
  const output = document.getElementById("outputText").value;

  if (!output) {
    alert("コピーするテキストがありません");
    return;
  }

  try {
    await navigator.clipboard.writeText(output);
    alert("コピーしました");
  } catch (error) {
    fallbackCopy(output);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  alert("コピーしました");
}