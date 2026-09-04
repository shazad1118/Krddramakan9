/* =========================================================
   KRDDramakan — script.js
   ========================================================= */


/* =========================================================
   krdConfirm — Safari-safe replacement for window.confirm()
   Returns a Promise<boolean>
   ========================================================= */
function krdConfirm(message, icon){
  icon = icon || '🗑️';
  return new Promise(function(resolve){
    var modal   = document.getElementById('confirm-modal');
    var msgEl   = document.getElementById('confirm-modal-msg');
    var iconEl  = document.getElementById('confirm-modal-icon');
    var btnOk   = document.getElementById('confirm-modal-ok');
    var btnCancel = document.getElementById('confirm-modal-cancel');

    iconEl.textContent = icon;
    msgEl.textContent  = message;
    modal.style.display = 'flex';

    function cleanup(result){
      modal.style.display = 'none';
      btnOk.removeEventListener('click', onOk);
      btnCancel.removeEventListener('click', onCancel);
      resolve(result);
    }
    function onOk(){ cleanup(true); }
    function onCancel(){ cleanup(false); }

    btnOk.addEventListener('click', onOk);
    btnCancel.addEventListener('click', onCancel);
  });
}


/* krdAlert — Safari-safe replacement for window.alert() */
function krdAlert(message, icon){
  icon = icon || 'ℹ️';
  return new Promise(function(resolve){
    var modal   = document.getElementById('confirm-modal');
    var msgEl   = document.getElementById('confirm-modal-msg');
    var iconEl  = document.getElementById('confirm-modal-icon');
    var btnOk   = document.getElementById('confirm-modal-ok');
    var btnCancel = document.getElementById('confirm-modal-cancel');

    iconEl.textContent = icon;
    msgEl.textContent  = message;
    btnOk.textContent  = 'باشە';
    btnCancel.style.display = 'none';
    modal.style.display = 'flex';

    function cleanup(){
      modal.style.display = 'none';
      btnOk.removeEventListener('click', onOk);
      btnOk.textContent = 'بەڵێ، بسڕەوە';
      btnCancel.style.display = '';
      resolve();
    }
    function onOk(){ cleanup(); }
    btnOk.addEventListener('click', onOk);
  });
}

const LS_DRAMAS = "krd-admin-dramas";
const LS_EXTRA_EPISODES = "krd-extra-episodes";
const LS_HIDDEN = "krd-hidden-dramas";
const LS_FEATURES = "krd-admin-features";
const LS_THEME = "krd-theme";
const SS_ADMIN = "krd-admin-session";
const SS_ADMIN_CODE = "krd-admin-session-code";
/* نوێ: دەستکاریکردنی دراما و ئەڵقەکان (چارەسەری دووبارە هەژماردن و پاشەکەوتنەکردنی سڕینەوە) */
const LS_DRAMA_OVERRIDES = "krd-drama-overrides";
const LS_EPISODE_OVERRIDES = "krd-episode-overrides";
/* نوێ: تایبەتمەندییەکانی بینەر */
const LS_FAVORITES = "krd-favorites";
const LS_HISTORY = "krd-watch-history";
const LS_VIEWER_PREFS = "krd-viewer-prefs";

const DEFAULT_VIEWER_PREFS = { autoplay: false, fontSize: "m" };

const DEFAULT_FEATURES = {
  showHero: true,
  showGenreChips: true,
  showSearch: true,
  showTheme: true,
  showAbout: true,
  showEpisodeCount: true,
  showDesc: true,
  allowAddDrama: true,
  allowAddEpisode: true,
  allowDeleteDrama: true,
  // نوێ: جۆری ڕووناکی بە خودکاری
  enableAutoTheme: false,
  // نوێ: سڕینەوەی ئەڵقەی تایبەت
  allowDeleteEpisode: true,
  // نوێ: سڕینەوەی تێكەڵی دراماکان
  allowBulkDelete: true,
  // نوێ: گێرانەوەی دراماکان بە زنجیرە
  allowCategories: true,
  // نوێ: راپۆرتاندنی آماری بەکاریهێنەران
  enableAnalytics: false,
  // نوێ: سڕینەوەی دراماکان بەگونجاوی شێوە
  allowAdvancedDelete: true,
  // نوێ: بیرۆکی زیاتری دراماکان
  allowMediaUpload: false,
  // نوێ: نیشاندانی نیشانەی سەرووی
  showTopBadge: true,
  // نوێ: دابەشکردنی دراماکان بە سێ ئاستی
  enableRating: true,
  // نوێ: بندناو نموونە
  enableComments: false,
  // نوێ: پالکەیی بەکارهێنەران
  enableUserLists: false,
  // نوێ: نیشاندەری کاتی بینین
  enableViewCount: true,
  // نوێ: سڕینەوەی هەموو ئیتیگاک
  allowCacheClean: true,
  // نوێ: دابەشکردنی دراماکان بە هاولاتیی جوڵە
  allowScheduling: true,
  // نوێ: هەستێرکردنی دراما
  allowFavorites: true,
  // نوێ: نوێکردنەوەی درامایی ڕوو درووست دا
  enableDramaRefresh: true,
  // نوێ: بڕۆکی دراماکان بە سیندۆم
  enableExport: true,
  // نوێ: داڕیزانی دراماکانی بەشەکان
  allowEpisodeSort: true,
  // نوێ: سڕینەوەی درامایی درۆکان
  allowHardDelete: true,
  // نوێ: باکاپی داتا
  enableBackup: true,
  // نوێ: وەچیکی پاسۆرد ئەدمین
  requireAdminPassword: true,
  // نوێ: سڕینەوەی ئیتیگای سڕاو
  allowPurgeDeleted: true,
  // نوێ: جؤری رۆشنایی سپی/ڕەش/ئاپتۆماتیک
  themeMode: "dark",
  // نوێ: سڕینەوەی بەتێكبڕی
  allowBatchClean: true,
  // نوێ: تەقديم دراماکان
  allowDramaRanking: true,
  // ================ 5 تایبەتمەندی نوێی تایبەت بە بەکارهێنەر ================ //
  // نوێ: بەشی بەردەوامبوونی بینین لەسەر سەرەتا
  showContinueWatching: true,
  // نوێ: زەنگۆڵەی ئاگادارکردنەوە بۆ بەکارهێنەران
  showNotificationBell: true,
  // نوێ: بەشی پێڕاپێی بەکارهێنەر (ئاگاداری، نهێنی، پێشنیار، موزیک)
  showViewerPrefs: true,
  // نوێ: لینکی دڵخوازەکانم لەناو ڕێکخستن
  showFavoritesShortcut: true,
  // نوێ: لینکی فێرکاری و تێبینی لەناو ڕێکخستن
  showHelpSection: true,
};

const FEATURES_META = [
  { key:"showHero", title:"پیشاندانی هیرۆی سەرەکی", desc:"وێنە و زانیاری دراما تایبەتەکە لەسەرووی سەرەتا",
    icon:`<path d="M4 5h16v11H4z"/><path d="M9 21h6M12 16v5"/>` },
  { key:"showGenreChips", title:"چیپی ژانرەکان", desc:"ڕیزی فلتەری ژانر لەسەرووی سەرەتا",
    icon:`<path d="M4 6h16M4 12h10M4 18h6"/>` },
  { key:"showSearch", title:"تایبەتمەندی گەڕان", desc:"ئایکۆنی گەڕان لە سەرەتا و لای خوارەوە",
    icon:`<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>` },
  { key:"showTheme", title:"گۆڕینی ڕووناکی", desc:"هەڵبژاردنی ڕووناکی سپی/ڕەش بۆ بەکارهێنەران",
    icon:`<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>` },
  { key:"showAbout", title:"بەشی دەربارە", desc:"لینکی دەربارە لەناو ڕێکخستن بۆ بەکارهێنەران",
    icon:`<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>` },
  { key:"showEpisodeCount", title:"ژمارەی ئەڵقەکان لەسەر کارت", desc:"نیشاندانی ژمارەی بەشەکان لەسەر پۆستەری هەر دراما",
    icon:`<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9h6v6H9z"/>` },
  { key:"showDesc", title:"کورتە چیرۆک لە وردەکاری", desc:"پیشاندانی دەقی چیرۆک لە پەڕەی وردەکاری دراما",
    icon:`<path d="M4 6h16M4 12h16M4 18h10"/>` },
  { key:"allowAddDrama", title:"ڕێگەدان بە زیادکردنی درامای نوێ", desc:"چالاککردنی تابی «درامای نوێ» لە ئەدمین",
    icon:`<path d="M12 5v14M5 12h14"/>` },
  { key:"allowAddEpisode", title:"ڕێگەدان بە زیادکردنی ئەڵقە", desc:"چالاککردنی تابی «زیادکردنی ئەڵقە» لە ئەدمین",
    icon:`<path d="M8 5v14l11-7L8 5Z"/>` },
  { key:"allowDeleteDrama", title:"ڕێگەدان بە سڕینەوەی دراما", desc:"چالاککردنی دووگمەی سڕینەوەی هەمیشەیی بۆ دراماکانی ئەدمین",
    icon:`<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/>` },
  // ================ 20 تایبەتمەندی نوێ ================ //
  { key:"enableAutoTheme", title:"جۆری ڕووناکی خودکاری", desc:"گۆڕینی ڕووناکی لە سپی بە ڕەش بە سەاتی ڕۆژ",
    icon:`<circle cx="12" cy="12" r="4"/><path d="M12 2v6M12 16v6M6 12H2M20 12h4"/>` },
  { key:"allowDeleteEpisode", title:"سڕینەوەی ئەڵقەی تایبەت", desc:"ڕێگەدان بە سڕینەوەی ئەڵقەکان یەک یەک",
    icon:`<path d="M8 5v14l11-7L8 5Z"/><path d="M18 6 6 18"/>` },
  { key:"allowBulkDelete", title:"سڕینەوەی تێكەڵی دراماکان", desc:"سڕینەوەی چەند دراما لە یەکجا",
    icon:`<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6M8 10h8M8 16h8"/>` },
  { key:"allowCategories", title:"گێرانەوەی دراماکان بە زنجیرە", desc:"دروستکردنی کاتێگۆریەکانی تایبەت بۆ دراماکان",
    icon:`<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>` },
  { key:"enableAnalytics", title:"راپۆرتاندنی آماری بەکاریهێنەران", desc:"دیتنی ئامارگێری سەیرکردنی دراماکان",
    icon:`<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/><path d="M3 12h18M12 3v18"/>` },
  { key:"allowAdvancedDelete", title:"سڕینەوەی بەگونجاوی شێوە", desc:"سڕینەوەی دراماکان بە ڕێگا هەڵبژاردن",
    icon:`<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/>` },
  { key:"allowMediaUpload", title:"بیرۆکی زیاتری دراماکان", desc:"لادان یان هێنانی وێنە بۆ دراماکان",
    icon:`<path d="M19 13v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6"/><polyline points="12 16 12 3 9 6 12 3 15 6"/>` },
  { key:"showTopBadge", title:"نیشانەی سەرووی دراماکان", desc:"نیشاندانی نیشانەی «سەرووی» یان «گرینگ» لەسەر دراما",
    icon:`<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"/>` },
  { key:"enableRating", title:"دابەشکردنی دراماکان بە سێ ئاستی", desc:"ئاستگێری دراماکان بە ستێرە",
    icon:`<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>` },
  { key:"enableComments", title:"بندناو درامایی", desc:"ڕێگەدان بە بەکارهێنەران دەقی پاسخ بنووسن",
    icon:`<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>` },
  { key:"enableUserLists", title:"پالکەیی بەکارهێنەران", desc:"ڕێگەدان بە بەکارهێنەران پالکەی دراما دروست بکەن",
    icon:`<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>` },
  { key:"enableViewCount", title:"نیشاندەری کاتی بینین", desc:"نیشاندانی ژمارەی جار سەیرکردنی هەر دراما",
    icon:`<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/>` },
  { key:"allowCacheClean", title:"سڕینەوەی هەموو یادداشتەکان", desc:"پاک کردنی هەموو داتای کاشتی سایت",
    icon:`<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/><path d="M7 11v6M12 11v6M17 11v6"/>` },
  { key:"allowScheduling", title:"دابەشکردنی دراماکان بە جدول", desc:"ڕێگەدان بە زیاد کردنی دراما لە کاتی دیاریکراو",
    icon:`<path d="M8 2v4M16 2v4M3 4h18v16H3Z"/><path d="M3 10h18"/>` },
  { key:"allowFavorites", title:"هەستێرکردنی دراماکان", desc:"نیشاندانی دووگمەی هەستێرکردن لە هەر دراما",
    icon:`<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>` },
  { key:"enableDramaRefresh", title:"نوێکردنەوەی دراماکان", desc:"نوێکردنەوەی لیستی دراماکان بە خودکاری",
    icon:`<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M3 21v-5h5"/>` },
  { key:"enableExport", title:"بڕۆکی دراماکان بە فایل", desc:"دەرهێنانی داتای دراماکان بۆ فایلی JSON",
    icon:`<path d="M8 12L4 8m0 0l4-4m-4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2z"/>` },
  { key:"allowEpisodeSort", title:"داڕیزانی بەشەکان", desc:"ڕێگەدان بە تێکڕێی بەشەکان",
    icon:`<path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M19 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M13 7H3M13 11H3M13 15H3M13 19H3"/>` },
  { key:"allowHardDelete", title:"سڕینەوەی دەبەڵاو", desc:"سڕینەوەی هەمیشەیی دراما بێ واپسکەوتن",
    icon:`<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6M18 11v6M6 11v6"/>` },
  { key:"enableBackup", title:"باکاپی داتا", desc:"دروست کردنی کۆپی پاراستنی هەموو داتاکان",
    icon:`<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><polyline points="17 21 17 13 7 13 7 21"/>` },
  { key:"requireAdminPassword", title:"وەچیکی پاسۆردی ئەدمین", desc:"چالاک کردنی پاسۆردی هەڵبژاردنی دیکەی ئەدمین",
    icon:`<path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Z"/>` },
  { key:"allowPurgeDeleted", title:"سڕینەوەی ئیتیگای سڕاو", desc:"سڕینەوەی هەمیشەیی ئیتیگای سڕاو",
    icon:`<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6-1 18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L4 6"/>` },
  { key:"themeMode", title:"جۆری ڕووناکی پێشفیبی", desc:"هیلکردنی جۆری ڕووناکی بنەڕەتی (سپی/ڕەش/خودکاری)",
    icon:`<circle cx="12" cy="12" r="4"/><path d="M12 2v6M12 16v6"/>` },
  { key:"allowBatchClean", title:"پاک کردنی بەتێکبڕی", desc:"پاک کردنی ئامارگێری و یادداشتە بەتێکبڕی",
    icon:`<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><path d="M10 11v6M14 11v6M18 11v6M6 11v6"/>` },
  { key:"allowDramaRanking", title:"تەقديم دراماکان", desc:"ڕێگەدان بە تقديم یان پلێنکردنی دراماکان",
    icon:`<path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7l9-4 9 4M3 10h18"/><path d="M12 10v8"/><path d="M7 10v3M17 10v3"/>` },
  // ================ 5 تایبەتمەندی نوێ بۆ بەکارهێنەر (نەک ئەدمین) ================ //
  { key:"showContinueWatching", title:"بەردەوامبوونی بینین", desc:"پیشاندانی بەشی «بەردەوامبوونی بینین» لەسەر سەرەتا بۆ بەکارهێنەران",
    icon:`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>` },
  { key:"showNotificationBell", title:"زەنگۆڵەی ئاگادارکردنەوە", desc:"پیشاندانی ئایکۆنی ئاگادارکردنەوە بۆ بەکارهێنەران لە ڕێکخستن",
    icon:`<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>` },
  { key:"showViewerPrefs", title:"پێڕاپێی بەکارهێنەر", desc:"پیشاندانی بەشی ڕێکخستنی تایبەتی بەکارهێنەر (ئاگاداری، نهێنی، پێشنیار، موزیک)",
    icon:`<path d="M12 2L2 7v10a8 8 0 0 0 8 8 8 8 0 0 0 8-8V7l-10-5Z"/>` },
  { key:"showFavoritesShortcut", title:"لینکی دڵخوازەکانم", desc:"پیشاندانی لینکی «دڵخوازەکانم» لەناو ڕێکخستن بۆ بەکارهێنەران",
    icon:`<path d="M12 21s-7.5-4.6-10-9.3C.4 8.2 2.3 4.5 6 4.5c2 0 3.5 1 4.5 2.5C11.5 5.5 13 4.5 15 4.5c3.7 0 5.6 3.7 4 7.2C19.5 16.4 12 21 12 21Z"/>` },
  { key:"showHelpSection", title:"فێرکاری و تێبینی", desc:"پیشاندانی لینکی «فێرکاری و تێبینی» لەناو ڕێکخستن بۆ بەکارهێنەران",
    icon:`<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>` },
];

