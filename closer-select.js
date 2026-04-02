export async function initCloserSelect(targetId, inputId, onChangeCallback) {
    const API_URL = "https://script.google.com/macros/s/AKfycbySHVscjhTYWKf8bLJUGIMJ7AArbsp8cS8wl0O8FyYjYoO2mRzMO8jZhcc_cmhDvYfIhA/exec";
    const container = document.getElementById(targetId);
    const urlInput = document.getElementById(inputId);

    const colors = {
        "トップセールス": "#FFF0F0", // 極薄ピンク
        "2軍": "#F0F7FF",          // 極薄水色
        "3軍": "#FFFFF0",          // 極薄黄色
        "育成枠": "#F2F9F2",        // 極薄緑
        "審査落のみ": "#F5F0FF"       // 極薄紫
    };
    const rankOrder = Object.keys(colors);

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const select = document.createElement('select');
        select.style.backgroundColor = "#ffffff";
        
        // オプション生成（初期値 + フィルタリング & ソート済みデータ）
        const optionsHtml = [
            '<option value="" style="background-color: #ffffff;">選択してください</option>',
            ...data
                .filter(item => item.rank !== "引退")
                .sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank))
                .map(item => `<option value="${item.zoom}" style="background-color: ${colors[item.rank] || "#ffffff"};">${item.name}（${item.rank}）</option>`)
        ].join('');

        select.innerHTML = optionsHtml;

        select.addEventListener('change', function() {
            if (urlInput) urlInput.value = this.value;
            // 選択されたoptionの背景色を即座に反映（「選択してください」は#ffffffが適用される）
            this.style.backgroundColor = this.options[this.selectedIndex].style.backgroundColor;
            if (onChangeCallback) onChangeCallback();
        });

        container.innerHTML = '';
        container.appendChild(select);

    } catch (err) {
        container.innerHTML = 'エラー';
    }
}
