const DATA_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec"; // ←最新デプロイURLに置き換える

const RANK_ORDER = ["トップセールス", "2軍", "3軍", "研修生", "審査落ち"];

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("closerSelect");
  const zoomInput = document.getElementById("zoom");

  let data = [];

  try {
    const res = await fetch(DATA_URL);
    const json = await res.json();

    // 🔹 ヘッダーあり形式前提（A=name, B=zoom, C=rank）
    data = json
      .filter(item => item.rank !== "引退")
      .map(item => ({
        name: item.name,
        zoom: item.zoom,
        rank: item.rank
      }));

  } catch (e) {
    select.innerHTML = "<option>取得失敗</option>";
    console.error(e);
    return;
  }

  // ランク順にソート
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
    opt.textContent = `${item.name} (${item.rank})`;
    select.appendChild(opt);
  });

  // 選択時
  select.addEventListener("change", () => {
    const selected = data.find(d => d.name === select.value);
    zoomInput.value = selected ? selected.zoom : "";
  });
});
