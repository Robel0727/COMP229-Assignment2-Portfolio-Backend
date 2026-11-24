describe('My Portfolio Website', () => {

  // Test 1: Homepage
  it('loads the portfolio homepage successfully', () => {
    cy.visit('http://localhost:5173');

    cy.contains('Home').should('be.visible');
  });

  // Test 2: Contact page navigation
  it('navigates to the Contact page', () => {
    cy.visit('http://localhost:5173');

    cy.contains('Contact').click();

    cy.contains('Contact Me').should('be.visible');
    cy.contains('First Name:').should('be.visible');
    cy.contains('Last Name:').should('be.visible');
  });

  // Test 3: Contact form submission
  it('submits the contact form successfully', () => {

    cy.intercept('POST', 'http://localhost:5000/api/contacts', {
      statusCode: 201,
      body: {
        message: 'Contact submitted successfully'
      }
    }).as('submitContact');

    cy.visit('http://localhost:5173/contact');

    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('Student');
    cy.get('input[name="phone"]').type('4165550123');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('textarea[name="message"]').type(
      'Testing my portfolio contact form.'
    );

    cy.contains('button', 'Submit').click();

    cy.wait('@submitContact');

    cy.contains('Thank You!').should('be.visible');
  });

});