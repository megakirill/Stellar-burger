describe('Проверка системы авторизации', () => {
  it('Вход и навигация в личный кабинет', () => {
    const testAccount = {
      success: true,
      user: {
        email: 'demo_account@test.com',
        name: 'Demo Account'
      }
    };

    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      body: testAccount
    }).as('fetchUserData');

    cy.loginByApi();
    cy.visit('/');
    cy.contains('Личный кабинет').click();
    cy.wait('@fetchUserData');
    cy.contains(testAccount.user.name).click();
    cy.url().should('include', '/profile');
    cy.get('form').should('be.visible', { timeout: 10000 });
    cy.get('input[name="name"]').should('have.value', testAccount.user.name);
  });
});

describe('Тестирование сборки бургера', () => {
  const APP_URL = 'http://localhost:4000';

  const TEST_TIMEOUT = 10000;

  const INGREDIENTS = {
    bun: 'Флюоресцентная булка R2-D3',
    filling: 'Биокотлета из марсианской Магнолии'
  };

  beforeEach(() => {
    // Подготовка тестовых данных
    cy.fixture('ingredients.json').as('menuItems');
    cy.fixture('user.json').as('userProfile');

    // Настройка перехвата запросов
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('loadIngredients');

    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    }).as('loadUserData');

    // Инициализация авторизации
    cy.setCookie('accessToken', 'testToken');
    cy.window().then(window => {
      window.localStorage.setItem('refreshToken', 'testToken');
    });

    cy.visit('/');
    
    cy.contains('Соберите бургер').as('pageTitle');
    cy.contains('Булки').as('bunTab');
    cy.contains('Начинки').as('fillingsTab');
    cy.contains(INGREDIENTS.bun).as('bunIngredient');
    cy.contains(INGREDIENTS.filling).as('fillingIngredient');
    cy.contains('Оформить заказ').as('orderButton');
    
    cy.get('@pageTitle').should('exist', { timeout: TEST_TIMEOUT });
  });

  it('Проверка пустого конструктора', () => {
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');
  });

  it('Добавление булочки', () => {
    cy.get('@bunTab')
      .scrollIntoView()
      .click({ force: true })
      .parent()
      .should('have.class', 'tab_type_current');
    
    cy.get('@bunIngredient')
      .scrollIntoView({ duration: 500 })
      .next()
      .click({ force: true });
      
    cy.get('@bunIngredient')
      .should('be.visible', { timeout: TEST_TIMEOUT });
  });

  it('Вставка начинки', () => {
    cy.get('@fillingsTab')
      .scrollIntoView()
      .click({ force: true });
      
    cy.get('@fillingIngredient')
      .next()
      .click();
      
    cy.get('@fillingIngredient')
      .should('be.visible');
  });

  it('Формирование и отправка заказа', () => {
    cy.intercept('POST', 'api/orders', {
      fixture: 'makeOrder.json',
      statusCode: 200
    }).as('submitOrder');

    cy.get('@bunIngredient').next().click();
    cy.get('@fillingsTab').scrollIntoView();
    cy.get('@fillingIngredient').next().click();

    cy.get('@orderButton')
      .should('be.enabled')
      .click();

    cy.wait('@submitOrder', { timeout: 30000 })
      .its('response.statusCode')
      .should('eq', 200);

    cy.contains('идентификатор заказа').should('be.visible');
    cy.get('body').type('{esc}');
    cy.contains('Выберите булки').should('be.visible');
  });

  it('Управление модальным окном ингредиента', () => {
    cy.contains(INGREDIENTS.bun).click();
    cy.url().should('include', '/ingredients/');
    cy.get('body').type('{esc}');
    cy.url().should('eq', `${APP_URL}/`);
  });

  it('Закрытие окна кликом по оверлею', () => {
    cy.contains(INGREDIENTS.bun).click();
    cy.get('body').click(10, 10);
    cy.url().should('eq', `${APP_URL}/`);
  });
});