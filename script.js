document.getElementById('createZipBtn').addEventListener('click', async () => {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = '超高速でZIPを作成中...';

    // 処理にかかった時間を測るためのタイマーを開始
    const startTime = performance.now();

    const zip = new JSZip();

    // --- 設定：作成したいファイルの合計数 ---
    const totalFiles = 15000; // ここを変えるだけで、100でも10000でも自由に変更できます

    // ループ処理を使って、自動的にファイル名に[ファイルの数]を入れながら生成
    for (let i = 1; i <= totalFiles; i++) {
        // バッククォート（`）を使うことで、変数 i（現在の数）を文字列の中に埋め込めます
        const fileName = `file${i}.txt`; 
        const fileContent = `高速化テスト用ファイル ${i}`;

        // ZIPの中にファイルを追加
        zip.file(fileName, fileContent);
    }

    try {
        // 圧縮オプションを「STORE（無圧縮）」にして作成速度を最大化
        const content = await zip.generateAsync({ 
            type: "blob",
            compression: "STORE" 
        });

        // ダウンロード処理
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = "fast_archive.zip";
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // かかった時間を計算して画面に表示
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(4); // 秒単位（小数点4桁）
        statusDiv.textContent = `完了！ ${totalFiles} 個のファイルを ${duration} 秒で作成しました。`;

    } catch (error) {
        console.error(error);
        statusDiv.textContent = 'エラーが発生しました。';
    }
});
