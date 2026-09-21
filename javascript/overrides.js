
$(document).ready(() => {
    const toggleCurrent = function (elem) {
        var parent_li = elem.closest('li');
        var menu_li = parent_li.next();
        var menu_ul = menu_li.children('ul');
        parent_li.siblings('li').not(menu_li).removeClass('current').removeClass('with-children');
        parent_li.siblings().find('> ul').not(menu_ul).removeClass('current').addClass('toc-hidden');
        parent_li.toggleClass('current');
        parent_li.toggleClass('with-children');
        menu_li.toggleClass('current');
        menu_ul.toggleClass('current').toggleClass('toc-hidden');
        $('.with-children').each((i, obj) => {
            console.log(obj)
            if ($(obj).find('.toctree-expand').length === 0) {
                $(obj).removeClass('with-children')
            }
        })
    }
    var thispage = document.location.hash;
    var hash = thispage.replace(/^#/, '');
    if (!hash) return;
    var $linkEL = $(`.tocbase a[href="#${hash}"]`);
    if ($linkEL && $linkEL[0]) {
        $linkEL.parents('[class^="toctree-"]').each((i, obj) => {
            if ($(obj).hasClass('toctree-l1')) {
                return;
            }
            const $newLi = $(obj).prev('li')
            if ($newLi.hasClass('current')) return;
            const $newA = $newLi.children('a');
            if ($newA && $newA[0]) {
                toggleCurrent($newA)
            }
        });
        // toggleCurrent($linkEL);
    }
})