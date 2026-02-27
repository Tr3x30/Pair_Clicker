document.addEventListener('DOMContentLoaded', () => {
    let resourceIntervalID = 0;
    let speed = 1000;
    let resources = 0;
    let resourcesPerSecond = 0;

    let boughtUpgrades = {
        "GRANDMA": 0,
        "GRANDPA": 0,
        "BAKER": 0,
        "FACTORY": 0,
        "FARMER": 0,
        "BANK": 0
    };

    let buffsUnlocked = {
        "CLICK": 1,
        "GRANDMA": 1,
        "GRANDPA": 1,
        "BAKER": 1,
        "FACTORY": 1,
        "FARMER": 1,
        "BANK": 1
    }

    let achievements = {
        "The Meaning of Grind": { unlocked: false, requirement: 42 },
        "Triple Digits": { unlocked: false, requirement: 100 },
        "I would bake five hundred more": { unlocked: false, requirement: 500 },
        "To be the man that baked a thousand donuts": { unlocked: false, requirement: 1000 },
        "To fall down at your door": { unlocked: false, requirement: 1500 },
        "Proof That I Love You 3000": { unlocked: false, requirement: 3000 },
        "Pocket Change": { unlocked: false, requirement: 5000 },
        "Five Digits, Baby": { unlocked: false, requirement: 10000 },
        "20,000 Leagues Under the Glaze": { unlocked: false, requirement: 20000 },
        "Warhammer 40,000 Calories": { unlocked: false, requirement: 40000 },
        "Resource Hoarder": { unlocked: false, requirement: 50000 },
        "Six Figure Clicker": { unlocked: false, requirement: 100000 },
        "Beverly Hills 90,210": { unlocked: false, requirement: 90210 },
        "♫ 525,600 Donuts ♫": { unlocked: false, requirement: 525600 },
        "Millionaire Mindset": { unlocked: false, requirement: 1000000 },
        "88 MPH Sugar Rush": { unlocked: false, requirement: 1210000 },
        "Resource Tycoon": { unlocked: false, requirement: 2500000 },
        "Economic Overlord": { unlocked: false, requirement: 5000000 },
        "Fluent in 6,000,000 Forms of Donuts": { unlocked: false, requirement: 6000000 },
        "Untouchable Empire": { unlocked: false, requirement: 7500000 },
        "Jenny’s Bakery": { unlocked: false, requirement: 8675309 },
        "♫ You would not believe your eyes ♫": { unlocked: false, requirement: 10000000 },
        "All the possible glazes for the coming donuts": { unlocked: false, requirement: 14000605 }
    };

    const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    });
    function parseCompactNumber(str) {
        const multipliers = {
            K: 1e3,
            M: 1e6,
            B: 1e9,
            T: 1e12
        };

        const match = str.trim().match(/^([\d.]+)\s*([KMBT])?$/i);
        if (!match) return NaN;

        const value = parseFloat(match[1]);
        const suffix = match[2]?.toUpperCase();

        return suffix ? value * multipliers[suffix] : value;
    }


    /**
     * Generates a random number between given inputs (inclusive)
     * @param {Number} min 
     * @param {Number} max 
     * @returns Random number
     */
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Checks for completed achievements
     */
    function checkAchievements() {
        for (const i in achievements) {
            let achievement = achievements[i];
            if (achievement['unlocked']) {
                continue;
            }

            if (resources >= achievement['requirement']) {
                const box = document.getElementById('achievement-box');
                box.textContent = "Achievment Unlocked: " + i
                box.classList.add('show');
                achievement['unlocked'] = true;
                resources += Math.floor(achievement['requirement'] / 100);
                setTimeout(() => {
                    box.classList.remove('show');
                }, 3000);
                const panel = document.getElementById('achievementPanel');
                const newImg = document.createElement("img");
                let j = "placeholder"
                console.log(achievement['requirement']);
                newImg.src = "images/a" + achievement['requirement'] + ".png";
                newImg.classList.add("achievementImage");
                panel.appendChild(newImg);
            }
        }
    }

    /**
     * Adds resource(s) to player and updates related text.
     * Calls achievement check.
     * 
     * @param {Event} e 
     * @param {Boolean} popping 
     * @param {HTMLElement} btn 
     */
    function gainResourcesButton(e, popping, btn) {
        const resourceCounter = document.querySelector('#generationArea #resourceCounter');

        const gained = 1 * buffsUnlocked["CLICK"];
        resources = resources + gained;
        checkAchievements();

        resourceCounter.textContent =
            formatter.format(resources) + " Donuts";

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

    /**
     * Add resources automatically and check for achievements.
     * Update relevant text.
     */
    function automaticResourceGeneration() {
        const resourceCounter = document.querySelector('#generationArea #resourceCounter');
        resources += resourcesPerSecond * (speed / 1000);
        checkAchievements();

        resourceCounter.textContent =
            formatter.format(resources) + " Donuts";
    }

    /**
     * Set up interval for automatic resource generation
     */
    function automaticInterval() {
        console.log("ID: " + resourceIntervalID);

        if (resourceIntervalID) {
            clearInterval(resourceIntervalID);
        }
        resourceIntervalID = setInterval(automaticResourceGeneration, speed);
    }

    /**
     * Calculate the number of resources to generate per second and update text
     */
    function calculateResourcesPerSecond() {
        const generationCounter = document.querySelector('#generationArea #perSecond');
        let perSecond = 0;

        const keys = Object.keys(boughtUpgrades);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const count = Number(boughtUpgrades[k]) || 0;

            const add = count * (5 ** Math.floor(i)) * buffsUnlocked[k];
            perSecond += add;

            console.log(k, count, add);
        }

        console.log(1 / (speed / 1000));
        resourcesPerSecond = perSecond / (speed / 1000);
        generationCounter.textContent = formatter.format(resourcesPerSecond) + " per second";
    }

    /**
     * Returns the first visible child of the given element.
     * 
     * @param {HTMLElement} element 
     * @returns Child of given element
     */
    function getFirstVisibleChild(element) {
        const children = element.children;
        console.log(element);

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.style.display !== 'none') {
                return child;
            }
        }
    }

    /**
     * Adds upgrade buffs to resource generation
     * 
     * @param {number} buffID 
     */
    function addBuff(buffID) {
        if (buffID === "ALL") {
            buffsUnlocked["CLICK"] = buffsUnlocked["CLICK"] * 2;
            speed = 500;
            automaticInterval();
            calculateResourcesPerSecond();
        } else {
            buffsUnlocked[buffID] = buffsUnlocked[buffID] * 2;
            console.log(buffsUnlocked);
        }
    }


    const btn = document.querySelector('#generationArea #buttonContainer');
    let popping = false
    btn.addEventListener('click', (e) => {
        gainResourcesButton(e, popping, btn);
    });

    const buffs = document.querySelectorAll('#upgradeArea #buffShop .buff');
    console.log(buffs);
    buffShop.addEventListener('click', (e) => {
        const buff = e.target.closest('.buff');
        console.log(buff);
        if (buff === null) {
            return;
        }

        const value = buff.dataset.value;

        const costEl = buff.querySelector('.cost');
        let cost = parseCompactNumber(costEl.textContent.trim(), 10);
        console.log(cost);

        if (resources >= cost) {
            resources = resources - cost;
            buff.style.display = "none";

            let firstVisible = getFirstVisibleChild(buff.parentElement);
            console.log(firstVisible);
            if (firstVisible) {
                getFirstVisibleChild(buff.parentElement).style.marginLeft = "0";
            }
            addBuff(value);
        }
    });

    const upgrades = document.querySelectorAll('#upgradeArea #shopTabs #listOuter #list .item');
    console.log(upgrades);

    list.addEventListener('click', (e) => {
        const item = e.target.closest('.item');
        console.log(item);
        if (!item) return;

        const costEl = item.querySelector('#cost');
        let cost = parseCompactNumber(costEl.textContent.trim(), 10);
        const nameEl = item.querySelector('#name');
        const name = nameEl.textContent.trim();
        const counterEl = item.querySelector('#counter');
        const resourceCounter = document.querySelector('#generationArea #resourceCounter');

        const img = item.querySelector(".shopItem");
        const type = img.dataset.name;
        const column = document.getElementById(type);
        const newImg = document.createElement("img");

        if (resources >= cost) {
            resources = resources - cost;
            resourceCounter.textContent =
                formatter.format(resources) + " resources";

            cost = Math.floor(cost * 1.1) + 1;
            costEl.textContent = formatter.format(cost);

            newImg.src = img.src;
            newImg.classList.add("infoImage");
            column.appendChild(newImg);

            if (name in boughtUpgrades) {
                console.log('exists');
                boughtUpgrades[name] += 1;
            }

            counterEl.textContent = formatter.format(boughtUpgrades[name]);
            calculateResourcesPerSecond();
            console.log(boughtUpgrades);
            console.log("interval pre: " + resourceIntervalID);
            automaticInterval();
            console.log("interval: " + resourceIntervalID);
        }
    });
});
