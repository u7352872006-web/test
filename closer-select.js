/**
 * @param {string} targetId - プルダウン挿入先のID
 * @param {string} inputId - URLを表示するinput要素のID
 */
export async function initCloserSelect(targetId, inputId) {
    const API_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec";
    const container = document.getElementById(targetId);
    const urlInput = document.getElementById(inputId);

    const rankOrder = ["トップセールス", "2軍", "3軍", "研修生", "審査落ち"];
    
    // ランク別の背景色定義
    const colors = {
        "トップセールス": "#ffeb3b", // 黄
        "2軍": "#c8e6c9",           // 薄緑
        "3軍": "#e3f2fd",           // 薄青
        "研修生": "#f5f5f5",         // 薄灰
        "審査落ち": "#ffcdd2"        // 薄赤
    };

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const filtered = data
            .filter(item => item.rank !== "引退" && rankOrder.includes(item.rank))
            .sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

        const select = document.createElement('select');
        select.innerHTML = '<option value="">選択してください</option>';

        filtered.forEach(item => {
            const option = document.createElement('option');
            option.textContent = `${item.name}（${item.rank}）`;
            option.value = item.zoom;
            // ランクに応じた背景色をオプションに設定
            option.style.backgroundColor = colors[item.rank] || "#white";
            select.appendChild(option);
        });

        // 選択変更時の処理：背景色を同期させ、inputにURLを表示
        select.addEventListener('change', (e) => {
            const selectedUrl = e.target.value;
            const selectedOption = e.target.options[e.target.selectedIndex];
            
            // inputにZoomリンクを表示
            urlInput.value = selectedUrl;
            
            // select自体の背景色も選択されたランクの色に変更
            select.style.backgroundColor = selectedOption.style.backgroundColor;
        });

        container.appendChild(select);

    } catch (err) {
        console.error("Error:", err);
    }
}