const state = {
  baseDramas: [],
  adminDramas: [],
  extraEpisodes: {},
  hiddenIds: [],
  features: { ...DEFAULT_FEATURES },
  dramas: [],
  activeGenre: "هەموو",
  currentDrama: null,
  isAdmin: false,
  adminCode: null, // نوێ: بۆ پشتڕاستکردنەوەی ناردنی داتا بۆ سێرڤەر
  // نوێ
  dramaOverrides: {},
  episodeOverrides: {},
  favorites: [],
  history: {},
  viewerPrefs: { ...DEFAULT_VIEWER_PREFS },
  activePlayer: null, // { dramaId, episodeIndex }
};

const GENRES = [
  "هەموو","کوردی","کۆری","هۆلیود","بۆلیود","بیانی","تورکی","عەرەبی",
  "کۆمیدی","ترسناک","ڕۆمانسی","خەیاڵی","ئاکشن","خێزانی","مێژوویی","نهێنی"
];

/* ---------- یارمەتیدەرەکان ---------- */
function posterFallback(name){
  return `https://placehold.co/500x750/141414/6b6b6b.png?text=${encodeURIComponent(name || "?")}`;
}
function readLS(key, fallback){
  try{ const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }catch(e){ return fallback; }
}
function writeLS(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){}
}
function findDrama(id){
  return state.dramas.find(d => d.id === id);
}
function getVisibleDramas(){
  return state.dramas.filter(d => !d.hidden && !d.deleted);
}

/* ---------- دڵخوازەکان (Favorites) ---------- */
function isFavorite(id){
  return state.favorites.includes(id);
}
function toggleFavorite(id){
  if(state.favorites.includes(id)){
    state.favorites = state.favorites.filter(f => f !== id);
  } else {
    state.favorites.push(id);
  }
  writeLS(LS_FAVORITES, state.favorites);
  document.querySelectorAll(`.fav-btn[data-id="${id}"]`).forEach(btn=>{
    btn.classList.toggle("active", isFavorite(id));
  });
  renderFavoritesView();
}
function makeFavBtn(id){
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "fav-btn" + (isFavorite(id) ? " active" : "");
  btn.dataset.id = id;
  btn.setAttribute("aria-label", "دڵخواز");
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.2 2.3 4.5 6 4.5c2 0 3.5 1 4.5 2.5C11.5 5.5 13 4.5 15 4.5c3.7 0 5.6 3.7 4 7.2C19.5 16.4 12 21 12 21Z"/></svg>`;
  btn.addEventListener("click", (e)=>{
    e.stopPropagation();
    toggleFavorite(id);
  });
  return btn;
}
function renderFavoritesView(){
  const host = document.getElementById("favorites-results");
  if(!host) return;
  host.innerHTML = "";
  const favDramas = state.favorites.map(id => findDrama(id)).filter(d => d && !d.deleted && !d.hidden);
  if(!favDramas.length){
    host.appendChild(emptyState("هیچ دراما دڵخوازت نییە", "دڵی سەر کارتی هەر درامایەک بکە بۆ زیادکردنی بۆ لیستی دڵخوازەکان."));
    return;
  }
  const grid = document.createElement("div");
  grid.className = "grid";
  favDramas.forEach(d => grid.appendChild(makeCard(d)));
  host.appendChild(grid);
}

/* ---------- بەردەوامبوونی تەماشاکردن (Continue Watching) ---------- */
function recordHistory(dramaId, episodeIndex, episodeTitle){
  state.history[dramaId] = { episodeIndex, episodeTitle, ts: Date.now() };
  writeLS(LS_HISTORY, state.history);
  renderContinueWatchingRow();
}
function clearHistory(){
  state.history = {};
  writeLS(LS_HISTORY, state.history);
  renderContinueWatchingRow();
}
function renderContinueWatchingRow(){
  const host = document.getElementById("continue-watching-host");
  if(!host) return;
  host.innerHTML = "";

  const entries = Object.entries(state.history)
    .map(([id, h]) => ({ drama: findDrama(id), h }))
    .filter(x => x.drama && !x.drama.deleted && !x.drama.hidden)
    .sort((a, b) => b.h.ts - a.h.ts);

  if(!entries.length) return;

  const section = document.createElement("div");
  const head = document.createElement("div");
  head.className = "section-head";
  head.innerHTML = `<h2>بەردەوامبوونی تەماشاکردن</h2><span>${entries.length} دانە</span>`;
  section.appendChild(head);

  const row = document.createElement("div");
  row.className = "row-scroll";
  entries.forEach(({ drama, h })=>{
    const card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    const wrap = document.createElement("div");
    wrap.className = "card-poster-wrap";
    const img = document.createElement("img");
    img.className = "card-poster";
    img.loading = "lazy";
    img.alt = drama.name;
    img.src = drama.poster || posterFallback(drama.name);
    img.onerror = ()=>{ img.src = posterFallback(drama.name); };
    wrap.appendChild(img);
    const badge = document.createElement("span");
    badge.className = "card-badge";
    badge.textContent = "بەردەوامبوون";
    wrap.appendChild(badge);
    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `<b>${drama.name}</b><span>${h.episodeTitle || ""}</span>`;
    card.appendChild(wrap);
    card.appendChild(body);
    card.addEventListener("click", ()=>{
      const ep = (drama.episodes || [])[h.episodeIndex];
      if(ep) openPlayer(drama, ep, h.episodeIndex);
      else openDetail(drama.id);
    });
    row.appendChild(card);
  });
  section.appendChild(row);
  host.appendChild(section);
}

/* ---------- ڕێکخستنەکانی بینەر (Viewer Preferences) ---------- */
function applyViewerPrefs(){
  const root = document.documentElement;
  const scaleMap = { s: "0.92", m: "1", l: "1.12" };
  root.style.setProperty("--font-scale", scaleMap[state.viewerPrefs.fontSize] || "1");

  const autoplayToggle = document.getElementById("pref-autoplay");
  if(autoplayToggle) autoplayToggle.checked = !!state.viewerPrefs.autoplay;

  document.querySelectorAll(".font-size-opt").forEach(btn=>{
    btn.classList.toggle("selected", btn.dataset.size === state.viewerPrefs.fontSize);
  });
}
function setViewerPref(key, value){
  state.viewerPrefs[key] = value;
  writeLS(LS_VIEWER_PREFS, state.viewerPrefs);
  applyViewerPrefs();
}
async function handleClearLocalData(){
  const ok = await krdConfirm("دڵنیایت لە سڕینەوەی هەموو داتای خۆت لەم ئامێرە؟ (دڵخوازەکان، بەردەوامبوونی تەماشاکردن، ڕووناکی)\n\nئەم کردارە کاریگەری لەسەر دراماکان و ڕێکخستنەکانی ئەدمین نییە.", "⚠️");
  if(!ok) return;
  state.favorites = [];
  state.history = {};
  state.viewerPrefs = { ...DEFAULT_VIEWER_PREFS };
  writeLS(LS_FAVORITES, state.favorites);
  writeLS(LS_HISTORY, state.history);
  writeLS(LS_VIEWER_PREFS, state.viewerPrefs);
  applyViewerPrefs();
  renderFavoritesView();
  renderContinueWatchingRow();
  applyTheme("dark");
  await krdAlert("✓ داتای خۆت سڕایەوە.", "✅");
}

/* ---------- بارکردنی داتا ---------- */
async function loadData(){
  try{
    const res = await fetch("json/drama.json");
    state.baseDramas = res.ok ? await res.json() : [];
  }catch(err){
    console.error("کێشە لە بارکردنی drama.json:", err);
    state.baseDramas = [];
  }
  state.adminDramas = readLS(LS_DRAMAS, []);
  state.extraEpisodes = readLS(LS_EXTRA_EPISODES, {});
  state.hiddenIds = readLS(LS_HIDDEN, []);
  state.features = { ...DEFAULT_FEATURES, ...readLS(LS_FEATURES, {}) };
  state.dramaOverrides = readLS(LS_DRAMA_OVERRIDES, {});
  state.episodeOverrides = readLS(LS_EPISODE_OVERRIDES, {});
  state.favorites = readLS(LS_FAVORITES, []);
  state.history = readLS(LS_HISTORY, {});
  state.viewerPrefs = { ...DEFAULT_VIEWER_PREFS, ...readLS(LS_VIEWER_PREFS, {}) };

  mergeDramas();
  buildChips();
  renderHero();
  renderHome();
  buildGenreSelect();
  applyFeatureSettings();
  applyViewerPrefs();
  renderFavoritesView();
  renderContinueWatchingRow();
}

/* هەموو داتای دراماکان بە یەک شێواز کۆدەکاتەوە: بنەڕەت + خۆت زیادکردووە
   + دەستکاریکردن (override) + ئەڵقە زیادکراوەکان/دەستکاریکراوەکان.
   ئەم فەنکشنە سەرچاوەی ڕاستی بۆ هەموو بەشەکانی ئەپەکەیە، بۆیە هەرکات
   شتێک بگۆڕدرێت پێویستە ئەمە بانگ بکرێت تاکو هەموو شوێن یەکتری ئاگادار بن. */
function mergeDramas(){
  const build = (list, isAdminCreated) => list.map(d => {
    const ov = state.dramaOverrides[d.id] || {};
    const epOverride = state.episodeOverrides[d.id];
    const extra = state.extraEpisodes[d.id] || [];
    const episodes = epOverride ? epOverride : [...(d.episodes || []), ...extra];
    return {
      ...d,
      ...ov,
      episodes,
      // شاردنەوە: یان بە کۆدی ئەم ئامێرە (hiddenIds) یان بەوەی لەناو خودی
      // داتاکەدا (d.hidden/ov.hidden) هاتبێت — بۆ نموونە پاش بڵاوکردنەوە
      // بۆ سێرڤەر، تاکو شاردنەوە لای هەموو بەکارهێنەران کاریگەر بێت.
      hidden: d.hidden === true || ov.hidden === true || state.hiddenIds.includes(d.id),
      isAdminCreated,
    };
  });
  state.dramas = [...build(state.baseDramas, false), ...build(state.adminDramas, true)];
}

/* ---------- هەماهەنگی گشتی: هەموو بەشەکان ئاگاداری یەکتر بکەرەوە ---------- */
function syncAll(){
  mergeDramas();
  buildChips();
  buildGenreSelect();
  renderHero();
  renderHome();
  applyFeatureSettings();
  renderFavoritesView();
  renderContinueWatchingRow();

  if(state.currentDrama){
    const stillThere = findDrama(state.currentDrama.id);
    if(stillThere && !stillThere.deleted){
      state.currentDrama = stillThere;
      if(document.getElementById("view-detail").classList.contains("active")){
        openDetail(stillThere.id);
      }
    }
  }

  if(document.getElementById("view-search").classList.contains("active")) runSearch();

  if(state.isAdmin){
    populateEpisodeDramaSelect();
    renderEpisodePreview();
    renderManageList();
    populateDeleteDramaSelect();
    populateRestoreDramaSelect();
    populateEditDramaSelect();
    renderAdminSettings();
    if(document.getElementById("view-admin-panel").classList.contains("active") &&
       document.querySelector(".admin-tab.active")?.dataset.tab === "analytics"){
      renderAnalytics();
    }
    // هەر گۆڕانکارییەکی ئەدمین، بە شێوەی خۆکار بیبە بۆ سێرڤەر تاکو
    // لای هەموو بەکارهێنەران دیار بێت، نەک تەنها لەم وێبگەڕەیە.
    scheduleServerSync();
  }
}

/* ---------- بڵاوکردنەوە بۆ سێرڤەر (تاکو گۆڕانکاری ئەدمین لای هەموو
   بەکارهێنەران دیار بێت، نەک تەنها لەناو localStorage ی ئەم ئامێرە) ----------
   ئەم بەشە بە شێوەی خۆکار کاردەکات کاتێک لەژێر python3 server.py ڕادەکەیت.
   ئەگەر سایتەکە بە شێوەیەکی تر بکرێتەوە (بۆ نموونە فایلی HTML ڕاستەوخۆ،
   یان هۆستکردنی ستاتیکی بەبێ سێرڤەر)، ناردنەکە بە سادەیی شکست دەهێنێت و
   هیچ کێشەیەک دروست نابێت — هەموو شتێک وەک خۆی بە localStorage بەردەوام دەبێت. */
