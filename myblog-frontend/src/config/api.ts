import axios, { AxiosRequestConfig } from "axios";

const request = async <T = any>(
  url: string,
  config: AxiosRequestConfig
): Promise<T | undefined> => {
  const { data } = await axios.request<T>({ url, ...config });
  return data;
};

// export async function uploadImage(image: File) {
//   const formData = new FormData();
//   formData.append("images", image);
//
//   return request<Record<string, any>>("/api/upload", {
//     method: "POST",
//     data: formData,
//   });
// }

// export async function deleteArticle(body: { [key: string]: any }) {
//   return request<Record<string, any>>("/api/deleteArticle", {
//     method: "POST",
//     data: body,
//   });
// }

export async function getArticle(params: { [key: string]: any }) {
  return request<API.Article>("/api/getArticle", {
    method: "GET",
    params,
  });
}

export async function getTopArticles() {
  return request<API.Article[]>("/api/getTopArticles", {
    method: "GET",
  });
}

export async function getArticleList(params: { [key: string]: any }) {
  return request<{ list?: API.Article[]; total?: number }>(
    "/api/getArticleList",
    {
      method: "GET",
      params,
    }
  );
}

export async function getArticlesByTags(params: { [key: string]: any }) {
  return request<API.Article[]>("/api/getArticlesByTags", {
    method: "GET",
    params,
  });
}

export async function getTagsList() {
  return request<API.Tag[]>("/api/getTagsList", {
    method: "GET",
  });
}

// export async function getUsersList(params: { [key: string]: any }) {
//   return request<Record<string, any>>("/api/getUsersList", {
//     method: "GET",
//     params,
//   });
// }

export async function getUser(params: { [key: string]: any }) {
  return request<API.User>("/api/getUser", {
    method: "GET",
    params,
  });
}

// export async function resetUser(body: { [key: string]: any }) {
//   return request<Record<string, any>>("/api/resetUser", {
//     method: "POST",
//     data: body,
//   });
// }
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.User>("/api/currentUser", {
    method: "GET",
    ...(options || {}),
  });
}

export async function outLogin() {
  return request("/api/outLogin", {
    method: "POST",
  });
}

export async function getCommentsList(params: { [key: string]: any }) {
  return request<API.Comment[]>("/api/getCommentsList", {
    method: "GET",
    params,
  });
}

// export async function delComment(body: { [key: string]: any }) {
//   return request<Record<string, any>>("/api/delComment", {
//     method: "POST",
//     data: body,
//   });
// }

export async function addComment(body: { [key: string]: any }) {
  return request<Record<string, any>>("/api/addComment", {
    method: "POST",
    data: body,
  });
}

export async function getLatestComments() {
  return request<API.Comment[]>("/api/getLatestComments", {
    method: "GET",
  });
}

export async function getAbout() {
  return request<API.Article>("/api/getAbout", {
    method: "GET",
  });
}

// export async function updateAbout(body: { [key: string]: any }) {
//   return request<Record<string, any>>("/api/updateAbout", {
//     method: "POST",
//     data: body,
//   });
// }
export async function getAnncmnt() {
  return request<string>("/api/getAnncmnt", {
    method: "GET",
  });
}
