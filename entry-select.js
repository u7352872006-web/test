export function initEntrySelect(targetId, onChangeCallback) {
    const container = document.getElementById(targetId);
    
    // 表記は維持しつつ、データ構造を整理
    const mediaList = [
        { label: "（Meta1）@080", value: "動画編集＠080uolh_" },
        { label: "（Meta2）@851", value: "動画編集＠851nqhyd_" },
        { label: "（Meta3）@899", value: "動画編集＠899zwdaz_" },
        { label: "（YT）@521", value: "動画編集＠521obscj_" },
        { label: "（TikTok）@004", value: "動画編集＠004uieyi_" },
        { label: "AI動画編集 個別サポート @608", value: "AI動画編集＠608vwghp_" },
        { label: "個別サポート（受講生用）@758", value: "動画編集＠758mfkde_" },
        { label: "スマホ副業個別サポート@108", value: "動画編集＠108kmcmr_" },
        { label: "その他", value: "" }
    ];

    const select = document.createElement('select');
    select.style.fontSize = "14px";
    select.style.padding = "4px";
    select.innerHTML = '<option value="">経路を選択してください</option>';

    mediaList.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.label;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        if (onChangeCallback) onChangeCallback();
    });

    container.innerHTML = '';
    container.appendChild(select);
}
