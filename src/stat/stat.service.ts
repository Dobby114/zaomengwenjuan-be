import { Injectable } from '@nestjs/common';
import { AnswerService } from 'src/answer/answer.service';
import { QuestionService } from 'src/question/question.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { answerType } from 'src/answer/dto/answer.dto';

@Injectable()
export class StatService {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
  ) {}
  //   分页获取单个问卷答卷列表

  // _genAnswerList(questionId: string, answerList: Array) {}
  async findAll(questionId: string, pageNo = 1, pageSize = 10) {
    if (!questionId) {
      throw new HttpException('缺乏questionId!', HttpStatus.BAD_REQUEST);
    }
    const q = await this.questionService.findOne(questionId);
    if (q == null) {
      throw new HttpException('该问卷不存在!', HttpStatus.BAD_REQUEST);
    }
    const total = await this.answerService.countAll(questionId);
    if (total === 0) {
      return { list: [], total };
    }
    const answers = await this.answerService.findAll(
      questionId,
      pageNo,
      pageSize,
    );
    const list = answers.map((item) => {
      const answerList = item.get('answerList') as answerType['answerList'];
      const _id = item.get('_id') as string;
      const transformedAnswers = {};
      answerList.forEach((item) => {
        const { componentId, value } = item;
        transformedAnswers[componentId] = value;
      });

      return { _id, ...transformedAnswers };
    });
    return { list, total };
  }

  _genRadioText(value, props) {
    const {
      options = [] as Array<{
        label: string;
        value: string;
        checked?: boolean;
      }>,
    } = props;
    const targetOption = options.find((item) => item.value === value);
    // console.log(options, value);
    if (!targetOption) return;
    return targetOption.label;
  }
  // 统计所有答卷中某个组件的数据（只统计单选和多选的组件）
  // 数据格式：{name:string,count:number}[]
  async genComponentStat(questionId: string, componentId: string) {
    if (!questionId) {
      throw new HttpException('缺乏questionId!', HttpStatus.BAD_REQUEST);
    }
    const q = await this.questionService.findOne(questionId);
    if (q == null) {
      throw new HttpException('该问卷不存在!', HttpStatus.BAD_REQUEST);
    }
    // 无答卷
    const total = await this.answerService.countAll(questionId);
    if (total === 0) {
      return { stat: [] };
    }
    //  非单选或者多选
    const componentList = q.get('componentList');
    const targetComponent = componentList.find(
      (item) => item.fe_id === componentId,
    );
    if (!targetComponent) {
      throw new HttpException('该组件不存在!', HttpStatus.BAD_REQUEST);
    }
    const { type, props = {} } = targetComponent;
    const answers = await this.answerService.findAll(questionId, 1, total); //[{questionId,answerList}]
    // 先获取目标答卷字典{value1:4,value3:9}
    // 再根据type和value，获取相应的label
    const targetAnswer = {};
    answers.forEach((answer) => {
      const answerList = answer.get('answerList') as answerType['answerList'];
      answerList.forEach((item) => {
        const { value } = item;
        if (item.componentId !== componentId) return;
        if (type === 'questionCheckbox') {
          const valueList = value.split(',');
          // console.log(valueList);
          valueList.forEach((val) => {
            targetAnswer[val] = targetAnswer[val] ? targetAnswer[val] + 1 : 1;
          });
        } else if (type === 'questionRadio') {
          targetAnswer[value] = targetAnswer[value]
            ? targetAnswer[value] + 1
            : 1;
        }
      });
    });
    // 整理数据
    const stat = [];
    console.log(targetAnswer);
    for (const val in targetAnswer) {
      // if (type === 'questionRadio') {
      //   const text = this._genRadioText(val, props);
      // }
      // if (type === 'questionCheckbox') {
      // }
      const text = this._genRadioText(val, props);
      stat.push({ name: text, count: targetAnswer[val] });
    }

    //   if (type === 'questionRadio') {
    //     // 单选
    //     const { options } = props as {
    //       options: Array<{ label: string; value: string }>;
    //       [key: string]: string;
    //     }; //{label,value}[]
    //     const stat = {};
    //     answers.forEach((answer) => {
    //       const answerList = answer.get('answerList') as answerType['answerList'];
    //       const targetAnswer = answerList.find(
    //         (item) => item.componentId === componentId,
    //       );
    //       if (targetAnswer) {
    //         const targetOption = options.find(
    //           (item) => item.value === targetAnswer.value,
    //         );
    //         if (targetOption) {
    //           stat[targetOption.label] = stat[targetOption.label]
    //             ? stat[targetOption.label] + 1
    //             : 1;
    //         }
    //       }
    //     });

    //     return { stat: [{ name: 'option1', count: 4 }] };
    //   } else if (type === 'questionCheckbox') {
    //     //多选 answer为 'value1,value2'
    //   } else {
    //     return { stat: [] };
    //   }
    return { stat };
  }
}
