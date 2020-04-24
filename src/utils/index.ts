import { Component, Mixins, Vue } from 'vue-property-decorator';
import moment from 'moment';
/* eslint-disable */
export const recursion = (array: any, key: any, value: any, childKey: any): any => {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) return array[i];
    if (
      array[i][childKey] &&
      array[i][childKey] instanceof Array &&
      array[i][childKey].length > 0
    ) {
      let result = recursion(array[i][childKey], key, value, childKey);
      if (result) return result;
    }
  }
  return null;
};
export const cookies = {
  // 设置cookie
  setCookie: (cName: string, value: string, expiredays: number) => {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
      cName + '=' + escape(value) + (expiredays === null ? '' : ';expires=' + exdate.toUTCString());
  },
  // 获取cookie
  getCookie: (name: any) => {
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    const arr = document.cookie.match(reg);
    if (arr) {
      return unescape(arr[2]);
    }
    return null;
  },
  // 删除cookie
  delCookie: (name: string) => {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = cookies.getCookie(name);
    if (cval !== null) {
      document.cookie = `${name}=${cval};expires=${exp.toUTCString()}`;
    }
  },
};

@Component
export class RouteMixin extends Vue {
  /**
   * 此变量作用需要评估，目前看只是window 挂$currentVm 当前路由引用，用于分享 route 配置，
   * vuex 可能更适合此场景？？ 待优化
   */
  marioConfig: any = {
    autoClose: false,
    openerCallBack: '',
  };

  mounted(this: any) {
    this.marioConfig.autoClose = !!this.$route.query.autoClose;
    this.marioConfig.openerCallBack = this.$route.query.callback;
    this.registryVm();
  }

  get userPermissions(this: any): any {
    return this.$store.getters.permissions;
  }

  registryVm() {
    window.$currentVm = this;
  }
  pageOver(this: any) {
    const timer =
      arguments[arguments.length - 1] && typeof arguments[arguments.length - 1] === 'number'
        ? arguments[arguments.length - 1]
        : 300;
    const opener = window.opener;
    if (!opener) return;
    const { autoClose, openerCallBack } = this.$data.$marioConfig;
    if (openerCallBack && typeof opener.$currentVm[openerCallBack] === 'function') {
      opener.$currentVm[openerCallBack](...arguments);
    }
    if (autoClose === true) {
      setTimeout(() => {
        window.close();
      }, timer);
    }
  }
  /**
   * 此方法作用待查
   * @param url
   * @param options
   */
  callNewPage(url: string, options: any = {}) {
    if (!options.autoClose) options.autoClose = true;
    let path = /\/$/.test(url) ? url : `${url}/`;
    const target = /^(http|https):\/\//.test(path) ? url : `/#${url}`;
    let queryStr = '';
    for (let key in options) {
      queryStr += queryStr === '' ? `?${key}=${options[key]}` : `&${key}=${options[key]}`;
    }
    window.open(`${target}${queryStr}`);
  }

  beforeRouteUpdate(this: any) {
    this.registryVm();
  }
}

export const mixin = (obj: {
  mixins: {
    data(): { $marioConfig: { autoClose: boolean; openerCallBack: string } };
    computed: { userPermissions(): any };
    methods: { registryVm(): void; pageOver(): void; callNewPage(url: any, options?: {}): void };
    mounted(): void;
    beforeRouteUpdate(): void;
  }[];
}) => {
  const base = {
    data() {
      return {
        $marioConfig: {
          autoClose: false,
          openerCallBack: '',
        },
      };
    },
    computed: {
      userPermissions(this: any): any {
        return this.$store.getters.permissions;
      },
    },
    methods: {
      registryVm() {
        window.$currentVm = this;
      },
      pageOver(this: any) {
        const timer =
          arguments[arguments.length - 1] && typeof arguments[arguments.length - 1] === 'number'
            ? arguments[arguments.length - 1]
            : 300;
        const opener = window.opener;
        if (!opener) return;
        const { autoClose, openerCallBack } = this.$data.$marioConfig;
        if (openerCallBack && typeof opener.$currentVm[openerCallBack] === 'function') {
          opener.$currentVm[openerCallBack](...arguments);
        }
        if (autoClose === true) {
          setTimeout(() => {
            window.close();
          }, timer);
        }
      },
      callNewPage(url: string, options: any = {}) {
        if (!options.autoClose) options.autoClose = true;
        let path = /\/$/.test(url) ? url : `${url}/`;
        const target = /^(http|https):\/\//.test(path) ? url : `/#${url}`;
        let queryStr = '';
        for (let key in options) {
          queryStr += queryStr === '' ? `?${key}=${options[key]}` : `&${key}=${options[key]}`;
        }
        window.open(`${target}${queryStr}`);
      },
    },
    mounted(this: any) {
      this.data.$marioConfig.autoClose = !!this.$route.query.autoClose;
      this.data.$marioConfig.openerCallBack = this.$route.query.callback;
      this.registryVm();
    },
    beforeRouteUpdate(this: any) {
      this.registryVm();
    },
  };
  if (obj.mixins) {
    obj.mixins.push(base);
  } else {
    obj.mixins = [base];
  }
  return obj;
};

