var jira_regex = new RegExp ('\W*((qpp|qta|waka|cmsawsops|tools|whsd)[a-z]*-[0-9]{1,5})\W*', 'gi');
var jira_string_prefix = '*';
var jira_string_suffix = '*: ';
var jira_url_prefix = 'https://jira.cms.gov/browse/';
var jira_url_suffix = '';


/// @function ticket_url
/// @brief given a ticket number, return the corresponding URL
/// @details
/// This function crafts a URL for a given ticket number.
/// @param {String} ticket_number the number of the ticket
/// @returns {String} URL corresponding to the ticket number
function ticket_url (ticket_number) {
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
function has_ticket (string) {

  if (typeof (string) === 'undefined') {
    return false;
  }

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
function ticket_string (ticket_number) {
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
/// @returns {Array} strings representing the ticket numbers found in the string 
function get_ticket_numbers (string) { 
  var results = string.match (this.jira_regex);

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
function is_ticket_in_message (string, ticket_number) {
  return pattern = new RegExp (this.ticket_url (ticket_number)).test (string);
}

 
/// @function add_ticket_urls
/// @brief craft a message from ticket numbers found in the string
/// @details
/// This function accepts a string -- the incoming message -- and
/// creates a response consisting of ticket strings and ticket URLs
/// for the ticket numbers that were found in the string.
/// @param {String} string the string to search
/// @returns {String} the response message
function add_ticket_urls (string) {

  var tickets = this.get_ticket_numbers (string);
    
  if (tickets == null) {
    return false;
  }

  var reply = '';

  for (var i = 0; i < tickets.length; i++) {
    var ticket_number = tickets[i].toUpperCase();

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


