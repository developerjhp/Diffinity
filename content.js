function addDiffButton() {
  const buttonGroup = document.querySelector(".gh-header-actions");
  if (!buttonGroup || document.querySelector(".diff-extract-button")) return;

  const button = document.createElement("button");
  button.className = "btn btn-sm diff-extract-button";
  button.textContent = "Do Diffinity";
  buttonGroup.appendChild(button);

  button.addEventListener("click", () => {
    // Retrieve stored  language settings
    chrome.storage.sync.get(["language"], (data) => {
      const language = data.language || "en";

      // Construct the .diff URL
      const baseUrl = window.location.href.match(
        /https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+/
      );
      if (baseUrl) {
        const diffUrl = `${baseUrl[0]}.diff`;

        chrome.runtime.sendMessage(
          { type: "fetchDiff", url: diffUrl },
          (response) => {
            if (response && response.success && response.data) {
              const combinedText = `Answer in this language: ${language}\n\n${response.data}`;
              showButtonSuccess(button);
              chrome.runtime.sendMessage({
                type: "openChatGPT",
                data: combinedText,
              });
            } else {
              showButtonError(button);
              console.error(
                "Failed to fetch diff data or data is empty:",
                response
              );
            }
          }
        );
      } else {
        console.error("Could not construct diff URL.");
      }
    });
  });
}

function showButtonSuccess(button) {
  button.textContent = "Copied!";
  button.style.backgroundColor = "#2da44e";
  button.style.color = "white";
  setTimeout(() => {
    button.textContent = "Do Diffinity";
    button.style.backgroundColor = "";
    button.style.color = "";
  }, 2000);
}

function showButtonError(button) {
  button.textContent = "Copy Failed";
  button.style.backgroundColor = "#cf222e";
  button.style.color = "white";
  setTimeout(() => {
    button.textContent = "Diffinity Error";
    button.style.backgroundColor = "";
    button.style.color = "";
  }, 2000);
}

addDiffButton();

const observer = new MutationObserver(() => {
  if (window.location.href.includes("/pull/")) {
    addDiffButton();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
