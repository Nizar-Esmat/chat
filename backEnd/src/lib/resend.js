import { Resend } from 'resend';
import { env } from '../config/env.js';

export const resendClient = new Resend(env.RESEND_API_KEY);
export const sender = {
    name: env.EMAIL_FROM_NAME,
    email: env.EMAIL_FROM
}