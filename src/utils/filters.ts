export function dateFormat(val: string | number | Date | null, fmt: string) {
  if (val == null) {
    return null;
  }
  let date;
  if (val instanceof Date) {
    date = val;
  } else {
    date = new Date(val);
  }
  let weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  let o: any = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
    D: date.getDay(),
    C: weekDays[date.getDay()],
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
}
export function status(val: any) {
  switch (val) {
    case '1':
      return '审核中';
    default:
      return '已经审核';
  }
}
export function getFilterByName(val: any, name: any) {
  switch (name) {
    case 'status':
      return status(val);
    case 'moneyFormat':
      return moneyFormat(val);
  }
  return val;
}

export function employerStatus(val: any) {
  switch (val) {
    case 1:
      return '有效';
    default:
      return '无效';
  }
}
export function moneyFormat(val: any) {
  val = new String(val).replace(/\$|,/g, '');
  if (isNaN(val)) {
    val = '0';
  }
  let sign = val == (val = Math.abs(val));
  val = Math.floor(val * 100 + 0.50000000001);
  let cents: any = val % 100;
  val = Math.floor(val / 100).toString();
  if (cents < 10) {
    cents = '0' + cents;
  }
  for (var i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
    val =
      val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
  }
  return (sign ? '' : '-') + val + '.' + cents;
}

export function formatDay(val: any) {
  //console.log(JSON.stringify(val));

  const day = val
    .split('-')
    .slice(2)
    .join('-');

  return parseInt(day);
}
