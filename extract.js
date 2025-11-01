async function getSourceData() {
 try {
   console.log('Finding frames...');
   
   // 프레임 접근
   const mainFrame = document.querySelector('frame[name="mainframe"]');
   const mainDoc = await new Promise((resolve) => {
     if (mainFrame.contentDocument.readyState === 'complete') {
       resolve(mainFrame.contentDocument);
     } else {
       mainFrame.onload = () => resolve(mainFrame.contentDocument);
     }
   });

   const workFrame = mainDoc.querySelector('frame[name="workframe"]');
   const frameDoc = await new Promise((resolve) => {
     if (workFrame.contentDocument.readyState === 'complete') {
       resolve(workFrame.contentDocument);
     } else {
       workFrame.onload = () => resolve(workFrame.contentDocument);
     }
   });

   console.log('Frames found, extracting data...');

   const data = {
     title: frameDoc.querySelector('h2')?.textContent.trim() || '',
     imsNo: (() => {
       const rows = frameDoc.querySelectorAll('.custom_field_container table tr');
       for (const row of rows) {
         if (row.textContent.includes('IMS No.')) {
           return row.querySelector('td:last-child')?.textContent.trim() || '';
         }
       }
       return '';
     })(),
     environment: (() => {
       const rows = frameDoc.querySelectorAll('.custom_field_container table tr');
       for (const row of rows) {
         if (row.textContent.includes('테스트환경:')) {
           return row.querySelector('td:last-child')?.textContent.trim() || '';
         }
       }
       return '';
     })(),
     runtime: (() => {
       const rows = frameDoc.querySelectorAll('.custom_field_container table tr');
       for (const row of rows) {
         if (row.textContent.includes('수행시간')) {
           return row.querySelector('td:last-child')?.textContent.trim() || '';
         }
       }
       return '';
     })(),
     summary: (() => {
       // pre 태그를 포함하는 td 태그 찾기
       const tdWithPre = frameDoc.querySelector('td pre');
       let summaryContent = tdWithPre ? tdWithPre.innerHTML : '';

       // 못 찾았다면 모든 colspan=6인 td 태그들 중에서 pre 태그를 포함하는 것 찾기
       if (!summaryContent) {
         const allColspan6Tds = frameDoc.querySelectorAll('td[colspan="6"]');
         for (const td of allColspan6Tds) {
           if (td.querySelector('pre')) {
             summaryContent = td.querySelector('pre').innerHTML;
             break;
           }
         }
       }

       function getTextBetweenTags(text, startTag, endTag) {
         if (!text) return '';
         
         // HTML 엔티티 처리
         text = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
         text = text.replace(/&amp;/g, '&');
         
         const startIndex = text.indexOf(startTag);
         if (startIndex === -1) return '';
         
         const textFromStart = text.substring(startIndex + startTag.length);
         const endIndex = endTag ? textFromStart.indexOf(endTag) : undefined;
         
         let result = endIndex === -1 || !endTag ? 
                     textFromStart : 
                     textFromStart.substring(0, endIndex);
         return result.trim();
       }

       console.log('Found summary content:', summaryContent);

       const summary = {
         현상: getTextBetweenTags(summaryContent, '<현상>', '<원인>'),
         원인: getTextBetweenTags(summaryContent, '<원인>', '<조치>'),
         조치: getTextBetweenTags(summaryContent, '<조치>', null)
       };

       console.log('Parsed summary:', summary);

       return summary;
     })(),
     preconditions: frameDoc.evaluate(
       "//tr[th[contains(text(), 'Preconditions')]]/following-sibling::tr[1]/td",
       frameDoc,
       null,
       XPathResult.FIRST_ORDERED_NODE_TYPE,
       null
     ).singleNodeValue?.textContent.trim() || '',
     steps: Array.from(frameDoc.querySelectorAll('tr[id^="step_row_"]'))
       .filter((row, index, self) => self.findIndex(r => r.id === row.id) === index)
       .map(row => ({
         action: row.querySelector('td:nth-child(2)')?.textContent.trim() || '',
         result: row.querySelector('td:nth-child(3)')?.textContent.trim() || ''
       }))
   };

   console.log('Extracted data:', data);

   chrome.storage.local.set({ testCaseData: data }, () => {
     alert('데이터가 성공적으로 추출되었습니다.');
   });

 } catch (error) {
   console.error('Error:', error);
   alert('데이터 추출 중 오류가 발생했습니다.');
 }
}

getSourceData();
