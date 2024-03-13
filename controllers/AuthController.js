import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async connect (req, res) {
    const authData = req.header('Authorization');
    let userCredentials = authData.split(' ')[1];
    const buff = Buffer.from(userCredentials, 'base64');
    userCredentials = buff.toString('ascii');
    const data = userCredentials.split(':');
    if (data.length !== 2) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const hashedPassword = sha1(data[1]);
    const users = dbClient.db.collection('users');
    users.findOne(
      { email: data[0], password: hashedPassword },
      async (err, user) => {
        if (user) {
          const token = uuidv4();
          const key = `auth_${token}`;
          await redisClient.set(key, user._id.toString(), 60 * 60 * 24);
          res.status(200).json({ token });
        } else {
          res.status(401).json({ error: 'Unauthorized' });
        }
      }
    );
  }
}

module.exports = AuthController;
