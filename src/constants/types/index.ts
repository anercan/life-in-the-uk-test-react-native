export enum UserQuizState {
  COMPLETED = 'COMPLETED',
  ON_GOING = 'ON_GOING',
}

export enum PremiumType {
  NONE = 'NONE',
  LEVEL1 = 'LEVEL1',
}

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
  correctCount?:number;
  attributes?:any;
  state?:string;
  locked?:boolean | undefined;
}

export interface IQuizQuestion {
  id: number;
  questionOrder:number;
  content: string;
  imgUrl: string;
  correctAnswerId: number;
  explanation?: string;
  attributes?: any;
  answersList: IAnswerResponse[];
  selectedId:number;
  onSelect: (selectedId: number) => void;
  isAnswered:boolean;
  isReviewPage:boolean;
  showCorrectAnswer?:boolean
  onSkipTap: () => void;
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


export interface ActivityData {
  count: number,
  date: string
}

export interface UserDataResponse {
  avatarUrl: string;
  userSolvedQuizCount: number;
  userOngoingQuizCount: number;
  totalQuizCount: number;
}



