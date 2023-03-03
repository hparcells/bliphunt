beforeEach(() => {
  cy.visit('http://localhost:8000/register');
});

describe('Smoke', () => {
  it('exists', () => {
    cy.visit('http://localhost:8000/register');
    cy.contains('Register').should('exist');
  });
});

describe('Client Side Logic', () => {
  it('goes to login page when clicking "Login"', () => {
    cy.visit('http://localhost:8000/register');

    cy.contains('Log in').click();
    cy.url().should('include', '/login');
  });

  it('goes to home page when clicking "Back to home"', () => {
    cy.visit('http://localhost:8000/register');

    cy.contains('Back to home').click();
    cy.location('pathname').should('eq', '/');
  });
  
  it('accepts values in all fields', () => {
    cy.get('input[name=username]').type('default123');
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=confirmPassword]').type('default123');
    cy.get('input[name=terms]').check();

    cy.get('input[name=username]').should('have.value', 'default123');
    cy.get('input[name=email]').should('have.value', 'default@example.com');
    cy.get('input[name=password]').should('have.value', 'default123');
    cy.get('input[name=confirmPassword]').should('have.value', 'default123');
    cy.get('input[name=terms]').should('be.checked');
  });

  it('toggle password visibility works', () => {
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=confirmPassword]').type('default123');

    cy.get('.mantine-PasswordInput-visibilityToggle').click({multiple: true});
    cy.get('input[name=password]').should('have.prop', 'type', 'text');
    cy.get('input[name=confirmPassword]').should('have.prop', 'type', 'text');
  });
});

describe('Registration', () => {
  it('handles invalid form input appropriately', () => {});

  it('submits when enter key is pressed', () => {});
  
  it('redirects to feed if already logged in', () => {
    cy.intercept('/api/v1/user/login').as('login');

    cy.visit('http://localhost:8000/login');
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=rememberMe]').check();
    cy.get('button[name=login]').click();
    cy.wait('@login');

    cy.visit('http://localhost:8000/register');
    cy.url().should('include', '/feed');
  });
});
