module.exports = {

  jira_regex: function () {
    return '\W*((qpp|qta|waka|cmsawsops|tools|whsd)[a-z]*-[0-9]{1,5})\W*';
  },


  jira_prefix: function () {
    return 'https://jira.cms.gov/browse/';
  },


  ticket_string_prefix: function () {
    return '*';
  },


  ticket_string_suffix: function () {
    return '*: ';
  },


  has_ticket: function (string) {

    if (typeof (string) === 'undefined') {
      return false;
    }

    var pattern = new RegExp (this.jira_regex (), 'gi');

    return pattern.test (string);

  },


  ticket_url: function (ticket_number) {
    return this.jira_prefix() + ticket_number;
  },


  ticket_string: function (ticket_number) {
    return this.ticket_string_prefix () + ticket_number.toUpperCase() + this.ticket_string_suffix ();
  },


  get_ticket_numbers: function (string) {
    var pattern = new RegExp (this.jira_regex (), 'gi');
  
    return string.match (pattern);

  },

  
  is_ticket_in_message: function (string, ticket_number) {
    
    var pattern = new RegExp (this.ticket_url (ticket_number));

    return pattern.test (string);
  },


  add_ticket_urls: function (string) {

    var tickets = this.get_ticket_numbers (string);
    
    if (tickets == null) {
      return false;
    }

    var reply = '';

    
    for (var i = 0; i < tickets.length; i++) {
      var ticket_number = tickets[i].toUpperCase();
      if ((! this.is_ticket_in_message (string, ticket_number))
      && (! this.is_ticket_in_message (reply, ticket_number))) {
        reply += this.ticket_string (ticket_number) + this.ticket_url (ticket_number) + "\n";
      }
    }

    return reply;
  },
}
