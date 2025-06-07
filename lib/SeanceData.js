class SeanceData {
    constructor(day, time, hall, film) {
        this.day = day;
        this.time = time;
        this.hall = hall;
        this.film = film;
    }

    static async fromPage(page) {
        const day = await page.$eval('.page-nav__day_selected', el => el.textContent);
        const time = await page.$eval('.movie-seances__time', el => el.textContent);
        const hall = await page.$eval('.buying-scheme__hall', el => el.textContent);
        const film = await page.$eval('.movie__title', el => el.textContent);
        
        return new SeanceData(day, time, hall, film);
    }
}

module.exports = SeanceData; 