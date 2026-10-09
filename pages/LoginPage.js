import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.username = page.getByRole('textbox', { name: 'Usuario' });
    this.password = page.getByRole('textbox', { name: 'Contraseña' });
    this.submit = page.getByRole('button', { name: 'Ingresar' });
    this.googleButton = page.getByRole('button', { name: 'Continuar con Google' });
    this.welcome = page.getByText('Bienvenido');
  }

  async open() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }
}
