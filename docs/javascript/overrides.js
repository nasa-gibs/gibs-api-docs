document.addEventListener("DOMContentLoaded", function () {
    load_navpane();
});

function addClickListener(el) {
    el.classList.add("can-collapse");
    const link = el.querySelector(".md-nav__link")
    console.log(link)
    link.classList.add("link-collapse");
    link.onclick = function (e) {
        e.stopPropagation();
        console.log('toggle')
        el.classList.toggle('collapsed');
    }

}
function load_navpane() {
    var nav = document.querySelectorAll(".md-nav__item .md-nav__item");
    console.log(nav)
    for (var i = 0; i < nav.length; i++) {
        const el = nav.item(i);
        var hasChild = el.querySelector(".md-nav__item") != null;
        if (hasChild) addClickListener(el)
    }
}