import type { PrismaClient } from "@prisma/client";

/** Normalize for search: lowercase, strip diacritics, hyphens/space to single space */
function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[-·]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactKey(normalized: string): string {
  return normalized.replace(/\s+/g, "");
}

/** Extra search keys by book order (1–66) for EN. Covers abbreviations and common typos. */
const EN_EXTRA_KEYS_BY_ORDER: Record<number, string[]> = {
  1: ["gen", "ge", "gn"],
  2: ["exod", "ex"],
  3: ["lev", "lv"],
  4: ["num", "nu", "nm"],
  5: ["deut", "deu", "dt"],
  6: ["josh", "jos", "jsh"],
  7: ["judg", "jdg", "jg"],
  8: ["ru", "ruth"],
  9: ["1sam", "1sa", "1sm", "1samuel"],
  10: ["2sam", "2sa", "2sm", "2samuel"],
  11: ["1kgs", "1ki", "1kings"],
  12: ["2kgs", "2ki", "2kings"],
  13: ["1chron", "1chr", "1ch", "1chronicles"],
  14: ["2chron", "2chr", "2ch", "2chronicles"],
  15: ["ezr", "ezra"],
  16: ["neh", "nehemiah"],
  17: ["esth", "es", "esther"],
  18: ["job", "jb"],
  19: ["ps", "psalm", "psalms"],
  20: ["prov", "pr"],
  21: ["eccl", "ecc", "ecclesiastes"],
  22: ["song", "ss", "sos", "songofsolomon", "canticles"],
  23: ["isa", "is", "isaiah"],
  24: ["jer", "je", "jeremiah"],
  25: ["lam", "la", "lamentations"],
  26: ["ezek", "eze", "ezk", "ezekiel"],
  27: ["dan", "da", "daniel"],
  28: ["hos", "hosea"],
  29: ["joel", "jl"],
  30: ["am", "amos"],
  31: ["obad", "ob", "obadiah"],
  32: ["jon", "jnh", "jonah"],
  33: ["mic", "micah"],
  34: ["nah", "nahum"],
  35: ["hab", "habakkuk"],
  36: ["zeph", "zep", "zephaniah"],
  37: ["hag", "haggai"],
  38: ["zech", "zec", "zechariah"],
  39: ["mal", "malachi"],
  40: ["matt", "mt", "matthew"],
  41: ["mk", "mar", "mark", "mac"],
  42: ["lk", "luke", "luc", "luca", "luka"],
  43: ["jn", "jhn", "jon", "jo", "john"],
  44: ["act", "acts", "ac"],
  45: ["rom", "ro", "romans", "roma"],
  46: ["1cor", "1co", "1corinthians"],
  47: ["2cor", "2co", "2corinthians"],
  48: ["gal", "ga", "galatians"],
  49: ["eph", "ephesians", "ephes"],
  50: ["phil", "php", "philippians", "philip"],
  51: ["col", "colossians"],
  52: ["1thess", "1th", "1thessalonians"],
  53: ["2thess", "2th", "2thessalonians"],
  54: ["1tim", "1ti", "1timothy", "timo", "timothy"],
  55: ["2tim", "2ti", "2timothy"],
  56: ["tit", "titus"],
  57: ["phlm", "phm", "philemon", "philem"],
  58: ["heb", "hebrews"],
  59: ["jas", "jm", "james"],
  60: ["1pet", "1pe", "1peter"],
  61: ["2pet", "2pe", "2peter"],
  62: ["1jn", "1jo", "1john"],
  63: ["2jn", "2jo", "2john"],
  64: ["3jn", "3jo", "3john"],
  65: ["jud", "jude"],
  66: ["rev", "revelation", "revelations"],
};

