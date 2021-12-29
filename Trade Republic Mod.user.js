// ==UserScript==
// @name         Trade Republic Mod
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds Darkmode, Converts $ to € in knockout's and disables auto logout on app.traderepublic.com
// @author       123456687548
// @match        *://app.traderepublic.com/*
// @updateURL    https://github.com/123456687548/TradeRepublicWebMod/raw/master/Trade%20Republic%20Mod.user.js
// @downloadURL  https://github.com/123456687548/TradeRepublicWebMod/raw/master/Trade%20Republic%20Mod.user.js
// @icon         https://www.google.com/s2/favicons?domain=traderepublic.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      http://openexchangerates.github.io/money.js/money.min.js
// @run-at       document-start
// ==/UserScript==

var style;
var noLogoutTimer;
var darkMode = true;
var noLogout = false;

var exchangeAPI = 'https://openexchangerates.org/api/latest.json?app_id=bb5d7092dbae49b3a7be12dd75508b72'

GM_xmlhttpRequest({
    method: "GET",
    url: exchangeAPI,
    responseType: "json",
    onload: processJSON_Response,
    onabort: reportAJAX_Error,
    onerror: reportAJAX_Error,
    ontimeout: reportAJAX_Error
});

function processJSON_Response(data) {
    // Check money.js has finished loading:

    var jsonObj = JSON.parse(data.responseText);

    if (typeof fx !== "undefined" && fx.rates) {
        fx.rates = jsonObj.rates;
        fx.base = jsonObj.base;
    } else {
        // If not, apply to fxSetup global:
        var fxSetup = {
            rates: jsonObj.rates,
            base: jsonObj.base
        }
    }
}

function reportAJAX_Error(rspObj) {
    console.error(`TM scrpt => Error ${rspObj.status}!  ${rspObj.statusText}`);
}

function addDarkMode() {
    style = GM_addStyle(`
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
        --color-chart-text-active-background: #000;
        --color-search-hover-background: #767676;
        --color-search-background: #303030;
        --color-search-foreground: #ffffff;
        --color-search-focused-background: #767676;
        --color-search-drawer-background: #000;
        --color-search-drawer-focused-background: #383838;
        --color-table-column-header-background: #0e0e0e;
        --color-table-column-header: #ffffff;
        --color-table-row-hover: #0e0e0e;
        --color-tag-background: #fff;
    }

    .alertBox.-warning {
        background-color: #310000;
    }

    .-selected .dropdownList__optionName, .dropdownList__optionName.-withDesc {
        color: #000;
    }

    .menuDotsIcon{
        filter: invert(100%);
    }

    .current-time-tick text{
        fill: #fff;
    }

    .autosuggestDrawer__footer {
        background: #000;
    }

    .filterSection__header {
        background-color: #0e0e0e;
    }

    .filtersHeader {
        background-color: var(--color-background);
    }
`);
}

function convertCurrencyToEuro() {
    var overline = document.getElementsByClassName("-overline")[0];

    if (overline === undefined && overline.childElementCount != 5) return;

    var convElements = document.getElementsByClassName("euro");

    var toConvertCurrencyDiv1 = overline.children[2];
    var toConvertCurrencyDiv2 = overline.children[4];
    if (convElements.length < 2) {
        addEuroRow(toConvertCurrencyDiv1);
        addEuroRow(toConvertCurrencyDiv2);
        convElements = document.getElementsByClassName("euro");
    }

    var toConvertCurrencyDD1 = toConvertCurrencyDiv1.children[1];
    var toConvertCurrencyDD2 = toConvertCurrencyDiv2.children[1];

    var dd1Text = toConvertCurrencyDD1.textContent;
    var dd2Text = toConvertCurrencyDD2.textContent;

    var currentCurrency = dd1Text.charAt(dd1Text.length - 1);

    if (currentCurrency !== "$") {
        setConvertedCurrencyText(`Currency ${currentCurrency} not supported`);
        return;
    }

    var dd1Value = dd1Text.replace(" $", "").replace(",", "");
    var dd2Value = dd2Text.replace(" $", "").replace(",", "");

    var converted1 = fx.convert(dd1Value, { from: "USD", to: "EUR" });
    var converted2 = fx.convert(dd2Value, { from: "USD", to: "EUR" });

    convElements[0].textContent = `${converted1} €`;
    convElements[1].textContent = `${converted2} €`;
}

function setConvertedCurrencyText(text) {
    var convElements = document.getElementsByClassName("euro");

    if (convElements.length < 2) return;

    for (var i = 0; i < convElements.length; i++) {
        convElements[i].textContent = text;
    }
}

function addEuroRow(appendTo) {
    var dd = document.createElement("dd");

    dd.className = "euro";

    appendTo.appendChild(dd);
}

function removeDarkMode() {
    if (style !== undefined) {
        style.remove();
    }
}

function toggleDarkMode() {
    if (darkMode) {
        darkMode = false;
        removeDarkMode();
    } else {
        darkMode = true;
        addDarkMode();
    }
}

function enableNoLogout() {
    noLogoutTimer = setInterval(function() {
        localStorage.setItem('lastActivity', Date.now());
    }, 1000);
}

function disableNoLogout() {
    clearInterval(noLogoutTimer);
}

function toggleNoLogout() {
    if (noLogout) {
        noLogout = false;
        disableNoLogout();
    } else {
        noLogout = true;
        enableNoLogout();
    }
}

var addCustomButtonsInterval = setInterval(function() {
    var navigationBar = document.getElementsByClassName("navigation__list");
    if (navigationBar.length == 0) return

    var btnDarkMode = document.createElement('li');
    btnDarkMode.innerHTML = '<input type="checkbox" id="darkModeBtn" name="darkModeBtn" value="darkModeBtn" checked="true"><label for="darkModeBtn" class="navigationItem__link">DarkMode</label>';
    btnDarkMode.classList.add("navigationItem")

    var btnNoLogout = document.createElement('li');
    btnNoLogout.innerHTML = '<input type="checkbox" id="btnNoLogout" name="btnNoLogout" value="btnNoLogout"><label for="btnNoLogout" class="navigationItem__link">No Auto Logout</label>';
    btnNoLogout.classList.add("navigationItem")

    navigationBar[0].appendChild(btnDarkMode);
    navigationBar[0].appendChild(btnNoLogout);

    document.getElementById("darkModeBtn").addEventListener(
        "click", toggleDarkMode, false
    );

    document.getElementById("btnNoLogout").addEventListener(
        "click", toggleNoLogout, false
    );

    clearInterval(addCustomButtonsInterval);
}, 1000);

if (darkMode) {
    addDarkMode();
}

setInterval(function() {
    convertCurrencyToEuro();
}, 1000);

console.log("loaded Trade Republic mod by 123456687548")