const taskButton = document.getElementById("terminalTask");
const terminal = document.getElementById("terminal");
const header = document.getElementById("terminalHeader");
const body = document.getElementById("terminalBody");
const closeBtn = document.getElementById("closeBtn");
const minimizeBtn = document.getElementById("minimizeBtn");
const maximizeBtn = document.getElementById("maximizeBtn");
const input = document.getElementById("commandInput");
const terminalPermissionsStorageKey = "chmodCalculatorTerminalPermissions";

let filePermissions = { about: "rwxrwxrwx", folder: "rwxrwxrwx" };
function persistTerminalPermissions() {
    localStorage.setItem(terminalPermissionsStorageKey, JSON.stringify(filePermissions));
}

try {
    const savedPermissions = JSON.parse(localStorage.getItem(terminalPermissionsStorageKey));
    if (savedPermissions && /^[rwx-]{9}$/.test(savedPermissions.about) && /^[rwx-]{9}$/.test(savedPermissions.folder)) {
        filePermissions = savedPermissions;
    }
} catch (error) {
    localStorage.removeItem(terminalPermissionsStorageKey);
}

taskButton.addEventListener("click", () => {
    terminal.classList.remove("minimized");
    terminal.classList.add("open");
    setTimeout(() => {
        input.focus();
    }, 250);
});

closeBtn.addEventListener("click", () => {
    terminal.classList.remove("open");
    terminal.classList.remove("minimized");
});

minimizeBtn.addEventListener("click", () => { terminal.classList.toggle("minimized"); });

let previousState = null;
maximizeBtn.addEventListener("click", () => {
    if (!terminal.classList.contains("maximized")) {
        previousState = {
            left: terminal.offsetLeft,
            top: terminal.offsetTop,
            width: terminal.offsetWidth,
            height: terminal.offsetHeight
        };
        terminal.classList.add("maximized");
    } else {
        terminal.classList.remove("maximized");
        if (previousState) {
            terminal.style.left = previousState.left + "px";
            terminal.style.top = previousState.top + "px";
            terminal.style.width = previousState.width + "px";
            terminal.style.height = previousState.height + "px";
        }
    }
});

input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") { return; }
    const command = input.value.trim();
    if (!command) { return; }
    const oldLine = input.parentElement;
    const commandText = document.createElement("div");
    commandText.className = "line";
    commandText.innerHTML =
        `<span class="prompt">alous@noaribote.fr<span class="white">:</span><span class="blue">~</span><span class="white">$</span></span> ${escapeHTML(command)}`;
    body.insertBefore(commandText, oldLine);
    executeCommand(command);
    input.value = "";
    body.scrollTop = body.scrollHeight;
});

