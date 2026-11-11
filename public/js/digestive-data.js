export const stages = [
  {
    id: 'esophagus', name: 'Miệng / Thực quản', shortName: 'Thực quản',
    time: 'Khoảng 5–10 giây qua thực quản', ph: '6,5–7,5', phValue: 7,
    mechanism: 'Răng nghiền nhỏ thức ăn, nước bọt làm ẩm và amylase bắt đầu phân giải tinh bột. Sóng nhu động đẩy viên thức ăn qua thực quản đến dạ dày.',
    detail: 'Khởi đầu bằng nhai và nuốt', color: '#eaa29b', start: 0, end: 0.14,
  },
  {
    id: 'stomach', name: 'Dạ dày', shortName: 'Dạ dày',
    time: 'Khoảng 2–4 giờ', ph: '1,5–3,5', phValue: 2.5,
    mechanism: 'Cơ dạ dày co bóp trộn thức ăn với dịch vị. Axit hydrochloric tạo môi trường cho pepsin phân giải protein, tạo hỗn hợp nhuyễn gọi là dưỡng trấp.',
    detail: 'Nhào trộn và tiêu hóa protein', color: '#ed7f91', start: 0.14, end: 0.32,
  },
  {
    id: 'small-intestine', name: 'Ruột non', shortName: 'Ruột non',
    time: 'Khoảng 3–6 giờ', ph: '6,0–7,5', phValue: 6.8,
    mechanism: 'Dịch tụy và dịch ruột tiếp tục phân giải thức ăn; mật giúp nhũ tương hóa chất béo. Co bóp phân đoạn và nhu động đưa dưỡng trấp đi; nhung mao hấp thụ phần lớn chất dinh dưỡng vào máu và bạch huyết.',
    detail: 'Hấp thụ phần lớn dưỡng chất', color: '#f5a089', start: 0.32, end: 0.68,
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

export function getStageIndex(progress) {
  return stages.findIndex((stage, index) => progress < stage.end || index === stages.length - 1);
}
