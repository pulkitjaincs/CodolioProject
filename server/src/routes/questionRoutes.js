import { Router } from 'express';
import * as questionController from '../controllers/questionController.js';

const router = Router({ mergeParams: true });

router.post('/', questionController.createQuestion);
router.put('/:questionId', questionController.updateQuestion);
router.patch('/:questionId/toggle', questionController.toggleSolved);
router.delete('/:questionId', questionController.deleteQuestion);
router.put('/reorder', questionController.reorderQuestions);

export default router;
