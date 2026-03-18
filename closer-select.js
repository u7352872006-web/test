const DATA_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec";

const RANK_ORDER = ["トップセールス", "2軍", "3軍", "研修生", "審査落ち"];

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("closerSelect");
  const zoomInput = document.getElementById("zoom");

  let data = [];

  try {
    const res = await fetch(DATA_URL);
    const jsonData = await res.json();

    // 引退を除外
    data = jsonData.filter(item => item.rank !== "引退");

    // ランク順にソート
    data.sort((a, b) => RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank));

  } catch(e) {
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

    // 名前 + ランク
    data.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.name;
      opt.textContent = `${item.name} (${item.rank})`;
      select.appendChild(opt);
    });

    zoomInput.value = "";
  }

  renderOptions();

  // 選択時にZoomリンク反映
  select.addEventListener("change", () => {
    const selected = data.find(d => d.name === select.value);
    zoomInput.value = selected ? selected.zoom : "";
  });
});
