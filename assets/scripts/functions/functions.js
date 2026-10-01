export const groups = ["owner", "group", "other"];
export const permissions = ["r", "w", "x"];

export function getCheckbox(group, permission) { return document.getElementById(`${group}-${permission}`); };

export function octalToSymbolic(octal) {
    octal = octal.padStart(3, "0");
    let symbolic = "";
    for (const digit of octal) {
        const value = Number(digit);
        symbolic += value & 4 ? "r" : "-";
        symbolic += value & 2 ? "w" : "-";
        symbolic += value & 1 ? "x" : "-";
    }
    return symbolic;
};

export function symbolicToOctal(symbolic) {
    let result = "";
    for (let i = 0; i < 9; i += 3) {
        let value = 0;
        if (symbolic[i] === "r") value += 4;
        if (symbolic[i + 1] === "w") value += 2;
        if (symbolic[i + 2] === "x") value += 1;
        result += value;
    }
    return result;
};

export function updateCheckboxesFromSymbolic(symbolic) {
    groups.forEach((group, groupIndex) => {
        permissions.forEach((permission, permissionIndex) => {
            const index = groupIndex * 3 + permissionIndex;
            getCheckbox(group, permission).checked =
                symbolic[index] === permission;
        });
    });
};

export function getSymbolicFromCheckboxes() {
    let symbolic = "";
    groups.forEach(group => {
        permissions.forEach(permission => {
            symbolic += getCheckbox(group, permission).checked
                ? permission
                : "-";
        });
    });
    return symbolic;
}
