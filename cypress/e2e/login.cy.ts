beforeEach(() => {
  cy.intercept('/api/v1/user/login').as('login');
  cy.visit('http://localhost:8000/login');
});

describe('Smoke', () => {
  it('exists', () => {
    cy.visit('http://localhost:8000/login');
    cy.contains('Welcome back!').should('exist');
  });
});

describe('Authorization', () => {
  it('logs in with correct information', () => {
    cy.get('input[name=email]').should('exist');
    cy.get('input[name=password]').should('exist');

    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');

    cy.get('button[name=login]').click();
    cy.wait('@login').then((intercept) => {      
      expect(intercept.request.body).to.contain({
        usernameEmail: 'default@example.com',
        password: 'default123'
      });

      expect(intercept.response?.statusCode).to.equal(200);
      expect(intercept.response?.body).to.contain.keys('user');
      expect(intercept.response?.body.user).to.contain.keys(['id', 'username', 'email', 'apiKey', 'createdAt']);
      expect(intercept.response?.body.user).to.not.contain.keys('password');
    });

    cy.url().should('include', '/feed');
  });

  it('does not log in with incorrect information', () => {
    cy.get('input[name=email]').type('default@example.co');
    cy.get('input[name=password]').type('default123');
    cy.get('button[name=login]').click();
    cy.wait('@login').then((intercept) => {
      expect(intercept.response?.statusCode).to.equal(401);
    });
    cy.contains('Incorrect password').should('exist');
    
    cy.get('input[name=email]').type('m');
    cy.get('input[name=password]').type('123456789');
    cy.get('button[name=login]').click();
    cy.contains('Incorrect password').should('exist');
  });

  it('redirects to feed if already logged in', () => {
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=rememberMe]').check();
    
    cy.get('button[name=login]').click();
    cy.wait('@login');

    cy.visit('http://localhost:8000/login');
    cy.url().should('include', '/feed');
  });
});

describe('Client Side Logic', () => {
  it('goes to registration page when clicking "Create account"', () => {
    cy.visit('http://localhost:8000/login');

    cy.contains('Create account').click();
    cy.url().should('include', '/register');
  });

  it('accepts values in all fields', () => {
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=rememberMe]').check()

    cy.get('input[name=email]').should('have.value', 'default@example.com');
    cy.get('input[name=password]').should('have.value', 'default123');
    cy.get('input[name=rememberMe]').should('be.checked');
  });

  it('handles invalid form input appropriately', () => {
    cy.visit('http://localhost:8000/login');

    cy.get('input[name=email]').type('default@example');
    cy.get('button[name=login]').click();
    cy.contains('Invalid email').should('exist');
    cy.contains('Password is required').should('exist');

    cy.get('input[name=password]').type('12345');
    cy.get('button[name=login]').click();
    cy.contains('Incorrect password').should('exist');
  });

  it('submits when enter key is pressed', () => {
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');

    cy.get('input[name=email]').type('{enter}');
    cy.wait('@login');
    cy.url().should('include', '/feed');

    cy.reload();

    cy.visit('http://localhost:8000/login');
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');

    cy.get('input[name=password]').type('{enter}');
    cy.wait('@login');
    cy.url().should('include', '/feed');
  });
  
  it('toggle password visibility works', () => {
    cy.visit('http://localhost:8000/login');
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=password]').should('have.prop', 'type', 'password');
    cy.get('.mantine-PasswordInput-visibilityToggle').click();
    cy.get('input[name=password]').should('have.prop', 'type', 'text');
  });
});

describe('Remember Me', () => {
  it('doesn\'t stay logged in without remember me option', () => {
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');

    cy.get('button[name=login]').click();
    cy.wait('@login');
    cy.getCookie('authorization').should('not.exist');
    cy.reload();
    cy.getCookie('authorization').should('not.exist');
  });

  it('stays logged in with remember me option', () => {
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=rememberMe]').check();
    
    cy.get('button[name=login]').click();
    cy.wait('@login');
    cy.getCookie('authorization').should('exist');
    cy.reload();
    cy.getCookie('authorization').should('exist');
  });
});
