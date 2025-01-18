console.log("Content script loaded");

// ページの情報を取得する
const pageInfo = {
  title: document.title,
  url: window.location.href,
  content: document.body.innerText,
};

console.log("Page Info:", pageInfo);
