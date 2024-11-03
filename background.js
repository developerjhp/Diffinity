chrome.runtime.onInstalled.addListener(() => {
  chrome.action.openPopup();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "fetchDiff") {
    fetch(message.url)
      .then((response) => response.text())
      .then((diffText) => {
        sendResponse({ success: true, data: diffText });
      })
      .catch((error) => {
        console.error("Failed to fetch diff:", error);
        sendResponse({ success: false });
      });
    return true;
  } else if (message.type === "openChatGPT") {
    chrome.storage.local.set({ copiedText: message.data }, () => {
      chrome.tabs.create({
        url: "https://chatgpt.com/g/g-jYKKhgJny-code-review-based-by-git-diff",
      });
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("chatgpt.com")
  ) {
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["chatgpt_injector.js"],
      });
    }, 1000);
  }
});
