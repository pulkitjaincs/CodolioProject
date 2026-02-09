import { Router } from 'express';
import * as subTopicController from '../controllers/subTopicController.js';

const router = Router({ mergeParams: true });

router.post('/', subTopicController.createSubTopic);
router.put('/:subTopicId', subTopicController.updateSubTopic);
router.delete('/:subTopicId', subTopicController.deleteSubTopic);
router.put('/:subTopicId/reorder', subTopicController.reorderSubTopics);

export default router;
