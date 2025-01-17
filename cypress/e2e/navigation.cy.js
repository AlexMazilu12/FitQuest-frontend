describe('Navigation and Unauthorized Access Tests', () => {
    beforeEach(() => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
      });
    });
  
    it('should not allow access to unauthorized pages when not authenticated', () => {
      cy.visit('http://localhost:5173/workouts');
      cy.url().should('include', '/login');
    });
  
    it('should display unauthorized page for non-trainer users', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('input[type="email"]').should('not.be.disabled').should('be.visible').type('user@gmail.com');
      cy.get('input[type="password"]').should('not.be.disabled').should('be.visible').type('user');
      cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
      cy.url().should('not.include', '/login');
      cy.visit('http://localhost:5173/trainer-clients');
      cy.url().should('include', '/unauthorized');
    });
  
    it('should display unauthorized page for non-admin users', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('input[type="email"]').should('not.be.disabled').should('be.visible').type('trainer@gmail.com');
      cy.get('input[type="password"]').should('not.be.disabled').should('be.visible').type('trainer');
      cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
      cy.url().should('not.include', '/login');
      cy.visit('http://localhost:5173/statistics');
      cy.url().should('include', '/unauthorized');
    });
    
  
    it('should allow users to access workouts page', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('input[type="email"]').should('not.be.disabled').should('be.visible').type('user@gmail.com');
      cy.get('input[type="password"]').should('not.be.disabled').should('be.visible').type('user');
      cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
      cy.url().should('not.include', '/login');
      cy.visit('http://localhost:5173/workouts');
      cy.url().should('include', '/workouts');
    });
  
    it('should allow trainers to access trainer page', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('input[type="email"]').should('not.be.disabled').should('be.visible').type('trainer@gmail.com');
      cy.get('input[type="password"]').should('not.be.disabled').should('be.visible').type('trainer');
      cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
      cy.url().should('not.include', '/login');
      cy.visit('http://localhost:5173/trainer-clients');
      cy.url().should('include', '/trainer-clients');
    });
  
    it('should allow admins to access admin page', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('input[type="email"]').should('not.be.disabled').should('be.visible').type('admin@gmail.com');
      cy.get('input[type="password"]').should('not.be.disabled').should('be.visible').type('admin');
      cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
      cy.url().should('not.include', '/login');
      cy.visit('http://localhost:5173/statistics');
      cy.url().should('include', '/statistics');
    });
  });