import axios from 'axios';
import qs from 'qs';
import vue from 'vue';
import { Loading, Message } from 'element-ui';

import { getBaseUrl, getDynamicUrl } from '@/utils/index';

let loadingInstance: any = null;
const basurlpre = getBaseUrl();

const request = (url: string, body?: any, type = 'get') => {
  loadingInstance = Loading.service({
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.3)',
  });
  const query: any = {
    url: `${url}`,
    method: type,
    withCredentials: true,
    timeout: 30000,
    headers: {
      'Request-Ajax': true,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };

  if (type === 'get') {
    query.params = body;
  } else {
    query.data = body;
  }
  axios.interceptors.response.use(
    response => response,
    // 对响应数据做点什么

    error => {
      Message.error('服务器响应超时');
      return Promise.reject(error);
    }
  );
  return axios
    .request(query)
    .then(
      (res: { data: { code: string; data: any; message: any; msg: any } }) => {
        return new Promise((resolve, reject) => {
          loadingInstance.close();
          if (axios.isCancel(res)) {
            return;
          }
          if (!res.data) {
            reject(new Error('服务器响应超时'));
            return;
          }
          if (res.data.code === 'S') {
            resolve(res.data.data);
          } else {
            res.data.message = res.data.msg;
            reject(res.data);
          }
        });
      },
      (e: { response: { status: any } }): any => {
        loadingInstance.close();
        switch (e && e.response && e.response.status) {
          case 403:
            //top.location.href = getDynamicUrl('//demo.com/#/403');
            return;
          case 404:
            // top.location.href = getDynamicUrl('//demo.com/#/404');
            return;
          case 500:
            top.location.href = getDynamicUrl('//demo.com/#/500');
            return;
          default:
            break;
        }
        return Promise.reject(e.response);
      }
    )
    .catch((e: { status: number; message: any }) => {
      if (e) {
        if (e.status === -1) {
          vue.prototype.$message.warning(e && e.message ? e.message : '业务错误');
        } else {
          vue.prototype.$message.error(e && e.message ? e.message : '系统错误');
        }
      }
      return Promise.reject(e);
    });
};

const ATTENDANCE_URL = `/ucarsap/getCheckInfoList`;

export const getAttendance = (
  employeeCode: string,
  beginDate: string,
  endDate: string
): Promise<any> => {
  return request(ATTENDANCE_URL, {
    employeeCode,
    beginDate,
    endDate,
  });
};

export const permission = {
  getPermissionForButton: (query: any) => {
    return request('/admin/common/security/getUserButtonAuth.do_', query).then((re: any) =>
      Promise.resolve(re.data.split(','))
    );
  },
};
