import Cookies from 'cookies';
import multiparty from 'multiparty';
import fs from 'node:fs/promises';
import dbConnect from '../../../lib/dbConnect';
import Post from '../../../models/post';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { method } = req;

  const cookies = new Cookies(req, res);
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const posts = await Post.find({}).skip(req.query.skip || 0).sort('-date').limit(req.query.limit || 6);
        const total = (await Post.find({})).length;
        /* código para retrasar el request de los siguientes posts y ver como cargan on-scroll los
        siguientes

        setTimeout(() => {
          res.status(200).json({ success: true, data: posts, total });
        }, 2000);
         */
        res.status(200).json({ success: true, data: posts, total });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const form = new multiparty.Form();
        const data = await new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            if (err) reject({ err });
            resolve({ fields, files });
          });
        });

        const image = data.files.newPost[0];
        const extension = image.headers['content-type'].replace('image/', '');

        const userId = cookies.get('userId');

        const posted = await Post.create(
          {
            user: userId,
            description: data.fields.description[0],
            date: new Date(),
            extension,
          },
        );

        await fs.rename(image.path, `${process.env.NODE_ENV === 'development' ? 'public/' : ''}posts/${posted._id}.${extension}`);

        res.status(201).json({ success: true, data: posted });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
