# Design fixes in deashboard

## Overview

The following changes should be implemented to improve user experience.

## Changes

### Dashboard main page

- Add an 'add event' button. It should be on the right side of the header (date and Buna, Maira) and move under Buna, Maria when on small screen (do not collapse into a +)
- Remove the 'Your next invitation locks for editing tomorrow — 24 hours before the event'
- Below the YOUR EVENTS add something like this: Each event is one record and one purchase. Each event has an invitation with a Response form so you can track and
  manage guest.
- Instead of your events write your active events and remove the tabs, now it shows only the active events.
- Move the 5 buttons from the event card to Events > list.
- Instead of 5 buttons Make the whole event card a button that goes to events > scroll to the clicked event. Come up with a good hover state (BUT DO NOT change the background color of the card)
- add somewhere suitable when the response form closes (the date only, if the time is set to 00, add the time too if there's a set time for it) - apply this time add/not add logic to the events page too
- Under the attendee safeguard (and under '5 names din't...' is there's any warning) add notes like 6 children and 2 babies among the attendees. and something like x with vegan dietary needs
- remove any tag beside the warning tags like 'locks in 30 hours' - and make that tag more direct like 'editing locks in 30 hours' think of other warnings for there like 'safeguard at 80%' 'rsvp closes in x days'
- remove the raise cap button from below the attendee bar

### Events page

- Each event is one ... should be the same text as the one under the YOUR ACTIVE EVENTS on the main page
- separate the events list to cards (like on the dashboard)
- now these card should have the 5 buttons from the dashboard and add a 6th edit invitation btn after the edit btn - stack them nicely on small screens
- the card should not have a hover state
- the card should look like this: on far left the image, on its right add a column with the event details (date, time, tags - protected, custom but no warning tags.) below that put the rsvp section (take the rsvp info section from the main page card as it is EXCEPT in the events page card leave the raise link, and do not add the info like unmatched names or x children attending details below it.) The Dates that matter should be on the far right in its own column - make them look the save way as it is now in the editing event card

### Dashboard nav

- Hosting has: Dashboard, Events, Invitations
- Studio has: prints and downloads and templates.