function executeCommand(rawCommand) {
    const command = rawCommand.toLowerCase();
    const output = document.createElement("div");
    output.className = "line";
    switch (command) {
        case "help":
            output.innerHTML = `
                <span class="firstcolor">
                    Available commands :
                </span><br>
                <span class="gray">
                    help&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Show commands list<br>
                    clear&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Clear the terminal<br>
                    date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Show the current date<br>
                    time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Show the current time<br>
                    ls [option]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; List the files/folders in the directory<br>
                    cat [file]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; View the contents of a file<br>
                    chmod [octal] [document]&nbsp;&nbsp;&nbsp; Change permissions using octal notation<br>
                    exit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Close the terminal
                </span>
            `;
            body.insertBefore(output, input.parentElement);
            break;
        case "clear":
            document.querySelectorAll(".terminal-body .line").forEach(el => { if (el !== input.parentElement) { el.remove(); } });
            break;
        case "date":
            output.textContent = new Date().toLocaleDateString("fr-FR");
            body.insertBefore(output, input.parentElement);
            break;
        case "time":
            output.textContent = new Date().toLocaleTimeString("fr-FR");
            body.insertBefore(output, input.parentElement);
            break;
        case "cat about.txt":
            output.innerHTML = `
                Terminal developed by RIBOTE--MORAL Noa via ALOUS FRANCE.
                <br><br>
                Useful links :
                <br>https://noaribote.fr/
                <br>https://alous.fr/
                <br>https://github.com/noaribote/
                `;
            body.insertBefore(output, input.parentElement);
            break;
        case "ls":
            output.innerHTML = `about.txt&nbsp;&nbsp;<span class="blue">folder</span>`;
            body.insertBefore(output, input.parentElement);
            break;
        case "ls -a":
            output.innerHTML = `<span class="blue">.&nbsp;&nbsp;..&nbsp;&nbsp;</span>about.txt&nbsp;&nbsp;<span class="blue">folder</span>`;
            body.insertBefore(output, input.parentElement);
            break;
        case "ls -l":
            output.innerHTML = `
                ${permissionString("about")} 1 noa github 230 Sep 2026 about.txt<br>
                ${permissionString("folder")} 1 noa github &nbsp;&nbsp;0 Sep 2026 <span class="blue">folder</span>
            `;
            body.insertBefore(output, input.parentElement);
            break;
        case "ls -la":
            output.innerHTML = `
                ${permissionString("current")} 1 noa github 460 Sep 2026 <span class="blue">.</span><br>
                ${permissionString("parent")} 1 noa github 460 Sep 2026 <span class="blue">..</span><br>
                ${permissionString("about")} 1 noa github 230 Sep 2026 about.txt<br>
                ${permissionString("folder")} 1 noa github &nbsp;&nbsp;0 Sep 2026 <span class="blue">folder</span>
            `;
            body.insertBefore(output, input.parentElement);
            break;
        case "ls -al":
            output.innerHTML = `
                ${permissionString("current")} 1 noa github 460 Sep 2026 <span class="blue">.</span><br>
                ${permissionString("parent")} 1 noa github 460 Sep 2026 <span class="blue">..</span><br>
                ${permissionString("about")} 1 noa github 230 Sep 2026 about.txt<br>
                ${permissionString("folder")} 1 noa github &nbsp;&nbsp;0 Sep 2026 <span class="blue">folder</span>
            `;
            body.insertBefore(output, input.parentElement);
            break;
        case "exit":
            terminal.classList.remove("open");
            break;
        default:
            const chmodMatch = rawCommand.match(/^chmod\s+([0-7]{3})\s+(folder|about\.txt)$/i);
            if (chmodMatch) {
                const [, octal, target] = chmodMatch;
                const permissionKey = applyChmod(octal, target);
                const permissionTarget = permissionKey === "folder" ? "folder" : "about.txt";
                output.innerHTML = `Permissions updated: <span class="firstcolor">${permissionString(permissionKey)}</span> ${permissionTarget}`;
                body.insertBefore(output, input.parentElement);
                break;
            }
            output.innerHTML =
                `<span class="gray">
                    Unexpected : ${escapeHTML(command)}
                    <br>Use the command "help" if you need help.
                </span>`;
            body.insertBefore(output, input.parentElement);
    }
}

function applyChmod(octal, target) {
    const symbolic = octal.split("").map(digit => {
        const value = Number(digit);
        return `${value & 4 ? "r" : "-"}${value & 2 ? "w" : "-"}${value & 1 ? "x" : "-"}`;
    }).join("");
    const permissionKey = target.toLowerCase() === "folder" ? "folder" : "about";
    filePermissions[permissionKey] = symbolic;
    persistTerminalPermissions();
    return permissionKey;
}

function permissionString(kind) {
    const defaultPermissions = "rwxrwxrwx";
    const permission = filePermissions[kind] || defaultPermissions;
    return `${kind === "about" ? "-" : "d"}${permission}`;
}

function escapeHTML(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

let dragging = false;
let offsetX = 0;
let offsetY = 0;

header.addEventListener("mousedown", (event) => {
    if (event.target.closest(".window-buttons") || terminal.classList.contains("maximized")) { return; }
    dragging = true;
    const rect = terminal.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    terminal.style.transform = "none";
    terminal.style.left = rect.left + "px";
    terminal.style.top = rect.top + "px";
});

document.addEventListener("mousemove", (event) => {
    if (!dragging) { return; }
    let x = event.clientX - offsetX;
    let y = event.clientY - offsetY;

    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 50;
    x = Math.max(-terminal.offsetWidth + 100, x);
    y = Math.max(0, Math.min(maxY, y));
    terminal.style.left = x + "px";
    terminal.style.top = y + "px";
});

document.addEventListener("mouseup", () => { dragging = false; });

let resizing = false;
let startWidth;
let startHeight;
let startX;
let startY;

terminal.addEventListener("mousedown", (event) => {
    const rect = terminal.getBoundingClientRect();
    const nearRight = rect.right - event.clientX < 18;
    const nearBottom = rect.bottom - event.clientY < 18;
    if (nearRight && nearBottom && !terminal.classList.contains("maximized")) {
        resizing = true;
        startWidth = terminal.offsetWidth;
        startHeight = terminal.offsetHeight;
        startX = event.clientX;
        startY = event.clientY;
        event.preventDefault();
    }
});

document.addEventListener("mousemove", (event) => {
    if (!resizing) { return; }
    const newWidth = startWidth + (event.clientX - startX);
    const newHeight = startHeight + (event.clientY - startY);
    terminal.style.width = Math.max(320, newWidth) + "px";
    terminal.style.height = Math.max(180, newHeight) + "px";
});

document.addEventListener("mouseup", () => { resizing = false; });

body.addEventListener("click", (event) => {
    if (event.target.closest(".terminal-body") && !event.target.closest("input")) { input.focus(); }
});
