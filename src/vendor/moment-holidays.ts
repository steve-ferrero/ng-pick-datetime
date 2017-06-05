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
const _holidays = {
    'M': {//Month, Day
        '01/01': "New Year's Day",
        '07/04': "Independence Day",
        '07/14': "Independence Day",
        '11/11': "Veteran's Day",
        '11/28': "Thanksgiving Day",
        '11/29': "Day after Thanksgiving",
        '12/24': "Christmas Eve",
        '12/25': "Christmas Day",
        '12/31': "New Year's Eve"
    },
    'W': {//Month, Week of Month, Day of Week
        '1/3/1': "Martin Luther King Jr. Day",
        '2/3/1': "Washington's Birthday",
        '5/5/1': "Memorial Day",
        '9/1/1': "Labor Day",
        '10/2/1': "Columbus Day",
        '11/4/4': "Thanksgiving Day"
    }
};

//-----------------------------------------------------------------------------
// Moment Extensions
//-----------------------------------------------------------------------------

export function HolidayMoment(moment: any) {
    /**
     * Build a date range.
     */
    moment.holiday = function holiday(day: any) {
        var diff = 1+ (0 | (moment(day)._d.getDate() - 1) / 7),
            memorial = (moment(day)._d.getDay() === 1 && (moment(day)._d.getDate() + 7) > 30) ? "5" : null;


        if(_holidays['M'][moment(day).format('MM/DD')] || _holidays['W'][moment(day).format('M/'+ (memorial || diff) +'/d')]){
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