let _serverSyncTimer = null;
function scheduleServerSync(){
  clearTimeout(_serverSyncTimer);
  _serverSyncTimer = setTimeout(syncDramasToServer, 500);
}

async function syncDramasToServer(){
  if(!state.isAdmin || !state.adminCode) return;
  try{
    const payload = state.dramas.map(d => {
      const clean = { ...d };
      delete clean.isAdminCreated; // خانەیەکی کاتی، پێویست نییە پاشەکەوت بکرێت
      return clean;
    });

    const res = await fetch("api/save-dramas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: state.adminCode, dramas: payload }),
    });
    if(!res.ok) return; // سێرڤەر بوونی نییە یان کۆدی هەڵەیە — بێدەنگ بگەڕێوە

    // سەرکەوتوو بوو: drama.json خۆی ئێستا هەموو داتاکەی هەیە، بۆیە
    // پاسەوتکراوی تایبەت بەم وێبگەڕەیە (adminDramas/overrides) ئیتر پێویست
    // ناکات — لای خۆیانەوە دەبنە بەشێک لە داتای بنەڕەتی هاوبەش.
    state.baseDramas = payload.map(d => ({ ...d }));
    state.adminDramas = [];
    state.dramaOverrides = {};
    state.episodeOverrides = {};
    state.extraEpisodes = {};
    state.hiddenIds = [];
    writeLS(LS_DRAMAS, []);
    writeLS(LS_DRAMA_OVERRIDES, {});
    writeLS(LS_EPISODE_OVERRIDES, {});
    writeLS(LS_EXTRA_EPISODES, {});
    writeLS(LS_HIDDEN, []);
    mergeDramas();
  }catch(err){
    // ئۆفلاین یان بەبێ سێرڤەر — کێشە نییە، هەموو شتێک بە localStorage بەردەوام دەبێت
  }
}

/* ---------- چیپی جۆرەکان ---------- */
function buildChips(){
  const rail = document.getElementById("chip-rail");
  rail.innerHTML = "";
  GENRES.forEach(g=>{
    const btn = document.createElement("button");
    btn.className = "chip" + (g === state.activeGenre ? " active" : "");
    btn.textContent = g;
    btn.addEventListener("click", ()=>{
      state.activeGenre = g;
      buildChips();
      renderHome();
    });
    rail.appendChild(btn);
  });
}

/* ---------- کارتی دراما ---------- */
function makeCard(item){
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";

  const wrap = document.createElement("div");
  wrap.className = "card-poster-wrap";
  const img = document.createElement("img");
  img.className = "card-poster";
  img.loading = "lazy";
  img.alt = item.name;
  img.src = item.poster || posterFallback(item.name);
  img.onerror = ()=>{ img.src = posterFallback(item.name); };
  wrap.appendChild(img);

  if(state.features.showEpisodeCount){
    const badge = document.createElement("span");
    badge.className = "card-badge";
    badge.textContent = (item.episodes ? item.episodes.length : 0) + " بەش";
    wrap.appendChild(badge);
  }

  if(state.features.allowFavorites !== false){
    wrap.appendChild(makeFavBtn(item.id));
  }

  const body = document.createElement("div");
  body.className = "card-body";
  const b = document.createElement("b");
  b.textContent = item.name;
  const span = document.createElement("span");
  span.textContent = item.genre || "";
  body.appendChild(b);
  body.appendChild(span);

  card.appendChild(wrap);
  card.appendChild(body);
  card.addEventListener("click", ()=> openDetail(item.id));
  return card;
}

function buildRow(title, items){
  if(!items.length) return null;
  const section = document.createElement("div");
  const head = document.createElement("div");
  head.className = "section-head";
  head.innerHTML = `<h2>${title}</h2><span>${items.length} دانە</span>`;
  section.appendChild(head);
  const row = document.createElement("div");
  row.className = "row-scroll";
  items.forEach(it => row.appendChild(makeCard(it)));
  section.appendChild(row);
  return section;
}

function emptyState(title, desc){
  const wrap = document.createElement("div");
  wrap.className = "empty-state";
  wrap.innerHTML = `
    <div class="empty-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
    </div>
    <b>${title}</b>
    <p>${desc}</p>
  `;
  return wrap;
}

/* ---------- هیرۆی سەرەکی ---------- */
function renderHero(){
  const host = document.getElementById("hero-host");
  host.innerHTML = "";
  if(!state.features.showHero) return;

  const visible = getVisibleDramas();
  const featured = visible.find(d => d.featured) || visible[0];
  if(!featured) return;

  const hero = document.createElement("div");
  hero.className = "hero";
  hero.innerHTML = `
    <img src="${featured.backdrop || featured.poster || posterFallback(featured.name)}" alt="${featured.name}">
    <div class="hero-content">
      <span class="hero-badge">دراما تایبەت</span>
      <h1>${featured.name}</h1>
      <div class="hero-meta">
        <span>${featured.genre || ""}</span>
        <span class="dot"></span>
        <span>${(featured.episodes || []).length} بەش</span>
      </div>
      <p class="hero-desc">${featured.desc || ""}</p>
      <div class="hero-actions">
        <button class="hero-btn primary" id="hero-play">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z"/></svg>
          سەیرکردن
        </button>
        <button class="hero-btn secondary" id="hero-info">زانیاری زیاتر</button>
      </div>
    </div>
  `;
  host.appendChild(hero);

  hero.querySelector("#hero-play").addEventListener("click", ()=>{
    const ep = (featured.episodes || [])[0];
    if(ep) openPlayer(featured, ep);
  });
  hero.querySelector("#hero-info").addEventListener("click", ()=> openDetail(featured.id));
}

/* ---------- پیشاندانی سەرەتا ---------- */
function renderHome(){
  const host = document.getElementById("home-rows");
  host.innerHTML = "";
  const visible = getVisibleDramas();

  if(state.activeGenre !== "هەموو"){
    const filtered = visible.filter(d => d.genre === state.activeGenre);
    if(!filtered.length){
      host.appendChild(emptyState("هیچ دراما نەدۆزراوەوە", "تکایە جۆرێکی تر هەڵبژێرە."));
      return;
    }
    const row = buildRow(state.activeGenre, filtered);
    if(row) host.appendChild(row);
    return;
  }

  if(!visible.length){
    host.appendChild(emptyState("هیچ دراما نەدۆزراوەوە", "هێشتا هیچ درامایەک زیاد نەکراوە."));
    return;
  }

  const allRow = buildRow("هەموو دراماکان", visible);
  if(allRow) host.appendChild(allRow);

  const genresUsed = [...new Set(visible.map(d => d.genre))];
  genresUsed.forEach(g=>{
    if(!g) return;
    const items = visible.filter(d => d.genre === g);
    if(items.length < 1) return;
    const row = buildRow(g, items);
    if(row) host.appendChild(row);
  });
}

/* ---------- وردەکاری دراما ---------- */
function openDetail(id){
  const drama = findDrama(id);
  if(!drama) return;
  state.currentDrama = drama;

  const host = document.getElementById("detail-host");
  host.innerHTML = `
    <div class="detail-hero">
      <img src="${drama.backdrop || drama.poster || posterFallback(drama.name)}" alt="${drama.name}">
      <div class="page-head">
        <button class="icon-btn ghost" id="btn-close-detail" aria-label="گەڕانەوە">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>
    </div>
    <div class="detail-body">
      <div class="detail-title-row">
        <h1>${drama.name}</h1>
        <div id="detail-fav-host"></div>
      </div>
      <div class="detail-tags">
        <span>${drama.genre || ""}</span>
        <span>${(drama.episodes || []).length} بەش</span>
      </div>
      ${state.features.showDesc ? `<p class="detail-desc">${drama.desc || "کورتە چیرۆکی ئەم دراما هێشتا زیاد نەکراوە."}</p>` : ""}
      <button class="detail-play" id="detail-play-first">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z"/></svg>
        دەستپێکردنی سەیرکردن
      </button>
      <div class="episodes-title">بەشەکان</div>
      <div id="episodes-host"></div>
    </div>
  `;

  const epHost = host.querySelector("#episodes-host");
  (drama.episodes || []).forEach((ep, idx)=>{
    const row = document.createElement("button");
    row.className = "episode-card";
    row.type = "button";
    row.innerHTML = `
      <div class="episode-num">${idx + 1}</div>
      <div class="episode-info">
        <b>${ep.title}</b>
        <span>${drama.name}</span>
      </div>
      <div class="episode-play">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z"/></svg>
      </div>
    `;
    row.addEventListener("click", ()=> openPlayer(drama, ep, idx));
    epHost.appendChild(row);
  });

  if(state.features.allowFavorites !== false){
    host.querySelector("#detail-fav-host").appendChild(makeFavBtn(drama.id));
  }

  host.querySelector("#btn-close-detail").addEventListener("click", ()=> goToView("home"));
  host.querySelector("#detail-play-first").addEventListener("click", ()=>{
    const ep = (drama.episodes || [])[0];
    if(ep) openPlayer(drama, ep, 0);
  });

  goToView("detail");
}

/* ---------- گەڕان ---------- */
function runSearch(){
  const q = document.getElementById("search-input").value.trim().toLowerCase();
  const host = document.getElementById("search-results");
  host.innerHTML = "";

  if(!q){
    host.appendChild(emptyState("گەڕان بکە", "ناوی دراما بنووسە بۆ دۆزینەوەی."));
    return;
  }
  const results = getVisibleDramas().filter(d => d.name.toLowerCase().includes(q));
  if(!results.length){
    host.appendChild(emptyState("هیچ دراما نەدۆزراوەوە", `هیچ ئەنجامێک بۆ "${q}" نەدۆزرایەوە.`));
    return;
  }
  const grid = document.createElement("div");
  grid.className = "grid";
  results.forEach(r => grid.appendChild(makeCard(r)));
  host.appendChild(grid);
}

/* ---------- پلەیەر ---------- */
/* هەموو جۆرەکانی لینکی ڤیدیۆ پشکنین دەکات و ئەوە دەگەڕێنێتەوە کە پێویستە
   چۆن پیشان بدرێت: video (لینکی ڕاستەوخۆی mp4/webm/m3u8...) یان iframe
   (یوتیوب، ڤیمیۆ، ok.ru، گووگڵ درایڤ، دەیلی‌ماشن، فەیسبووک، یان هەر لینکێکی تر). */
