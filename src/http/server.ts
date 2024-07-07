import Elysia from "elysia";
import cors from "@elysiajs/cors";
import {authentication} from "@/http/authentication.ts";
import {getManagedRestaurant} from "@/http/routes/get-managed-restaurant.ts";
import {authenticateFromLink} from "@/http/routes/authenticate-from-link.ts";
import {approveOrder} from "@/http/routes/approve-order.ts";
import {signOut} from "@/http/routes/sign-out.ts";
import {getProfile} from "@/http/routes/get-profile.ts";
import {registerRestaurant} from "@/http/routes/register-restaurant.ts";
import {registerCustomer} from "@/http/routes/register-customer.ts";
import {sendAuthenticationLink} from "@/http/routes/send-authentication-link.ts";
import {createOrder} from "@/http/routes/create-order.ts";
import {cancelOrder} from "@/http/routes/cancel-order.ts";
import {dispatchOrder} from "@/http/routes/dispatch-order.ts";
import {deliverOrder} from "@/http/routes/deliver-order.ts";
import {getOrders} from "@/http/routes/get-orders.ts";
import {getOrderDetails} from "@/http/routes/get-order-details.ts";
import {createEvaluation} from "@/http/routes/create-evaluation.ts";
import {getEvaluations} from "@/http/routes/get-evaluations.ts";
import {updateMenu} from "@/http/routes/update-menu.ts";
import {updateProfile} from "@/http/routes/update-profile.ts";
import {getMonthReceipt} from "@/http/routes/get-month-receipt.ts";
import {getMonthOrdersAmount} from "@/http/routes/get-month-orders-amount.ts";
import {getDayOrdersAmount} from "@/http/routes/get-day-orders-amount.ts";
import {getMonthCanceledOrdersAmount} from "@/http/routes/get-month-canceled-orders-amount.ts";
import {getDailyReceiptInPeriod} from "@/http/routes/get-daily-receipt-in-period.ts";
import {getPopularProducts} from "@/http/routes/get-popular-products.ts";

const app = new Elysia()
    .use(
        cors({
            credentials: true,
            allowedHeaders: ['content-type'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
            origin: (request): boolean => {
                const origin = request.headers.get('origin')

                if (!origin) return false

                return true
            },
        }),
    )
    .use(authentication)
    .use(signOut)
    .use(getProfile)
    .use(getManagedRestaurant)
    .use(registerRestaurant)
    .use(registerCustomer)
    .use(sendAuthenticationLink)
    .use(authenticateFromLink)
    .use(createOrder)
    .use(approveOrder)
    .use(cancelOrder)
    .use(dispatchOrder)
    .use(deliverOrder)
    .use(getOrders)
    .use(getOrderDetails)
    .use(createEvaluation)
    .use(getEvaluations)
    .use(updateMenu)
    .use(updateProfile)
    .use(getMonthReceipt)
    .use(getMonthOrdersAmount)
    .use(getDayOrdersAmount)
    .use(getMonthCanceledOrdersAmount)
    .use(getDailyReceiptInPeriod)
    .use(getPopularProducts)
    .onError(({code, error, set}) => {
        switch (code) {
            case 'VALIDATION': {
                set.status = error.status

                return error.toResponse()
            }
            case 'NOT_FOUND': {
                return new Response(null, {status: 404})
            }
            default: {
                console.log(error)

                return new Response(null, {status: 500})
            }
        }
    })

app.listen(3333)

console.log(
    `🥳 HTTP server running at ${app.server?.hostname}:${app.server?.port}`,
)
