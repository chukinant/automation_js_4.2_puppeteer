const SeanceData = require('./utils.js');

module.exports = {
    clickElement: async function(page, selector) {
        try {
            await page.waitForSelector(selector);
            await page.click(selector);
        } catch(error) {
            throw new Error(`Selector is not clickable: ${selector}`);
        }
    },

    selectRandomDay: async function(page, seanceData) {
        try {
            const dayElements = await page.$$(`a.page-nav__day`);
            if (dayElements.length === 0) {
                throw new Error(`No available seance found`);
            }
            const randomIndex = Math.floor(Math.random() * dayElements.length);
            const dayElement = dayElements[randomIndex];
            await seanceData.setDayTimestamp(dayElement);
            await seanceData.setDate(dayElement);
            await dayElement.click();
        } catch(error) {
            throw new Error(`Failed to choose day: ${error.message}`);
        }
    },

    selectOpenSeance: async function(page, seanceData) {
        try {
            const seanceElement = await page.$('.movie-seances__time:not(.acceptin-button-disabled)');
            if (!seanceElement) {
                throw new Error('No available seance found');
            }
            await seanceData.setTime(seanceElement);
            await seanceElement.click();
        } catch(error) {
            throw new Error(`Failed to choose seance: ${error.message}`);
        }
    },

    getFirstFreeSeatHandle: async function(page) {
        try {
            await page.waitForSelector('.buying-scheme__chair');
            const rows = await page.$$('.buying-scheme__row');
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                const seats = await rows[rowIndex].$$('.buying-scheme__chair');
                for (let seatIndex = 0; seatIndex < seats.length; seatIndex++) {
                    const className = await seats[seatIndex].evaluate(el => el.className);
                    if (!className.includes('taken') && !className.includes('disabled')) {
                        return {
                            elementHandle: seats[seatIndex],
                            row: rowIndex + 1,
                            seat: seatIndex + 1
                        };
                    }
                }
            }
            throw new Error('No free seats found');
        } catch(error) {
            throw new Error(`Failed to find seat: ${error.message}`);
        }
    },
      
    selectUnoccupiedSeat: async function(page, seanceData) {
        try {
            const unoccupiedSeat = await this.getFirstFreeSeatHandle(page);
            seanceData.setRowSeat(unoccupiedSeat.row, unoccupiedSeat.seat);
            const movieElement = await page.$('.buying__info-title');
            const hallElement = await page.$('.buying__info-hall');
            await seanceData.setMovie(movieElement);
            await seanceData.setHall(hallElement);
            await unoccupiedSeat.elementHandle.click();
        } catch(error) {
            throw new Error('Failed to find seat');
        }
    },

    findAndClickSeance: async function(page, movieTitle, hallName, startTime) {
        const seanceHandle = await page.evaluateHandle(({ movieTitle, hallName, startTime }) => {
          const movieSections = Array.from(document.querySelectorAll('section.movie'));
      
          for (const section of movieSections) {
            const titleEl = section.querySelector('h2.movie__title');
            if (!titleEl) continue;
      
            const title = titleEl.textContent.trim();
            if (title !== movieTitle) continue;
      
            const halls = section.querySelectorAll('.movie-seances__hall');
            for (const hall of halls) {
              const hallTitleEl = hall.querySelector('.movie-seances__hall-title');
              if (!hallTitleEl) continue;
      
              const hallTitle = hallTitleEl.textContent.trim();
              if (hallTitle !== hallName) continue;
      
              const timeLinks = hall.querySelectorAll('a.movie-seances__time');
              for (const timeLink of timeLinks) {
                if (timeLink.textContent.trim() === startTime) {
                  timeLink.scrollIntoView(); // ensure visible
                  timeLink.click();
                  return true;
                }
              }
            }
          }
          return false;
        }, { movieTitle, hallName, startTime });
        const wasClicked = await seanceHandle.jsonValue();

        if (!wasClicked) {
          throw new Error(`Seance not found: ${movieTitle} | ${hallName} | ${startTime}`);
        }
      },
      
    selectOccupiedSeat: async function(page) {
        try {
            await page.waitForSelector('.buying-scheme__chair_taken');
            const occupiedSeat = await page.$('.buying-scheme__chair_taken');
            if (!occupiedSeat) {
                throw new Error('No occupied seats found');
            }
            await occupiedSeat.click();
        } catch(error) {
            throw new Error('Failed to find occupied seat');
        }
    },

};
