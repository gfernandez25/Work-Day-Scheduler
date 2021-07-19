(function ($) {
    $("#currentDay").html(moment().format("dddd MMMM Do, YYYY"));
    $('.container').append(generateTimeSlots('9:00am', '5:00pm'));
})(jQuery);

function generateTimeSlots(startTime, endTime) {
    var duration = moment.duration(moment(endTime, 'h:mma').diff(moment(startTime, 'h:mma'))).asHours();
    var timeSlots = [];
    var localStorageEvents = getLocalStorage('timeSlots')

    for (var i = 0; i <= duration; i++) {
        var data = {}
        data.hour = moment(startTime, 'h:mma').add(i, "h");
        data.timeSlot = data.hour.format("hA");
        data.color = setTimeSlotColor(data.hour);
        data.event = localStorageEvents[data.timeSlot]

        var row = timeslotTemplate(data)
            .on("click", '.present + .saveBtn, .future + .saveBtn', data, function ($event) {

                var timeSlots = getLocalStorage('timeSlots');
                timeSlots[$event.data.timeSlot] = $(this).siblings("input").val();
                setLocalStorage('timeSlots', timeSlots)
            })

        timeSlots.push(row);
    }

    return timeSlots;
}

function timeslotTemplate(data) {
    var hour = $('<span class="hour" />')
        .html(data.timeSlot);

    var input = $('<input type="text">')
        .attr('disabled', getDisabled(data.color))
        .addClass(data.color)
        .val(data.event);

    var saveBtn = $('<button class="btn saveBtn "><i class="fa fa-save"></i></button>')
        .attr('disabled', getDisabled(data.color))

    return $("<div class='row' />")
        .append(hour, input, saveBtn)
}

function setTimeSlotColor(hour) {
    if (hour.isBefore(moment(), 'hour')) {
        return 'past'
    } else if (hour.isSame(moment(), 'hour')) {
        return 'present'
    } else {
        return 'future'
    }
}

function getDisabled(color) {
    return color === 'past';
}

function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
    var data = localStorage.getItem(key);
    return !!data ? JSON.parse(data) : {};
}

