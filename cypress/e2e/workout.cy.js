describe('CRUD on workout, adding and deleting exercises', () => {
    before(() => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
      });
    });
  
    beforeEach(() => {
      cy.session('login', () => {
        cy.visit('http://localhost:5173/login');
        cy.get('input[type="email"]').should('not.be.disabled').should('be.visible').type('usertest@gmail.com');
        cy.get('input[type="password"]').should('not.be.disabled').should('be.visible').type('user');
        cy.get('button[type="submit"]').contains('Login').should('be.visible').click({ force: true });
        cy.url().should('not.include', '/login');
      });
      cy.visit('http://localhost:5173/workouts');
    });
  
    it('should display validation errors for empty workout fields', () => {
      cy.contains('Add Workout').click();
      cy.get('button[type="submit"]').contains('Create Workout').click();
      cy.contains('Title cannot be blank');
      cy.contains('Description cannot be blank');
    });
  
    it('should create a workout with valid inputs', () => {
      cy.contains('Add Workout').click();
      cy.get('input[name="title"]').type('New Workout');
      cy.get('input[name="description"]').type('Workout Description');
      cy.get('button[type="submit"]').contains('Create Workout').click();
      cy.contains('New Workout');
    });
  
    it('should display validation error for empty workout name during edit', () => {
      cy.contains('Edit').first().click();
      cy.get('input[name="title"]').clear();
      cy.get('button[type="submit"]').contains('Update Workout').click();
      cy.contains('Title cannot be blank');
    });
  
    it('should edit the workout name with valid input', () => {
      cy.contains('Edit').first().click();
      cy.get('input[name="title"]').clear().type('Updated Workout');
      cy.get('button[type="submit"]').contains('Update Workout').click();
      cy.contains('Updated Workout');
    });
  
    it('should display validation errors for empty exercise fields', () => {
      cy.contains('Add Exercise').first().click();
      cy.get('button[type="submit"]').contains('Add Exercise').click();
      cy.contains('Sets must be at least 1');
      cy.contains('Reps must be at least 1');
      cy.contains('Rest Time must be at least 1');
    });
  
    it('should display validation errors for 0 sets, reps, and rest time', () => {
      cy.contains('Add Exercise').first().click();
      cy.get('input[name="sets"]').type('0');
      cy.get('input[name="reps"]').type('0');
      cy.get('input[name="restTime"]').type('0');
      cy.get('button[type="submit"]').contains('Add Exercise').click();
      cy.contains('Sets must be at least 1');
      cy.contains('Reps must be at least 1');
      cy.contains('Rest Time must be at least 1');
    });
  
    it('should display validation error for not selecting a workout', () => {
      cy.contains('Add Exercise').first().click();
      cy.get('input[name="sets"]').type('3');
      cy.get('input[name="reps"]').type('10');
      cy.get('input[name="restTime"]').type('60');
      cy.get('button[type="submit"]').contains('Add Exercise').click();
      cy.contains('Please select an exercise');
    });
  

    it('should add an exercise with valid inputs', () => {
        cy.contains('Add Exercise').first().click();
        cy.get('input[name="sets"]').type('3');
        cy.get('input[name="reps"]').type('10');
        cy.get('input[name="restTime"]').type('60');
        cy.get('table tbody tr').first().click(); // Select the first exercise
        cy.get('button[type="submit"]').contains('Add Exercise').click();
        // Check if the exercise appears in the workout list
        cy.get('ul').contains('Sets: 3, Reps: 10, Rest Time: 60 seconds');
      });
    
      it('should edit an exercise with valid inputs', () => {
        cy.get('button').contains('Edit Exercise').first().click(); // Click the first edit button for an exercise
        cy.get('input[name="sets"]').clear().type('4');
        cy.get('input[name="reps"]').clear().type('12');
        cy.get('button[type="submit"]').contains('Confirm').click();
        // Check if the exercise is updated in the workout list
        cy.get('ul').contains('Sets: 4, Reps: 12, Rest Time: 60 seconds');
      });
    
      it('should delete an exercise', () => {
        cy.get('button').contains('Delete Exercise').first().click(); // Click the first delete button for an exercise
        // Check if the exercise is removed from the workout list
        cy.get('ul').should('not.contain', 'Sets: 4, Reps: 12, Rest Time: 60 seconds');
      });
    
      it('should delete a workout', () => {
        cy.contains('Delete').first().click();
        // Check if the workout is removed from the list
        cy.get('ul').should('not.contain', 'Updated Workout');
      });
    });