/// <reference types="Cypress" />

describe('Audio Network search tests', () => {

    const getSearchInput = () => cy.get('#js-keyword')
    const getSearchButton = () => cy.get('#js-button')
    const getAllSearchKeywords = () => cy.get('.typeahead__keywords')
    const getSearchResultsText = () => cy.get('.search-results__title')
    const getSearchResults = () => cy.get('.track-section-container')
    const getAllPurchaseButtons = () => cy.get('.btns > div > .js-select-usage')

    const searchForItems = (searchText) => {
        getSearchInput().type(searchText)
        getAllSearchKeywords().first().should('contain.text', searchText)
        getSearchButton().click()
    }

    const waitForSearchResults = () => {
        getSearchResultsText().should('contain.text', 'results')
        getSearchResults().children().should('have.length', 25)
    }

    beforeEach(() => {
        cy.visit('/track/searchkeyword')
    })

    it('should be able to search for an item and see results and an option to buy', () => {
        //act
        searchForItems('rock')

        //assert
        waitForSearchResults()
        getAllPurchaseButtons().should('have.length', 25)
    })

    it("should select 'Celebration' from the Mood/emotion and combine this with the 'Hide mixes' option to see results", () => {
        //act
        cy.get('#facetFilterMoods').click()
        cy.contains('Celebration').click()
        cy.get('.mixes-filter-checkbox__icon').click()

        //assert
        waitForSearchResults()
    })

    it('should play a track after doing any valid search, and see that a track in playing in the player', () => {
        //act
        searchForItems('rock')
        waitForSearchResults()

        cy.get('.js-result-row-0 > .col-8 > .play').should('be.visible').click()
        cy.get('[title="Play track"]').first().should('be.visible').click()

        //assert
        cy.get('.anw-player__bar__progress--seek').should('be.visible')
    })
})