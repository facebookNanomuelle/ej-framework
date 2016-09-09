/*global navigator, screen, window, document */
var bw = {
    os: {},
    agent: navigator.userAgent.toLowerCase(),
    scrWidth: screen.width,
    scrHeight: screen.height,
    // The document.documentElement dimensions seem to be identical to
    // the screen dimensions on all the mobile browsers I've tested so far
    elemWidth: document.documentElement.clientWidth,
    elemHeight: document.documentElement.clientHeight,
    // We need to eliminate Symbian, Series 60, Windows Mobile and Blackberry
    // browsers for this quick and dirty check. This can be done with the user agent.
    otherBrowser: null,
    // If the screen orientation is defined we are in a modern mobile OS
    mobileOS: typeof window.orientation !== 'undefined' ? true : false,
    // If touch events are defined we are in a modern touch screen OS
//    touchOS: ('ontouchstart' in document.documentElement) ? true : false,
    touchOS: document.documentElement.hasOwnProperty('ontouchstart') ? true : false,
    // iPhone and iPad can be reliably identified with the navigator.platform
    // string, which is currently only available on these devices.
    iOS: (navigator.platform.indexOf("iPod") !== -1) ||
        (navigator.platform.indexOf("iPhone") !== -1) ||
        (navigator.platform.indexOf("iPad") !== -1) ? true : false,
    // If the user agent string contains "android" then it's Android. If it
    // doesn't but it's not another browser, not an iOS device and we're in
    // a mobile and touch OS then we can be 99% certain that it's Android.
    android: null,
    orientation: window.orientation,
    platform: navigator.platform,

    init: function () {
        'use strict';

        this.otherBrowser = (this.agent.indexOf("series60") !== -1) ||
            (this.agent.indexOf("symbian") !== -1) ||
            (this.agent.indexOf("windows ce") !== -1) ||
            (this.agent.indexOf("blackberry") !== -1);

        this.android = (this.agent.indexOf("android") !== -1) ||
            (!this.iOS && !this.otherBrowser && this.touchOS && this.mobileOS) ? true : false;
    },

    showAll: function () {
        'use strict';

        document.write("<p><b>Screen width:</b> " + this.scrWidth + "px<br />" +
            "<b>Screen height:</b> " + this.scrHeight + "px<br />" +
            "<b>Document element width:</b> " + this.elemWidth + "px<br />" +
            "<b>Document element height:</b> " + this.elemHeight + "px<br />" +
            "<b>iOS device:</b> " + this.iOS + "<br />" +
            "<b>Mobile OS:</b> " + this.mobileOS + "<br />" +
            "<b>Touch OS:</b> " + this.touchOS + "<br />" +
            "<b>Android device:</b> " + this.android + "</p>" +
            "<p><b>User agent string:</b> " + navigator.userAgent + "</p>" +
            "<p><b>Window.orientation:</b> " + window.orientation + "</p>" +
            "<p><b>Navigator.platform:</b> " + this.platform + "</p>"  // win,mac,linux,ipad
            );
    }
};
bw.init();