/**
 * VI extra search keys by book order (1–66).
 * Strategy: cover every realistic way a Vietnamese user types without diacritics:
 *   1. Standard Vietnamese print abbreviations (STK, XH, DS, TN, GS …)
 *   2. Compact no-tone forms (sangthecky, xuathanh …)
 *   3. Partial / prefix forms (sang, xuat, levi …)
 *   4. Common misspellings / alternate romanisations
 *   5. EN aliases so bilingual users get results either way
 *
 * All values must already be lowercase, no diacritics, no hyphens.
 * The seed loop will also auto-generate all prefixes of nameViCompact,
 * so we only need to list forms the auto-prefix won't cover.
 */
const VI_EXTRA_KEYS_BY_ORDER: Record<number, string[]> = {
  // ── Old Testament ────────────────────────────────────────────────────────
  1: [
    // Sáng-thế Ký
    "stk",
    "stt",
    "sang",
    "sangthe",
    "sangtheky",
    "sangthecky",
    "genesis",
    "gen",
    "gn",
  ],
  2: [
    // Xuất Ê-díp-tô Ký  (also written Xuất Hành)
    "xh",
    "xuat",
    "xuathanh",
    "xuatedipto",
    "xk",
    "xuatky",
    "exodus",
    "ex",
  ],
  3: [
    // Lê-vi Ký
    "lv",
    "levi",
    "levikie",
    "leviky",
    "leviticus",
    "lev",
  ],
  4: [
    // Dân-số Ký
    "ds",
    "dsk",
    "danso",
    "dansoky",
    "numbers",
    "num",
    "nu",
  ],
  5: [
    // Phục-truyền Luật-lệ Ký
    "pt",
    "ptk",
    "phuctruyen",
    "phuctruyenluat",
    "phuctruyenluatle",
    "deuteronomy",
    "deut",
    "deu",
    "dt",
  ],
  6: [
    // Giô-suê
    "gs",
    "giosue",
    "giosu",
    "josue",
    "joshua",
    "josh",
    "jos",
  ],
  7: [
    // Các Quan Xét
    "cqx",
    "qt",
    "quanxet",
    "cacquanxet",
    "quan",
    "judges",
    "judg",
    "jdg",
  ],
  8: [
    // Ru-tơ
    "rut",
    "ruto",
    "rute",
    "ruth",
    "ru",
  ],
  9: [
    // 1 Sa-mu-ên
    "1sm",
    "1sa",
    "1samuen",
    "1samuel",
    "samuen",
    "samuel",
    "1samuel",
  ],
  10: [
    // 2 Sa-mu-ên
    "2sm",
    "2sa",
    "2samuen",
    "2samuel",
  ],
  11: [
    // 1 Các Vua
    "1cv",
    "1vua",
    "1cacvua",
    "cacvua",
    "1kings",
    "1kgs",
    "1ki",
  ],
  12: [
    // 2 Các Vua
    "2cv",
    "2vua",
    "2cacvua",
    "2kings",
    "2kgs",
    "2ki",
  ],
  13: [
    // 1 Sử-ký
    "1sk",
    "1suky",
    "suky",
    "1chronicles",
    "1chron",
    "1chr",
    "1ch",
  ],
  14: [
    // 2 Sử-ký
    "2sk",
    "2suky",
    "2chronicles",
    "2chron",
    "2chr",
    "2ch",
  ],
  15: [
    // E-xơ-ra
    "er",
    "exora",
    "exra",
    "ezra",
    "ezdra",
    "ezra",
    "ezr",
  ],
  16: [
    // Nê-hê-mi
    "nh",
    "nehemi",
    "nehemia",
    "nehemiah",
    "nehemiah",
    "neh",
  ],
  17: [
    // E-xơ-tê
    "et",
    "este",
    "exote",
    "esther",
    "esther",
    "esth",
    "es",
  ],
  18: [
    // Gióp
    "gp",
    "giop",
    "job",
    "job",
    "jb",
  ],
  19: [
    // Thi-thiên
    "tt",
    "thi",
    "thithi",
    "thithien",
    "thien",
    "thivien",
    "psalm",
    "psalms",
    "ps",
    "psa",
  ],
  20: [
    // Châm-ngôn
    "cn",
    "cham",
    "chamngon",
    "ngon",
    "proverbs",
    "prov",
    "pr",
  ],
  21: [
    // Truyền-đạo
    "td",
    "truyen",
    "truyendao",
    "dao",
    "ecclesiastes",
    "eccl",
    "ecc",
  ],
  22: [
    // Nhã-ca
    "nc",
    "nha",
    "nhaca",
    "ca",
    "songofsongs",
    "songofsolomon",
    "song",
    "sos",
    "ss",
  ],
  23: [
    // Ê-sai
    "es",
    "esai",
    "isai",
    "isa",
    "isaiah",
    "isa",
    "is",
  ],
  24: [
    // Giê-rê-mi
    "gm",
    "gr",
    "geremi",
    "gieremi",
    "giereemi",
    "jeremi",
    "jeremiah",
    "jer",
    "je",
  ],
  25: [
    // Ca-thương  (Ai-ca)
    "ct",
    "at",
    "cathuong",
    "aica",
    "thuong",
    "aithuong",
    "lamentations",
    "lam",
    "la",
  ],
  26: [
    // Ê-xê-chi-ên
    "ec",
    "exe",
    "exechien",
    "exechie",
    "ezechiel",
    "ezekiel",
    "ezek",
    "eze",
    "ezk",
  ],
  27: [
    // Đa-ni-ên
    "dn",
    "danie",
    "danien",
    "daniel",
    "daniel",
    "dan",
    "da",
  ],
  28: [
    // Ô-sê
    "os",
    "ose",
    "osee",
    "hosea",
    "hos",
  ],
  29: [
    // Giô-ên
    "gn",
    "gioen",
    "joel",
    "joel",
    "jl",
  ],
  30: [
    // A-mốt
    "am",
    "amot",
    "amos",
    "amos",
  ],
  31: [
    // Áp-đia
    "apd",
    "apdia",
    "apdia",
    "obadiah",
    "obad",
    "ob",
  ],
  32: [
    // Giô-na
    "gon",
    "giona",
    "jona",
    "jonah",
    "jon",
    "jnh",
  ],
  33: [
    // Mi-chê
    "mc",
    "miche",
    "michee",
    "micah",
    "mic",
  ],
  34: [
    // Na-hum
    "na",
    "nahum",
    "nahum",
    "nah",
  ],
  35: [
    // Ha-ba-cúc
    "hbc",
    "habacuc",
    "habakuk",
    "habakkuk",
    "habakkuk",
    "hab",
  ],
  36: [
    // Xô-phô-ni
    "sp",
    "sophoni",
    "xophoni",
    "zephaniah",
    "zeph",
    "zep",
  ],
  37: [
    // A-ghê
    "ag",
    "aghe",
    "aggai",
    "haggai",
    "hag",
  ],
  38: [
    // Xa-cha-ri
    "xc",
    "xachari",
    "zachari",
    "zachariah",
    "zechariah",
    "zech",
    "zec",
  ],
  39: [
    // Ma-la-chi
    "ml",
    "malachi",
    "malaci",
    "malachi",
    "mal",
  ],
  // ── New Testament ─────────────────────────────────────────────────────────
  40: [
    // Ma-thi-ơ
    "mt",
    "mat",
    "mathi",
    "mathio",
    "mathew",
    "matthew",
    "matthew",
    "matt",
  ],
  41: [
    // Mác
    "mk",
    "mac",
    "marc",
    "mark",
    "mark",
    "mar",
  ],
  42: [
    // Lu-ca
    "lc",
    "luca",
    "luka",
    "luk",
    "luke",
    "luke",
    "lk",
  ],
  43: [
    // Giăng  (John)
    "gi",
    "gia",
    "gian",
    "giang",
    "gioan",
    "jn",
    "jhn",
    "jo",
    "john",
    "john",
  ],
  44: [
    // Công-vụ
    "cv",
    "cvu",
    "congvu",
    "congvucacsudo",
    "acts",
    "act",
    "ac",
  ],
  45: [
    // Rô-ma
    "rm",
    "rom",
    "roma",
    "rma",
    "romans",
    "rom",
    "ro",
  ],
  46: [
    // 1 Cô-rinh-tô
    "1cr",
    "1crt",
    "1cor",
    "1corinhto",
    "corinhto",
    "1corinthians",
    "1co",
  ],
  47: [
    // 2 Cô-rinh-tô
    "2cr",
    "2crt",
    "2cor",
    "2corinhto",
    "2corinthians",
    "2co",
  ],
  48: [
    // Ga-la-ti
    "gl",
    "gal",
    "galati",
    "galat",
    "galatians",
    "gal",
    "ga",
  ],
  49: [
    // Ê-phê-sô
    "ep",
    "eph",
    "epheso",
    "epheso",
    "ephesians",
    "eph",
  ],
  50: [
    // Phi-líp
    "pl",
    "phi",
    "philp",
    "philip",
    "philipe",
    "philippians",
    "phil",
    "php",
  ],
  51: [
    // Cô-lô-se
    "cl",
    "col",
    "colose",
    "colossian",
    "colossians",
    "col",
  ],
  52: [
    // 1 Tê-sa-lô-ni-ca
    "1ts",
    "1tes",
    "1tesa",
    "1tesalonica",
    "1thessalonians",
    "1thess",
    "1th",
  ],
  53: [
    // 2 Tê-sa-lô-ni-ca
    "2ts",
    "2tes",
    "2tesa",
    "2tesalonica",
    "2thessalonians",
    "2thess",
    "2th",
  ],
  54: [
    // 1 Ti-mô-thê
    "1tm",
    "1tim",
    "1timothe",
    "1timo",
    "timo",
    "timothe",
    "timotheo",
    "1timothy",
    "1ti",
  ],
  55: [
    // 2 Ti-mô-thê
    "2tm",
    "2tim",
    "2timothe",
    "2timo",
    "2timothy",
    "2ti",
  ],
  56: [
    // Tít
    "tit",
    "titus",
    "titus",
    "tit",
  ],
  57: [
    // Phi-lê-môn
    "plm",
    "philemon",
    "philemon",
    "phm",
    "philemon",
    "phlm",
    "phm",
  ],
  58: [
    // Hê-bơ-rơ
    "hb",
    "heb",
    "hebro",
    "heboro",
    "hebore",
    "hebrews",
    "heb",
  ],
  59: [
    // Gia-cơ
    "gc",
    "giac",
    "giaco",
    "giacob",
    "giacomo",
    "james",
    "jas",
    "jm",
  ],
  60: [
    // 1 Phi-e-rơ
    "1pr",
    "1phi",
    "1phie",
    "1phiero",
    "phiero",
    "1peter",
    "1pet",
    "1pe",
  ],
  61: [
    // 2 Phi-e-rơ
    "2pr",
    "2phi",
    "2phie",
    "2phiero",
    "2peter",
    "2pet",
    "2pe",
  ],
  62: [
    // 1 Giăng  (1 John)
    "1gi",
    "1gia",
    "1gian",
    "1giang",
    "1john",
    "1jn",
    "1jo",
  ],
  63: [
    // 2 Giăng
    "2gi",
    "2gia",
    "2gian",
    "2giang",
    "2john",
    "2jn",
    "2jo",
  ],
  64: [
    // 3 Giăng
    "3gi",
    "3gia",
    "3gian",
    "3giang",
    "3john",
    "3jn",
    "3jo",
  ],
  65: [
    // Giu-đe
    "gd",
    "giude",
    "jude",
    "jud",
    "jude",
  ],
  66: [
    // Khải-huyền
    "kh",
    "khai",
    "khaihuyen",
    "apocalypse",
    "revelation",
    "revelations",
    "rev",
  ],
};

