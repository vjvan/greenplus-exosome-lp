// Google Apps Script - 貼到 Google Sheet 的 Apps Script 編輯器中
// 擴充功能 > Apps Script > 貼上 > 部署 > 新增部署 > 網頁應用程式

// 項目對照表（英文值 → 中文顯示）
const INTEREST_MAP = {
  'exosome-facial': '外泌體臉部修護體驗',
  'post-treatment': '醫美術後修護諮詢',
  'anti-aging': '抗老緊緻方案',
  'sensitive': '敏感肌修護方案',
  'product': '產品購買諮詢',
  'other': '其他'
};

const TIME_MAP = {
  'morning': '上午 (10:00-12:00)',
  'afternoon': '下午 (14:00-17:00)',
  'evening': '晚上 (19:00-21:00)',
  '': '不限'
};

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // 轉換時間戳記為台灣時間
    var now = new Date();
    var timestamp = Utilities.formatDate(now, 'Asia/Taipei', 'yyyy-MM-dd HH:mm:ss');

    // 轉換英文值為中文
    var interest = INTEREST_MAP[data.interest] || data.interest || '';
    var contactTime = TIME_MAP[data.contact_time] || data.contact_time || '不限';

    // 寫入一列
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.phone || '',
      data.line_id || '',
      interest,
      data.skin_concern || '',
      contactTime
    ]);

    // 回傳成功
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 處理 CORS preflight（OPTIONS 請求）
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: '加格霖外泌體預約表單 API' }))
    .setMimeType(ContentService.MimeType.JSON);
}
