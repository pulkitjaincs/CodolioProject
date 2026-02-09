import { Router } from 'express';
import * as topicController from '../controllers/topicController.js';

const router = Router();

router.get('/', topicController.getAllTopics);
router.post('/', topicController.createTopic);
router.put('/:id', topicController.updateTopic);
router.delete('/:id', topicController.deleteTopic);
router.put('/reorder', topicController.reorderTopics);

export default router;
