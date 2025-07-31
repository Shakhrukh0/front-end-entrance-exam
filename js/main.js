import { downloadPdf } from "./downloadPdf.js";
import { blurP } from "./blur.js";
import { focusP } from "./focus.js";
import { maxInput } from "./maxInput.js";

window.onload = function () {
    downloadPdf();
    loadContent();
    loadHearts();
    loadTags();
    loadSliders();
};

function createRipple(event) {
    const button = event.currentTarget;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.offsetX - radius}px`;
    circle.style.top = `${event.offsetY - radius}px`;
    circle.classList.add("ripple-effect");

    const ripple = button.querySelector(".ripple-effect");
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

document.querySelectorAll(".ripple").forEach((el) => {
    el.addEventListener("click", createRipple);
});

function saveContent() {
    const content = {};
    document.querySelectorAll("p, h1, ul").forEach((el, i) => {
        content[`el-${i}`] = el.innerHTML;
    });
    localStorage.setItem("textContent", JSON.stringify(content));
}

function loadContent() {
    const content = JSON.parse(localStorage.getItem("textContent"));
    if (content) {
        document.querySelectorAll("p, h1, ul").forEach((el, i) => {
            if (content[`el-${i}`]) {
                el.innerHTML = content[`el-${i}`];
            }
        });
    }
}

function saveHearts() {
    const hearts = {};
    document.querySelectorAll(".heart path").forEach((el) => {
        const id = el.id;
        hearts[id] = el.classList.contains("yellow");
    });
    localStorage.setItem("hearts", JSON.stringify(hearts));
}

function loadHearts() {
    const hearts = JSON.parse(localStorage.getItem("hearts"));
    if (hearts) {
        for (const id in hearts) {
            const el = document.getElementById(id);
            const block = document.getElementById(`${id}-block`);
            if (hearts[id]) {
                el.classList.add("yellow");
                el.setAttribute("fill", "yellow");
                block.classList.add("green-card");
            } else {
                el.classList.remove("yellow");
                el.setAttribute("fill", "white");
                block.classList.remove("green-card");
            }
        }
    }
}

function saveTags() {
    const tags = {};
    document.querySelectorAll(".tag").forEach((el) => {
        const id = el.id;
        tags[id] = el.classList.contains("green-tag");
    });
    localStorage.setItem("tags", JSON.stringify(tags));
}

function loadTags() {
    const tags = JSON.parse(localStorage.getItem("tags"));
    if (tags) {
        for (const id in tags) {
            const el = document.getElementById(id);
            const block = document.getElementById(`${id}-block`);
            if (tags[id]) {
                el.classList.add("green-tag");
                block.classList.add("green-card");
            } else {
                el.classList.remove("green-tag");
                block.classList.remove("green-card");
            }
        }
    }
}

function saveSliders() {
    const sliders = [];
    document.querySelectorAll("input.level").forEach((el) => {
        sliders.push(el.value);
    });
    localStorage.setItem("sliders", JSON.stringify(sliders));
}

function loadSliders() {
    const sliders = JSON.parse(localStorage.getItem("sliders"));
    if (sliders) {
        document.querySelectorAll("input.level").forEach((el, i) => {
            el.value = sliders[i];
            el.style.setProperty("--value", sliders[i] + "%");
        });
    }
}

document.querySelectorAll("p, h1, .futurePoint-text").forEach((el) => {
    el.addEventListener("click", function () {
        this.contentEditable = true;
        this.focus();

        this.addEventListener("beforeinput", maxInput);
        this.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });
        this.addEventListener("input", saveContent);
        this.addEventListener("focus", focusP);
        this.addEventListener("blur", blurP);
    });
});

document.querySelectorAll("ul").forEach((ul) => {
    ul.addEventListener("click", function () {
        this.style.textDecoration = "none";
    });

    ul.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();

            const newLi = document.createElement("li");
            const newSpan = document.createElement("span");
            newSpan.className = "futurePoint-text";
            newSpan.textContent = "";
            newSpan.contentEditable = true;

            newSpan.addEventListener("click", function () {
                this.contentEditable = true;
                this.focus();

                this.addEventListener("beforeinput", maxInput);
                this.addEventListener(
                    "keydown",
                    (e) => e.key === "Enter" && e.preventDefault(),
                );
                this.addEventListener("input", saveContent);
                this.addEventListener("focus", focusP);
                this.addEventListener("blur", blurP);
            });

            newLi.appendChild(newSpan);
            this.appendChild(newLi);
            newSpan.focus();
        }
    });
});

document.querySelectorAll(".heart").forEach((el) => {
    el.addEventListener("click", function () {
        const path = this.querySelector("path");
        const block = document.getElementById(path.id + "-block");
        const isYellow = path.classList.toggle("yellow");

        path.setAttribute("fill", isYellow ? "yellow" : "white");
        block.classList.toggle("green-card", isYellow);
        saveHearts();
    });
});

document.querySelectorAll(".tag").forEach((el) => {
    el.addEventListener("click", function () {
        const block = document.getElementById(this.id + "-block");
        const active = this.classList.toggle("green-tag");

        block.classList.toggle("green-card", active);
        saveTags();
    });
});

document.querySelectorAll("input.level").forEach((el) => {
    el.addEventListener("input", function () {
        this.style.setProperty("--value", this.value + "%");
        saveSliders();
    });
});

document.getElementById("reset").addEventListener("click", () => {
    localStorage.clear();
    location.reload();
});

document.querySelectorAll(".level").forEach((input) => {
    input.style.setProperty("--value", input.value + "%");
});
