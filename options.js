function saveOptions() {
  var reader = document.getElementById('reader').value;
  chrome.storage.sync.set({
    reader: reader
  }, function () {
    chrome.runtime.sendMessage({ type: 'options', data: { reader: reader } });
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    reader: chrome.extension.getBackgroundPage().defaultReader,
  }, function (items) {
    document.getElementById('reader').value = items.reader;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('reader').addEventListener('change',
    saveOptions);

// vim: et ts=2 sw=2
