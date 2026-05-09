"use strict";

function formatPrice(value) {
  const raw = Number(value) || 0;

  if (!raw) {
    return "Free";
  }

  /*
    Your DB column is named *_cents, but from your screenshot you are storing
    25 as $25. This keeps both cases working:
    25   -> $25
    2500 -> $25
  */
  const dollars = raw >= 1000 ? raw / 100 : raw;

  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

const MONTH_ABBRS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function generateTimeSlots() {
  return [
    { label: "09:00 AM", value: "09:00" },
    { label: "10:30 AM", value: "10:30" },
    { label: "12:00 PM", value: "12:00" },
    { label: "02:00 PM", value: "14:00" },
    { label: "03:30 PM", value: "15:30" },
    { label: "05:00 PM", value: "17:00" },
  ];
}

module.exports = { formatPrice, MONTH_ABBRS, generateTimeSlots };
