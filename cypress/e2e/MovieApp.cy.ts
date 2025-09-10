import { identity } from '../../node_modules/cypress/types/lodash/index'
import Helpers from '../utilities/Helpers'

enum ID {
    SEARCH_FORM = 'searchForm',
    SEARCH_TEXT = 'searchText',
    SEARCH_BUTTON = 'search',
    MOVIE_CONTAINER = 'movie-container'
}

const ouml = Helpers.HTMLEntity.decode('&ouml;'), API_URL = '**://omdbapi.com/*', errMSG = `Inga s${ ouml }kresultat att visa`, intercept = {
    default: () => {
        intercept.success('empty_search.json')
    },
    success: (fixture: string) => {
        intercept.custom(200, fixture)
    },
    custom: (statusCode: number, fixture: string) => {
        cy.intercept('GET', API_URL, {
            statusCode,
            fixture
        })
    }
}, longSearchText = 'fragment declared parabola scoop nuptials owl rupture bronzing scant mumbling partly preplan container gumming overact stout crewmate phrasing broadways frequency botany chlorine blatancy apply shallow retrial jailer decathlon suds routine proofing drift reabsorb requisite carnival vanquish undermine corrode defy zoom triage tragedy plow conch wildfire roman undying mower famished anyone reviver autograph sublevel tables flypaper untimed prewar tinsel reminder steadying phrase domain tinsmith reformat diary',
fillSearchInput = (str: string) => {
    cy.get(`#${ ID.SEARCH_TEXT }`).type(str)
}, searchForLotR = () => {
    fillSearchInput('Lord of the Rings')
    cy.get(`#${ ID.SEARCH_BUTTON }`).click()
}, checkForErrMsg = () => {
    cy.get(`#${ ID.MOVIE_CONTAINER } p`).should('have.length', 1).and('have.text', errMSG)
}

describe('Movie App', () => {
    beforeEach(() => {
        cy.visit('')
    })

    it('should visit correct address', () => {
        cy.url().should('eq', 'http://localhost:5173/')
    })

    it(`should have one form with id "${ ID.SEARCH_FORM }"`, () => {
        cy.get('form').should('have.length', 1).and('not.have.length.lt', 1).and('not.have.length.gt', 1).and('have.id', ID.SEARCH_FORM)
    })

    it('should have one input in the form of type text with id "searchText" and placeholder text without value', () => {
        cy.get(`#${ ID.SEARCH_FORM } input[type="text"]`).should('have.length', 1).and('have.id', ID.SEARCH_TEXT).and('have.value', '').and('have.attr', 'placeholder').and('match', /[\w-~,."'()[\]{}]+/gi)
    })

    it(`should have one button in the form of type submit with id "search" and text "S${ ouml }k"`, () => {
        cy.get(`#${ ID.SEARCH_FORM } button`).should('have.length', 1).and('have.id', ID.SEARCH_BUTTON).and('have.text', `S${ ouml }k`)
    })

    it('should have a container for movies search results with id "movie-container" that is empty', () => {
        cy.get(`#${ ID.MOVIE_CONTAINER }`).should('exist').children().should('have.length', 0)
    })

    it('should search for movies but find none and display a message accordingly', () => {
        intercept.default()  

        searchForLotR()

        cy.get(`#${ ID.MOVIE_CONTAINER }`).children().should('have.length', 1).parent().children('p').should('have.length', 1).and('have.text', errMSG)
    })

    it('should search for movies and displa 10 movie cards', () => {
        intercept.success('Lord_of_the_Rings.json')

        searchForLotR()

        cy.get(`#${ ID.MOVIE_CONTAINER }`).children().should('have.length', 10)
    })

    it('should fail gracefully if status code is 404', () => {
        intercept.custom(404, 'Lord_of_the_Rings.json')

        searchForLotR()

        checkForErrMsg()
    })

    it('should fail gracefully if API is down', () => {
        intercept.custom(500, 'Lord_of_the_Rings.json')

        searchForLotR()

        checkForErrMsg()
    })

    it('should handle no search prop from API gracefully', () => {
        intercept.success('Lord_of_the_Rings_noSearch.json')

        searchForLotR()

        checkForErrMsg()
    })

    it('should handle empty search strings', () => {
        intercept.default()

        fillSearchInput('{ENTER}')

        checkForErrMsg()
    })

    it('should handle long search strings', () => {
        intercept.success('empty_search.json')

        fillSearchInput(`${ longSearchText }{ENTER}`)

        checkForErrMsg()
    })

    // Live tests to be uncommented/turned on later.
    /* 
    it('should search for movies and display 10 movie cards live', () => {
        searchForLotR()

        cy.get(`#${ ID.MOVIE_CONTAINER }`).children().should('have.length', 10)
    })

    it('should handle empty search strings live', () => {
        cy.get(`#${ ID.SEARCH_TEXT }`).should('have.text', '').type('{ENTER}')

        checkForErrMsg()
    })

    it('should handle long search strings live', () => {
        fillSearchInput(`${ longSearchText }{ENTER}`)

        checkForErrMsg()
    })
     */
})