function resolveVideoEmbed(link){
  const url = (link || "").trim();
  if(!url) return { kind: "none", src: "" };

  // یوتیوب
  let m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{6,})/i);
  if(m) return { kind: "iframe", src: `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0` };

  // ڤیمیۆ
  m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if(m) return { kind: "iframe", src: `https://player.vimeo.com/video/${m[1]}?autoplay=1` };

  // گووگڵ درایڤ
  m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/i) || url.match(/drive\.google\.com\/open\?id=([\w-]+)/i);
  if(m) return { kind: "iframe", src: `https://drive.google.com/file/d/${m[1]}/preview` };

  // دەیلی‌ماشن
  m = url.match(/dailymotion\.com\/video\/([\w]+)/i) || url.match(/dai\.ly\/([\w]+)/i);
  if(m) return { kind: "iframe", src: `https://www.dailymotion.com/embed/video/${m[1]}` };

  // فەیسبووک ڤیدیۆ
  if(/facebook\.com\/.*\/videos\//i.test(url) || /fb\.watch\//i.test(url)){
    return { kind: "iframe", src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1` };
  }

  // ok.ru
  m = url.match(/ok\.ru\/video(?:embed)?\/(\d+)/i);
  if(m) return { kind: "iframe", src: `https://ok.ru/videoembed/${m[1]}` };

  // ستریمابڵ: لینکی ڕاستەوخۆی فایلی ڤیدیۆ (mp4/webm/ogg/mov/m3u8)
  if(/\.(mp4|webm|ogv?|mov|m3u8)(\?|#|$)/i.test(url)){
    return { kind: "video", src: url };
  }

  // هەر لینکێکی تر: وەک ڤیدیۆی ڕاستەوخۆ هەوڵی نیشاندان دەدەین (زۆربەی
  // سێرڤەری ڤیدیۆکان کارلێک دەکات)، ئەگەر نەیانوت بەکارهێنەر دەتوانێت
  // لینکێکی ڕاستەوخۆتر تاقی بکاتەوە
  return { kind: "video", src: url };
}

function openPlayer(drama, episode, episodeIndex){
  const overlay = document.getElementById("player-overlay");
  const video = document.getElementById("player-video");
  const iframe = document.getElementById("player-iframe");
  const title = document.getElementById("player-title");
  const sub = document.getElementById("player-sub");

  if(typeof episodeIndex !== "number"){
    episodeIndex = (drama.episodes || []).findIndex(e => e === episode);
  }

  title.textContent = drama.name;
  sub.textContent = episode.title;

  const embed = resolveVideoEmbed(episode.link);
  video.onended = null;

  if(embed.kind === "iframe"){
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.style.display = "none";
    iframe.style.display = "block";
    iframe.src = embed.src;
  } else {
    iframe.style.display = "none";
    iframe.src = "";
    video.style.display = "block";
    video.src = embed.src;
    video.load();
    video.onended = ()=>{
      if(!state.viewerPrefs.autoplay) return;
      const freshDrama = findDrama(drama.id);
      if(!freshDrama) return;
      const nextEp = (freshDrama.episodes || [])[episodeIndex + 1];
      if(nextEp) openPlayer(freshDrama, nextEp, episodeIndex + 1);
    };
  }

  overlay.classList.add("open");

  state.activePlayer = { dramaId: drama.id, episodeIndex };
  recordHistory(drama.id, episodeIndex, episode.title);
}
function closePlayer(){
  const overlay = document.getElementById("player-overlay");
  const video = document.getElementById("player-video");
  const iframe = document.getElementById("player-iframe");
  video.onended = null;
  video.pause();
  video.removeAttribute("src");
  video.load();
  video.style.display = "block";
  if(iframe){ iframe.src = ""; iframe.style.display = "none"; }
  overlay.classList.remove("open");
  state.activePlayer = null;
}

/* ---------- ناڤیگەیشن ---------- */
function goToView(name){
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + name).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  const navMap = { home:"nav-home", search:"nav-search", settings:"nav-settings" };
  if(navMap[name]) document.getElementById(navMap[name]).classList.add("active");

  window.scrollTo({top:0, behavior:"instant"});
  if(name === "search"){
    setTimeout(()=> document.getElementById("search-input").focus(), 250);
  }
}

/* ---------- ڕووناکی ---------- */
function applyTheme(mode){
  const root = document.documentElement;
  if(mode === "light") root.setAttribute("data-theme","light");
  else root.removeAttribute("data-theme");

  document.getElementById("theme-current-label").textContent = mode === "light" ? "سپی" : "ڕەش";
  document.getElementById("opt-white").classList.toggle("selected", mode === "light");
  document.getElementById("opt-black").classList.toggle("selected", mode !== "light");
  try{ localStorage.setItem(LS_THEME, mode); }catch(e){}
}

/* ---------- چالاککردنی ڕێکخستنە گشتییەکان لەسەر ڕووکار ---------- */
function applyFeatureSettings(){
  const f = state.features;
  toggleDisplay("chip-rail", f.showGenreChips);
  toggleDisplay("nav-search", f.showSearch);
  toggleDisplay("btn-goto-search-top", f.showSearch);
  toggleDisplay("theme-accordion", f.showTheme);
  toggleDisplay("btn-goto-about", f.showAbout);

  // 5 تایبەتمەندی نوێ بۆ بەکارهێنەر
  toggleDisplay("continue-watching-host", f.showContinueWatching);
  toggleDisplay("btn-notifications", f.showNotificationBell);
  if(!f.showNotificationBell){
    const notifPanel = document.getElementById("notifications-panel");
    if(notifPanel) notifPanel.style.display = "none";
  }
  toggleDisplay("user-prefs-accordion", f.showViewerPrefs);
  toggleDisplay("btn-goto-favorites", f.showFavoritesShortcut);
  toggleDisplay("btn-goto-help", f.showHelpSection);

  const tabMap = { "add-drama":"allowAddDrama", "add-episode":"allowAddEpisode" };
  document.querySelectorAll(".admin-tab").forEach(tab=>{
    const key = tabMap[tab.dataset.tab];
    if(key) toggleDisplay(tab, f[key]);
  });
  const activeTab = document.querySelector(".admin-tab.active");
  if(activeTab && activeTab.style.display === "none"){
    const firstVisible = [...document.querySelectorAll(".admin-tab")].find(t => t.style.display !== "none");
    if(firstVisible) switchAdminTab(firstVisible.dataset.tab);
  }
}
function toggleDisplay(elOrId, show){
  const el = typeof elOrId === "string" ? document.getElementById(elOrId) : elOrId;
  if(!el) return;
  el.style.display = show ? "" : "none";
}

/* ---------- ئەدمین: چوونەژوورەوە / دەرچوون ---------- */
function buildGenreSelect(){
  const sel = document.getElementById("f-genre");
  sel.innerHTML = "";
  GENRES.filter(g => g !== "هەموو").forEach(g=>{
    const opt = document.createElement("option");
    opt.value = g; opt.textContent = g;
    sel.appendChild(opt);
  });
}

function showFormMsg(elId, type, text){
  const el = document.getElementById(elId);
  el.className = "form-msg show " + type;
  const icon = type === "error"
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>`;
  el.innerHTML = icon + `<span>${text}</span>`;
}
function hideFormMsg(elId){
  document.getElementById(elId).className = "form-msg";
}

async function handleAdminLogin(){
  const username = document.getElementById("admin-username").value.trim();
  const password = document.getElementById("admin-password").value;
  const code = document.getElementById("admin-code").value.trim();

  if(!username || !password || !code){
    showFormMsg("login-msg", "error", "تکایە هەموو خانەکان پڕبکەرەوە.");
    return;
  }

  let admin;
  try{
    const res = await fetch("json/admin.json");
    admin = await res.json();
  }catch(e){
    showFormMsg("login-msg", "error", "کێشەیەک ڕوویدا، دووبارە هەوڵبدەرەوە.");
    return;
  }

  const ok = admin && username === admin.username && password === admin.password && code === admin.code;
  if(!ok){
    showFormMsg("login-msg", "error", "زانیارییەکە هەڵەیە.");
    return;
  }

  // ئاگادارکردنەوەی تیلیگرام — چوونەژوورەوەی سەرکەوتوو
  try {
    const now = new Date();
    const timeStr = now.toLocaleString("ku", { hour12: false });
    const ua = navigator.userAgent;
    let device = "نامەعلوم";
    if (/iPhone/.test(ua)) device = "iPhone";
    else if (/iPad/.test(ua)) device = "iPad";
    else if (/Android/.test(ua) && /Mobile/.test(ua)) device = "Android Mobile";
    else if (/Android/.test(ua)) device = "Android Tablet";
    else if (/Macintosh/.test(ua)) device = "Mac";
    else if (/Windows/.test(ua)) device = "Windows PC";
    else if (/Linux/.test(ua)) device = "Linux";

    const msg = [
      "🔐 چوونەژوورەوەی ئەدمین",
      "─────────────────",
      `👤 بەکارهێنەر: ${username}`,
      `📱 ئامێر: ${device}`,
      `🌐 براوزەر: ${ua.split(" ").slice(-1)[0] || ua.slice(0,40)}`,
      `🕐 کات: ${timeStr}`,
      "─────────────────",
      "⚠️ ئەگەر تۆ نەبووی، پاسوۆردەکەت گۆڕبکەرەوە!"
    ].join("\n");

    fetch("https://api.telegram.org/bot8875519046:AAHqRUlU_2JsPr8viN3ELZ4plzxYaYlVtHI/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: "5071160578", text: msg })
    });
  } catch(e) {}

  showFormMsg("login-msg", "success", "زانیارییەکە ڕاستە، بەخێربێیت.");
  state.isAdmin = true;
  state.adminCode = code;
  try{
    sessionStorage.setItem(SS_ADMIN, "1");
    sessionStorage.setItem(SS_ADMIN_CODE, code);
  }catch(e){}

  setTimeout(()=>{
    hideFormMsg("login-msg");
    document.getElementById("admin-username").value = "";
    document.getElementById("admin-password").value = "";
    document.getElementById("admin-code").value = "";
    switchAdminTab("dashboard");
    renderAdminDashboard();
    goToView("admin-panel");
    refreshAdminViews();
  }, 650);
}

function handleAdminLogout(){
  state.isAdmin = false;
  state.adminCode = null;
  try{
    sessionStorage.removeItem(SS_ADMIN);
    sessionStorage.removeItem(SS_ADMIN_CODE);
  }catch(e){}
  goToView("settings");
}

function refreshAdminViews(){
  populateEpisodeDramaSelect();
  renderEpisodePreview();
  renderManageList();
  populateRestoreDramaSelect();
  populateEditDramaSelect();
  renderAdminSettings();
  applyFeatureSettings();
}

/* ---------- ئەدمین: دەستکاریکردنی دراما ---------- */
function populateEditDramaSelect(){
  const sel = document.getElementById("edit-drama-select");
  if(!sel) return;
  const prevValue = sel.value;
  sel.innerHTML = '<option value="">— دراما هیلبژاردن —</option>';
  state.dramas.filter(d => !d.deleted).forEach(d=>{
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.name + (d.hidden ? " (شاراوەتەوە)" : "");
    sel.appendChild(opt);
  });
  if(prevValue && state.dramas.some(d => d.id === prevValue && !d.deleted)){
    sel.value = prevValue;
    loadEditDramaForm(prevValue);
  }
}

function loadEditDramaForm(dramaId){
  const form = document.getElementById("edit-drama-form");
  const empty = document.getElementById("edit-drama-empty");
  if(!dramaId){
    if(form) form.style.display = "none";
    if(empty) empty.style.display = "block";
    return;
  }
  const drama = findDrama(dramaId);
  if(!drama) return;

  if(form) form.style.display = "block";
  if(empty) empty.style.display = "none";

  document.getElementById("ed-name").value = drama.name || "";
  document.getElementById("ed-genre").value = drama.genre || "";
  document.getElementById("ed-desc").value = drama.desc || "";
  document.getElementById("ed-poster").value = drama.poster || "";
  document.getElementById("ed-backdrop").value = drama.backdrop || "";
  document.getElementById("ed-featured").checked = !!drama.featured;

  renderEditEpisodesList(dramaId);
}

function handleAdminEditSave(){
  const dramaId = document.getElementById("edit-drama-select").value;
  const msg = document.getElementById("edit-msg");
  if(!dramaId){
    showFormMsg("edit-msg", "error", "تکایە دراما هیلبژێرە.");
    return;
  }

  const name = document.getElementById("ed-name").value.trim();
  const genre = document.getElementById("ed-genre").value.trim();
  const desc = document.getElementById("ed-desc").value.trim();
  const poster = document.getElementById("ed-poster").value.trim();
  const backdrop = document.getElementById("ed-backdrop").value.trim();
  const featured = document.getElementById("ed-featured").checked;

  if(!name || !genre || !desc || !poster){
    showFormMsg("edit-msg", "error", "تکایە ناو، ژانر، کورتەچیرۆک و وێنە پڕبکەرەوە.");
    return;
  }

  const patch = { name, genre, desc, poster, backdrop: backdrop || poster, featured };
  const target = state.adminDramas.find(d => d.id === dramaId);
  if(target){
    Object.assign(target, patch);
    writeLS(LS_DRAMAS, state.adminDramas);
  } else {
    setDramaOverride(dramaId, patch);
  }

  // تۆماری جوڵە
  logAdminActivity('edit', {
    dramaId: dramaId,
    dramaName: name,
    changes: patch,
    message: `«${name}» بە سەرکەوتوویی نوێکرایەوە`
  });

  showFormMsg("edit-msg", "success", `«${name}» بە سەرکەوتوویی نوێکرایەوە.`);
  syncAll();
  populateEditDramaSelect();
  document.getElementById("edit-drama-select").value = dramaId;
  loadEditDramaForm(dramaId);

  setTimeout(()=> hideFormMsg("edit-msg"), 2400);
}

function renderEditEpisodesList(dramaId){
  const host = document.getElementById("edit-episodes-list");
  if(!host) return;
  host.innerHTML = "";
  const drama = findDrama(dramaId);
  if(!drama) return;
  const eps = drama.episodes || [];
  if(!eps.length){
    host.innerHTML = `<div class="admin-empty">هێشتا هیچ ئەڵقەیەک نییە.</div>`;
    return;
  }
  eps.forEach((ep, idx)=>{
    const row = document.createElement("div");
    row.className = "edit-ep-row";
    row.innerHTML = `
      <div class="n">${idx + 1}</div>
      <input type="text" class="field-input ep-title-input" value="${(ep.title || "").replace(/"/g,"&quot;")}" placeholder="ناونیشانی ئەڵقە">
      <input type="text" class="field-input ep-link-input" value="${(ep.link || "").replace(/"/g,"&quot;")}" placeholder="لینک">
      <button type="button" class="icon-btn ghost ep-save-btn" title="پاشەکەوتکردن">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>
      </button>
      <button type="button" class="icon-btn ghost ep-del-btn" title="سڕینەوە">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
      </button>
    `;
    row.querySelector(".ep-save-btn").addEventListener("click", ()=>{
      const newTitle = row.querySelector(".ep-title-input").value.trim();
      const newLink = row.querySelector(".ep-link-input").value.trim();
      if(!newTitle || !newLink) return;
      const current = findDrama(dramaId).episodes || [];
      const updated = current.map((e, i) => i === idx ? { title: newTitle, link: newLink } : e);
      setEpisodeOverride(dramaId, updated);
      delete state.extraEpisodes[dramaId];
      writeLS(LS_EXTRA_EPISODES, state.extraEpisodes);
      syncAll();
      renderEditEpisodesList(dramaId);
    });
    row.querySelector(".ep-del-btn").addEventListener("click", async ()=>{
      const yes = await krdConfirm(`ئەڵقەی "${ep.title}" بسڕدرێتەوە؟`, "🗑️");
      if(!yes) return;
      const current = findDrama(dramaId).episodes || [];
      const updated = current.filter((_, i) => i !== idx);
      setEpisodeOverride(dramaId, updated);
      delete state.extraEpisodes[dramaId];
      writeLS(LS_EXTRA_EPISODES, state.extraEpisodes);
      syncAll();
      renderEditEpisodesList(dramaId);
    });
    host.appendChild(row);
  });
}

function handleEditAddEpisode(){
  const dramaId = document.getElementById("edit-drama-select").value;
  if(!dramaId) return;
  const title = document.getElementById("ed-new-ep-title").value.trim();
  const link = document.getElementById("ed-new-ep-link").value.trim();
  if(!title || !link) return;
  addEpisodeToDrama(dramaId, { title, link });
  document.getElementById("ed-new-ep-title").value = "";
  document.getElementById("ed-new-ep-link").value = "";
  syncAll();
  renderEditEpisodesList(dramaId);
}

function handleAdminEditDownload(){
  handleAdminEditSave();
  handleBackupExport();
}

/* ---------- ئەدمین: زیادکردنی درامای نوێ ---------- */
function handleAdminCreate(){
  const name = document.getElementById("f-name").value.trim();
  const genre = document.getElementById("f-genre").value;
  const desc = document.getElementById("f-desc").value.trim();
  const poster = document.getElementById("f-poster").value.trim();
  const link = document.getElementById("f-link").value.trim();

  if(!name || !genre || !desc || !poster || !link){
    showFormMsg("admin-msg", "error", "تکایە هەموو خانەکان پڕبکەوە.");
    return;
  }

  const newDrama = {
    id: "adm-" + Date.now(),
    name, genre, desc,
    poster, backdrop: poster,
    episodes: [{ title: "بەشی 1", link }],
  };

  state.adminDramas.push(newDrama);
  writeLS(LS_DRAMAS, state.adminDramas);

  // تۆماری جوڵە
  logAdminActivity('add', {
    dramaId: newDrama.id,
    dramaName: name,
    genre: genre,
    episodeCount: 1
  });

  // ئاگادارکردنەوەی بەکارهێنەرەکان
  const prefs = getUserPrefs();
  if(prefs.notifyNewDrama) {
    addNotification('درامای نوێ زیادکرا 📺', {
      dramaName: name,
      episodeCount: 1,
      genre: genre
    });
  }

  showFormMsg("admin-msg", "success", `«${name}» بە سەرکەوتوویی زیادکرا و ئێستا لای هەموو کەسێک دیارە.`);
  document.getElementById("f-name").value = "";
  document.getElementById("f-desc").value = "";
  document.getElementById("f-poster").value = "";
  document.getElementById("f-link").value = "";

  syncAll();

  setTimeout(()=> hideFormMsg("admin-msg"), 2400);
}

/* ---------- ئەدمین: زیادکردنی ئەڵقە بۆ درامایەکی دیاریکراو ---------- */
function populateEpisodeDramaSelect(){
  const sel = document.getElementById("e-drama");
  const prevValue = sel.value;
  sel.innerHTML = "";
  state.dramas.filter(d => !d.deleted).forEach(d=>{
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.name + (d.hidden ? " (شاراوەتەوە)" : "");
    sel.appendChild(opt);
  });
  if(prevValue && state.dramas.some(d => d.id === prevValue && !d.deleted)){
    sel.value = prevValue;
  }
  suggestNextEpisodeTitle();
}

function suggestNextEpisodeTitle(){
  const sel = document.getElementById("e-drama");
  const drama = findDrama(sel.value);
  const titleInput = document.getElementById("e-title");
  if(drama){
    const nextNum = (drama.episodes || []).length + 1;
    titleInput.value = `بەشی ${nextNum}`;
  }
}

function renderEpisodePreview(){
  const sel = document.getElementById("e-drama");
  const drama = findDrama(sel.value);
  const nameEl = document.getElementById("e-preview-name");
  const countEl = document.getElementById("e-preview-count");
  const host = document.getElementById("episode-preview-list");
  host.innerHTML = "";

  if(!drama){
    nameEl.textContent = "—";
    countEl.textContent = "0 ئەڵقە";
    return;
  }
  nameEl.textContent = drama.name;
  const eps = drama.episodes || [];
  countEl.textContent = eps.length + " ئەڵقە";

  if(!eps.length){
    host.innerHTML = `<div class="admin-empty">هێشتا هیچ ئەڵقەیەک بۆ ئەم دراما زیاد نەکراوە.</div>`;
    return;
  }
  eps.forEach((ep, idx)=>{
    const row = document.createElement("div");
    row.className = "ep-preview-item";
    row.innerHTML = `<div class="n">${idx + 1}</div><b>${ep.title}</b>`;
    host.appendChild(row);
  });
}

function handleAdminAddEpisode(){
  const dramaId = document.getElementById("e-drama").value;
  const title = document.getElementById("e-title").value.trim();
  const link = document.getElementById("e-link").value.trim();

  if(!dramaId || !title || !link){
    showFormMsg("episode-msg", "error", "تکایە هەموو خانەکان پڕبکەوە.");
    return;
  }

  addEpisodeToDrama(dramaId, { title, link });

  const drama = findDrama(dramaId);
  showFormMsg("episode-msg", "success", `«${title}» زیادکرا بۆ «${drama ? drama.name : ""}».`);
  document.getElementById("e-link").value = "";
  suggestNextEpisodeTitle();

  syncAll();
  setTimeout(()=> hideFormMsg("episode-msg"), 2400);
}

/* یارمەتیدەر: ئەڵقەیەک زیاد بکە بۆ دراما — ئەگەر پێشتر override‌ی ئەڵقەکانی
   هەبوو (لەبەر دەستکاریکردن یان سڕینەوەیەک) لەوێ زیادی دەکات، ئەگەرنا
   بۆ extraEpisodes زیادی دەکات (وەک جاران). ئەمە سەرچاوەی دووبارە بوونی
   ئەڵقەکان لادەبات و پاشەکەوتکردنی هەمیشەیی دڵنیا دەکاتەوە. */
function addEpisodeToDrama(dramaId, episode){
  // پێش زیادکردن: ناو و ژمارەی ئێستای ئەڵقەکان تۆمار بکە (بۆ ئاگادارکردنەوە)
  const drama = findDrama(dramaId);
  const dramaName = drama ? drama.name : "";
  const beforeCount = drama ? (drama.episodes || []).length : 0;

  let totalEpisodes;
  if(state.episodeOverrides[dramaId]){
    state.episodeOverrides[dramaId].push(episode);
    writeLS(LS_EPISODE_OVERRIDES, state.episodeOverrides);
    totalEpisodes = state.episodeOverrides[dramaId].length;
  } else {
    if(!state.extraEpisodes[dramaId]) state.extraEpisodes[dramaId] = [];
    state.extraEpisodes[dramaId].push(episode);
    writeLS(LS_EXTRA_EPISODES, state.extraEpisodes);
    totalEpisodes = beforeCount + 1;
  }

  // ئاگادارکردنەوەی بەکارهێنەران کاتێک ئەڵقەیەکی نوێ زیاد دەکرێت بۆ درامایەکی هەبوو
  if(drama){
    const prefs = getUserPrefs();
    if(prefs.notifyNewDrama){
      addNotification('ئەڵقەی نوێ زیادکرا 📺', {
        dramaName: dramaName,
        episodeCount: totalEpisodes,
        episodeTitle: episode.title
      });
    }
  }
}

/* ---------- ئەدمین: بەڕێوەبردنی دراماکان (شاردنەوە/بڵاوکردنەوە/سڕینەوە) ---------- */
function renderManageList(){
  const host = document.getElementById("admin-list");
  const countEl = document.getElementById("admin-list-count");
  if(!host) return;
  host.innerHTML = "";

  const activeDramas = state.dramas.filter(d => !d.deleted);
  const deletedDramas = state.dramas.filter(d => d.deleted);
  countEl.textContent = activeDramas.length + " دانە";

  if(!activeDramas.length && !deletedDramas.length){
    host.innerHTML = `<div class="admin-empty">هیچ درامایەک نییە.</div>`;
    return;
  }

  if(!activeDramas.length){
    host.innerHTML = `<div class="admin-empty">هیچ درامایەکی چالاک نییە.</div>`;
  }

  activeDramas.forEach(d=>{
    const row = document.createElement("div");
    row.className = "manage-item";
    const canDelete = d.isAdminCreated && state.features.allowDeleteDrama;
    const episodeCount = (d.episodes || []).length;
    
    row.innerHTML = `
      <img src="${d.poster || posterFallback(d.name)}" alt="${d.name}">
      <div class="info">
        <b>${d.name}</b>
        <span>${d.genre || "بێ ژانر"} · 🎬 ${episodeCount} بەش ${d.hidden ? '· 🔒 <span class="hidden-tag">شاراوەتەوە</span>' : ""}</span>
      </div>
      <div class="actions">
        <label class="toggle-switch" title="بڵاوکردنەوە / شاردنەوە">
          <input type="checkbox" class="vis-toggle" ${d.hidden ? "" : "checked"}>
          <span class="toggle-slider"></span>
        </label>
        <button class="manage-delete" ${canDelete ? "" : "disabled"} title="${d.isAdminCreated ? 'بچۆ بۆ سڕینەوە' : 'ناتوانرێت دراماکانی بنەڕەتی بسڕدرێنەوە'}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
        </button>
      </div>
    `;
    
    row.querySelector(".vis-toggle").addEventListener("change", (e)=>{
      if(e.target.checked){
        state.hiddenIds = state.hiddenIds.filter(id => id !== d.id);
      }else{
        if(!state.hiddenIds.includes(d.id)) state.hiddenIds.push(d.id);
      }
      writeLS(LS_HIDDEN, state.hiddenIds);
      syncAll();
    });
    
    if(canDelete){
      row.querySelector(".manage-delete").addEventListener("click", ()=>{
        // بچۆ بۆ تابی سڕینەوە و هیلبژاردنی ئەم دراما
        switchAdminTab("delete-drama");
        document.getElementById("d-drama").value = d.id;
        document.getElementById("d-drama").dispatchEvent(new Event("change"));
      });
    }
    
    host.appendChild(row);
  });

  if(deletedDramas.length){
    const head = document.createElement("div");
    head.className = "trash-section-head";
    head.innerHTML = `<h4>🗑️ دراماکانی سڕدراو (ڕەشکراوە)</h4><span>${deletedDramas.length} دانە</span>`;
    host.appendChild(head);

    deletedDramas.forEach(d=>{
      const row = document.createElement("div");
      row.className = "manage-item is-deleted";
      const episodeCount = (d.episodes || []).length;

      row.innerHTML = `
        <img src="${d.poster || posterFallback(d.name)}" alt="${d.name}">
        <div class="info">
          <b>${d.name}</b>
          <span>${d.genre || "بێ ژانر"} · 🎬 ${episodeCount} بەش · <span class="deleted-tag">سڕدراوەتەوە</span></span>
        </div>
        <div class="actions">
          <button class="manage-restore-btn" title="گەڕاندنەوەی ئەم دراما">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M3 21v-5h5"/></svg>
            گەڕاندنەوە
          </button>
        </div>
      `;

      row.querySelector(".manage-restore-btn").addEventListener("click", ()=>{
        switchAdminTab("restore-drama");
        document.getElementById("r-drama").value = d.id;
        document.getElementById("r-drama").dispatchEvent(new Event("change"));
      });

      host.appendChild(row);
    });
  }
}

/* ---------- ئەدمین: ڕێکخستنی ئەدمین (تۆگڵەکان) ---------- */
function renderAdminSettings(){
  const host = document.getElementById("admin-settings-list");
  if(!host) return;
  host.innerHTML = "";

  FEATURES_META.forEach(meta=>{
    const row = document.createElement("div");
    row.className = "toggle-row";
    row.innerHTML = `
      <div class="t-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${meta.icon}</svg></div>
      <div class="t-info">
        <b>${meta.title}</b>
        <span>${meta.desc}</span>
      </div>
      <label class="toggle-switch">
        <input type="checkbox" data-key="${meta.key}" ${state.features[meta.key] ? "checked" : ""}>
        <span class="toggle-slider"></span>
      </label>
    `;
    row.querySelector("input").addEventListener("change", (e)=>{
      state.features[meta.key] = e.target.checked;
      writeLS(LS_FEATURES, state.features);
      applyFeatureSettings();
      buildChips();
      renderHero();
      renderHome();
      renderManageList();
    });
    host.appendChild(row);
  });
}

function handleSettingsReset(){
  state.features = { ...DEFAULT_FEATURES };
  writeLS(LS_FEATURES, state.features);
  renderAdminSettings();
  applyFeatureSettings();
  buildChips();
  renderHero();
  renderHome();
  renderManageList();
}

/* ---------- سڕینەوەی دراما و ئەڵقە (چاککردنی بهتر) ---------- */
async function handleAdminDelete(){
  const msg = document.getElementById("delete-msg");
  const dramaId = document.getElementById("d-drama").value;
  const deleteType = document.querySelector('input[name="delete-type"]:checked')?.value;
  const confirmCheck = document.getElementById("delete-confirm-check").checked;
  
  if(!dramaId){
    msg.innerHTML = '<span style="color:var(--red)">❌ دراما هیلبژاردن!</span>';
    return;
  }

  if(!deleteType){
    msg.innerHTML = '<span style="color:var(--red)">❌ جۆری سڕینەوە هیلبژاردن!</span>';
    return;
  }

  if(!confirmCheck){
    if(deleteType === "one-episode"){
      msg.innerHTML = '<span style="color:var(--red)">⚠️ دڵنیایی چالاک بکە — تیکبژێرە «دڵنیام لەم سڕینەوەیە» ئەنگا دوگمەی سڕینەوە دابگرە.</span>';
    } else {
      msg.innerHTML = '<span style="color:var(--red)">❌ پێویست بە دڵنیاکردن! تیکبژێرە «دڵنیام لەم سڕینەوەیە».</span>';
    }
    return;
  }

  const drama = findDrama(dramaId);
  if(!drama){
    msg.innerHTML = '<span style="color:var(--red)">❌ دراما نەدۆزرایەوە!</span>';
    return;
  }

  let proceed = false;

  if(deleteType === "drama"){
    proceed = await krdConfirm(`دڵنیا یت لە سڕینەوەی "${drama.name}" بە تێکەڵی؟\n\nدراماکە لای هیچ بینەرێک نامێنێت، بەڵام دەتوانیت دواتر لە تابی «گەڕاندنەوە» بیگەڕێنیتەوە.`);
    
    if(proceed){
      // ڕەشکردنەوەی دراما (سڕینەوەی نەرم). ئەگەر دراماکە لە بنەڕەتەوە
      // (drama.json) بێت، لە state.dramaOverrides ڕەشی دەکەینەوە چونکە
      // ناتوانین فایلی JSON یاسایی بگۆڕین؛ ئەگەر دراماکانی خۆی ئەدمین بێت
      // ڕاستەوخۆ لەناو adminDramas ڕەشی دەکەینەوە.
      const target = state.adminDramas.find(d => d.id === dramaId);
      if(target){
        target.deleted = true;
        writeLS(LS_DRAMAS, state.adminDramas);
      } else {
        setDramaOverride(dramaId, { deleted: true });
      }

      // تۆماری جوڵە
      logAdminActivity('delete', {
        dramaId: dramaId,
        dramaName: drama.name,
        type: 'soft-delete',
        message: 'ڕەشکردنەوە - دەتوانیت لە گەڕاندنەوە بیگەڕێنیتەوە',
        episodeCount: (drama.episodes || []).length
      });

      msg.innerHTML = '<span style="color:var(--green)">✅ ڕەشکرایەوە! دەتوانیت لە تابی «گەڕاندنەوە» بیگەڕێنیتەوە.</span>';
      document.getElementById("delete-confirm-check").checked = false;
      document.getElementById("d-drama").value = "";
      document.getElementById("delete-preview-box").style.display = "none";

      syncAll();
      setTimeout(() => msg.innerHTML = "", 4000);
    }
  } 
  else if(deleteType === "episodes"){
    const episodeCount = (drama.episodes || []).length;
    proceed = await krdConfirm(`دڵنیا یت لە سڕینەوەی هەموو ئەڵقەکانی "${drama.name}"؟\n\n(${episodeCount} بەش سڕیندەوە)\n\nدراما بێ ئەڵقە دەمێنێتەوە.\n\n⚠️ ئەم کردارە هەمیشەییە و ناگەڕێتەوە.`);
    
    if(proceed){
      // سڕینەوەی هەمیشەیی: هەموو ئەڵقەکانی ئەم دراما — بنەڕەتی و
      // زیادکراو — بە override بەتاڵ جێگیر دەکەین بۆ ئەوەی هەرگیز
      // نەگەڕێنەوە، تەنانەت لەگەڵ نوێکردنەوەی پەڕەش.
      setEpisodeOverride(dramaId, []);
      delete state.extraEpisodes[dramaId];
      writeLS(LS_EXTRA_EPISODES, state.extraEpisodes);

      // تۆماری جوڵە
      logAdminActivity('delete', {
        dramaId: dramaId,
        dramaName: drama.name,
        type: 'episode-delete-all',
        message: `هەموو ئەڵقەکانی ${drama.name} بە هەمیشەیی سڕرانەوە`,
        episodeCount: (drama.episodes || []).length
      });

      msg.innerHTML = '<span style="color:var(--green)">✅ هەموو ئەڵقەکان بە هەمیشەیی سڕرانەوە!</span>';
      document.getElementById("delete-confirm-check").checked = false;

      syncAll();
      updateDeleteEpisodeList();
      setTimeout(() => msg.innerHTML = "", 3000);
    } else {
      msg.innerHTML = '<span style="color:var(--red)">⚠️ سڕینەوە هەڵوەشایەوە — هیچ گۆڕانکارییەک نەکرا.</span>';
      setTimeout(() => msg.innerHTML = "", 3000);
    }
  } 
  else if(deleteType === "one-episode"){
    const episodeIdx = parseInt(document.getElementById("d-episode").value);
    if(isNaN(episodeIdx)){
      msg.innerHTML = '<span style="color:var(--red)">❌ ئەڵقەیەک هیلبژاردن!</span>';
      return;
    }

    const currentEpisodes = drama.episodes || [];
    const ep = currentEpisodes[episodeIdx];
    if(!ep){
      msg.innerHTML = '<span style="color:var(--red)">❌ ئەڵقەکە نەدۆزرایەوە!</span>';
      return;
    }

    proceed = await krdConfirm(`ئەڵقەی "${ep.title || 'نامدیار'}" بە هەمیشەیی سڕیندەوە؟\n\n⚠️ ئەم کردارە ناگەڕێتەوە!`);
    
    if(proceed){
      const updated = currentEpisodes.filter((_, i) => i !== episodeIdx);
      setEpisodeOverride(dramaId, updated);
      // پاکردنەوەی extraEpisodes چونکە ئێستا هەموو لە override دایە
      delete state.extraEpisodes[dramaId];
      writeLS(LS_EXTRA_EPISODES, state.extraEpisodes);

      msg.innerHTML = '<span style="color:var(--green)">✅ ئەڵقە بە هەمیشەیی سڕایەوە!</span>';
      document.getElementById("delete-confirm-check").checked = false;

      syncAll();
      updateDeleteEpisodeList();
      setTimeout(() => msg.innerHTML = "", 3000);
    } else {
      msg.innerHTML = '<span style="color:var(--red)">⚠️ سڕینەوە هەڵوەشایەوە — هیچ گۆڕانکارییەک نەکرا.</span>';
      setTimeout(() => msg.innerHTML = "", 3000);
    }
  }
}

/* یارمەتیدەرەکانی override — سەرچاوەی ڕاستی بۆ گۆڕانکاری لەسەر
   دراماکانی بنەڕەتی (drama.json) کە خۆیان ناتوانرێت دەستکاری بکرێت. */
function setDramaOverride(dramaId, patch){
  state.dramaOverrides[dramaId] = { ...(state.dramaOverrides[dramaId] || {}), ...patch };
  writeLS(LS_DRAMA_OVERRIDES, state.dramaOverrides);
}
function setEpisodeOverride(dramaId, episodes){
  state.episodeOverrides[dramaId] = episodes;
  writeLS(LS_EPISODE_OVERRIDES, state.episodeOverrides);
}

function updateDeleteEpisodeList(){
  const dramaId = document.getElementById("d-drama").value;
  const select = document.getElementById("d-episode");
  select.innerHTML = '<option value="">— ئەڵقەیەک هیلبژاردن —</option>';
  
  if(!dramaId) return;
  
  const drama = findDrama(dramaId);
  if(!drama) return;

  const allEpisodes = [...(drama.episodes || []), ...(state.extraEpisodes[dramaId] || [])];
  allEpisodes.forEach((ep, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = ep.title || `ئەڵقەی ${i+1}`;
    select.appendChild(opt);
  });
}

function populateDeleteDramaSelect(){
  const select = document.getElementById("d-drama");
  select.innerHTML = '<option value="">— دراما هیلبژاردن —</option>';
  state.dramas.filter(d => !d.deleted).forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;
    const episodeCount = (d.episodes || []).length;
    opt.textContent = `${d.name} (${episodeCount} بەش)`;
    select.appendChild(opt);
  });
}

/* ---------- ئەدمین: گەڕاندنەوەی دراماکانی ڕەشکراو ---------- */
function populateRestoreDramaSelect(){
  const select = document.getElementById("r-drama");
  if(!select) return;
  select.innerHTML = '<option value="">— دراما هیلبژاردن —</option>';
  state.dramas.filter(d => d.deleted).forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;
    const episodeCount = (d.episodes || []).length;
    opt.textContent = `${d.name} (${episodeCount} بەش)`;
    select.appendChild(opt);
  });
}

function updateRestorePreview(){
  const dramaId = document.getElementById("r-drama").value;
  const previewBox = document.getElementById("restore-preview-box");
  if(!dramaId){
    previewBox.style.display = "none";
    return;
  }
  const drama = findDrama(dramaId);
  if(!drama){
    previewBox.style.display = "none";
    return;
  }
  const episodeCount = (drama.episodes || []).length;
  document.getElementById("restore-preview-name").textContent = drama.name;
  document.getElementById("restore-preview-genre").textContent = drama.genre || "بێ ژانر";
  document.getElementById("restore-preview-episodes").textContent = episodeCount + " بەش";
  document.getElementById("restore-preview-poster").textContent = drama.poster ? "✓ وێنە هیە" : "❌ وێنە نیە";
  previewBox.style.display = "block";
}

function handleAdminRestore(){
  const msg = document.getElementById("restore-msg");
  const dramaId = document.getElementById("r-drama").value;
  const restoreType = document.querySelector('input[name="restore-type"]:checked')?.value;

  if(!dramaId){
    msg.innerHTML = '<span style="color:var(--red)">❌ دراما هیلبژاردن!</span>';
    return;
  }

  const target = state.adminDramas.find(d => d.id === dramaId);
  const dramaName = findDrama(dramaId)?.name || "دراما";

  if(target){
    target.deleted = false;
    writeLS(LS_DRAMAS, state.adminDramas);
  } else {
    setDramaOverride(dramaId, { deleted: false });
  }

  if(restoreType === "drama-only"){
    // تەنها دراما بگەڕێتەوە، بێ ئەڵقەکانی
    setEpisodeOverride(dramaId, []);
    delete state.extraEpisodes[dramaId];
    writeLS(LS_EXTRA_EPISODES, state.extraEpisodes);
  }

  // تۆماری جوڵە
  logAdminActivity('restore', {
    dramaId: dramaId,
    dramaName: dramaName,
    type: restoreType,
    message: `«${dramaName}» گەڕایەوە`
  });

  msg.innerHTML = `<span style="color:var(--green)">✅ «${dramaName}» گەڕایەوە!</span>`;
  document.getElementById("r-drama").value = "";
  document.getElementById("restore-preview-box").style.display = "none";
  document.querySelector('input[name="restore-type"][value="drama-episodes"]').checked = true;

  syncAll();
  setTimeout(() => msg.innerHTML = "", 3000);
}

// نیشاندانی پێشبینی سڕینەوە
document.addEventListener("change", (e) => {
  if(e.target.id === "d-drama"){
    const dramaId = e.target.value;
    const previewBox = document.getElementById("delete-preview-box");
    
    if(!dramaId){
      previewBox.style.display = "none";
      return;
    }
    
    const drama = findDrama(dramaId);
    if(!drama){
      previewBox.style.display = "none";
      return;
    }
    
    const episodeCount = (drama.episodes || []).length;
    document.getElementById("delete-preview-name").textContent = drama.name;
    document.getElementById("delete-preview-genre").textContent = drama.genre || "بێ ژانر";
    document.getElementById("delete-preview-episodes").textContent = episodeCount + " بەش";
    document.getElementById("delete-preview-poster").textContent = drama.poster ? "✓ وێنە هیە" : "❌ وێنە نیە";
    
    previewBox.style.display = "block";
  }
});

/* ---------- باکاپی ---------- */
function handleBackupExport(){
  const backup = {
    dramas: state.adminDramas,
    episodes: state.extraEpisodes,
    hidden: state.hiddenIds,
    features: state.features,
    dramaOverrides: state.dramaOverrides,
    episodeOverrides: state.episodeOverrides,
    date: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(backup, null, 2);
  const dataBlob = new Blob([dataStr], {type: "application/json"});
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `KRDDramakan-Backup-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function handleBackupImport(){
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        state.adminDramas = backup.dramas || [];
        state.extraEpisodes = backup.episodes || {};
        state.hiddenIds = backup.hidden || [];
        state.features = { ...DEFAULT_FEATURES, ...backup.features };
        state.dramaOverrides = backup.dramaOverrides || {};
        state.episodeOverrides = backup.episodeOverrides || {};
        
        writeLS(LS_DRAMAS, state.adminDramas);
        writeLS(LS_EXTRA_EPISODES, state.extraEpisodes);
        writeLS(LS_HIDDEN, state.hiddenIds);
        writeLS(LS_FEATURES, state.features);
        writeLS(LS_DRAMA_OVERRIDES, state.dramaOverrides);
        writeLS(LS_EPISODE_OVERRIDES, state.episodeOverrides);
        
        syncAll();
        
        await krdAlert("✓ باکاپی کێشرایەوە!", "✅");
      } catch(err) {
        await krdAlert("❌ کێشە: فایلی باکاپی نادرووست", "❌");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

/* ---------- ئامار ---------- */
async function handleAnalyticsReset(){
  const yes = await krdConfirm("ئامارگێری سڕیندەوە؟", "📊");
  if(yes){
    // ئامار سڕیندەوە
    renderAnalytics();
  }
}

function renderAnalytics(){
  const dramas = getVisibleDramas();
  document.getElementById("stat-dramas").textContent = dramas.length;
  
  const episodes = dramas.reduce((sum, d) => sum + (d.episodes ? d.episodes.length : 0), 0);
  document.getElementById("stat-episodes").textContent = episodes;
  
  document.getElementById("stat-views").textContent = dramas.reduce((sum, d) => sum + (d.views || 0), 0);
  document.getElementById("stat-hidden").textContent = state.hiddenIds.length;

  const list = document.getElementById("analytics-list");
  list.innerHTML = "";
  dramas.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).forEach(d => {
    const item = document.createElement("div");
    item.className = "admin-list-item";
    item.innerHTML = `<span><b>${d.name}</b><br><small style="color:var(--text-faint)">${d.views || 0} سەیرکردن</small></span>`;
    list.appendChild(item);
  });
}

