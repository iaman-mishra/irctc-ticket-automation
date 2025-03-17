let user_data = {};
function getMsg(e, t) {
  return { msg: { type: e, data: t }, sender: "content_script", id: "irctc" };
}
function statusUpdate(e) {
  chrome.runtime.sendMessage(
    getMsg("status_update", {
      status: e,
      time: new Date().toString().split(" ")[4],
    })
  );
}
function classTranslator(e) {
  return (labletext =
    "1A" === e
      ? "AC First Class (1A)"
      : "EV" === e
      ? "Vistadome AC (EV)"
      : "EC" === e
      ? "Exec. Chair Car (EC)"
      : "2A" === e
      ? "AC 2 Tier (2A)"
      : "3A" === e
      ? "AC 3 Tier (3A)"
      : "3E" === e
      ? "AC 3 Economy (3E)"
      : "CC" === e
      ? "AC Chair car (CC)"
      : "SL" === e
      ? "Sleeper (SL)"
      : "2S" === e
      ? "Second Sitting (2S)"
      : "None");
}
function quotaTranslator(e) {
  return (
    "GN" === e
      ? (labletext = "GENERAL")
      : "TQ" === e
      ? (labletext = "TATKAL")
      : "PT" === e
      ? (labletext = "PREMIUM TATKAL")
      : labletext,
    labletext
  );
}
function addDelay(e) {
  let t = Date.now(),
    r = null;
  do r = Date.now();
  while (r - t < e);
}
chrome.runtime.onMessage.addListener((e, t, r) => {
  if ("irctc" !== e.id) {
    r("Invalid Id");
    return;
  }
  let l = e.msg.type;
  if ("selectJourney" === l) {
    console.log("selectJourney"),
      (popupbtn = document.querySelectorAll(".btn.btn-primary")).length > 0 &&
        (popupbtn[1].click(), console.log("Close last trxn popup"));
    let n = document.querySelector("#divMain > div > app-train-list"),
      o = [...n.querySelectorAll(".tbis-div app-train-avl-enq")];
    console.log(user_data.journey_details["train-no"]);
    let s = user_data.journey_details["train-no"],
      c = o.filter((e) => e.querySelector("div.train-heading").innerText.trim().includes(s.split("-")[0]))[0];
    if ("M" === user_data.travel_preferences.AvailabilityCheck) {
      alert("Please manually select train and click Book");
      return;
    }
    if (
      "A" === user_data.travel_preferences.AvailabilityCheck ||
      "I" === user_data.travel_preferences.AvailabilityCheck
    ) {
      if (!c) {
        console.log("Precheck - Train not found for search criteria."),
          alert(
            "Precheck - Train(" +
              s +
              ") not found for search criteria. You can manually proceed or correct data and restart the process."
          );
        return;
      }
      let d = classTranslator(user_data.journey_details.class);
      if (
        ![...c.querySelectorAll("table tr td div.pre-avl")].filter((e) => e.querySelector("div").innerText === d)[0]
      ) {
        console.log("Precheck - Selected Class not available in the train."),
          alert(
            "Precheck - Selected Class not available in the train. You can manually proceed or correct data and restart the process."
          );
        return;
      }
    }
    let u = document.querySelector("div.row.col-sm-12.h_head1 > span > strong");
    if ("A" === user_data.travel_preferences.AvailabilityCheck) {
      if (
        (console.log("Automatically click"),
        "TQ" === user_data.journey_details.quota ||
          "PT" === user_data.journey_details.quota ||
          "GN" === user_data.journey_details.quota)
      ) {
        console.log("Verify tatkal time");
        let p = user_data.journey_details.class;
        (requiredTime = "00:00:00"),
          (current_time = "00:00:00"),
          (requiredTime = ["1A", "2A", "3A", "CC", "EC", "3E"].includes(p.toUpperCase())
            ? user_data.other_preferences.acbooktime
            : user_data.other_preferences.slbooktime),
          "GN" === user_data.journey_details.quota && (requiredTime = user_data.other_preferences.gnbooktime),
          console.log("requiredTime", requiredTime);
        var g = 0;
        let h = new MutationObserver((e) => {
          if (
            ((current_time = new Date().toString().split(" ")[4]),
            console.log("current_time", current_time),
            current_time > requiredTime)
          )
            h.disconnect(), selectJourney();
          else {
            if (0 == g) {
              console.log("Inside wait counter 0 ");
              try {
                let t = document.createElement("div");
                (t.textContent = "Please wait..Booking will automatically start at " + requiredTime),
                  (t.style.textAlign = "center"),
                  (t.style.color = "white"),
                  (t.style.height = "auto"),
                  (t.style.fontSize = "20px");
                let r = document.querySelector("#divMain > div > app-train-list > div> div > div > div.clearfix");
                r.insertAdjacentElement("afterend", t);
              } catch (l) {
                console.log("wait time failed", l.message);
              }
            }
            try {
              g % 2 == 0
                ? (console.log("counter1", g % 2),
                  (document.querySelector(
                    "#divMain > div > app-train-list > div > div > div > div:nth-child(2)"
                  ).style.background = "green"))
                : (console.log("counter2", g % 2),
                  (document.querySelector(
                    "#divMain > div > app-train-list > div > div > div > div:nth-child(2)"
                  ).style.background = "red"));
            } catch (n) {}
            (g += 1), console.log("wait time");
          }
        });
        h.observe(u, { childList: !0, subtree: !0, characterDataOldValue: !0 });
      } else console.log("select journey GENERAL quota"), selectJourney();
    } else
      "I" === user_data.travel_preferences.AvailabilityCheck && (console.log("Immediately click"), selectJourney());
  } else if ("fillPassengerDetails" === l) console.log("fillPassengerDetails"), fillPassengerDetails();
  else if ("reviewBooking" === l) {
    console.log("reviewBooking");
    try {
      console.log("User has an active plan.");
    } catch (err) {
      console.error("Error:", err);
    }
    if (void 0 !== user_data.other_preferences.autoCaptcha && user_data.other_preferences.autoCaptcha)
      setTimeout(() => {
        getCaptchaTC();
      }, 500);
    else {
      console.log("Manuall captcha filling");
      let f = "X",
        m = document.querySelector("#captcha");
      (m.value = f), m.dispatchEvent(new Event("input")), m.dispatchEvent(new Event("change")), m.focus();
    }
  } else if ("bkgPaymentOptions" === l) {
    addDelay(200), console.log("bkgPaymentOptions");
    let b = "Multiple Payment Service",
      $ = "Credit & Debit cards / Net Banking / Wallet / UPI (Powered by Paytm)";
    if (
      (console.log(""),
      void 0 !== user_data.vpa.vpa &&
        user_data.vpa.vpa.includes("@") &&
        "UPIID" == user_data.other_preferences.paymentmethod)
    ) {
      b = "Multiple Payment Service";
      let S = window.navigator.userAgent;
      console.log("BrowserUserAgent", S),
        S.includes("Android")
          ? (console.log("Android browser"), ($ = "Credit & Debit cards / Wallet / UPI (Powered by PhonePe)"))
          : (console.log("Big screen browser"),
            ($ = "Credit & Debit cards / Net Banking / Wallet / UPI (Powered by Paytm)")),
        console.log("VPA");
    } else
      "IRCWA" == user_data.other_preferences.paymentmethod
        ? ((b = "IRCTC eWallet"), ($ = "IRCTC eWallet"), console.log("irctc wallet"))
        : ("DBTCRD" == user_data.other_preferences.paymentmethod ||
            "DBTCRDI" == user_data.other_preferences.paymentmethod) &&
          ((b = "Payment Gateway / Credit Card / Debit Card"),
          ($ = "Visa/Master Card(Powered By HDFC BANK)"),
          console.log("hdfc card"));
    let C = $.replace("&", "&amp;");
    var w = setInterval(() => {
      if (document.getElementsByClassName("bank-type").length > 1) {
        clearInterval(w);
        var e = document.getElementById("pay-type").getElementsByTagName("div");
        for (i = 0; i < e.length; i++)
          e[i].innerText.indexOf(b) >= 0 &&
            (e[i].click(),
            setTimeout(() => {
              var e = document.getElementsByClassName("border-all no-pad");
              for (i = 0; i < e.length; i++)
                0 != e[i].getBoundingClientRect().top &&
                  -1 != e[i].getElementsByTagName("span")[0].innerHTML.toUpperCase().indexOf(C.toUpperCase()) &&
                  (e[i].click(),
                  setTimeout(() => {
                    document.getElementsByClassName("btn-primary")[0].click();
                  }, 500));
            }, 500));
      }
    }, 500);
  } else console.log("Nothing to do");
  r("Something went wrong");
});
let captchaRetry = 0;
function getCaptcha() {
  if (captchaRetry < 100) {
    console.log("getCaptcha"), (captchaRetry += 1);
    let e = document.querySelector(".captcha-img");
    if (e) {
      let t = new XMLHttpRequest(),
        r = e.src,
        l = r.substr(22),
        n = JSON.stringify({
          requests: [
            {
              image: { content: l },
              features: [{ type: "TEXT_DETECTION" }],
              imageContext: { languageHints: ["en"] },
            },
          ],
        });
      user_data.other_preferences.projectId,
        t.open(
          "POST",
          "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDnvpf2Tusn2Cp2icvUjGBBbfn_tY86QgQ",
          !1
        ),
        (t.onload = function () {
          if (200 != t.status) console.log(`Error ${t.status}: ${t.statusText}`), console.log(t.response);
          else {
            let e = "",
              r = document.querySelector("#captcha"),
              l = JSON.parse(t.response);
            (e = l.responses[0].fullTextAnnotation.text), console.log("Org text", e);
            let n = Array.from(e.split(" ").join("").replace(")", "J").replace("]", "J")),
              o = "";
            for (let s of n) "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=@".includes(s) && (o += s);
            (r.value = o),
              "" == e &&
                (console.log("Null captcha text from api"),
                document.getElementsByClassName("glyphicon glyphicon-repeat")[0].parentElement.click(),
                setTimeout(() => {
                  getCaptcha();
                }, 500)),
              r.dispatchEvent(new Event("input")),
              r.dispatchEvent(new Event("change")),
              r.focus();
            let c = document.querySelector("app-login"),
              d = document.querySelector("#divMain > div > app-review-booking > p-toast"),
              u = new MutationObserver((e) => {
                c &&
                  c.innerText.toLowerCase().includes("valid captcha") &&
                  (setTimeout(() => {
                    getCaptcha();
                  }, 500),
                  console.log("disconnect loginCaptcha"),
                  u.disconnect()),
                  d &&
                    d.innerText.toLowerCase().includes("valid captcha") &&
                    (setTimeout(() => {
                      getCaptcha();
                    }, 500),
                    console.log("disconnect reviewCaptcha"),
                    u.disconnect());
              });
            c &&
              (console.log("observe loginCaptcha"),
              u.observe(c, {
                childList: !0,
                subtree: !0,
                characterDataOldValue: !0,
              })),
              d &&
                (console.log("observe reviewCaptcha"),
                u.observe(d, {
                  childList: !0,
                  subtree: !0,
                  characterDataOldValue: !0,
                }));
          }
        }),
        (t.onerror = function () {
          console.log("Captcha API Request failed");
        }),
        t.send(n);
    } else
      console.log("wait for captcha load"),
        setTimeout(() => {
          getCaptcha();
        }, 1e3);
  }
}
function getCaptchaTC() {
  if (captchaRetry < 100) {
    console.log("getCaptchaTC"), (captchaRetry += 1);
    let e = document.querySelector(".captcha-img");
    if (e) {
      let t = new XMLHttpRequest(),
        r = e.src,
        l = r.substr(22),
        n = JSON.stringify({
          client: "chrome extension",
          location: "https://www.irctc.co.in/nget/train-search",
          version: "0.3.8",
          case: "mixed",
          promise: "true",
          extension: !0,
          userid: "nandkumarsh222@gmail.com",
          apikey: "hW6X7tAP8nMtDRpaQk2m",
          data: l,
        });
      t.open("POST", "https://api.apitruecaptcha.org/one/gettext", !1),
        (t.onload = function () {
          if (200 != t.status) console.log(`Error ${t.status}: ${t.statusText}`), console.log(t.response);
          else {
            let e = "",
              r = document.querySelector("#captcha"),
              l = JSON.parse(t.response);
            (e = l.result), console.log("Org text", e);
            let n = Array.from(e.split(" ").join("").replace(")", "J").replace("]", "J")),
              o = "";
            for (let s of n) "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=@".includes(s) && (o += s);
            (r.value = o),
              "" == e &&
                (console.log("Null captcha text from api"),
                document.getElementsByClassName("glyphicon glyphicon-repeat")[0].parentElement.click(),
                setTimeout(() => {
                  getCaptchaTC();
                }, 500)),
              r.dispatchEvent(new Event("input")),
              r.dispatchEvent(new Event("change")),
              r.focus();
            let c = document.querySelector("app-login"),
              d = document.querySelector("#divMain > div > app-review-booking > p-toast"),
              u = new MutationObserver((e) => {
                c &&
                  c.innerText.toLowerCase().includes("valid captcha") &&
                  (setTimeout(() => {
                    getCaptchaTC();
                  }, 500),
                  console.log("disconnect loginCaptcha"),
                  u.disconnect()),
                  d &&
                    d.innerText.toLowerCase().includes("valid captcha") &&
                    (setTimeout(() => {
                      getCaptchaTC();
                    }, 500),
                    console.log("disconnect reviewCaptcha"),
                    u.disconnect());
              });
            if (
              (c &&
                (console.log("observe loginCaptcha"),
                u.observe(c, {
                  childList: !0,
                  subtree: !0,
                  characterDataOldValue: !0,
                })),
              d &&
                (console.log("observe reviewCaptcha"),
                u.observe(d, {
                  childList: !0,
                  subtree: !0,
                  characterDataOldValue: !0,
                })),
              void 0 !== user_data.other_preferences.CaptchaSubmitMode &&
                "A" == user_data.other_preferences.CaptchaSubmitMode)
            ) {
              console.log("Auto submit captcha");
              let p = document.querySelector("#divMain > app-login");
              if (p) {
                let g = p.querySelector("button[type='submit'][class='search_btn train_Search train_Search_custom_hover']"),
                  h = p.querySelector("input[type='text'][formcontrolname='userid']"),
                  y = p.querySelector("input[type='password'][formcontrolname='password']");
                "" != h.value && "" != y.value
                  ? (console.log("Submit login info and captcha"),
                    setTimeout(() => {
                      g.click();
                    }, 500))
                  : alert("Unable to auto submit loging info, username and password not filled,please submit manually");
              }
              if ((reviewPage = document.querySelector("#divMain > div > app-review-booking"))) {
                console.log("reviewPage", reviewPage);
                let v = document.querySelector("#captcha");
                if ("" != v.value) {
                  let f = document.querySelector(".btnDefault.train_Search");
                  f &&
                    setTimeout(() => {
                      if (
                        (console.log("Confirm berth", user_data.other_preferences.confirmberths),
                        user_data.other_preferences.confirmberths)
                      ) {
                        if (document.querySelector(".AVAILABLE")) console.log("Seats available"), f.click();
                        else if (!0 == confirm("No seats Available, Do you still want to continue booking?"))
                          console.log("No Seats available, still Go ahead"), f.click();
                        else {
                          console.log("No Seats available, STOP");
                          return;
                        }
                      } else f.click();
                    }, 500);
                } else alert("Captcha automatically not filled, submit manually");
              }
            } else console.log("Manual captcha submission");
          }
        }),
        (t.onerror = function () {
          console.log("Captcha API Request failed");
        }),
        t.send(n);
    } else
      console.log("wait for captcha load"),
        setTimeout(() => {
          getCaptchaTC();
        }, 1e3);
  }
}
function loadLoginDetails() {
  let e = document.querySelector("#divMain > app-login"),
    t = e.querySelector("input[type='text'][formcontrolname='userid']"),
    r = e.querySelector("input[type='password'][formcontrolname='password']");
  if (
    (e.querySelector("button[type='submit']"),
    (t.value = user_data.irctc_credentials.user_name ?? ""),
    t.dispatchEvent(new Event("input")),
    t.dispatchEvent(new Event("change")),
    (r.value = user_data.irctc_credentials.password ?? ""),
    r.dispatchEvent(new Event("input")),
    r.dispatchEvent(new Event("change")),
    void 0 !== user_data.other_preferences.autoCaptcha && user_data.other_preferences.autoCaptcha)
  )
    setTimeout(() => {
      getCaptchaTC();
    }, 500);
  else {
    console.log("Manuall captcha filling");
    let l = document.querySelector("#captcha");
    (l.value = "X"), l.dispatchEvent(new Event("input")), l.dispatchEvent(new Event("change")), l.focus();
  }
}
function loadJourneyDetails() {
  console.log("filling_journey_details");
  let e = document.querySelector("app-jp-input form"),
    t = e.querySelector("#origin > span > input");
  (t.value = user_data.journey_details.from),
    t.dispatchEvent(new Event("keydown")),
    t.dispatchEvent(new Event("input"));
  let r = e.querySelector("#destination > span > input");
  (r.value = user_data.journey_details.destination),
    r.dispatchEvent(new Event("keydown")),
    r.dispatchEvent(new Event("input"));
  let l = e.querySelector("#jDate > span > input");
  (l.value = user_data.journey_details.date ? `${user_data.journey_details.date.split("-").reverse().join("/")}` : ""),
    l.dispatchEvent(new Event("keydown")),
    l.dispatchEvent(new Event("input"));
  let n = e.querySelector("#journeyClass"),
    o = n.querySelector("div > div[role='button']");
  o.click(),
    addDelay(300),
    [...n.querySelectorAll("ul li")]
      .filter((e) => e.innerText === classTranslator(user_data.journey_details.class) ?? "")[0]
      ?.click(),
    addDelay(300);
  let s = e.querySelector("#journeyQuota"),
    c = s.querySelector("div > div[role='button']");
  c.click(),
    [...s.querySelectorAll("ul li")]
      .filter((e) => e.innerText === quotaTranslator(user_data.journey_details.quota) ?? "")[0]
      ?.click(),
    addDelay(300);
  let d = e.querySelector("button.search_btn.train_Search[type='submit']");
  addDelay(300), console.log("filled_journey_details"), d.click();
}
function selectJourneyOld() {
  if (!user_data.journey_details["train-no"]) return;
  let e = document.querySelector("#divMain > div > app-train-list"),
    t = [...e.querySelectorAll(".tbis-div app-train-avl-enq")];
  console.log(user_data.journey_details["train-no"]);
  let r = t.filter((e) =>
    e.querySelector("div.train-heading").innerText.trim().includes(user_data.journey_details["train-no"])
  )[0];
  if (!r) {
    console.log("Train not found."), alert("Train not found"), statusUpdate("journey_selection_stopped.no_train");
    return;
  }
  let l = classTranslator(user_data.journey_details.class),
    n = new Date(user_data.journey_details.date).toString().split(" "),
    o = { attributes: !1, childList: !0, subtree: !0 };
  [...r.querySelectorAll("table tr td div.pre-avl")].filter((e) => e.querySelector("div").innerText === l)[0]?.click();
  let s = document.querySelector("#divMain > div > app-train-list > p-toast"),
    c = (e, t) => {
      console.log("Popup error"),
        console.log("Class count ", [...r.querySelectorAll("table tr td div.pre-avl")].length),
        console.log("Class count ", [...r.querySelectorAll("table tr td div.pre-avl")]),
        s.innerText.includes("Unable to perform") &&
          (console.log("Unable to perform"),
          [...r.querySelectorAll("table tr td div.pre-avl")]
            .filter((e) => e.querySelector("div").innerText === l)[0]
            ?.click(),
          t.disconnect());
    },
    d = (e, t) => {
      let o = [...r.querySelectorAll("div p-tabmenu ul[role='tablist'] li[role='tab']")].filter(
          (e) => e.querySelector("div").innerText === l
        )[0],
        s = [...r.querySelectorAll("div div table td div.pre-avl")].filter(
          (e) => e.querySelector("div").innerText === `${n[0]}, ${n[2]} ${n[1]}`
        )[0],
        c = r.querySelector("button.btnDefault.train_Search.ng-star-inserted");
      if (o) {
        if ((console.log(1), o.classList.contains("ui-state-active")))
          s &&
            (console.log(3),
            s.classList.contains("selected-class")
              ? (console.log(4), c.click(), t.disconnect())
              : (console.log(5), s.click()));
        else {
          console.log(2), o.click();
          return;
        }
      } else console.log("6"), s.click(), c.click(), t.disconnect();
    },
    u = new MutationObserver(d);
  u.observe(r, o);
  let p = new MutationObserver(c);
  p.observe(s, o);
}
function retrySelectJourney() {
  console.log("Retrying selectJourney..."), setTimeout(selectJourney, 1e3);
}
function selectJourney() {
  let e = setInterval(() => {
    let t = document.querySelector("#divMain > div > app-train-list > p-toast > div > p-toastitem > div > div > a"),
      r = document.querySelector(
        "body > app-root > app-home > div.header-fix > app-header > p-toast > div > p-toastitem > div > div > a"
      ),
      l = t || r,
      n = document.querySelector("#loaderP"),
      o = n && "none" !== n.style.display;
    l &&
      !o &&
      (console.log("Toast link found. Clicking it now..."),
      l.click(),
      console.log("Toast link clicked"),
      retrySelectJourney(),
      console.log("Toast link clicked and called retrySelectJourney"),
      clearInterval(e));
  }, 1e3);
  if (!user_data?.journey_details?.["train-no"]) {
    console.error("Train number is not available in user_data.");
    return;
  }
  let t = document.querySelector("#divMain > div > app-train-list");
  if (!t) {
    console.error("Train list parent not found.");
    return;
  }
  let r = Array.from(t.querySelectorAll(".tbis-div app-train-avl-enq")),
    l = user_data.journey_details["train-no"],
    n = classTranslator(user_data.journey_details.class),
    o = new Date(user_data.journey_details.date),
    s = o.toDateString().split(" ")[0] + ", " + o.toDateString().split(" ")[2] + " " + o.toDateString().split(" ")[1];
  console.log("Train Number:", l), console.log("Class:", n), console.log("date", s);
  let c = r.find((e) => e.querySelector("div.train-heading").innerText.trim().includes(l.split("-")[0]));
  if (!c) {
    console.error("Train not found."), statusUpdate("journey_selection_stopped.no_train");
    return;
  }
  let d = (e) => {
      if (!e) return !1;
      let t = window.getComputedStyle(e);
      return "none" !== t.display && "hidden" !== t.visibility && "0" !== t.opacity;
    },
    u = Array.from(c.querySelectorAll("table tr td div.pre-avl")).find(
      (e) => e.querySelector("div").innerText.trim() === n
    ),
    p = Array.from(c.querySelectorAll("span")).find((e) => e.innerText.trim() === n),
    g = u || p;
  if ((console.log("FOUND updatedClassToClick:", g), !g)) {
    console.error("Class to click not found.");
    return;
  }
  let h = document.querySelector("#loaderP");
  if (d(h)) {
    console.error("Loader is visible. Cannot click the class.");
    return;
  }
  g.click();
  let y,
    v = (e, t) => {
      console.log("Mutation observed at", new Date().toLocaleTimeString()),
        clearTimeout(y),
        (y = setTimeout(() => {
          let e = Array.from(c.querySelectorAll("div div table td div.pre-avl")).find(
            (e) => e.querySelector("div").innerText.trim() === s
          );
          console.log("FOUND classTabToSelect:", e),
            e
              ? (e.click(),
                console.log("Clicked on selectdate"),
                setTimeout(() => {
                  let e = () => {
                    let r = c.querySelector("button.btnDefault.train_Search.ng-star-inserted"),
                      l = d(document.querySelector("#loaderP"));
                    if (l) {
                      console.warn("Loader is visible, retrying..."), setTimeout(e, 100);
                      return;
                    }
                    !r || r.classList.contains("disable-book") || r.disabled
                      ? (console.warn("bookBtn is disabled or not found, retrying..."), retrySelectJourney())
                      : setTimeout(() => {
                          r.click(), console.log("Clicked on bookBtn"), clearTimeout(y), t.disconnect();
                        }, 300);
                  };
                  e();
                }, 1e3))
              : console.warn("classTabToSelect not found");
        }, 300));
    },
    f = new MutationObserver(v);
  f.observe(c, { attributes: !1, childList: !0, subtree: !0 });
}
function fillPassengerDetails() {
  if ((console.log("passenger_filling_started"), user_data.journey_details.boarding.length > 0)) {
    console.log("Set boarding station " + user_data.journey_details.boarding);
    let e = document.getElementsByTagName("strong"),
      t = Array.from(e).filter((e) =>
        e.innerText.includes(user_data.journey_details.from.split("-")[0].trim() + " | ")
      );
    t[0] && (t[0].click(), addDelay(300));
    let r = document.getElementsByTagName("strong"),
      l = Array.from(r).filter((e) => e.innerText.includes(user_data.journey_details.boarding.split("-")[0].trim()));
    l[0] && l[0].click();
  }
  let n = document.querySelector("app-passenger-input"),
    o = 1;
  for (; o < user_data.passenger_details.length; )
    addDelay(200), document.getElementsByClassName("prenext")[0].click(), o++;
  let s = [...n.querySelectorAll("app-passenger")];
  if (
    (n.querySelectorAll("app-infant"),
    user_data.passenger_details.forEach((e, t) => {
      let r = s[t].querySelector("p-autocomplete > span > input");
      (r.value = e.name), r.dispatchEvent(new Event("input"));
      let l = s[t].querySelector("input[type='number'][formcontrolname='passengerAge']");
      (l.value = e.age), l.dispatchEvent(new Event("input"));
      let n = s[t].querySelector("select[formcontrolname='passengerGender']");
      (n.value = e.gender), n.dispatchEvent(new Event("change"));
      let o = s[t].querySelector("select[formcontrolname='passengerBerthChoice']");
      (o.value = e.berth), o.dispatchEvent(new Event("change"));
      let c = s[t].querySelector("select[formcontrolname='passengerFoodChoice']");
      c && ((c.value = e.food), c.dispatchEvent(new Event("change")));
    }),
    "" !== user_data.other_preferences.mobileNumber)
  ) {
    let c = n.querySelector("input#mobileNumber[formcontrolname='mobileNumber'][name='mobileNumber']");
    (c.value = user_data.other_preferences.mobileNumber), c.dispatchEvent(new Event("input"));
  }
  let d = [
    ...n.querySelectorAll("p-radiobutton[formcontrolname='paymentType'][name='paymentType'] input[type='radio']"),
  ];
  addDelay(100);
  let u = "2";
  d.filter(
    (e) =>
      e.value ===
      (u =
        void 0 !== user_data.vpa.vpa && user_data.vpa.vpa.includes("@")
          ? "2"
          : "IRCWA" === user_data.other_preferences.paymentmethod
          ? "1"
          : "DBTCRD" === user_data.other_preferences.paymentmethod ||
            "DBTCRDI" == user_data.other_preferences.paymentmethod
          ? "1"
          : "2")
  )[0]?.click();
  let p = n.querySelector("input#autoUpgradation[type='checkbox'][formcontrolname='autoUpgradationSelected']");
  p && (p.checked = user_data.other_preferences.autoUpgradation ?? !1);
  let g = n.querySelector("input#confirmberths[type='checkbox'][formcontrolname='bookOnlyIfCnf']");
  g && (g.checked = user_data.other_preferences.confirmberths ?? !1);
  let h = [
    ...n.querySelectorAll(
      "p-radiobutton[formcontrolname='travelInsuranceOpted'] input[type='radio'][name='travelInsuranceOpted-0']"
    ),
  ];
  addDelay(200),
    h
      .filter((e) => e.value === ("yes" === user_data.travel_preferences.travelInsuranceOpted ? "true" : "false"))[0]
      ?.click(),
    submitPassengerDetailsForm(n);
}
function submitPassengerDetailsForm(e) {
  console.log("passenger_filling_completed"),
    setTimeout(() => {
      e.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']")?.click();
    }, 800);
}
function continueScript() {
  let e = document.querySelector(
    "body > app-root > app-home > div.header-fix > app-header > div.col-sm-12.h_container > div.text-center.h_main_div > div.row.col-sm-12.h_head1 > a.search_btn.loginText.ng-star-inserted"
  );
  window.location.href.includes("train-search")
    ? ("LOGOUT" === e.innerText.trim().toUpperCase() && loadJourneyDetails(),
      "LOGIN" === e.innerText.trim().toUpperCase() && (e.click(), loadLoginDetails()))
    : window.location.href.includes("nget/booking/train-list") || console.log("Nothing to do");
}
async function a() {
  apikey = "abcd1234";
  let e = user_data.subs_credentials.user_name ?? "",
    t = user_data.subs_credentials.password ?? "",
    r =
      "https://script.google.com/macros/s/AKfycbxL5deUD2LHpaT3b45FqSzpFQDR0CLzTqFYueXvdlcnQdVUOkUTDkBzZgsGFgFOzf8Z/exec?action=getActivePlan&apikey=" +
      apikey +
      "&username=" +
      e +
      "&password=" +
      t;
  await fetch(r)
    .then((e) => {
      if (!e.ok) throw Error("Network response was not ok");
      return e.json();
    })
    .then((e) => {
      if ((console.log(JSON.stringify(e)), 1 == e.success)) console.log("");
      else {
        alert("PLEASE BUY A PLAN TO USE OUR EXTENSION");
        try {
          document
            .querySelector(
              "body > app-root > app-home > div.header-fix > app-header > div.col-sm-12.h_container > div.text-center.h_main_div > div.row.col-sm-12.h_head1 > a.search_btn.loginText.ng-star-inserted"
            )
            .click();
        } catch (t) {
          window.location.href = "https://www.irctc.co.in/nget/train-search";
        }
      }
    })
    .catch((e) => {
      console.error("Error:", e), alert("Something went wrong");
      try {
        document
          .querySelector(
            "body > app-root > app-home > div.header-fix > app-header > div.col-sm-12.h_container > div.text-center.h_main_div > div.row.col-sm-12.h_head1 > a.search_btn.loginText.ng-star-inserted"
          )
          .click();
      } catch (t) {
        window.location.href = "https://www.irctc.co.in/nget/train-search";
      }
    });
}
window.onload = function (e) {
  setInterval(function () {
    console.log("Repeater"), statusUpdate("Keep listener alive.");
  }, 15e3);
  let t = document.querySelector(
      "body > app-root > app-home > div.header-fix > app-header > div.col-sm-12.h_container > div.text-center.h_main_div > div.row.col-sm-12.h_head1 "
    ),
    r = (e, r) => {
      e.filter(
        (e) =>
          "childList" === e.type &&
          e.addedNodes.length > 0 &&
          [...e.addedNodes].filter((e) => "LOGOUT" === e?.innerText?.trim()?.toUpperCase()).length > 0
      ).length > 0
        ? (r.disconnect(), loadJourneyDetails())
        : (t.click(), loadLoginDetails());
    },
    l = new MutationObserver(r);
  l.observe(t, { attributes: !1, childList: !0, subtree: !1 }),
    chrome.storage.local.get(null, (e) => {
      (user_data = e), continueScript();
    });
};
