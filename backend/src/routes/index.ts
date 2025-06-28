import { Router } from 'express';
import visaStatusRoutes from './visaStatus.routes';
import foreignerRoutes from './foreigner.routes';
import authRoutes from './auth.routes';
import applicationRoutes from './application.routes';
import inquiryRoutes from './inquiry.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/visa-statuses', visaStatusRoutes);
router.use('/foreigners', foreignerRoutes);
router.use('/applications', applicationRoutes);
router.use('/inquiries', inquiryRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;