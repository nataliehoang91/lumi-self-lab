/**
 * Seed BibleChapter.sectionTitle (VI), sectionTitleKJV, sectionTitleNIV from full
 * CHAPTER_SUBTITLES with niv/kjv/vi per chapter for all 66 books.
 * Uses real book IDs from DB. Fix: books 9–39 use 31 chapter counts (incl. Malachi 4).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ChapterSub = { num: number; niv: string; kjv: string; vi: string };
type BookSub = { bookOrder: number; bookName: string; chapters: ChapterSub[] };

function placeholders(bookName: string, count: number): ChapterSub[] {
  return Array.from({ length: count }, (_, i) => ({
    num: i + 1,
    niv: `${bookName} Chapter ${i + 1}`,
    kjv: `${bookName} Chapter ${i + 1}`,
    vi: `${bookName} Chương ${i + 1}`,
  }));
}

// Full data for Genesis (50), Exodus (40), Leviticus (27), Numbers (36), Deuteronomy (34)
const GENESIS_CHAPTERS: ChapterSub[] = [
  { num: 1, niv: "The Beginning", kjv: "The Creation", vi: "Sự Sáng Tạo" },
  { num: 2, niv: "God Rests", kjv: "The Creation Completed", vi: "Ngày Thứ Bảy" },
  { num: 3, niv: "The Fall of Man", kjv: "The Temptation and Fall", vi: "Sự Sa Ngã" },
  { num: 4, niv: "Cain and Abel", kjv: "Cain and Abel", vi: "Ca-in và A-bên" },
  { num: 5, niv: "From Adam to Noah", kjv: "The Genealogy of Adam to Noah", vi: "Dòng Dõi Từ A-đam Đến Nô-ê" },
  { num: 6, niv: "Wickedness in the World", kjv: "The Corruption of Mankind", vi: "Sự Tham Nhũng Của Nhân Loại" },
  { num: 7, niv: "The Flood", kjv: "Noah Enters the Ark", vi: "Đại Hồng Thủy" },
  { num: 8, niv: "The Flood Recedes", kjv: "The Flood Subsides", vi: "Nước Rút" },
  { num: 9, niv: "God's Covenant with Noah", kjv: "God's Covenant with Noah", vi: "Giao Ước Với Nô-ê" },
  { num: 10, niv: "The Table of Nations", kjv: "The Generations of Noah's Sons", vi: "Các Dân Tộc Từ Con Cái Nô-ê" },
  { num: 11, niv: "The Tower of Babel", kjv: "The Tower of Babel", vi: "Tòa Tháp Ba-bel" },
  { num: 12, niv: "The Call of Abram", kjv: "The Call of Abram", vi: "Chúa Gọi Áp-ram" },
  { num: 13, niv: "Abram and Lot Separate", kjv: "Abram and Lot Separate", vi: "Áp-ram Và Lót Chia Tách" },
  { num: 14, niv: "Abram Rescues Lot", kjv: "Abram Pursues the Invaders", vi: "Áp-ram Cứu Lót" },
  { num: 15, niv: "The Lord's Covenant with Abram", kjv: "God's Covenant with Abram", vi: "Giao Ước Của Chúa Với Áp-ram" },
  { num: 16, niv: "Hagar and Ishmael", kjv: "Hagar and Ishmael", vi: "Ha-gar Và Ích-ma-ên" },
  { num: 17, niv: "The Covenant of Circumcision", kjv: "The Sign of the Covenant", vi: "Dấu Của Giao Ước" },
  { num: 18, niv: "Three Visitors", kjv: "The Three Visitors", vi: "Ba Vị Khách Thăm Viếng" },
  { num: 19, niv: "Sodom and Gomorrah Destroyed", kjv: "The Destruction of Sodom and Gomorrah", vi: "Sô-đôm Và Gô-mô-ra Bị Phá Huỷ" },
  { num: 20, niv: "Abraham and Abimelech", kjv: "Abraham and Abimelech", vi: "Áp-ra-ham Và A-bi-mê-léc" },
  { num: 21, niv: "The Birth of Isaac", kjv: "The Birth of Isaac", vi: "I-sác Được Sinh Ra" },
  { num: 22, niv: "Abraham Tested", kjv: "Abraham's Faith Tested", vi: "Đức Tin Của Áp-ra-ham Được Thử Thách" },
  { num: 23, niv: "The Death of Sarah", kjv: "Sarah's Death and Burial", vi: "Cái Chết Của Xa-ra" },
  { num: 24, niv: "Isaac and Rebekah", kjv: "A Wife for Isaac", vi: "Vợ Cho I-sác" },
  { num: 25, niv: "The Death of Abraham", kjv: "The Death of Abraham; Ishmael's Descendants", vi: "Cái Chết Của Áp-ra-ham" },
  { num: 26, niv: "Isaac and Abimelech", kjv: "Isaac and Abimelech", vi: "I-sác Và A-bi-mê-léc" },
  { num: 27, niv: "Jacob Gets Isaac's Blessing", kjv: "Jacob Gets Isaac's Blessing", vi: "Gia-cốp Được Phước Lành Của I-sác" },
  { num: 28, niv: "Jacob's Dream at Bethel", kjv: "Jacob's Dream", vi: "Chiêm Bao Của Gia-cốp" },
  { num: 29, niv: "Jacob Arrives in Paddan Aram", kjv: "Jacob Meets Rachel", vi: "Gia-cốp Gặp Ra-chên" },
  { num: 30, niv: "Jacob's Children", kjv: "The Birth of Jacob's Sons", vi: "Con Cái Của Gia-cốp" },
  { num: 31, niv: "Jacob Flees from Laban", kjv: "Jacob's Flight from Laban", vi: "Gia-cốp Bỏ Chạy Khỏi La-ban" },
  { num: 32, niv: "Jacob Prepares to Meet Esau", kjv: "Jacob Prepares to Meet Esau", vi: "Gia-cốp Chuẩn Bị Gặp Ê-sau" },
  { num: 33, niv: "Jacob Meets Esau", kjv: "Jacob and Esau Reconciled", vi: "Gia-cốp Và Ê-sau Hòa Hợp" },
  { num: 34, niv: "Dinah and the Shechemites", kjv: "Dinah and the Shechemites", vi: "Đi-na Và Người Sê-chem" },
  { num: 35, niv: "Jacob Returns to Bethel", kjv: "Jacob Returns to Bethel", vi: "Gia-cốp Trở Lại Bê-tên" },
  { num: 36, niv: "Esau's Descendants", kjv: "Esau's Descendants", vi: "Dòng Dõi Của Ê-sau" },
  { num: 37, niv: "Joseph's Dreams", kjv: "Joseph's Dream and Jealous Brothers", vi: "Chiêm Bao Của Giô-sép" },
  { num: 38, niv: "Judah and Tamar", kjv: "Judah and Tamar", vi: "Giu-đa Và Ta-má" },
  { num: 39, niv: "Joseph and Potiphar's Wife", kjv: "Joseph Prospers in Potiphar's House", vi: "Giô-sép Trong Nhà Phô-ti-pha" },
  { num: 40, niv: "The Cupbearer and the Baker", kjv: "Joseph Interprets Dreams", vi: "Giô-sép Giải Mộng" },
  { num: 41, niv: "Pharaoh's Dreams", kjv: "Pharaoh's Dream; Joseph Exalted", vi: "Chiêm Bao Của Pha-ra-ô" },
  { num: 42, niv: "Joseph's Brothers Go to Egypt", kjv: "Joseph's Brothers Go to Egypt", vi: "Các Anh Của Giô-sép Đến Ê-díp-tô" },
  { num: 43, niv: "The Second Journey to Egypt", kjv: "The Second Journey to Egypt", vi: "Chuyến Đi Thứ Hai Đến Ê-díp-tô" },
  { num: 44, niv: "A Silver Cup in a Sack", kjv: "Joseph's Test of His Brothers", vi: "Giô-sép Thử Các Anh" },
  { num: 45, niv: "Joseph Reveals Himself", kjv: "Joseph Reveals Himself", vi: "Giô-sép Bộc Lộ Danh Tính" },
  { num: 46, niv: "Jacob Goes to Egypt", kjv: "Jacob Goes to Egypt", vi: "Gia-cốp Đi Đến Ê-díp-tô" },
  { num: 47, niv: "Joseph and the Famine", kjv: "Joseph Settles His Family in Egypt", vi: "Giô-sép Cho Gia Đình Định Cư Ở Ê-díp-tô" },
  { num: 48, niv: "Manasseh and Ephraim", kjv: "Jacob Blesses Joseph's Sons", vi: "Gia-cốp Chúc Phước Con Trai Của Giô-sép" },
  { num: 49, niv: "Jacob Blesses His Sons", kjv: "Jacob Blesses His Sons", vi: "Gia-cốp Chúc Phước Con Trai" },
  { num: 50, niv: "The Death of Jacob", kjv: "The Death of Jacob and Joseph", vi: "Cái Chết Của Gia-cốp Và Giô-sép" },
];

const EXODUS_CHAPTERS: ChapterSub[] = [
  { num: 1, niv: "The Israelites Oppressed", kjv: "Israel's Suffering in Egypt", vi: "Người Y-sơ-ra-ên Bị Áp Bức" },
  { num: 2, niv: "The Birth of Moses", kjv: "The Birth of Moses", vi: "Sự Sinh Ra Của Môi-se" },
  { num: 3, niv: "Moses and the Burning Bush", kjv: "The Burning Bush", vi: "Bụi Cây Cháy" },
  { num: 4, niv: "Signs for Moses", kjv: "Moses Given Signs", vi: "Những Dấu Hiệu Cho Môi-se" },
  { num: 5, niv: "Bricks Without Straw", kjv: "Moses Confronts Pharaoh", vi: "Môi-se Đối Đầu Với Pha-ra-ô" },
  { num: 6, niv: "God Promises Deliverance", kjv: "God Renews His Promise", vi: "Chúa Tân Hứa Sự Giải Phóng" },
  { num: 7, niv: "Aaron to Speak for Moses", kjv: "God's Covenant With Moses", vi: "Giao Ước Của Chúa Với Môi-se" },
  { num: 8, niv: "The Plague of Frogs", kjv: "The Plagues of Frogs and Gnats", vi: "Những Tai Họa: Ếch Và Muỗi" },
  { num: 9, niv: "The Plague of Flies", kjv: "The Plagues of Flies and Livestock", vi: "Những Tai Họa: Ruồi Và Gia Súc" },
  { num: 10, niv: "The Plagues of Locusts and Darkness", kjv: "The Plagues of Darkness and Locusts", vi: "Những Tai Họa: Bóng Tối Và Châu Chấu" },
  { num: 11, niv: "The Plague of the Firstborn", kjv: "The Plague of the Firstborn Announced", vi: "Tai Họa Các Con Đầu Lòng" },
  { num: 12, niv: "The Passover and the Exodus", kjv: "The Passover and the Exodus", vi: "Lễ Vượt Qua Và Cuộc Thoát Ly" },
  { num: 13, niv: "Consecration of the Firstborn", kjv: "Consecration of the Firstborn", vi: "Dành Riêng Con Đầu Lòng" },
  { num: 14, niv: "Crossing the Sea", kjv: "Crossing the Red Sea", vi: "Qua Biển Đỏ" },
  { num: 15, niv: "The Song of Moses", kjv: "The Song of Moses", vi: "Bài Hát Của Môi-se" },
  { num: 16, niv: "The Manna and Quail", kjv: "The Manna and Quail", vi: "Bánh Manna Và Cút Chơi" },
  { num: 17, niv: "Water from the Rock", kjv: "Water from the Rock", vi: "Nước Từ Tảng Đá" },
  { num: 18, niv: "Jethro Visits Moses", kjv: "Jethro Visits Moses", vi: "Giê-tơ-rô Thăm Môi-se" },
  { num: 19, niv: "At Mount Sinai", kjv: "God at Mount Sinai", vi: "Ở Núi Si-nai" },
  { num: 20, niv: "The Ten Commandments", kjv: "The Ten Commandments", vi: "Mười Điều Răn" },
  { num: 21, niv: "Hebrew Servants and Other Laws", kjv: "Laws for Hebrew Servants", vi: "Luật Về Những Người Tôi Tớ Hê-bơ-rơ" },
  { num: 22, niv: "Laws of Protection and Restitution", kjv: "Laws Concerning Property", vi: "Luật Về Tài Sản" },
  { num: 23, niv: "Laws of Justice and Mercy", kjv: "Laws of Justice and Mercy", vi: "Luật Về Công Lý Và Lòng Thương Xót" },
  { num: 24, niv: "The Covenant Confirmed", kjv: "The Covenant Confirmed at Sinai", vi: "Giao Ước Được Xác Nhận" },
  { num: 25, niv: "The Ark and Other Furnishings", kjv: "The Ark of the Covenant", vi: "Hòm Giao Ước" },
  { num: 26, niv: "The Tabernacle", kjv: "The Tabernacle", vi: "Đền Tạm" },
  { num: 27, niv: "The Altar of Burnt Offering", kjv: "The Bronze Altar", vi: "Bàn Thờ Đồng" },
  { num: 28, niv: "The Priestly Garments", kjv: "The Priestly Garments", vi: "Áo Của Thầy Tế Lễ" },
  { num: 29, niv: "Consecration of the Priests", kjv: "Consecration of the Priests", vi: "Phong Chức Thầy Tế Lễ" },
  { num: 30, niv: "The Altar of Incense", kjv: "The Altar of Incense", vi: "Bàn Thờ Hương Liệu" },
  { num: 31, niv: "Bezalel and the Craftsmen", kjv: "Bezalel and the Craftsmen", vi: "Bê-xan-ên Và Các Thợ Thủ Công" },
  { num: 32, niv: "The Golden Calf", kjv: "The Golden Calf", vi: "Bê Vàng" },
  { num: 33, niv: "God's Presence", kjv: "God's Presence With Moses", vi: "Sự Hiện Diện Của Chúa Với Môi-se" },
  { num: 34, niv: "The New Tablets of Stone", kjv: "The New Stone Tablets", vi: "Những Bảng Đá Mới" },
  { num: 35, niv: "The Sabbath and the Materials for the Tabernacle", kjv: "Sabbath and Tabernacle Contributions", vi: "Ngày Sa-bát Và Sự Đóng Góp Cho Đền Tạm" },
  { num: 36, niv: "Bezalel and His Helpers", kjv: "Building the Tabernacle", vi: "Xây Dựng Đền Tạm" },
  { num: 37, niv: "The Ark and the Table", kjv: "Making the Ark and Other Furnishings", vi: "Làm Hòm Giao Ước Và Những Vật Khác" },
  { num: 38, niv: "The Altar and Basin", kjv: "Making the Bronze Altar and Basin", vi: "Làm Bàn Thờ Đồng Và Chậu" },
  { num: 39, niv: "The Priestly Garments", kjv: "Making the Priestly Garments", vi: "Làm Áo Của Thầy Tế Lễ" },
  { num: 40, niv: "Setting Up the Tabernacle", kjv: "Setting Up the Tabernacle", vi: "Dựng Đền Tạm" },
];

const LEVITICUS_CHAPTERS: ChapterSub[] = [
  { num: 1, niv: "The Burnt Offering", kjv: "The Burnt Offering", vi: "Lễ Toàn Thiêu" },
  { num: 2, niv: "The Grain Offering", kjv: "The Grain Offering", vi: "Lễ Dâng Lúa Mì" },
  { num: 3, niv: "The Fellowship Offering", kjv: "The Fellowship Offering", vi: "Lễ Hiệp Hòa" },
  { num: 4, niv: "The Sin Offering", kjv: "The Sin Offering", vi: "Lễ Tế Lễ Để Chuộc Tội" },
  { num: 5, niv: "The Guilt Offering", kjv: "The Guilt Offering", vi: "Lễ Tế Lễ Để Bồi Thường" },
  { num: 6, niv: "Further Regulations on Offerings", kjv: "Further Regulations on Offerings", vi: "Những Quy Định Thêm Về Lễ Tế" },
  { num: 7, niv: "Further Regulations on the Guilt Offering", kjv: "More Regulations on Offerings", vi: "Thêm Những Quy Định Về Lễ Tế" },
  { num: 8, niv: "The Ordination of Aaron and His Sons", kjv: "The Ordination of Aaron and His Sons", vi: "Phong Chức Cho A-rôn Và Con Trai" },
  { num: 9, niv: "The Priests Begin Their Ministry", kjv: "The Priests Begin Their Ministry", vi: "Thầy Tế Lễ Bắt Đầu Thờ Phụng" },
  { num: 10, niv: "Nadab and Abihu", kjv: "The Death of Nadab and Abihu", vi: "Cái Chết Của Na-đáp Và A-bi-hu" },
  { num: 11, niv: "Clean and Unclean Food", kjv: "Clean and Unclean Animals", vi: "Động Vật Sạch Và Bẩn" },
  { num: 12, niv: "Purification After Childbirth", kjv: "Purification After Childbirth", vi: "Tinh Tẩy Sau Khi Sinh Con" },
  { num: 13, niv: "Regulations About Infectious Skin Diseases", kjv: "Regulations About Infectious Diseases", vi: "Những Bệnh Về Da Có Thể Lây Lan" },
  { num: 14, niv: "Cleansing from Infectious Skin Diseases", kjv: "Cleansing from Infectious Diseases", vi: "Tinh Tẩy Khỏi Những Bệnh Lây Lan" },
  { num: 15, niv: "Discharges Causing Uncleanness", kjv: "Discharges Causing Uncleanness", vi: "Những Tiết Dịch Gây Bẩn" },
  { num: 16, niv: "The Day of Atonement", kjv: "The Day of Atonement", vi: "Ngày Chuộc Tội" },
  { num: 17, niv: "Eating Blood Forbidden", kjv: "Eating Blood Forbidden", vi: "Cấm Ăn Máu" },
  { num: 18, niv: "Unlawful Sexual Relations", kjv: "Unlawful Sexual Relations", vi: "Những Mối Quan Hệ Tình Dục Bất Hợp Pháp" },
  { num: 19, niv: "Various Laws", kjv: "Various Laws", vi: "Những Luật Lệ Khác Nhau" },
  { num: 20, niv: "Punishments for Sin", kjv: "Punishments for Sin", vi: "Những Hình Phạt Cho Tội Lỗi" },
  { num: 21, niv: "Rules for Priests", kjv: "Rules for Priests", vi: "Những Quy Tắc Cho Thầy Tế Lễ" },
  { num: 22, niv: "Unclean Animals", kjv: "Unacceptable Sacrifices", vi: "Những Lễ Tế Không Được Chấp Nhận" },
  { num: 23, niv: "The Appointed Festivals", kjv: "The Appointed Festivals", vi: "Những Lễ Hội Được Chỉ Định" },
  { num: 24, niv: "Olive Oil, Bread, and Blasphemy", kjv: "Olive Oil and Bread; Blasphemy Punished", vi: "Dầu Ôliu, Bánh Mì, Và Lạm Dụng Tên Chúa" },
  { num: 25, niv: "The Sabbath Year and the Year of Jubilee", kjv: "The Sabbath Year and the Year of Jubilee", vi: "Năm Sa-bát Và Năm Hoan Hỷ" },
  { num: 26, niv: "Blessings for Obedience", kjv: "Blessings for Obedience and Consequences of Disobedience", vi: "Phước Lành Cho Sự Vâng Lời" },
  { num: 27, niv: "Redeeming What Is the Lord's", kjv: "Vows and Dedications", vi: "Những Lời Thề Và Những Vật Dâng Riêng" },
];

const NUMBERS_CHAPTERS: ChapterSub[] = [
  { num: 1, niv: "The Census", kjv: "The First Census of Israel", vi: "Cuộc Điểm Danh Người Y-sơ-ra-ên" },
  { num: 2, niv: "The Arrangement of the Tribal Camps", kjv: "The Arrangement of the Tribal Camps", vi: "Sự Sắp Xếp Của Các Trại" },
  { num: 3, niv: "The Levites", kjv: "The Levites", vi: "Những Người Lê-vi" },
  { num: 4, niv: "The Kohathites, Gershonites, and Merarites", kjv: "The Levite Clans", vi: "Những Chi Tộc Của Người Lê-vi" },
  { num: 5, niv: "Purity of the Camp", kjv: "Purity of the Camp", vi: "Tinh Khiết Của Trại" },
  { num: 6, niv: "The Nazirite Vow", kjv: "The Nazirite Vow", vi: "Lời Thề Na-xa-raê" },
  { num: 7, niv: "Offerings at the Dedication of the Tabernacle", kjv: "Offerings at the Dedication of the Tabernacle", vi: "Những Lễ Tế Tại Lễ Khánh Thành Đền Tạm" },
  { num: 8, niv: "Setting Up the Lamps and Consecrating the Levites", kjv: "Setting Up the Lamps and Consecrating the Levites", vi: "Dựng Đèn Và Phong Chức Cho Người Lê-vi" },
  { num: 9, niv: "The Passover", kjv: "The Passover", vi: "Lễ Vượt Qua" },
  { num: 10, niv: "The Silver Trumpets and the Departure from Sinai", kjv: "The Silver Trumpets and Departure from Sinai", vi: "Những Cái Kèn Bạc Và Sự Ra Đi Khỏi Si-nai" },
  { num: 11, niv: "Fire From the Lord and the Quail", kjv: "The People Complain and Quail", vi: "Lửa Từ Chúa Và Cút Chơi" },
  { num: 12, niv: "Miriam and Aaron Oppose Moses", kjv: "Miriam and Aaron Oppose Moses", vi: "Mi-ri-am Và A-rôn Phản Đối Môi-se" },
  { num: 13, niv: "Exploring Canaan", kjv: "Exploring Canaan", vi: "Thăm Dò Đất Ca-na-an" },
  { num: 14, niv: "Israel's Rebellion and Wandering in the Wilderness", kjv: "The People Reject the Promise", vi: "Dân Y-sơ-ra-ên Từ Chối Lời Hứa" },
  { num: 15, niv: "Offerings and Sabbath Breaking", kjv: "Various Offerings and Laws", vi: "Những Lễ Tế Khác Nhau Và Luật Lệ" },
  { num: 16, niv: "Korah's Rebellion", kjv: "Korah's Rebellion", vi: "Sự Nổi Loạn Của Cô-rah" },
  { num: 17, niv: "The Budding of Aaron's Staff", kjv: "Aaron's Staff Budding", vi: "Cây Gậy Của A-rôn Nảy Lộc" },
  { num: 18, niv: "Duties of Priests and Levites", kjv: "Duties of Priests and Levites", vi: "Nhiệm Vụ Của Thầy Tế Lễ Và Người Lê-vi" },
  { num: 19, niv: "The Water of Cleansing", kjv: "The Water of Cleansing", vi: "Nước Để Tinh Tẩy" },
  { num: 20, niv: "Water From the Rock", kjv: "Water From the Rock", vi: "Nước Từ Tảng Đá" },
  { num: 21, niv: "The Bronze Snake", kjv: "The Israelites Defeat Sihon and Og", vi: "Người Y-sơ-ra-ên Đánh Bại Xi-hôn Và Ô-ơ" },
  { num: 22, niv: "Balak Summons Balaam", kjv: "Balak Summons Balaam", vi: "Ba-lác Gọi Ba-la-am" },
  { num: 23, niv: "Balaam's First and Second Oracles", kjv: "Balaam's Oracles", vi: "Những Lời Tiên Tri Của Ba-la-am" },
  { num: 24, niv: "Balaam's Third and Fourth Oracles", kjv: "Balaam's Final Oracles", vi: "Những Lời Tiên Tri Cuối Cùng Của Ba-la-am" },
  { num: 25, niv: "Moab Seduces Israel", kjv: "Israel's Immorality at Peor", vi: "Sự Gây Dâm Ô Của Người Y-sơ-ra-ên Tại Phê-ô" },
  { num: 26, niv: "The Second Census", kjv: "The Second Census of Israel", vi: "Cuộc Điểm Danh Thứ Hai" },
  { num: 27, niv: "Zelophehad's Daughters", kjv: "Zelophehad's Daughters", vi: "Con Gái Của Xê-lô-phê-hát" },
  { num: 28, niv: "Daily, Sabbath, and Monthly Offerings", kjv: "Daily and Periodic Offerings", vi: "Những Lễ Tế Hàng Ngày Và Định Kỳ" },
  { num: 29, niv: "Offerings for the Feasts", kjv: "Offerings for the Feasts", vi: "Những Lễ Tế Cho Những Lễ Hội" },
  { num: 30, niv: "Vows", kjv: "Vows", vi: "Những Lời Thề" },
  { num: 31, niv: "Vengeance on the Midianites", kjv: "Vengeance on the Midianites", vi: "Trả Thù Người Mi-đi-an" },
  { num: 32, niv: "The Transjordan Tribes", kjv: "The Transjordan Tribes", vi: "Các Chi Tộc Ở Phía Bên Kia Sông Giô-đan" },
  { num: 33, niv: "Stages in Israel's Journey", kjv: "Stages in Israel's Journey", vi: "Những Chặng Đường Của Người Y-sơ-ra-ên" },
  { num: 34, niv: "Boundaries of the Land", kjv: "Boundaries of the Land", vi: "Biên Giới Của Đất" },
  { num: 35, niv: "Cities for the Levites", kjv: "Cities for the Levites", vi: "Những Thành Phố Cho Người Lê-vi" },
  { num: 36, niv: "Inheritance of Zelophehad's Daughters", kjv: "Inheritance of Zelophehad's Daughters", vi: "Di Sản Của Con Gái Xê-lô-phê-hát" },
];

const DEUTERONOMY_CHAPTERS: ChapterSub[] = [
  { num: 1, niv: "The Command to Leave Horeb", kjv: "Israel's Journey to Horeb", vi: "Hành Trình Đến Hô-rếp" },
  { num: 2, niv: "Wandering in the Wilderness", kjv: "Wandering in the Wilderness", vi: "Lạc Đường Trong Hoang Dã" },
  { num: 3, niv: "Defeat of Og and Sihon", kjv: "Defeat of Og and Sihon", vi: "Đánh Bại Ô-ơ Và Xi-hôn" },
  { num: 4, niv: "Obedience Urged", kjv: "Exhortation to Obedience", vi: "Khuyến Khích Tuân Theo" },
  { num: 5, niv: "The Ten Commandments", kjv: "The Ten Commandments", vi: "Mười Điều Răn" },
  { num: 6, niv: "Love the Lord Your God", kjv: "The Great Commandment", vi: "Điều Răn Vĩ Đại" },
  { num: 7, niv: "Driving Out the Nations", kjv: "Driving Out the Nations", vi: "Đuổi Các Quốc Gia Ra" },
  { num: 8, niv: "Do Not Forget the Lord Your God", kjv: "Do Not Forget the Lord Your God", vi: "Đừng Quên Chúa Trời Của Bạn" },
  { num: 9, niv: "Not Because of Israel's Righteousness", kjv: "Not Because of Israel's Righteousness", vi: "Không Phải Vì Công Lý Của Y-sơ-ra-ên" },
  { num: 10, niv: "The Golden Calf and God's Mercy", kjv: "The Golden Calf and God's Mercy", vi: "Bê Vàng Và Lòng Thương Xót Của Chúa" },
  { num: 11, niv: "Love and Obey the Lord", kjv: "Love and Obey the Lord", vi: "Yêu Thương Và Tuân Theo Chúa" },
  { num: 12, niv: "The One Place of Worship", kjv: "The One Place of Worship", vi: "Nơi Duy Nhất Để Thờ Phụng" },
  { num: 13, niv: "Worshiping Other Gods", kjv: "Worshiping Other Gods", vi: "Thờ Phụng Các Vị Thần Khác" },
  { num: 14, niv: "Clean and Unclean Food", kjv: "Clean and Unclean Food", vi: "Thực Phẩm Sạch Và Bẩn" },
  { num: 15, niv: "The Year for Canceling Debts", kjv: "The Year for Canceling Debts", vi: "Năm Để Hủy Bỏ Nợ" },
  { num: 16, niv: "Passover, Feast of Weeks, and Feast of Tabernacles", kjv: "Passover and Feasts", vi: "Lễ Vượt Qua Và Những Lễ Hội" },
  { num: 17, niv: "Law Courts, Kings, and Prophets", kjv: "Law Courts, Kings, and Prophets", vi: "Tòa Án, Vua, Và Các Tiên Tri" },
  { num: 18, niv: "Offerings for Priests and Levites", kjv: "Offerings for Priests and Levites", vi: "Những Lễ Tế Cho Thầy Tế Lễ Và Người Lê-vi" },
  { num: 19, niv: "Cities of Refuge and the Law of Retaliation", kjv: "Cities of Refuge", vi: "Những Thành Phố Trốn Tránh" },
  { num: 20, niv: "Going to War", kjv: "Going to War", vi: "Đi Chiến Tranh" },
  { num: 21, niv: "Various Laws", kjv: "Various Laws", vi: "Những Luật Lệ Khác Nhau" },
  { num: 22, niv: "Laws and Prohibitions", kjv: "Laws and Prohibitions", vi: "Luật Lệ Và Cấm Chỉ" },
  { num: 23, niv: "Exclusion From the Assembly", kjv: "Exclusion From the Assembly", vi: "Loại Trừ Khỏi Đại Hội" },
  { num: 24, niv: "Miscellaneous Laws", kjv: "Miscellaneous Laws", vi: "Những Luật Lệ Linh Tinh" },
  { num: 25, niv: "Laws of Protection and Inheritance", kjv: "Laws of Protection and Inheritance", vi: "Luật Bảo Vệ Và Di Sản" },
  { num: 26, niv: "Firstfruits and Tithes", kjv: "Firstfruits and Tithes", vi: "Những Trái Đầu Mùa Và Của Lễ Một Phần Mười" },
  { num: 27, niv: "The Altar on Mount Ebal", kjv: "The Altar on Mount Ebal", vi: "Bàn Thờ Trên Núi E-ban" },
  { num: 28, niv: "Blessings and Curses", kjv: "Blessings and Curses", vi: "Phước Lành Và Lời Nguyền Rủa" },
  { num: 29, niv: "Renewal of the Covenant", kjv: "Renewal of the Covenant", vi: "Tân Hành Giao Ước" },
  { num: 30, niv: "Prosperity After Turning to the Lord", kjv: "Prosperity After Turning to the Lord", vi: "Thịnh Vượng Sau Khi Quay Về Với Chúa" },
  { num: 31, niv: "Joshua to Succeed Moses", kjv: "Joshua to Succeed Moses", vi: "Giô-suê Thay Thế Môi-se" },
  { num: 32, niv: "The Song of Moses", kjv: "The Song of Moses", vi: "Bài Hát Của Môi-se" },
  { num: 33, niv: "Moses Blesses the Tribes", kjv: "Moses Blesses the Tribes", vi: "Môi-se Chúc Phước Cho Các Chi Tộc" },
  { num: 34, niv: "The Death of Moses", kjv: "The Death of Moses", vi: "Cái Chết Của Môi-se" },
];

// Build full CHAPTER_SUBTITLES for all 66 books (correct counts; books 9–39 use 31 counts including Malachi 4)
const OT_BOOKS_9_39_NAMES = [
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes",
  "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah",
  "Haggai", "Zechariah", "Malachi",
];
const OT_BOOKS_9_39_CHAPTER_COUNTS = [31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4]; // 31 entries: 1 Sam–Malachi (incl. Song of Solomon 8)

const NT_BOOKS_44_66_NAMES = [
  "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
  "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation",
];
const NT_BOOKS_44_66_CHAPTER_COUNTS = [28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 22];

function buildChapterSubtitles(): BookSub[] {
  const out: BookSub[] = [
    { bookOrder: 1, bookName: "Genesis", chapters: GENESIS_CHAPTERS },
    { bookOrder: 2, bookName: "Exodus", chapters: EXODUS_CHAPTERS },
    { bookOrder: 3, bookName: "Leviticus", chapters: LEVITICUS_CHAPTERS },
    { bookOrder: 4, bookName: "Numbers", chapters: NUMBERS_CHAPTERS },
    { bookOrder: 5, bookName: "Deuteronomy", chapters: DEUTERONOMY_CHAPTERS },
    { bookOrder: 6, bookName: "Joshua", chapters: placeholders("Joshua", 24) },
    { bookOrder: 7, bookName: "Judges", chapters: placeholders("Judges", 21) },
    { bookOrder: 8, bookName: "Ruth", chapters: placeholders("Ruth", 4) },
  ];
  for (let i = 0; i < 31; i++) {
    const count = OT_BOOKS_9_39_CHAPTER_COUNTS[i]!;
    out.push({ bookOrder: 9 + i, bookName: OT_BOOKS_9_39_NAMES[i]!, chapters: placeholders(OT_BOOKS_9_39_NAMES[i]!, count) });
  }
  out.push(
    { bookOrder: 40, bookName: "Matthew", chapters: placeholders("Matthew", 28) },
    { bookOrder: 41, bookName: "Mark", chapters: placeholders("Mark", 16) },
    { bookOrder: 42, bookName: "Luke", chapters: placeholders("Luke", 24) },
    { bookOrder: 43, bookName: "John", chapters: placeholders("John", 21) },
  );
  for (let i = 0; i < 23; i++) {
    const count = NT_BOOKS_44_66_CHAPTER_COUNTS[i]!;
    out.push({ bookOrder: 44 + i, bookName: NT_BOOKS_44_66_NAMES[i]!, chapters: placeholders(NT_BOOKS_44_66_NAMES[i]!, count) });
  }
  return out;
}

const CHAPTER_SUBTITLES = buildChapterSubtitles();

function normalizeForSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Build unique search terms from titles (original + lowercase + normalized) for context search. */
function buildSearchTerms(...titles: (string | null | undefined)[]): string[] {
  const set = new Set<string>();
  for (const t of titles) {
    if (typeof t !== "string" || !t.trim()) continue;
    const trimmed = t.trim();
    set.add(trimmed);
    set.add(trimmed.toLowerCase());
    const norm = normalizeForSearch(trimmed);
    if (norm) set.add(norm);
  }
  return Array.from(set);
}

