class ClosersModule extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.data = [];
  }

  connectedCallback() {
    this.url = this.getAttribute("url"); // Apps Script URL
    this.renderBase();
    this.loadData();
  }

  renderBase() {
    this.shadowRoot.innerHTML = `
      <input id="search" type="text" placeholder="名前検索">
      <div id="list" style="margin-bottom:8px;"></div>
      <label>Zoomリンク:</label>
      <input id="zoom" type="text" readonly style="width:100%;">
      <style>
        input { width: 100%; padding: 6px; margin-bottom: 4px; }
        .item { padding: 6px; cursor: pointer; border-bottom: 1px solid #eee; }
        .item:hover { background: #f0f0f0; }
      </style>
    `;

    this.shadowRoot.querySelector("#search")
      .addEventListener("input", e => this.renderList(e.target.value));
  }

  async loadData() {
    try {
      const res = await fetch(this.url);
      this.data = await res.json(); // Apps ScriptからJSON取得
      this.renderList("");
    } catch(e) {
      console.error("データ取得エラー:", e);
      this.shadowRoot.querySelector("#list").textContent = "データ取得に失敗しました";
    }
  }

  renderList(keyword) {
    const list = this.shadowRoot.querySelector("#list");
    list.innerHTML = "";

    const filtered = this.data.filter(item =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );

    filtered.forEach(item => {
      const div = document.createElement("div");
      div.className = "item";
      div.textContent = item.name + (item.rank ? ` (${item.rank})` : '');
      div.onclick = () => {
        this.shadowRoot.querySelector("#zoom").value = item.zoom;
      };
      list.appendChild(div);
    });

    this.shadowRoot.querySelector("#zoom").value = filtered[0]?.zoom || "";
  }
}

customElements.define("closer-select", ClosersModule);