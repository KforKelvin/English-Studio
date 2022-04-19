let html = document.querySelector("html");

document.querySelector("#other").addEventListener ("change", function() {
    html.style.filter = "url(#low-contrast)";
});

document.querySelector("#RG").addEventListener ("change", function() {
    html.style.filter = "url(#protanopia)";
});

document.querySelector("#BG").addEventListener ("change", function() {
    html.style.filter = "url(#tritanopia)";
});

document.querySelector("#default").addEventListener ("change", function() {
    html.style.filter = "none";
}); 