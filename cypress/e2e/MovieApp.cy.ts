import Helpers from '../utilities/Helpers'

enum ID {
    SEARCH_FORM = 'searchForm',
    SEARCH_TEXT = 'searchText',
    SEARCH_BUTTON = 'search',
    MOVIE_CONTAINER = 'movie-container'
}

const ouml = Helpers.HTMLEntity.decode('&ouml;'), API_URL = 'http://omdbapi.com/*', defaultIntercept = () => {
    cy.intercept('GET', API_URL, {
        statusCode: 200  
    })    
}, searchForLotR = () => {
    cy.get(`#${ ID.SEARCH_TEXT }`).type('Lord of the Rings')
    cy.get(`#${ ID.SEARCH_BUTTON }`).click()
}

describe('Movies App', () => {
    beforeEach(() => {
        cy.visit('')
    })

    it('should have corrct url', () => {
        cy.url().should('equal', 'http://localhost:5173/')
    })

    it(`should have one form with id "${ ID.SEARCH_FORM }"`, () => {
        cy.get('form').should('have.length', 1).and('not.have.length.lessThan', 1).and('not.have.length.greaterThan', 1).and('have.id', ID.SEARCH_FORM)
    })

    it('should have one input in the form of type text with id "searchText" and placeholder text without value', () => {
        cy.get(`#${ ID.SEARCH_FORM } input[type="text"]`).should('have.length', 1).and('have.id', ID.SEARCH_TEXT).and('have.value', '').and('have.attr', 'placeholder').and('match', /[\w-~,."'()[\]{}]+/gi)
    })

    it(`should have one button in the form of type submit with id "search" and text "S${ ouml }k"`, () => {
        cy.get(`#${ ID.SEARCH_FORM } button`).should('have.length', 1).and('have.id', ID.SEARCH_BUTTON).and('have.text', `S${ ouml }k`)
    })

    it('should have a container for movies search results with id "movie-container" that is empty', () => {
        cy.get(`#${ ID.MOVIE_CONTAINER }`).children().should('have.length', 0)
    })

    it('should search for movies but find none and display a message accordingly', () => {
        defaultIntercept()  

        searchForLotR()

        cy.get(`#${ ID.MOVIE_CONTAINER }`).children().should('have.length', 1).parent().children('p').should('have.length', 1).and('have.text', `Inga s${ ouml }kresultat att visa`)
    })

    it('should search for movies and displa 10 movie cards', () => {
        cy.intercept('GET', API_URL, {
            statusCode: 200,
            fixture: 'Lord_of_the_Rings.json'
        })

        searchForLotR()

        cy.get(`#${ ID.MOVIE_CONTAINER }`).children().should('have.length', 10)
    })

    // Live tests to be uncommented/turned on later.

    /* it('should search for movies and display 10 movie cards', () => {
        searchForLotR()

        cy.get(`#${ ID.MOVIE_CONTAINER }`).children().should('have.length', 10)
    }) */
})