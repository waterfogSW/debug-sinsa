export const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return '0'; // 또는 '-', 'N/A' 등
  return num.toLocaleString();
};

export const formatTimestamp = (timestamp: number | string | undefined | null): string => {
  if (!timestamp) return '-'; // 또는 'N/A' 등
  try {
    const date = new Date(timestamp);
    // 간단한 한국식 날짜/시간 표현. 필요시 Intl.DateTimeFormat 사용 고려
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      // second: 'numeric', // 초는 생략하거나 필요에 따라 추가
    });
  } catch (error) {
    console.error('Error formatting timestamp:', timestamp, error);
    return 'Invalid Date';
  }
}; 