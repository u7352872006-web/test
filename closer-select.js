export async function initCloserSelect(targetId, inputId, onChangeCallback) {
    const API_URL = "https://script.google.com/macros/s/AKfycbySHVscjhTYWKf8bLJUGIMJ7AArbsp8cS8wl0O8FyYjYoO2mRzMO8jZhcc_cmhDvYfIhA/exec";
    const container = document.getElementById(targetId);
    const urlInput = document.getElementById(inputId);

    const rankOrder = ["トップセールス", "2軍", "3軍", "育成枠", "審査落のみ"];
    const colors = {
        "トップセールス": "#F4CCCC",
        "2軍": "#CFE2F3",
        "3軍": "#FFF2CC",
        "育成枠": "#D9EAD3",
        "審査落のみ": "#B4A7D6"
    };

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const filtered = data
            .filter(item => item.rank !== "引退")
            .sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

        const select = document.createElement('select');
        select.innerHTML = '<option value="">選択してください</option>';

        filtered.forEach(item => {
            const option = document.createElement('option');
            option.textContent = `${item.name}（${item.rank}）`;
            option.value = item.zoom;
            option.style.backgroundColor = colors[item.rank] || "#ffffff";
            select.appendChild(option);
        });

        select.addEventListener('change', function() {
            urlInput.value = this.value; 
            this.style.backgroundColor = this.options[this.selectedIndex].style.backgroundColor;
            if (onChangeCallback) onChangeCallback();
        });

        // 読み込み完了後に中身を入れ替える
        container.innerHTML = '';
        container.appendChild(select);

    } catch (err) {
        container.innerHTML = 'エラー';
    }
}
