import express from 'express'
import {
  newPartner,
  renewPartnership,
  unsuscribePartnership,
  checkSubscription,
  checkAllSubscriptions,
} from '../controllers/index.js'

const router = express.Router()

//Ruta para dar de alta un socio/a:
router.post('/new-partner', newPartner)
router.post('/renew-partnership', renewPartnership)
router.post('/unsubscribe-partnership', unsuscribePartnership)
router.post('/check-subscription', checkSubscription)
router.get('/check-all-subscriptions', checkAllSubscriptions)

export default router
