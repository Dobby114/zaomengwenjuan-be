// /vercel-func.js
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
 
import { AppModule } from './dist/app.module';
import { TransformInterceptor } from './transform/transform.interceptor';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
 
// 将应用实例保留在内存中，以便后续请求使用
let app;
export default async function handler(req, res) {
  // 在冷启动时启动我们的 NestJS 应用
  if (!app) {
    app = await NestFactory.create(AppModule);
 
  app.setGlobalPrefix('api'); //路由全局前缀
  app.useGlobalInterceptors(new TransformInterceptor()); //全局拦截器
  app.useGlobalFilters(new HttpExceptionFilter()); //全局过滤器
  app.enableCors(); //  允许跨域
  // await app.listen(3005); //路由端口 serverless 不需要指定端口??
  await app.listen(3005, '0.0.0.0');
 
    const config = new DocumentBuilder()
      .setTitle('EasyNotes API')
      .setDescription('EasyNotes API 文档')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
 
    app.useGlobalPipes(
      new ValidationPipe({
        // 要求字段存在
        whitelist: true,
 
        // 使用 class-transformer
        transform: true,
 
        // 在响应中使用验证器和转换器
        always: true,
      }),
    );
 
    SwaggerModule.setup('api', app, document);
 
    // 这一步很重要
    await app.init();
  }
  const adapterHost = app.get(HttpAdapterHost);
  const httpAdapter = adapterHost.httpAdapter;
  const instance = httpAdapter.getInstance();
 
  instance(req, res);
}