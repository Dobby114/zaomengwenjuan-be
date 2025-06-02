import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { SseService } from './sse.service';
import { Public } from '../auth/decorators/public.decorator';
import { interval, map, Observable } from 'rxjs';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Public()
  @Sse()
  getSse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((count) => ({
        data: {
          time: new Date().toISOString(),
          value: this.sseService.genRandomNumber(),
          count,
        },
      })),
    );
  }
}
