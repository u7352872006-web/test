class ClosersModule extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.data = [];
    this.rankOrder = ["1軍", "2軍", "3軍", "研修生", "審査落ち"];
    this.rankColors = {
      "1軍": "#d1e7dd",
      "2軍": "#cff4fc",
      "3軍": "#fff3cd",
      "研修生": "#f8d7da",
      "審査落ち": "#e2e3e5"
    };
  }

  connectedCallback() {
    this.url = this.getAttribute("url");
    this.renderBase();
    this.loadData();
  }

  renderBase() {
    this.shadowRoot.innerHTML = `
      <input id="search" type="text" placeholder="名前検索" style="width:100%; margin-bottom:4px; padding:6px;">
      <select id="select" style="width:100%; padding:6px;"></select>
      <style>
        option { padding:4px; }
      </style>
    `;

    this.shadowRoot.querySelector("#search")
      .addEventListener("input", e => this.renderOptions(e.target.value));
    
    this.shadowRoot.querySelector("#select")
      .addEventListener("change", e => {
        const selected = this.data.find(d => d.name === e.target.value);
        if (selected) {
          document.getElementById("zoom").value = selected.zoom;
        }
      });
  }

  async loadData() {
    try {
      const res = await fetch(this.url);
      const jsonData = await res.json();
      // 「引退」を除外
      this.data = jsonData.filter(item => item.rank !== "引退");
      this.renderOptions("");
    } catch(e) {
      console.error("データ取得エラー:", e);
    }
  }

  renderOptions(keyword) {
    const select = this.shadowRoot.querySelector("#select");
    select.innerHTML = "";

    this.rankOrder.forEach(rank => {
      const items = this.data.filter(item => item.rank === rank &&
        item.name.toLowerCase().includes(keyword.toLowerCase())
      );

      items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.name;
        option.textContent = `${item.name} (${item.rank})`;
        option.style.backgroundColor = this.rankColors[rank] || "#fff";
        select.appendChild(option);
      });
    });

    // 選択肢があれば最初のZoomリンクを反映
    const first = select.options[0];
    if (first) {
      select.value = first.value;
      document.getElementById("zoom").value = this.data.find(d => d.name === first.value)?.zoom || "";
    } else {
      document.getElementById("zoom").value = "";
    }
  }
}

customElements.define("closer-select", ClosersModule);
