/**
 * Wishlist books seeded on first deploy (idempotent). Imported from an
 * external wishlist. Edit/extend via the admin panel after deploy.
 */
import type { BookRow } from '../server/db/schema'

export type BookSeed = Pick<BookRow, 'title' | 'author' | 'imageUrl' | 'url' | 'note'>

export const seedBooks: BookSeed[] = [
  {
    "title": "Падіння руїни та люті (серія «Пробудження», книга 1)",
    "author": "Дженніфер Л. Арментраут",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/f72274f3-7a89-47c6-9707-daac1bf26f79.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 400 грн"
  },
  {
    "title": "Цикл книжок «Провісник»",
    "author": "Дженніфер Л. Арментраут",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/18f41a74-218c-4a10-8ddf-3d0ad037c111.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 1380 грн"
  },
  {
    "title": "Двір крил і руїн (серія «Двір шипів і троянд», книга 3)",
    "author": "Сара Дж. Маас",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/108bef91-1426-4ea7-b5b4-c33a8ab90b75.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 699 грн"
  },
  {
    "title": "Двір холоду і зоряного сяйва (серія «Двір шипів і троянд», книга 4)",
    "author": "Сара Дж. Маас",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/6b584972-1371-4575-8a20-9261c460d9a6.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 399 грн"
  },
  {
    "title": "Двір срібного полум’я (серія «Двір шипів і троянд», книга 5)",
    "author": "Сара Дж. Маас",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/351ffc26-0ccb-438d-ba21-881e1b698c1a.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 749 грн"
  },
  {
    "title": "Комплект з 3 книг серії «Емпіреї» (м’яка обкладинка)",
    "author": "Ребекка Яррос",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/444dcc75-8a01-47c2-8a3b-c85f065797dd.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 1300 грн"
  },
  {
    "title": "Комплект з 4 книг серії «Темні Елементи»",
    "author": "Дженніфер Лінн Арментраут",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/b05fc986-f275-48b9-a208-b2792db152cd.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 1484 грн"
  },
  {
    "title": "Комплект з 2 книг серії «Хлопці з Томмена»",
    "author": null,
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/e19fbccb-5358-40b2-b988-9fc3a33d42a4.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 1115 грн"
  },
  {
    "title": "Набір із 8 книжок «Throne of Glass» (Box Set)",
    "author": "Сара Дж. Маас",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/edf53adf-cedd-4123-9b85-bb7f155c6cc9.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 3900 грн"
  },
  {
    "title": "Сад Гетсиманський",
    "author": "Іван Багряний",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/0f1df43f-05b8-40e3-b2f6-d29e804cf47d.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 390 грн"
  },
  {
    "title": "Я бачу, вас цікавить пітьма",
    "author": "Ілларіон Павлюк",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/df4701c0-de1b-4d64-8c58-7c38d0180f36.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 600 грн"
  },
  {
    "title": "Літопис Сірого Ордену: Аркан вовків, Тенета війни, Пісня дібров (комплект 3 книги)",
    "author": null,
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/1f3d5fc0-6aa6-4bbc-ae77-f61c6e573dd5.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 1716 грн"
  },
  {
    "title": "Тисяча осяйних сонць",
    "author": "Халед Госсейні",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/f4bc04e3-c4a4-4350-aeda-217153b6e854.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 500 грн"
  },
  {
    "title": "Королівство Нечестивих (комплект із 3 книг)",
    "author": "Керрі Маніскалко",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/7943ae9b-9048-465d-8c37-ba29af438c4d.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 1140 грн"
  },
  {
    "title": "Комплект з 6 книг серії «Ґудзики»",
    "author": null,
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/cfa15edc-4962-4c01-bf7c-54c62e26a3ab.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 1645 грн"
  },
  {
    "title": "Поворот ключа",
    "author": "Рут Веа",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/e56c623b-5ffd-4d58-be33-94b208c4505a.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 400 грн"
  },
  {
    "title": "Мовчазна пацієнтка",
    "author": "Алекс Майклідіс",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/d3ce4df0-1f13-4d30-99ef-240e02a7dcfb.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 369 грн"
  },
  {
    "title": "Блок D",
    "author": "Фріда Мак-Фадден",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/b4cf74cc-841a-4131-8666-2b340027bfb0.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 459 грн"
  },
  {
    "title": "В’язень",
    "author": "Фріда Мак-Фадден",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/f0caa73c-f015-4b58-8be5-f47614052a09.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 459 грн"
  },
  {
    "title": "Бойфренд",
    "author": "Фріда Мак-Фадден",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/2ffaa4ad-e600-467c-a7d9-f92bf5818aa1.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 459 грн"
  },
  {
    "title": "Буря",
    "author": "Фріда Мак-Фадден",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/da0f39ba-7183-414d-9fe3-d5b5cb084049.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 459 грн"
  },
  {
    "title": "The Tenant",
    "author": "Фріда Мак-Фадден",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/79b3128f-d9b0-4e5b-bf1f-d8f798840394.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 638 грн"
  },
  {
    "title": "The Coworker",
    "author": "Фріда Мак-Фадден",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/cc4bf59b-3062-4168-b1b3-e90e5b3036fa.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 585 грн"
  },
  {
    "title": "Комплект з 2 книг серії «Підкорити її» (Колись ти будеш моя + Тепер ти моя)",
    "author": null,
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/af36e4bc-a1b7-4bf8-9d15-91ad60c1a585.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 645 грн"
  },
  {
    "title": "Голодні ігри — цикл (комплект із 5 книг)",
    "author": "Сюзанна Коллінз",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/0389a941-89a6-4122-bb68-c273e0f49b10.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 1590 грн"
  },
  {
    "title": "П’ятеро братів",
    "author": null,
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/8a3a129a-efab-44cb-b9c1-4f89dcf12ee9.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 570 грн"
  },
  {
    "title": "Нестерпна Шістка Трісти",
    "author": "Пенелопа Дуглас",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/979b89c3-7500-4c50-b05f-f86b157bab5a.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 620 грн"
  },
  {
    "title": "Місто Півмісяця (комплект із 3 книг)",
    "author": "Сара Дж. Маас",
    "imageUrl": "https://wishlistproduction.blob.core.windows.net/prod-userdocument/600be765-aa06-43e0-81fe-f109641fc135.jpg",
    "url": null,
    "note": "Орієнтовна ціна: 2970 грн"
  }
]
