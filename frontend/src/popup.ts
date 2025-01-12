import { MessageActionsId, ResponseMessageData } from './types';

document.addEventListener('DOMContentLoaded', () => {
  // 現在のタブ情報を取得
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0 || tabs[0].id === undefined) {
      throw new Error('アクティブなタブが見つかりませんでした。');
    }
    chrome.tabs.sendMessage<MessageActionsId>(
      tabs[0].id,
      { action: 'get-zenn-articles' },
      (response: ResponseMessageData | undefined) => {
        if (chrome.runtime.lastError) {
          throw new Error(chrome.runtime.lastError.message);
        }
      },
    );
  });
});
