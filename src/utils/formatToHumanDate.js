export function formatToHumanDate(isoTimestamp) {
  const date = new Date(isoTimestamp);

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata", // Use "local" if you want system time
  });
}