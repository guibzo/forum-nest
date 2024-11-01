import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'fatal', 'warn'],
  })

  patchNestJsSwagger()

  const config = new DocumentBuilder().setTitle('Forum API').setDescription('').build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  await app.listen(port)
}
bootstrap()
