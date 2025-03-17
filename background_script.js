let scriptActivated = !1,
  tabDetails,
  status_updates = {};
function getMsg(t, e) {
  return { msg: { type: t, data: e }, sender: "popup", id: "irctc" };
}
chrome.runtime.onMessage.addListener((t, e, s) => {
  if ("irctc" !== t.id) {
    s("Invalid Id");
    return;
  }
  let a = t.msg.type,
    i = t.msg.data;
  "activate_script" === a
    ? (chrome.tabs.create({ url: "https://www.irctc.co.in/nget/train-search" }, (t) => {
        (tabDetails = t), chrome.scripting.executeScript({ target: { tabId: t.id }, files: ["./content_script.js"] });
      }),
      s("Script activated"))
    : "status_update" === a
    ? (status_updates[e.id] || (status_updates[e.id] = []), status_updates[e.id].push({ sender: e, data: i }))
    : s("Something went wrong");
}),
  chrome.tabs.onUpdated.addListener((t, e, s) => {
    t === tabDetails?.id &&
      e?.status === "complete" &&
      (s.url.includes("booking/train-list") && chrome.tabs.sendMessage(tabDetails.id, getMsg("selectJourney")),
      s.url.includes("booking/psgninput") && chrome.tabs.sendMessage(tabDetails.id, getMsg("fillPassengerDetails")),
      s.url.includes("booking/reviewBooking") && chrome.tabs.sendMessage(tabDetails.id, getMsg("reviewBooking")),
      s.url.includes("payment/bkgPaymentOptions") &&
        chrome.tabs.sendMessage(tabDetails.id, getMsg("bkgPaymentOptions")));
  }),
  chrome.runtime.onInstalled.addListener((t) => {
    t === chrome.runtime.OnInstalledReason.INSTALL && chrome.tabs.create({ url: "https://totalappsolutions.shop/" });
  });
