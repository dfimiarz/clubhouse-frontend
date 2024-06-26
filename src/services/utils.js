/**
 *
 * @param { String } strval String representation of time in format hh:mm
 * @returns { Number ) number of minutes since midnight (00:00) | null
 */
function strTimeToMinutes(strval) {
  if (typeof strval !== "string") return NaN;

  const [hours_str, min_str] = strval.split(":", 2);

  const hours = parseInt(hours_str);
  const min = parseInt(min_str);

  if (!(hours >= 0 && hours <= 24)) return NaN;

  if (!(min >= 0 && min <= 59)) return NaN;

  const total = hours * 60 + min;

  return total > 1440 ? NaN : total;
}

/**
 * Return zero padded hours:minutes representation of minutes since 00:00
 * @param { Number } total_min Number of minutes since 00:00
 * @returns { ( String|null ) } String representation in form hh:mm
 */
function minToTime(total_min) {
  if (typeof total_min !== "number") {
    return null;
  }

  if (total_min < 0 || total_min > 1440) return null;

  let min = total_min % 60;
  let hours = (total_min - min) / 60;

  let min_str = min < 10 ? `0${min}` : `${min}`;
  let hour_str = hours < 10 ? `0${hours}` : `${hours}`;

  return hour_str.concat(":", min_str);
}

function _dateToYear(date) {
  var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
  var dd = date.getDate().toString();

  return [
    date.getFullYear(),
    mm.length === 2 ? "" : "0",
    mm,
    dd.length === 2 ? "" : "0",
    dd,
  ].join("");
}

export default {
  timeToMinutes: strTimeToMinutes,
  dateToYear: _dateToYear,
  minToTime,
};
