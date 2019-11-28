/**
 * 
 * @param { String } strval String representation of time in format HH:MM
 * @returns number of minutes since midnight (00:00) | null
 */
function strTimetoInt(strval){

    if (! strval )
        return 0

    const [hours_str, min_str] = strval.split(':', 2)

    const hours = parseInt(hours_str)
    const min = parseInt(min_str)

    if (!(hours >= 0 && hours <= 23))
        return 0

    if (!(min >= 0 && min <= 59))
        return 0

    return parseInt(hours) * 60 + parseInt(min)

}
function _dateToYear(date){

    var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = date.getDate().toString();

    return [date.getFullYear(), mm.length===2 ? '' : '0', mm, dd.length===2 ? '' : '0', dd].join(''); 
}

export default {
    timetoInt: strTimetoInt,
    dateToYear: _dateToYear
}
