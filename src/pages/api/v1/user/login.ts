import { NextApiRequest, NextApiResponse } from 'next';

import { tryLogin } from '../../../../database/functions/user';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: {
    username: string;
    password: string;
  } = req.body;

  const user = await tryLogin(data.username, data.password);
  if (!user) {
    res.status(401).end();
    return;
  }

  res.send({ user });
}
export default handler;
