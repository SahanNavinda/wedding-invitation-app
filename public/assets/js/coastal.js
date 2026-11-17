const wedding = {
  names: "Nethmi & Devin",
  date: "2027-08-07T16:30:00+05:30",
  venue: "Galle, Sri Lanka",
  welcome: "We warmly invite you to celebrate our marriage with us.",
  events: [
    { title: "Registration", time: "4:00 PM" },
    { title: "Seaside Ceremony", time: "4:30 PM" }
  ],
  replyBy: "28 July 2027",
  whatsapp: "" // Add the country code and number using digits only.
};
const byId = id => document.getElementById(id);
const config = new URLSearchParams(location.hash.slice(1)).get("wedding");
if (config) {
  try {
    const draft = JSON.parse(config);
    for (const key of ["names", "venue", "welcome", "replyBy"]) {
      if (typeof draft[key] === "string") wedding[key] = draft[key];
    }
    const customDate = draft.date + ":00+05:30";
    if (typeof draft.date === "string" && Number.isFinite(Date.parse(customDate))) wedding.date = customDate;
    if (typeof draft.ceremony === "string" && draft.ceremony) wedding.events = [{
      title: draft.ceremony,
      time: new Intl.DateTimeFormat("en-LK", {timeStyle:"short", timeZone:"Asia/Colombo"}).format(new Date(wedding.date))
    }];
    if (/^[0-9]{8,15}$/.test(draft.whatsapp)) wedding.whatsapp = draft.whatsapp;
    document.getElementById("story-text").textContent = typeof draft.story === "string" ? draft.story : "";
    const main = document.querySelector("main");
    const sections = new Map(Array.from(main.querySelectorAll("section"), el => [el.dataset.section, el]));
    if (Array.isArray(draft.sections)) {
      for (const section of sections.values()) section.hidden = !draft.sections.includes(section.dataset.section) || (section.dataset.section === "story" && !draft.story); for (const key of draft.sections) if (sections.has(key)) main.append(sections.get(key));
    }
  } catch {}
}
const date = new Date(wedding.date);
const dateLabel = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "full", timeZone: "Asia/Colombo"
}).format(date);
document.title = wedding.names + " | Wedding Invitation";
document.querySelectorAll("[data-names]").forEach(el => el.textContent = wedding.names);
document.querySelectorAll("[data-date]").forEach(el => el.textContent = dateLabel);
const guest = new URLSearchParams(location.search).get("guest");
if (guest) {
  byId("guest").textContent = "Dear " + guest;
  byId("guest").hidden = false;
}
byId("welcome").textContent = wedding.welcome;
byId("venue").textContent = wedding.venue;
byId("deadline").textContent = "Kindly reply by " + wedding.replyBy + ".";
byId("map").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(wedding.venue);
for (const event of wedding.events) {
  const card = document.createElement("article");
  card.className = "card";
  const heading = document.createElement("h3");
  heading.textContent = event.title;
  const time = document.createElement("p");
  time.textContent = event.time;
  card.append(heading, time);
  byId("events").append(card);
}
if (wedding.whatsapp) {
  byId("rsvp").href = "https://wa.me/" + wedding.whatsapp + "?text=" +
    encodeURIComponent("Hi! I'd like to RSVP for the wedding of " + wedding.names + ".");
  byId("rsvp").hidden = false;
  byId("demo-rsvp").hidden = true; byId("demo-status").hidden = true;
}
byId("demo-rsvp").addEventListener("submit", event => { event.preventDefault(); byId("demo-status").textContent = "Demo response received. No reply was sent."; });
function updateCountdown() {
  const minutes = Math.max(0, Math.floor((date - Date.now()) / 60000));
  byId("countdown").textContent = date <= Date.now()
    ? "The wedding day has arrived"
    : Math.floor(minutes / 1440) + " days, " + Math.floor(minutes / 60) % 24 +
      " hours, " + minutes % 60 + " minutes";
}
updateCountdown();
setInterval(updateCountdown, 1000);
