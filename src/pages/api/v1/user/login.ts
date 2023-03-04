import { NextApiRequest, NextApiResponse } from 'next';

import { tryLoginWithEmail, tryLoginWithUsername } from '../../../../database/functions/user';

import { isValidEmail } from '../../../../util/email';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: {
    email: string;
    password: string;
  } = req.body;

  let user;
  if (isValidEmail(data.email)) {
    user = await tryLoginWithEmail(data.email, data.password);
  }

  if (!user) {
    res.status(401).end();
    return;
  }

  res.send({ user });
}
export default handler;
