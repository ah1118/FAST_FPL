function doPost(e) {
  try {
    const body = e.postData && e.postData.contents ? e.postData.contents : "{}";
    const p = JSON.parse(body);

    if (p.action !== "update_k17_q17") {
      return out_({ ok: false, error: "Bad action" });
    }

    const spreadsheetId = p.spreadsheetId;
    const range = p.range; // "K17:Q17"
    const values = p.values; // [ ["1","2","3","4","5","6","-"] ]

    if (!spreadsheetId) return out_({ ok:false, error:"Missing spreadsheetId" });
    if (!range) return out_({ ok:false, error:"Missing range" });

    // basic validation
    const row = (values && values[0]) ? values[0] : [];
    if (row.length !== 7) return out_({ ok:false, error:"K17:Q17 needs 7 values" });

    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sh = ss.getSheets()[0]; // first tab
    sh.getRange(range).setValues(values);

    return out_({ ok: true });
  } catch (err) {
    return out_({ ok:false, error: String(err && err.message ? err.message : err) });
  }
}

function out_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
