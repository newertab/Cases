/* ================= SAVE ================= */

function addItem(item){
    const key=item.name;
    if(!game.inventory[key]){
        game.inventory[key]={...item,qty:0};
    }
    game.inventory[key].qty++;
}

function renderInventory(){
    const list=document.getElementById("inventoryList");
    list.innerHTML="";

    let arr=Object.values(game.inventory);

    const filter=document.getElementById("filterSelect").value;
    if(filter!=="all"){
        arr=arr.filter(i=>i.rarity===filter);
    }

    const sort=document.getElementById("sortSelect").value;

    arr.sort((a,b)=>{
        if(sort==="value") return b.value-a.value;
        if(sort==="name") return a.name.localeCompare(b.name);
        if(sort==="rarity") return a.rarity.localeCompare(b.rarity);
    });

    arr.forEach(item=>{
        const li=document.createElement("li");
        li.className="inventory-item";

        const span=document.createElement("span");
        span.className=item.rarity;
        span.textContent=`${item.name} x${item.qty} ($${item.value})`;

        const sell=document.createElement("button");
        sell.textContent="Sell";
        sell.onclick=()=>sellItem(item.name);

        li.appendChild(span);
        li.appendChild(sell);
        list.appendChild(li);
    });
}

/* ================= ACTIONS ================= */

function openCrate(i){
    const crate=crates[i];
    if(game.money<crate.cost) return alert("Not enough money");

    game.money-=crate.cost;

    const reward=getRandomItem(crate);
    addItem(reward);

    const box=document.getElementById("openResult");
    box.classList.add("animate");

    setTimeout(()=>{
        box.classList.remove("animate");
        box.innerHTML=`You got: <span class="${reward.rarity}">${reward.name}</span>`;
    },250);

    save();
    updateMoney();
    renderInventory();
}

function sellItem(name){
    const item=game.inventory[name];
    game.money+=item.value;
    item.qty--;
    if(item.qty<=0) delete game.inventory[name];
    save();
    updateMoney();
    renderInventory();
}

function sellAll(){
    let total=0;
    Object.values(game.inventory).forEach(i=>{
        total+=i.value*i.qty;
    });

    game.money+=total;
    game.inventory={};

    save();
    updateMoney();
    renderInventory();
}

/* ================= INIT ================= */

updateMoney();
renderCrates();
renderInventory();
