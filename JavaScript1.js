const h1 = document.querySelector("h1");
if (h1) {
    h1.style.fontSize = "5vw";
}

/* Site-wide visited-pages recorder
   Adds/updates entries in localStorage key "visitedPages".
   Include this file (or the code) on every page you want tracked.
*/
(function () {
    'use strict';

    const STORAGE_KEY = 'visitedPages';

    const normalize = (s) => (s || '').toString().trim().toLowerCase().replace(/\?.*$/, '').replace(/\#[^/]*$/, '').replace(/\.[^/.]+$/, '');

    function loadVisited() {
        try {
            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            // Backwards compatibility: convert array of strings to objects
            return raw.map(item => {
                if (typeof item === 'string') {
                    const id = normalize(item);
                    return { id, href: item, title: humanize(item), ts: Date.now() };
                }
                return {
                    id: normalize(item.id || item.href || item.title),
                    href: item.href || item.id || '',
                    title: item.title || humanize(item.href || item.id || ''),
                    ts: item.ts || Date.now()
                };
            });
        } catch (e) {
            console.warn('VisitedPages parse error, resetting', e);
            localStorage.removeItem(STORAGE_KEY);
            return [];
        }
    }

    function saveVisited(arr) {
        // keep unique by id and keep most recent ts
        const map = new Map();
        arr.forEach(obj => {
            const id = normalize(obj.id || obj.href || obj.title || '');
            const existing = map.get(id);
            if (!existing || (obj.ts || 0) > (existing.ts || 0)) {
                map.set(id, {
                    id,
                    href: obj.href || obj.id || '',
                    title: obj.title || humanize(obj.href || obj.id || ''),
                    ts: obj.ts || Date.now()
                });
            }
        });
        const out = Array.from(map.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
    }

    function humanize(path) {
        if (!path) return '';
        // strip query/hash and extension then convert separators to spaces and title-case
        const n = normalize(path).replace(/[-_.]+/g, ' ');
        return n.split(' ').map(s => s ? s[0].toUpperCase() + s.slice(1) : '').join(' ').trim();
    }

    function recordVisit(href, title) {
        const id = normalize(href || window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || 'home.index.html');
        const entry = {
            id,
            href: href || window.location.pathname,
            title: title || document.title || humanize(href || id),
            ts: Date.now()
        };
        const arr = loadVisited();
        // update or add
        const idx = arr.findIndex(x => x.id === entry.id);
        if (idx >= 0) arr[idx] = entry;
        else arr.push(entry);
        saveVisited(arr);
    }

    // record current page on load
    try {
        recordVisit(window.location.pathname, document.title);
    } catch (e) {
        console.warn('Recording visit failed', e);
    }

    // optimistic recording for internal link clicks (so target appears in tracker even if not visited yet)
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a[href]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href) return;
        // skip external, mailto, anchors, tel
        if (/^(?:https?:|\/\/|mailto:|tel:)/i.test(href) || href.startsWith('#')) return;
        // record clicked href and anchor text
        try {
            recordVisit(href, anchor.textContent && anchor.textContent.trim() ? anchor.textContent.trim() : undefined);
        } catch (err) {
            /* ignore */
        }
    }, true);
})();
