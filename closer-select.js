const DATA_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec";

const RANK_ORDER = ["トップセールス", "2軍", "3軍", "研修生", "審査落ち"];

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("closerSelect");
  const zoomInput = document.getElementById("zoom");

  let data = [];

  try {
    const res = await fetch(DATA_URL);
    const json = await res.json();

    // ヘッダーなし前提 → item[0]=名前, item[1]=zoom, item[2]=rank
    data = json.map(item => ({
      name: item[0],
      zoom: item[1],
      rank: item[2]
    }));

  } catch (e) {
    select.innerHTML = "<option>取得失敗</option>";
    console.error(e);
    return;
  }

  // 並び替え
  data.sort((a, b) => RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank));

  // プルダウン生成
  select.innerHTML = "";
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "選択してください";
  select.appendChild(defaultOpt);

  data.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.name;
    opt.textContent = `${item.name} (${item.rank})`; // ← ランク表示を追加
    select.appendChild(opt);
  });

  // 選択時
  select.addEventListener("change", () => {
    const selected = data.find(d => d.name === select.value);
    zoomInput.value = selected ? selected.zoom : "";
  });
});
