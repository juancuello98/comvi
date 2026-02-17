import { Global, Module } from '@nestjs/common';
import { MailService } from './config.service';
import { join } from 'path';
import * as nodemailer from 'nodemailer';

// Dynamic import for ESM module
const loadHbs = async () => {
  const module = await import('nodemailer-express-handlebars');
  return module.default;
};

@Global()
@Module({
  providers: [
    {
      provide: 'MAILER_TRANSPORT',
      useFactory: async () => {
        const hbs = await loadHbs();
        const transporter = nodemailer.createTransport({
          host: process.env.TRANSPORT_HOST || 'smtp.gmail.com',
          secure: true,
          auth: {
            user: process.env.AUTH_USER,
            pass: process.env.AUTH_PASS,
          },
        });

        // Configurar el adaptador de plantillas
        transporter.use(
          'compile',
          hbs({
            viewEngine: {
              extname: '.hbs',
              layoutsDir: join(__dirname, 'templates'),
              defaultLayout: false,
            },
            viewPath: join(__dirname, 'templates'),
            extName: '.hbs',
          }),
        );

        return transporter;
      },
    },
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}