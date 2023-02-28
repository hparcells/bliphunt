describe('Login Page', () => {
  it('Logs In with Correct Information', () => {
    cy.intercept('/api/v1/user/login').as('login');

    cy.visit('http://localhost:8000/login');
    cy.get('input[name=email]').should('exist');
    cy.get('input[name=password]').should('exist');

    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');

    cy.get('input[name=email]').should('have.value', 'default@example.com');
    cy.get('input[name=password]').should('have.value', 'default123');

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

  it('Does Not Log In Incorrect Information', () => {
    cy.intercept('/api/v1/user/login').as('login');

    cy.visit('http://localhost:8000/login');
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

  it('Handles Invalid Form Input', () => {
    cy.visit('http://localhost:8000/login');

    cy.get('input[name=email]').type('default@example');
    cy.get('button[name=login]').click();
    cy.contains('Invalid email').should('exist');
    cy.contains('Password is required').should('exist');

    cy.get('input[name=password]').type('12345');
    cy.get('button[name=login]').click();
    cy.contains('Incorrect password').should('exist');
  });

  it('Doesn\'t Stay Logged in without Remember Me', () => {
    cy.intercept('/api/v1/user/login').as('login');

    cy.visit('http://localhost:8000/login');
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');

    cy.get('button[name=login]').click();
    cy.wait('@login');
    cy.getCookie('authorization').should('not.exist');
    cy.reload();
    cy.getCookie('authorization').should('not.exist');
  });

  it('Stays Logged in without Remember Me', () => {
    cy.intercept('/api/v1/user/login').as('login');

    cy.visit('http://localhost:8000/login');
    cy.get('input[name=email]').type('default@example.com');
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=rememberMe]').check();
    
    cy.get('button[name=login]').click();
    cy.wait('@login');
    cy.getCookie('authorization').should('exist');
    cy.reload();
    cy.getCookie('authorization').should('exist');
  });
  
  it('Other Functions Work', () => {
    cy.visit('http://localhost:8000/login');
    cy.get('input[name=password]').type('default123');
    cy.get('input[name=password]').should('have.prop', 'type', 'password');
    cy.get('.mantine-PasswordInput-visibilityToggle').click();
    cy.get('input[name=password]').should('have.prop', 'type', 'text');
  });
});
