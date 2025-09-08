import Helpers from '../utilities/Helpers'

const ouml = Helpers.HTMLEntity.decode('&ouml;')

describe('Movies App', () => {
    beforeEach(() => {
        cy.visit('')
    })

    it('should have corrct url', () => {
        cy.url().should('equal', 'http://localhost:5173/')
    })

    it('should have one form with id "searchForm"', () => {
        cy.get('form').should('have.length', 1).and('not.have.length.lessThan', 1).and('not.have.length.greaterThan', 1)  .and('have.id', 'searchForm')
    })

    it('should have one input in the form of type text with id "searchText" and placeholder text without value', () => {
        cy.get('form input[type="text"]').should('have.length', 1).and('have.id', 'searchText').and('have.value', '').and('have.attr', 'placeholder').and('match', /[\w-~,."'()[\]{}]+/gi)
    })

    it(`should have one button in the form of type submit with id "search" and text "S${ ouml }k"`, () => {
        cy.get('form button').should('have.length', 1).and('have.id', 'search').and('have.text', `S${ ouml }k`)
    })

    it('should have a container for movies search results with id "movie-container" that is empty', () => {
        cy.get('#movie-container').children().should('have.length', 0)
    })
})