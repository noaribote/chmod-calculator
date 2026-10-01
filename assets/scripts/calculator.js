import { octalToSymbolic, symbolicToOctal, updateCheckboxesFromSymbolic, getSymbolicFromCheckboxes } from "./functions/functions.js";

const octalInput = document.getElementById("octal");
const symbolicInput = document.getElementById("symbolic");
const octalResult = document.getElementById("octalResult");
const symbolicResult = document.getElementById("symbolicResult");
const command = document.getElementById("command");

function updateFromOctal() {
    let value = octalInput.value.replace(/\D/g, "").slice(-3);
    octalInput.value = value;
    if (!/^[0-7]{1,3}$/.test(value)) return;
    const octal = value.padStart(3, "0");
    const symbolic = octalToSymbolic(octal);
    symbolicInput.value = symbolic;
    octalResult.textContent = octal;
    symbolicResult.textContent = symbolic;
    updateCheckboxesFromSymbolic(symbolic);
    command.textContent = `chmod ${octal} [document]`;
};

function updateFromSymbolic() {
    let value = symbolicInput.value.toLowerCase().replace(/[^rwx-]/g, "").slice(0, 9);
    symbolicInput.value = value;
    if (value.length !== 9) return;
    const octal = symbolicToOctal(value);
    octalInput.value = octal;
    octalResult.textContent = octal;
    symbolicResult.textContent = value;
    updateCheckboxesFromSymbolic(value);
    command.textContent = `chmod ${octal} [document]`;
};

function updateFromCheckboxes() {
    const symbolic = getSymbolicFromCheckboxes();
    const octal = symbolicToOctal(symbolic);
    octalInput.value = octal;
    symbolicInput.value = symbolic;
    octalResult.textContent = octal;
    symbolicResult.textContent = symbolic;
    command.textContent = `chmod ${octal} [document]`;
};

// a modifier : mettre une icon en guise de repère pour le "copié !"

async function copyCommand() {
    await navigator.clipboard.writeText(command.textContent);
    const oldText = command.textContent;
    command.textContent = "Commande copiée !";
    setTimeout(() => {
        command.textContent = oldText;
    }, 1200);
};

octalInput.addEventListener("input", updateFromOctal);
symbolicInput.addEventListener("input", updateFromSymbolic);
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {checkbox.addEventListener("change", updateFromCheckboxes); });
command.addEventListener("click", copyCommand);
updateFromOctal();