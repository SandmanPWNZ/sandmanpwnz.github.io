'use strict';

import App from './app';

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function (event) {
        App.init();
    })
} else {
    App.init();
}