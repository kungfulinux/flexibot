function test_date (offhours, the_date, before, after, weekend, holiday, result) {

  console.log (the_date.toString());

  if (offhours.is_before_hours (the_date)) {
    console.log ('  before hours');
    if (before) {
      console.log ('    correct');
    } else {
      console.log ('    INCORRECT');
    }
  } else {
    console.log ('  not before hours');
    if (before) {
      console.log ('    INCORRECT');
    } else {
      console.log ('    correct');
    }
  }

  if (offhours.is_after_hours (the_date)) {
    console.log ('  after hours');
    if (after) {
      console.log ('    correct');
    } else {
      console.log ('    INCORRECT');
    }
  } else {
    console.log ('  not after hours');
    if (after) {
      console.log ('    INCORRECT');
    } else {
      console.log ('    correct');
    }
  }

  if (offhours.is_weekend (the_date)) {
    console.log ('  weekend');
    if (weekend) {
      console.log ('    correct');
    } else {
      console.log ('    INCORRECT');
    }
  } else {
    console.log ('  not a weekend');
    if (weekend) {
      console.log ('    INCORRECT');
    } else {
      console.log ('    correct');
    }
  }

  if (offhours.is_holiday (the_date)) {
    console.log ('  holiday');
    if (holiday) {
      console.log ('    correct');
    } else {
      console.log ('    INCORRECT');
    }
  } else {
    console.log ('  not a holiday')
    if (holiday) {
      console.log ('    INCORRECT');
    } else {
      console.log ('    correct');
    }
  }

  if (offhours.is_offhours (the_date)) {
    console.log ('  off-hours');
    if (result) {
      console.log ('    correct');
    } else {
      console.log ('    INCORRECT');
    }
  } else {
    console.log ('  not off-hours');
    if (result) {
      console.log ('    INCORRECT');
    } else {
      console.log ('    correct');
    }
  }
}


var offhours = require ('./offhours/offhours.js');

// noon UTC on Monday, June 24, 2019 (during work hours)
date1 = new Date ('June 24, 2019 12:00:00');

// 7pm UTC on Monday, June 24, 2019 (after hours)
date2 = new Date ('June 24, 2019 19:00:00');

// 3am UTC on Monday, June 24, 2019 (before hours)
date3 = new Date ('June 24, 2019 03:00:00');

// noon UTC on Sunday, June 23rd, 2019 (weekend)
date4 = new Date('June 23, 2019 12:00:00');

// noon UTC on July 4th (holiday)
date5 = new Date('July 4, 2019 12:00:00');


test_date (offhours, date1, false, false, false, false, false);
test_date (offhours, date2, false, true, false, false, true);
test_date (offhours, date3, true, false, false, false, true);
test_date (offhours, date4, false, false, true, false, true);
test_date (offhours, date5, false, false, false, true, true);
