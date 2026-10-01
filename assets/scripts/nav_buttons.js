document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("wikiTask").addEventListener("click", () => { window.open("https://github.com/noaribote/chmod-calculator", "_blank") });
    const calculator = document.getElementById("interface");
    document.querySelectorAll(".appTask").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("terminal").classList.remove("open");
            calculator.style.display = "block";
        });
    });
    document.getElementById("closeInterface").addEventListener("click", () => {
        calculator.style.animation = "GoodByeInterface 0.2s forwards";
        setTimeout(() => {
            calculator.style.display = "none";
            calculator.style.animation = "HelloInterface 0.2s forwards";
        }, 250);
    });
});