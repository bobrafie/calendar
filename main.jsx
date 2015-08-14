var TimeSlot = React.createClass({
  // getInitialState: function() {
  //   debugger
  //   return {data: []};
  // },

  render: function() {
    var slot = this.props && this.props.slot,
        res = <div/>;

    if (slot) {
      var startDate = moment(slot.start),
          endDate = moment(slot.end),
          slotStyle = {
            top: startDate.hour() * 20 + 'px',
          };

      res = (
        <div className="timeSlot panel panel-default" style={slotStyle}>
          <div className="panel-heading">
            <h3 className="panel-title">{slot.activity_name} ({slot.id})</h3>
          </div>
          <div className="panel-body">
            <div className="start">{startDate.format("dddd, MMMM Do YYYY, h:mm:ss a")}</div>
            <div className="end">{endDate.format("dddd, MMMM Do YYYY, h:mm:ss a")}</div>
            <div className="length">{slot.minute_length} minutes</div>
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

  componentDidMount: function() {
    this.loadTimeSlots();
  },

  render: function() {
    var slots = this.state && this.state.day_1 && this.state.day_1.timeslots;

    return (
      <div className="calendar">
        <h1>Calendar</h1>
        <div className="day">
          { _.map(slots, function(slot) {
            return <TimeSlot slot={slot} />
          })}
        </div>
      </div>
    );
  }
});

React.render(<Calendar url="/day_1.json"/>,
  document.getElementById('content'));
