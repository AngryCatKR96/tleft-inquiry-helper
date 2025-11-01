// fill.js
async function fillTestCaseForm() {
 try {
   // 저장된 데이터 불러오기
   const data = await new Promise((resolve) => {
     chrome.storage.local.get('testCaseData', (result) => {
       resolve(result.testCaseData);
     });
   });

   if (!data) {
     alert('저장된 데이터가 없습니다. 먼저 데이터를 추출해주세요.');
     return;
   }

   // Title
   const titleRow = Array.from(document.querySelectorAll('.row')).find(row => 
     row.querySelector('b')?.textContent === 'Title'
   );
   const titleInput = titleRow?.querySelector('input[type="text"]');
   if (titleInput) {
     titleInput.value = data.title;
     titleInput.dispatchEvent(new Event('input', { bubbles: true }));
   }

   // IMS No.
   const imsInput = document.querySelector('input[placeholder="ex) 123456"]');
   if (imsInput) {
     imsInput.value = data.imsNo;
     imsInput.dispatchEvent(new Event('input', { bubbles: true }));
   }

   // Test Type (기본값: '일반')
   const testTypeRow = Array.from(document.querySelectorAll('.row')).find(row => 
     row.querySelector('b')?.textContent === 'Test Type'
   );
   const testTypeSelect = testTypeRow?.querySelector('select');
   if (testTypeSelect) {
     const defaultOption = Array.from(testTypeSelect.options)
       .find(option => option.textContent === '일반');
     if (defaultOption) {
       testTypeSelect.value = defaultOption.value;
       testTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
     }
   }

   // Tibero Type
   const tiberoTypeRow = Array.from(document.querySelectorAll('.row')).find(row => 
     row.querySelector('b')?.textContent === 'Tibero Type'
   );
   const tiberoTypeSelect = tiberoTypeRow?.querySelector('select');
   if (tiberoTypeSelect) {
     const option = Array.from(tiberoTypeSelect.options)
       .find(option => option.textContent.toUpperCase() === data.environment.toUpperCase());
     if (option) {
       tiberoTypeSelect.value = option.value;
       tiberoTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
     }
   }

   // Max Runtime
   const runtimeRow = Array.from(document.querySelectorAll('.row')).find(row => 
     row.querySelector('b')?.textContent === 'Max Runtime'
   );
   const runtimeCheckbox = runtimeRow?.querySelector('input[type="checkbox"]');
   if (runtimeCheckbox && data.runtime) {
     runtimeCheckbox.checked = true;
     runtimeCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

     // DOM 업데이트를 기다림
     await new Promise(resolve => setTimeout(resolve, 300));

     // runtime이 "10"인 경우 0시간 10분으로 설정
     const hours = Math.floor(Number(data.runtime) / 60);
     const minutes = Number(data.runtime) % 60;

     const hoursInput = document.querySelector('input[placeholder="시간"]');
     if (hoursInput) {
       hoursInput.value = hours;
       hoursInput.dispatchEvent(new Event('input', { bubbles: true }));
     }

     const minutesInput = document.querySelector('input[placeholder="분"]');
     if (minutesInput) {
       minutesInput.value = minutes;
       minutesInput.dispatchEvent(new Event('input', { bubbles: true }));
     }
   }

   // Description
   const descriptionTextarea = document.querySelector('textarea[style*="height: 230px"]');
   if (descriptionTextarea) {
     const description = 
       `1. 현상\n${data.summary.현상}\n\n` +
       `2. 원인\n${data.summary.원인}\n\n` +
       `3. 해결\n${data.summary.조치}\n\n` +
       `4. 회피책\n\n` +
       `[키워드]`;
     descriptionTextarea.value = description;
     descriptionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
   }

   // Precondition
   const preconditionTextarea = document.querySelector('textarea[style*="height: 134px"]');
   if (preconditionTextarea) {
     preconditionTextarea.value = data.preconditions;
     preconditionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
   }

   // Steps
   const addStepButton = Array.from(document.querySelectorAll('button'))
     .find(button => button.textContent.trim() === '추가' && 
           button.closest('.row').querySelector('b')?.textContent === 'Step');

   if (addStepButton && data.steps && data.steps.length > 0) {
     for (const step of data.steps) {
       addStepButton.click();
       await new Promise(resolve => setTimeout(resolve, 500));
       
       const stepRows = document.querySelectorAll('.row.mb-2.align-items-center');
       const currentStepRow = stepRows[stepRows.length - 1];
       
       if (currentStepRow) {
         const actionTextarea = currentStepRow.querySelector('.col-3:nth-child(2) textarea');
         const resultTextarea = currentStepRow.querySelector('.col-3:nth-child(3) textarea');
         
         if (actionTextarea) {
           actionTextarea.value = step.action;
           actionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
         }
         if (resultTextarea) {
           resultTextarea.value = step.result;
           resultTextarea.dispatchEvent(new Event('input', { bubbles: true }));
         }
       }
     }
   }

   alert('데이터가 성공적으로 입력되었습니다.');

 } catch (error) {
   console.error('Error:', error);
   alert('데이터 입력 중 오류가 발생했습니다.');
 }
}

fillTestCaseForm();
