export const normal = [
  {
    id: 'mouth', name: 'Khoang miệng', shortName: 'Miệng',
    time: 'Vài giây đến vài phút', ph: '6,5–7,5', phValue: 7,
    mechanism: 'Răng nghiền nhỏ thức ăn. Nước bọt làm ẩm và amylase bắt đầu phân giải tinh bột trước khi nuốt.',
    detail: 'Nhai, tiết nước bọt và tạo viên thức ăn', color: '#eaa29b', start: 0, end: 0.05,
  },
  {
    id: 'esophagus', name: 'Thực quản', shortName: 'Thực quản',
    time: 'Khoảng 5–10 giây qua thực quản', ph: '6,5–7,5', phValue: 7,
    mechanism: 'Răng nghiền nhỏ thức ăn, nước bọt làm ẩm và amylase bắt đầu phân giải tinh bột. Sóng nhu động đẩy viên thức ăn qua thực quản đến dạ dày.',
    detail: 'Khởi đầu bằng nhai và nuốt', color: '#eaa29b', start: 0.05, end: 0.14,
  },
  {
    id: 'stomach', name: 'Dạ dày', shortName: 'Dạ dày',
    time: 'Khoảng 2–4 giờ', ph: '1,5–3,5', phValue: 2.5,
    mechanism: 'Cơ dạ dày co bóp trộn thức ăn với dịch vị. Axit hydrochloric tạo môi trường cho pepsin phân giải protein, tạo hỗn hợp nhuyễn gọi là dưỡng trấp.',
    detail: 'Nhào trộn và tiêu hóa protein', color: '#ed7f91', start: 0.14, end: 0.32,
  },
  {
    id: 'duodenum', name: 'Tá tràng', shortName: 'Tá tràng',
    time: 'Một phần thời gian qua ruột non', ph: '5,5–7,0', phValue: 6.3,
    mechanism: 'Bicarbonate trong dịch tụy trung hòa axit. Gan tạo mật, túi mật dự trữ và cô đặc mật rồi giải phóng vào tá tràng; enzyme tụy giúp tiêu hóa protein, chất béo và carbohydrate.',
    detail: 'Tiếp nhận mật và dịch tụy', color: '#eeb18d', start: 0.32, end: 0.4,
  },
  {
    id: 'small-intestine', name: 'Ruột non', shortName: 'Ruột non',
    time: 'Khoảng 3–6 giờ', ph: '6,0–7,5', phValue: 6.8,
    mechanism: 'Dịch tụy và dịch ruột tiếp tục phân giải thức ăn; mật giúp nhũ tương hóa chất béo. Co bóp phân đoạn và nhu động đưa dưỡng trấp đi; nhung mao hấp thụ phần lớn chất dinh dưỡng vào máu và bạch huyết.',
    detail: 'Hấp thụ phần lớn dưỡng chất', color: '#f5a089', start: 0.4, end: 0.68,
  },
  {
    id: 'large-intestine', name: 'Ruột già', shortName: 'Ruột già',
    time: 'Khoảng 12–48 giờ', ph: '5,5–7,0', phValue: 6.3,
    mechanism: 'Ruột già hấp thụ nước và điện giải còn lại. Vi khuẩn lên men một phần chất xơ; co bóp dồn khối đưa chất cặn tiến về trực tràng và dần tạo thành phân.',
    detail: 'Thu hồi nước, tạo chất cặn', color: '#d97a8c', start: 0.68, end: 0.94,
  },
  {
    id: 'rectum', name: 'Trực tràng / Hậu môn', shortName: 'Trực tràng',
    time: 'Thay đổi theo từng người', ph: 'Khoảng 6,0–7,0', phValue: 6.5,
    mechanism: 'Trực tràng tạm chứa phân. Sự căng thành trực tràng khởi phát phản xạ đại tiện; cơ thắt hậu môn phối hợp để kiểm soát việc thải chất cặn ra ngoài.',
    detail: 'Lưu trữ và đào thải', color: '#c56a7e', start: 0.94, end: 1,
  },
];

export const stages = normal;

export const toxic = [
  { id: 'salivation', name: 'Tăng tiết nước bọt', symptom: 'Buồn nôn, tăng nước bọt', mechanism: 'Phản xạ tự chủ có thể tăng tiết nước bọt trước khi nôn, giúp bảo vệ miệng và thực quản khỏi axit. Không phải mọi trường hợp đều có phản ứng này.' },
  { id: 'vomit', name: 'Phản xạ nôn', symptom: 'Buồn nôn, co thắt bụng, nôn ói', mechanism: 'Tín hiệu từ đường tiêu hóa và não có thể kích hoạt phản xạ nôn. Cơ hoành và cơ bụng co phối hợp, cơ thắt giãn, đẩy dịch dạ dày ngược qua thực quản. Không chủ động gây nôn khi nghi ngộ độc.' },
  { id: 'cramps', name: 'Đau quặn ruột', symptom: 'Đau quặn, co thắt, đầy bụng', mechanism: 'Tác nhân gây bệnh hoặc độc tố có thể kích thích niêm mạc, tăng tiết dịch và thay đổi nhu động. Hình đỏ và rung là ký hiệu minh họa, không thể hiện mức độ tổn thương thật.' },
  { id: 'diarrhea', name: 'Tiêu chảy', symptom: 'Đi ngoài phân lỏng, nguy cơ mất nước', mechanism: 'Tăng tiết nước và điện giải cùng giảm hấp thụ làm phân lỏng; vận chuyển ruột có thể nhanh hơn. Tiêu chảy không bảo đảm loại hết độc tố. Cần chú ý bù nước và đánh giá y tế khi có dấu hiệu nặng.' },
];

export function getToxicReaction(stageIndex, response, direction) {
  if (response === 'vomit') return toxic[direction < 0 || stageIndex >= 2 ? 1 : 0];
  return toxic[stageIndex >= 5 ? 3 : stageIndex >= 3 ? 2 : 0];
}

export function getStageIndex(progress) {
  return stages.findIndex((stage, index) => progress < stage.end || index === stages.length - 1);
}
