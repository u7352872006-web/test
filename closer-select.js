export async function initCloserSelect(targetId, inputId) {
    const API_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec";
    const container = document.getElementById(targetId);
    const urlInput = document.getElementById(inputId);

    const rankOrder = ["トップセールス", "2軍", "3軍", "研修生", "審査落ち"];
    const colors = {
        "トップセールス": "#ffeb3b",
        "2軍": "#c8e6c9",
        "3軍": "#e3f2fd",
        "研修生": "#f5f5f5",
        "審査落ち": "#ffcdd2"
    };

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const filtered = data
            .filter(item => item.rank !== "引退")
            .sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

        const select = document.createElement('select');
        select.id = "main-select";
        select.innerHTML = '<option value="" data-color="#ffffff">選択してください</option>';

        filtered.forEach(item => {
            const option = document.createElement('option');
            option.textContent = `${item.name}（${item.rank}）`;
            option.value = item.zoom; // これがB列のURL
            
            // ランクに応じた色をデータ属性として保持
            const bgColor = colors[item.rank] || "#ffffff";
            option.setAttribute('data-color', bgColor);
            
            // ブラウザ対応のためoption自体にもスタイル付与
            option.style.backgroundColor = bgColor;
            select.appendChild(option);
        });

        // チェンジイベント
        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            
            // 1. Zoomリンクをテキストボックスに即時反映
            urlInput.value = this.value;

            // 2. プルダウン自体の背景色を選択したランクの色に即時変更
            const bgColor = selectedOption.getAttribute('data-color');
            this.style.backgroundColor = bgColor;
        });

        container.appendChild(select);

    } catch (err) {
        console.error("Fetch Error:", err);
    }
}
