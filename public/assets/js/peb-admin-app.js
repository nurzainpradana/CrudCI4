'use strict';

(() => {
    const content = document.querySelector('#content');
    const sidebar = document.querySelector('#sidebar');
    const menu = document.querySelector('#menu-toggle');
    const date = document.querySelector('#today');
    const pages = { users: 'Pengguna', master: 'Master Data PEB' };
    const paths = {
        users: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v3"/>',
        master: '<path d="M4 4h16v16H4zM4 10h16M10 4v16"/>'
    };
    function render() {
        const requested = location.hash.slice(1);
        const selected = Object.hasOwn(pages, requested) ? requested : 'users';
        document.title = `${pages[selected]} · Admin Fast-PEB`;
        document.querySelector('#navigation').innerHTML = Object.entries(pages).map(([key, title]) => `<a href="#${key}" ${selected === key ? 'aria-current="page"' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${paths[key]}</svg><span>${title}</span></a>`).join('');
        const host = document.createElement('div');
        content.replaceChildren(host);
        window.PebAdmin.mount(host, selected);
        const actions = document.createElement('div');
        actions.className = 'heading-actions';
        actions.append(date);
        host.querySelector('.page-heading').append(actions);
        sidebar.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
    }
    menu.addEventListener('click', () => menu.setAttribute('aria-expanded', String(sidebar.classList.toggle('open'))));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            menu.setAttribute('aria-expanded', 'false');
            menu.focus();
        }
    });
    document.querySelector('.skip').addEventListener('click', event => { event.preventDefault(); content.focus(); });
    const today = new Date();
    date.dateTime = today.toLocaleDateString('sv-SE');
    date.textContent = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    window.addEventListener('hashchange', render);
    render();
})();
