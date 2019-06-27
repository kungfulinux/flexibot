function test_has_ticket (jira_matcher, string, result) {

  console.log ("Testing: " + string);

  if (jira_matcher.has_ticket (string)) {
    console.log ("  matches");
    if (result) {
      console.log ("    correct");
    } else {
      console.log ("    INCORRECT");
    }
  } else {
    console.log ("  does not match");
    if (result) {
      console.log ("    INCORRECT");
    } else {
      console.log ("    correct");
    }
  }
}


function test_add_ticket_urls (jira_matcher, string, response) {

  console.log ("Testing: " + string);

  message = jira_matcher.add_ticket_urls (string);

  console.log ("  " + message);

  if (message == response) {
    console.log ("    correct");
  } else {
    console.log ("    INCORRECT");
  }
}

jira_matcher = require ('./jira_matcher.js');

string1 = "QPPFC-1234";
string2 = "US-EAST-1";
string3 = "qppfcc-1234";
string4 = "https://jira.cms.gov/browse/QPPFC-1234";
string5 = "https://jira.cms.gov/browse/ABCD-1234";
string6 = "QPPFC-";
string7 = "qppfc-1234";
string8 = "QPFC-1234";
string9 = "qppfc-1234 qppfc-5678";
string10 = "QPFC-1234 qppfc-5678";
string11 = "I'm looking at qppfc-123 and I need some advice.";
string12 = "qppfc-1234 QPPFC-1234";

test_has_ticket (jira_matcher, string1, true);
test_has_ticket (jira_matcher, string2, false);
test_has_ticket (jira_matcher, string3, true);
test_has_ticket (jira_matcher, string4, true);
test_has_ticket (jira_matcher, string5, false);
test_has_ticket (jira_matcher, string6, false);
test_has_ticket (jira_matcher, string7, true);
test_has_ticket (jira_matcher, string8, false);
test_has_ticket (jira_matcher, string9, true);
test_has_ticket (jira_matcher, string10, true);
test_has_ticket (jira_matcher, string11, true);
test_has_ticket (jira_matcher, string12, true);

test_add_ticket_urls (jira_matcher, string1, "*QPPFC-1234*: https://jira.cms.gov/browse/QPPFC-1234\n");
test_add_ticket_urls (jira_matcher, string2, "");
test_add_ticket_urls (jira_matcher, string3, "*QPPFCC-1234*: https://jira.cms.gov/browse/QPPFCC-1234\n");
test_add_ticket_urls (jira_matcher, string4, "");
test_add_ticket_urls (jira_matcher, string5, "");
test_add_ticket_urls (jira_matcher, string6, "");
test_add_ticket_urls (jira_matcher, string7, "*QPPFC-1234*: https://jira.cms.gov/browse/QPPFC-1234\n");
test_add_ticket_urls (jira_matcher, string8, "");
test_add_ticket_urls (jira_matcher, string9, "*QPPFC-1234*: https://jira.cms.gov/browse/QPPFC-1234\n*QPPFC-5678*: https://jira.cms.gov/browse/QPPFC-5678\n");
test_add_ticket_urls (jira_matcher, string10, "*QPPFC-5678*: https://jira.cms.gov/browse/QPPFC-5678\n");
test_add_ticket_urls (jira_matcher, string11, "*QPPFC-123*: https://jira.cms.gov/browse/QPPFC-123\n");
test_add_ticket_urls (jira_matcher, string12, "*QPPFC-1234*: https://jira.cms.gov/browse/QPPFC-1234\n");

