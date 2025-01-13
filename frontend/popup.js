document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired in popup.js');

    const questionInput = document.getElementById('question');
    const askButton = document.getElementById('askButton');
    const responseDiv = document.getElementById('response');

    askButton.addEventListener('click', function() {
        const question = questionInput.value;
        responseDiv.textContent = '考え中...';

        // バックエンドAPIのURL (ローカル環境用)
        const apiUrl = 'http://localhost:8888/predict';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: question })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API response:', data);
            if (data && data.predictions) {
                responseDiv.textContent = data.predictions;
            } else {
                responseDiv.textContent = 'APIからの応答が不正です。';
            }
        })
        .catch(error => {
            console.error('Error during API call:', error);
            responseDiv.textContent = 'エラーが発生しました。';
        });
    });
});
