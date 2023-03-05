import { defineConfig } from "cypress";

import { connect } from './src/database/database';
import { deleteDefaultUser } from './src/database/functions/user';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        'deleteDefaultUser': async () => {
          await connect();
          await deleteDefaultUser();
          return null;
        }
      });
    }
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
