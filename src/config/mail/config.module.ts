import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './config.service';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRoot(
      {
        transport: {
          host: process.env.TRANSPORT_HOST,
          secure: true,
          auth:{
            user:process.env.AUTH_USER,
            pass:process.env.AUTH_PASS
          },
        },
        defaults: {
          from:process.env.DEFAULT_ASUNTO,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
  ],
  providers: [MailService],
  exports:[MailService]
})
export class MailModule {}