export async function seedBibleBookSearchKeys(prisma: PrismaClient) {
  const books = await prisma.bibleBook.findMany({ orderBy: { order: "asc" } });
  if (books.length === 0) {
    console.log("No BibleBook rows; skip BibleBookSearchKey seed.");
    return;
  }

  const toUpsert: { bookId: string; lang: string; key: string }[] = [];

  for (const book of books) {
    // EN keys: normalized name + extra keys by order
    const nameEnNorm = normalizeKey(book.nameEn);
    toUpsert.push({ bookId: book.id, lang: "en", key: nameEnNorm });
    const nameEnCompact = compactKey(nameEnNorm);
    if (nameEnCompact !== nameEnNorm) {
      toUpsert.push({ bookId: book.id, lang: "en", key: nameEnCompact });
    }
    for (let i = 3; i <= nameEnCompact.length; i++) {
      toUpsert.push({ bookId: book.id, lang: "en", key: nameEnCompact.slice(0, i) });
    }
    const enExtra = EN_EXTRA_KEYS_BY_ORDER[book.order];
    if (enExtra) {
      for (const k of enExtra) {
        const key = k.length <= 2 || k.includes(" ") ? k : normalizeKey(k);
        toUpsert.push({ bookId: book.id, lang: "en", key });
      }
    }

    // VI keys: normalized with spaces (e.g. "ma thi o") and compact ("mathio")
    const nameViNorm = normalizeKey(book.nameVi);
    toUpsert.push({ bookId: book.id, lang: "vi", key: nameViNorm });
    const nameViCompact = compactKey(nameViNorm);
    if (nameViCompact !== nameViNorm) {
      toUpsert.push({ bookId: book.id, lang: "vi", key: nameViCompact });
    }
    // Prefixes from 2 chars so "gi", "gia" show Gia-cơ / Giăng (VI users type short)
    for (let i = 2; i <= nameViCompact.length; i++) {
      const prefix = nameViCompact.slice(0, i);
      toUpsert.push({ bookId: book.id, lang: "vi", key: prefix });
    }
    // Numbered books: ensure "1giang", "2giang" etc. (1/2/3 + name)
    // Also generate bare-name prefixes so "timo" matches "1timothe" (typing without number).
    for (const prefix of ["1 ", "2 ", "3 "]) {
      if (book.nameVi.startsWith(prefix)) {
        const digit = prefix.trim();
        const bareName = nameViCompact.replace(new RegExp(`^${digit}`), "");
        if (bareName) {
          // "1timothe" → also seed "timothe", "timoth", "timot", "timo", "tim", "ti"
          for (let i = 2; i <= bareName.length; i++) {
            toUpsert.push({ bookId: book.id, lang: "vi", key: bareName.slice(0, i) });
          }
        }
      }
    }
    // Also for EN numbered books (1cor, 1tim etc.) — bare name prefixes
    for (const prefix of ["1 ", "2 ", "3 "]) {
      if (book.nameEn.startsWith(prefix)) {
        const digit = prefix.trim();
        const bareEnName = nameEnCompact.replace(new RegExp(`^${digit}`), "");
        if (bareEnName) {
          for (let i = 3; i <= bareEnName.length; i++) {
            toUpsert.push({ bookId: book.id, lang: "en", key: bareEnName.slice(0, i) });
          }
        }
      }
    }
    const viExtra = VI_EXTRA_KEYS_BY_ORDER[book.order];
    if (viExtra) {
      for (const k of viExtra) {
        const norm = compactKey(normalizeKey(k));
        // Add the key itself
        toUpsert.push({ bookId: book.id, lang: "vi", key: norm });
        // Also add all prefixes of each extra key so "gian" → "giang" works
        // but only for keys longer than 2 chars to avoid too-broad single-char keys
        if (norm.length > 2) {
          for (let i = 2; i < norm.length; i++) {
            toUpsert.push({ bookId: book.id, lang: "vi", key: norm.slice(0, i) });
          }
        }
      }
    }
  }

  // Dedupe by (bookId, lang, key)
  const seen = new Set<string>();
  const unique = toUpsert.filter((r) => {
    const s = `${r.bookId}:${r.lang}:${r.key}`;
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  });

  await prisma.bibleBookSearchKey.deleteMany({});
  await prisma.bibleBookSearchKey.createMany({ data: unique });
  console.log(`Seeded ${unique.length} BibleBookSearchKey rows (EN + VI).`);
}
