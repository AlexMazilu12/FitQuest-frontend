describe('Login Test', () => {
    beforeEach(() => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
      });
    });
  
    it('should log in successfully and redirect to the home page', () => {
      cy.visit('http://localhost:5173/login');
      cy.url().should('include', '/login');
      cy.get('input[type="email"]').should('not.be.disabled').should('be.visible').type('admin@gmail.com');
      cy.get('input[type="password"]').should('not.be.disabled').should('be.visible').type('admin');
      cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
      cy.url().should('include', 'http://localhost:5173');
      cy.contains('Welcome to the Workout App', { timeout: 10000 });
    });
  
    it('should display an error message for invalid credentials', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('input[type="email"]').should('not.be.disabled').should('be.visible').type('invalid@gmail.com');
      cy.get('input[type="password"]').should('not.be.disabled').should('be.visible').type('wrongpassword');
      cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
      cy.contains('Invalid credentials');
    });
  
    it('should display validation errors for empty fields', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
      cy.contains('Email is required');
      cy.contains('Password is required');
    });
  
    it('should display validation error for invalid email format', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('input[type="email"]').should('not.be.disabled').should('be.visible').type('invalid-email');
      cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
      cy.contains('Email is invalid');
    });
  
    it('should display validation error for short password', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('input[type="email"]').should('not.be.disabled').should('be.visible').type('admin@gmail.com');
      cy.get('input[type="password"]').should('not.be.disabled').should('be.visible').type('123');
      cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
      cy.contains('Password must be at least 4 characters');
    });
  });