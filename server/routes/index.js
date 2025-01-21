const Router = require('express').Router;
const router = new Router();

router.use('/contracts', require('./contractRouter'));
router.use('/deliveries', require('./deliveryRouter'));
router.use('/departments', require('./departmentRouter'));
router.use('/employees', require('./employeeRouter'));
router.use('/organizations', require('./organizationRouter'));

module.exports = router;