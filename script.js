const numDisks = 5;
const pegs = { A: [], B: [], C: [] };
const pegElements = {
  A: document.getElementById("A"),
  B: document.getElementById("B"),
  C: document.getElementById("C"),
};
const logElement = document.getElementById("step-log");
const moveCounter = document.getElementById("moveCount");
const speedSlider = document.getElementById("speedRange");
const speedValue = document.getElementById("speedValue");

let moveCount = 0;
let speedDelay = 500;

speedSlider.addEventListener("input", () => {
  speedDelay = parseInt(speedSlider.value);
  speedValue.textContent = speedDelay + "ms";
});

function createDisks() {
  for (let i = numDisks; i >= 1; i--) {
    const disk = document.createElement("div");
    disk.className = `disk disk${i}`;
    disk.dataset.size = i;
    disk.innerText = i;
    pegs.A.push(disk);
    pegElements.A.appendChild(disk);
    updateDiskPosition("A");
  }
}

function updateDiskPosition(peg) {
  const disks = pegs[peg];
  disks.forEach((disk, index) => {
    disk.style.bottom = `${index * 22}px`;
  });
}

function logStep(action, peg) {
  const li = document.createElement("li");
  li.textContent = `${action} from ${peg}`;
  logElement.appendChild(li);
  logElement.scrollTop = logElement.scrollHeight;
}

function moveDisk(from, to) {
  return new Promise(resolve => {
    const disk = pegs[from].pop();
    logStep("POP", from);
    setTimeout(() => {
      pegElements[to].appendChild(disk);
      pegs[to].push(disk);
      updateDiskPosition(from);
      updateDiskPosition(to);
      logStep("PUSH", to);
      moveCount++;
      moveCounter.textContent = `Moves: ${moveCount}`;
      resolve();
    }, speedDelay);
  });
}

async function hanoi(n, from, to, aux) {
  if (n === 1) {
    await moveDisk(from, to);
    return;
  }
  await hanoi(n - 1, from, aux, to);
  await moveDisk(from, to);
  await hanoi(n - 1, aux, to, from);
}

function startHanoi() {
  moveCount = 0;
  moveCounter.textContent = "Moves: 0";
  logElement.innerHTML = "";
  ["A", "B", "C"].forEach(peg => {
    pegs[peg] = [];
    pegElements[peg].innerHTML = `<div class="peg-label">${peg}</div>`;
  });
  createDisks();
  setTimeout(() => {
    hanoi(numDisks, "A", "C", "B");
  }, 1000);
}

function downloadLog() {
  let text = "";
  logElement.querySelectorAll("li").forEach((li, i) => {
    text += `${i + 1}. ${li.textContent}\n`;
  });

  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "hanoi_steps.txt";
  a.click();
}
