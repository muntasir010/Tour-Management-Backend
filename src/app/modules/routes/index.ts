import { Router } from "express";
import { UserRoutes } from "../user/user.routes";
import { AuthRoutes } from "../auth/auth.routes";
import { DivisionRoutes } from "../division/division.routes";
import { BookingRoutes } from "../booking/booking.route";
import { PaymentRoutes } from "../payment/payment.route";
import { TourRoutes } from "../tours/tour.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
