import {Resend} from "resend";
import * as process from "node:process";

export const resend = new Resend(process.env.RESEND_API_KEY)
