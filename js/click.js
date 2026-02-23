document.getElementById("list").addEventListener("click", function (e){
    const item = e.target.closest(".item");
    if (!item) return;

    const img = item.querySelector(".shopItem");
    const type = img.dataset.name;
    const column = document.getElementById(type);

    const newImg = document.createElement("img");
    newImg.src = img.src;
    newImg.classList.add("infoImage");

    column.appendChild(newImg);
})