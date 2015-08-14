# calendar

This calendar is written using Underscore, React, jQuery, Moment and Boostrap.

### Calendar
The Calendar class generates the calendar for one day.

It takes a url configuration that specifies the endpoint containing the timeslots data.
It also defines preset colors for different activites.

At initialization time, the calendar loads the timeslots data.
After render, it handles overlapping timeslots by progressively shifting them horizontally.
That way, the overlapping slot doesn't completely hide the previous slot.

### TimeSlot
The TimeSlot class generates the box for one timeslot.

It is displayed in a panel colored relative to its activity. The height of the panel is proportional to the duration of the slot.
<br/>A progress bar displays its booking status, with contextual color (from green if relatively free to red if fully booked).
<br/>It also displays the start and end times and the duration of the activity, in hours and minutes.

To see a partially hidden/overlapped timeslot, point your mouse over its visible section.