async function seedChapterSubtitles() {
  try {
    console.log("🌱 Seeding Bible chapter subtitles (NIV/KJV/VI) + subtitleSearchTerms into BibleChapter...");
    const books = await prisma.bibleBook.findMany({ orderBy: { order: "asc" }, select: { id: true, order: true, nameEn: true } });
    const byOrder = new Map(books.map((b) => [b.order, b]));
    let updated = 0;
    for (const book of CHAPTER_SUBTITLES) {
      const dbBook = byOrder.get(book.bookOrder);
      if (!dbBook) {
        console.warn(`⚠️  No DB book for order ${book.bookOrder} (${book.bookName})`);
        continue;
      }
      for (const ch of book.chapters) {
        const searchTerms = buildSearchTerms(ch.niv, ch.kjv, ch.vi);
        await prisma.bibleChapter.update({
          where: { bookId_chapterNumber: { bookId: dbBook.id, chapterNumber: ch.num } },
          data: {
            sectionTitle: ch.vi,
            sectionTitleKJV: ch.kjv,
            sectionTitleNIV: ch.niv,
            subtitleSearchTerms: searchTerms,
          },
        });
        updated++;
      }
    }
    console.log(`✅ Updated section titles + subtitleSearchTerms for ${updated} chapter(s).`);
  } catch (error) {
    console.error("❌ Error seeding chapter subtitles:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedChapterSubtitles()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
