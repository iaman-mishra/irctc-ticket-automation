let finalData = {
  irctc_credentials: {},
  subs_credentials: {},
  journey_details: {},
  passenger_details: [],
  travel_preferences: {},
  other_preferences: {},
  vpa: {},
};
function autocompleteSourcDstTrain(e, t, r) {
  var n;
  function s(e) {
    if (!e) return !1;
    (function e(t) {
      for (var r = 0; r < t.length; r++)
        t[r].classList.remove("autocomplete-active");
    })(e),
      n >= e.length && (n = 0),
      n < 0 && (n = e.length - 1),
      e[n].classList.add("autocomplete-active");
  }
  function i(t) {
    for (
      var r = document.getElementsByClassName("autocomplete-items"), n = 0;
      n < r.length;
      n++
    )
      t != r[n] && t != e && r[n].parentNode.removeChild(r[n]);
  }
  e.addEventListener("input", function (s) {
    var l,
      o,
      c,
      d = this.value;
    if ((i(), !d)) return !1;
    for (
      n = -1,
        (l = document.createElement("DIV")).setAttribute(
          "id",
          this.id + "autocomplete-list"
        ),
        l.setAttribute("class", "autocomplete-items"),
        this.parentNode.appendChild(l),
        c = 0;
      c < t.length;
      c++
    )
      t[c].toUpperCase().includes(d.toUpperCase()) &&
        (((o = document.createElement("DIV")).innerHTML =
          "<strong>" + t[c].substr(0, d.length) + "</strong>"),
        (o.innerHTML += t[c].substr(d.length)),
        (o.innerHTML += "<input type='hidden' value='" + t[c] + "'>"),
        o.addEventListener("click", function (t) {
          if (
            ((e.value = this.getElementsByTagName("input")[0].value),
            "SOURCE" == r &&
              (finalData.journey_details.from =
                this.getElementsByTagName("input")[0].value),
            "DEST" == r &&
              (finalData.journey_details.destination =
                this.getElementsByTagName("input")[0].value),
            "TRAIN" == r)
          ) {
            let n = this.getElementsByTagName("input")[0].value;
            finalData.journey_details["train-no"] = n.trim();
          }
          "BOARDING" == r &&
            (finalData.journey_details.boarding =
              this.getElementsByTagName("input")[0].value),
            i();
        }),
        l.appendChild(o));
  }),
    e.addEventListener("keydown", function (e) {
      var t = document.getElementById(this.id + "autocomplete-list");
      t && (t = t.getElementsByTagName("div")),
        40 == e.keyCode
          ? (n++, s(t))
          : 38 == e.keyCode
          ? (n--, s(t))
          : 13 == e.keyCode &&
            (e.preventDefault(), n > -1 && t && t[n].click());
    }),
    document.addEventListener("click", function (e) {
      i(e.target);
    });
}
const stationData = [],
  stationList = [];
