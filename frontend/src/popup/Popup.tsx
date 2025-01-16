document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded event fired in popup.js');

  const questionInput = document.getElementById('question');
  const askButton = document.getElementById('askButton');
  const responseDiv = document.getElementById('response');

  if (!questionInput || !askButton || !responseDiv) {
      alert("必要な要素が見つかりませんでした");
      return;
  }

  // 選択中のテキストを取得
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab || !activeTab.id) return;

      chrome.scripting.executeScript(
          {
              target: { tabId: activeTab.id },
              func: () => window.getSelection()?.toString(),
          },
          (injectionResults) => {
              if (chrome.runtime.lastError) {
                  console.error('Error:', chrome.runtime.lastError.message);
                  return;
              }
              if (injectionResults && injectionResults[0]?.result) {
                  questionInput.value = injectionResults[0].result || '';
              } else {
                  questionInput.value = 'No text selected.';
              }
          }
      );
  });

  // 質問ボタンのクリックイベント
  askButton.addEventListener('click', function () {
      const question = questionInput.value;
      responseDiv.textContent = '考え中...';

      // バックエンドAPIのURL
      const apiUrl = 'http://localhost:8888/predict';

      fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: question }),
      })
          .then((response) => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
          })
          .then((data) => {
              console.log('API response:', data);
              if (data && data.predictions) {
                  responseDiv.textContent = data.predictions;
              } else {
                  responseDiv.textContent = 'APIからの応答が不正です。';
              }
          })
          .catch((error) => {
              console.error('Error during API call:', error);
              responseDiv.textContent = 'エラーが発生しました。';
          });
  });
});