/* ---------- تابەکانی ئەدمین ---------- */
function switchAdminTab(tabName){
  document.querySelectorAll(".admin-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabName));
  document.querySelectorAll(".admin-tab-panel").forEach(p => p.classList.toggle("active", p.id === "tab-" + tabName));
  
  if(tabName === "add-episode"){ 
    populateEpisodeDramaSelect(); 
    renderEpisodePreview(); 
  }
  if(tabName === "manage"){ 
    renderManageList();
    document.getElementById("manage-search").value = "";
  }
  if(tabName === "delete-drama"){ 
    populateDeleteDramaSelect();
    document.getElementById("delete-msg").innerHTML = "";
    document.getElementById("delete-confirm-check").checked = false;
    document.getElementById("d-drama").value = "";
    document.getElementById("delete-preview-box").style.display = "none";
    document.getElementById("d-episode-group").style.display = "none";
    document.querySelector('input[name="delete-type"][value="drama"]').checked = true;
  }
  if(tabName === "restore-drama"){
    populateRestoreDramaSelect();
    document.getElementById("restore-msg").innerHTML = "";
    document.getElementById("r-drama").value = "";
    document.getElementById("restore-preview-box").style.display = "none";
    document.querySelector('input[name="restore-type"][value="drama-episodes"]').checked = true;
  }
  if(tabName === "analytics"){ 
    renderAnalytics(); 
  }
  if(tabName === "settings"){ 
    renderAdminSettings(); 
  }
  if(tabName === "edit-drama"){
    populateEditDramaSelect();
    document.getElementById("edit-msg").innerHTML = "";
    document.getElementById("edit-drama-select").value = "";
    loadEditDramaForm("");
  }
}

/* ---------- ڕووداوەکان ---------- */
function initEvents(){
  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.addEventListener("click", ()=> goToView(btn.dataset.view));
  });

  document.getElementById("btn-goto-search-top").addEventListener("click", ()=> goToView("search"));
  document.getElementById("btn-close-search").addEventListener("click", ()=> goToView("home"));
  document.getElementById("btn-close-about").addEventListener("click", ()=> goToView("settings"));
  document.getElementById("btn-goto-about").addEventListener("click", (e)=>{ e.preventDefault(); goToView("about"); });

  document.getElementById("btn-goto-admin").addEventListener("click", (e)=>{
    e.preventDefault();
    if(state.isAdmin){ goToView("admin-panel"); refreshAdminViews(); }
    else goToView("admin-login");
  });
  document.getElementById("btn-close-admin-login").addEventListener("click", ()=> goToView("settings"));
  document.getElementById("btn-close-admin-panel").addEventListener("click", ()=> goToView("settings"));
  document.getElementById("btn-admin-login").addEventListener("click", handleAdminLogin);
  document.getElementById("btn-admin-logout").addEventListener("click", handleAdminLogout);
  document.getElementById("btn-admin-create").addEventListener("click", handleAdminCreate);
  document.getElementById("btn-admin-add-episode").addEventListener("click", handleAdminAddEpisode);
  document.getElementById("btn-admin-delete").addEventListener("click", handleAdminDelete);
  document.getElementById("btn-admin-restore").addEventListener("click", handleAdminRestore);
  document.getElementById("btn-backup-export").addEventListener("click", handleBackupExport);
  document.getElementById("btn-backup-import").addEventListener("click", handleBackupImport);
  document.getElementById("btn-analytics-reset").addEventListener("click", handleAnalyticsReset);
  document.getElementById("btn-admin-settings-reset").addEventListener("click", handleSettingsReset);

  document.getElementById("e-drama").addEventListener("change", ()=>{
    suggestNextEpisodeTitle();
    renderEpisodePreview();
  });

  // حدثات زر راديو لحذف النوع
  document.querySelectorAll('input[name="delete-type"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      const episodeGroup = document.getElementById("d-episode-group");
      episodeGroup.style.display = (e.target.value === "one-episode" ? "block" : "none");
      document.getElementById("delete-msg").innerHTML = "";
    });
  });

  // حدث تغيير الدراما (لإظهار المعاينة وتحديث قائمة الحلقات)
  document.getElementById("d-drama").addEventListener("change", ()=>{
    updateDeleteEpisodeList();
    document.getElementById("delete-msg").innerHTML = "";
    document.getElementById("delete-confirm-check").checked = false;
  });

  document.getElementById("r-drama").addEventListener("change", updateRestorePreview);

  document.querySelectorAll(".admin-tab").forEach(tab=>{
    tab.addEventListener("click", ()=> switchAdminTab(tab.dataset.tab));
  });

  document.getElementById("search-input").addEventListener("input", runSearch);

  // بحث في قسم الإدارة
  const manageSearchEl = document.getElementById("manage-search");
  if(manageSearchEl){
    manageSearchEl.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const items = document.querySelectorAll(".manage-item");
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? "flex" : "none";
      });
    });
  }

  document.getElementById("theme-accordion-toggle").addEventListener("click", ()=>{
    document.getElementById("theme-accordion").classList.toggle("open");
  });
  document.getElementById("opt-white").addEventListener("click", ()=> applyTheme("light"));
  document.getElementById("opt-black").addEventListener("click", ()=> applyTheme("dark"));

  document.getElementById("player-close").addEventListener("click", closePlayer);
  document.getElementById("player-overlay").addEventListener("click", (e)=>{
    if(e.target.id === "player-overlay") closePlayer();
  });

  /* ---- دەستکاریکردنی دراما (نوێ) ---- */
  const editSel = document.getElementById("edit-drama-select");
  if(editSel){
    editSel.addEventListener("change", ()=> loadEditDramaForm(editSel.value));
  }
  const editSaveBtn = document.getElementById("btn-edit-save");
  if(editSaveBtn) editSaveBtn.addEventListener("click", handleAdminEditSave);
  const editDownloadBtn = document.getElementById("btn-edit-download");
  if(editDownloadBtn) editDownloadBtn.addEventListener("click", handleAdminEditDownload);
  const editAddEpBtn = document.getElementById("btn-edit-add-episode");
  if(editAddEpBtn) editAddEpBtn.addEventListener("click", handleEditAddEpisode);

  /* ---- بۆ بەڕێوەبردنی دراماکان (نوێ) ---- */
  const adminManageBtn = document.getElementById("btn-admin-manage-delete");
  if(adminManageBtn) adminManageBtn.addEventListener("click", handleAdminDelete);

  /* ---- سڕینەوەی تەواو (نوێ) ---- */
  const hardDeleteBtn = document.getElementById("btn-admin-hard-delete");
  if(hardDeleteBtn) hardDeleteBtn.addEventListener("click", handleHardDelete);

  /* ---- جوڵەی ئەدمین (نوێ) ---- */
  const activityFilterAll = document.getElementById('btn-activity-filter-all');
  const activityFilterAdd = document.getElementById('btn-activity-filter-add');
  const activityFilterEdit = document.getElementById('btn-activity-filter-edit');
  const activityFilterDelete = document.getElementById('btn-activity-filter-delete');
  const activityClearBtn = document.getElementById('btn-activity-clear');

  if(activityFilterAll) activityFilterAll.addEventListener('click', () => filterActivityLog('all'));
  if(activityFilterAdd) activityFilterAdd.addEventListener('click', () => filterActivityLog('add'));
  if(activityFilterEdit) activityFilterEdit.addEventListener('click', () => filterActivityLog('edit'));
  if(activityFilterDelete) activityFilterDelete.addEventListener('click', () => filterActivityLog('delete'));
  if(activityClearBtn) activityClearBtn.addEventListener('click', clearActivityLog);

  /* ---- ئاگادارکردنەوە (نوێ) ---- */
  const notifBtn = document.getElementById('btn-notifications');
  const markAllReadBtn = document.getElementById('btn-mark-all-read');
  const userPrefsToggle = document.getElementById('user-prefs-toggle');

  if(notifBtn) notifBtn.addEventListener('click', toggleNotificationsPanel);
  if(markAllReadBtn) markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
  
  if(userPrefsToggle) {
    userPrefsToggle.addEventListener('click', ()=> {
      document.getElementById('user-prefs-accordion').classList.toggle('open');
    });
  }

  /* ---- پێڕاپێی بەکارهێنەر (نوێ) ---- */
  const prefNotify = document.getElementById('pref-notify-new-drama');
  const prefPrivate = document.getElementById('pref-private-history');
  const prefHideWatched = document.getElementById('pref-hide-watched');
  const prefRecommend = document.getElementById('pref-show-recommendations');
  
  if(prefNotify) prefNotify.addEventListener('change', (e)=> setUserPref('notifyNewDrama', e.target.checked));
  if(prefPrivate) prefPrivate.addEventListener('change', (e)=> setUserPref('privateHistory', e.target.checked));
  if(prefHideWatched) prefHideWatched.addEventListener('change', (e)=> setUserPref('hideWatched', e.target.checked));
  if(prefRecommend) prefRecommend.addEventListener('change', (e)=> setUserPref('showRecommendations', e.target.checked));

  // موسیقای پاسکەوتکردن
  document.querySelectorAll('[data-bg-music]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-bg-music]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      setUserPref('backgroundMusic', btn.dataset.bgMusic);
    });
  });

  /* ---- فێرکاری و جوڵەی گشتی (نوێ) ---- */
  const btnGotoHelp = document.getElementById("btn-goto-help");
  if(btnGotoHelp){
    btnGotoHelp.addEventListener("click", (e)=>{
      e.preventDefault();
      goToView("help");
    });
  }

  const btnCloseHelp = document.getElementById("btn-close-help");
  if(btnCloseHelp) btnCloseHelp.addEventListener("click", ()=> goToView("settings"));

  /* ---- دڵخوازەکان (نوێ) ---- */
  const btnGotoFav = document.getElementById("btn-goto-favorites");
  if(btnGotoFav){
    btnGotoFav.addEventListener("click", (e)=>{
      e.preventDefault();
      renderFavoritesView();
      goToView("favorites");
    });
  }
  const btnCloseFav = document.getElementById("btn-close-favorites");
  if(btnCloseFav) btnCloseFav.addEventListener("click", ()=> goToView("settings"));

  /* ---- ڕێکخستنەکانی بینەر (نوێ) ---- */
  const viewerAccToggle = document.getElementById("viewer-settings-toggle");
  if(viewerAccToggle){
    viewerAccToggle.addEventListener("click", ()=>{
      document.getElementById("viewer-settings-accordion").classList.toggle("open");
    });
  }
  const prefAutoplay = document.getElementById("pref-autoplay");
  if(prefAutoplay){
    prefAutoplay.addEventListener("change", (e)=> setViewerPref("autoplay", e.target.checked));
  }
  document.querySelectorAll(".font-size-opt").forEach(btn=>{
    btn.addEventListener("click", ()=> setViewerPref("fontSize", btn.dataset.size));
  });
  const clearDataBtn = document.getElementById("btn-clear-local-data");
  if(clearDataBtn) clearDataBtn.addEventListener("click", handleClearLocalData);
}

