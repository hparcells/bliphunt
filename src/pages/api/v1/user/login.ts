import { NextApiRequest, NextApiResponse } from 'next';

import { getApiKey, tryLogin } from '../../../../database/user';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: {
    username: string;
    password: string;
  } = req.body;

  const success = await tryLogin(data.username, data.password);
  if (!success) {
    res.status(401).end();
    return;
  }
  res.send({ apiKey: await getApiKey(data.username) });
}
export default handler;
