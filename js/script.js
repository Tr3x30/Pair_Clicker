let resources = 200;
let resourcesPerSecond = 0;
let boughtUpgrades = {}

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
        const cost = parseInt(costEl.textContent.trim(), 10);
        const nameEl = item.querySelector('#name');
        const name = nameEl.textContent.trim();
        const counterEl = item.querySelector('#count');
        const counter = counterEl.textContent.trim();

        console.log('Name:', name)
        console.log('Cost:', cost);

        if (resources > cost) {
            console.log("buying...");
            resources = resources - cost;
            resourceCounter.textContent =
                formatter.format(resources) + " resources";

            if (name in boughtUpgrades) {
                boughtUpgrades.counter += 1;
            } else {
                boughtUpgrades[name] = 1;
            }
            console.log("hi");
            console.log(boughtUpgrades);
        }
    });

    // Set up repeating function
    const intervalId = setInterval(automaticResourceGeneration, 1000);

});
