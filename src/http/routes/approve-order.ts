/* 07/07/2024 Igor Castilhos

* This code defines a secure, authenticated route for
* approving orders, with validation and error handling.
*
* Route Definition: An instance of Elysia is created
* and the authentication middleware is applied using
* .use(). This ensures that the route is protected and
* only accessible to authenticated users. The .patch()
* method is used to define a PATCH route. This route is
* intended to change the status of an order to 'processing'
* if it's currently 'pending'. The route handler receives
* an object with methods and properties. params contains
* route parameters, in this case, the order ID.
*
* Route Handler Logic:
* Extracts the order ID from the route parameters.
* Retrieves the restaurant ID associated with the current
* user by calling getManagedRestaurantId(). Queries the
* database for the order using the provided order ID and
* restaurant ID. It will find the first order that matches
* the criteria.
*
* Route Parameters Validation:
* The route expects a parameters object with an 'id' field
* of type string. This is defined using the t.Object and
* t.String validators from the Elysia package, ensuring that
* the route parameter conforms to the expected format.
*/

import Elysia, { t } from 'elysia'
import { authentication } from '../authentication'
import { db } from '@/db/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { UnauthorizedError } from './errors/unauthorized-error'

export const approveOrder = new Elysia().use(authentication).patch(
    '/orders/:id/approve',
    async ({ getManagedRestaurantId, set, params }) => {
        const { id: orderId } = params
        const restaurantId = await getManagedRestaurantId()

        const order = await db.query.orders.findFirst({
            where(fields, { eq, and }) {
                return and(
                    eq(fields.id, orderId),
                    eq(fields.restaurantId, restaurantId),
                )
            },
        })

        if (!order) {
            throw new UnauthorizedError()
        }

        if (order.status !== 'pending') {
            set.status = 400

            return { message: 'Order was already approved before.' }
        }

        await db
            .update(orders)
            .set({
                status: 'processing',
            })
            .where(eq(orders.id, orderId))

        set.status = 204
    },
    {
        params: t.Object({
            id: t.String(),
        }),
    },
)