async function fetchTrainData() {
  let e = await fetch("train_data.js"),
    t = await e.text();
  return t.split(/\r?\n/);
}
function setIRCTCUsername(e) {
  finalData.irctc_credentials || (finalData.irctc_credentials = {}),
    (finalData.irctc_credentials.user_name = e.target.value),
    console.log("data-update", finalData);
}
function setIRCTCPassword(e) {
  (finalData.irctc_credentials.password = e.target.value),
    console.log("data-update", finalData);
}
function setSubsUsername(e) {
  finalData.subs_credentials || (finalData.subs_credentials = {}),
    (finalData.subs_credentials.user_name = e.target.value),
    console.log("data-update", finalData);
}
function setSubsPassword(e) {
  (finalData.subs_credentials.password = e.target.value),
    console.log("data-update", finalData);
}
function setFromStation(e) {
  (finalData.journey_details.from = e.target.value.toUpperCase()),
    (document.querySelector("#from-station-input").value = e.target.value);
}
function setDestinationStation(e) {
  (finalData.journey_details.destination = e.target.value.toUpperCase()),
    (document.querySelector("#destination-station-input").value =
      e.target.value);
}
function setBoardingStation(e) {
  (finalData.journey_details.boarding = e.target.value.toUpperCase()),
    (document.querySelector("#boarding-station-input").value = e.target.value);
}
function setJourneyClass(e) {
  (finalData.journey_details.class = e.target.value),
    (document.querySelector("#journey-class-input").value = e.target.value);
}
function setQuota(e) {
  (finalData.journey_details.quota = e.target.value),
    (document.querySelector("#quota-input").value = e.target.value);
}
function journeyDateChanged(e) {
  finalData.journey_details.date = e.target.value;
}
function setTrainNumber(e) {
  finalData.journey_details["train-no"] = e.target.value;
}
function setPassengerDetails(e, t, r) {
  finalData.passenger_details[t] || (finalData.passenger_details[t] = {}),
    (finalData.passenger_details[t][e.target.name] = e.target.value);
}
function setOtherPreferences(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] =
      "checkbox" === e.target.type ? e.target.checked : e.target.value);
}
function setAutoCaptcha(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] =
      "checkbox" === e.target.type ? e.target.checked : e.target.value);
}
function setOtherPreferencesVpa(e) {
  finalData.vpa || (finalData.vpa = {}),
    (finalData.vpa[e.target.name] = e.target.value);
}
function setpaymentMethod(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences.paymentmethod = e.target.value),
    "UPIID" == e.target.value
      ? ((document.getElementById("vpa").hidden = !1),
        (document.getElementById("carddetails").hidden = !0))
      : ((document.getElementById("vpa").hidden = !0),
        (document.getElementById("carddetails").hidden = !0),
        (finalData.vpa.vpa = "")),
    ("DBTCRD" == e.target.value || "DBTCRDI" == e.target.value) &&
      ((document.getElementById("vpa").hidden = !0),
      (document.getElementById("carddetails").hidden = !1));
}
function setCaptchaSubmitMode(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences.CaptchaSubmitMode = e.target.value);
}
function setCardDetails(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    "cardnumber" == e.target.name &&
      (finalData.other_preferences[e.target.name] = e.target.value),
    "cardexpiry" == e.target.name &&
      (finalData.other_preferences[e.target.name] = e.target.value),
    "cardcvv" == e.target.name &&
      (finalData.other_preferences[e.target.name] = e.target.value),
    "cardholder" == e.target.name &&
      (finalData.other_preferences[e.target.name] = e.target.value);
}
function setOtherPreferencesbooktime(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] = e.target.value);
}
function setcardtype(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] = e.target.value);
}
function setMobileNumber(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] = e.target.value);
}
function setTravelPreferences(e) {
  finalData.travel_preferences || (finalData.travel_preferences = {}),
    (finalData.travel_preferences[e.target.name] =
      "checkbox" === e.target.type ? e.target.checked : e.target.value);
}
function setAvailabilyCheck(e) {
  finalData.travel_preferences || (finalData.travel_preferences = {}),
    (finalData.travel_preferences[e.target.name] =
      "checkbox" === e.target.type ? e.target.checked : e.target.value);
}
function setIrctcWallet(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] =
      "checkbox" === e.target.type ? e.target.checked : e.target.value);
}
function setTokenString(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] = e.target.value);
}
function setprojectId(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] = e.target.value);
}
function modifyUserData() {
  if (
    (console.log("before modifyUserData"),
    console.log(finalData),
    (finalData.passenger_details =
      finalData.passenger_details
        ?.filter((e) => e.name?.length > 0 && e.age?.length > 0)
        ?.map((e) => ({
          name: e.name,
          age: e.age,
          gender: e.gender ?? "M",
          berth: e.berth ?? "",
          nationality: "IN",
          food: e.food ?? "D",
        })) ?? []),
    void 0 == finalData.other_preferences.slbooktime &&
      (finalData.other_preferences.slbooktime =
        document.getElementById("slbooktime").value),
    void 0 == finalData.other_preferences.acbooktime &&
      (finalData.other_preferences.acbooktime =
        document.getElementById("acbooktime").value),
    void 0 == finalData.journey_details.class &&
      (finalData.journey_details.class = document.getElementById(
        "journey-class-input"
      ).value),
    void 0 == finalData.journey_details.quota &&
      (finalData.journey_details.quota =
        document.getElementById("quota-input").value),
    ("TQ" === finalData.journey_details.quota ||
      "PT" === finalData.journey_details.quota) &&
      finalData.passenger_details.length > 4)
  ) {
    alert("For tatkal quota Maximum 4 passengers allowed.");
    return;
  }
  void 0 == finalData.journey_details.boarding &&
    (finalData.journey_details.boarding = ""),
    "" == document.getElementById("boarding-station-input").value &&
      (finalData.journey_details.boarding = ""),
    void 0 == finalData.other_preferences.tokenString &&
      (finalData.other_preferences.tokenString = ""),
    void 0 == finalData.other_preferences.projectId &&
      (finalData.other_preferences.projectId = ""),
    void 0 == finalData.other_preferences.mobileNumber &&
      (finalData.other_preferences.mobileNumber = ""),
    void 0 == finalData.other_preferences.paymentmethod &&
      (finalData.other_preferences.paymentmethod =
        document.getElementById("paymentMethod").value),
    void 0 == finalData.other_preferences.CaptchaSubmitMode &&
      (finalData.other_preferences.CaptchaSubmitMode =
        document.getElementById("CaptchaSubmitMode").value),
    void 0 == finalData.other_preferences.cardnumber &&
      (finalData.other_preferences.cardnumber =
        document.getElementById("cardnumber").value),
    void 0 == finalData.other_preferences.cardexpiry &&
      (finalData.other_preferences.cardexpiry =
        document.getElementById("cardexpiry").value),
    void 0 == finalData.other_preferences.cardcvv &&
      (finalData.other_preferences.cardcvv =
        document.getElementById("cardcvv").value),
    void 0 == finalData.other_preferences.cardholder &&
      (finalData.other_preferences.cardholder =
        document.getElementById("cardholder").value),
    void 0 == finalData.other_preferences.cardtype &&
      (finalData.other_preferences.cardtype =
        document.getElementById("cardtype").value),
    void 0 == finalData.travel_preferences.AvailabilityCheck &&
      (finalData.travel_preferences.AvailabilityCheck = "A"),
    void 0 == finalData.journey_details["train-no"] &&
      (console.log("Set default train nr."),
      (finalData.journey_details["train-no"] = "00000- DEFAULT")),
    console.log("after modifyUserData"),
    console.log(finalData),
    chrome.storage.local.set(finalData),
    alert("Data saved successfully");
}
function loadUserData() {
  chrome.storage.local.get(null, (e) => {
    if (
      (console.log("loadUserData"), console.log(e), 0 !== Object.keys(e).length)
    ) {
      (document.querySelector("#irctc-login").value =
        e.irctc_credentials.user_name),
        (document.querySelector("#irctc-password").value =
          e.irctc_credentials.password),
        (document.querySelector("#subscriber-username").value =
          e.subs_credentials.user_name),
        (document.querySelector("#subscriber-password").value =
          e.subs_credentials.password),
        (document.querySelector("#from-station-input").value =
          e.journey_details.from),
        (document.querySelector("#destination-station-input").value =
          e.journey_details.destination),
        (document.querySelector("#boarding-station-input").value =
          e.journey_details.boarding),
        (document.querySelector("#journey-date").value =
          e.journey_details.date),
        (document.querySelector("#journey-class-input").value =
          e.journey_details.class),
        (document.querySelector("#quota-input").value =
          e.journey_details.quota),
        (document.querySelector(
          "#train-no"
        ).value = `${e.journey_details["train-no"]}`),
        e.passenger_details.forEach((e, t) => {
          (document.querySelector(`#passenger-name-${t + 1}`).value =
            e.name ?? ""),
            (document.querySelector(`#age-${t + 1}`).value = e.age ?? ""),
            (document.querySelector(`#passenger-gender-${t + 1}`).value =
              e.gender ?? "M"),
            (document.querySelector(`#passenger-berth-${t + 1}`).value =
              e.berth ?? ""),
            (document.querySelector(`#passenger-food-${t + 1}`).value =
              e.food ?? "");
        }),
        e.travel_preferences?.travelInsuranceOpted &&
          (document.querySelector(
            `#travelInsuranceOpted-${
              e.travel_preferences?.travelInsuranceOpted === "yes" ? 1 : 2
            }`
          ).checked = !0);
      try {
        e.travel_preferences?.AvailabilityCheck
          ? (document.querySelector(
              `#AvailabilityCheck-${
                e.travel_preferences?.AvailabilityCheck === "A"
                  ? 1
                  : e.travel_preferences?.AvailabilityCheck === "M"
                  ? 2
                  : e.travel_preferences?.AvailabilityCheck === "I"
                  ? 3
                  : 1
              }`
            ).checked = !0)
          : (console.log(
              "Load user data - set availability A - if not defined"
            ),
            chrome.storage.local.set(
              { travel_preferences: { AvailabilityCheck: "A" } },
              () => {
                console.log("set AvailabilityCheck A");
              }
            ));
      } catch {
        console.log("error getting availability check");
      }
      Object.keys(e.other_preferences).length > 0 &&
        ((document.querySelector("#autoUpgradation").checked =
          e.other_preferences.autoUpgradation ?? !1),
        (document.querySelector("#confirmberths").checked =
          e.other_preferences.confirmberths ?? !1),
        (document.querySelector("#acbooktime").value =
          e.other_preferences.acbooktime),
        (document.querySelector("#slbooktime").value =
          e.other_preferences.slbooktime),
        (document.querySelector("#mobileNumber").value =
          e.other_preferences.mobileNumber),
        (document.querySelector("#paymentmethod").value =
          e.other_preferences.paymentmethod),
        (document.querySelector("#CaptchaSubmitMode").value =
          e.other_preferences.CaptchaSubmitMode),
        (document.querySelector("#autoCaptcha").checked =
          e.other_preferences.autoCaptcha ?? !1),
        (document.querySelector("#tokenString").value =
          e.other_preferences.tokenString),
        (document.querySelector("#projectId").value =
          e.other_preferences.projectId)),
        Object.keys(e.vpa).length > 0 &&
          "" !== e.vpa.vpa &&
          (console.log("load vpa", e.vpa.vpa),
          (document.querySelector("#vpa").hidden = !1),
          (document.querySelector("#vpa").value = e.vpa.vpa)),
        ("DBTCRD" == e.other_preferences.paymentmethod ||
          "DBTCRDI" == e.other_preferences.paymentmethod) &&
          (document.getElementById("carddetails").hidden = !1),
        (document.querySelector("#cardnumber").value =
          e.other_preferences.cardnumber),
        (document.querySelector("#cardexpiry").value =
          e.other_preferences.cardexpiry),
        (document.querySelector("#cardcvv").value =
          e.other_preferences.cardcvv),
        (document.querySelector("#cardholder").value =
          e.other_preferences.cardholder),
        (document.querySelector("#cardtype").value =
          e.other_preferences.cardtype),
        (finalData = e);
    }
  });
}
function getMsg(e, t) {
  return { msg: { type: e, data: t }, sender: "popup", id: "irctc" };
}
function saveForm() {
  if (
    "" == document.getElementById("subscriber-username").value ||
    "" == document.getElementById("subscriber-password").value
  ) {
    alert("subscriber username and password required");
    return;
  }
  modifyUserData();
}
function clearData() {
  !0 == confirm("Do you want to clear data?") && chrome.storage.local.clear();
}
function connectWithBg() {
  startScript();
}
function startScript() {
  chrome.runtime.sendMessage(getMsg("activate_script", finalData), (e) => {
    console.log(e, "activate_script response");
  });
}
function buyPlan() {
  alert("You are alreday have an active asubscription");
}
function showsubscriberpswd() {
  var e = document.getElementById("subscriber-password");
  "password" === e.type ? (e.type = "text") : (e.type = "password");
}
function showirctcpswd() {
  var e = document.getElementById("irctc-password");
  "password" === e.type ? (e.type = "text") : (e.type = "password");
}
fetch("stationlist.json")
  .then((e) => e.json())
  .then((e) => {
    for (let t in (stationData.push(...e), stationData))
      stationList.push(stationData[t].name + " - " + stationData[t].code);
    autocompleteSourcDstTrain(
      document.getElementById("from-station-input"),
      stationList,
      "SOURCE"
    ),
      autocompleteSourcDstTrain(
        document.getElementById("destination-station-input"),
        stationList,
        "DEST"
      ),
      autocompleteSourcDstTrain(
        document.getElementById("boarding-station-input"),
        stationList,
        "BOARDING"
      );
  }),
  fetchTrainData().then((e) => {
    autocompleteSourcDstTrain(document.getElementById("train-no"), e, "TRAIN");
  }),
  window.addEventListener("load", () => {
    loadUserData(),
      document
        .querySelector("#irctc-login")
        .addEventListener("change", setIRCTCUsername),
      document
        .querySelector("#irctc-password")
        .addEventListener("change", setIRCTCPassword),
      document
        .querySelector("#subscriber-username")
        .addEventListener("change", setSubsUsername),
      document
        .querySelector("#subscriber-password")
        .addEventListener("change", setSubsPassword),
      document
        .querySelector("#journey-date")
        .addEventListener("change", journeyDateChanged),
      document
        .querySelector("#journey-class-input")
        .addEventListener("change", setJourneyClass),
      document
        .querySelector("#quota-input")
        .addEventListener("change", setQuota);
    for (let e = 0; e < 6; e++)
      document
        .querySelector(`#passenger-name-${e + 1}`)
        .addEventListener("change", (t) =>
          setPassengerDetails(t, e, "passenger")
        ),
        document
          .querySelector(`#age-${e + 1}`)
          .addEventListener("change", (t) =>
            setPassengerDetails(t, e, "passenger")
          ),
        document
          .querySelector(`#passenger-gender-${e + 1}`)
          .addEventListener("change", (t) =>
            setPassengerDetails(t, e, "passenger")
          ),
        document
          .querySelector(`#passenger-berth-${e + 1}`)
          .addEventListener("change", (t) =>
            setPassengerDetails(t, e, "passenger")
          ),
        document
          .querySelector(`#passenger-food-${e + 1}`)
          .addEventListener("change", (t) =>
            setPassengerDetails(t, e, "passenger")
          );
    document
      .querySelector("#autoUpgradation")
      .addEventListener("change", setOtherPreferences),
      document
        .querySelector("#autoCaptcha")
        .addEventListener("change", setAutoCaptcha),
      document
        .querySelector("#confirmberths")
        .addEventListener("change", setOtherPreferences),
      document
        .querySelector("#vpa")
        .addEventListener("change", setOtherPreferencesVpa),
      document
        .querySelector("#cardnumber")
        .addEventListener("change", setCardDetails),
      document
        .querySelector("#cardexpiry")
        .addEventListener("change", setCardDetails),
      document
        .querySelector("#cardcvv")
        .addEventListener("change", setCardDetails),
      document
        .querySelector("#cardholder")
        .addEventListener("change", setCardDetails),
      document
        .querySelector("#paymentMethod")
        .addEventListener("change", setpaymentMethod),
      document
        .querySelector("#CaptchaSubmitMode")
        .addEventListener("change", setCaptchaSubmitMode),
      document
        .querySelector("#cardtype")
        .addEventListener("change", setcardtype),
      document
        .querySelector("#slbooktime")
        .addEventListener("change", setOtherPreferencesbooktime),
      document
        .querySelector("#acbooktime")
        .addEventListener("change", setOtherPreferencesbooktime),
      document
        .querySelector("#mobileNumber")
        .addEventListener("change", setMobileNumber),
      document
        .querySelector("#travelInsuranceOpted-1")
        .addEventListener("change", setTravelPreferences),
      document
        .querySelector("#travelInsuranceOpted-2")
        .addEventListener("change", setTravelPreferences),
      document
        .querySelector("#AvailabilityCheck-1")
        .addEventListener("change", setAvailabilyCheck),
      document
        .querySelector("#AvailabilityCheck-2")
        .addEventListener("change", setAvailabilyCheck),
      document
        .querySelector("#AvailabilityCheck-3")
        .addEventListener("change", setAvailabilyCheck),
      document
        .querySelector("#tokenString")
        .addEventListener("change", setTokenString),
      document
        .querySelector("#projectId")
        .addEventListener("change", setprojectId),
      document.querySelector("#submit-btn").addEventListener("click", saveForm),
      document.querySelector("#load-btn-1").addEventListener("click", () => {
        buyPlan();
      }),
      document
        .querySelector("#clear-btn")
        .addEventListener("click", () => clearData()),
      document
        .querySelector("#connect-btn")
        .addEventListener("click", connectWithBg),
      document
        .querySelector("#showsubscriberpswd")
        .addEventListener("click", showsubscriberpswd),
      document
        .querySelector("#showirctcpswd")
        .addEventListener("click", showirctcpswd);
  });
