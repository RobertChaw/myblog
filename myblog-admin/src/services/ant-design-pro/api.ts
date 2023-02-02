// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentAdminUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/currentAdminUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...(body || {}),
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function createArticle(body: { [key: string]: any }) {
  return request<Record<string, any>>('/api/createArticle', {
    method: 'POST',
    data: body,
  });
}

export async function getArticle(params: { [key: string]: any }) {
  return request<Record<string, any>>('/api/getArticle', {
    method: 'GET',
    params,
  });
}

export async function updateArticle(body: { [key: string]: any }) {
  return request<Record<string, any>>('/api/updateArticle', {
    method: 'POST',
    data: body,
  });
}

export async function uploadImage(image: File) {
  const formData = new FormData();
  formData.append('images', image);

  return request<Record<string, any>>('/api/upload', {
    method: 'POST',
    data: formData,
  });
}

export async function deleteArticle(body: { [key: string]: any }) {
  return request<Record<string, any>>('/api/deleteArticle', {
    method: 'POST',
    data: body,
  });
}

export async function getArticleList(params: { [key: string]: any }) {
  return request<Record<string, any>>('/api/getArticleList', {
    method: 'GET',
    params,
  });
}

export async function getTagsList() {
  return request<API.Tag[]>('/api/getTagsList', {
    method: 'GET',
  });
}

export async function deleteTag(body: { [key: string]: any }) {
  return request<API.Tag[]>('/api/delTag', {
    method: 'POST',
    data: body,
  });
}

export async function getUsersList(params: { [key: string]: any }) {
  return request<Record<string, any>>('/api/getUsersList', {
    method: 'GET',
    params,
  });
}

export async function getUser(params: { [key: string]: any }) {
  return request<API.User>('/api/getUser', {
    method: 'GET',
    params,
  });
}

export async function resetUser(body: { [key: string]: any }) {
  return request<Record<string, any>>('/api/resetUser', {
    method: 'POST',
    data: body,
  });
}

export async function getCommentsList(params: { [key: string]: any }) {
  return request<API.Comment[]>('/api/getCommentsList', {
    method: 'GET',
    params,
  });
}

export async function delComment(body: { [key: string]: any }) {
  return request<Record<string, any>>('/api/delComment', {
    method: 'POST',
    data: body,
  });
}

export async function addComment(body: { [key: string]: any }) {
  return request<Record<string, any>>('/api/addComment', {
    method: 'POST',
    data: body,
  });
}

export async function getAbout() {
  return request<Record<string, any>>('/api/getAbout', {
    method: 'GET',
  });
}

export async function updateAbout(body: { [key: string]: any }) {
  return request<Record<string, any>>('/api/updateAbout', {
    method: 'POST',
    data: body,
  });
}

export async function getAnncmnt() {
  return request<string>('/api/getAnncmnt', {
    method: 'GET',
  });
}

export async function updateAnncmnt(body: { [key: string]: any }) {
  return request<Record<string, any>>('/api/updateAnncmnt', {
    method: 'POST',
    data: body,
  });
}

export async function getPlacesList() {
  return request<API.Place[]>('/api/getPlacesList', {
    method: 'GET',
  });
}

export async function addPlace(body: { [key: string]: any }) {
  return request<API.Place[]>('/api/addPlace', {
    method: 'POST',
    data: body,
  });
}

export async function delPlace(body: { [key: string]: any }) {
  return request<Record<string, any>>('/api/delPlace', {
    method: 'POST',
    data: body,
  });
}
