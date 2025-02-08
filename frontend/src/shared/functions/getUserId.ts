export const getUserId = (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["user_id"], (result) => {
      let userId = result.user_id;
      if (!userId) {
        if (crypto.randomUUID) {
          // ブラウザが対応している場合はcrypto.randomUUIDを使用
          userId = crypto.randomUUID();
        } else {
          // 対応していない場合は簡易的なUUID生成ロジックを使用
          userId = "xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
              const r = (Math.random() * 16) | 0;
              const v = c === "x" ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            }
          );
        }
        chrome.storage.local.set({ user_id: userId }, () => {
          resolve(userId);
        });
      } else {
        resolve(userId);
      }
    });
  });
};
