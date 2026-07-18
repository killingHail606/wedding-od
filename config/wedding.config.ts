import type { WeddingContent } from '#shared/types'

/**
 * Default wedding content. This is used to seed the database on first run.
 * After seeding, the CMS in /admin becomes the source of truth — edit there,
 * not here. Photo paths point to /public/images placeholders for now.
 */
export const defaultContent: WeddingContent = {
  couple: {
    brideName: 'Дарʼя',
    groomName: 'Олександр',
    displayName: 'Дарʼя & Олександр',
  },

  event: {
    dateTime: '2026-09-26T14:00:00+03:00',
    dateLabel: '26 вересня 2026',
    timeLabel: '14:00',
  },

  hero: {
    // Temporary Unsplash photos — replace with your own in /admin.
    photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=75&auto=format&fit=crop',
    kicker: 'Ми одружуємось',
    invitationLine:
      'З радістю запрошуємо вас розділити з нами найважливіший день нашого життя',
  },

  gallery: [
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=75&auto=format&fit=crop', alt: 'Обручки та букет', orientation: 'landscape' },
    { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1400&q=75&auto=format&fit=crop', alt: 'Прогулянка вдвох', orientation: 'landscape' },
    { src: 'https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=1200&q=75&auto=format&fit=crop', alt: 'Весільний букет', orientation: 'square' },
    { src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=75&auto=format&fit=crop', alt: 'Дарʼя та Олександр', orientation: 'portrait' },
  ],

  invitation: {
    heading: 'Дорогі гості',
    paragraphs: [
      'Є моменти, які хочеться переживати поруч із найближчими людьми. Наше весілля — саме такий момент.',
      'Будемо щиро раді бачити вас цього дня, щоб разом наповнити його теплом, усмішками та любовʼю.',
    ],
  },

  venue: {
    banquet: {
      name: 'River Grill',
      address: 'Русанівська набережна, 3А, Київ',
      timeLabel: '14:00',
      lat: 50.4419,
      lng: 30.5695,
      googleMapsUrl:
        'https://www.google.com/maps/dir/?api=1&destination=River+Grill%2C+%D0%A0%D1%83%D1%81%D0%B0%D0%BD%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B0+%D0%BD%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%2C+3%D0%90%2C+%D0%9A%D0%B8%D1%97%D0%B2',
      wazeUrl: 'https://waze.com/ul?ll=50.4419,30.5695&navigate=yes',
    },
    ceremony: {
      name: 'Церемонія',
      address: 'Адресу церемонії уточніть у координатора',
      timeLabel: '13:00',
      lat: 50.4501,
      lng: 30.5234,
      googleMapsUrl:
        'https://www.google.com/maps/dir/?api=1&destination=50.4501,30.5234',
      wazeUrl: 'https://waze.com/ul?ll=50.4501,30.5234&navigate=yes',
    },
  },

  timeline: [
    { time: '13:30', title: 'Збір гостей', description: 'Вітальний напій та приємні знайомства', icon: 'ph:champagne' },
    { time: '14:00', title: 'Церемонія', description: 'Найзворушливіший момент дня', icon: 'ph:heart', ceremony: true },
    { time: '15:00', title: 'Фотосесія', description: 'Ловимо найтепліші кадри разом', icon: 'ph:camera' },
    { time: '16:00', title: 'Банкет', description: 'Смачні страви та щирі тости', icon: 'ph:fork-knife' },
    { time: '19:00', title: 'Перший танець', description: 'Наш перший танець як подружжя', icon: 'ph:music-notes' },
    { time: '23:00', title: 'Завершення вечора', description: 'Святковий феєрверк та тепле прощання', icon: 'ph:sparkle' },
  ],

  dressCode: {
    description:
      'Будемо вдячні, якщо ваше вбрання гармонуватиме з палітрою нашого свята. Ніжні, приглушені відтінки додадуть спільним фото особливої естетики.',
    colors: [
      { hex: '#fff7e4', label: 'Айворі' },
      { hex: '#e7ceb0', label: 'Пісочний' },
      { hex: '#ccd1c1', label: 'Шавлія' },
      { hex: '#b3c3ce', label: 'Димчасто-блакитний' },
      { hex: '#f6ccce', label: 'Пудровий' },
      { hex: '#4b3327', label: 'Шоколад' },
      { hex: '#000000', label: 'Чорний' },
    ],
  },

  guestChat: {
    heading: 'Спільний чат гостей',
    text: 'Ми створили затишний чат, де можна поставити будь-яке запитання, поділитися фотографіями зі свята та першими дізнаватися важливі новини про весілля.',
    buttonLabel: 'Приєднатися до чату',
    telegramUrl: 'https://t.me/+your_invite_link',
  },

  footer: {
    coordinatorName: 'Галина',
    phone: '+380997636706',
    telegram: '@mhalinka',
    thankYou:
      'Дякуємо, що ви є частиною нашої історії. Ваша присутність — найцінніший подарунок для нас.',
    background: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1600&q=70&auto=format&fit=crop',
  },

  rsvp: {
    deadline: '2026-08-15',
    deadlineLabel: 'до 15 серпня',
    closedMessage:
      'Дякуємо! Період підтвердження присутності завершено. Якщо ваші плани змінились — звʼяжіться, будь ласка, з координатором.',
    giftQuestion: 'Чи плануєте подарувати книгу для нашої бібліотеки?',
    giftHint:
      'Хочете подарувати книгу — оберіть і заброньте її тут, щоб ніхто не обрав ту саму.',
  },
}