export const parseRoute = (menus: any) => {
  const routes: any = [];
  const traverse = (list: any) => {
    for (let i = 0; i < list.length; i++) {
      const url = list[i].menuUrl || list[i].path;
      if (url && !/^_/.test(url)) {
        const src = url.replace(/.+#/, '').replace(/\/:[\w_\d]+/g, '');
        const path = url.replace(/.+#/, '');
        if (require(`@/pages${src}`).default) {
          routes.push({
            path,
            component: mixin(require(`@/pages${src}`).default),
          });
        } else {
          console.warn('未能解析的文件路径:', src);
        }
      }
      const children = list[i].children || list[i].subMenus;
      if (children instanceof Array && children.length > 0) {
        traverse(children);
      }
    }
    return routes;
  };
  return traverse(menus);
};

export const getCurrEnvContext = () => {
  let env = '';
  switch (window.runtime_env) {
    case 'development':
      env = '开发环境';
      break;
    case 'test':
      env = '测试一环境';
      break;
    case 'test2':
      env = '测试二环境';
      break;
    case 'test3':
      env = '测试三环境';
      break;
    case 'preProduct':
      env = '预生产环境';
      break;
    case 'product':
      env = '生产环境';
      break;
    default:
      env = '';
  }
  return env;
};
export const getBaseUrl = () => {
  let basUrlPre = '';
  switch (window.runtime_env) {
    case 'development':
      basUrlPre = '/api';
      break;
    case 'test':
      basUrlPre = '';
      break;
    case 'test2':
      basUrlPre = '';
      break;
    case 'test3':
      basUrlPre = '';
      break;
    case 'preProduct':
      basUrlPre = '';
      break;
    case 'product':
      basUrlPre = '';
      break;
    default:
      basUrlPre = '';
  }
  return basUrlPre;
};

export const getDynamicUrl = (url: string, host = 'demo.com') => {
  const envMap: any = {
    development: '',
    test: 'test1',
    test2: 'test02',
    test3: 'test03',
    preProduct: 'pre',
    product: '',
  };
  // window.runtime_env 在build/webpack.dev.conf.js|build/webpack.prod.conf.js中定义, 旨在标注当前代码运行以及打包时的环境
  if (!window.runtime_env) return url;
  if (/demo\.com/.test(url)) url = url.replace('demo.com', host);
  return url.replace(new RegExp(`(.+).${host}`), `$1${envMap[window.runtime_env]}.${host}`);
};
// 字体图标数组
export const iconArray = () => {
  return [
    'iconfont icon-weibiaoti1',
    'iconfont icon-gongzuoliuchengtu',
    'iconfont icon-supplier',
    'iconfont icon-caigou',
    'iconfont icon-iconset0177',
    'iconfont icon-menu',
    'iconfont icon-message',
    'iconfont icon-quanxian',
    'iconfont icon-hetong',
    'iconfont icon-kaoqin',
    'iconfont icon-shouji',
    'iconfont icon-yuangong',
    'iconfont icon-xinwen',
    'iconfont icon-quanxianguanli',
    'iconfont icon-jiantou',
    'iconfont icon-tongxunlu',
    'iconfont icon-zhixingdiaodu',
    'iconfont icon-fangdajing',
    'iconfont icon-xiaolaba',
    'iconfont icon-yuangongguanli',
    'iconfont icon-jiekuanxinxi',
    'iconfont icon-web-icon',
    'iconfont icon-yuangongguanli1',
    'iconfont icon-icon-test',
    'iconfont .icon-caigouguocheng',
    'iconfont icon-dkw_jiekuan',
    'iconfont icon-news_icon',
    'iconfont icon-kaoqin1',
    'iconfont icon-tubiaolunkuo_huaba',
    'iconfont icon-neirongzixunmoren-',
    'iconfont icon-tongxunlu1',
    'iconfont icon-jixiao',
    'iconfont .icon-tiaoduguanli',
    'iconfont icon-APIguanli',
    'iconfont icon-jiekuanshenqing',
    'iconfont icon-gongyingshang',
    'iconfont icon-quanxianguanli1',
    'iconfont icon-authority',
    'iconfont icon-ziliaoneirongguanli_huaban',
    'iconfont icon-api',
    'iconfont icon-daiban',
    'iconfont icon-tiaodu',
    'iconfont icon-xinwen1',
    'iconfont .icon-Message-center',
    'iconfont icon-shenqing',
    'iconfont icon-xiaoxizhongxin',
    '',
  ];
};

export const getFisrtDateOfMonth = (currentDate?: string) => {
  const curentMoment = currentDate ? moment(currentDate) : moment();

  return curentMoment.startOf('month').format('YYYY-MM-DD');
};
export const getLastDateOfMonth = (currentDate?: string) => {
  const curentMoment = currentDate ? moment(currentDate) : moment();

  return curentMoment
    .startOf('month')
    .add(1, 'month')
    .subtract(1, 'd')
    .format('YYYY-MM-DD');
};
