const DATA_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec";

const RANK_ORDER = ["1軍", "2軍", "3軍", "研修生", "審査落ち"];

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("closerSelect");
  const zoomInput = document.getElementById("zoom");
  const searchInput = document.getElementById("search");

  let data = [];

  try {
    const res = await fetch(DATA_URL);
    const jsonData = await res.json();
    data = jsonData.filter(item => item.rank !== "引退");
  } catch (e) {
    select.innerHTML = "<option>データ取得失敗</option>";
    return;
  }

  function renderOptions(filter = "") {
    select.innerHTML = "";

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "選択してください";
    select.appendChild(defaultOpt);

    RANK_ORDER.forEach(rank => {
      const items = data
        .filter(item => item.rank === rank)
        .filter(item => item.name.includes(filter));

      if (items.length === 0) return;

      const group = document.createElement("optgroup");
      group.label = rank;

      items.forEach((item, index) => {
        const opt = document.createElement("option");
        opt.value = index;
        opt.textContent = item.name;
        group.appendChild(opt);
      });

      select.appendChild(group);
    });

    zoomInput.value = "";
  }

  renderOptions();

  searchInput.addEventListener("input", () => {
    renderOptions(searchInput.value);
  });

  select.addEventListener("change", () => {
    const selected = data[select.value];
    zoomInput.value = selected ? selected.zoom : "";
  });
});
