renderCalendar() {
  let calendar = this.shadowRoot.querySelector(".calendar");
  calendar.innerHTML = `
    <div class="day-header">Mon</div>
    <div class="day-header">Tue</div>
    <div class="day-header">Wed</div>
    <div class="day-header">Thu</div>
    <div class="day-header">Fri</div>
    <div class="day-header">Sat</div>
    <div class="day-header">Sun</div>
  `;

  let daysInMonth = this.daysInMonth(this.currentYear, this.currentMonth);
  let firstDayOfMonth = new Date(
    this.currentYear,
    this.currentMonth,
    1
  ).getDay();
  let adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  this.events.forEach(function (element) {
    element.position = null;
    element.hidden = false;
  });

  for (let i = 0; i < adjustedFirstDay; i++) {
    let emptyCell = document.createElement("div");
    emptyCell.classList.add("empty-cell");
    calendar.appendChild(emptyCell);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    let y = 0;
    let z = 0;

    let dayElement = document.createElement("div");
    dayElement.className = "day";

    let dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = i;

    let eventSpace = document.createElement("div");
    eventSpace.className = "event-space";

    let eventsForDay = this.events.filter((event) => {
      let eventStartDate = new Date(
        new Date(event.startDate).toDateString()
      );
      let eventEndDate = new Date(new Date(event.endDate).toDateString());
      let dayDate = new Date(this.currentYear, this.currentMonth, i);
      return (
        eventStartDate <= dayDate &&
        eventEndDate >= dayDate &&
        event.hidden == false
      );
    });

    let dayDate = new Date(this.currentYear, this.currentMonth, i);

    let l = 0;

    eventsForDay.forEach((event) => {});

    eventsForDay.forEach((event) => {
      if (event.position != null) {
        [eventsForDay[z], eventsForDay[event.position]] = [
          eventsForDay[event.position],
          eventsForDay[z],
        ];
      }
      if (event.position == null) {
        event.position = z;
      }
      z++;
    });

    eventsForDay.forEach((event) => {
      l++;

      if (typeof event == "undefined") {
        return;
      }

      if (l > 4) {
        event.hidden = true;
        return;
      } else if (event.hidden == true) {
        return;
      }

      let eventItem = document.createElement("div");
      eventItem.className = "event-item";

      let eventStartDate = new Date(event.startDate);
      let eventEndDate = new Date(event.endDate);

      let startHour = eventStartDate.getHours();
      let startMinute = eventStartDate.getMinutes();
      let endHour = eventEndDate.getHours();
      let endMinute = eventEndDate.getMinutes();
      let totalHours = 24;
      let hourHeight = 100 / totalHours;

      // Format the start and end times (HH:mm)
      let startTime = this.formatTime(startHour, startMinute);
      let endTime = this.formatTime(endHour, endMinute);

      // Show time in event item
      eventItem.textContent = `${event.event} (${startTime} - ${endTime})`;

      // Adjust event size based on time duration
      if (eventStartDate.toDateString() !== eventEndDate.toDateString()) {
        eventItem.classList.add("continuous");

        if (
          24 - startHour >= endHour &&
          this.convertMiliseconds(
            new Date(eventEndDate.toDateString()).getTime() -
              new Date(eventStartDate.toDateString()).getTime(),
            "d"
          ) <= 1 &&
          eventStartDate.getDate() == dayDate.getDate()
        ) {
          eventItem.textContent = event.event;
        } else if (
          24 - startHour < endHour &&
          this.convertMiliseconds(
            new Date(eventEndDate.toDateString()).getTime() -
              new Date(eventStartDate.toDateString()).getTime(),
            "d"
          ) <= 1 &&
          eventEndDate.getDate() == dayDate.getDate()
        ) {
          eventItem.textContent = event.event;
        } else if (
          eventStartDate.getDate() + 1 == dayDate.getDate() &&
          this.convertMiliseconds(
            new Date(eventEndDate.toDateString()).getTime() -
              new Date(eventStartDate.toDateString()).getTime(),
            "d"
          ) > 1
        ) {
          eventItem.textContent = event.event;
        } else if (
          dayDate.getMonth() != eventStartDate.getMonth() &&
          dayDate.getDate() == 1
        ) {
          eventItem.textContent = event.event;
        }

        if (eventEndDate.getDate() == i) {
          eventItem.style.width = `${endHour * hourHeight}%`;
        }

        if (eventStartDate.getDate() == i) {
          eventItem.style.width = `${(24 - startHour) * hourHeight}%`;
          eventItem.style.left = `${startHour * hourHeight}%`;
        }

        eventSpace.appendChild(eventItem);
      } else {
        eventItem.style.width = `${(endHour - startHour) * hourHeight}%`;
        eventItem.style.left = `${startHour * hourHeight}%`;
        eventItem.style.flexDirection = "row-reverse";

        eventItem.textContent = `${event.event} (${startTime} - ${endTime})`;
        eventSpace.appendChild(eventItem);
      }

      if (event.position !== 0) {
        eventItem.style.top = `${event.position * 30}px`;
      } else {
        eventItem.style.top = `${eventsForDay.indexOf(event) * 30}px`;
      }
    });

    dayElement.appendChild(dayNumber);
    dayElement.appendChild(eventSpace);
    calendar.appendChild(dayElement);
  }
}

// Utility function to format time as HH:mm
formatTime(hour, minute) {
  let formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
  let formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
  return `${formattedHour}:${formattedMinute}`;
}
