/// @file offhours.js
/// @author Wes Dean <wdean@flexion.us>
/// @brief functions to determine if a date is outside of a workday
/// @details
/// There are times when functions ought to differ based on whether
/// or they take place during business hours (i.e., during a workday)
/// or not.  By default, the date/time considered is the current
/// date / time.  Offhours are defined as:
/// 1. before the start of the workday (before business hours)
/// 2. after the end of the workday (after business hours)
/// 3. on a weekend (Saturday or Sunday)
/// 4. on a US Federal holiday
///   - New Year's Day
///   - Dr. Rev. Martin Luther, Jr. Day
///   - President's Day
///   - Memorial Day
///   - Independence Day
///   - Labor Day
///   - Columbus Day
///   - Veteran's Day
///   - Thanksgiving Day
///   - Christmas Day
/// Note: this does not factor in when holidays are observed on
/// different days.  For example, if Independence Day (July 4th)
/// falls on a Sunday but is declared to be observed on Monday,
/// July 5th, then Monday July 5th is a regular workday, not a
/// holiday.

/// @var {Integer} tzoffset
/// @brief the offset from UTC / GMT in hours
/// @details
/// This is the number of hours from UTC / GMT for the timezone being
/// examined.  For America/New_York (US Eastern), it's -5 for Eastern
/// Standard Time.  When in Daylight Savings Time (DST), we add +1 to
/// this to adjust the (effective) tzoffset to -4.
var tzoffset = -5;

/// @var {Integer} start_hour
/// @brief the hour (24 hour clock) when the workday begins
var start_hour = 9;

/// @var {Integer} end_hour
/// @brief the hour (24 hour clock) when the workday ends
var end_hour = 17;


/// @function is_weekend ()
/// @brief returns True if the date is on the weekend
/// @details
/// If the provided date represents a Saturday or a Sunday, return
/// true; otherwise, return false.  We don't check for DST; however,
/// DST changes on Sunday mornings so +/- one hour doesn't affect
/// whether or not the date is a weekend day or not.
/// @param {Date} the_date the date to examine (defaults to today)
/// @returns {Boolean} True if weekend; False, otherwise
/// @par Example
/// @code
/// var today = new Date ();
///
/// if (is_weekend (today)) {
///   console.log ("Yay!!  Sleep-in day!!");
/// } else {
///   console.log ("Set the alarm -- it's a workday.");
/// }
/// @endcode
function is_weekend (the_date) {

  if (typeof (the_date) === 'undefined') {
    the_date = new Date ();
  }

  var the_day = the_date.getUTCDay ();

  if ((the_day == 0)     // Sunday
  ||  (the_date == 6)) { // Saturday
    return true;
  } else {
    return false;
  }
}


/// @function is_before_hours()
/// @brief returns True if the date before work
/// @details
/// If the date(time) represents a point before hours (by default,
/// 9am Eastern), return true; otherwise, return false.
/// @param {Date} dt_date the date to examine (defaults to today)
/// @returns {Boolean} True if after work; False, otherwise
/// @par Example
/// @code
/// if (is_before_hours ()) {
///   console.log ("Maybe some soda to get ready for work?");
/// }
/// @endcode
function is_before_hours (the_date) {

  if (typeof (the_date) === 'undefined') {
    the_date = new Date();
  }

  var dstoffset = 0;
  
  if (this.is_dst (the_date)) {
    dstoffset = 1;
  } else {
    dstoffset = 0;
  }

  var the_hour = the_date.getUTCHours () + dstoffset + this.tzoffset;

  if (the_hour < this.start_hour) {
    return true;
  } else {
    return false;
  }
}


/// @function is_after_hours()
/// @brief returns True if the date after work
/// @details
/// If the date(time) represents a point after hours (by default,
/// 5pm Eastern), return true; otherwise, return false.
/// @param {Date} dt_date the date to examine (defaults to today)
/// @returns {Boolean} True if after work; False, otherwise
/// @par Example
/// @code
/// if (is_after_hours ()) {
///   console.log ("Probably not a good idea to drink coffee before bed.");
/// }
/// @endcode
function is_after_hours (the_date) {

  if (typeof (the_date) === 'undefined') {
    the_date = new Date();
  }
  
  var dstoffset = 0;

  if (this.is_dst (the_date)) {
    dstoffset = 1;
  } else {
    dstoffset = 0;
  }

  var the_hour = the_date.getUTCHours () + dstoffset + this.tzoffset;

  if (the_hour >= this.end_hour) {
    return true;
  } else {
    return false;
  }
}


