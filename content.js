const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.bundle.js');
document.documentElement.appendChild(script);
script.onload = () => script.remove();