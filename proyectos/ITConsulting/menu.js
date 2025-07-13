document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".menu-toggle");
    const menuList = document.querySelector("#menu ul");
    const scrollBtn = document.getElementById("scrollToTop");

    // Menú hamburguesa
    toggleButton.addEventListener("click", () => {
        menuList.classList.toggle("active");
    });

    // Mostrar/ocultar botón "Ir arriba"
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    });

    // Click en el botón para volver arriba
    scrollBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
