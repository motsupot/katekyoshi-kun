document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired in popup.js');

    const questionInput = document.getElementById('question');
    const askButton = document.getElementById('askButton');
    const responseDiv = document.getElementById('response');

    askButton.addEventListener('click', function() {
        const question = questionInput.value;
        responseDiv.textContent = '考え中...';

        // デモ用に固定文言を設定
        const demoResponse = "これはデモの回答です。質問内容は「" + question + "」ですね。";
        responseDiv.textContent = demoResponse;
    });

});
