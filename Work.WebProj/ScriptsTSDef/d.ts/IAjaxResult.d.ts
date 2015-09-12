interface IResultBase {
    result: boolean;
    message: string;
    data: any;
} 

interface IResultData<T> {
    result: boolean;
    hasData: boolean;
    message: string;
    data: T;
}

interface IJSONBase {
    result: boolean;
    message: string;
    json: {};
}

interface IJSONData<T> {
    result: boolean;
    message: string;
    json: T;
} 