const body = document.querySelector('body');

const handleTheme = () => {
    let theme = localStorage.getItem('theme');
    if (!theme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
        theme = prefersDark ? 'dark' : 'light';
    }
    if (theme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    }
};

const toggleTheme = () => {
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
    }
};

window.addEventListener('DOMContentLoaded', handleTheme);