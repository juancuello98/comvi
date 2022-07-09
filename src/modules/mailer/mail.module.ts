import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRoot(
      {
        transport: {
          host: 'smtp.gmail.com',
          secure: true,
          auth:{
            user:'comviapp@gmail.com',
            pass:'upmbggzbdkuadnne'
          },
        },
        defaults: {
          from: '"COMVI" <noreply@example.com>',
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
