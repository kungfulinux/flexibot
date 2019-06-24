module.exports = {

/// @function is_weekend ()
/// @brief returns True if the date is on the weekend
/// @details
/// If the provided date represents a Saturday or a Sunday, return
/// true; otherwise, return false.  We don't check for DST; however,
/// DST changes on Sunday mornings so +/- one hour doesn't affect
/// whether or not the date is a weekend day or not.
/// @param {Date} the_date the date to examine (defaults to today)
/// @returns {Boolean} True if weekend; False, otherwise
  is_weekend: function (the_date) {

    if (typeof (the_date) === 'undefined') {
      the_date = new Date();
    }

    the_day = the_date.getUTCDay();

    if ((the_day == 0)     // Sunday
    ||  (the_date == 6)) { // Saturday
      return true;  
    } else {
      return false;
    }
  },


/// @function is_before_hours()
/// @brief returns True if the date before work
/// @details
/// If the date(time) represents a point before hours (by default,
/// 9am Eastern), return true; otherwise, return false.
/// @param {Date} dt_date the date to examine (defaults to today)
/// @param {Integer} start_hour the first hour of work (defaults to 9am Eastern))
/// @param {Integer} tzoffset the timezone offset (defaults to -5 (Eastern)
/// @returns {Boolean} True if after work; False, otherwise 
  is_before_hours: function (the_date, start_hour, tzoffset) {

    if (typeof (the_date) === 'undefined') {
      the_date = new Date();
    }

    if (typeof (start_hour) === 'undefined') {
      start_hour = 9;
    }

    if (typeof (tzoffset) === 'undefined') {
      tzoffset = -5;
    }

    if (this.is_dst (the_date)) {
      dstoffset = 1;
    } else {
      dstoffset = 0;
    }

    the_hour = the_date.getUTCHours() + dstoffset + tzoffset;

    if (the_hour < start_hour) {
      return true;
    } else {
      return false;
    }
  },


/// @function is_after_hours()
/// @brief returns True if the date after work
/// @details
/// If the date(time) represents a point after hours (by default,
/// 5pm Eastern), return true; otherwise, return false.
/// @param {Date} dt_date the date to examine (defaults to today)
/// @param {Integer} end_hour the first hour after work (defaults to 5pm Eastern)
/// @param {Integer} tzoffset the timezone offset (defaults to -5 (Eastern)
/// @returns {Boolean} True if after work; False, otherwise 
  is_after_hours: function (the_date, end_hour, tzoffset) {

    if (typeof (the_date) === 'undefined') {
      the_date = new Date();
    }

    if (typeof (end_hour) === 'undefined') {
      end_hour = 17;
    }

    if (typeof (tzoffset) === 'undefined') {
      tzoffset = -5;
    }

    if (this.is_dst (the_date)) {
      dstoffset = 1;
    } else {
      dstoffset = 0;
    }

    the_hour = the_date.getUTCHours() + dstoffset + tzoffset;

    if (the_hour >= end_hour) {
      return true;
    } else {
      return false;
    }
  },


/// @function is_dst()
/// @brief returns True if the date is in DST
/// @details
/// checking is based off of check_holiday()
/// from https://www.softcomplex.com/forum/viewthread_2814/
/// logic is based on the NIST rules at:
/// https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst
/// @param {Date} dt_date the date to examine (defaults to today)
/// @returns {Boolean} True if DST; False, otherwise
  is_dst: function (dt_date) {
    if (typeof (dt_date) === 'undefined') {
      dt_date = new Date();
    }

// check simple dates (month/date - no leading zeroes)
	  var n_date = dt_date.getUTCDate(),
	  	n_month = dt_date.getUTCMonth() + 1;

    // weekday from beginning of the month (month/num/day)
	  var n_wday = dt_date.getDay(),
		  n_wnum = Math.floor((n_date - 1) / 7) + 1;

	  var s_date2 = n_month + '/' + n_wnum + '/' + n_wday;

	  if ((s_date2 >= '3/2/0')  // DST starts 2nd Sunday of March...
    &&  (s_date2 <  '11/1/1') // and ends 1st Sunday of November.
    ) {
      return true;
    } else {
      return false;
    }
  },


/// @function is_holiday()
/// @brief returns True if the date is a US Federal Holiday
/// @details
/// based off of check_holiday()
/// from https://www.softcomplex.com/forum/viewthread_2814/
/// @param {Date} dt_date the date to examine (defaults to today)
/// @returns {Boolean} True if a holiday; False, otherwise
  is_holiday: function (dt_date) {

    if (typeof (dt_date) === 'undefined') {
      var dt_date = new Date();
    }

	  // check simple dates (month/date - no leading zeroes)
	  var n_date = dt_date.getUTCDate(),
	  	n_month = dt_date.getUTCMonth() + 1;

  	var s_date1 = n_month + '/' + n_date;

	  if (s_date1 == '1/1'   // New Year's Day
	  	|| s_date1 == '6/14'  // Flag Day
  		|| s_date1 == '7/4'   // Independence Day
   		|| s_date1 == '11/11' // Veterans Day
	  	|| s_date1 == '12/25' // Christmas Day
	  ) return true;

	  // weekday from beginning of the month (month/num/day)
	  var n_wday = dt_date.getDay(),
		  n_wnum = Math.floor ((n_date - 1) / 7) + 1;

	  var s_date2 = n_month + '/' + n_wnum + '/' + n_wday;

	  if (s_date2 == '1/3/1'  // Birthday of Martin Luther King, third Monday in January
		  || s_date2 == '2/3/1'  // Washington's Birthday, third Monday in February
		  || s_date2 == '9/1/1'  // Labor Day, first Monday in September
		  || s_date2 == '10/2/1' // Columbus Day, second Monday in October
		  || s_date2 == '11/4/4' // Thanksgiving Day, fourth Thursday in November
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

  },


/// @function is_offhours
/// @brief returns true if off-hours; false, otherwise
/// @details
/// if it's currently off-hours (defined as weekends plus weekdays
/// before 9am and after 5pm Eastern), then return True.  Otherwise
/// (defined as weekdays between 9am and 5pm Eastern), return False.
///
/// @returns {Boolean} True if off-hours; False, otherwise
  is_offhours: function (the_date) {

    if (typeof (the_date) === 'undefined') {
      the_date = new Date();
    }

    if ((this.is_weekend (the_date))  // Saturday or Sunday
    ||  (this.is_before_hours (the_date)) // before 9am EDT
    ||  (this.is_after_hours (the_date)) // after 5pm EDT
    ||  (this.is_holiday(the_date))
    ) {
      return true;
    } else {
      return false;
    }
  }
};
