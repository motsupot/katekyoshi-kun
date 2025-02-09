// コンテキストメニューを作成
chrome.runtime.onInstalled.addListener(() => {
  console.log("AI家庭教師くんがインストールされました！");
  chrome.contextMenus.create({
    id: "pageMenu",
    title: "AI家庭教師くんを開く",
    contexts: ["all"], // メニューを表示するコンテキスト（例: ページ, リンクなど）
  });
});

// メニュークリック時のイベントリスナーを追加
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    chrome.sidePanel.open({
      windowId: tab.windowId,
      tabId: tab.id,
    });
  });
});

// アクションボタンをクリックしたときのイベントリスナーを追加
chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    chrome.sidePanel.open({
      windowId: tab.windowId,
      tabId: tab.id,
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        const pageInfo = {
          title: document.title,
          url: window.location.href,
          content: document.body.innerText,
        };
        chrome.runtime.sendMessage({ type: "PAGE_INFO", pageInfo });
      },
    });
  }
});
