import { Router } from 'express';

import { getApiKey, getUser, tryLogin } from '../database/user';

const router = Router();

router.post('/api/user/login', async (req, res) => {
  const data: {
    username: string;
    password: string;
  } = req.body;

  const success = await tryLogin(data.username, data.password);
  if (!success) {
    res.sendStatus(401);
    return;
  }
  res.send({ apiKey: await getApiKey(data.username) });
});
router.post('/api/user/validate-authentication', async (req, res) => {
  const data: { authentication: string } = req.body;
  const username = data.authentication.split('@')[0];
  const apiKey = data.authentication.split('@')[1];

  // If the user doesn't exist.
  if (!(await getUser(username))) {
    res.sendStatus(401);
    return;
  }
  // If the API key doesn't match.
  if (apiKey !== (await getApiKey(username))) {
    res.sendStatus(401);
    return;
  }
  res.sendStatus(200);
});

export default router;
