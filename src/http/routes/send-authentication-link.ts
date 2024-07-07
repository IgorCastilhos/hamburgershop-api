import Elysia, {t} from 'elysia'
import {db} from '@/db/db'
import {authLinks} from '@/db/schema'
import {createId} from '@paralleldrive/cuid2'
import {UnauthorizedError} from './errors/unauthorized-error'
import * as process from "node:process";

export const sendAuthenticationLink = new Elysia().post(
    '/authenticate',
    async ({ body }) => {
        const { email } = body

        const userFromEmail = await db.query.users.findFirst({
            where(fields, { eq }) {
                return eq(fields.email, email)
            },
        })

        if (!userFromEmail) {
            throw new UnauthorizedError()
        }

        const authLinkCode = createId()

        await db.insert(authLinks).values({
            userId: userFromEmail.id,
            code: authLinkCode,
        })

        const authLink = new URL('/auth-links/authenticate', process.env.API_BASE_URL)
        authLink.searchParams.set('code', authLinkCode)
        authLink.searchParams.set('redirect', process.env.AUTH_REDIRECT_URL!)

        console.log(authLink.toString())

        // await resend.emails.send({
        //   from: 'igorcastilhos2020@gmail.com',
        //   to: email,
        //   subject: '[Hamburger Shop] Link para login',
        //   react: AuthMagicLinkTemplate({
        //     userEmail: email,
        //     authLink: authLink.toString(),
        //   }),
        // })
    },
    {
        body: t.Object({
            email: t.String({ format: 'email' }),
        }),
    },
)
