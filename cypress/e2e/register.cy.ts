describe('Registration Page', () => {
  it('exists', () => {
    cy.visit('http://localhost:8000/register');
    cy.contains('Register').should('exist');
  });

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

  it('goes to login page when clicking "Login"', () => {
    cy.visit('http://localhost:8000/register');

    cy.contains('Log in').click();
    cy.url().should('include', '/login');
  });
});
