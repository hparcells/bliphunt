import { NextApiRequest, NextApiResponse } from 'next';

import { tryLoginWithEmail, tryLoginWithUsername } from '../../../../database/functions/user';

import { isValidEmail } from '../../../../util/email';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: {
    usernameEmail: string;
    password: string;
  } = req.body;

  let user;
  if (isValidEmail(data.usernameEmail)) {
    user = await tryLoginWithEmail(data.usernameEmail, data.password);
  } else {
    user = await tryLoginWithUsername(data.usernameEmail, data.password);
  }

  if (!user) {
    res.status(401).end();
    return;
  }

  res.send({ user });
}
export default handler;
