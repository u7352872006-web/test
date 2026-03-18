/**
 * セールスマンのプルダウンを生成するコンポーネント
 * @param {string} targetId - 挿入先のHTML要素ID
 */
export async function initCloserSelect(targetId) {
    const API_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec";
    const container = document.getElementById(targetId);

    // 表示優先順位の定義
    const rankPriority = ["トップセールス", "2軍", "3軍", "研修生", "審査落ち"];

    if (!container) return;

    try {
        const response = await fetch(API_URL);
        const rawData = await response.json();

        // 1. 「引退」を除外
        const filtered = rawData.filter(item => item.rank !== "引退");

        // 2. 指定のランク順にソート
        filtered.sort((a, b) => {
            const indexA = rankPriority.indexOf(a.rank);
            const indexB = rankPriority.indexOf(b.rank);
            
            // 優先順位リストにないランクは最後に回す
            const valA = indexA === -1 ? 99 : indexA;
            const valB = indexB === -1 ? 99 : indexB;
            
            return valA - valB;
        });

        // 3. プルダウンの組み立て
        const select = document.createElement('select');
        
        const placeholder = document.createElement('option');
        placeholder.textContent = "担当者を選択してください";
        placeholder.value = "";
        select.appendChild(placeholder);

        filtered.forEach(person => {
            const option = document.createElement('option');
            // 表示名：名前（ランク）
            option.textContent = `${person.name}（${person.rank}）`;
            // 値：Zoomリンク
            option.value = person.zoom;
            select.appendChild(option);
        });

        // 画面に反映
        container.innerHTML = '';
        container.appendChild(select);

        // (オプション) 選択時の挙動
        select.addEventListener('change', (e) => {
            if (e.target.value) {
                console.log("Selected Zoom URL:", e.target.value);
            }
        });

    } catch (err) {
        container.innerHTML = '<p style="color:red; font-size:12px;">データの読み込みに失敗しました。</p>';
        console.error("Fetch error:", err);
    }
}
