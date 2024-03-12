import AppController from '../controllers/AppController';
import { Router } from 'express';
import UsersCOntroller from '../controllers/dUsersController';

const router = Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersCOntroller.postNew);

module.exports = router;
