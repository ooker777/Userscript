// ==UserScript==
// @name        No distraction on Facebook, Messenger, YouTube, Quora and Google
// @namespace   https://zachsaucier.com/
// @author      Zach Saucier
// @match       *://*/*
// @version     1
// @description Remove flashing title, notification count and other distracting elements when using them for work
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    // Set our list of sites and elements to block
    var blockList = [
        "www.youtube.com###watch7-sidebar-contents",
        "www.youtube.com##.yt-masthead-logo-container",
        "www.facebook.com##._1uh-:nth-of-type(2)",
        "www.facebook.com##._2t-e > ._4kny:nth-of-type(1)",
        "www.facebook.com##._1uh-:nth-of-type(1)",
        "www.facebook.com##._50tj._2t-a",
        "www.facebook.com##._50ti._2s1y._5rmj._26aw._2t-a",
        "www.facebook.com###u_0_0",
        "www.facebook.com###fbDockChatBuddylistNub > .fbNubButton"
        "www.google.com/logos/doodles/$image"
        "www.google.com##.gb_T.gb_eg.gb_R.gb_fg.gb_ib"
        "www.quora.com##[id *= "_header"]"
        "www.quora.com##[id $= "_header"]"
        "www.quora.com##[id $= "_expanded"]"
    ];

    // Get the window's hostname
    var windowHostname = window.location.hostname;

    // Iterate through the blocklist, hiding elements as needed
    for(var i = 0; i < blockList.length; i++) {
        var entryParts = blockList[i].split('##');

        // Compare the hostnames; Only remove elements if they match
        if(windowHostname === entryParts[0]) {
            // Find the elements if they exists
            var matchedElements = document.querySelectorAll(entryParts[1]);

            // Actually remove the element(s) that match
            for(var j = 0; j < matchedElements.length; j++) {
                var matchedElem = matchedElements[j];

                matchedElem.parentNode.removeChild(matchedElem);
            }
        }
    }
})();

//Remove flashing title
function titleModified() {
  var text = document.getElementsByTagName('title')[0].text;
  if (text != 'Messenger') {
    document.getElementsByTagName('title')[0].text = 'Messenger';
  }
}

window.onload = function() {
  var titleEl = document.getElementsByTagName("title")[0];
  var docEl = document.documentElement;

  if (docEl && docEl.addEventListener) {
    docEl.addEventListener("DOMSubtreeModified", function(evt) {
      var t = evt.target;
      if (t === titleEl || (t.parentNode && t.parentNode === titleEl)) {
        titleModified();
      }
    }, false);
  } else {
    document.onpropertychange = function() {
      if (window.event.propertyName == "title") {
        titleModified();
      }
    };
  }
};

// Remove the notification in the page title
function removeTitleNotification() {
    if(document.head.querySelector("title").innerText.indexOf(')') != -1)
        document.head.querySelector("title").innerText = document.head.querySelector("title").innerText.split(')')[1];
}
removeTitleNotification();

var observeDOM = (function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback) {
        if(MutationObserver) {
            // Define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if(mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // Have the observer observe foo for changes in children
            obs.observe(obj, {childList: true, subtree: true});
        }
        else if(eventListenerSupported ) {
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();

// Observe a specific DOM element:
observeDOM(document.head.querySelector("title"), function() { 
    removeTitleNotification();
});