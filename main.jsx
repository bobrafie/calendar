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

      res = (
        <div className="timeSlot panel panel-default" style={slotStyle} data-id={slot.id} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
          <div className="panel-heading">
            <h3 className="panel-title">{slot.activity_name}</h3>
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
            return <TimeSlot slot={slot} />
          })}
        </div>
      </div>
    );
  }
});

React.render(<div><Calendar url="/day_1.json"/><Calendar url="/day_2.json"/><Calendar url="/day_3.json"/></div>,
  document.getElementById('content'));
