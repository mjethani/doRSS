var defaultReader = 'feedly';

var subscriptionUrls = {
  'feedly': 'https://feedly.com/i/subscription/feed/:feedId',
  'inoreader': 'https://www.inoreader.com/feed/:feedId',
};

var options = null;

var map = {};

function getSubscriptionUrl(url) {
  var template = options && subscriptionUrls[options.reader];
  if (template) {
    return template.replace(/:feedId/, url);
  } else {
    return url;
  }
}

chrome.runtime.onMessage.addListener(function (message, sender) {
  if (sender.id !== chrome.runtime.id) {
    return;
  }

  if (message.type === 'feeds') {
    map[sender.tab.id] = message.data;

    chrome.pageAction.show(sender.tab.id);

  } else if (message.type === 'options') {
    options = message.data;
  }
});

chrome.pageAction.onClicked.addListener(function (tab) {
  chrome.tabs.update(tab.id, {
    url: getSubscriptionUrl(map[tab.id].feeds[0])
  });
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
  var tabId = details.tabId;

  var info = map[tabId];

  if (info) {
    delete map[tabId];

    var url = details.url;

    if (info.feeds && info.feeds.indexOf(url) !== -1) {
      return {
        redirectUrl: getSubscriptionUrl(url)
      };
    }
  }
},
{
  urls:  [ '<all_urls>' ],
  types: [ 'main_frame' ]
},
[
  'blocking'
]
);

chrome.storage.sync.get({
  reader: defaultReader,
}, function (items) {
  options = items;
});

// vim: et ts=2 sw=2