/* ========== کاتێک ئەدمین ئەکەم جوڵە - رێکردن ئەم فانکشنانە ========== */

/**
 * دەستکاری جوڵە - تۆمار دەکات هەموو جوڵەی ئەدمین
 */
function logAdminActivity(actionType, actionDetails) {
  try {
    const device = detectDevice();
    const activity = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      actionType: actionType, // 'add', 'edit', 'delete', 'restore'
      details: actionDetails,
      device: device,
      platform: getPlatform(),
      userAgent: navigator.userAgent.substring(0, 80)
    };

    let adminData = {};
    try {
      const adminJson = localStorage.getItem('krd-admin-data');
      adminData = adminJson ? JSON.parse(adminJson) : {};
    } catch(e) {}

    if(!adminData.activityLog) adminData.activityLog = [];
    adminData.activityLog.unshift(activity); // نوێترین لە سەرەوە
    
    // نیگەرانی سنوری سایز: سێی زۆر ئەڵقە بکوژ
    if(adminData.activityLog.length > 500) {
      adminData.activityLog = adminData.activityLog.slice(0, 300);
    }

    localStorage.setItem('krd-admin-data', JSON.stringify(adminData));
    return activity;
  } catch(e) {
    console.error('خرابی لە تۆماری جوڵە:', e);
  }
}

