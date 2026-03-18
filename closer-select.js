const DATA_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec";

// ランク順と背景色
const RANK_ORDER = ["1軍", "2軍", "3軍", "研修生", "審査落ち"];
const RANK_COLOR = {
  "1軍": "#d1e7dd",
  "2軍": "#cff4fc",
  "3軍": "#fff3cd",
  "研修生": "#f8d7da",
  "審査落ち": "#e2e3e5"
};

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("select");
  const search = document.getElementById("search");
  const zoomInput = document.getElementById("zoom");

  let data = [];

  // データ取得
  try {
    const res = await fetch(DATA_URL);
    const jsonData = await res.json();
    // 引退を除外
    data = jsonData.filter(item => item.rank !== "引退");
  } catch (e) {
    console.error("データ取得エラー:", e);
    select.innerHTML = "<option>データ取得に失敗しました</option>";
    return;
  }

  // プルダウン生成
  function renderOptions(keyword = "") {
    select.innerHTML = "";

    RANK_ORDER.forEach(rank => {
      const items = data.filter(item => item.rank === rank &&
        item.name.toLowerCase().includes(keyword.toLowerCase())
      );

      items.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.name;
        opt.textContent = `${item.name} (${item.rank})`;
        opt.style.backgroundColor = RANK_COLOR[rank] || "#fff";
        select.appendChild(opt);
      });
    });

    // 初期表示：最初のZoomリンクを反映
    if (select.options.length > 0) {
      select.selectedIndex = 0;
      zoomInput.value = data.find(d => d.name === select.value)?.zoom || "";
    } else {
      zoomInput.value = "";
    }
  }

  // 初回表示
  renderOptions();

  // 検索ボックス入力時にフィルター
  search.addEventListener("input", () => {
    renderOptions(search.value);
  });

  // プルダウン選択時にZoomリンク反映
  select.addEventListener("change", () => {
    const selected = data.find(d => d.name === select.value);
    if (selected) zoomInput.value = selected.zoom;
  });
});
