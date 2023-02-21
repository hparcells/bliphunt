import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    await res.status(401).end();
    return;
  }

  await res.send({});
}
export default handler;
