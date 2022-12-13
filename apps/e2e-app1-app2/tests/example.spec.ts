import { test } from '@playwright/test';

import { Login } from '@apps/app1/pages';
import foreach from '@utils/async/foreach';

test('homepage has title and links to intro page', async ({ }) => {
  const login = new Login();
  login.login({ username: 'qwe', password: 'qwe' });
  foreach([1, Promise.resolve(2), 3], (item) => {
    console.log(`async Works: ${item}`);
  });
});
