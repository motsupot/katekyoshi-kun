// コンテキストメニューを作成
chrome.runtime.onInstalled.addListener(() => {
  console.log("AI家庭教師くんがインストールされました！");
  chrome.contextMenus.create({
    id: "sampleMenu",
    title: "メニューをクリック",
    contexts: ["all"], // メニューを表示するコンテキスト（例: ページ, リンクなど）
  });
});

// メニュークリック時のイベントリスナーを追加
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sampleMenu") {
    console.log("アイコンがクリックされました！");
  }
  const url = ((selectionText: string | undefined) => {
    if (selectionText == null || selectionText === "") {
      return `dist/page/index.html`;
    }
    return `dist/page/index.html?selected_text=${selectionText}`;
  })(info.selectionText);
  if (info.selectionText)
  chrome.tabs
    .create({ url })
    .catch((err) => console.log(err));
});
