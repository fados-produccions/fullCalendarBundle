$(function () {
    /* initialize the calendar
     -----------------------------------------------------------------*/
    //Date for the calendar events (dummy data)
    var date = new Date();
    var d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear();
    $('#calendar-place').fullCalendar({
        monthNames: ["Gener","Febrer","Març","Abril","Maig","Juny","Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre" ],
        monthNamesShort: ['Gen','Feb','Mar','Abr','Mai','Jun','Jul','Ago','Set','Oct','Nov','Des'],
        dayNames: [ 'Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
        dayNamesShort: ['Diu','Dill','Dim','Dix','Dij','Div','Dis'],

        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        buttonText: {
            today: 'today',
            month: 'month',
            week: 'week',
            day: 'day'
        },
        events:
        {
            url:Routing.generate('fullcalendar_loadevents', { month: moment().format('MM'), year: moment().format('YYYY') }),
            color: 'blue',
            textColor:'white',
            error: function() {
                alert('Error receving events');
            }
        },
        viewRender: function (view, element) {
            var month = view.calendar.getDate().format('MM');
            var year = view.calendar.getDate().format('YYYY');
        },
        eventDrop: function(event,delta,revertFunc) {
            var newStartData = event.start.format('YYYY-MM-DD');
            var newEndData = (event.end == null) ? newStartData : event.end.format('YYYY-MM-DD');

            $.ajax({
                url: Routing.generate('fullcalendar_changedate'),
                data: { id: event.id, newStartData: newStartData,newEndData:newEndData  },
                type: 'POST',
                dataType: 'json',
                success: function(response){
                    console.log('ok');
                },
                error: function(e){
                    revertFunc();
                    alert('Error processing your request: '+e.responseText);
                }
            });

        },
        eventResize: function(event, delta, revertFunc) {

            var newData = event.end.format('YYYY-MM-DD');
            $.ajax({
                url: Routing.generate('fullcalendar_resizedate'),
                data: { id: event.id, newDate: newData },
                type: 'POST',
                dataType: 'json',
                success: function(response){
                    console.log('ok');
                },
                error: function(e){
                    revertFunc();
                    alert('Error processing your request: '+e.responseText);
                }
            });

        },
        eventClick: function(calEvent, jsEvent, view) {
            console.log('Event: ' + calEvent.title);
            console.log('Event: ' + calEvent.id);
        },
        editable: true

    });
});