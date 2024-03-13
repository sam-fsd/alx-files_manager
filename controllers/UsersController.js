import dbClient from '../utils/db';
import sha1 from 'sha1';

class UsersController {
  static postNew (req, res) {
    const { email } = req.body;
    const { password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    const users = dbClient.db.collection('users');
    console.log(users);
    users.findOne({ email }, (err, user) => {
      if (user) {
        res.status(400).json({ error: 'Already exist' });
      } else {
        const hashedPassword = sha1(password);
        users
          .insertOne({
            email,
            password: hashedPassword
          })
          .then((result) => {
            res.status(201).json({ id: result.insertedId, email });
          });
      }
    });
  }
}

module.exports = UsersController;
