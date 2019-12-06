/**
 * 
 * @param { String } strval String representation of time in format hh:hh
 * @returns { Number ) number of minutes since midnight (00:00) | null
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

    return hours * 60 + min

}

/**
 * Return zero padded hours:minutes representation of minutes since 00:00
 * @param { Number } total_min Number of minutes since 00:00
 * @returns { ( String|null ) } String representation in form hh:mm
 */
function minToTime(total_min){

    if( typeof total_min !== "number"){
        return null
    }

    if( total_min < 0 || total_min > 1439 )
        return null
    
    let min = total_min % 60
    let hours = (total_min - min) / 60

    let min_str = min < 10 ? `0${min}` : `${min}`
    let hour_str =  hours < 10 ? `0${hours}` : `${hours}`

    return hour_str.concat(':',min_str)
}

function _dateToYear(date){

    var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = date.getDate().toString();

    return [date.getFullYear(), mm.length===2 ? '' : '0', mm, dd.length===2 ? '' : '0', dd].join(''); 
}

export default {
    timetoInt: strTimetoInt,
    dateToYear: _dateToYear,
    minToTime
}
