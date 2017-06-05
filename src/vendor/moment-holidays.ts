//## Moment.JS Holiday Plugin
//
//Usage:
//  Call .holiday() from any moment object. If date is a US Federal Holiday, name of the holiday will be returned.
//  Otherwise, return nothing.
//
//  Example:
//    `moment('12/25/2013').holiday()` will return "Christmas Day"
//
//Holidays:
//  You can configure holiday bellow. The 'M' stands for Month and represents fixed day holidays.
//  The 'W' stands for Week, and represents holidays with date based on week day rules.
//  Example: '10/2/1' Columbus Day (Second monday of october).
//
//License:
//  Copyright (c) 2013 [Jr. Hames](http://jrham.es) under [MIT License](http://opensource.org/licenses/MIT)
import * as Moment from 'moment'
const Holidays = require('date-holidays');
const hd = new Holidays();

//-----------------------------------------------------------------------------
// Moment Extensions
//-----------------------------------------------------------------------------

export function HolidayMoment(moment: any) {
    let local: string;
    /**
     * Build a date range.
     */
    moment.holiday = function holiday(day: any, pLocal: string) {
        if(local !== pLocal){
            local = pLocal;
            hd.init(local);
        }
        if(hd.isHoliday(day._d)){
            return true;
        }else{
            return false;
        }
    };

    /**
     * Alias of static constructor.
     */
    moment.fn.holiday = moment.holiday;

    return moment;
}
