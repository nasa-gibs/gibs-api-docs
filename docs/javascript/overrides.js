function Collapse() {
    var isCollapseable = false;
    var eventListenerTargetArray = [];
    var breakpoint = 1200;

    function addClickListener(el) {
        el.classList.add("can-collapse");
        const link = el.querySelector(".md-nav__link")
        link.classList.add("link-collapse");
        eventListenerTargetArray.push(link);
        link.onclick = function (e) {
            el.classList.toggle('collapsed');
            e.stopPropagation();
        };
    }
    function makeCollapse() {
        var nav = document.querySelectorAll(".md-nav__item .md-nav__item");
        for (var i = 0; i < nav.length; i++) {
            const el = nav.item(i);
            var hasChild = el.querySelector(".md-nav__item") != null;
            if (hasChild) addClickListener(el)
        }
    }
    function removeClassesForQuerySelection(querySelection, classNames) {
        const els = document.querySelectorAll(querySelection);
        for (var i = 0; i < els.length; i++) {
            const el = els.item(i);
            classNames.forEach(className => {
                el.classList.remove(className);
            });
        }
    }
    function removeListeners() {
        eventListenerTargetArray.forEach(target => {
            target.onclick = null;
        });
    }
    function removeCollapse() {
        removeListeners();
        removeClassesForQuerySelection('.can-collapse', ['can-collapse', 'collapsed'])
        removeClassesForQuerySelection('.link-collapse', ['link-collapse'])
    }
    function updateForSize() {
        const width = window.innerWidth;
        if (width > breakpoint && !isCollapseable) {
            makeCollapse();
            isCollapseable = true;
        } else if (width < breakpoint && isCollapseable) {
            removeCollapse();
            isCollapseable = false;
        }
    }
    window.addEventListener('resize', updateForSize);
    updateForSize();
}
document.addEventListener("DOMContentLoaded", Collapse);