chrome.storage.local.get("copiedText", (result) => {
  if (result.copiedText) {
    const injectText = () => {
      const inputDiv = document.querySelector("#prompt-textarea");

      if (inputDiv) {
        try {
          const pTag = inputDiv.querySelector("p");

          if (pTag) {
            pTag.textContent = result.copiedText;
          }

          setTimeout(() => {
            const sendButton = document.querySelector(
              '[data-testid="send-button"]'
            );

            if (sendButton) {
              sendButton.click();
              chrome.storage.local.remove("copiedText");
            } else {
              console.log("Cannot find the send button");
            }
          }, 500);
        } catch (error) {
          console.error("Error injecting text", error);
        }
      } else {
        console.log("#prompt-textarea not found");
        setTimeout(injectText, 500);
      }
    };

    // 초기 시도
    injectText();
  }
});
