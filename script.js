const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const chips = document.querySelectorAll(".chip");
const ringBar = document.getElementById("ring-bar");
const CIRC = 276.46;

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let filter = "all";

document.getElementById("date").textContent =
  new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

function save() { localStorage.setItem("tasks", JSON.stringify(tasks)); }

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  tasks.unshift({ id: Date.now(), title, done: false });
  input.value = "";
  save(); render();
});

chips.forEach((chip) =>
  chip.addEventListener("click", () => {
    filter = chip.dataset.filter;
    chips.forEach((c) => c.classList.toggle("active", c === chip));
    render();
  })
);

list.addEventListener("click", (e) => {
  const li = e.target.closest(".task");
  if (!li) return;
  const task = tasks.find((t) => t.id === Number(li.dataset.id));
  if (e.target.closest(".del")) tasks = tasks.filter((t) => t !== task);
  else if (e.target.matches("input[type=checkbox]")) task.done = e.target.checked;
  else return;
  save(); render();
});

function render() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pending = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;

  chips[0].innerHTML = `All <b>${total}</b>`;
  chips[1].innerHTML = `Pending <b>${pending}</b>`;
  chips[2].innerHTML = `Completed <b>${done}</b>`;

  ringBar.style.strokeDashoffset = CIRC * (1 - pct / 100);
  ringBar.classList.toggle("full", total > 0 && pct === 100);
  document.getElementById("ring-text").textContent = pct + "%";
  document.getElementById("summary").textContent = !total
    ? "Add your first task to get started."
    : pending === 0 ? "All done. Nice work!"
    : `${pending} to go, ${done} done.`;

  const shown = tasks.filter((t) =>
    filter === "all" || (filter === "pending" ? !t.done : t.done));
  list.innerHTML = "";
  if (!shown.length) {
    list.innerHTML = '<li class="empty">Nothing here yet.</li>';
    return;
  }
  for (const t of shown) {
    const li = document.createElement("li");
    li.className = "task" + (t.done ? " done" : "");
    li.dataset.id = t.id;
    li.innerHTML = `
      <label class="check">
        <input type="checkbox" ${t.done ? "checked" : ""} aria-label="Mark complete">
        <span><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span>
      </label>
      <span class="title"></span>
      <button class="del" aria-label="Delete task">
        <svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3"/></svg>
      </button>`;
    li.querySelector(".title").textContent = t.title;
    list.appendChild(li);
  }
}

render();
