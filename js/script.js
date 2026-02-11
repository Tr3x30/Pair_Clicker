let resources = 0;


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

    const gained = resources + 1;
    resources = resources * 2 + 1;

    resourceCounter.textContent =
        formatter.format(resources) + " resources";

    // create text
    const text = document.createElement('div');
    text.className = 'click-text';
    text.textContent = `+${formatter.format(gained)}`;

    // position it at mouse click
    console.log(getRandomIntInclusive(-20, 20));
    text.style.left = `${e.clientX + getRandomIntInclusive(-20, 20)}px`;
    text.style.top = `${e.clientY - 20}px`;
    text.style.transform = "translateX(-50%)";

    document.body.appendChild(text);

    // cleanup after animation
    text.addEventListener('animationend', () => {
        text.remove();
    });

    resources = resources * 2 + 1;
    resourceCounter.textContent = formatter.format(resources) + " resources";

    if (popping) return;
    popping = true;

    btn.classList.add('pop');

    // When animation ends, reset
    btn.addEventListener('animationend', () => {
        btn.classList.remove('pop');
        popping = false;
    }, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#generationArea #buttonContainer');
    let popping = false
    btn.addEventListener('click', (e) => {
        gainResourcesButton(e, popping, btn);
    });


});
