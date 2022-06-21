import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export default function relativeCreatedAt(date?: string | number | dayjs.Dayjs | Date | null | undefined) {
  return dayjs(date).isSame(dayjs(), 'day') ? dayjs(date).fromNow() : dayjs(date).format('YYYY/MM/DD');
}
