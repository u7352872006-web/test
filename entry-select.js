export function initEntrySelect(targetId, onChangeCallback) {
    const container = document.getElementById(targetId);
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

    container.innerHTML = `<select id="entry-select">
        <option value="">経路を選択してください</option>
        ${mediaList.map(m => `<option value="${m.value}">${m.label}</option>`).join('')}
    </select>`;

    container.querySelector('select').onchange = onChangeCallback;
}
