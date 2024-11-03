document.addEventListener("DOMContentLoaded", () => {
  const languageInput = document.getElementById("language");
  const saveButton = document.getElementById("saveSettings");

  // Load saved values from Chrome storage
  chrome.storage.sync.get(["language"], (data) => {
    languageInput.value = data.language || "en";
  });

  // Save values to Chrome storage
  saveButton.addEventListener("click", () => {
    const language = languageInput.value;
    chrome.storage.sync.set({ language }, () => {
      alert("Settings saved!");
    });
  });
});
