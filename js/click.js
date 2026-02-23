document.addEventListener("DOMContentLoaded", function () {
    const infoBox = document.getElementById("Square");
    const shopImages = document.querySelectorAll(".shopItem");

    shopImages.forEach(img => {
        img.addEventListener("click", function () {
            console.log(img);
            infoBox.innerHTML = `<img src="${img.src}" class = "infoImage">`;
            infoBox.style.display = "block"
        });
    })

})