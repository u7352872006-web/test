// Apps ScriptのJSONデータURL
const DATA_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec";

// ランクの順序
const RANK_ORDER = ["トップセールス", "2軍", "3軍", "研修生", "審査落ち"];

document.addEventListener("DOMContentLoaded", async () => {
  const zoomInput = document.getElementById("zoom");
  const showBtn = document.getElementById("showModal");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementById("closeModal");

  // データ取得
  let data = [];
  try {
    const res = await fetch(DATA_URL);
    data = await res.json();
  } catch(e) {
    modalContent.innerText = "データ取得に失敗しました";
    console.error(e);
  }

  // ボタン押下でモーダル表示
  showBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    renderModal(data);
  });

  // モーダル閉じる
  closeBtn.addEventListener("click", () => modal.style.display = "none");

  // モーダルレンダリング
  function renderModal(data) {
    modalContent.innerHTML = "";

    RANK_ORDER.forEach(rank => {
      const rankDiv = document.createElement("div");
      const rankTitle = document.createElement("h4");
      rankTitle.textContent = rank;
      rankDiv.appendChild(rankTitle);

      const rankButtons = document.createElement("div");
      rankButtons.style.display = "flex";
      rankButtons.style.flexWrap = "wrap";
      rankButtons.style.gap = "6px";

      data.filter(item => item.rank === rank)
          .forEach(item => {
            const btn = document.createElement("button");
            btn.textContent = item.name;
            btn.onclick = () => {
              zoomInput.value = item.zoom;
              modal.style.display = "none";
            };
            rankButtons.appendChild(btn);
          });

      rankDiv.appendChild(rankButtons);
      modalContent.appendChild(rankDiv);
    });
  }
});