/// @function is_dst()
/// @brief returns True if the date is in DST
/// @details
/// checking is based off of check_holiday()
/// from https://www.softcomplex.com/forum/viewthread_2814/
/// logic is based on the NIST rules at:
/// https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst
/// @param {Date} dt_date the date to examine (defaults to today)
/// @returns {Boolean} True if DST; False, otherwise
/// @par Example
/// @code
/// var timezone_offset = 0;
/// var today = new Date ();
///
/// if (is_dst (today)) {
///   timezone_offset = -4;
/// } else {
///   timezone_offset = -5;
/// }
/// @endcode
function is_dst (dt_date) {

  if (typeof (dt_date) === 'undefined') {
    dt_date = new Date();
  }

  // check simple dates (month/date - no leading zeroes)
  var n_date = dt_date.getUTCDate ();
  var n_month = dt_date.getUTCMonth () + 1;

  // weekday from beginning of the month (month/num/day)
  var n_wday = dt_date.getDay ();
  var n_wnum = Math.floor ((n_date - 1) / 7) + 1;

  var s_date2 = n_month + '/' + n_wnum + '/' + n_wday;

  if ((s_date2 >= '3/2/0')  // DST starts 2nd Sunday of March...
  && (s_date2 <  '11/1/1')  // ...and ends 1st Sunday of November.
  ) {
    return true;
  } else {
    return false;
  }
}


/// @function is_holiday()
/// @brief returns True if the date is a US Federal Holiday
/// @details
/// based off of check_holiday()
/// from https://www.softcomplex.com/forum/viewthread_2814/
/// @param {Date} dt_date the date to examine (defaults to today)
/// @returns {Boolean} True if a holiday; False, otherwise
/// @par Example
/// @code
/// if (is_holiday ()) {
///  console.log ("Take some time -- you've earned it!");
/// }
/// @endcode
function is_holiday (dt_date) {

  if (typeof (dt_date) === 'undefined') {
    dt_date = new Date ();
  }

  // check simple dates (month/date - no leading zeroes)
  var n_date = dt_date.getUTCDate ();
  var n_month = dt_date.getUTCMonth () + 1;

  var s_date1 = n_month + '/' + n_date;

  if ((s_date1 == '1/1')  // New Year's Day
  || (s_date1 == '7/4')   // Independence Day
  || (s_date1 == '11/11') // Veterans Day
  || (s_date1 == '12/25') // Christmas Day
  ) return true;

  // weekday from beginning of the month (month/num/day)
  var n_wday = dt_date.getDay ();
  var n_wnum = Math.floor ((n_date - 1) / 7) + 1;

  var s_date2 = n_month + '/' + n_wnum + '/' + n_wday;

  if ((s_date2 == '1/3/1') // Birthday of Martin Luther King, third Monday in January
  || (s_date2 == '2/3/1')  // Washington's Birthday, third Monday in February
  || (s_date2 == '9/1/1')  // Labor Day, first Monday in September
  || (s_date2 == '10/2/1') // Columbus Day, second Monday in October
  || (s_date2 == '11/4/4') // Thanksgiving Day, fourth Thursday in November
  ) return true;

  // weekday number from end of the month (month/num/day)
  var dt_temp = new Date (dt_date);

  dt_temp.setDate (1);
  dt_temp.setMonth (dt_temp.getMonth () + 1);
  dt_temp.setDate (dt_temp.getDate () - 1);

  n_wnum = Math.floor ((dt_temp.getDate () - n_date - 1) / 7) + 1;

  var s_date3 = n_month + '/' + n_wnum + '/' + n_wday;

  if ((s_date3 == '5/1/1')  // Memorial Day, last Monday in May
  ) {
    return true;
  } else {
    return false;
  }
}


/// @function is_offhours
/// @brief returns true if off-hours; false, otherwise
/// @details
/// if it's currently off-hours (defined as weekends plus weekdays
/// before 9am and after 5pm Eastern), then return True.  Otherwise
/// (defined as weekdays between 9am and 5pm Eastern), return False.
///
/// @returns {Boolean} True if off-hours; False, otherwise
/// @par Example
/// @code
/// if (is_offhours ()) {
///    console.log ("Yay!  Nap time!!");
/// } else {
///   console.log ("Get back to work!!");
/// }
/// @endcode
function is_offhours (the_date) {

  if (typeof (the_date) === 'undefined') {
    the_date = new Date();
  }

  if ((this.is_weekend (the_date))     // Saturday or Sunday
  || (this.is_before_hours (the_date)) // before 9am EDT
  || (this.is_after_hours (the_date))  // after 5pm EDT
  || (this.is_holiday (the_date))      // it's a holiday
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = {

  start_hour: start_hour,
  end_hour: end_hour,
  tzoffset: tzoffset,

  is_weekend: is_weekend,
  is_before_hours: is_before_hours,
  is_after_hours: is_after_hours,
  is_holiday: is_holiday,
  is_dst: is_dst,
  is_offhours: is_offhours
};

