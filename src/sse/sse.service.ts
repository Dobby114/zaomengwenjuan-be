import { Injectable } from '@nestjs/common';

@Injectable()
export class SseService {
  genRandomNumber(): Array<number> {
    const list: Array<number> = [];
    for (let i = 0; i < 7; i++) {
      list.push(Math.floor(Math.random() * 200));
    }
    return list;
  }
}
