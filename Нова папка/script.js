const players = [
  { name: "_NeroKing_", rarity: 2 },
  { name: "Дед", rarity: 1 },
  { name: "aqurik13", rarity: 3 },
  { name: "ArtemkaDE", rarity: 1 },
  { name: "Ashura", rarity: 2 },
  { name: "Bylbo4ka_Tvoia", rarity: 3 },
  { name: "calla228091", rarity: 1 },
  { name: "cyver", rarity: 1 },
  { name: "denfry", rarity: 5 },
  { name: "Deter", rarity: 2 },
  { name: "Dumsi", rarity: 1 },
  { name: "Erotoro", rarity: 5 },
  { name: "erty_FF", rarity: 2 },
  { name: "ExtremeRUS", rarity: 1 },
  { name: "gogopon_12", rarity: 1 },
  { name: "Guwu_Schneider", rarity: 1 },
  { name: "IamSoloo_", rarity: 2 },
  { name: "hopteros", rarity: 1 },
  { name: "keepeell16", rarity: 1 },
  { name: "Krip", rarity: 3 },
  { name: "lastlight228", rarity: 3 },
  { name: "LinMoonRay", rarity: 4 },
  { name: "Maxon254", rarity: 3 },
  { name: "MAXAKA_HF", rarity: 2 },
  { name: "colobok01", rarity: 1 },
  { name: "MiskaReal", rarity: 3 },
  { name: "СенькаПушистый", rarity: 1 },
  { name: "niksar", rarity: 1 },
  { name: "p1zdyck", rarity: 1 },
  { name: "pupsik228piska", rarity: 2 },
  { name: "Pivozavr", rarity: 1 },
  { name: "rerreeettf", rarity: 2 },
  { name: "Krip_JR", rarity: 1 },
  { name: "S1mpleNavi", rarity: 2 },
  { name: "SalaWandrA", rarity: 1 },
  { name: "sasaorr", rarity: 2 },
  { name: "spiderbouman", rarity: 4 },
  { name: "TvixWix10", rarity: 3 },
  { name: "vladislaive", rarity: 1 },
  { name: "waseb", rarity: 1 },
  { name: "Watahahlo", rarity: 1 },
  { name: "YT_NISExSKILE", rarity: 2 },
  { name: "ZackUA", rarity: 4 },
  { name: "ZiKoGR", rarity: 3 }
];

const sellPrices = {
  1: 1,
  2: 5,
  3: 20,
  4: 50,
  5: 100,
};

const rarityChances = [
  { rarity: 1, chance: 95 },
  { rarity: 2, chance: 4 },
  { rarity: 3, chance: 0.5 },
  { rarity: 4, chance: 0.49 },
  { rarity: 5, chance: 0.01 },
];

let coins = 0;
const inventory = {};
const history = [];

const coinsEl = document.getElementById("coins");
const clickImg = document.getElementById("click-img");
const historyList = document.getElementById("history-list");
const inventoryList = document.getElementById("inventory-list");
const searchInput = document.getElementById("search");
const sellAllBtn = document.getElementById("sell-all");
const buyRobertBtn = document.getElementById("buy-robert");
const shopMessage = document.getElementById("shop-message");
const clickSound = document.getElementById("click-sound");

function getRandomRarity() {
  let rand = Math.random() * 100;
  let sum = 0;
  for (const item of rarityChances) {
    sum += item.chance;
    if (rand <= sum) return item.rarity;
  }
  return 1;
}

function getRandomPlayer() {
  let rarity = getRandomRarity();
  let filtered = players.filter(p => p.rarity === rarity);
  if (filtered.length === 0) return players[0];
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function updateCoins() {
  coinsEl.textContent = coins;
}

function updateHistory() {
  historyList.innerHTML = "";
  for (let i = history.length - 1; i >= Math.max(0, history.length - 5); i--) {
    let player = history[i];
    let li = document.createElement("li");
    li.textContent = player.name;
    li.className = "rarity-" + player.rarity;
    historyList.appendChild(li);
  }
}

function updateInventory(filter = "") {
  inventoryList.innerHTML = "";
  let keys = Object.keys(inventory).filter(name => name.toLowerCase().includes(filter.toLowerCase()));
  for (let name of keys) {
    let item = inventory[name];
    let li = document.createElement("li");

    let spanName = document.createElement("span");
    spanName.textContent = name + " x" + item.count;
    spanName.className = "name rarity-" + item.rarity;
    li.appendChild(spanName);

    let btnSellOne = document.createElement("button");
    btnSellOne.textContent = "Продать 1";
    btnSellOne.className = "sell-one";
    btnSellOne.onclick = () => sellOne(name);
    li.appendChild(btnSellOne);

    inventoryList.appendChild(li);
  }
}

function sellOne(name) {
  if (!inventory[name]) return;
  inventory[name].count--;
  coins += sellPrices[inventory[name].rarity];
  if (inventory[name].count <= 0) delete inventory[name];
  updateCoins();
  updateInventory(searchInput.value);
}

function sellAll() {
  for (let name in inventory) {
    coins += sellPrices[inventory[name].rarity] * inventory[name].count;
  }
  for (let name in inventory) delete inventory[name];
  updateCoins();
  updateInventory(searchInput.value);
}

function buyRobert() {
  if (coins >= 1000000) {
    coins -= 1000000;
    updateCoins();
    shopMessage.textContent = "Поздравляем! Вы купили Роберта и выиграли игру!";
    buyRobertBtn.disabled = true;
  } else {
    shopMessage.textContent = "Недостаточно монет для покупки Роберта.";
  }
}

clickImg.addEventListener("click", () => {
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }

  let player = getRandomPlayer();

  history.push(player);
  if (history.length > 50) history.shift();

  if (!inventory[player.name]) {
    inventory[player.name] = { rarity: player.rarity, count: 0 };
  }
  inventory[player.name].count++;

  updateCoins();
  updateHistory();
  updateInventory(searchInput.value);
});

searchInput.addEventListener("input", () => {
  updateInventory(searchInput.value);
});

sellAllBtn.addEventListener("click", sellAll);

buyRobertBtn.addEventListener("click", buyRobert);

updateCoins();
updateHistory();
updateInventory();
