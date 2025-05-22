import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://zaomengwenjuan-fe.vercel.app',
      'https://zaomengwenjuan-cside.vercel.app',
      'http://localhost:8000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 允许的 HTTP 方法
    // allowedHeaders: 'Content-Type,Authorization', // 允许的请求头
    // credentials: true, // 是否允许发送 Cookie
  });
  app.setGlobalPrefix('api'); //路由全局前缀
  app.useGlobalInterceptors(new TransformInterceptor()); //全局拦截器
  app.useGlobalFilters(new HttpExceptionFilter()); //全局过滤器
  // app.enableCors();
  await app.listen(3005); //路由端口
}
bootstrap();
