document.getElementById('extractBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.runtime.sendMessage({ action: "EXTRACT_TEST_LINK", tabId: tabId });
    window.close();
  });
});

document.getElementById('fillBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.runtime.sendMessage({ action: "FILL_TEST_CASE", tabId: tabId });
    window.close();
  });
});

document.getElementById('extractTestCaseBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    console.log(tabId);
    chrome.runtime.sendMessage({ action: "EXTRACT_TEST_CASE", tabId: tabId });
    window.close();
  });
});

document.getElementById('btn-create-all-plan').addEventListener('click', ()=>{
  const userResponse = window.confirm("안녕하세요. 작업을 진행하기 전에 다음 사항을 꼭 확인해주세요:\n\n" +
  "1. 빌드 버전과 제목은 입력과 상관없이 5가지 바이너리에서 각각 따로 생성되므로, 이 부분은 신경 쓰지 않으셔도 됩니다.\n" +
  "2. 데이터 입력 내용이 정확한지 다시 한 번 확인해주세요.\n" +
  "3. 생성 작업을 진행하시려면 '확인' 버튼을 눌러주세요.\n\n" +
  "위 사항을 확인하셨다면, 생성 작업을 진행하시겠습니까?");

  if(userResponse) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.runtime.sendMessage({ action: "CREATE_TFT_BINARY_PLAN", tabId: tabId });
      window.close();
    });
  }
});
