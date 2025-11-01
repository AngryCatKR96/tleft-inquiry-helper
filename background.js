chrome.runtime.onMessage.addListener((request) => {
  console.log("serice worker receive message:", request);

  const tabId = request.tabId;
  switch(request.action) {
    case "EXTRACT_TEST_LINK": {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['extract.js']
      });
      return;
    }
    case "FILL_TEST_CASE": {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['fill.js']
      });
      return;
    }
    case "EXTRACT_TEST_CASE": {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function() {
          window.postMessage({type: 'EXTRACT_TEST_CASE'}, '*'); 
        }
      });
      return;
    }
    case "CREATE_TFT_BINARY_PLAN": {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function() {
          window.postMessage({type: 'CREATE_TFT_BINARY_PLAN'}, '*'); 
        }
      });
      return;
    }
  }
});