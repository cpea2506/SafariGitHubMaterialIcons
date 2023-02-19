function show(enabled, useSettingsInsteadOfPreferences) {
    if (useSettingsInsteadOfPreferences) {
        document.querySelector(".state-on").innerText = "Status: Enabled"
        document.querySelector(".state-off").innerText = "Status: Disabled"
        document.querySelector(".state-unknown").innerText =
            "You can turn on SafariGitHubMaterialIcons’ extension in the Extensions section of Safari Settings."
        document.querySelector(".open-preferences").innerText =
            "Open in Safari Settings…"
    }

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled)
        document.body.classList.toggle(`state-off`, !enabled)
    } else {
        document.body.classList.remove(`state-on`)
        document.body.classList.remove(`state-off`)
    }
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences")
}

document
    .querySelector("button.open-preferences")
    .addEventListener("click", openPreferences)
