class SeanceData {
    constructor(dayTimestamp, date, time, movie, hall, rowSeat) {
    	this.dayTimestamp = dayTimestamp;
        this.date = date;
        this.time = time;
        this.movie = movie;
        this.hall = hall;
        this.rowSeat = rowSeat;
        }

    async setDayTimestamp(element) {
        this.dayTimestamp = await element.evaluate(el => el.getAttribute('data-time-stamp'));
    }

    async setDate(element) {
        const timestampStr = await element.evaluate(el => el.getAttribute('data-time-stamp'));
        const timestamp = parseInt(timestampStr, 10) * 1000;
        const date = new Date(timestamp);
        this.date = date.toISOString().split('T')[0];
    }

    async setTime(element) {
        this.time = await element.evaluate(el => el.textContent.trim());
    }

    setRowSeat(row, seat) {
        this.rowSeat = `${row}/${seat}`;
    }

    async setMovie(element) {
        this.movie = await element.evaluate(el => el.textContent.trim());
    }

    async setHall(element) {
        this.hall = await element.evaluate(el => el.textContent.trim());
    }
}

module.exports = SeanceData;
