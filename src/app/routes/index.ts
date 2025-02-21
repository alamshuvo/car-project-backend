import { Router } from 'express';
import { HomeRoutes } from '../modules/home/home.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { ProductRoutes } from '../modules/product/product.route';
import { OrderRoutes } from '../modules/order/order.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { CartRoutes } from '../modules/cart/cart.route';
import { BillingAddressRoutes } from '../modules/billingAddress/billingAddress.route';

const router = Router();

const apiPrefix = '/api';

const moduleRoutes = [
  {
    path: '/',
    route: HomeRoutes,
  },
  {
    path: `${apiPrefix}`,
    route: HomeRoutes,
  },
  {
    path: `${apiPrefix}/auth`,
    route: AuthRoutes,
  },
  {
    path: `${apiPrefix}/admin`,
    route: AdminRoutes,
  },
  {
    path: `${apiPrefix}/products`,
    route: ProductRoutes,
  },
  {
    path: `${apiPrefix}/cart`,
    route: CartRoutes,
  },
  {
    path: `${apiPrefix}/orders`,
    route: OrderRoutes,
  },
  {
    path: `${apiPrefix}/reviews`,
    route: ReviewRoutes,
  },
  {
    path: `${apiPrefix}/payments`,
    route: PaymentRoutes,
  },
  {
    path: `${apiPrefix}/billing-address`,
    route: BillingAddressRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

moduleRoutes.forEach((moduleRoute) => {
  router.use(moduleRoute.path, moduleRoute.route);
});

export default router;
