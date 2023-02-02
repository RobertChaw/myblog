declare namespace API {
  type Loading = {
    loading?: boolean;
  };
  type Article = {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    tags?: Tag[];
    title?: string;
    content?: string;
    description?: string;
    viewCount?: number;
    comments?: Comment[];
  };

  type Tag = {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    title?: string;
  };

  type Comment = {
    id?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user?: User;
    message?: string;
    article?: Article;
    articleId?: number;
    parentId?: number;
    rootId?: number;

    parent?: Comment;
    nodes?: Comment[];
  };

  type UserFromGitHub = {
    id?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    githubId?: number;
    name?: string;
    url?: string;
    userId?: number;
  };

  type User = {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    username?: string;
    name?: string;
    password?: string;
    isAdmin?: boolean;
    avatar?: string;
    url?: string;
    isBanned?: boolean;
    // githubProfile?: UserFromGitHub;
  };

  type Place = {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    name?: string;
    status?: number;
    date?: number;
  };

  type MyResponseType<T> = {
    success: boolean;
    message: string;
    data: T;
  };
}
