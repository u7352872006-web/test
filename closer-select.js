const DATA_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec";

const RANK_ORDER = ["トップセールス", "2軍", "3軍", "研修生", "審査落ち"];

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("closerSelect");
  const zoomInput = document.getElementById("zoom");

  let data = [];

  try {
    const res = await fetch(DATA_URL);
    const json = await res.json();

    // 必要な形に変換（A=名前, B=zoom, C=ランク）
    data = json.map(item => ({
      name: item.name,
      zoom: item.zoom,
      rank: item.rank
    }));

  } catch (e) {
    select.innerHTML = "<option>取得失敗</option>";
    return;
  }

  // 並び替え
  data.sort((a, b) => {
    return RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank);
  });

  // プルダウン作成
  data.forEach((item, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = item.name;
    select.appendChild(opt);
  });

  // 選択時
  select.addEventListener("change", () => {
    const selected = data[select.value];
    zoomInput.value = selected ? selected.zoom : "";
  });
});
