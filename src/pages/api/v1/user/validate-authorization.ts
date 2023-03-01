import { NextApiRequest, NextApiResponse } from 'next';

import { getUserByUsername } from '../../../../database/functions/user';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: { authorization: string } = req.body;
  const username = data.authorization.split('@')[0];
  const apiKey = data.authorization.split('@')[1];

  const user = await getUserByUsername(username);

  // If the user doesn't exist.
  if (!user) {
    res.status(401).end();
    return;
  }
  // If the API key doesn't match.
  if (apiKey !== user.apiKey) {
    res.status(401).end();
    return;
  }

  // Don't send the password hash to the client.
  user.password = undefined as any;

  // If the user exists in the end.
  res.send({ user });
}
export default handler;
