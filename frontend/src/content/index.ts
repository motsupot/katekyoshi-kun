const createPopupElement = (text: string, position: DOMRect) => {
  console.log("Creating popup for text:", text, "at position:", position);

  const popup = document.createElement("div");
  popup.id = "custom-popup";
  popup.style.position = "absolute";
  popup.style.top = `${position.bottom + window.scrollY}px`;
  popup.style.left = `${position.left + window.scrollX}px`;
  popup.style.backgroundColor = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.padding = "10px";
  popup.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  popup.style.zIndex = "9999";
  popup.innerText = "Loading...";

  document.body.appendChild(popup);

  console.log("Popup created:", popup);

  const apiUrl = "https://xxx/predict";
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("API response:", data);
      if (data?.predictions) {
        popup.innerText = data.predictions;
      } else {
        popup.innerText = "結果を取得できませんでした。";
      }
    })
    .catch((err) => {
      console.error("API error:", err);
      popup.innerText = "エラーが発生しました。";
    });
};

const removePopup = () => {
  const existingPopup = document.getElementById("custom-popup");
  if (existingPopup) {
    console.log("Removing existing popup");
    existingPopup.remove();
  }
};

document.addEventListener("mouseup", () => {
  console.log("Mouseup event detected");
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();
  console.log("Selected text:", selectedText);

  if (selectedText) {
    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();
    console.log("Selection range:", range, "Bounding rect:", rect);
    if (rect) {
      removePopup(); // 既存ポップアップを削除
      createPopupElement(selectedText, rect);
    }
  } else {
    removePopup();
  }
});
