document.getElementById('createZipBtn').addEventListener('click', async () => {
    const statusDiv = document.getElementById('status');
    const fileInput = document.getElementById('userZipInput');
    
    statusDiv.textContent = '超高速でZIPを作成中...';

    // 処理にかかった時間を測るためのタイマーを開始
    const startTime = performance.now();

    const zip = new JSZip();

    // 1. 【新機能】ユーザーが選択した既存のZIPファイルがあれば、新しいZIPの中に組み込む
    if (fileInput.files.length > 0) {
        const userFile = fileInput.files[0];
        
        // 選択されたファイルをブラウザのメモリに読み込む関数
        const readUploadedFileAsArrayBuffer = (inputFile) => {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = () => resolve(fileReader.result);
                fileReader.onerror = () => reject(fileReader.error);
                fileReader.readAsArrayBuffer(inputFile);
            });
        };

        try {
            // ファイルの中身をデータとして取得
            const fileData = await readUploadedFileAsArrayBuffer(userFile);
            // 元のファイル名（例: my_data.zip）のまま新しいZIPに追加する
            zip.file(userFile.name, fileData);
        } catch (e) {
            console.error("ファイルの読み込みに失敗しました:", e);
            statusDiv.textContent = '選択したZIPの読み込みに失敗しました。';
            return;
        }
    }

    // 2. ループ処理を使って、自動的に連番のテキストファイルを生成して追加
    const totalFiles = 1; 
    for (let i = 1; i <= totalFiles; i++) {
        const fileName = `file${i}.txt`; 
        const fileContent = `高速化テスト用ファイル ${i}`;
        zip.file(fileName, fileContent);
    }

    try {
        // 3. 圧縮オプションを「STORE（無圧縮）」にして作成速度を最大化
        const content = await zip.generateAsync({ 
            type: "blob",
            compression: "STORE" 
        });

        // 4. ダウンロード処理
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = "ZIP.zip"; // ダウンロードされる新しいZIPの名前
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // かかった時間を計算して画面に表示
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(4);
        statusDiv.textContent = `完了！ZIPの組み込みと ${totalFiles} 個のファイル作成を ${duration} 秒で処理しました。`;

    } catch (error) {
        console.error(error);
        statusDiv.textContent = 'エラーが発生しました。';
    }
});
