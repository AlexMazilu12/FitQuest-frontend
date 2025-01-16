describe('Exercise Page Admin Tests', () => {
    before(() => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
      });
    });
  
    beforeEach(() => {
      cy.session('login', () => {
        cy.visit('http://localhost:5173/login');
        cy.get('input[type="email"]').should('not.be.disabled').should('be.visible').type('admin@gmail.com');
        cy.get('input[type="password"]').should('not.be.disabled').should('be.visible').type('admin');
        cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
        cy.url().should('not.include', '/login');
      });
      cy.visit('http://localhost:5173/exercises');
    });
  
    it('should filter exercises by muscle group', () => {
      cy.get('[data-cy="input-muscleGroup"]').click();
      cy.get('[data-cy="select-option-CHEST"]').should('be.visible').click();
      cy.wait(1000);
      cy.get('table tbody tr').should('have.length.greaterThan', 0).each(($row) => {
        cy.wrap($row).contains('Chest');
      });
    });
  
    it('should display validation errors for empty title and description fields', () => {
      cy.contains('Add Exercise').click();
      cy.get('[data-cy="input-muscleGroupedit"]').click();
      cy.get('[data-cy="select-option-LEGSedit"]').should('be.visible').click();
      cy.get('button[type="submit"]').contains('Create Exercise').click();
      cy.contains('Name cannot be blank');
      cy.contains('Description cannot be blank');
    });
  
    it('should add a valid exercise', () => {
      const exerciseName = 'New Exercise';
      cy.contains('Add Exercise').click();
      cy.get('[data-cy="input-name"]').type(exerciseName);
      cy.get('[data-cy="input-description"]').type('Exercise Description');
      cy.get('[data-cy="input-muscleGroupedit"]').click();
      cy.get('[data-cy="select-option-LEGSedit"]').should('be.visible').click();
      cy.get('button[type="submit"]').contains('Create Exercise').click();
      cy.contains(exerciseName);
    });
  
    it('should edit an exercise with valid inputs', () => {
      const exerciseName = 'New Exercise';
      const updatedExerciseName = 'Updated Exercise';
      cy.contains(exerciseName).parent().contains('Edit').click();
      cy.get('[data-cy="input-name"]').as('nameInput').clear().type(updatedExerciseName);
      cy.get('[data-cy="input-description"]').as('descriptionInput').clear().type('Updated Description');
      cy.get('[data-cy="input-muscleGroupedit"]').click();
      cy.get('[data-cy="select-option-BACKedit"]').should('be.visible').click();
      cy.get('button[type="submit"]').contains('Update Exercise').click();
      cy.contains(updatedExerciseName);
    });
  
    it('should delete the created exercise', () => {
      const updatedExerciseName = 'Updated Exercise';
      cy.contains(updatedExerciseName).parent().contains('Delete').click();
      cy.wait(1000);
      cy.contains(updatedExerciseName).should('not.exist');
    });
  });