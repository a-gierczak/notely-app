export interface Post {
  id: number;
  name: string;
  description: string;
  fileUrl: string;
  createdAt: Date;
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  posts: Post[];
}

export interface Token {
  accessToken: string;
  expires: Date;
}

export declare class ValidationError {
  target?: Object;
  property: string;
  constraints: {
    [type: string]: string;
  };
  children: ValidationError[];
}

export interface User {
  id: string;
  email: string;
}
