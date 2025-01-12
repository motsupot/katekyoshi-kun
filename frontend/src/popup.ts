document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired in popup.js');

    const questionInput = document.getElementById('question') as HTMLInputElement;
    const askButton = document.getElementById('askButton');
    const responseDiv = document.getElementById('response');

    if (questionInput == null || askButton == null || responseDiv == null) {
      console.error("ヌルがぬるぬる！");
      throw Error("ヌルがぬるぬる！");
    }

    askButton.addEventListener('click', function() {
        const question = questionInput.value;
        responseDiv.textContent = '考え中...';

        // デモ用に固定文言を設定
        const demoResponse = "これはデモの回答です。質問内容は「" + question + "」ですね。";
        responseDiv.textContent = demoResponse;
    });
});