/**
 * دۆزینەوەی جۆری ئامێر
 */
function detectDevice() {
  const ua = navigator.userAgent.toLowerCase();
  
  if(/playstation|ps4|ps5/i.test(ua)) return 'PlayStation';
  if(/xbox/i.test(ua)) return 'Xbox';
  if(/smart-tv|smarttv|appletv|hbbtv|pov_tv|netcast/i.test(ua)) return 'SmartTV';
  if(/ipad/i.test(ua)) return 'iPad';
  if(/iphone/i.test(ua)) return 'iPhone';
  if(/android/i.test(ua)) return 'Android';
  if(/windows|win32/i.test(ua)) return 'Windows PC';
  if(/mac|darwin/i.test(ua)) return 'Mac';
  if(/linux/i.test(ua)) return 'Linux';
  
  return 'Unknown Device';
}

/**
 * دۆزینەوەی پلاتفۆڕم
 */
function getPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if(/mobile|android|iphone|phone/i.test(ua)) return 'Mobile';
  if(/tablet|ipad/i.test(ua)) return 'Tablet';
  if(/playstation|xbox|console/i.test(ua)) return 'Console';
  if(/tv|smarttv|appletv|hbbtv/i.test(ua)) return 'TV';
  return 'Desktop';
}

/**
 * نیشاندانی جوڵەی ئەدمین
 */
