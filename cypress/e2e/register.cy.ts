import { BAD_EMAILS } from '../../src/data/test';

beforeEach(() => {
  cy.intercept('/api/v1/user/login').as('login');
  cy.intercept('/api/v1/user/register').as('register');

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
    // Add values.
    cy.get('input[name=username]').type('a');
    cy.get('input[name=email]').type('a');
    cy.get('input[name=password]').type('a');
    cy.get('input[name=confirmPassword]').type('a');
    cy.get('input[name=terms]').check();

    // Check values.
    cy.get('input[name=username]').should('have.value', 'a');
    cy.get('input[name=email]').should('have.value', 'a');
    cy.get('input[name=password]').should('have.value', 'a');
    cy.get('input[name=confirmPassword]').should('have.value', 'a');
    cy.get('input[name=terms]').should('be.checked');
  });

  it('handles invalid form input appropriately', () => {
    // Username
    cy.get('button[name=register]').click();
    cy.contains('Username is required').should('exist');
    cy.get('input[name=username]').type('aa');
    cy.get('button[name=register]').click();
    cy.contains('Username must be at least 3 characters long').should('exist');
    cy.get('input[name=username]').type('Uo59zp9Wg93jviIAtq0vZgqM1OnBKgC');
    cy.get('button[name=register]').click();
    cy.contains('Username must be 32 characters or less').should('exist');
    cy.get('input[name=username]').clear().type('default123');
    cy.contains('Username must be at least 3 characters long').should('not.exist');
    cy.contains('Username must be 32 characters or less').should('not.exist');
    
    // Email
    cy.contains('Invalid email').should('exist');
    cy.get('input[name=email]').type('default');
    cy.get('button[name=register]').click();
    cy.contains('Invalid email').should('exist');
    cy.get('input[name=email]').type('@example.com');
    cy.get('button[name=register]').click();
    cy.contains('Invalid email').should('not.exist');

    // Password
    cy.contains('Password is required').should('exist');
    cy.get('input[name=password]').type('default');
    cy.get('button[name=register]').click();
    cy.contains('Password must be at least 8 characters long').should('exist');
    cy.get('input[name=password]').type('123');
    cy.get('button[name=register]').click();
    cy.contains('Password is required').should('not.exist');
    cy.contains('Password must be at least 8 characters long').should('not.exist');

    // Confirm password
    cy.contains('Must confirm password').should('exist');
    cy.get('input[name=confirmPassword]').type('default');
    cy.get('button[name=register]').click();
    cy.contains('Passwords must match').should('exist');
    cy.get('input[name=confirmPassword]').type('123');
    cy.get('button[name=register]').click();
    cy.contains('Passwords must match').should('not.exist');
    cy.contains('Must confirm password').should('not.exist');

    // Terms
    cy.contains('Must agree').should('exist');
    cy.get('input[name=terms]').check();
    cy.get('button[name=register]').click();
    cy.contains('Must agree').should('not.exist');
  });

  it('toggle password visibility works', () => {
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=confirmPassword]').type('default123');
    
    cy.get('.mantine-PasswordInput-visibilityToggle').click({multiple: true});
    cy.get('input[name=password]').should('have.prop', 'type', 'text');
    cy.get('input[name=confirmPassword]').should('have.prop', 'type', 'text');
  });
  
  it('submits when enter key is pressed', () => {
    // Username
    cy.get('input[name=username]').type('a');
    cy.get('input[name=username]').type('{enter}');
    cy.contains('Username must be at least 3 characters long').should('exist');

    // Email
    cy.get('input[name=email]').type('a');
    cy.get('input[name=email]').type('{enter}');
    cy.contains('Invalid email').should('exist');

    // Password
    cy.get('input[name=password]').type('a');
    cy.get('input[name=password]').type('{enter}');
    cy.contains('Password must be at least 8 characters long').should('exist');

    // Confirm Password
    cy.get('input[name=confirmPassword]').type('b');
    cy.get('input[name=confirmPassword]').type('{enter}');
    cy.contains('Passwords must match').should('exist');
  });
});

describe('Registration', () => {
  it('redirects to feed if already logged in', () => {
    // Login
    cy.visit('http://localhost:8000/login');
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=rememberMe]').check();
    cy.get('button[name=login]').click();
    cy.wait('@login');

    // Go to Registration
    cy.visit('http://localhost:8000/register');
    cy.url().should('include', '/feed');
  });

  it('creates a new account', () => {
    // Delete the default user.
    cy.task('deleteDefaultUser');

    // Register.
    cy.get('input[name=username]').type('default123');
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=confirmPassword]').type('default123');
    cy.get('input[name=terms]').check();
    cy.get('button[name=register]').click();

    cy.wait('@register').then((intercept) => {
      expect(intercept.request.body).to.contain({
        username: 'default123',
        email: 'default@example.com',
        password: 'default123'
      });
      expect(intercept.response?.statusCode).to.eq(201);
    });

    // Check if redirected to feed.
    cy.url().should('include', '/feed');
  });

  it('does not create an account if email or username exists', () => {
    // Existing username.
    cy.get('input[name=username]').type('default123');
    cy.get('input[name=email]').type('default@example.co');
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=confirmPassword]').type('default123');
    cy.get('input[name=terms]').check();
    cy.get('button[name=register]').click();
    cy.contains('Account already exists').should('exist');
    cy.wait('@register').then((intercept) => {
      expect(intercept.request.body).to.contain({
        username: 'default123',
        email: 'default@example.co',
        password: 'default123'
      });
      expect(intercept.response?.statusCode).to.eq(409);
    });
    
    // Existing username and email.
    cy.get('input[name=email]').type('m');
    cy.get('button[name=register]').click();
    cy.contains('Account already exists').should('exist');
    cy.wait('@register').then((intercept) => {
      expect(intercept.request.body).to.contain({
        username: 'default123',
        email: 'default@example.com',
        password: 'default123'
      });
      expect(intercept.response?.statusCode).to.eq(409);
    });
    
    // Existing email.
    cy.get('input[name=username]').type('{backspace}');
    cy.get('button[name=register]').click();
    cy.contains('Account already exists').should('exist');
    cy.wait('@register').then((intercept) => {
      expect(intercept.request.body).to.contain({
        username: 'default12',
        email: 'default@example.com',
        password: 'default123'
      });
      expect(intercept.response?.statusCode).to.eq(409);
    });
  });

  it('handles server side data validation appropriately', () => {
    // Username
    cy.request({
      method: 'POST',
      url: '/api/v1/user/register',
      body: {
        username: 'de',
        email: 'default@example.com',
        password: 'default123'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
    cy.request({
      method: 'POST',
      url: '/api/v1/user/register',
      body: {
        username: 'aaUo59zp9Wg93jviIAtq0vZgqM1OnBKgC',
        email: 'default@example.com',
        password: 'default123'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });

    // Email
    BAD_EMAILS.forEach((email) => {
      cy.request({
        method: 'POST',
        url: '/api/v1/user/register',
        body: {
          username: 'default123',
          email,
          password: 'default123'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});
