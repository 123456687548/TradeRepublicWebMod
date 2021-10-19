// ==UserScript==
// @name         Trade Republic Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds Darkmode and disables auto logout on app.traderepublic.com
// @author       123456687548
// @match        *://app.traderepublic.com/*
// @icon         https://www.google.com/s2/favicons?domain=traderepublic.com
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
    :root {
        --color-background: #000;
        --color-text-primary: #fff;
        --color-text-secondary: #ffffff;
        --color-tag-text: #000;
        --color-banner-nav-link: #ffffff;
        --color-banner-nav-focus: #fff;
        --color-banner-nav-active: #fff;
        --color-dropdown-list-text: #000000;
        --color-dropdown-list-text-disabled: #505050;
        --color-list-item-background-hover: #333333;
        --color-button-secondary-background-hover: #444444;
        --color-chart-text: #ffffff;
        --color-chart-text-active: #ffffff;
        --color-chart-reference-label-background: #000000;
        --color-chart-label-border: #fff;
        --color-chart-positive-performance-background: #000000;
        --color-chart-negative-performance-background: #000000;
        --color-tab-active: #fff;
        --color-tab-default: #95a0a6;
        --color-description-title: #ffffff;
        --color-disclaimer-text: #ffffff;
        --color-side-modal-background: #000;
        --color-side-modal-heading: #fff;
        --color-code-input-background: #333333;
        --color-pin-input-background: #525252;
        --color-content-overlay: hsl(0deg 0% 0% / 60%);
    }

    .alertBox.-warning {
        background-color: #310000;
    }

    .-selected .dropdownList__optionName, .dropdownList__optionName.-withDesc {
        color: #000;
    }

    .menuDotsIcon{
        filter: invert(100%)
    }
`);

setInterval(function() {
    localStorage.setItem('lastActivity', Date.now());
}, 20);