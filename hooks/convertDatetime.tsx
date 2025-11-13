export function convertDatetime(datetimeStr: string) {
  const dtObject = new Date(datetimeStr);
  const currentDatetime = new Date();

  const timePassed = currentDatetime.getTime() - dtObject.getTime();
  const secondsPassed = Math.floor(timePassed / 1000);
  const minutesPassed = Math.floor(timePassed / (1000 * 60));
  const hoursPassed = Math.floor(timePassed / (1000 * 60 * 60));
  const daysPassed = Math.floor(timePassed / (1000 * 60 * 60 * 24));
  const weeksPassed = Math.floor(timePassed / (1000 * 60 * 60 * 24 * 7));
  const monthsPassed = Math.floor(timePassed / (1000 * 60 * 60 * 24 * 30));
  const yearsPassed = Math.floor(timePassed / (1000 * 60 * 60 * 24 * 365));

  let timePast;
  if (secondsPassed < 60) {
    timePast = secondsPassed === 1 ? "1 second" : `${secondsPassed} seconds`;
  } else if (minutesPassed < 60) {
    timePast = minutesPassed === 1 ? "1 minute" : `${minutesPassed} minutes`;
  } else if (hoursPassed < 24) {
    timePast = hoursPassed === 1 ? "1 hour" : `${hoursPassed} hours`;
  } else if (daysPassed < 7) {
    timePast = daysPassed === 1 ? "1 day" : `${daysPassed} days`;
  } else if (weeksPassed < 4) {
    timePast = weeksPassed === 1 ? "1 week" : `${weeksPassed} weeks`;
  } else if (monthsPassed < 12) {
    timePast = monthsPassed === 1 ? "1 month" : `${monthsPassed} months`;
  } else {
    timePast = yearsPassed === 1 ? "1 year" : `${yearsPassed} years`;
  }

  const shortDate = dtObject.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const longDate = dtObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const supaDate = dtObject.toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  return { shortDate, longDate, timePast, supaDate };
}
