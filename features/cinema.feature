Feature: cinema tests
    # @only
    Scenario: getting e-ticket upon booking a seat
        Given user is on the starting page
        When user selects random day
        When user selects open seance
        When user selects unoccupied seat
        When user clicks button 'Забронировать'
        When user clicks button 'Получить код бронирования'
        Then page with title 'Электронный билет' is opened
    # @only
    Scenario: the seats and time info are as expected
        Given user is on the starting page
        When user selects random day
        When user selects open seance
        When user selects unoccupied seat
        When user clicks button 'Забронировать'
        Then displayed start time, row and seat are correct
    # @only
    Scenario: booking is not allowed if the seat has been already booked
        Given user is on the starting page
        When user selects random day
        When user selects open seance
        When user selects unoccupied seat
        When user clicks button 'Забронировать'
        When user clicks button 'Получить код бронирования'
        When user navigates to the seance with booked seat
        When user clicks on the seat that was booked
        Then button 'Забронировать' stays inactive


