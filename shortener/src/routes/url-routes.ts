import { Router } from 'express';
import { body } from 'express-validator';

import { createUrl, getUrls, pingUrl } from '../controllers/url-controllers';

const router = Router();

router.get('/', getUrls);
router.get('/:hash', pingUrl);
router.post('/', [body('url').trim().isURL()], createUrl);

export { router as urlRouter };
