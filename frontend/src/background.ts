// サービスワーカーがインストールされたときの処理
chrome.runtime.onInstalled.addListener(() => {
  console.log('拡張機能がインストールされました');
  // 必要に応じて初期化処理をここで行います
});

// バッジをクリックしたときの処理
chrome.action.onClicked.addListener((tab) => {
  console.log('拡張機能のアイコンがクリックされました');

  // クリック時に新しいタブを開く
  // chrome.tabs.create({
  //   // url: chrome.runtime.getURL('popup.html'), // 表示したいHTMLページのURL
  // });
});

// メッセージのリスナーを設定
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // if (message.action === 'doSomething') {
  //   console.log('メッセージを受け取りました:', message.data);
  //   // メッセージに基づいて処理を行う
  //   sendResponse({ success: true });
  // }
  return true;  // 非同期レスポンスを使用するためにtrueを返す
});
