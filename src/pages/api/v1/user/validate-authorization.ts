import { NextApiRequest, NextApiResponse } from 'next';

import { getApiKey, getUser } from '../../../../database/user';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: { authorization: string } = req.body;
  const username = data.authorization.split('@')[0];
  const apiKey = data.authorization.split('@')[1];

  // If the user doesn't exist.
  if (!(await getUser(username))) {
    res.status(401).end();
    return;
  }
  // If the API key doesn't match.
  if (apiKey !== (await getApiKey(username))) {
    res.status(401).end();
    return;
  }
  res.end();
}
export default handler;
