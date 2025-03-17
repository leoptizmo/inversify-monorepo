import { ApplyMiddlewareOptions } from '../../http/models/ApplyMiddlewareOptions';
import { isApplyMiddlewareOptions } from '../../http/typeguard/isApplyMiddlewareOptions';
import { Converter } from './Converter';

export class ApplyMiddlewareOptionsToNewableFunctionConverter
  implements
    Converter<
      (NewableFunction | ApplyMiddlewareOptions)[],
      {
        postHandlerMiddlewareList: NewableFunction[];
        preHandlerMiddlewareList: NewableFunction[];
      }
    >
{
  public convert(input: (NewableFunction | ApplyMiddlewareOptions)[]): {
    postHandlerMiddlewareList: NewableFunction[];
    preHandlerMiddlewareList: NewableFunction[];
  } {
    const result: {
      postHandlerMiddlewareList: NewableFunction[];
      preHandlerMiddlewareList: NewableFunction[];
    } = {
      postHandlerMiddlewareList: [],
      preHandlerMiddlewareList: [],
    };

    for (const item of input) {
      if (isApplyMiddlewareOptions(item)) {
        const middlewareList: NewableFunction[] = [];

        if (Array.isArray(item.middleware)) {
          middlewareList.push(...item.middleware);
        } else {
          middlewareList.push(item.middleware);
        }

        if (item.phase === 'postHandler') {
          result.postHandlerMiddlewareList.push(...middlewareList);
        } else {
          result.preHandlerMiddlewareList.push(...middlewareList);
        }
      } else {
        result.preHandlerMiddlewareList.push(item);
      }
    }

    return result;
  }
}
