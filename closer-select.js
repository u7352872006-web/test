const DATA_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec";

// ランク順と背景色
const RANK_ORDER = ["トップセールス", "2軍", "3軍", "研修生", "審査落ち"];
const RANK_COLOR = {
  "トップセールス": "#d1e7dd",
  "2軍": "#cff4fc",
  "3軍": "#fff3cd",
  "研修生": "#f8d7da",
  "審査落ち": "#e2e3e5"
};

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("select");
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
  function renderOptions() {
    select.innerHTML = "";

    // 初期値
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "選択してください";
    select.appendChild(defaultOpt);

    // ランク順にオプションを追加
    RANK_ORDER.forEach(rank => {
      const items = data.filter(item => item.rank === rank);

      items.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.name;
        opt.textContent = `${item.name} (${item.rank})`;
        opt.style.backgroundColor = RANK_COLOR[rank] || "#fff";
        select.appendChild(opt);
      });
    });

    // 初期状態ではZoomリンクは空
    zoomInput.value = "";
  }

  renderOptions();

  // 選択時にZoomリンク反映
  select.addEventListener("change", () => {
    const selected = data.find(d => d.name === select.value);
    zoomInput.value = selected ? selected.zoom : "";
  });
});
