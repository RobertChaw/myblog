import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
export const relative = (date: string | Date) => {
  return dayjs(date).fromNow();
};

export const absolute = (date: string | Date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};
