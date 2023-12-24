import i18n from 'i18n-js';

export * from './components';
export * from './theme';

export interface IQuizGroupCard {
  id?: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  quizQuantity?: number;
  userSolvedCount?:number;
  attributes?:any;
}

export interface IQuizCard {
  id?: number;
  name?: string;
  questionCount?: number;
  priority?: number;
  solvedCount?:number;
  attributes?:any;
}

export interface IQuizQuestion {
  id: number;
  content: string;
  imgUrl: string;
  correctAnswerId: number;
  explanation?: string;
  attributes: any;
  answersList: IAnswerResponse[];
}

export interface IAnswerResponse {
  id: number;
  content: string;
  imgUrl: string;
}

export interface ISolvedQuizCard {
  id?: number;
  state?: string;
  timeTaken?: number;
  quiz?:IQuizLightResponse;
  completeDate?:Date;
}

export interface IQuizLightResponse {
  id?: number;
  name?: string;
  attributes?:any;
}

export interface ITranslate {
  locale: string;
  setLocale: (locale?: string) => void;
  t: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
  translate: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
}
