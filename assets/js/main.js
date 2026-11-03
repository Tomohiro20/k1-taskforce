// K-1 TASK FORCE 共通スクリプト
// 活動実績とメンバーは data/*.json から読み込んで表示する（管理画面 Pages CMS で更新）
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

    // スクロールで要素をふわっと表示
    var observer = 'IntersectionObserver' in window
        ? new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px' })
        : null;
    function reveal(el) {
        el.classList.add('reveal');
        if (observer) observer.observe(el); else el.classList.add('is-visible');
    }
    document.querySelectorAll('.reveal').forEach(reveal);

    // ---- 部品づくりの小道具 ----
    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }
    function loadJSON(path) {
        // ?v= を付けて、更新直後でも古いデータが表示されないようにする
        return fetch(path + '?v=' + Date.now()).then(function (res) {
            return res.ok ? res.json() : Promise.reject(new Error(path));
        });
    }
    function imagePath(src) { return String(src).replace(/^\//, ''); }
    function isWebLink(url) { return /^https?:\/\//.test(url || ''); }

    // ---- 日付 ----
    var WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
    function ymdOf(value) { return String(value || '').slice(0, 10); }
    function todayYmd() {
        var d = new Date();
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }
    function parseYmd(ymd) {
        var p = ymd.split('-');
        return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    }
    // 終了日（なければ開催日）が今日以降なら「開催予定」
    function isUpcoming(item) { return (item.endYmd || item.ymd) >= todayYmd(); }
    // 「あと4日」「本日開催」「開催中」
    function statusText(item) {
        var today = todayYmd();
        if (item.ymd > today) {
            var days = Math.round((parseYmd(item.ymd) - parseYmd(today)) / 86400000);
            return days === 1 ? '明日開催' : 'あと' + days + '日';
        }
        return item.ymd === today ? '本日開催' : '開催中';
    }
    // 開催予定カード用の「11.07 (土) – 11.08 (日)」
    function dayText(ymd) {
        var d = parseYmd(ymd);
        return (d.getMonth() + 1) + '.' + ('0' + d.getDate()).slice(-2) + ' (' + WEEKDAYS[d.getDay()] + ')';
    }

    // ---- 活動実績 ----
    function sortedActivities(data) {
        var used = {};
        return (data.items || [])
            .filter(function (item) { return item && item.title && item.date; })
            .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); })
            .map(function (item) {
                var ymd = ymdOf(item.date);
                var id = 'a' + ymd.replace(/-/g, '');
                used[id] = (used[id] || 0) + 1;
                if (used[id] > 1) id += '-' + used[id];
                var endYmd = ymdOf(item.end_date);
                return Object.assign({}, item, {
                    id: id,
                    ymd: ymd,
                    endYmd: endYmd > ymd ? endYmd : '',
                    dateText: item.date_label || ymd.replace(/-/g, '.')
                });
            });
    }
    function splitByDate(items) {
        return {
            upcoming: items.filter(isUpcoming).reverse(), // 近い順
            past: items.filter(function (item) { return !isUpcoming(item); })
        };
    }
    function statusNode(item) { return el('span', 'status', statusText(item)); }
    function linkNodes(item) {
        return (item.links || [])
            .filter(function (link) { return link && isWebLink(link.url); })
            .map(function (link) {
                var a = el('a', 'text-link', link.label || '詳しく見る');
                a.href = link.url;
                a.target = '_blank';
                a.rel = 'noopener';
                return a;
            });
    }
    function tagNode(tag) {
        var name = tag || 'EVENT';
        return el('span', name === 'AWARD' ? 'tag tag--award' : 'tag', name);
    }
    function activityNode(item, upcoming) {
        var article = el('article', upcoming ? 'activity-item activity-item--upcoming' : 'activity-item');
        article.id = item.id;

        var thumb = el('div', 'activity-item__thumb');
        var img = el('img');
        if (item.image) {
            img.src = imagePath(item.image);
            img.alt = item.title;
            img.loading = 'lazy';
        } else {
            thumb.classList.add('activity-item__thumb--empty');
            thumb.setAttribute('aria-hidden', 'true');
            img.src = 'assets/img/logo.png';
            img.alt = '';
        }
        thumb.appendChild(img);

        var body = el('div', 'activity-item__body');
        var meta = el('div', 'activity-item__meta');
        if (upcoming) meta.appendChild(statusNode(item));
        meta.append(el('span', 'date', item.dateText), tagNode(item.tag));
        body.append(meta, el('h3', 'activity-item__title', item.title));
        if (item.place) body.appendChild(el('p', 'activity-item__place', item.place));
        if (item.text) body.appendChild(el('p', 'activity-item__text', item.text));

        var links = linkNodes(item);
        if (links.length) {
            var box = el('div', 'activity-item__links');
            box.append.apply(box, links);
            body.appendChild(box);
        }
        article.append(thumb, body);
        return article;
    }

    function headingNode(en, jp) {
        var head = el('div', 'activity-heading');
        head.append(el('span', 'label', en), el('h2', null, jp));
        return head;
    }

    // 活動実績ページ：開催予定（近い順）→ これまでの活動（新しい順）
    var activityList = document.querySelector('[data-activities]');
    if (activityList) {
        loadJSON('data/activities.json').then(function (data) {
            var groups = splitByDate(sortedActivities(data));
            var nodes = [];
            if (groups.upcoming.length) {
                nodes.push(headingNode('Upcoming', '開催予定'));
                groups.upcoming.forEach(function (item) { nodes.push(activityNode(item, true)); });
                nodes.push(headingNode('Archive', 'これまでの活動'));
            }
            groups.past.forEach(function (item) { nodes.push(activityNode(item, false)); });
            activityList.replaceChildren.apply(activityList, nodes);
            nodes.forEach(reveal);
            // activity.html#a20260530 のようなリンクで来たときは、その活動まで移動する
            var target = location.hash && document.getElementById(location.hash.slice(1));
            if (target) { target.scrollIntoView({ behavior: 'instant' }); onScroll(); }
        }).catch(function () {
            activityList.replaceChildren(el('p', null, '活動実績を読み込めませんでした。時間をおいて再度お試しください。'));
        });
    }

    // トップページ：開催予定のイベント（あるときだけ表示）
    var upcomingBox = document.querySelector('[data-upcoming]');
    if (upcomingBox) {
        loadJSON('data/activities.json').then(function (data) {
            var items = splitByDate(sortedActivities(data)).upcoming;
            if (!items.length) return;
            var grid = el('div', 'upcoming-grid');
            items.forEach(function (item) {
                var card = el('article', 'upcoming-card');
                var top = el('div', 'upcoming-card__top');
                top.append(statusNode(item), tagNode(item.tag));
                var date = el('p', 'upcoming-card__date', dayText(item.ymd) + (item.endYmd ? ' – ' + dayText(item.endYmd) : ''));
                var title = el('h3', 'upcoming-card__title');
                var titleLink = el('a', null, item.title);
                titleLink.href = 'activity.html#' + item.id;
                title.appendChild(titleLink);
                card.append(top, date, title);
                if (item.place) card.appendChild(el('p', 'activity-item__place', item.place));
                var links = linkNodes(item);
                if (links.length) {
                    var box = el('div', 'activity-item__links');
                    box.append.apply(box, links);
                    card.appendChild(box);
                }
                grid.appendChild(card);
            });
            upcomingBox.querySelector('[data-upcoming-list]').replaceChildren(grid);
            upcomingBox.hidden = false;
            upcomingBox.querySelectorAll('.reveal').forEach(reveal);
        }).catch(function () { /* 読み込めないときは何も表示しない */ });
    }

    // トップページ：これまでの活動から最新の数件を一覧で表示
    var latest = document.querySelector('[data-latest-activity]');
    if (latest) {
        var count = Number(latest.getAttribute('data-latest-activity')) || 4;
        loadJSON('data/activities.json').then(function (data) {
            var items = splitByDate(sortedActivities(data)).past.slice(0, count);
            if (!items.length) return;
            var list = el('ul', 'news-list');
            items.forEach(function (item) {
                var a = el('a');
                a.href = 'activity.html#' + item.id;
                a.append(el('span', 'date', item.dateText), tagNode(item.tag), el('span', 'news-list__title', item.title));
                var li = el('li');
                li.appendChild(a);
                list.appendChild(li);
            });
            latest.replaceChildren(list);
        }).catch(function () { /* 読み込めないときは元のリンク文をそのまま表示 */ });
    }

    // ---- メンバー ----
    var memberList = document.querySelector('[data-members]');
    if (memberList) {
        loadJSON('data/members.json').then(function (data) {
            var nodes = (data.groups || [])
                .filter(function (group) { return group && group.university && (group.members || []).length; })
                .map(function (group) {
                    var section = el('section', 'member-group');
                    var head = el('div', 'member-group__head');
                    head.append(el('h2', null, group.university), el('span', 'label', group.members.length + ' Members'));
                    var grid = el('div', 'member-grid');
                    group.members.forEach(function (m) {
                        if (!m || !m.name) return;
                        var card = el('div', 'member-card');
                        card.appendChild(el('div', 'member-card__name', m.name));
                        if (m.kana) card.appendChild(el('div', 'member-card__kana', m.kana));
                        var info = [m.affiliation, m.grade].filter(Boolean).join('\n');
                        if (info) card.appendChild(el('div', 'member-card__info', info));
                        if (m.lab) card.appendChild(el('div', 'member-card__lab', m.lab));
                        grid.appendChild(card);
                    });
                    section.append(head, grid);
                    return section;
                });
            memberList.replaceChildren.apply(memberList, nodes);
            nodes.forEach(reveal);
        }).catch(function () {
            memberList.replaceChildren(el('p', null, 'メンバー一覧を読み込めませんでした。時間をおいて再度お試しください。'));
        });
    }
})();
