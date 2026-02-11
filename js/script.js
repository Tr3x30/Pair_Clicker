let resources = 50000;
let resourcesPerSecond = 0;
let boughtUpgrades = {
    "GRANDMA": 0,
    "GRANDPA": 0,
    "BAKER": 0,
    "FACTORY": 0,
    "FARMER": 0,
    "BANK": 0
};

// ChatGPT cookup
const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
});

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gainResourcesButton(e, popping, btn) {
    const resourceCounter = document.querySelector('#generationArea #resourceCounter');

    const gained = 1;
    resources = resources + gained;

    resourceCounter.textContent =
        formatter.format(resources) + " resources";

    // create text
    const text = document.createElement('div');
    text.className = 'click-text';
    text.textContent = `+${formatter.format(gained)}`;

    // position it at mouse click
    text.style.left = `${e.clientX + getRandomIntInclusive(-20, 20)}px`;
    text.style.top = `${e.clientY - 20}px`;
    text.style.transform = "translateX(-50%)";

    document.body.appendChild(text);

    // cleanup after animation
    text.addEventListener('animationend', () => {
        text.remove();
    });

    if (popping) return;
    popping = true;

    btn.classList.add('pop');

    // When animation ends, reset
    btn.addEventListener('animationend', () => {
        btn.classList.remove('pop');
        popping = false;
    }, { once: true });
}

function automaticResourceGeneration() {
    const resourceCounter = document.querySelector('#generationArea #resourceCounter');
    resources += resourcesPerSecond;

    resourceCounter.textContent =
        formatter.format(resources) + " resources";
}

function calculateResourcesPerSecond() {
    const generationCounter = document.querySelector('#generationArea #perSecond');
    let perSecond = 0;

    const keys = Object.keys(boughtUpgrades); // e.g. ["grandma", "factory", ...] or ["0","1",...]
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const count = Number(boughtUpgrades[k]) || 0; // force numeric, fallback to 0

        const add = count * (2 ** (Math.floor((i + 1) * 1.5)));
        perSecond += add;

        console.log(k, count, add);
    }

    resourcesPerSecond = perSecond;
    generationCounter.textContent = formatter.format(perSecond) + " per second";
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#generationArea #buttonContainer');
    let popping = false
    btn.addEventListener('click', (e) => {
        gainResourcesButton(e, popping, btn);
    });

    const upgrades = document.querySelectorAll('#upgradeArea #shopTabs #listOuter #list .item');
    console.log(upgrades);

    list.addEventListener('click', (e) => {
        const item = e.target.closest('.item');
        if (!item) return;

        const costEl = item.querySelector('#cost');
        let cost = parseInt(costEl.textContent.trim(), 10);
        const nameEl = item.querySelector('#name');
        const name = nameEl.textContent.trim();
        const counterEl = item.querySelector('#counter');
        const resourceCounter = document.querySelector('#generationArea #resourceCounter');

        console.log('Name:', name);
        console.log('Cost:', cost);

        if (resources >= cost) {
            console.log("buying...");
            resources = resources - cost;
            resourceCounter.textContent =
                formatter.format(resources) + " resources";

            cost = Math.floor(cost * 1.1) + 1;
            costEl.textContent = formatter.format(cost);

            if (name in boughtUpgrades) {
                console.log('exists');
                boughtUpgrades[name] += 1;
            }

            counterEl.textContent = formatter.format(boughtUpgrades[name]);
            calculateResourcesPerSecond();
            console.log("hi");
            console.log(boughtUpgrades);
        }
    });

    // Set up repeating function
    const intervalId = setInterval(automaticResourceGeneration, 1000);

});
