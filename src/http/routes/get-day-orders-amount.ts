/* 07/07/2024 - Igor Castilhos
*  The `getDayOrdersAmount` function, set up with
*  Elysia and protected by authentication middleware,
*  calculates and returns the total number of orders
*  for the current day and the percentage difference
*  from the previous day's orders for a managed
*  restaurant. It uses `dayjs` for date manipulation,
*  `drizzle-orm` for database queries to count orders
*  based on their creation date, and compares today's
*  order count with yesterday's to calculate
*  the difference, returning both the count and the
*  difference.
*/

import Elysia from 'elysia'
import { authentication } from '../authentication'
import { and, count, eq, gte, sql } from 'drizzle-orm'
import dayjs from 'dayjs'
import { db } from '@/db/db'
import { orders } from '@/db/schema'

export const getDayOrdersAmount = new Elysia()
    .use(authentication)
    .get('/metrics/day-orders-amount', async ({ getManagedRestaurantId }) => {
        const restaurantId = await getManagedRestaurantId()

        const today = dayjs()
        const yesterday = today.subtract(1, 'day')
        const startOfYesterday = yesterday.startOf('day')

        /**
         * January is ZERO, that's why we need to sum 1 to get the actual month
         */
        const yesterdayWithMonthAndYear = yesterday.format('YYYY-MM-DD')
        const todayWithMonthAndYear = today.format('YYYY-MM-DD')

        const ordersPerDay = await db
            .select({
                dayWithMonthAndYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
                amount: count(orders.id),
            })
            .from(orders)
            .where(
                and(
                    eq(orders.restaurantId, restaurantId),
                    gte(orders.createdAt, startOfYesterday.toDate()),
                ),
            )
            .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`)
            .having(({ amount }) => gte(amount, 1))

        const todayOrdersAmount = ordersPerDay.find((orderInDay) => {
            return orderInDay.dayWithMonthAndYear === todayWithMonthAndYear
        })

        const yesterdayOrdersAmount = ordersPerDay.find((orderInDay) => {
            return orderInDay.dayWithMonthAndYear === yesterdayWithMonthAndYear
        })

        const diffFromYesterday =
            yesterdayOrdersAmount && todayOrdersAmount
                ? (todayOrdersAmount.amount * 100) / yesterdayOrdersAmount.amount
                : null

        return {
            amount: todayOrdersAmount?.amount ?? 0,
            diffFromYesterday: diffFromYesterday
                ? Number((diffFromYesterday - 100).toFixed(2))
                : 0,
        }
    })
