import express from 'express';
import { verifyToken } from '../middlewares/verify.middleware.js';

import { getAttempt, createAttempt, updateAnswers, submitQuiz } from '../controllers/attempt.controller.js';

// api/quizzes/:quizId/attempt
const router = express.Router({
    mergeParams : true
});

router.use(verifyToken);

router.get('/', getAttempt);

router.post('/', createAttempt);

router.put('/', updateAnswers);

router.post('/submit', submitQuiz);

export default router;