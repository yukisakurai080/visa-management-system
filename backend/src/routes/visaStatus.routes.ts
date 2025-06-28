import { Router } from 'express';
import { VisaStatusController } from '../controllers/visaStatus.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const controller = new VisaStatusController();

router.get('/', authenticateToken, controller.getAll);
router.get('/:id', authenticateToken, controller.getById);
router.post('/', authenticateToken, controller.create);
router.put('/:id', authenticateToken, controller.update);
router.delete('/:id', authenticateToken, controller.delete);

export default router;