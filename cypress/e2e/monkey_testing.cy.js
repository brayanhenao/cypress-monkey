import {faker} from '@faker-js/faker';

describe('Los estudiantes under monkeys', function () {
    it('visits los estudiantes and survives monkeys', function () {
        cy.visit('https://losestudiantes.co');
        cy.wait(1000);
        randomClick(10);
    })
    it('visit los estudiantes and survives monkeys - events', function () {
        cy.visit('https://losestudiantes.co');
        cy.wait(1000);
        randomEvent(10);
    })
})


function randomClick(monkeysLeft) {

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    var monkeysLeft = monkeysLeft;
    if (monkeysLeft > 0) {
        cy.get('a').then($links => {
            var randomLink = $links.get(getRandomInt(0, $links.length));
            if (!Cypress.dom.isHidden(randomLink)) {
                cy.wrap(randomLink).click({force: true});
                monkeysLeft = monkeysLeft - 1;
            }
            cy.wait(1000);
            randomClick(monkeysLeft);
        });
    }
}

function randomEvent(monkeysLeft) {
    let monkLeft = monkeysLeft;
    if (monkLeft > 0) {
        const event = getRandomEvent()
        cy.log(event)
        switch (event) {
            case 'randomLink':
                randomLink((success) => {
                    if (success) {
                        monkLeft = monkLeft - 1;
                    }
                    randomEvent(monkLeft);
                })
                break;
            case 'randomTextField':
                randomTextField((success) => {
                    if (success) {
                        monkLeft = monkLeft - 1;
                    }
                    randomEvent(monkLeft);
                })
                break;
            case 'randomCombo':
                randomCombo((success) => {
                    if (success) {
                        monkLeft = monkLeft - 1;
                    }
                    randomEvent(monkLeft);
                })
                break;
            case 'randomButton':
                randomButton((success) => {
                    if (success) {
                        monkLeft = monkLeft - 1;
                    }
                    randomEvent(monkLeft);
                })
                break;
        }
    }
}

function getRandomEvent() {
    const events = ['randomLink', 'randomTextField', 'randomCombo', 'randomButton']

    return events[Math.floor(Math.random() * events.length)];
}

function randomLink(callback) {
    cy.get('a').then($links => {
        const randomLink = $links.get(Math.floor(Math.random() * $links.length));
        if (!Cypress.dom.isHidden(randomLink)) {
            return cy.wrap(randomLink).click({force: true}).then(() => callback(true));
        }
        callback(false)
    });
}

function randomTextField(callback) {
    cy.get('input[type="text"]').then($inputs => {
        const randomTextField = $inputs.get(Math.floor(Math.random() * $inputs.length));
        if (!Cypress.dom.isHidden(randomTextField)) {
            return cy.wrap(randomTextField).type(faker.random.alpha(faker.datatype.number({
                min: 2, max: 3
            }))).then(() => callback(true));
        }
        callback(false)
    })
}

function randomCombo(callback) {
    cy.get('*[class$="control"]').then($controls => {
        const randomControl = $controls.get(Math.floor(Math.random() * $controls.length));
        cy.log(randomControl)
        if (Cypress.dom.isHidden(randomControl)) return callback(false)
        cy.wrap(randomControl).find('input[type="text"]').then($input => {
            cy.wrap($input).invoke('val').then($val => {
                if (!$val) callback(false)
                cy.wait(2000);
                cy.wrap(randomControl).parent().find('*[class$="menu"] *[class$="option"]').then($items => {
                    const randomOption = $items.get(Math.floor(Math.random() * $items.length));
                    return cy.wrap(randomOption).click({force: true}).then(() => callback(true));
                })
            })
        })
    })
}

function randomButton(callback) {
    cy.get('button').then($buttons => {
        const randomButton = $buttons.get(Math.floor(Math.random() * $buttons.length));
        if (!Cypress.dom.isHidden(randomButton)) {
            return cy.wrap(randomButton).click({force: true}).then(() => callback(true));
        }
        callback(false)
    })
}

