var TimeSlot = React.createClass({
    handleMouseOver: function(event) {
    var currentTarget = $(event.currentTarget);

    currentTarget.css('z-index', 9999);
  },

  handleMouseOut: function(event) {
    var currentTarget = $(event.currentTarget);

    currentTarget.css('z-index', 'auto');
  },

  render: function() {
    var slot = this.props && this.props.slot,
        res = <div/>;

    if (slot) {
      var startDate = moment(slot.start),
          endDate = moment(slot.end),
          slotStyle = {
            top: (startDate.hour() - 9 + startDate.minute() / 60) * 75 + 'px',
            height: (endDate.diff(startDate, 'minutes') / 60) * 75 + 'px'
          },
          duration = moment.duration(slot.minute_length, 'minutes'),
          durationHours = duration.hours(),
          durationMinutes = duration.minutes(),
          durationString = [];

      if (durationHours) {
        durationString.push(durationHours + "h");
      }
      if (durationMinutes) {
        durationString.push(durationMinutes + "min");
      }

      var percentageBooked = Math.round(slot.booked_count / slot.max_guests * 100),
          barClass = "progress-bar ",
          panelClass = "timeSlot panel ";

      if (percentageBooked < 25) {
        barClass += "progress-bar-success";
      } else if (percentageBooked < 50) {
        barClass += "progress-bar-info";
      } else if (percentageBooked < 75) {
        barClass += "progress-bar-warning";
      } else {
        barClass += "progress-bar-danger";
      }
      percentageBooked += "%";

      panelClass += this.props.activityStyles[slot.activity_name];

      res = (
        <div className={panelClass} style={slotStyle} data-id={slot.id} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
          <div className="panel-heading">
            <div className="row">
              <h3 className="panel-title col-sm-3">{slot.activity_name}</h3>
              <div className="progress col-sm-offset-3 col-sm-5">
                <div className={barClass} role="progressbar" aria-valuenow={slot.booked_count} aria-valuemin="0" aria-valuemax={slot.max_guests} style={{width: percentageBooked}} >
                  {slot.booked_count} / {slot.max_guests}
                </div>
              </div>
            </div>
          </div>
          <div className="panel-body">
            <span className="time">{startDate.format("h:mm A") + " --> " + endDate.format("h:mm A")}</span>
            <span className="duration"> ({durationString.join(" ")})</span>
          </div>
        </div>
      );
    }

    return res;
  }
});

var Calendar = React.createClass({
  getDefaultProps: function() {
    return {
      activityStyles: {
        "Activity 1": "panel-success",
        "Activity 2": "panel-info",
        "Activity 3": "panel-warning",
      }
    };
  },

  loadTimeSlots: function() {
    var self = this;
    console.log(this.props.url);
    $.get(this.props.url).done(function(data) {
        self.setState({day_1: data});
      }).fail(function(err, status) {
        console.error(self.props.url, status, err.toString());
      });
  },

  adjustOverlaps: function() {
    var timeSlots = $('.timeSlot');

    timeSlots.each(function(index, timeSlot) {
      if (index > 0) {
        var previousTimeSlot = $(timeSlots[index - 1]),
            previousBottom = previousTimeSlot.position().top + previousTimeSlot.height(),
            top = $(timeSlot).position().top;

        if (previousBottom > top) {
          var previousLeft = previousTimeSlot.css('left'),
              newLeft = (parseInt(previousLeft) + 30) % $(timeSlot).width();

          $(timeSlot).css('left', newLeft + 'px');
        }
      }
    });
  },

  componentWillMount: function() {
    this.loadTimeSlots();
  },

  componentDidUpdate: function() {
    this.adjustOverlaps();
  },

  render: function() {
    var slots = this.state && this.state.day_1 && this.state.day_1.timeslots,
        firstSlot = _.first(slots),
        title = firstSlot ? moment(firstSlot.start).format("dddd, MMMM Do YYYY") : "Calendar";

    return (
      <div className="calendar">
        <h1>{title}</h1>
        <div className="day">
          <div className="timeIndex timeIndex0">9 AM</div>
          <div className="timeIndex timeIndex1">1 PM</div>
          <div className="timeIndex timeIndex2">5 PM</div>
          { _.map(slots, function(slot) {
            return <TimeSlot slot={slot} activityStyles={this.props.activityStyles} />
          }, this)}
        </div>
      </div>
    );
  }
});

React.render(<div><Calendar url="/day_1.json"/><Calendar url="/day_2.json"/><Calendar url="/day_3.json"/></div>,
  document.getElementById('content'));
