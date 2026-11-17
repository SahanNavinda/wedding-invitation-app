const wedding = {
  names: "Amaya & Kavin",
  date: "2027-02-20T10:00:00+05:30",
  venue: "Kandy, Sri Lanka",
  welcome: "We warmly invite you to celebrate our marriage with us.",
  events: [
    { title: "Registration", time: "8:30 AM" },
    { title: "Poruwa Ceremony", time: "10:00 AM" }
  ],
  replyBy: "10 February 2027",
  whatsapp: "" // Add the country code and number using digits only.
};
const byId = id => document.getElementById(id);
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
  byId("rsvp-preview").hidden = true;
}
function updateCountdown() {
  const minutes = Math.max(0, Math.floor((date - Date.now()) / 60000));
  byId("countdown").textContent = date <= Date.now()
    ? "The wedding day has arrived"
    : Math.floor(minutes / 1440) + " days, " + Math.floor(minutes / 60) % 24 +
      " hours, " + minutes % 60 + " minutes";
}
updateCountdown();
setInterval(updateCountdown, 1000);
