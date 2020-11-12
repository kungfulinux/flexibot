/// @file jira_matcher.js
/// @author Wes Dean <wdean@fleixon.us>
/// @brief function library to make links from Jira tickets referenes
/// @details
/// A string of text may include references to Jira tickets, usually
/// of the form, "QPP-1234".  To add convenience, this library has
/// functions to find those ticket references and create a response
/// that includes links to those tickets in Jira.  This response, a
/// string, can be passed back to the caller.  This work is primarily
/// accomplished in the add_ticket_urls() function.


/// @var {String} jira_regex_string
/// @brief the string to use for the RegExp to capture Jira ticket nubmers
var jira_regex_string = '\\b((qpp|qta|waka|cmsawsops|tools|whsd|bedap)[a-z]*-[0-9]{1,5})\\b';

/// @var {String} jira_regex
/// @brief the regular expression used to capture Jira ticket numbers
var jira_regex = new RegExp (jira_regex_string, 'i');

/// @var {String} jira_string_prefix
/// @brief the string to prefix ticket strings 
var jira_string_prefix = '*';

/// @var {String} jira_string_suffix
/// @brief thie string to suffix ticket strings
var jira_string_suffix = '*: ';

/// @var {String} jira_url_prefix
/// @brief the string to prefix ticket URLs
var jira_url_prefix = 'https://jira.cms.gov/browse/';

/// @var {String} jira_url_suffix
/// @brief the string to suffix ticket URLs
var jira_url_suffix = '';


/// @function ticket_url
/// @brief given a ticket number, return the corresponding URL
/// @details
/// This function crafts a URL for a given ticket number.
/// @param {String} ticket_number the number of the ticket
/// @returns {String} URL corresponding to the ticket number
/// @par Example
/// @code
/// console.log ("The URL to QPPFC-1234 is " + ticket_url ("qppfc-1234"));
/// @endcode
function ticket_url (ticket_number) {

  if (typeof (ticket_number) === 'undefined') {
    return '';
  }

  return this.jira_url_prefix + ticket_number.toUpperCase() + this.jira_url_suffix;
}


/// @function has_ticket
/// @brief determine if a string contains any ticket numbers
/// @details
/// This function will return true if the string it was passed contains
/// any ticket numbers (that is, 1 or more ticket numbers such as 
/// 'QPPFC-1234') by applying the Jira RegExp to the string
/// @param {String} string the string to examine
/// @returns {Boolean} true if the string contains 1 or more ticket numbers
/// @par Example
/// @code
/// if (has_ticket ("I'm looking at QPPAR-5678 to see what I can do.")) {
///   console.log ("There is a ticket number in this string.");
/// } else {
///   console.log ("There are no ticket numbers in this string.");
/// }
/// @endcode
function has_ticket (string) {

  if (typeof (string) === 'undefined') {
    return false;
  }

  console.log ("*** " + this.jira_regex.test (string));
  return this.jira_regex.test (string);

}


/// @function ticket_string
/// @brief given a ticket number, return a crafed ticket string
/// @details
/// A "ticket_string" is what we put as a label before the ticket's URL
/// in the corresponding message.  Generally, it's the ticket number
/// along with some markup to make it stand out (e.g., make the string
/// appear bold-face).
/// @param {String} ticket_number the number of the ticket
/// @returns {String} ticket string corresponding to the ticket
/// @par Example
/// @code
/// console.log (ticket_string ("QPP-1234"));
/// @endcode
function ticket_string (ticket_number) {

  if (typeof (ticket_number) === 'undefined') {
    return '';
  }

  return this.jira_string_prefix + ticket_number.toUpperCase() + this.jira_string_suffix;
}


/// @function get_ticket_numbers
/// @brief return an array of ticket numbers from a string
/// @details
/// Apply the match() method on the string that was passed to find all 
/// ticket numbers in said string.  Each element of the resulting array
/// is a ticket number.  Multiple references to a single ticket number 
/// result in multiple elements in the return array.  
/// returned.
/// @param {String} string the string to search
/// @returns {Object} strings representing the ticket numbers found in the string 
/// @par Example
/// @code
/// tickets_in_message = get_ticket_numbers (message);
/// @endcode
function get_ticket_numbers (string) {

  if (typeof (string) === 'undefined') {
    return new Array ();
  }

  var results = string.match (new RegExp (this.jira_regex, 'gi'));

  if (results) {
    return results;
  } else {
    return new Array ();
  }
}

 
/// @function is_ticket_in_message
/// @brief return true if a given ticket number's URL is in the string
/// @details
/// We don't want to return the same ticket URL multiple times in the
/// messasge, so this will test to see if the ticket's URL is in the
/// string or not.
/// @param {String} string the string to search
/// @param {String} ticket_number the ticket number for which to search
/// @returns {Boolean} true if the ticket's URL is in the string
/// @par Example
/// @code
/// if (is_ticket_in_message (message, "QPPFC-1234")) {
///   console.log ("This ticket's URL is in the message.");
/// } else {
///   console.log ("This ticket's URL is NOT in the message.");
/// }
/// @endcode
function is_ticket_in_message (string, ticket_number) {

  if ((typeof (string) === 'undefined')
  ||  (typeof (ticket_number) === 'undefined')
  ) {
    return false;
  }

  return new RegExp (this.ticket_url (ticket_number)).test (string);
}

 
/// @function add_ticket_urls
/// @brief craft a message from ticket numbers found in the string
/// @details
/// This function accepts a string -- the incoming message -- and
/// creates a response consisting of ticket strings and ticket URLs
/// for the ticket numbers that were found in the string.
/// @param {String} string the string to search
/// @returns {String} the response message or empty string if no (new) ticket numbers
/// @par Example
/// @code
/// outgoing = add_ticket_urls (incoming);
/// @endcode
function add_ticket_urls (string) {

  if (typeof (string) === 'undefined') {
    return '';
  }

  var tickets = this.get_ticket_numbers (string);
    
  if (tickets == null) {
    return '';
  }

  var reply = '';

  for (var i = 0; i < tickets.length; i++) {
    var ticket_number = tickets[i].toUpperCase().trim();

    // only add the ticket string if the corresponding URL is not in
    // either the incoming message or already in the reply (no duplicates)
    if ((! this.is_ticket_in_message (string, ticket_number))
    && (! this.is_ticket_in_message (reply, ticket_number))) {

      reply += this.ticket_string (ticket_number) + this.ticket_url (ticket_number) + "\n";
    
    }
  }

  return reply;

}


module.exports = {
  jira_regex: jira_regex,
  jira_regex_string: jira_regex_string,
  jira_string_prefix: jira_string_prefix,
  jira_string_suffix: jira_string_suffix,
  jira_url_prefix: jira_url_prefix,
  jira_url_suffix: jira_url_suffix,

  ticket_url: ticket_url,
  has_ticket: has_ticket,
  ticket_string: ticket_string,
  get_ticket_numbers: get_ticket_numbers,
  is_ticket_in_message: is_ticket_in_message,
  add_ticket_urls: add_ticket_urls
};


