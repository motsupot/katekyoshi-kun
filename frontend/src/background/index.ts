chrome.runtime.onInstalled.addListener(() => {
  console.log("AI家庭教師くんがインストールされました！");
});

chrome.action.onClicked.addListener(() => {
  console.log("アイコンがクリックされました！");
});
