var elements = document.getElementsByTagName('link');
var feeds = Array.prototype.filter.call(elements, function (link) {
  return link.rel === 'alternate' && (link.type === 'application/rss+xml'
        || link.type === 'application/atom+xml');
}).map(function (link) {
  return link.href;
});

if (feeds.length > 0) {
  chrome.runtime.sendMessage({ type: 'feeds', data: { feeds: feeds } });
}

// vim: et ts=2 sw=2