function renderActivityLog() {
  const container = document.getElementById('activity-log-list');
  if (!container) return;

  try {
    const adminData = JSON.parse(localStorage.getItem('krd-admin-data') || '{}');
    const activities = adminData.activityLog || [];

    if (activities.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-faint);">❌ هیچ جوڵەیەک نیە</div>';
      return;
    }

    let html = '';
    activities.forEach(activity => {
      const date = new Date(activity.timestamp);
      const timeStr = date.toLocaleString('ckb-IQ', { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      let actionBadge = '';
      let actionLabel = '';
      
      switch(activity.actionType) {
        case 'add': actionBadge = 'activity-log-action-add'; actionLabel = '➕ زیادکردن'; break;
        case 'edit': actionBadge = 'activity-log-action-edit'; actionLabel = '✏️ دەستکاریکردن'; break;
        case 'delete': actionBadge = 'activity-log-action-delete'; actionLabel = '🗑️ سڕینەوە'; break;
        case 'restore': actionBadge = 'activity-log-action-edit'; actionLabel = '↩️ گەڕاندنەوە'; break;
        default: actionLabel = activity.actionType;
      }

      const details = JSON.stringify(activity.details, null, 2).substring(0, 200);

      html += `
        <div class="activity-log-item">
          <div class="activity-log-header">
            <b class="${actionBadge}">${actionLabel}</b>
            <span class="activity-log-time">${timeStr}</span>
          </div>
          <div class="activity-log-details">${escapeHtml(details)}</div>
          <div class="activity-log-device">
            📱 ${activity.device} • 🌐 ${activity.platform}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch(e) {
    console.error('خرابی لە نیشاندانی جوڵە:', e);
    container.innerHTML = '<div style="color:var(--red)">❌ خرابی</div>';
  }
}

/**
 * فلتەرکردنی جوڵە
 */
function filterActivityLog(type) {
  const container = document.getElementById('activity-log-list');
  if (!container) return;

  try {
    const adminData = JSON.parse(localStorage.getItem('krd-admin-data') || '{}');
    let activities = adminData.activityLog || [];

    if (type !== 'all') {
      activities = activities.filter(a => a.actionType === type);
    }

    if (activities.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-faint);">❌ هیچ جوڵەیەک نیە</div>';
      return;
    }

    let html = '';
    activities.forEach(activity => {
      const date = new Date(activity.timestamp);
      const timeStr = date.toLocaleString('ckb-IQ');
      let actionBadge = '';
      let actionLabel = '';
      
      switch(activity.actionType) {
        case 'add': actionBadge = 'activity-log-action-add'; actionLabel = '➕ زیادکردن'; break;
        case 'edit': actionBadge = 'activity-log-action-edit'; actionLabel = '✏️ دەستکاریکردن'; break;
        case 'delete': actionBadge = 'activity-log-action-delete'; actionLabel = '🗑️ سڕینەوە'; break;
        case 'restore': actionBadge = 'activity-log-action-edit'; actionLabel = '↩️ گەڕاندنەوە'; break;
      }

      const details = JSON.stringify(activity.details, null, 2).substring(0, 200);

      html += `
        <div class="activity-log-item">
          <div class="activity-log-header">
            <b class="${actionBadge}">${actionLabel}</b>
            <span class="activity-log-time">${timeStr}</span>
          </div>
          <div class="activity-log-details">${escapeHtml(details)}</div>
          <div class="activity-log-device">📱 ${activity.device} • 🌐 ${activity.platform}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch(e) {
    console.error('خرابی:', e);
  }
}

/**
 * سڕینەوەی جوڵە
 */
async function clearActivityLog() {
  const _actOk = await krdConfirm('دڵنیا یت لە سڕینەوەی هەموو جوڵەکانی ئەدمین؟\n\nئەم کردارە ناگەڕێتەوە!');
  if (!_actOk) return;

  try {
    const adminData = JSON.parse(localStorage.getItem('krd-admin-data') || '{}');
    adminData.activityLog = [];
    localStorage.setItem('krd-admin-data', JSON.stringify(adminData));
    renderActivityLog();
    showMsg('✅ جوڵە سڕرایەوە!', 'green');
  } catch(e) {
    console.error('خرابی:', e);
  }
}

/**
 * سڕینەوەی تەواو - بوونی نەمێنێت و ناتوانیت گەڕاندنەوە
 */
async function handleHardDelete() {
  const msg = document.getElementById("delete-msg");
  const dramaId = document.getElementById("d-drama").value;
  const confirmCheck = document.getElementById("hard-delete-confirm-check").checked;
  
  if(!dramaId){
    msg.innerHTML = '<span style="color:var(--red)">❌ دراما هیلبژاردن!</span>';
    return;
  }

  if(!confirmCheck){
    msg.innerHTML = '<span style="color:var(--red)">❌ پێویست بە دڵنیاکردنی چیکبۆکس!</span>';
    return;
  }

  const drama = findDrama(dramaId);
  if(!drama){
    msg.innerHTML = '<span style="color:var(--red)">❌ دراما نەدۆزرایەوە!</span>';
    return;
  }

  const _hardOk = await krdConfirm(`ئایا دڵنیا یت لە سڕینەوەی تەواو "${drama.name}"؟\n\n⚠️ ئەم کردارە هەمیشەیە و ناتوانیت دواتر لە تابی «گەڕاندنەوە» بیگەڕێنیتەوە!\n\nئەمە واقیع دروستە؟`, "💥");
  if (!_hardOk) {
    return;
  }

  try {
    // سڕینەوە لە adminDramas
    let idx = state.adminDramas.findIndex(d => d.id === dramaId);
    if (idx !== -1) {
      const deleted = state.adminDramas.splice(idx, 1)[0];
      writeLS(LS_DRAMAS, state.adminDramas);
    }

    // سڕینەوە لە state
    state.allDramas = state.allDramas.filter(d => d.id !== dramaId);
    state.visibleDramas = state.visibleDramas.filter(d => d.id !== dramaId);

    // تۆماری جوڵە
    logAdminActivity('delete', { 
      dramaId, 
      dramaName: drama.name,
      type: 'permanent-hard-delete',
      message: 'سڕینەوەی تەواو - ناگەڕێتەوە',
      episodeCount: (drama.episodes || []).length
    });

    msg.innerHTML = '<span style="color:var(--green)">✅ دراما بە تەواو ڕادەسڕینەوە! ناتوانیت دواتر گەڕاندنەوە کردن.</span>';
    document.getElementById("hard-delete-confirm-check").checked = false;
    document.getElementById("d-drama").value = "";
    document.getElementById("delete-preview-box").style.display = "none";

    syncAll();
    renderAdminManage();
    setTimeout(() => msg.innerHTML = "", 4000);
  } catch(e) {
    console.error('خرابی:', e);
    msg.innerHTML = '<span style="color:var(--red)">❌ خرابی: ' + e.message + '</span>';
  }
}

/**
 * سیستمی ئاگادارکردنەوە
 */

/**
 * ئاگادارکردنەوەی نوێ زیادکردن
 */
function addNotification(title, details) {
  try {
    let adminData = JSON.parse(localStorage.getItem('krd-admin-data') || '{}');
    if (!adminData.notifications) adminData.notifications = [];
    
    const notification = {
      id: Date.now(),
      title: title,
      details: details,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    adminData.notifications.unshift(notification);
    // سێی 50 ئاگادارکردنەوە
    if (adminData.notifications.length > 50) {
      adminData.notifications = adminData.notifications.slice(0, 50);
    }

    localStorage.setItem('krd-admin-data', JSON.stringify(adminData));
    updateNotificationBadge();
    renderNotificationsList();
  } catch(e) {
    console.error('خرابی لە ئاگادارکردنەوە:', e);
  }
}

/**
 * نوێکردنەوەی نیشانەی ئاگادارکردنەوە
 */
function updateNotificationBadge() {
  try {
    const adminData = JSON.parse(localStorage.getItem('krd-admin-data') || '{}');
    const notifications = adminData.notifications || [];
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    const badge = document.getElementById('notification-badge');
    if (!badge) return;
    
    if (unreadCount > 0) {
      badge.style.display = 'flex';
      badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    } else {
      badge.style.display = 'none';
    }
  } catch(e) {
    console.error('خرابی:', e);
  }
}

/**
 * نیشاندانی لیستی ئاگادارکردنەوە
 */
function renderNotificationsList() {
  const container = document.getElementById('notifications-list');
  if (!container) return;

  try {
    const adminData = JSON.parse(localStorage.getItem('krd-admin-data') || '{}');
    const notifications = adminData.notifications || [];

    if (notifications.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-faint); font-size:12px;">❌ هیچ ئاگادارکردنەوەیەک نیە</div>';
      return;
    }

    let html = '';
    notifications.slice(0, 20).forEach(notif => {
      const date = new Date(notif.timestamp);
      const timeStr = date.toLocaleString('ckb-IQ', { 
        hour: '2-digit',
        minute: '2-digit'
      });

      let icon = '📺';
      if (notif.title.includes('نوێ')) icon = '➕';
      if (notif.title.includes('دەستکاری')) icon = '✏️';
      if (notif.title.includes('سڕ')) icon = '🗑️';

      html += `
        <div class="notification-item ${notif.isRead ? 'is-read' : ''}" data-notif-id="${notif.id}">
          <div class="notification-content">
            <div class="notification-title">${icon} ${notif.title}</div>
            <div class="notification-drama">📺 ${escapeHtml(notif.details.dramaName || 'درامای نیشتیمان')}</div>
            <div class="notification-meta">
              📺 ئەڵقە: ${notif.details.episodeCount || 0} • ${timeStr}
            </div>
          </div>
          <div class="notification-dismiss" onclick="dismissNotification(${notif.id})">✕</div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch(e) {
    console.error('خرابی:', e);
  }
}

/**
 * لابردنی یەک ئاگادارکردنەوە
 */
function dismissNotification(notifId) {
  try {
    let adminData = JSON.parse(localStorage.getItem('krd-admin-data') || '{}');
    adminData.notifications = (adminData.notifications || []).filter(n => n.id !== notifId);
    localStorage.setItem('krd-admin-data', JSON.stringify(adminData));
    updateNotificationBadge();
    renderNotificationsList();
  } catch(e) {
    console.error('خرابی:', e);
  }
}

/**
 * هەموو ئاگادارکردنەوە نیشاندەدات وەک بینراو
 */
function markAllNotificationsAsRead() {
  try {
    let adminData = JSON.parse(localStorage.getItem('krd-admin-data') || '{}');
    if (adminData.notifications) {
      adminData.notifications.forEach(n => n.isRead = true);
    }
    localStorage.setItem('krd-admin-data', JSON.stringify(adminData));
    updateNotificationBadge();
    renderNotificationsList();
  } catch(e) {
    console.error('خرابی:', e);
  }
}

/**
 * نیشاندانی/شاراوەتنی پانێلی ئاگادارکردنەوە
 */
function toggleNotificationsPanel() {
  const panel = document.getElementById('notifications-panel');
  if (panel) {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display === 'block') {
      renderNotificationsList();
      markAllNotificationsAsRead();
    }
  }
}

/**
 * ڕێکخستنی پێڕاپێی بەکارهێنەر
 */
const DEFAULT_USER_PREFS = {
  notifyNewDrama: true,
  privateHistory: false,
  hideWatched: false,
  showRecommendations: true,
  backgroundMusic: 'on'
};

function getUserPrefs() {
  try {
    return JSON.parse(localStorage.getItem('krd-user-prefs') || JSON.stringify(DEFAULT_USER_PREFS));
  } catch(e) {
    return DEFAULT_USER_PREFS;
  }
}

function setUserPref(key, value) {
  try {
    let prefs = getUserPrefs();
    prefs[key] = value;
    localStorage.setItem('krd-user-prefs', JSON.stringify(prefs));
  } catch(e) {
    console.error('خرابی:', e);
  }
}

function applyUserPrefs() {
  const prefs = getUserPrefs();
  const prefNotify = document.getElementById('pref-notify-new-drama');
  const prefPrivate = document.getElementById('pref-private-history');
  const prefHideWatched = document.getElementById('pref-hide-watched');
  const prefRecommend = document.getElementById('pref-show-recommendations');

  if(prefNotify) prefNotify.checked = prefs.notifyNewDrama;
  if(prefPrivate) prefPrivate.checked = prefs.privateHistory;
  if(prefHideWatched) prefHideWatched.checked = prefs.hideWatched;
  if(prefRecommend) prefRecommend.checked = prefs.showRecommendations;
}

/**
 * نیشاندانی جوڵەی گشتی (کۆدی یارمەتیدەر، هەر شوێنێک بانگ بکرێت)
 */
function renderPublicActivityLog() {
  const container = document.getElementById('public-activity-list');
  if (!container) return;

  try {
    const adminData = JSON.parse(localStorage.getItem('krd-admin-data') || '{}');
    const activities = adminData.activityLog || [];

    if (activities.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-faint);">❌ هیچ جوڵەیەک نیە</div>';
      return;
    }

    let html = '';
    const limited = activities.slice(0, 100); // سێی 100 ئەڵقەی نوێترین
    
    limited.forEach(activity => {
      const date = new Date(activity.timestamp);
      const timeStr = date.toLocaleString('ckb-IQ', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      let actionBadge = '';
      let actionLabel = '';
      let actionIcon = '';
      
      switch(activity.actionType) {
        case 'add': 
          actionBadge = 'activity-log-action-add'; 
          actionLabel = 'زیادکردن'; 
          actionIcon = '➕';
          break;
        case 'edit': 
          actionBadge = 'activity-log-action-edit'; 
          actionLabel = 'دەستکاریکردن'; 
          actionIcon = '✏️';
          break;
        case 'delete': 
          actionBadge = 'activity-log-action-delete'; 
          actionLabel = 'سڕینەوە'; 
          actionIcon = '🗑️';
          break;
        case 'restore': 
          actionBadge = 'activity-log-action-edit'; 
          actionLabel = 'گەڕاندنەوە'; 
          actionIcon = '↩️';
          break;
        default: 
          actionLabel = activity.actionType;
          actionIcon = '•';
      }

      const dramaName = activity.details?.dramaName || 'نیشتیمان';
      const details = activity.details?.message || '';

      html += `
        <div class="activity-log-item">
          <div class="activity-log-header">
            <b class="${actionBadge}">${actionIcon} ${actionLabel}</b>
            <span class="activity-log-time">${timeStr}</span>
          </div>
          <div style="font-size:12px; color:var(--text); font-weight:600; margin-bottom:6px;">
            📺 <b>${escapeHtml(dramaName)}</b>
          </div>
          <div class="activity-log-details">${escapeHtml(details)}</div>
          <div class="activity-log-device">
            📱 ${activity.device} • 🌐 ${activity.platform}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch(e) {
    console.error('خرابی:', e);
    container.innerHTML = '<div style="color:var(--red)">❌ خرابی لە بارکردن</div>';
  }
}

/**
 * نیشاندانی بۆڕدی ئەدمین
 */
function renderAdminDashboard() {
  try {
    // Stats
    document.getElementById('dashboard-dramas').textContent = state.dramas.filter(d => !d.deleted).length;
    document.getElementById('dashboard-episodes').textContent = state.dramas.reduce((sum, d) => sum + (d.episodes || []).length, 0);
    
    const adminData = JSON.parse(localStorage.getItem('krd-admin-data') || '{}');
    const stats = adminData.stats || {};
    document.getElementById('dashboard-views').textContent = stats.totalViews || 0;
    document.getElementById('dashboard-favorites').textContent = Object.keys(state.favorites || {}).length;

    // Recent Activity (Admin Only)
    renderDashboardActivity();

    // System Info
    document.getElementById('dashboard-device').textContent = detectDevice();
    document.getElementById('dashboard-platform').textContent = getPlatform();
    const now = new Date();
    document.getElementById('dashboard-timestamp').textContent = now.toLocaleString('ckb-IQ');

  } catch(e) {
    console.error('خرابی لە بۆڕد:', e);
  }
}

/**
 * نیشاندانی جوڵەی نوێتر (تەنها بۆ ئەدمین)
 */
function renderDashboardActivity() {
  const container = document.getElementById('dashboard-activity-list');
  if (!container) return;

  try {
    const adminData = JSON.parse(localStorage.getItem('krd-admin-data') || '{}');
    const activities = (adminData.activityLog || []).slice(0, 8); // سێی 8 نوێتریەکان

    if (activities.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:16px; color:var(--text-faint); font-size:12px;">❌ هیچ جوڵەیەک نیە</div>';
      return;
    }

    let html = '';
    activities.forEach(activity => {
      const date = new Date(activity.timestamp);
      const timeStr = date.toLocaleString('ckb-IQ', { 
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      let actionIcon = '';
      let actionClass = '';
      switch(activity.actionType) {
        case 'add': actionIcon = '➕'; actionClass = 'activity-log-action-add'; break;
        case 'edit': actionIcon = '✏️'; actionClass = 'activity-log-action-edit'; break;
        case 'delete': actionIcon = '🗑️'; actionClass = 'activity-log-action-delete'; break;
        case 'restore': actionIcon = '↩️'; actionClass = 'activity-log-action-edit'; break;
        default: actionIcon = '•';
      }

      const dramaName = activity.details?.dramaName || 'درامای نیشتیمان';

      html += `
        <div style="padding:10px; border-bottom:1px solid var(--border); font-size:11px; display:flex; align-items:center; gap:10px;">
          <div style="font-size:14px;">${actionIcon}</div>
          <div style="flex:1;">
            <div style="color:var(--text); font-weight:600;">📺 ${escapeHtml(dramaName)}</div>
            <div style="color:var(--text-faint); font-size:10px;">${timeStr}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch(e) {
    console.error('خرابی:', e);
  }
}

/**
 * Quick action handlers
 */
function quickAddDrama() {
  switchAdminTab('add-drama');
  setTimeout(() => {
    const firstField = document.getElementById('f-name');
    if(firstField) firstField.focus();
  }, 300);
}

function quickAddEpisode() {
  switchAdminTab('add-episode');
  setTimeout(() => {
    const firstField = document.getElementById('e-drama');
    if(firstField) firstField.focus();
  }, 300);
}

function quickManage() {
  switchAdminTab('manage');
}

function quickAnalytics() {
  switchAdminTab('analytics');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ---------- دەستپێکردن ---------- */
(function init(){
  let savedTheme = "dark";
  try{ savedTheme = localStorage.getItem(LS_THEME) || "dark"; }catch(e){}
  applyTheme(savedTheme);

  try{
    state.isAdmin = sessionStorage.getItem(SS_ADMIN) === "1";
    state.adminCode = sessionStorage.getItem(SS_ADMIN_CODE) || null;
  }catch(e){}

  initEvents();
  loadData();
  applyUserPrefs();
  updateNotificationBadge();
  runSearch();
})();
