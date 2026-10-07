// K-1 TASK FORCE 共通スクリプト
(function () {
    var root = document.documentElement;
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');

    // スクロールしたらヘッダーを明るい帯に切り替える
    function onScroll() {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // スマホ用メニューの開閉
    toggle.addEventListener('click', function () {
        var open = root.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', open);
        toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });

    // トップページ：activity.html の先頭から最新の活動を読み込んで一覧にする
    // （活動実績は activity.html だけ更新すればトップにも反映される）
    var latest = document.querySelector('[data-latest-activity]');
    if (latest) {
        var count = Number(latest.getAttribute('data-latest-activity')) || 4;
        fetch('activity.html')
            .then(function (res) { return res.ok ? res.text() : Promise.reject(); })
            .then(function (html) {
                var doc = new DOMParser().parseFromString(html, 'text/html');
                var items = Array.prototype.slice.call(doc.querySelectorAll('.activity-item'), 0, count);
                if (!items.length) return;
                var list = document.createElement('ul');
                list.className = 'news-list';
                items.forEach(function (item) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.href = 'activity.html#' + item.id;
                    var date = document.createElement('span');
                    date.className = 'date';
                    date.textContent = item.querySelector('.date').textContent;
                    var tag = item.querySelector('.tag').cloneNode(true);
                    var title = document.createElement('span');
                    title.className = 'news-list__title';
                    title.textContent = item.querySelector('.activity-item__title').textContent;
                    a.append(date, tag, title);
                    li.appendChild(a);
                    list.appendChild(li);
                });
                latest.replaceChildren(list);
            })
            .catch(function () { /* 読み込めないときは元のリンク文をそのまま表示 */ });
    }

    // スクロールで要素をふわっと表示
    var targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        targets.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { observer.observe(el); });
})();
