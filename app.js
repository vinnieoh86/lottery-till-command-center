const STORAGE_KEY = "lotteryTillState:v2";
const STORAGE_BACKUP_KEY = "lotteryTillStateBackup:v1";
const DAILY_LOGS_KEY = "lotteryTillDailyLogs:v1";
const SESSION_KEY = "lotteryTillSession:v1";
const CLOUD_STORE_KEY = "lottery-till-main";
const IDLE_LOCK_MS = 180000;
const DEVICE_ID = `device-${Math.random().toString(36).slice(2,9)}`;
const SUPABASE_URL = "https://psngcbeffraghwwuihsk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbmdjYmVmZnJhZ2h3d3VpaHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTE2NzYsImV4cCI6MjA5MTg2NzY3Nn0.FzLgqimL1vrwX1PEx4zVTqyfwgKqKrOs9ueVfIXSAKw";
const supabaseClient = window.supabase?.createClient
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const ticketRules = {
  1: 200,
  2: 100,
  5: 50,
  10: 50,
  20: 25,
  30: 25,
  50: 30,
};

let inventory = [
  { box: "1", bookNumber: "0762", name: "BILLION", value: 50 },
  { box: "2", bookNumber: "", name: "", value: "" },
  { box: "3", bookNumber: "1079", name: "WILD CASH TRIPLER", value: 30 },
  { box: "4", bookNumber: "1073", name: "SET FOR LIFE $20", value: 20 },
  { box: "5", bookNumber: "1028", name: "$300 MILLION", value: 20 },
  { box: "6", bookNumber: "1048", name: "$1,000,000 HOLIDAY", value: 20 },
  { box: "7", bookNumber: "1023", name: "CASINO NIGHT", value: 10 },
  { box: "8", bookNumber: "1042", name: "MYSTERY MULTIPLAYER", value: 10 },
  { box: "9", bookNumber: "1072", name: "SET FOR LIFE $10", value: 10 },
  { box: "10", bookNumber: "1053", name: "$500,000 CASHWORD", value: 10 },
  { box: "11", bookNumber: "1055", name: "50, 100, 500", value: 10 },
  { box: "12", bookNumber: "1031", name: "$500,000 BANKROLL", value: 10 },
  { box: "13", bookNumber: "1017", name: "FEELING LUCKY?", value: 10 },
  { box: "14", bookNumber: "1056", name: "$1,000,000 CASHWORD", value: 20 },
  { box: "15", bookNumber: "1066", name: "LUCKY NO. 7", value: 10 },
  { box: "16", bookNumber: "1007", name: "CASH PLUS", value: 10 },
  { box: "17", bookNumber: "1041", name: "WIN BIG", value: 5 },
  { box: "18", bookNumber: "1038", name: "BINGO 25X", value: 5 },
  { box: "19", bookNumber: "1087", name: "25, 50, 250", value: 5 },
  { box: "20", bookNumber: "1012", name: "MONOPOLY BONUS 5", value: 10 },
  { box: "21", bookNumber: "1030", name: "JOKER'S WILD", value: 5 },
  { box: "22", bookNumber: "1022", name: "THREE STOOGES", value: 5 },
  { box: "23", bookNumber: "0891", name: "CASH XPLOSION", value: 5 },
  { box: "24", bookNumber: "1065", name: "JACKPOT PARTY", value: 5 },
  { box: "25", bookNumber: "1077", name: "ACES AND 8'S", value: 5 },
  { box: "26", bookNumber: "1059", name: "LET IT SNOW", value: 5 },
  { box: "27", bookNumber: "1071", name: "SET FOR LIFE $5", value: 5 },
  { box: "28", bookNumber: "1086", name: "$5 CASHWORD", value: 5 },
  { box: "29", bookNumber: "1036", name: "WHITE DIAMONDS", value: 10 },
  { box: "30", bookNumber: "1068", name: "CASH XPLOSION 10X", value: 2 },
  { box: "31", bookNumber: "1035", name: "PLINKO", value: 5 },
  { box: "32", bookNumber: "1080", name: "BINGO MULTIPLIER", value: 2 },
  { box: "33", bookNumber: "1029", name: "LUCKY GEM", value: 2 },
  { box: "34", bookNumber: "1054", name: "CASH XPLOSION CASHWORD", value: 2 },
  { box: "35", bookNumber: "1034", name: "PINK DIAMONDS", value: 2 },
  { box: "36", bookNumber: "0890", name: "CASH XPLOSION 10X", value: 2 },
  { box: "37", bookNumber: "1069", name: "SET FOR LIFE", value: 1 },
  { box: "38", bookNumber: "1040", name: "5,20,100", value: 2 },
  { box: "39", bookNumber: "1064", name: "GNOMEBODY IS LUCKIER", value: 2 },
  { box: "40", bookNumber: "1070", name: "SET FOR LIFE $2", value: 2 },
  { box: "41", bookNumber: "1009", name: "MONOPOLY 5X", value: 1 },
  { box: "42", bookNumber: "1063", name: "LUCK OF THE IRISH TRIPLER", value: 1 },
  { box: "43", bookNumber: "1044", name: "HOLIDAY CASH", value: 1 },
  { box: "44", bookNumber: "1033", name: "WINNER WINNER CHICKEN", value: 1 },
  { box: "45", bookNumber: "1052", name: "TRIPLE TRIPLER", value: 1 },
  { box: "46", bookNumber: "1076", name: "ELECTRIC 8", value: 1 },
  { box: "A", bookNumber: "1078", name: "CROSS MATCH BINGO", value: 10, ticketCount: 30 },
];

const orderDefaults = {
  "37": 3,
  "41": 2,
  "42": 2,
  "43": 2,
  "44": 1,
  "45": 3,
  "46": 3,
  "30": 1,
  "32": 3,
  "33": 1,
  "34": 2,
  "35": 1,
  "36": 1,
  "38": 1,
  "39": 2,
  "40": 3,
  "17": 1,
  "18": 3,
  "19": 3,
  "21": 1,
  "22": 1,
  "23": 1,
  "24": 2,
  "25": 3,
  "26": 1,
  "27": 3,
  "28": 5,
  "31": 1,
  "7": 1,
  "8": 1,
  "9": 2,
  "10": 1,
  "11": 2,
  "12": 1,
  "13": 1,
  "15": 1,
  "16": 1,
  "20": 1,
  "29": 1,
  A: 3,
  "4": 1,
  "5": 1,
  "6": 1,
  "14": 1,
  "3": 1,
  "1": 1,
};

function emptyOrderInventory() {
  return Object.fromEntries(inventory.map((game) => [gameId(game), 0]));
}

const dcBoxes = new Set(["21", "33"]);

const defaultExtraOrders = [
  { name: "PAPER ROLL", keepUpTo: 2, unit: "BX", qty: 0 },
  { name: "PICK 3", keepUpTo: 5, unit: "", qty: 0 },
  { name: "PICK 4", keepUpTo: 3, unit: "", qty: 0 },
  { name: "PICK 5", keepUpTo: 3, unit: "", qty: 0 },
  { name: "MEGA", keepUpTo: 3, unit: "", qty: 0 },
  { name: "POWERBALL", keepUpTo: 2, unit: "", qty: 0 },
  { name: "CLASSIC", keepUpTo: 2, unit: "", qty: 0 },
];

function cloneExtraOrders(source = []) {
  const incoming = Array.isArray(source) ? source : [];
  const byName = new Map(incoming.map((item) => [item.name, item]));
  return defaultExtraOrders.map((item) => {
    const saved = byName.get(item.name) || {};
    const savedQty = Object.prototype.hasOwnProperty.call(saved, "keepUpTo") ? saved.qty : 0;
    return { ...item, qty: savedQty };
  });
}

const defaultTill = {
  grossSales: 0,
  onlineCancels: 0,
  onlineCashes: 0,
  instantCashes: 0,
  cashlessOnlineSales: 0,
  cashlessOnlineOnlySales: 0,
  cashlessInstantSales: 0,
  officePayout: 0,
  misprintWithoutCancel: 0,
  adjustments: 0,
};

const cashDenominations = [
  { label: "Quarters", value: 0.25 },
  { label: "Dimes", value: 0.1 },
  { label: "Nickels", value: 0.05 },
  { label: "Pennies", value: 0.01 },
  { label: "$1", value: 1 },
  { label: "$5", value: 5 },
  { label: "$10", value: 10 },
  { label: "$20", value: 20 },
  { label: "$50", value: 50 },
  { label: "$100", value: 100 },
  { label: "Q Roll", value: 10 },
  { label: "D Roll", value: 5 },
  { label: "N Roll", value: 2 },
  { label: "P Roll", value: 0.5 },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const salesSummaryFields = [
  ["reportDate", "Report date"],
  ["grossSales", "Gross sales"],
  ["onlineCancels", "Online cancels"],
  ["onlineCashes", "Online cashes"],
  ["cashlessOnlineOnlySales", "Cashless online sale"],
  ["instantCashes", "Instant cashes"],
  ["cashlessInstantSales", "Cashless instant sales"],
  ["officePayout", "Office payout"],
  ["misprintWithoutCancel", "Misprint w/out cancel"],
  ["adjustments", "Adjustments"],
];

const elements = {
  businessDate: document.querySelector("#businessDate"),
  previousMonthButton: document.querySelector("#previousMonthButton"),
  nextMonthButton: document.querySelector("#nextMonthButton"),
  todayButton: document.querySelector("#todayButton"),
  seedMonthButton: document.querySelector("#seedMonthButton"),
  calendarDays: document.querySelector("#calendarDays"),
  monthTitle: document.querySelector("#monthTitle"),
  monthVarianceBadge: document.querySelector("#monthVarianceBadge"),
  dailyCountDate: document.querySelector("#dailyCountDate"),
  gameRows: document.querySelector("#gameRows"),
  dailyEntrySection: document.querySelector("#daily-entry"),
  tillSection: document.querySelector("#till"),
  gameRowTemplate: document.querySelector("#gameRowTemplate"),
  editInventoryButton: document.querySelector("#editInventoryButton"),
  saveDayButton: document.querySelector("#saveDayButton"),
  closedDayNotice: document.querySelector("#closedDayNotice"),
  instantSalesCard: document.querySelector("#instantSalesCard"),
  manualInstantCard: document.querySelector("#manualInstantCard"),
  instantSalesTotal: document.querySelector("#instantSalesTotal"),
  manualInstantTotal: document.querySelector("#manualInstantTotal"),
  ticketsSoldTotal: document.querySelector("#ticketsSoldTotal"),
  activeBooksTotal: document.querySelector("#activeBooksTotal"),
  differenceTotal: document.querySelector("#differenceTotal"),
  lotterySalesTotal: document.querySelector("#lotterySalesTotal"),
  cashDrawerTotal: document.querySelector("#cashDrawerTotal"),
  reportDrawerTotal: document.querySelector("#reportDrawerTotal"),
  reportDifferenceTotal: document.querySelector("#reportDifferenceTotal"),
  instantMismatchAlert: document.querySelector("#instantMismatchAlert"),
  instantMismatchText: document.querySelector("#instantMismatchText"),
  manualOverrideButton: document.querySelector("#manualOverrideButton"),
  reconcileButton: document.querySelector("#reconcileButton"),
  printReconcileButton: document.querySelector("#printReconcileButton"),
  reconcilePanel: document.querySelector("#reconcilePanel"),
  reconcileRows: document.querySelector("#reconcileRows"),
  cashRows: document.querySelector("#cashRows"),
  auditLog: document.querySelector("#auditLog"),
  exportButton: document.querySelector("#exportButton"),
  syncStatus: document.querySelector("#syncStatus"),
  mobileSyncStatus: document.querySelector("#mobileSyncStatus"),
  weekViewButton: document.querySelector("#weekViewButton"),
  monthViewButton: document.querySelector("#monthViewButton"),
  summaryValueFilter: document.querySelector("#summaryValueFilter"),
  monthValueFilter: document.querySelector("#monthValueFilter"),
  summaryRows: document.querySelector("#summaryRows"),
  monthMatrixHead: document.querySelector("#monthMatrixHead"),
  monthMatrixRows: document.querySelector("#monthMatrixRows"),
  managerReportCards: document.querySelector("#managerReportCards"),
  managerGameReportRows: document.querySelector("#managerGameReportRows"),
  managerDayReportRows: document.querySelector("#managerDayReportRows"),
  reportRangeButtons: document.querySelectorAll("[data-report-range]"),
  orderDate: document.querySelector("#orderDate"),
  backstockWeeks: document.querySelector("#backstockWeeks"),
  highTicketThreshold: document.querySelector("#highTicketThreshold"),
  orderRows: document.querySelector("#orderRows"),
  orderInvoiceCard: document.querySelector("#orderInvoiceCard"),
  orderReportRows: document.querySelector("#orderReportRows"),
  extraBooksRows: document.querySelector("#extraBooksRows"),
  saveWeeklyOrderButton: document.querySelector("#saveWeeklyOrderButton"),
  savedOrderRows: document.querySelector("#savedOrderRows"),
  clearEndingButton: document.querySelector("#clearEndingButton"),
  clearManualButton: document.querySelector("#clearManualButton"),
  editDayButton: document.querySelector("#editDayButton"),
  authEmail: document.querySelector("#authEmail"),
  authPassword: document.querySelector("#authPassword"),
  authActions: document.querySelector("#authActions"),
  authUserLabel: document.querySelector("#authUserLabel"),
  authSignInButton: document.querySelector("#authSignInButton"),
  authSignUpButton: document.querySelector("#authSignUpButton"),
  authSignOutButton: document.querySelector("#authSignOutButton"),
  cloudSyncButton: document.querySelector("#cloudSyncButton"),
  mobileSyncButton: document.querySelector("#mobileSyncButton"),
  mobileLockButton: document.querySelector("#mobileLockButton"),
  scanSalesSummaryButton: document.querySelector("#scanSalesSummaryButton"),
  scanManualInstantButton: document.querySelector("#scanManualInstantButton"),
  salesSummaryScanInput: document.querySelector("#salesSummaryScanInput"),
  manualInstantScanInput: document.querySelector("#manualInstantScanInput"),
  scanReviewPanel: document.querySelector("#scanReviewPanel"),
  scanReviewTitle: document.querySelector("#scanReviewTitle"),
  scanReviewRows: document.querySelector("#scanReviewRows"),
  scanPhotoPreview: document.querySelector("#scanPhotoPreview"),
  clearScanReviewButton: document.querySelector("#clearScanReviewButton"),
  addScanPageButton: document.querySelector("#addScanPageButton"),
  parseScanPagesButton: document.querySelector("#parseScanPagesButton"),
  applyScanButton: document.querySelector("#applyScanButton"),
  scanParserStatus: document.querySelector("#scanParserStatus"),
  salesSummarySubmitButton: document.querySelector("#salesSummarySubmitButton"),
  manualReviewSubmitButton: document.querySelector("#manualReviewSubmitButton"),
  pinOverlay: document.querySelector("#pinOverlay"),
  pinEntry: document.querySelector("#pinEntry"),
  pinMessage: document.querySelector("#pinMessage"),
  pinRoleLabel: document.querySelector("#pinRoleLabel"),
  pinLockButton: document.querySelector("#pinLockButton"),
  pinPadButtons: document.querySelectorAll("[data-pin-key], [data-pin-action]"),
  adminPinInput: document.querySelector("#adminPinInput"),
  confirmAdminPinInput: document.querySelector("#confirmAdminPinInput"),
  saveAdminPinButton: document.querySelector("#saveAdminPinButton"),
  newUserNameInput: document.querySelector("#newUserNameInput"),
  newUserPinInput: document.querySelector("#newUserPinInput"),
  addUserButton: document.querySelector("#addUserButton"),
  userList: document.querySelector("#userList"),
  appConfirmModal: document.querySelector("#appConfirmModal"),
  appConfirmEyebrow: document.querySelector("#appConfirmEyebrow"),
  appConfirmTitle: document.querySelector("#appConfirmTitle"),
  appConfirmBody: document.querySelector("#appConfirmBody"),
  appConfirmCancel: document.querySelector("#appConfirmCancel"),
  appConfirmOk: document.querySelector("#appConfirmOk"),
  mobileEntryBar: document.querySelector("#mobileEntryBar"),
  mobileDockToggleButton: document.querySelector("#mobileDockToggleButton"),
  mobilePrevBoxButton: document.querySelector("#mobilePrevBoxButton"),
  mobileNextBoxButton: document.querySelector("#mobileNextBoxButton"),
  mobileBoxProgress: document.querySelector("#mobileBoxProgress"),
  viewButtons: document.querySelectorAll("[data-view-button]"),
  appViews: document.querySelectorAll("[data-view]"),
  sortHeaders: document.querySelectorAll("[data-sort-key]"),
  sectionToggles: document.querySelectorAll("[data-toggle-target]"),
};

let state = loadState();
state.businessDate = todayIso();
state.uiSettings = { ...(state.uiSettings || {}), mobileEntryDock: "bottom" };
inventory = state.inventory || inventory;
let summaryMode = "week";
let gameSearchQuery = "";
let monthMatrixSort = { key: "box", direction: "asc" };
let recentlySavedToCloud = false;
let recentlySavedTimer = null;
let realtimeChannel = null;
let realtimeNotifyBanner = null;
let cloudPollTimer = null;
let lastLoadedCloudUpdatedAt = "";
let isSavingCloudState = false;
let pendingCloudSaveRequested = false;
let isLoadingCloudState = false;
let pendingCloudLoadRequested = false;
let pendingCloudLoadQuiet = true;
let summaryValueFilter = "all";
let summarySort = { key: "booksSold", direction: "desc" };
let managerReportRange = "month";
let inventoryEditMode = false;
let draggedInventoryId = null;
let activeView = "daily";
let reconcileVisible = false;
let scanDraft = { type: "", files: [], parsed: null, salesSummaryReviewValues: null, manualReviewValues: null };
let cloudSaveTimer = null;
let isApplyingCloudState = false;
let accessRole = null;
let currentUser = null;
let pinUnlockInProgress = false;
let lastPinPressAt = 0;
let idleLockTimer = null;
let activeMobileGameIndex = 0;
let previousDateDraft = null;
let suppressNextMobileAutoAdvance = false;
let endingEditModeDate = "";
let activePrintFrame = null;
const activeProcessingScanIds = new Set();

function todayIso() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isClosedDate(date) {
  return new Date(`${date}T12:00:00`).getDay() === 0;
}

function selectedMonthDates() {
  const selectedDate = new Date(`${state.businessDate}T12:00:00`);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month, index + 1, 12);
    return date.toISOString().slice(0, 10);
  });
}

function createDefaultState() {
  return {
    businessDate: todayIso(),
    inventory,
    dailyLogs: {},
    till: normalizeTill(),
    cashCounts: Object.fromEntries(cashDenominations.map((item) => [item.label, 0])),
    orderInventory: emptyOrderInventory(),
    orderAudit: {},
    orderDc: Object.fromEntries([...dcBoxes].map((box) => [box, true])),
    extraOrders: cloneExtraOrders(),
    savedOrders: [],
    currentOrderPreview: null,
    orderPreviewClearDate: "",
    orderSettings: {
      date: todayIso(),
      backstockWeeks: 2.5,
      highTicketThreshold: 40,
    },
    pinSettings: {
      admin: "1986",
      user: "",
      users: [],
    },
    uiSettings: {
      mobileEntryDock: "bottom",
    },
    scanRecords: {},
    lastSavedAt: null,
  };
}

function readStandaloneDailyLogs() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DAILY_LOGS_KEY) || "null");
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function mergePersistedDailyLogs(snapshotLogs = {}, standaloneLogs = null) {
  const merged = cloneJson(snapshotLogs && typeof snapshotLogs === "object" ? snapshotLogs : {});
  if (!standaloneLogs || typeof standaloneLogs !== "object") return merged;

  Object.entries(standaloneLogs).forEach(([date, storedLog]) => {
    if (!storedLog || typeof storedLog !== "object") return;
    const snapshotLog = merged[date];

    if (!snapshotLog) {
      merged[date] = cloneJson(storedLog);
      return;
    }

    const mergedEntries = { ...(snapshotLog.entries || {}) };
    Object.entries(storedLog.entries || {}).forEach(([boxId, storedEntry]) => {
      if (!storedEntry || typeof storedEntry !== "object") return;
      const snapshotEntry = mergedEntries[boxId];
      if (!snapshotEntry) {
        mergedEntries[boxId] = { ...storedEntry };
        return;
      }

      const storedEndingTs = storedEntry.todayEndingUpdatedAt || storedEntry.updatedAt || "";
      const snapshotEndingTs = snapshotEntry.todayEndingUpdatedAt || snapshotEntry.updatedAt || "";
      const storedManualTs = storedEntry.manualInstantUpdatedAt || "";
      const snapshotManualTs = snapshotEntry.manualInstantUpdatedAt || "";

      mergedEntries[boxId] = {
        ...snapshotEntry,
        ...(storedEndingTs > snapshotEndingTs
          ? {
              todayEnding: storedEntry.todayEnding,
              todayEndingUpdatedAt: storedEntry.todayEndingUpdatedAt,
              todayEndingUpdatedBy: storedEntry.todayEndingUpdatedBy,
              updatedAt: storedEntry.updatedAt,
              updatedBy: storedEntry.updatedBy,
              endingCompletedAt: storedEntry.endingCompletedAt,
              endingCompletedBy: storedEntry.endingCompletedBy,
            }
          : {}),
        ...(storedManualTs > snapshotManualTs
          ? {
              manualInstantSold: storedEntry.manualInstantSold,
              manualInstantUpdatedAt: storedEntry.manualInstantUpdatedAt,
              manualInstantUpdatedBy: storedEntry.manualInstantUpdatedBy,
            }
          : {}),
      };
    });

    const storedSavedAt = storedLog.savedAt || "";
    const snapshotSavedAt = snapshotLog.savedAt || "";
    merged[date] = {
      ...snapshotLog,
      entries: mergedEntries,
      ...(storedSavedAt > snapshotSavedAt
        ? {
            till: storedLog.till,
            cashCounts: storedLog.cashCounts,
            savedAt: storedLog.savedAt,
            completedAt: storedLog.completedAt,
            completedBy: storedLog.completedBy,
            endingCompletedAt: storedLog.endingCompletedAt,
            endingCompletedBy: storedLog.endingCompletedBy,
            totals: storedLog.totals,
            manualMismatchOverride: storedLog.manualMismatchOverride,
          }
        : {}),
    };
  });

  return merged;
}

function normalizeStoredState(parsed = {}) {
  const defaults = createDefaultState();
  const mergedDailyLogs = mergePersistedDailyLogs(parsed.dailyLogs || {}, readStandaloneDailyLogs());
  return {
    ...defaults,
    businessDate: parsed.businessDate || todayIso(),
    inventory: parsed.inventory || inventory,
    dailyLogs: mergedDailyLogs,
    till: normalizeTill(parsed.till),
    cashCounts: {
      ...emptyCashCounts(),
      ...(parsed.cashCounts || {}),
    },
    orderInventory: { ...emptyOrderInventory(), ...(parsed.orderInventory || {}) },
    orderAudit: parsed.orderAudit || {},
    orderDc: { ...Object.fromEntries([...dcBoxes].map((box) => [box, true])), ...(parsed.orderDc || {}) },
    extraOrders: cloneExtraOrders(parsed.extraOrders || defaultExtraOrders),
    savedOrders: parsed.savedOrders || [],
    currentOrderPreview: parsed.currentOrderPreview || null,
    orderPreviewClearDate: parsed.orderPreviewClearDate || "",
    orderSettings: {
      date: parsed.orderSettings?.date || todayIso(),
      backstockWeeks: normalizeNumber(parsed.orderSettings?.backstockWeeks) || 2.5,
      highTicketThreshold: normalizeNumber(parsed.orderSettings?.highTicketThreshold) || 40,
    },
    pinSettings: {
      admin: parsed.pinSettings?.admin || "1986",
      user: parsed.pinSettings?.user || "",
      users: mergePinUsers(parsed.pinSettings?.users || []),
    },
    uiSettings: {
      mobileEntryDock: parsed.uiSettings?.mobileEntryDock || "bottom",
    },
    scanRecords: compactScanRecordsForStorage(parsed.scanRecords || {}),
    lastSavedAt: parsed.lastSavedAt || null,
    seedVersions: parsed.seedVersions || {},
    _ownSaveTimestamp: parsed._ownSaveTimestamp || "",
  };
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const backup = localStorage.getItem(STORAGE_BACKUP_KEY);
    if (!backup) {
      return normalizeStoredState(createDefaultState());
    }
    try {
      const parsedBackup = JSON.parse(backup);
      return normalizeStoredState(parsedBackup);
    } catch {
      return createDefaultState();
    }
  }

  try {
    const parsed = JSON.parse(stored);
    return normalizeStoredState(parsed);
  } catch {
    const backup = localStorage.getItem(STORAGE_BACKUP_KEY);
    if (!backup) return createDefaultState();
    try {
      const parsedBackup = JSON.parse(backup);
      return normalizeStoredState(parsedBackup);
    } catch {
      return createDefaultState();
    }
  }
}

function compactScanRecordsForStorage(records = {}) {
  const compact = {};
  Object.entries(records || {}).forEach(([date, list]) => {
    compact[date] = (Array.isArray(list) ? list : []).map((record) => ({
      ...record,
      photo: record?.photo
        ? {
            ...record.photo,
            dataUrl: "",
          }
        : record?.photo,
      photos: Array.isArray(record?.photos)
        ? record.photos.map((photo) => ({
            ...photo,
            dataUrl: "",
          }))
        : record?.photos,
    }));
  });
  return compact;
}

function stateForLocalStorage() {
  state.inventory = inventory;
  return {
    ...state,
    inventory,
    scanRecords: compactScanRecordsForStorage(state.scanRecords || {}),
  };
}

function stateForLocalStorageFallback() {
  state.inventory = inventory;
  return {
    ...state,
    inventory,
    scanRecords: {},
  };
}

function stateForBackupStorage() {
  state.inventory = inventory;
  return {
    businessDate: state.businessDate,
    dailyLogs: state.dailyLogs || {},
    till: state.till || defaultTill,
    cashCounts: state.cashCounts || emptyCashCounts(),
    inventory,
    orderInventory: state.orderInventory || {},
    extraOrders: state.extraOrders || [],
    orderDc: state.orderDc || {},
    orderHistory: state.orderHistory || [],
    orderSettings: state.orderSettings || createDefaultState().orderSettings,
    pinSettings: state.pinSettings || createDefaultState().pinSettings,
    uiSettings: state.uiSettings || createDefaultState().uiSettings,
    lastSavedAt: state.lastSavedAt || null,
    seedVersions: state.seedVersions || {},
  };
}

function writeLocalState() {
  state.inventory = inventory;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateForLocalStorage()));
    localStorage.setItem(STORAGE_BACKUP_KEY, JSON.stringify(stateForBackupStorage()));
    localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(state.dailyLogs || {}));
    return true;
  } catch (error) {
    console.warn("Local storage persist failed", error);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateForLocalStorageFallback()));
      localStorage.setItem(STORAGE_BACKUP_KEY, JSON.stringify(stateForBackupStorage()));
      localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(state.dailyLogs || {}));
      setSyncStatus("Local storage trimmed - entries preserved");
      return true;
    } catch (fallbackError) {
      console.warn("Local storage fallback persist failed", fallbackError);
      setSyncStatus("Local storage full - cloud sync still running");
      return false;
    }
  }
}

function persistState() {
  writeLocalState();
  scheduleCloudSave();
}

function getSerializableState() {
  state.inventory = inventory;
  return {
    ...state,
    inventory,
    scanRecords: compactScanRecordsForStorage(state.scanRecords || {}),
    _deviceId: DEVICE_ID,
  };
}

function setSyncStatus(message) {
  elements.syncStatus.textContent = message;
  if (elements.mobileSyncStatus) {
    elements.mobileSyncStatus.textContent = message;
  }
}

function renderAuthState() {
  const online = Boolean(supabaseClient);
  elements.authUserLabel.textContent = online ? "Auto cloud sync" : "Supabase offline";
  elements.authEmail.hidden = true;
  elements.authPassword.hidden = true;
  elements.authActions.hidden = true;
  elements.authSignOutButton.hidden = true;
  elements.cloudSyncButton.disabled = !online;
  elements.mobileSyncButton.disabled = !online;
  elements.authSignInButton.disabled = true;
  elements.authSignUpButton.disabled = true;

  if (!supabaseClient) {
    setSyncStatus("Local draft");
  } else if (!realtimeChannel) {
    setSyncStatus("Auto sync ready");
  }
}

function isAdminRole() {
  return accessRole === "admin";
}

function isUserRole() {
  return accessRole === "user";
}

function currentUserName() {
  return currentUser?.name || (isAdminRole() ? "Admin" : isUserRole() ? "User" : "Unknown");
}

function formatAuditBadge(name, timestamp) {
  if (!name) return "";
  if (!timestamp) return `<span class="chip-time">${name}</span>`;
  const time = new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return `<span class="chip-time">${name} ${time}</span>`;
}

function loadSessionAccess() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    if (!saved?.role || !saved?.user) return null;
    return saved;
  } catch {
    return null;
  }
}

function saveSessionAccess() {
  try {
    if (!accessRole || !currentUser) {
      sessionStorage.removeItem(SESSION_KEY);
      return;
    }
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        role: accessRole,
        user: currentUser,
        activeView,
        savedAt: new Date().toISOString(),
      }),
    );
  } catch (error) {
    console.warn("Session storage save failed", error);
  }
}

function mergePinUsers(...userLists) {
  const byPin = new Map();
  userLists.flat().forEach((user) => {
    const rawPin = String(user?.pin || "").replace(/\D/g, "");
    if (!rawPin) return;
    const pin = rawPin.padStart(4, "0").slice(-4);
    if (!/^\d{4}$/.test(pin)) return;
    byPin.set(pin, { name: user?.name || `User ${pin}`, pin });
  });
  return Array.from(byPin.values());
}

function isRoleAllowedView(view) {
  if (!accessRole) return false;
  if (isAdminRole()) return true;
  return ["daily", "till", "order"].includes(view);
}

function applyAccessRole(role) {
  accessRole = role;
  document.body.classList.toggle("app-locked", !role);
  document.body.classList.toggle("admin-mode", role === "admin");
  document.body.classList.toggle("user-mode", role === "user");
  elements.pinOverlay.hidden = Boolean(role);
  elements.pinRoleLabel.textContent = role ? currentUserName().toUpperCase() : "Locked";
  elements.clearEndingButton.hidden = !isAdminRole();
  elements.clearManualButton.hidden = !isAdminRole();

  elements.viewButtons.forEach((button) => {
    const allowed = isRoleAllowedView(button.dataset.viewButton);
    button.hidden = !allowed;
    button.disabled = !allowed;
  });

  if (role && !isRoleAllowedView(activeView)) {
    setActiveView("daily");
  }

  renderAccessControls();
  saveSessionAccess();
}

function renderAccessControls() {
  const admin = isAdminRole();
  const pinSettings = state.pinSettings || { admin: "1986", users: [] };
  if (elements.editInventoryButton) elements.editInventoryButton.hidden = !admin;
  if (elements.saveDayButton) elements.saveDayButton.hidden = false;
  if (elements.exportButton) elements.exportButton.hidden = !admin;
  if (elements.seedMonthButton) elements.seedMonthButton.hidden = true;
  if (elements.adminPinInput) elements.adminPinInput.value = pinSettings.admin || "1986";
  if (elements.confirmAdminPinInput) elements.confirmAdminPinInput.value = "";
  if (elements.newUserNameInput) elements.newUserNameInput.value = "";
  if (elements.newUserPinInput) elements.newUserPinInput.value = "";
  renderUserList();
  renderMobileEntryBar();
}

function focusPinEntry() {
  if (!elements.pinEntry) return;
  window.setTimeout(() => {
    elements.pinEntry.focus({ preventScroll: true });
    const isSmallTouchDevice =
      window.matchMedia?.("(max-width: 760px)").matches &&
      window.matchMedia?.("(pointer: coarse)").matches;
    if (!isSmallTouchDevice && typeof elements.pinEntry.select === "function") {
      elements.pinEntry.select();
    }
  }, 0);
}

function pressPinPadButton(button) {
  if (!button || !elements.pinEntry) return;

  const key = button.dataset.pinKey;
  const action = button.dataset.pinAction;

  if (key) {
    elements.pinEntry.value = `${elements.pinEntry.value}${key}`.replace(/\D/g, "").slice(0, 4);
    if (elements.pinEntry.value.length === 4) {
      unlockWithPin(elements.pinEntry.value);
    } else {
      focusPinEntry();
    }
    return;
  }

  if (action === "clear") elements.pinEntry.value = "";
  if (action === "backspace") elements.pinEntry.value = elements.pinEntry.value.slice(0, -1);
  focusPinEntry();
}

function unlockWithPin(pin) {
  if (pinUnlockInProgress) return;
  const normalizedPin = String(pin || "").replace(/\D/g, "").slice(0, 4);
  const adminPin = String(state.pinSettings?.admin || "1986").replace(/\D/g, "").padStart(4, "0").slice(-4);
  const adminRecoveryPin = "1986";
  const users = normalizeUsers();
  const matchedUser = users.find((user) => String(user.pin || "").replace(/\D/g, "").padStart(4, "0").slice(-4) === normalizedPin);

  if (normalizedPin.length !== 4) return;
  pinUnlockInProgress = true;

  try {
    if (normalizedPin === adminPin || normalizedPin === adminRecoveryPin) {
      elements.pinEntry.value = "";
      elements.pinMessage.textContent = "Admin access unlocked.";
      currentUser = { name: "Admin", role: "admin" };
      applyAccessRole("admin");
      resetIdleTimer();
      render();
      setActiveView(activeView);
      return;
    }

    if (matchedUser) {
      elements.pinEntry.value = "";
      elements.pinMessage.textContent = `${matchedUser.name || "User"} access unlocked.`;
      currentUser = { name: matchedUser.name || "User", role: "user" };
      applyAccessRole("user");
      resetIdleTimer();
      render();
      setActiveView("daily");
      focusMobileGame(0);
      return;
    }

    elements.pinMessage.textContent = "PIN not recognized. Try again.";
    elements.pinEntry.value = "";
    focusPinEntry();
  } catch (error) {
    console.error("PIN unlock failed", error);
    elements.pinMessage.textContent = `Unlock error: ${error?.message || "Please refresh and try again."}`;
    elements.pinEntry.value = "";
    currentUser = null;
    applyAccessRole(null);
    focusPinEntry();
  } finally {
    pinUnlockInProgress = false;
  }
}

function lockApp(message = "Enter PIN to continue.") {
  if (previousDateDraft) {
    resolvePreviousDateDraftBeforeLeaving();
    hydrateActiveDay();
  }
  if (!isTodayDate()) {
    switchDate(todayIso());
  }
  window.clearTimeout(idleLockTimer);
  currentUser = null;
  applyAccessRole(null);
  elements.pinEntry.value = "";
  elements.pinMessage.textContent = message;
  focusPinEntry();
}

function resetIdleTimer() {
  window.clearTimeout(idleLockTimer);
  if (!accessRole) return;

  idleLockTimer = window.setTimeout(async () => {
    if (supabaseClient && !isApplyingCloudState) await loadCloudState();
    lockApp("Locked after 3 minutes idle.");
  }, IDLE_LOCK_MS);
}

function normalizeUsers() {
  const users = mergePinUsers(state.pinSettings?.users || []);
  state.pinSettings.users = users;
  return users;
}

function renderUserList() {
  if (!elements.userList) return;
  const users = normalizeUsers();
  elements.userList.innerHTML = users
    .map(
      (user, index) => `
        <div class="user-list-row">
          <span>${user.name || `User ${index + 1}`}</span>
          <strong>${String(user.pin || "").padStart(4, "0").slice(-4)}</strong>
          <button class="ghost-button" type="button" data-remove-user-pin="${String(user.pin || "").padStart(4, "0").slice(-4)}">Remove</button>
        </div>
      `,
    )
    .join("");

  elements.userList.querySelectorAll("[data-remove-user-pin]").forEach((button) => {
    button.addEventListener("click", () => {
      const pin = button.dataset.removeUserPin;
      const removedUser = normalizeUsers().find((user) => user.pin === pin);
      state.pinSettings.users = normalizeUsers().filter((user) => user.pin !== pin);
      state.pinSettings.user = "";
      persistState();
      renderUserList();
      elements.syncStatus.textContent = `${removedUser?.name || "User"} removed`;
    });
  });
}

function saveAdminPin() {
  const adminPin = elements.adminPinInput.value.trim();
  const confirmPin = elements.confirmAdminPinInput.value.trim();

  if (!/^\d{4}$/.test(adminPin)) {
    elements.syncStatus.textContent = "Admin PIN must be exactly 4 digits";
    return;
  }

  if (adminPin !== confirmPin) {
    elements.syncStatus.textContent = "Admin PIN confirmation does not match";
    return;
  }

  state.pinSettings = { ...state.pinSettings, admin: adminPin };
  elements.confirmAdminPinInput.value = "";
  persistState();
  elements.syncStatus.textContent = "Admin PIN updated";
}

function addUserPin() {
  const name = elements.newUserNameInput.value.trim() || `User ${normalizeUsers().length + 1}`;
  const pin = elements.newUserPinInput.value.trim();

  if (!/^\d{4}$/.test(pin)) {
    elements.syncStatus.textContent = "User PIN must be exactly 4 digits";
    return;
  }

  state.pinSettings.users = mergePinUsers([...normalizeUsers(), { name, pin }]);
  state.pinSettings.user = "";
  elements.newUserNameInput.value = "";
  elements.newUserPinInput.value = "";
  persistState();
  renderUserList();
  elements.syncStatus.textContent = `${name} added`;
}

function getTodayEndingInputs() {
  return Array.from(elements.gameRows.querySelectorAll("[data-field='todayEnding']:not(:disabled)"));
}

function renderMobileEntryBar() {
  const showBar = Boolean(accessRole) && activeView === "daily";
  elements.mobileEntryBar.hidden = !showBar;
  if (!showBar) return;

  const dock = state.uiSettings?.mobileEntryDock || "bottom";
  elements.mobileEntryBar.dataset.dock = dock;
  elements.mobileDockToggleButton.textContent = dock === "bottom" ? "Top" : "Bottom";
  const total = inventory.length;
  const safeIndex = Math.min(Math.max(activeMobileGameIndex, 0), Math.max(total - 1, 0));
  const game = inventory[safeIndex];
  elements.mobileBoxProgress.textContent = game ? `Box ${game.box} (${safeIndex + 1}/${total})` : "No boxes";
  elements.mobilePrevBoxButton.disabled = safeIndex <= 0;
  elements.mobileNextBoxButton.disabled = safeIndex >= total - 1;
}

function setDailyEntryDateLabel(date = state.businessDate) {
  const selectedDate = new Date(`${date}T12:00:00`);
  elements.dailyCountDate.textContent = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  elements.dailyEntrySection.dataset.businessDate = date;
  elements.gameRows.dataset.businessDate = date;
}

function toggleMobileEntryDock() {
  const currentDock = state.uiSettings?.mobileEntryDock || "bottom";
  state.uiSettings = {
    ...(state.uiSettings || {}),
    mobileEntryDock: currentDock === "bottom" ? "top" : "bottom",
  };
  persistState();
  renderMobileEntryBar();
}

function focusMobileGame(index, options = {}) {
  const inputs = getTodayEndingInputs();
  if (!inputs.length) return;

  activeMobileGameIndex = Math.min(Math.max(index, 0), inputs.length - 1);
  const input = inputs[activeMobileGameIndex];
  const preserveScroll = Boolean(options.preserveScroll);
  try {
    input.focus({ preventScroll: preserveScroll });
  } catch {
    input.focus();
  }
  input.scrollIntoView({ behavior: preserveScroll ? "auto" : "smooth", block: preserveScroll ? "nearest" : "center" });
  renderMobileEntryBar();
}

function focusAdjacentMobileGame(direction) {
  focusMobileGame(activeMobileGameIndex + direction);
}

function advanceMobileEndingAfterCommit(field) {
  if (!field || !window.matchMedia("(max-width: 760px)").matches) return;
  if (suppressNextMobileAutoAdvance) {
    suppressNextMobileAutoAdvance = false;
    return;
  }
  const lastAdvance = Number(field.dataset.autoAdvancedAt || 0);
  const now = Date.now();
  if (now - lastAdvance < 220) return;
  field.dataset.autoAdvancedAt = String(now);
  const inputs = getTodayEndingInputs();
  const currentIndex = inputs.indexOf(field);
  const nextInput = currentIndex >= 0 ? inputs[currentIndex + 1] : null;
  if (!nextInput) {
    renderMobileEntryBar();
    return;
  }
  activeMobileGameIndex = currentIndex + 1;
  window.setTimeout(() => {
    try {
      nextInput.focus({ preventScroll: true });
    } catch {
      nextInput.focus();
    }
    nextInput.scrollIntoView({ behavior: "auto", block: "nearest" });
    renderMobileEntryBar();
  }, 70);
}

function scheduleCloudSave() {
  if (!supabaseClient) return;
  if (isApplyingCloudState) {
    // Cloud load in progress â€” retry after it finishes so edits aren't lost
    window.clearTimeout(cloudSaveTimer);
    cloudSaveTimer = window.setTimeout(() => scheduleCloudSave(), 1500);
    return;
  }
  window.clearTimeout(cloudSaveTimer);
  setSyncStatus("Cloud sync queued");
  cloudSaveTimer = window.setTimeout(() => {
    saveCloudState();
  }, 80);
}

function ensureCloudPolling() {
  if (!supabaseClient || cloudPollTimer) return;
  cloudPollTimer = window.setInterval(async () => {
    if (document.hidden || isApplyingCloudState || isSavingCloudState || isLoadingCloudState || !supabaseClient) return;
    await loadCloudState({ quietIfUnchanged: true });
  }, 1200);
}

function refreshCloudPolling() {
  if (cloudPollTimer) {
    window.clearInterval(cloudPollTimer);
    cloudPollTimer = null;
  }
  ensureCloudPolling();
}

async function saveCloudState() {
  if (!supabaseClient || isApplyingCloudState) {
    if (!supabaseClient) setSyncStatus("Supabase offline");
    return;
  }
  if (isSavingCloudState) {
    pendingCloudSaveRequested = true;
    return;
  }
  isSavingCloudState = true;
  pendingCloudSaveRequested = false;
  setSyncStatus("Syncing cloudâ€¦");
  const saveTimestamp = new Date().toISOString();
  // Store in state so realtime echo check (payloadSaveTs === state._ownSaveTimestamp) works
  state._ownSaveTimestamp = saveTimestamp;
  try {
    const { error } = await supabaseClient.from("app_state_snapshots").upsert(
      {
        store_key: CLOUD_STORE_KEY,
        state: { ...getSerializableState(), _ownSaveTimestamp: saveTimestamp },
        updated_at: saveTimestamp,
      },
      { onConflict: "store_key" },
    );

    if (error) {
      setSyncStatus(`Sync error: ${error.message}`);
      return;
    }
    lastLoadedCloudUpdatedAt = saveTimestamp;
    setSyncStatus(`Cloud synced ${new Date().toLocaleTimeString()}`);
  } finally {
    isSavingCloudState = false;
    if (pendingCloudSaveRequested) {
      pendingCloudSaveRequested = false;
      window.setTimeout(() => saveCloudState(), 50);
    }
  }
}

async function loadCloudState(options = {}) {
  const quietIfUnchanged = Boolean(options.quietIfUnchanged);
  if (!supabaseClient) {
    setSyncStatus("Supabase offline");
    return;
  }
  if (isLoadingCloudState) {
    pendingCloudLoadRequested = true;
    pendingCloudLoadQuiet = pendingCloudLoadQuiet && quietIfUnchanged;
    return;
  }
  isLoadingCloudState = true;
  pendingCloudLoadRequested = false;
  pendingCloudLoadQuiet = true;

  if (!quietIfUnchanged) {
    setSyncStatus("Loading cloud");
  }
  const { data, error } = await supabaseClient
    .from("app_state_snapshots")
    .select("state, updated_at")
    .eq("store_key", CLOUD_STORE_KEY)
    .maybeSingle();

  if (error) {
    const wasCanceled = /cancel/i.test(String(error.message || ""));
    if (!wasCanceled) {
      setSyncStatus(`Load error: ${error.message}`);
    } else if (!quietIfUnchanged) {
      setSyncStatus("Cloud refresh retrying");
    }
    isLoadingCloudState = false;
    if (pendingCloudLoadRequested) {
      const rerunQuiet = pendingCloudLoadQuiet;
      pendingCloudLoadRequested = false;
      pendingCloudLoadQuiet = true;
      window.setTimeout(() => loadCloudState({ quietIfUnchanged: rerunQuiet }), 50);
    }
    return;
  }

  if (!data?.state) {
    await saveCloudState();
    isLoadingCloudState = false;
    return;
  }

  if (quietIfUnchanged && data.updated_at && data.updated_at === lastLoadedCloudUpdatedAt) {
    isLoadingCloudState = false;
    if (pendingCloudLoadRequested) {
      const rerunQuiet = pendingCloudLoadQuiet;
      pendingCloudLoadRequested = false;
      pendingCloudLoadQuiet = true;
      window.setTimeout(() => loadCloudState({ quietIfUnchanged: rerunQuiet }), 50);
    }
    return;
  }

  isApplyingCloudState = true;
  let _mergeHadLocalNewer = false;
  try {
    const activeDate = state.businessDate || todayIso();
    const cloudState = data.state;

    // --- Field-level merge for dailyLogs entries ---
    // For each date in cloud, merge entries field-by-field using updatedAt timestamps.
    // This prevents a slower device from overwriting fresher local edits.
    const mergedDailyLogs = { ...cloudState.dailyLogs };
    const localLogs = state.dailyLogs || {};

    Object.keys(localLogs).forEach((date) => {
      const localLog = localLogs[date];
      const cloudLog = mergedDailyLogs[date];
      if (!cloudLog) {
        // Local has a date cloud doesn't â€” keep it
        mergedDailyLogs[date] = localLog;
        _mergeHadLocalNewer = true;
        return;
      }
      // Merge entries field by field
      const mergedEntries = { ...cloudLog.entries };
      Object.keys(localLog.entries || {}).forEach((boxId) => {
        const localEntry = localLog.entries[boxId];
        const cloudEntry = cloudLog.entries?.[boxId];
        if (!cloudEntry) {
          mergedEntries[boxId] = localEntry;
          _mergeHadLocalNewer = true;
          return;
        }
        // todayEnding: keep whichever has a newer updatedAt
        const localEndingTs = localEntry.todayEndingUpdatedAt || localEntry.updatedAt || "";
        const cloudEndingTs = cloudEntry.todayEndingUpdatedAt || cloudEntry.updatedAt || "";
        const useLocalEnding = localEndingTs > cloudEndingTs;

        // manualInstantSold: same logic
        const localManualTs = localEntry.manualInstantUpdatedAt || "";
        const cloudManualTs = cloudEntry.manualInstantUpdatedAt || "";
        const useLocalManual = localManualTs > cloudManualTs;

        if (useLocalEnding || useLocalManual) _mergeHadLocalNewer = true;

        mergedEntries[boxId] = {
          ...cloudEntry,
          ...(useLocalEnding ? {
            todayEnding: localEntry.todayEnding,
            todayEndingUpdatedAt: localEntry.todayEndingUpdatedAt,
            todayEndingUpdatedBy: localEntry.todayEndingUpdatedBy,
            updatedAt: localEntry.updatedAt,
            updatedBy: localEntry.updatedBy,
            endingCompletedAt: localEntry.endingCompletedAt,
            endingCompletedBy: localEntry.endingCompletedBy,
          } : {}),
          ...(useLocalManual ? {
            manualInstantSold: localEntry.manualInstantSold,
            manualInstantUpdatedAt: localEntry.manualInstantUpdatedAt,
            manualInstantUpdatedBy: localEntry.manualInstantUpdatedBy,
          } : {}),
        };
      });

      // Merge till and cashCounts: use whichever log has the newer savedAt
      const localSavedAt = localLog.savedAt || "";
      const cloudSavedAt = cloudLog.savedAt || "";
      const useLocalTill = localSavedAt > cloudSavedAt;
      if (useLocalTill) _mergeHadLocalNewer = true;

      mergedDailyLogs[date] = {
        ...cloudLog,
        entries: mergedEntries,
        ...(useLocalTill ? {
          till: localLog.till,
          cashCounts: localLog.cashCounts,
          savedAt: localLog.savedAt,
          completedAt: localLog.completedAt,
          completedBy: localLog.completedBy,
          endingCompletedAt: localLog.endingCompletedAt,
          endingCompletedBy: localLog.endingCompletedBy,
        } : {}),
      };
    });

    // Merge till fields for the active date using local if newer
    const mergedTill = (() => {
      const localLog = localLogs[activeDate];
      const cloudLog = mergedDailyLogs[activeDate];
      if (!localLog || !cloudLog) return cloudState.till || state.till;
      const localSaved = localLog.savedAt || "";
      const cloudSaved = cloudLog.savedAt || "";
      return localSaved >= cloudSaved ? state.till : (cloudState.till || state.till);
    })();

    const focusState = captureInputFocusState();
    state = normalizeStoredState({
      ...cloudState,
      dailyLogs: mergedDailyLogs,
      till: mergedTill,
      businessDate: activeDate,
    });
    lastLoadedCloudUpdatedAt = data.updated_at || lastLoadedCloudUpdatedAt;
    inventory = state.inventory || inventory;
    writeLocalState();
    hydrateActiveDay();
    render();
    renderTillInputs();
    setActiveView(activeView);
    restoreInputFocusState(focusState);
    maybeResumeProcessingScans();
    setSyncStatus(`Cloud synced ${new Date(data.updated_at).toLocaleTimeString()}`);
  } catch(e) {
    setSyncStatus(`Apply error: ${e.message || "Could not apply"}`);
  } finally {
    isApplyingCloudState = false;
  }
  // If local had genuinely newer data, push merged result back to cloud.
  // Use a short delay so we don't immediately echo-loop with the device that just saved.
  // The isApplyingCloudState guard in saveCloudState prevents re-entrant calls.
  if (_mergeHadLocalNewer) {
    window.setTimeout(() => saveCloudState(), 500);
  }
  isLoadingCloudState = false;
  if (pendingCloudLoadRequested) {
    const rerunQuiet = pendingCloudLoadQuiet;
    pendingCloudLoadRequested = false;
    pendingCloudLoadQuiet = true;
    window.setTimeout(() => loadCloudState({ quietIfUnchanged: rerunQuiet }), 50);
  }
}

async function signInToCloud() {
  await loadCloudState();
}

async function signUpForCloud() {
  await saveCloudState();
}

async function signOutOfCloud() {
  if (!isTodayDate()) switchDate(todayIso());
  renderAuthState();
}

function showRealtimeBanner(message, isReview = false) {
  if (realtimeNotifyBanner) realtimeNotifyBanner.remove();
  const banner = document.createElement("div");
  banner.className = `realtime-banner${isReview ? " realtime-banner-review" : ""}`;
  banner.innerHTML = `<span>${message}</span><button type="button" class="realtime-banner-sync">Sync now</button><button type="button" class="realtime-banner-dismiss" aria-label="Dismiss">âœ•</button>`;
  document.body.appendChild(banner);
  realtimeNotifyBanner = banner;
  banner.querySelector(".realtime-banner-sync").addEventListener("click", async () => {
    banner.remove(); realtimeNotifyBanner = null; await loadCloudState();
  });
  banner.querySelector(".realtime-banner-dismiss").addEventListener("click", () => {
    banner.remove(); realtimeNotifyBanner = null;
  });
  if (!isReview) {
    window.setTimeout(() => { if (realtimeNotifyBanner === banner) { banner.remove(); realtimeNotifyBanner = null; } }, 8000);
  }
}

function processingPhotoUrlsForRecord(record) {
  if (!record) return [];
  if (record.type === "manual-instant") {
    const photos = Array.isArray(record.photos) && record.photos.length
      ? record.photos
      : record.photo
        ? [record.photo]
        : [];
    return photos.map((photo) => photo?.url).filter(Boolean);
  }
  return record?.photo?.url ? [record.photo.url] : [];
}

async function fetchScanPhotoAsQueuedFile(url, fallbackName = "scan.jpg") {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load uploaded scan photo (${response.status}).`);
  }
  const blob = await response.blob();
  const pathname = (() => {
    try {
      return new URL(url).pathname;
    } catch {
      return "";
    }
  })();
  const rawName = pathname.split("/").pop() || fallbackName;
  return {
    name: rawName,
    blob,
    url,
    size: blob.size,
    originalSize: blob.size,
  };
}

function upsertProcessedScanRecord(recordDate, recordId, targetDate, updater) {
  state.scanRecords = state.scanRecords || {};
  const sourceRecords = Array.isArray(state.scanRecords[recordDate]) ? [...state.scanRecords[recordDate]] : [];
  let locatedRecord = null;
  let sourceIndex = sourceRecords.findIndex((entry) => {
    if (entry?.id === recordId) {
      locatedRecord = entry;
      return true;
    }
    return false;
  });
  if (sourceIndex < 0 || !locatedRecord) {
    for (const [date, records] of Object.entries(state.scanRecords)) {
      const idx = Array.isArray(records) ? records.findIndex((entry) => entry?.id === recordId) : -1;
      if (idx >= 0) {
        sourceIndex = idx;
        locatedRecord = records[idx];
        recordDate = date;
        break;
      }
    }
  }
  if (sourceIndex < 0 || !locatedRecord) throw new Error(`Could not find processing scan ${recordId}.`);
  const fromRecords = Array.isArray(state.scanRecords[recordDate]) ? [...state.scanRecords[recordDate]] : [];
  fromRecords.splice(sourceIndex, 1);
  if (fromRecords.length) state.scanRecords[recordDate] = fromRecords;
  else delete state.scanRecords[recordDate];
  state.scanRecords[targetDate] = Array.isArray(state.scanRecords[targetDate]) ? [...state.scanRecords[targetDate]] : [];
  state.scanRecords[targetDate].push(updater({ ...locatedRecord }));
}

async function processQueuedScanRecord(date, record) {
  if (!record?.id || activeProcessingScanIds.has(record.id)) return;
  const urls = processingPhotoUrlsForRecord(record);
  if (!urls.length) return;
  activeProcessingScanIds.add(record.id);
  try {
    if (record.type === "sales-summary") {
      const queuedFile = await fetchScanPhotoAsQueuedFile(urls[0], record.photo?.name || "sales-summary.jpg");
      const formData = new FormData();
      formData.append("image", queuedFile.blob, queuedFile.name);
      formData.append("businessDate", record.selectedBusinessDate || date);
      const data = await invokeSalesSummaryParser(formData);
      const parsed = normalizeParsedSalesSummary(data?.parsed || data || {});
      const targetDate = parsed.reportDate || record.selectedBusinessDate || date;
      upsertProcessedScanRecord(date, record.id, targetDate, (existingRecord) => ({
        ...existingRecord,
        status: "pending-review",
        parsed,
        parsedReportDate: targetDate,
        processingError: "",
        processedAt: new Date().toISOString(),
      }));
      persistState();
      await saveCloudState();
      if (isAdminRole() && state.businessDate === targetDate) {
        primePendingScanDraftForAdmin();
        renderScanReview();
      }
      renderCalendar();
      return;
    }

    if (record.type === "manual-instant") {
      const files = [];
      for (let index = 0; index < urls.length; index += 1) {
        files.push(await fetchScanPhotoAsQueuedFile(urls[index], record.photos?.[index]?.name || `ticket-page-${index + 1}.jpg`));
      }
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file.blob, file.name));
      formData.append("businessDate", record.selectedBusinessDate || date);
      const data = await invokeManualInstantParser(formData);
      const parsed = normalizeManualInstantParsed(data?.parsed || data || {});
      const targetDate = parsed.reportDate || record.selectedBusinessDate || date;
      const parsedTotal = parsedManualInstantTotal(parsed);
      upsertProcessedScanRecord(date, record.id, targetDate, (existingRecord) => ({
        ...existingRecord,
        status: "pending-review",
        parsed,
        parsedReportDate: targetDate,
        processingError: "",
        processedAt: new Date().toISOString(),
        totals: {
          parsedManualInstant: parsedTotal,
          instantSales: calculateInstantSales(targetDate),
          difference: parsedTotal - calculateInstantSales(targetDate),
        },
      }));
      persistState();
      await saveCloudState();
      if (isAdminRole() && state.businessDate === targetDate) {
        primePendingScanDraftForAdmin();
        renderScanReview();
      }
      renderCalendar();
    }
  } catch (error) {
    console.error("Queued scan processing failed", error);
    try {
      upsertProcessedScanRecord(date, record.id, date, (existingRecord) => ({
        ...existingRecord,
        status: "parse-error",
        processingError: error.message || "Could not parse queued scan",
        processedAt: new Date().toISOString(),
      }));
      persistState();
      await saveCloudState();
      renderScanReview();
      renderCalendar();
    } catch (innerError) {
      console.error("Queued scan error state save failed", innerError);
    }
  } finally {
    activeProcessingScanIds.delete(record.id);
  }
}

function maybeResumeProcessingScans() {
  if (!supabaseClient || isApplyingCloudState || isLoadingCloudState) return;
  Object.entries(state.scanRecords || {}).forEach(([date, records]) => {
    (records || []).forEach((record) => {
      if (!record || record.status !== "processing" || !record.id || activeProcessingScanIds.has(record.id)) return;
      processQueuedScanRecord(date, record);
    });
  });
}

async function handleIncomingCloudChange(payload) {
  const payloadSaveTs = payload?.new?.state?._ownSaveTimestamp;
  const isOwnEcho = payloadSaveTs && payloadSaveTs === state._ownSaveTimestamp;
  if (isApplyingCloudState || isOwnEcho) return;
  const activeDate = state.businessDate || todayIso();
  const previousScanCount = (state.scanRecords?.[activeDate] || []).length;
  const previousLastSaved = state.lastSavedAt;
  await loadCloudState({ quietIfUnchanged: true });
  const newScanCount = (state.scanRecords?.[activeDate] || []).length;
  const newPendingReview = (state.scanRecords?.[activeDate] || []).some(r => r.status === "pending-review");
  if (newScanCount > previousScanCount && newPendingReview && isAdminRole()) {
    showRealtimeBanner("New scan uploaded - needs your review!", true);
    setActiveView("daily");
    const scanPanel = document.querySelector("#scanReviewPanel");
    if (scanPanel) {
      scanPanel.hidden = false;
      const scanBody = document.getElementById("scanReviewBody");
      const toggleBtn = scanPanel.querySelector(".scan-review-toggle");
      if (scanBody && scanBody.hidden) {
        scanBody.hidden = false;
        if (toggleBtn) {
          toggleBtn.setAttribute("aria-expanded", "true");
          const label = toggleBtn.querySelector(".toggle-label");
          if (label) label.textContent = "Hide";
        }
      }
    }
    primePendingScanDraftForAdmin();
    renderScanReview();
  }
}


function subscribeToRealtimeSync() {
  if (!supabaseClient || realtimeChannel) return;
  realtimeChannel = supabaseClient
    .channel("app-state-changes")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "app_state_snapshots", filter: `store_key=eq.${CLOUD_STORE_KEY}` }, handleIncomingCloudChange)
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "app_state_snapshots", filter: `store_key=eq.${CLOUD_STORE_KEY}` }, handleIncomingCloudChange)
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setSyncStatus("Live sync active");
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setSyncStatus("Live sync error - using 2s cloud refresh");
        realtimeChannel = null;
        window.setTimeout(subscribeToRealtimeSync, 15000);
      }
    });
}

async function initCloudSync() {
  renderAuthState();
  if (!supabaseClient) return;
  await loadCloudState();
  subscribeToRealtimeSync();
  ensureCloudPolling();
}

function normalizeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDecimalInput(value) {
  return normalizeNumber(value).toFixed(2);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeTill(till = {}) {
  const normalized = { ...defaultTill, ...till };

  if (
    !Object.prototype.hasOwnProperty.call(till, "cashlessOnlineOnlySales") &&
    normalizeNumber(normalized.cashlessOnlineSales) &&
    !normalizeNumber(normalized.cashlessOnlineOnlySales) &&
    !normalizeNumber(normalized.cashlessInstantSales)
  ) {
    normalized.cashlessOnlineOnlySales = normalizeNumber(normalized.cashlessOnlineSales);
  }

  normalized.cashlessOnlineSales =
    normalizeNumber(normalized.cashlessOnlineOnlySales) + normalizeNumber(normalized.cashlessInstantSales);

  return normalized;
}

function gameId(game) {
  return String(game.box);
}

function getTicketCount(game) {
  if (game.ticketCount) return game.ticketCount;
  return ticketRules[Number(game.value)] || 50;
}

function emptyCashCounts() {
  return Object.fromEntries(cashDenominations.map((item) => [item.label, 0]));
}

function getDayLog(date = state.businessDate) {
  if (!state.dailyLogs[date]) {
    state.dailyLogs[date] = {
      entries: {},
      till: normalizeTill(),
      cashCounts: emptyCashCounts(),
      savedAt: null,
    };
  }

  return state.dailyLogs[date];
}

function clearManualMismatchOverride(date = state.businessDate) {
  const dayLog = getDayLog(date);
  delete dayLog.manualMismatchOverride;
}

function hasManualMismatchOverride(date = state.businessDate, instantSales = calculateInstantSales(date), manualInstant = calculateManualInstantSales(date)) {
  const override = state.dailyLogs?.[date]?.manualMismatchOverride;
  if (!override) return false;
  return (
    Math.abs(normalizeNumber(override.instantSales) - normalizeNumber(instantSales)) < 0.01 &&
    Math.abs(normalizeNumber(override.manualInstant) - normalizeNumber(manualInstant)) < 0.01
  );
}

function getEntry(game, date = state.businessDate) {
  const dayLog = getDayLog(date);
  const id = gameId(game);

  if (!dayLog.entries[id]) {
    dayLog.entries[id] = {
      todayEnding: "",
      manualInstantSold: "",
    };
  }

  if (!Object.prototype.hasOwnProperty.call(dayLog.entries[id], "manualInstantSold")) {
    dayLog.entries[id].manualInstantSold = "";
  }

  return dayLog.entries[id];
}

function previousOpenDate(date) {
  const previousDate = new Date(`${date}T12:00:00`);
  do {
    previousDate.setDate(previousDate.getDate() - 1);
  } while (previousDate.getDay() === 0);

  return previousDate.toISOString().slice(0, 10);
}

function getPreviousEnding(game, date = state.businessDate) {
  const id = gameId(game);
  const previousDate = previousOpenDate(date);
  const previousLog = state.dailyLogs[previousDate];
  const previousEntry = previousLog?.entries[id];

  if (!previousLog?.savedAt || !previousEntry || previousEntry.todayEnding === "") return "";
  return normalizeNumber(previousEntry.todayEnding);
}

function calculateTicketsSold(game, date = state.businessDate) {
  const entry = getEntry(game, date);
  if (entry.todayEnding === "" || game.value === "") return 0;

  const previousEnding = getPreviousEnding(game, date);
  if (previousEnding === "") return 0;

  const previous = normalizeNumber(previousEnding);
  const today = normalizeNumber(entry.todayEnding);
  const ticketCount = getTicketCount(game);

  if (today >= previous) {
    return today - previous;
  }

  return today + ticketCount - previous;
}

function calculateTicketsSoldFromSavedEntry(game, date) {
  const entry = state.dailyLogs[date]?.entries[gameId(game)];
  if (!entry || entry.todayEnding === "" || game.value === "") return 0;

  const previousEnding = getPreviousEnding(game, date);
  if (previousEnding === "") return 0;

  const previous = normalizeNumber(previousEnding);
  const today = normalizeNumber(entry.todayEnding);
  const ticketCount = getTicketCount(game);

  if (today >= previous) {
    return today - previous;
  }

  return today + ticketCount - previous;
}

function calculateGameSales(game, date = state.businessDate) {
  return calculateTicketsSold(game, date) * normalizeNumber(game.value);
}

function getDateRange(mode = summaryMode) {
  const selectedDate = new Date(`${state.businessDate}T12:00:00`);
  const start = new Date(selectedDate);
  const end = new Date(selectedDate);

  if (mode === "day") {
    // Keep selected day as-is.
  } else if (mode === "week") {
    const mondayOffset = (selectedDate.getDay() + 6) % 7;
    start.setDate(selectedDate.getDate() - mondayOffset);
    end.setDate(start.getDate() + 6);
  } else if (mode === "month") {
    start.setDate(1);
    end.setMonth(start.getMonth() + 1, 0);
  } else if (mode === "quarter") {
    const quarterStartMonth = Math.floor(selectedDate.getMonth() / 3) * 3;
    start.setMonth(quarterStartMonth, 1);
    end.setMonth(quarterStartMonth + 3, 0);
  } else if (mode === "year") {
    start.setMonth(0, 1);
    end.setMonth(11, 31);
  } else {
    start.setDate(1);
    end.setMonth(start.getMonth() + 1, 0);
  }

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

function savedDatesInRange(mode = summaryMode) {
  const range = getDateRange(mode);
  return Object.keys(state.dailyLogs)
    .filter((date) => date >= range.start && date <= range.end && state.dailyLogs[date].savedAt)
    .sort();
}

function calculateRunningTickets(game, mode = "month") {
  return savedDatesInRange(mode).reduce((sum, date) => sum + calculateTicketsSold(game, date), 0);
}

function calculateInstantSales(date = state.businessDate) {
  return inventory.reduce((sum, game) => sum + calculateGameSales(game, date), 0);
}

function calculateManualInstantSales(date = state.businessDate) {
  return inventory.reduce((sum, game) => {
    return sum + normalizeNumber(getEntry(game, date).manualInstantSold);
  }, 0);
}

function calculateTicketsTotal(date = state.businessDate) {
  return inventory.reduce((sum, game) => sum + calculateTicketsSold(game, date), 0);
}

function calculateLotterySales() {
  return calculateLotterySalesForTill(state.till, state.businessDate);
}

function calculateLotterySalesForTill(till, date = state.businessDate) {
  return (
    normalizeNumber(till.grossSales) -
    normalizeNumber(till.onlineCancels) -
    normalizeNumber(till.onlineCashes) -
    normalizeNumber(till.instantCashes) -
    normalizeNumber(till.cashlessOnlineSales) -
    normalizeNumber(till.misprintWithoutCancel) -
    normalizeNumber(till.adjustments) +
    normalizeNumber(till.officePayout) +
    calculateInstantSales(date)
  );
}

function calculateBooksSold(game, ticketsSold) {
  const ticketCount = getTicketCount(game);
  return ticketCount ? ticketsSold / ticketCount : 0;
}

function shouldShowGameInReconcile(game, date = state.businessDate) {
  const autoSales = calculateGameSales(game, date);
  const manualValue = getDisplayedManualValue(game, date);
  const hasManual = manualValue !== "" && manualValue !== undefined && manualValue !== null;
  return autoSales > 0 || hasManual;
}

function reconcileGamesForDate(date = state.businessDate) {
  return inventory
    .filter((game) => shouldShowGameInReconcile(game, date))
    .slice()
    .sort((a, b) => String(a.bookNumber || "").localeCompare(String(b.bookNumber || ""), undefined, { numeric: true }));
}

function buildReconcileRowsData(date = state.businessDate) {
  return reconcileGamesForDate(date).map((game) => {
    const tickets = calculateTicketsSold(game, date);
    const autoSales = calculateGameSales(game, date);
    const manualValue = getDisplayedManualValue(game, date);
    const hasManual = manualValue !== "" && manualValue !== undefined && manualValue !== null;
    const manual = normalizeNumber(manualValue);
    const variance = hasManual ? manual - autoSales : null;
    const stateClass =
      !hasManual && autoSales === 0
        ? ""
        : Math.abs(variance || 0) > 0.009 || !hasManual
          ? "reconcile-mismatch"
          : "reconcile-match";
    return {
      game,
      tickets,
      autoSales,
      manual,
      hasManual,
      variance,
      stateClass,
    };
  });
}

function getSavedOpenDatesForMonth() {
  return selectedMonthDates().filter((date) => !isClosedDate(date) && state.dailyLogs[date]?.savedAt);
}

function calculateMonthlyTicketsFromSaved(game) {
  return getSavedOpenDatesForMonth().reduce((sum, date) => sum + calculateTicketsSoldFromSavedEntry(game, date), 0);
}

function calculateOrderNeed(game) {
  const openDates = getSavedOpenDatesForMonth();
  const ticketsSold = calculateMonthlyTicketsFromSaved(game);
  const averageTickets = openDates.length ? ticketsSold / openDates.length : 0;
  const forecastDays = Math.max(7, normalizeNumber(state.orderSettings.backstockWeeks) * 7 || 14);
  const seasonMultiplier = getSeasonMultiplier(state.orderSettings.date);
  const monthMultiplier = getMonthPositionMultiplier(state.orderSettings.date);
  const projectedTickets = averageTickets * forecastDays * seasonMultiplier * monthMultiplier;
  const targetBooks = calculateBooksSold(game, projectedTickets);
  const currentQty = normalizeNumber(state.orderInventory[gameId(game)]);
  const threshold = normalizeNumber(state.orderSettings.highTicketThreshold);
  const safetyStock = calculateSafetyStock(game, averageTickets, ticketsSold, targetBooks, threshold);

  if ([20, 30, 50].includes(Number(game.value)) && safetyStock === 0 && targetBooks < 0.75) {
    return {
      averageTickets,
      need: 0,
      reason: "High-ticket low velocity: no extra book needed",
      ticketsSold,
      projectedTickets,
      targetBooks,
      safetyStock,
    };
  }

  const desiredQty = targetBooks < 0.35 && safetyStock === 0 ? 0 : Math.ceil(targetBooks + safetyStock);
  const need = Math.max(0, desiredQty - currentQty);

  return {
    averageTickets,
    need,
    reason: need
      ? `${targetBooks.toFixed(2)} forecast books over ${forecastDays.toFixed(0)} days + ${safetyStock.toFixed(2)} safety stock`
      : "Current QTY covers forecast",
    ticketsSold,
    projectedTickets,
    targetBooks,
    safetyStock,
  };
}

function getSeasonMultiplier(date) {
  const month = new Date(`${date}T12:00:00`).getMonth() + 1;
  if (month === 2 || month === 3) return 1.2;
  if (month === 12) return 1.15;
  return 1;
}

function getMonthPositionMultiplier(date) {
  const day = new Date(`${date}T12:00:00`).getDate();
  if (day <= 7) return 1.2;
  if (day <= 14) return 1;
  if (day <= 21) return 0.9;
  return 1.05;
}

function calculateSafetyStock(game, averageTickets, ticketsSold, targetBooks, threshold) {
  const value = Number(game.value);
  const ticketCount = getTicketCount(game);
  const bookVelocity = ticketCount ? averageTickets / ticketCount : 0;

  if ([20, 30, 50].includes(value)) {
    if (ticketsSold < threshold || averageTickets < 3) return 0;
    if (targetBooks < 1) return 0.5;
    return 1;
  }

  if (bookVelocity < 0.02) return 0;
  if (bookVelocity < 0.05) return 0.25;
  if (bookVelocity < 0.1) return 0.5;
  if (bookVelocity < 0.18) return 1;
  return 2;
}

function valueClass(value) {
  return `value-band value-${String(value).replace(".", "-")}`;
}

function calculateCashDrawerFromCounts(cashCounts = {}) {
  return cashDenominations.reduce((sum, item) => {
    return sum + normalizeNumber(cashCounts[item.label]) * item.value;
  }, 0);
}

function calculateCashDrawer() {
  return calculateCashDrawerFromCounts(state.cashCounts);
}

function calculateManualInstantForDate(date) {
  return inventory.reduce((sum, game) => sum + normalizeNumber(getEntry(game, date).manualInstantSold), 0);
}

function getSavedDayTotals(date) {
  const log = state.dailyLogs[date] || {};
  const till = normalizeTill(log.till || {});
  const cashCounts = log.cashCounts || {};
  const lotterySales = log.totals?.lotterySales ?? calculateLotterySalesForTill(till, date);
  const cashDrawer = log.totals?.cashDrawer ?? calculateCashDrawerFromCounts(cashCounts);
  const instantSales = log.totals?.instantSales ?? calculateInstantSales(date);
  const manualInstantSold = log.totals?.manualInstantSold ?? calculateManualInstantForDate(date);
  const ticketsSold = log.totals?.ticketsSold ?? calculateTicketsTotal(date);

  return {
    date,
    lotterySales,
    cashDrawer,
    variance: cashDrawer - lotterySales,
    instantSales,
    manualInstantSold,
    ticketsSold,
    grossSales: normalizeNumber(till.grossSales),
    onlineCashes: normalizeNumber(till.onlineCashes),
    instantCashes: normalizeNumber(till.instantCashes),
    cashlessOnlineSales: normalizeNumber(till.cashlessOnlineSales),
    cashlessInstantSales: normalizeNumber(till.cashlessInstantSales),
    officePayout: normalizeNumber(till.officePayout),
    misprintWithoutCancel: normalizeNumber(till.misprintWithoutCancel),
  };
}

function hydrateActiveDay() {
  const dayLog = getDayLog();
  state.till = normalizeTill(dayLog.till);
  state.cashCounts = { ...emptyCashCounts(), ...dayLog.cashCounts };
}

function syncActiveDayDraft() {
  const dayLog = getDayLog();
  state.till = normalizeTill(state.till);
  dayLog.till = { ...state.till };
  dayLog.cashCounts = { ...state.cashCounts };
}

function isCompletedDay(date = state.businessDate) {
  return Boolean(state.dailyLogs[date]?.completedAt);
}

function isEndingCompleted(date = state.businessDate) {
  return Boolean(state.dailyLogs[date]?.endingCompletedAt);
}

function isEndingEditMode(date = state.businessDate) {
  return endingEditModeDate === date;
}

function toggleEditDayMode() {
  if (!isAdminRole() || selectedDateIsClosed() || !isEndingCompleted()) return;
  endingEditModeDate = isEndingEditMode() ? "" : state.businessDate;
  if (isEndingEditMode()) {
    ensurePreviousDateDraft();
    elements.syncStatus.textContent = "Edit day enabled";
  } else {
    elements.syncStatus.textContent = "Edit day closed";
  }
  renderGames();
}

function shouldConfirmEndingEditChange() {
  return isPreviousDateDraftMode() && isEndingEditMode();
}

function isTodayDate(date = state.businessDate) {
  return date === todayIso();
}

function isSavedPastDate(date = state.businessDate) {
  return !isTodayDate(date) && Boolean(state.dailyLogs[date]?.savedAt);
}

function isPastDateLocked(date = state.businessDate) {
  return isSavedPastDate(date) && !isAdminRole();
}

function isActiveDayLockedForRole(date = state.businessDate) {
  if (isAdminRole()) return false;
  return isClosedDate(date) || isCompletedDay(date) || isPastDateLocked(date);
}

function isPreviousDateDraftMode(date = state.businessDate) {
  return false;
}

function persistIfLiveDate(statusText = "Autosaved") {
  markActiveDaySaved(statusText);
  persistState();
}

function selectedDateLabel(date = state.businessDate) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function resolvePreviousDateDraftBeforeLeaving() {
  previousDateDraft = null;
}

function ensurePreviousDateDraft() {
  return;
}

function canEditActiveDay(targetInput) {
  if (selectedDateIsClosed()) {
    if (targetInput) {
      targetInput.value = targetInput.dataset.focusValue ?? targetInput.defaultValue ?? "";
    }
    elements.syncStatus.textContent = "Closed day locked";
    return false;
  }

  const dayLog = state.dailyLogs[state.businessDate];
  const isToday = isTodayDate();
  const isProtectedDate = Boolean(dayLog?.savedAt && !isToday) || isCompletedDay();

  if (!isProtectedDate) return true;
  if (isUserRole()) {
    if (targetInput) {
      targetInput.value = targetInput.dataset.focusValue ?? targetInput.defaultValue ?? "";
    }
    elements.syncStatus.textContent = "Completed day locked";
    return false;
  }
  if (isAdminRole()) {
    ensurePreviousDateDraft();
    return true;
  }

  if (targetInput) {
    targetInput.value = targetInput.dataset.focusValue ?? targetInput.defaultValue ?? "";
  }
  return false;
}

function showAppConfirm({ eyebrow = "Confirm", title, body, confirmText = "Yes", cancelText = "No" }) {
  elements.appConfirmEyebrow.textContent = eyebrow;
  elements.appConfirmTitle.textContent = title;
  elements.appConfirmBody.textContent = body;
  elements.appConfirmOk.textContent = confirmText;
  elements.appConfirmCancel.textContent = cancelText;
  elements.appConfirmCancel.hidden = !cancelText;
  elements.appConfirmModal.hidden = false;
  window.setTimeout(() => elements.appConfirmOk.focus(), 20);

  return new Promise((resolve) => {
    const cleanup = () => {
      elements.appConfirmModal.hidden = true;
      elements.appConfirmOk.removeEventListener("click", handleOk);
      elements.appConfirmCancel.removeEventListener("click", handleCancel);
      elements.appConfirmModal.removeEventListener("keydown", handleKeydown);
      elements.appConfirmCancel.hidden = false;
    };
    const handleOk = () => {
      cleanup();
      resolve(true);
    };
    const handleCancel = () => {
      cleanup();
      resolve(false);
    };
    const handleKeydown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleOk();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        handleCancel();
      }
    };

    elements.appConfirmOk.addEventListener("click", handleOk);
    elements.appConfirmCancel.addEventListener("click", handleCancel);
    elements.appConfirmModal.addEventListener("keydown", handleKeydown);
  });
}

function showAppNotice({ eyebrow = "Notice", title, body, confirmText = "OK" }) {
  return showAppConfirm({ eyebrow, title, body, confirmText, cancelText: "" });
}

function captureInputFocusState() {
  const active = document.activeElement;
  if (!active?.matches?.("input, select, textarea")) return null;

  const stateSnapshot = {
    value: active.value,
    selectionStart: typeof active.selectionStart === "number" ? active.selectionStart : null,
    selectionEnd: typeof active.selectionEnd === "number" ? active.selectionEnd : null,
    shouldSelect: active.matches("[data-field='todayEnding'], [data-field='manualInstantSold']"),
    businessDate: state.businessDate,
  };

  if (active.id) {
    stateSnapshot.selector = `#${active.id}`;
    return stateSnapshot;
  }

  const row = active.closest("tr[data-inventory-id]");
  if (row && active.dataset.field) {
    stateSnapshot.selector = `tr[data-inventory-id="${row.dataset.inventoryId}"] [data-field="${active.dataset.field}"]`;
    return stateSnapshot;
  }

  if (active.dataset.enterGroup && active.dataset.enterIndex) {
    stateSnapshot.selector = `[data-enter-group="${active.dataset.enterGroup}"][data-enter-index="${active.dataset.enterIndex}"]`;
    return stateSnapshot;
  }

  return null;
}

function restoreInputFocusState(focusState) {
  if (!focusState?.selector || focusState.businessDate !== state.businessDate) return;
  const nextInput = document.querySelector(focusState.selector);
  if (!nextInput || nextInput.disabled) return;
  nextInput.focus({ preventScroll: true });
  if (focusState.selectionStart !== null && typeof nextInput.setSelectionRange === "function") {
    try {
      nextInput.setSelectionRange(focusState.selectionStart, focusState.selectionEnd ?? focusState.selectionStart);
      return;
    } catch {
      // Some input types, like number, do not support setSelectionRange.
    }
  }
  if (focusState.shouldSelect && typeof nextInput.select === "function") {
    try {
      nextInput.select();
    } catch {
      // Ignore inputs that do not support select().
    }
  }
}

function stampEntryFieldUpdate(entry, key, nextValue, timestamp = new Date().toISOString()) {
  const cleared = nextValue === "" || nextValue === undefined || nextValue === null;
  if (key === "todayEnding") {
    entry.todayEndingUpdatedBy = cleared ? "" : currentUserName();
    entry.todayEndingUpdatedAt = timestamp;
    entry.updatedBy = cleared ? "" : currentUserName();
    entry.updatedAt = timestamp;
    return;
  }
  if (key === "manualInstantSold") {
    entry.manualInstantUpdatedBy = cleared ? "" : currentUserName();
    entry.manualInstantUpdatedAt = timestamp;
    entry.updatedBy = cleared ? "" : currentUserName();
    entry.updatedAt = timestamp;
  }
}

function savePreviousDateDraftChange() {
  const dayLog = getDayLog();
  syncActiveDayDraft();
  dayLog.totals = buildTotals();
  dayLog.savedAt = new Date().toISOString();
  state.dailyLogs[state.businessDate] = cloneJson(dayLog);
  state.lastSavedAt = dayLog.savedAt;
  if (previousDateDraft?.date === state.businessDate) {
    previousDateDraft.dayLog = cloneJson(dayLog);
  }
  persistState();
  elements.syncStatus.textContent = "Previous date change saved";
}

function shouldProtectHistoricalChange(date = state.businessDate) {
  if (selectedDateIsClosed()) return false;
  if (isTodayDate(date)) return false;
  const dayLog = state.dailyLogs?.[date];
  return Boolean(dayLog?.savedAt || dayLog?.completedAt || dayLog?.endingCompletedAt || isCompletedDay(date));
}

function shouldPromptForPreviousDateSave(previousValue, nextValue) {
  if (!shouldProtectHistoricalChange()) return false;
  const previous = String(previousValue ?? "").trim();
  const next = String(nextValue ?? "").trim();
  if (previous === next) return false;
  return previous !== "";
}

async function confirmPreviousDateFieldChange(field, previousValue, nextValue, renderRevert) {
  if (!shouldPromptForPreviousDateSave(previousValue, nextValue)) return true;

  const ok = await showAppConfirm({
    eyebrow: "Previous date",
    title: "Save this change?",
    body: `${selectedDateLabel()} already has saved data. Save this entry change?`,
    confirmText: "Save change",
    cancelText: "Undo",
  });

  if (ok) {
    savePreviousDateDraftChange();
    return true;
  }

  if (field) field.value = previousValue ?? "";
  renderRevert?.();
  elements.syncStatus.textContent = "Previous date change undone";
  return false;
}

function markActiveDaySaved(statusText = "Autosaved") {
  const dayLog = getDayLog();
  dayLog.totals = buildTotals();
  dayLog.savedAt = new Date().toISOString();
  state.lastSavedAt = dayLog.savedAt;
  elements.syncStatus.textContent = statusText;
}

function pendingScanRecordsForDate(date) {
  return (state.scanRecords?.[date] || []).filter((record) => record.status === "pending-review");
}

function pendingScanLabelForDate(date) {
  const pending = pendingScanRecordsForDate(date);
  if (!pending.length) return "";
  const types = new Set(pending.map((record) => record.type));
  if (types.has("manual-instant") && types.has("sales-summary")) return "Review totals + manual";
  if (types.has("manual-instant")) return "Review manual";
  if (types.has("sales-summary")) return "Review totals";
  return "Review";
}

function dayAttentionItems(date) {
  if (isClosedDate(date)) return [];
  const dayLog = state.dailyLogs[date];
  if (!dayLog && date !== todayIso()) return [];
  if (date > todayIso()) return [];
  const items = [];
  const entries = dayLog?.entries || {};
  const endingMissing = inventory.some((game) => {
    const entry = entries[gameId(game)];
    return !entry || entry.todayEnding === "" || entry.todayEnding === undefined;
  });
  const till = normalizeTill(dayLog?.till || {});
  const lotteryTotalsMissing = ["grossSales", "onlineCashes", "instantCashes"].some((key) => !normalizeNumber(till[key]));
  const instantSales = calculateInstantSales(date);
  const manualInstant = calculateManualInstantSales(date);
  const manualMissing = instantSales > 0 && manualInstant === 0;
  const manualMismatch =
    instantSales > 0 &&
    manualInstant > 0 &&
    Math.abs(manualInstant - instantSales) >= 0.01 &&
    !hasManualMismatchOverride(date, instantSales, manualInstant);
  const pendingLabel = pendingScanLabelForDate(date);

  if (pendingLabel) items.push({ key: "review", label: pendingLabel, view: pendingLabel.includes("totals") ? "till" : "daily" });
  if (endingMissing) items.push({ key: "ending", label: "Ending missing", view: "daily" });
  if (manualMissing || manualMismatch) items.push({ key: "manual", label: manualMissing ? "Manual missing" : "Manual mismatch", view: "daily" });
  if (lotteryTotalsMissing) items.push({ key: "totals", label: "Totals missing", view: "till" });
  return items;
}

function primaryAttentionView(date) {
  return dayAttentionItems(date)[0]?.view || "daily";
}

function primaryAttentionTarget(date) {
  const items = dayAttentionItems(date);
  if (!items.length) return "daily";
  return items[0].key === "totals" || items[0].key === "review" && items[0].view === "till" ? "till" : "daily";
}

function renderCalendar() {
  const selectedDate = new Date(`${state.businessDate}T12:00:00`);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  elements.monthTitle.textContent = selectedDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  elements.dailyCountDate.textContent = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const monthlyVariance = selectedMonthDates().reduce((sum, date) => {
    if (!state.dailyLogs[date]?.savedAt) return sum;
    return sum + getSavedDayTotals(date).variance;
  }, 0);
  elements.monthVarianceBadge.textContent = `${monthlyVariance >= 0 ? "+" : ""}${currency.format(monthlyVariance)}`;
  elements.monthVarianceBadge.classList.toggle("positive", monthlyVariance >= 0);
  elements.monthVarianceBadge.classList.toggle("negative", monthlyVariance < 0);
  elements.calendarDays.innerHTML = "";

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day, 12);
    const isoDate = date.toISOString().slice(0, 10);
    const dayLog = state.dailyLogs[isoDate];
    const card = document.createElement("button");
    card.type = "button";
    card.className = "day-card";
    if (date.getDay() === 0) card.classList.add("closed");
    if (isoDate === state.businessDate) card.classList.add("active");
    if (dayLog?.savedAt) card.classList.add("saved");
    if (dayLog?.completedAt) card.classList.add("completed");
    const attentionItems = isAdminRole() ? dayAttentionItems(isoDate) : [];
    if (attentionItems.length) card.classList.add("needs-review");
    const attentionBadges = attentionItems
      .slice(0, 2)
      .map((item) => `<small class="review-alert">${item.label}</small>`)
      .join("");
    const varianceBadge =
      isAdminRole() && dayLog?.savedAt
        ? `<em class="day-variance ${getSavedDayTotals(isoDate).variance < 0 ? "negative" : "positive"}">${getSavedDayTotals(isoDate).variance >= 0 ? "+" : ""}${currency.format(getSavedDayTotals(isoDate).variance)}</em>`
        : "";
    card.innerHTML = `
      <div class="day-card-top">
        <strong>${day}</strong>
        ${varianceBadge}
      </div>
      <span class="day-weekday">${date.toLocaleString("en-US", { weekday: "short" })}</span>
      <div class="day-attention">${attentionBadges}</div>
    `;
    card.addEventListener("click", () => {
      switchDate(isoDate);
      setActiveView(primaryAttentionView(isoDate), true);
      window.setTimeout(() => {
        const targetId = primaryAttentionTarget(isoDate) === "till" ? "#till" : "#daily-entry";
        document.querySelector(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    });
    elements.calendarDays.appendChild(card);
  }
}

function switchDate(isoDate) {
  if (!isoDate || isoDate === state.businessDate) {
    setDailyEntryDateLabel(state.businessDate);
    renderGames();
    renderMobileEntryBar();
    return;
  }
  if (previousDateDraft?.date === state.businessDate && isoDate !== state.businessDate) {
    resolvePreviousDateDraftBeforeLeaving();
    hydrateActiveDay();
  }
  if (!isPreviousDateDraftMode()) {
    syncActiveDayDraft();
  }
  if (previousDateDraft?.date !== isoDate) previousDateDraft = null;
  if (endingEditModeDate && endingEditModeDate !== isoDate) endingEditModeDate = "";
  state.businessDate = isoDate;
  activeMobileGameIndex = 0;
  document.activeElement?.blur?.();
  reconcileVisible = false;
  elements.businessDate.value = isoDate;
  setDailyEntryDateLabel(isoDate);
  elements.gameRows.innerHTML = "";
  hydrateActiveDay();
  ensurePreviousDateDraft();
  persistState();
  render();
  // Don't scroll on date change â€” user is already in the right place
  setActiveView(activeView, false);
  window.setTimeout(() => {
    setDailyEntryDateLabel(state.businessDate);
    renderGames();
    renderMobileEntryBar();
  }, 0);
}

function selectedDateIsClosed() {
  return isClosedDate(state.businessDate);
}

function shiftMonth(direction) {
  const selectedDate = new Date(`${state.businessDate}T12:00:00`);
  selectedDate.setMonth(selectedDate.getMonth() + direction, 1);
  switchDate(selectedDate.toISOString().slice(0, 10));
}

function shiftDay(direction) {
  const selectedDate = new Date(`${state.businessDate}T12:00:00`);
  selectedDate.setDate(selectedDate.getDate() + direction);
  switchDate(selectedDate.toISOString().slice(0, 10));
}

function formatGameValue(game) {
  return game.value === "" ? "" : currency.format(game.value).replace(".00", "");
}

function renderGames() {
  setDailyEntryDateLabel(state.businessDate);
  elements.gameRows.innerHTML = "";
  const isClosed = selectedDateIsClosed();
  const isLocked = isActiveDayLockedForRole();
  const showEditDayButton = isAdminRole() && !isClosed && isEndingCompleted();
  elements.closedDayNotice.hidden = !isClosed;
  elements.saveDayButton.disabled = isClosed || (isCompletedDay() && isUserRole()) || (isSavedPastDate() && isUserRole());
  if (elements.editDayButton) {
    elements.editDayButton.hidden = !showEditDayButton;
    elements.editDayButton.textContent = isEndingEditMode() ? "Stop editing" : "Edit day";
    elements.editDayButton.classList.toggle("active-edit", isEndingEditMode());
    elements.editDayButton.classList.add("edit-day-button");
  }
  // FIX 8: mark section so CSS can show the lock indicator
  elements.dailyEntrySection.classList.toggle("ending-completed", isEndingCompleted());

  // Update column header timestamps â€” only show if explicitly typed on a non-blank cell
  const dayEntries = Object.values(state.dailyLogs[state.businessDate]?.entries || {});
  const latestEndingTs = dayEntries.reduce((best, e) => {
    if (e.todayEnding === "" || e.todayEnding === undefined) return best;
    const ts = e.todayEndingUpdatedAt || "";
    return ts > best ? ts : best;
  }, "");
  const latestManualTs = dayEntries.reduce((best, e) => {
    if (e.manualInstantSold === "" || e.manualInstantSold === undefined) return best;
    const ts = e.manualInstantUpdatedAt || "";
    return ts > best ? ts : best;
  }, "");
  const fmtTs = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";
  const endingTsEl = document.getElementById("colHeaderEndingTs");
  const manualTsEl = document.getElementById("colHeaderManualTs");
  const ticketsHeaderEl = document.getElementById("ticketsHeader");
  const autoSalesHeaderEl = document.getElementById("autoSalesHeader");
  const manualSalesHeaderEl = document.getElementById("manualSalesHeader");
  const trailingHeaderEl = document.getElementById("trailingHeader");
  if (endingTsEl) endingTsEl.textContent = fmtTs(latestEndingTs);
  if (manualTsEl) manualTsEl.textContent = fmtTs(latestManualTs);
  if (ticketsHeaderEl) ticketsHeaderEl.textContent = "Tickets sold";
  if (autoSalesHeaderEl) autoSalesHeaderEl.textContent = "Auto sales $";
  if (manualSalesHeaderEl) manualSalesHeaderEl.innerHTML = `Manual sold $<br><span id="colHeaderManualTs" class="col-ts">${fmtTs(latestManualTs)}</span>`;
  if (trailingHeaderEl) trailingHeaderEl.textContent = reconcileVisible ? "Variance" : "Month tickets";

  const displayGames = reconcileVisible ? reconcileGamesForDate(state.businessDate) : inventory;
  displayGames.forEach((game, rowIndex) => {
    if (gameSearchQuery) {
      const q = gameSearchQuery.toLowerCase();
      if (!(game.name||"").toLowerCase().includes(q) && !(game.bookNumber||"").includes(q) && !String(game.box).includes(q)) return;
    }
    const entry = getEntry(game);
    const row = elements.gameRowTemplate.content.firstElementChild.cloneNode(true);
    const id = gameId(game);

    row.draggable = inventoryEditMode;
    row.dataset.inventoryId = id;
    row.classList.toggle("inventory-editing-row", inventoryEditMode);
    row.querySelectorAll("[data-static]").forEach((field) => {
      const key = field.dataset.static;
      if (inventoryEditMode && ["bookNumber", "name", "value"].includes(key)) {
        const value = game[key] ?? "";
        const editIndex = rowIndex * 3 + ["bookNumber", "name", "value"].indexOf(key);
        if (key === "value") {
          field.innerHTML = `
            <select class="inventory-edit-input" data-inventory-box="${id}" data-inventory-field="${key}" data-enter-group="inventory-edit" data-enter-index="${editIndex}">
              <option value=""></option>
              ${[1, 2, 5, 10, 20, 30, 50].map((option) => `<option value="${option}" ${Number(value) === option ? "selected" : ""}>$${option}</option>`).join("")}
            </select>
          `;
        } else {
          field.innerHTML = `<input class="inventory-edit-input" data-inventory-box="${id}" data-inventory-field="${key}" data-enter-group="inventory-edit" data-enter-index="${editIndex}" type="text" value="${value}" />`;
        }
      } else if (key === "box" && inventoryEditMode) {
        field.innerHTML = `<span class="drag-handle" title="Drag to reorder">::</span><strong>${game.box}</strong>`;
      } else {
        field.textContent = key === "value" ? formatGameValue(game) : game[key] || "-";
      }
    });
    // Apply dc-row in ALL views including daily entry
    row.classList.toggle("dc-row", Boolean(state.orderDc[gameId(game)]));
    row.querySelector("[data-output='previousEnding']").textContent = getPreviousEnding(game);
    row.querySelector("[data-field='todayEnding']").value = entry.todayEnding;
    const displayedManualValue = getDisplayedManualValue(game);
    row.querySelector("[data-field='manualInstantSold']").value =
      displayedManualValue !== "" && displayedManualValue !== undefined ? formatDecimalInput(displayedManualValue) : "";
    row.querySelector("[data-output='ticketsSold']").textContent = calculateTicketsSold(game);
    row.querySelector("[data-output='sales']").textContent = currency.format(calculateGameSales(game));
    row.querySelector("[data-output='runningTickets']").textContent = calculateRunningTickets(game, "month");
    row.classList.toggle("reconcile-row", reconcileVisible);
    if (reconcileVisible) {
      const runningCell = row.querySelector("[data-output='runningTickets']")?.closest("td");
      const manualShown = getDisplayedManualValue(game);
      const hasManualShown = manualShown !== "" && manualShown !== undefined && manualShown !== null;
      const variance = hasManualShown ? normalizeNumber(manualShown) - calculateGameSales(game) : null;
      if (runningCell) {
        runningCell.textContent = hasManualShown ? currency.format(variance) : "Missing";
        runningCell.classList.toggle("reconcile-mismatch-cell", !hasManualShown || Math.abs(variance || 0) > 0.009);
        runningCell.classList.toggle("reconcile-ok-cell", hasManualShown && Math.abs(variance || 0) <= 0.009);
      }
    }
    const manualInput = row.querySelector("[data-field='manualInstantSold']");
    const manualCell = manualInput?.closest("td");
    const manualState = manualCellState(game);
    manualCell?.classList.toggle("manual-mismatch-cell", manualState === "error");
    manualCell?.classList.toggle("manual-match-cell", manualState === "match");
    manualInput?.classList.toggle("manual-error-input", manualState === "error");
    manualInput?.classList.toggle("manual-match-input", manualState === "match");
    const endingChip = row.querySelector(".ending-chip");
    if (endingChip) {
      // Only show timestamp if the cell actually has a value â€” never show on blank cells
      const hasEndingValue = entry.todayEnding !== "" && entry.todayEnding !== undefined;
      const endingBy = hasEndingValue ? (entry.todayEndingUpdatedBy || "") : "";
      const endingAt = hasEndingValue ? (entry.todayEndingUpdatedAt || "") : "";
      endingChip.innerHTML = formatAuditBadge(endingBy, endingAt);
      endingChip.title = endingAt ? `Ending updated ${new Date(endingAt).toLocaleString()} by ${endingBy || "unknown"}` : "Ending not updated yet";
      endingChip.classList.toggle("edited-chip", Boolean(endingBy));
    }
    const manualChip = row.querySelector(".manual-chip");
    if (manualChip) {
      // Only show timestamp if manual sold actually has a value
      const hasManualValue = entry.manualInstantSold !== "" && entry.manualInstantSold !== undefined;
      const manualBy = hasManualValue ? (entry.manualInstantUpdatedBy || "") : "";
      const manualAt = hasManualValue ? (entry.manualInstantUpdatedAt || "") : "";
      manualChip.innerHTML = formatAuditBadge(manualBy, manualAt);
      manualChip.title = manualAt ? `Manual sold updated ${new Date(manualAt).toLocaleString()} by ${manualBy || "unknown"}` : "Manual sold not updated yet";
      manualChip.classList.toggle("edited-chip", Boolean(manualBy));
    }
    const manualValue = normalizeNumber(entry.manualInstantSold);
    const autoValue = calculateGameSales(game);
    const hasManual = entry.manualInstantSold !== "" && entry.manualInstantSold !== undefined;
    const manualMismatch = hasManual && Math.abs(manualValue - autoValue) > 0.009;
    if (manualCell) {
      manualCell.classList.toggle("manual-mismatch-cell", manualMismatch);
      manualCell.classList.toggle("manual-match-cell", hasManual && !manualMismatch);
    }

    row.querySelectorAll("[data-field]").forEach((field) => {
      field.disabled =
        isLocked ||
        (isAdminRole() && field.dataset.field === "todayEnding" && isEndingCompleted() && !isEndingEditMode()) ||
        (isUserRole() && field.dataset.field === "todayEnding" && isEndingCompleted()) ||
        (isUserRole() && field.dataset.field !== "todayEnding") ||
        (isUserRole() && !isTodayDate());
      // Admin sees endings as soft-locked: not disabled (can still read/interact) but a warning fires on focus
      if (isAdminRole() && field.dataset.field === "todayEnding" && isEndingCompleted() && !isEndingEditMode()) {
        field.classList.add("ending-locked-field");
      } else {
        field.classList.remove("ending-locked-field");
      }
      field.addEventListener("input", (event) => {
        updateEntry(game, field.dataset.field, event.target.value, row);
      });
      // Fix 3: reformat manual sold as dollar value (2 decimal places) on blur
        if (field.dataset.field === "manualInstantSold") {
          field.addEventListener("blur", () => {
            if (field.value !== "") {
              field.value = normalizeNumber(field.value).toFixed(2);
            }
          });
        }
        if (field.dataset.field === "todayEnding") {
          field.addEventListener("blur", () => {
            const previousValue = field.dataset.previousValue ?? "";
            if (String(previousValue) === String(field.value)) return;
            advanceMobileEndingAfterCommit(field);
          });
        }
        field.addEventListener("focus", () => {
          field.dataset.previousValue = field.value;
        if (field.dataset.field === "todayEnding") {
          activeMobileGameIndex = rowIndex;
          renderMobileEntryBar();
        }
        // FIX 8: warn on ANY touch of todayEnding when ending is locked (both roles)
        if (field.dataset.field === "todayEnding" && isEndingCompleted() && !isEndingEditMode() && !field._endingWarnShown) {
          field._endingWarnShown = true;
          field.blur();
          showAppConfirm({
            eyebrow: "âš ï¸ Endings locked",
            title: "All endings are complete",
            body: `All today's ending counts are locked for ${state.businessDate}. Use "Edit day" to make adjustments, or "Clear endings" to reset the day.`,
            confirmText: "OK",
            cancelText: "",
          }).then(() => { field._endingWarnShown = false; });
        }
      });
      field.addEventListener("change", async () => {
        const previousValue = field.dataset.previousValue ?? "";
        const shouldConfirmProtectedChange =
          !isActiveManualReview() &&
          (field.dataset.field === "manualInstantSold" || shouldConfirmEndingEditChange());
        if (shouldConfirmProtectedChange) {
          const ok = await confirmPreviousDateFieldChange(field, previousValue, field.value, () => {
            updateEntry(game, field.dataset.field, previousValue, row);
            renderGames();
            renderTotals();
          });
          if (!ok) return;
          field.dataset.previousValue = field.value;
        }
        if (field.dataset.field !== "todayEnding") return;
        advanceMobileEndingAfterCommit(field);
      });
      field.addEventListener("keydown", (event) => handleEntryKeydown(event, row, field.dataset.field));
    });

    if (inventoryEditMode) {
      row.addEventListener("dragstart", () => {
        draggedInventoryId = id;
        row.classList.add("dragging");
      });
      row.addEventListener("dragend", () => {
        draggedInventoryId = null;
        row.classList.remove("dragging");
      });
      row.addEventListener("dragover", (event) => {
        event.preventDefault();
      });
      row.addEventListener("drop", (event) => {
        event.preventDefault();
        reorderInventory(draggedInventoryId, id);
      });
      row.querySelectorAll("[data-inventory-field]").forEach((input) => {
        input.addEventListener("input", (event) => {
          updateInventoryField(id, event.target.dataset.inventoryField, event.target.value);
        });
        input.addEventListener("change", () => {
          if (input.dataset.inventoryField === "bookNumber") {
            const game = inventory.find((item) => gameId(item) === id);
            input.value = game?.bookNumber || "";
          }
          renderOrderSheet();
          renderSummary();
          renderMonthMatrix();
        });
        input.addEventListener("keydown", handleGroupedEnterKeydown);
      });
    }

    elements.gameRows.appendChild(row);
  });

  if (reconcileVisible && !displayGames.length) {
    elements.gameRows.innerHTML = `<tr><td colspan="11" class="empty-reconcile-row">No sold games yet for this date.</td></tr>`;
  }
}

function updateInventoryField(id, field, value) {
  const game = inventory.find((item) => gameId(item) === id);
  if (!game) return;

  if (field === "value") {
    game[field] = value === "" ? "" : normalizeNumber(value);
  } else if (field === "bookNumber") {
    const digitsOnly = String(value).replace(/\D/g, "");
    game[field] = digitsOnly ? digitsOnly.padStart(4, "0").slice(-4) : "";
  } else {
    game[field] = value;
  }
  persistState();
}

function reorderInventory(fromId, toId) {
  if (!fromId || !toId || fromId === toId) return;

  const fromIndex = inventory.findIndex((game) => gameId(game) === fromId);
  const toIndex = inventory.findIndex((game) => gameId(game) === toId);
  if (fromIndex < 0 || toIndex < 0) return;

  const [movedGame] = inventory.splice(fromIndex, 1);
  inventory.splice(toIndex, 0, movedGame);
  persistState();
  render();
}

function renderCashRows() {
  elements.cashRows.innerHTML = "";
  const isLocked = isActiveDayLockedForRole();

  cashDenominations.forEach((item, index) => {
    const row = document.createElement("label");
    row.className = "cash-row";
    row.innerHTML = `<span>${item.label}</span><input data-enter-group="cash-counts" data-enter-index="${index}" type="number" min="0" step="1" inputmode="numeric" pattern="[0-9]*" value="${state.cashCounts[item.label] ?? 0}" />`;
    const input = row.querySelector("input");
    input.disabled = selectedDateIsClosed() || isLocked || (isUserRole() && !isTodayDate());
    input.addEventListener("focus", () => {
      input.dataset.previousValue = input.value;
    });
    input.addEventListener("input", (event) => {
      if (!canEditActiveDay(event.target)) {
        renderCashRows();
        renderTotals();
        return;
      }
      state.cashCounts[item.label] = normalizeNumber(event.target.value);
      syncActiveDayDraft();
      persistIfLiveDate();
      renderTotals();
    });
    input.addEventListener("change", async () => {
      const previousValue = input.dataset.previousValue ?? "";
      const ok = await confirmPreviousDateFieldChange(input, previousValue, input.value, () => {
        state.cashCounts[item.label] = normalizeNumber(previousValue);
        syncActiveDayDraft();
        renderCashRows();
        renderTotals();
      });
      if (ok) input.dataset.previousValue = input.value;
    });
    input.addEventListener("keydown", handleGroupedEnterKeydown);
    elements.cashRows.appendChild(row);
  });
}

function renderTillInputs() {
  const displayedTill = getDisplayedTill();
  const tillInputOrder = [
    "grossSales",
    "onlineCancels",
    "onlineCashes",
    "cashlessOnlineOnlySales",
    "instantCashes",
    "cashlessInstantSales",
    "officePayout",
    "misprintWithoutCancel",
    "adjustments",
  ];

  tillInputOrder.forEach((key, index) => {
    const input = document.querySelector(`#${key}`);
    if (!input) return;
    input.value = formatDecimalInput(displayedTill[key]);
    input.disabled = selectedDateIsClosed() || isUserRole();
    input.dataset.enterGroup = "lottery-totals";
    input.dataset.enterIndex = String(index);
    input.onfocus = () => {
      input.dataset.previousValue = input.value;
    };
    input.oninput = (event) => {
      if (isActiveSalesSummaryReview()) {
        scanDraft.salesSummaryReviewValues = {
          ...(scanDraft.salesSummaryReviewValues || buildSalesSummaryReviewValues(scanDraft.parsed)),
          [key]: key === "reportDate" ? event.target.value : normalizeNumber(event.target.value),
        };
      } else {
        state.till[key] = normalizeNumber(event.target.value);
        state.till = normalizeTill(state.till);
        syncActiveDayDraft();
        persistIfLiveDate();
      }
      renderCashlessTotalInput();
      renderTotals();
    };
    input.onchange = async () => {
      const previousValue = input.dataset.previousValue ?? "";
      if (!isActiveSalesSummaryReview()) {
        const ok = await confirmPreviousDateFieldChange(input, previousValue, input.value, () => {
          state.till[key] = normalizeNumber(previousValue);
          state.till = normalizeTill(state.till);
          syncActiveDayDraft();
          renderTillInputs();
          renderCashlessTotalInput();
          renderTotals();
        });
        if (!ok) return;
      }
      input.value = formatDecimalInput(input.value);
      if (isActiveSalesSummaryReview()) {
        scanDraft.salesSummaryReviewValues = {
          ...(scanDraft.salesSummaryReviewValues || buildSalesSummaryReviewValues(scanDraft.parsed)),
          [key]: normalizeNumber(input.value),
        };
      }
      input.dataset.previousValue = input.value;
    };
    input.onkeydown = handleGroupedEnterKeydown;
  });

  const cashlessTotal = document.querySelector("#cashlessOnlineSales");
  cashlessTotal.value = formatDecimalInput(normalizeTill(displayedTill).cashlessOnlineSales);
  cashlessTotal.disabled = true;
}

function renderCashlessTotalInput() {
  const cashlessTotal = document.querySelector("#cashlessOnlineSales");
  if (cashlessTotal) cashlessTotal.value = formatDecimalInput(normalizeTill(getDisplayedTill()).cashlessOnlineSales);
}

function renderTotals() {
  const instantSales = calculateInstantSales();
  const manualInstant = isActiveManualReview() ? calculateDisplayedManualInstantSales() : calculateManualInstantSales();
  const lotterySales = calculateLotterySalesForTill(isActiveSalesSummaryReview() ? getDisplayedTill() : state.till, state.businessDate);
  const cashDrawer = calculateCashDrawer();
  const difference = cashDrawer - lotterySales;

  elements.instantSalesTotal.textContent = currency.format(instantSales);
  elements.manualInstantTotal.textContent = currency.format(manualInstant);
  elements.ticketsSoldTotal.textContent = calculateTicketsTotal();
  elements.activeBooksTotal.textContent = inventory.length;
  elements.differenceTotal.textContent = currency.format(difference);
  elements.lotterySalesTotal.textContent = currency.format(lotterySales);
  elements.cashDrawerTotal.textContent = currency.format(cashDrawer);
  elements.reportDrawerTotal.textContent = currency.format(cashDrawer);
  elements.reportDifferenceTotal.textContent = currency.format(difference);
  elements.differenceTotal.style.color = Math.abs(difference) > 2 ? "var(--red)" : "var(--green)";
  elements.reportDifferenceTotal.style.color = Math.abs(difference) > 2 ? "var(--red)" : "var(--green)";
  renderInstantMismatch(instantSales, manualInstant);
  elements.auditLog.textContent = JSON.stringify(buildAuditPayload(), null, 2);
  renderSummary();
  renderMonthMatrix();
}

function scanTypeLabel(type) {
  if (type === "sales-summary") return "Sales Summary";
  if (type === "manual-instant") return "Manual Instant Sold";
  return "Lottery report";
}

function compressScanImage(file, maxWidth = 1000, quality = 0.62) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Could not load image."));
      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Could not compress image."));
              return;
            }
            const compressedReader = new FileReader();
            compressedReader.onerror = () => reject(new Error("Could not prepare compressed image."));
            compressedReader.onload = () => {
              resolve({
                name: file.name || `scan-${Date.now()}.jpg`,
                originalSize: file.size,
                size: blob.size,
                blob,
                dataUrl: compressedReader.result,
                url: URL.createObjectURL(blob),
              });
            };
            compressedReader.readAsDataURL(blob);
          },
          "image/jpeg",
          quality,
        );
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function formatBytes(size) {
  if (!size) return "0 KB";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function buildParserChecklist(type) {
  if (type === "sales-summary") {
    return [
      "Parse date below SALES SUMMARY - DAY, not the printed header date.",
      "Auto-fill gross, cancels, online cashes, cashless online, instant cashes, cashless instant, office payout, misprints, and adjustments.",
      "Show +/- difference after review before final submit.",
    ];
  }

  return [
    "Match by 4-digit game #, not by game name.",
    "Allow negative sold amounts like 1086 = -$80.",
    "Combine repeated/stacked lines like 1053 = $50 when the same game appears more than once.",
  ];
}

function normalizeParsedSalesSummary(parsed = {}) {
  const normalizedDate = normalizeParsedReportDate(parsed.reportDate);
  return {
    reportDate: normalizedDate,
    grossSales: normalizeNumber(parsed.grossSales),
    onlineCancels: normalizeNumber(parsed.onlineCancels),
    onlineCashes: normalizeNumber(parsed.onlineCashes),
    cashlessOnlineOnlySales: normalizeNumber(parsed.cashlessOnlineOnlySales),
    instantCashes: normalizeNumber(parsed.instantCashes),
    cashlessInstantSales: normalizeNumber(parsed.cashlessInstantSales),
    officePayout: normalizeNumber(parsed.officePayout),
    misprintWithoutCancel: normalizeNumber(parsed.misprintWithoutCancel),
    adjustments: normalizeNumber(parsed.adjustments),
    confidence: parsed.confidence || "unknown",
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
  };
}

function isActiveSalesSummaryReview(date = state.businessDate) {
  if (scanDraft.type !== "sales-summary" || !scanDraft.parsed) return false;
  const parsed = normalizeParsedSalesSummary(scanDraft.parsed);
  return (parsed.reportDate || state.businessDate) === date;
}

function isActiveManualReview(date = state.businessDate) {
  if (scanDraft.type !== "manual-instant" || !scanDraft.parsed) return false;
  const parsed = normalizeManualInstantParsed(scanDraft.parsed);
  return (parsed.reportDate || state.businessDate) === date;
}

function buildSalesSummaryReviewValues(parsed = scanDraft.parsed) {
  const normalized = normalizeParsedSalesSummary(parsed);
  return {
    reportDate: normalized.reportDate || state.businessDate,
    grossSales: normalized.grossSales,
    onlineCancels: normalized.onlineCancels,
    onlineCashes: normalized.onlineCashes,
    cashlessOnlineOnlySales: normalized.cashlessOnlineOnlySales,
    instantCashes: normalized.instantCashes,
    cashlessInstantSales: normalized.cashlessInstantSales,
    officePayout: normalized.officePayout,
    misprintWithoutCancel: normalized.misprintWithoutCancel,
    adjustments: normalized.adjustments,
  };
}

function buildManualReviewValues(parsed = scanDraft.parsed) {
  const reviewValues = {};
  manualInstantMatchedRows(parsed).forEach(({ game, amount }) => {
    if (!game) return;
    reviewValues[gameId(game)] = formatDecimalInput(amount);
  });
  return reviewValues;
}

function getDisplayedTill() {
  if (!isActiveSalesSummaryReview()) {
    return normalizeTill(state.till);
  }
  return normalizeTill({
    ...state.till,
    ...(scanDraft.salesSummaryReviewValues || buildSalesSummaryReviewValues(scanDraft.parsed)),
  });
}

function getDisplayedManualValue(game, date = state.businessDate) {
  if (isActiveManualReview(date)) {
    const previewValues = scanDraft.manualReviewValues || {};
    if (Object.prototype.hasOwnProperty.call(previewValues, gameId(game))) {
      return previewValues[gameId(game)];
    }
  }
  return getEntry(game, date).manualInstantSold;
}

function calculateDisplayedManualInstantSales(date = state.businessDate) {
  return inventory.reduce((sum, game) => sum + normalizeNumber(getDisplayedManualValue(game, date)), 0);
}

function hasDisplayedManualValue(game, date = state.businessDate) {
  const value = getDisplayedManualValue(game, date);
  return value !== "" && value !== undefined && value !== null;
}

function manualCellState(game, date = state.businessDate) {
  const autoSales = calculateGameSales(game, date);
  const manualValue = normalizeNumber(getDisplayedManualValue(game, date));
  const hasManual = hasDisplayedManualValue(game, date);
  if (!hasManual && autoSales === 0) return "empty-ok";
  if (!hasManual && autoSales > 0) return "error";
  if (Math.abs(manualValue - autoSales) <= 0.009) return "match";
  return "error";
}

function currentParsedManualInstantFromReview() {
  const normalized = normalizeManualInstantParsed(scanDraft.parsed || {});
  const reviewValues = scanDraft.manualReviewValues || {};
  const totalsByGame = inventory
    .map((game) => {
      const value = Object.prototype.hasOwnProperty.call(reviewValues, gameId(game))
        ? reviewValues[gameId(game)]
        : "";
      if (value === "" || value === undefined || value === null) return null;
      return {
        gameNumber: String(game.bookNumber || "").padStart(4, "0"),
        amount: normalizeNumber(value),
      };
    })
    .filter(Boolean);
  return normalizeManualInstantParsed({
    ...normalized,
    reportDate: normalized.reportDate || state.businessDate,
    totalsByGame,
  });
}

function normalizeParsedReportDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2].padStart(2, "0")}-${isoMatch[3].padStart(2, "0")}`;
  }

  const slashMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/);
  if (slashMatch) {
    const selected = new Date(`${state.businessDate}T12:00:00`);
    const yearPart = slashMatch[3] || String(selected.getFullYear());
    const year = yearPart.length === 2 ? `20${yearPart}` : yearPart;
    return `${year}-${slashMatch[1].padStart(2, "0")}-${slashMatch[2].padStart(2, "0")}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return "";
}

function renderParsedSalesSummaryRows(parsed) {
  const mismatch =
    parsed.reportDate && parsed.reportDate !== state.businessDate
      ? `<div class="scan-warning">Receipt date ${parsed.reportDate} differs from selected app date ${state.businessDate}. Submit will switch to ${parsed.reportDate} and save there.</div>`
      : "";
  const rows = salesSummaryFields
    .map(([key, label]) => {
      const value = key === "reportDate" ? parsed[key] || "" : formatDecimalInput(parsed[key]);
      const inputType = key === "reportDate" ? "text" : "number";
      const inputMode = key === "reportDate" ? "text" : "decimal";
      const step = key === "reportDate" ? "" : ` step="0.01"`;
      return `
        <label class="scan-review-row parsed editable">
          <span>${label}</span>
          <input data-scan-field="${key}" type="${inputType}" inputmode="${inputMode}"${step} value="${value}" placeholder="${key === "reportDate" ? "YYYY-MM-DD" : "0.00"}" />
        </label>
      `;
    })
    .join("");
  const warnings = (parsed.warnings || [])
    .map((warning) => `<div class="scan-warning">${warning}</div>`)
    .join("");
  return `${mismatch}${warnings}${rows}`;
}


function buildInventoryGameNumberSet() {
  const s = new Set();
  inventory.forEach(g => { if (g.bookNumber) s.add(String(g.bookNumber).padStart(4,"0")); });
  return s;
}
function fixTruncatedGameNumber(raw) {
  const digits = String(raw||"").replace(/\D/g,"").trim();
  if (!digits) return null;
  const inv = buildInventoryGameNumberSet();
  const padded = digits.padStart(4,"0");
  if (inv.has(padded)) return padded;
  if (digits.length <= 2) {
    const w10 = "10"+digits.padStart(2,"0"); if (inv.has(w10)) return w10;
    const w07 = "07"+digits.padStart(2,"0"); if (inv.has(w07)) return w07;
  }
  if (digits.length === 3) {
    const w1 = "1"+digits; if (inv.has(w1)) return w1;
    const w0 = "0"+digits; if (inv.has(w0)) return w0;
  }
  return padded;
}
function normalizeManualInstantParsed(parsed = {}) {
  const totalsMap = {};
  const normalizedDate = normalizeParsedReportDate(parsed.reportDate || parsed.date || parsed.businessDate);
  const sourceTotals = Array.isArray(parsed.totalsByGame) ? parsed.totalsByGame : [];
  sourceTotals.forEach((item) => {
    const gameNumber = fixTruncatedGameNumber(String(item.gameNumber||"").trim());
    if (!gameNumber || gameNumber === "0000") return;
    totalsMap[gameNumber] = normalizeNumber(totalsMap[gameNumber]) + normalizeNumber(item.amount);
  });

  if (!sourceTotals.length && Array.isArray(parsed.lines)) {
    parsed.lines.forEach((line) => {
      if (line.duplicate) return;
      const gameNumber = fixTruncatedGameNumber(String(line.gameNumber||"").trim());
      if (!gameNumber || gameNumber === "0000") return;
      totalsMap[gameNumber] = normalizeNumber(totalsMap[gameNumber]) + normalizeNumber(line.amount);
    });
  }

  return {
    reportDate: normalizedDate,
    lines: Array.isArray(parsed.lines) ? parsed.lines : [],
    totalsByGame: Object.entries(totalsMap).map(([gameNumber, amount]) => ({ gameNumber, amount })),
    duplicatesRemoved: Array.isArray(parsed.duplicatesRemoved) ? parsed.duplicatesRemoved : [],
    unmatchedLines: Array.isArray(parsed.unmatchedLines) ? parsed.unmatchedLines : [],
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
  };
}

function manualInstantMatchedRows(parsed = scanDraft.parsed) {
  const normalized = normalizeManualInstantParsed(parsed || {});
  return normalized.totalsByGame
    .map((item) => {
      const game = inventory.find((candidate) => String(candidate.bookNumber || "").padStart(4, "0") === item.gameNumber);
      return {
        game,
        gameNumber: item.gameNumber,
        amount: normalizeNumber(item.amount),
      };
    })
    .sort((a, b) => String(a.gameNumber || "").localeCompare(String(b.gameNumber || ""), undefined, { numeric: true }));
}

function parsedManualInstantTotal(parsed = scanDraft.parsed) {
  return manualInstantMatchedRows(parsed).reduce((sum, row) => sum + normalizeNumber(row.amount), 0);
}

function renderParsedManualInstantRows(parsed) {
  const normalized = normalizeManualInstantParsed(parsed);
  const rows = manualInstantMatchedRows(normalized);
  const targetDate = normalized.reportDate || state.businessDate;
  const autoTotal = calculateInstantSales(targetDate);
  const parsedTotal = rows.reduce((sum, row) => sum + row.amount, 0);
  const mismatch = parsedTotal - autoTotal;
  const warningRows = [
    targetDate !== state.businessDate
      ? `<div class="scan-warning">Ticket history date ${targetDate} differs from selected app date ${state.businessDate}. Submit/apply will save to ${targetDate}.</div>`
      : "",
    ...normalized.warnings.map((warning) => `<div class="scan-warning">${warning}</div>`),
    ...normalized.unmatchedLines.map((line) => `<div class="scan-warning">Unmatched line page ${line.page || "?"}: ${line.rawText || ""} ${currency.format(normalizeNumber(line.amount))}</div>`),
  ].filter(Boolean).join("");

  const matchedRows = rows
    .map(({ game, gameNumber, amount }) => {
      const autoSales = game ? calculateGameSales(game, targetDate) : 0;
      const isMismatch = game && Math.abs(normalizeNumber(amount) - autoSales) >= 0.01;
      return `
        <label class="scan-review-row parsed editable manual-review-row${isMismatch ? " scan-row-mismatch" : " scan-row-match"}">
          <span>${gameNumber} ${game?.name || "Unmatched game #"}</span>
          <input data-manual-game="${gameNumber}" type="number" inputmode="decimal" step="0.01" value="${formatDecimalInput(amount)}" />
          <strong>${game ? `Auto ${currency.format(autoSales)}` : "Needs assignment"}</strong>
        </label>
      `;
    })
    .join("");

  return `
    <label class="scan-review-row parsed editable">
      <span>Ticket history date</span>
      <input data-scan-field="reportDate" type="text" inputmode="text" value="${targetDate}" placeholder="YYYY-MM-DD" />
    </label>
    <div class="scan-review-row parsed">
      <span>Manual instant parsed total</span>
      <strong data-manual-review-total>${currency.format(parsedTotal)} vs auto ${currency.format(autoTotal)} (${mismatch >= 0 ? "+" : ""}${currency.format(mismatch)})</strong>
    </div>
    ${
      normalized.duplicatesRemoved.length
        ? `<div class="scan-review-row"><span>Duplicates removed</span><strong>${normalized.duplicatesRemoved.length} overlap line${normalized.duplicatesRemoved.length === 1 ? "" : "s"}</strong></div>`
        : ""
    }
    ${warningRows}
    ${matchedRows || `<div class="scan-warning">No matched game numbers found. Try clearer photos or review manually.</div>`}
  `;
}

function renderActiveScanReviewSummary() {
  if (!scanDraft.parsed) return "";
  if (scanDraft.type === "sales-summary") {
    const parsed = normalizeParsedSalesSummary(scanDraft.parsed);
    const targetDate = parsed.reportDate || state.businessDate;
    return `
      <div class="scan-review-row parsed">
        <span>Sales Summary parsed</span>
        <strong>Values are loaded into the live Lottery Totals for ${targetDate}. Review/edit the cells there, then use Submit in Step 3.</strong>
      </div>
      ${(parsed.warnings || []).map((warning) => `<div class="scan-warning">${warning}</div>`).join("")}
    `;
  }

  const parsed = normalizeManualInstantParsed(scanDraft.parsed);
  const targetDate = parsed.reportDate || state.businessDate;
  const reviewParsed = currentParsedManualInstantFromReview();
  const parsedTotal = parsedManualInstantTotal(reviewParsed);
  const autoTotal = calculateInstantSales(targetDate);
  const difference = parsedTotal - autoTotal;
  return `
    <div class="scan-review-row parsed">
      <span>Manual ticket history parsed</span>
      <strong>Values are loaded into the live Manual Sold cells for ${targetDate}. Parsed ${currency.format(parsedTotal)} vs auto ${currency.format(autoTotal)} (${difference >= 0 ? "+" : ""}${currency.format(difference)}). Use RECONCILE for game # review, then submit below.</strong>
    </div>
    ${(parsed.warnings || []).map((warning) => `<div class="scan-warning">${warning}</div>`).join("")}
  `;
}

function renderScanReview() {
  primePendingScanDraftForAdmin();
  const files = scanDraft.files || [];
  const savedRecords = state.scanRecords?.[state.businessDate] || [];
  const isClosed = selectedDateIsClosed();
  elements.scanSalesSummaryButton.disabled = isClosed;
  elements.scanManualInstantButton.disabled = isClosed;
  const userUploadOnly = isUserRole();
  const hasContent = files.length || savedRecords.length;
  // Show the panel container when there's content, but never auto-expand the body
  elements.scanReviewPanel.hidden = !hasContent;
  // Update the toggle button label to reflect content count
  const toggleBtn = elements.scanReviewPanel.querySelector(".scan-review-toggle");
  const scanBody = document.getElementById("scanReviewBody");
  const isExpanded = toggleBtn ? toggleBtn.getAttribute("aria-expanded") === "true" : false;
  elements.scanReviewTitle.textContent = files.length
    ? `${scanTypeLabel(scanDraft.type)} - ${files.length} photo${files.length === 1 ? "" : "s"} ready`
    : savedRecords.length
      ? `${savedRecords.length} saved scan${savedRecords.length === 1 ? "" : "s"} for ${state.businessDate}`
      : "No scan loaded";

  const activeRows = scanDraft.parsed
    ? renderActiveScanReviewSummary()
    : buildParserChecklist(scanDraft.type)
        .map((item) => `<div class="scan-review-row"><span>Check</span><strong>${item}</strong></div>`)
        .join("");
  const savedRows = savedRecords
    .slice()
    .reverse()
    .map(
      (record) => `
        <div class="scan-review-row parsed">
          <span>${scanTypeLabel(record.type)} saved ${new Date(record.savedAt).toLocaleString()}</span>
          <strong>${
            record.status === "processing"
              ? `${record.parsedReportDate || record.selectedBusinessDate || state.businessDate} - PROCESSING`
              : record.status === "parse-error"
                ? `${record.parsedReportDate || record.selectedBusinessDate || state.businessDate} - PARSE ERROR`
                : `${record.parsedReportDate || state.businessDate}${record.status === "pending-review" ? " - NEEDS REVIEW" : ""}`
          }</strong>
          ${
            isAdminRole() && record.status === "pending-review"
              ? `<button class="ghost-button review-scan-button" type="button" data-review-scan-index="${savedRecords.indexOf(record)}">Review scan</button>`
              : ""
          }
        </div>
      `,
    )
    .join("");
  elements.scanReviewRows.innerHTML = [!userUploadOnly && scanDraft.parsed ? activeRows : files.length ? activeRows : "", !userUploadOnly ? savedRows : ""]
    .filter(Boolean)
    .join("");
  const activePhotos = files
    .map(
      (file, index) => `
        <figure>
          <a href="${file.url}" target="_blank" rel="noopener">
            <img src="${file.url}" alt="${scanTypeLabel(scanDraft.type)} scan ${index + 1}" />
          </a>
          <figcaption>${formatBytes(file.originalSize)} -> ${formatBytes(file.size)}</figcaption>
          <a class="scan-photo-link" href="${file.url}" download="${file.name}">Download</a>
        </figure>
      `,
    )
    .join("");
  const savedPhotos = savedRecords
    .slice()
    .reverse()
    .map((record, index) => {
      const photos = record.photos?.length ? record.photos : record.photo ? [record.photo] : [];
      return photos.length
        ? photos
            .map((photo, photoIndex) => {
              const photoSource = photo?.url || photo?.dataUrl || "";
              return photoSource
                ? `
          <figure>
            <a href="${photoSource}" target="_blank" rel="noopener">
              <img src="${photoSource}" alt="Saved ${scanTypeLabel(record.type)} scan ${index + 1}.${photoIndex + 1}" />
            </a>
            <figcaption>Saved ${new Date(record.savedAt).toLocaleString()}</figcaption>
            <a class="scan-photo-link" href="${photoSource}" download="${photo?.name || "scan.jpg"}">Download</a>
          </figure>
        `
                : `
          <figure class="scan-photo-missing">
            <div>Photo unavailable</div>
            <figcaption>${photo?.uploadError || `Saved ${new Date(record.savedAt).toLocaleString()}`}</figcaption>
          </figure>
        `;
            })
            .join("")
        : `
          <figure class="scan-photo-missing">
            <div>Photo unavailable</div>
            <figcaption>Saved ${new Date(record.savedAt).toLocaleString()}</figcaption>
          </figure>
        `;
    })
    .join("");
  elements.scanPhotoPreview.innerHTML = [activePhotos, savedPhotos].filter(Boolean).join("");

  elements.scanReviewRows.querySelectorAll("[data-review-scan-index]").forEach((button) => {
    button.addEventListener("click", () => loadPendingScanForReview(Number(button.dataset.reviewScanIndex)));
  });

  const manualBatchWaiting = scanDraft.type === "manual-instant" && files.length && !scanDraft.parsed;
  // Also allow re-parsing sales summary if files are loaded but not yet parsed
  const salesSummaryWaiting = scanDraft.type === "sales-summary" && files.length && !scanDraft.parsed;
  const parseButtonVisible = manualBatchWaiting || salesSummaryWaiting;
  elements.addScanPageButton.hidden = !manualBatchWaiting;
  elements.parseScanPagesButton.hidden = !parseButtonVisible;
  elements.parseScanPagesButton.disabled = isClosed || !parseButtonVisible;
  elements.parseScanPagesButton.textContent = salesSummaryWaiting ? "Parse sales summary" : "Parse pages";
  elements.applyScanButton.hidden = true;
  elements.applyScanButton.disabled = true;
  const showSalesSubmit = !userUploadOnly && scanDraft.type === "sales-summary" && scanDraft.parsed;
  const showManualSubmit = !userUploadOnly && scanDraft.type === "manual-instant" && scanDraft.parsed;
  if (elements.salesSummarySubmitButton) {
    elements.salesSummarySubmitButton.hidden = !showSalesSubmit;
    elements.salesSummarySubmitButton.disabled = isClosed || !showSalesSubmit;
  }
  if (elements.manualReviewSubmitButton) {
    elements.manualReviewSubmitButton.hidden = !showManualSubmit;
    elements.manualReviewSubmitButton.disabled = isClosed || !showManualSubmit;
  }
  elements.scanParserStatus.textContent = scanDraft.parsed
    ? userUploadOnly
      ? "Upload complete. Manager review required."
      : scanDraft.type === "sales-summary"
        ? "Parsed values are loaded into Lottery Totals. Review there, then submit."
        : "Parsed values are loaded into Manual Sold. Review red cells or RECONCILE, then submit."
    : isClosed
      ? "Closed day locked. Scanning is disabled for Sundays."
      : salesSummaryWaiting
        ? "Photo ready. Tap \"Parse sales summary\" to extract totals."
        : manualBatchWaiting
          ? `Added ${files.length} ticket page${files.length === 1 ? "" : "s"}. Add every page first, then tap Parse pages.`
          : "Photos are compressed and ready to parse.";
}

async function parseSalesSummaryScan() {
  const firstFile = scanDraft.files?.[0];
  if (!firstFile) return;

  if (!supabaseClient) {
    elements.scanParserStatus.textContent = "Supabase is not connected, so parsing cannot run yet.";
    return;
  }

  elements.scanParserStatus.textContent = "Uploading Sales Summary...";
  elements.applyScanButton.disabled = true;
  let queuedRecord;
  try {
    queuedRecord = await queueSalesSummaryScanForBackground(firstFile);
  } catch (error) {
    console.error("Sales Summary background queue failed", error);
    elements.scanParserStatus.textContent = `Parser error: ${error.message || "Could not queue image"}`;
    return;
  }

  elements.scanParserStatus.textContent = `Sales Summary uploaded. Parsing in background for ${queuedRecord.date}.`;
  await showAppNotice({
    eyebrow: "Upload complete",
    title: "Queued",
    body: "Sales Summary photo is uploaded and parsing in the background. Review can happen on this device or any synced device once processing finishes.",
    confirmText: "OK",
  });
  clearScanReview(true);
  renderCalendar();
}

async function parseManualInstantScan() {
  const files = scanDraft.files || [];
  if (!files.length) return;

  if (!supabaseClient) {
    elements.scanParserStatus.textContent = "Supabase is not connected, so parsing cannot run yet.";
    return;
  }

  elements.scanParserStatus.textContent = `Uploading ${files.length} ticket sold photo${files.length === 1 ? "" : "s"}...`;
  elements.applyScanButton.disabled = true;
  let queuedRecord;
  try {
    queuedRecord = await queueManualInstantScanForBackground(files);
  } catch (error) {
    console.error("Manual instant background queue failed", error);
    elements.scanParserStatus.textContent = `Parser error: ${error.message || "Could not queue ticket pages"}`;
    return;
  }

  elements.scanParserStatus.textContent = `Ticket pages uploaded. Parsing in background for ${queuedRecord.date}.`;
  await showAppNotice({
    eyebrow: "Upload complete",
    title: "Queued",
    body: "Ticket sold pages are uploaded and parsing in the background. Review can happen on this device or any synced device once processing finishes.",
    confirmText: "OK",
  });
  clearScanReview(true);
  renderCalendar();
}

async function handleManualInstantParsedResult(parsed) {
  const targetDate = parsed.reportDate || state.businessDate;
  if (targetDate !== state.businessDate) {
    switchDate(targetDate);
  }
  scanDraft.manualReviewValues = buildManualReviewValues(parsed);
  const parsedTotal = parsedManualInstantTotal(parsed);
  const autoTotal = calculateInstantSales(targetDate);
  const isMatch = Math.abs(parsedTotal - autoTotal) < 0.01;

  const pendingRecord = await saveReviewedManualInstantScan(parsed, "pending-review", { autoApplied: false, targetDate });
  scanDraft.reviewRecordDate = pendingRecord.date;
  scanDraft.reviewRecordIndex = pendingRecord.index;

  if (isUserRole()) {
    await showAppNotice({
      eyebrow: "Upload complete",
      title: "Complete",
      body: "Ticket sold pages were uploaded. Manager review is needed before applying them.",
      confirmText: "OK",
    });
    clearScanReview(true);
    renderCalendar();
    return;
  }

  await showAppNotice({
    eyebrow: isMatch ? "Matched" : "Manager review",
    title: isMatch ? "Ready to submit" : "Needs Review!",
    body: isMatch
      ? `Manual instant matches at ${currency.format(autoTotal)} for ${targetDate}. Review the live Manual Sold cells, then submit below.`
      : `Manual instant parsed ${currency.format(parsedTotal)}, but auto instant sales are ${currency.format(autoTotal)}. Review the live Manual Sold cells, then submit below.`,
    confirmText: "Review now",
  });
  renderGames();
  renderTotals();
  reconcileVisible = true;
  renderScanReview();
  renderCalendar();
}

function applyManualInstantParsedToEntries(parsed, date = state.businessDate) {
  clearManualMismatchOverride(date);
  manualInstantMatchedRows(parsed).forEach(({ game, amount }) => {
    if (!game) return;
    const entry = getEntry(game, date);
    entry.manualInstantSold = amount;
    entry.manualInstantUpdatedBy = currentUserName();
    entry.manualInstantUpdatedAt = new Date().toISOString();
    entry.updatedBy = entry.manualInstantUpdatedBy;
    entry.updatedAt = entry.manualInstantUpdatedAt;
  });
  const dayLog = getDayLog(date);
  dayLog.totals = buildTotals();
  dayLog.savedAt = new Date().toISOString();
  state.lastSavedAt = dayLog.savedAt;
  persistState();
}

async function saveReviewedManualInstantScan(parsed, status, options = {}) {
  const targetDate = options.targetDate || parsed.reportDate || state.businessDate;
  const photos = await uploadScanPhotos(scanDraft.files || [], targetDate);
  state.scanRecords[targetDate] = state.scanRecords[targetDate] || [];
  const record = {
    type: "manual-instant",
    status,
    savedAt: new Date().toISOString(),
    savedBy: currentUserName(),
    reviewedAt: status === "reviewed" ? new Date().toISOString() : "",
    reviewedBy: status === "reviewed" ? currentUserName() : "",
    selectedBusinessDate: state.businessDate,
    parsedReportDate: targetDate,
    parsed,
    autoApplied: Boolean(options.autoApplied),
    totals: {
      parsedManualInstant: parsedManualInstantTotal(parsed),
      instantSales: calculateInstantSales(targetDate),
      difference: parsedManualInstantTotal(parsed) - calculateInstantSales(targetDate),
    },
    photos,
    photo: photos[0] || null,
  };
  state.scanRecords[targetDate].push(record);
  const index = state.scanRecords[targetDate].length - 1;
  persistState();
  await saveCloudState();
  return { date: targetDate, index, record };
}

function createScanRecordId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `scan-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function queueSalesSummaryScanForBackground(file) {
  const targetDate = state.businessDate;
  const photoUpload = await uploadScanPhoto(file, targetDate);
  if (!photoUpload.url) {
    throw new Error(photoUpload.error || "Photo upload failed before parsing could start.");
  }
  state.scanRecords[targetDate] = state.scanRecords[targetDate] || [];
  const record = {
    id: createScanRecordId(),
    type: "sales-summary",
    status: "processing",
    savedAt: new Date().toISOString(),
    savedBy: currentUserName(),
    selectedBusinessDate: state.businessDate,
    parsedReportDate: "",
    parsed: null,
    processingStartedAt: new Date().toISOString(),
    processingError: "",
    photo: {
      name: file?.name || "sales-summary.jpg",
      size: file?.size || 0,
      url: photoUpload.url || "",
      uploadError: photoUpload.error || "",
      dataUrl: "",
    },
  };
  state.scanRecords[targetDate].push(record);
  persistState();
  await saveCloudState();
  triggerBackgroundSalesSummaryParse(record, photoUpload.url);
  return { date: targetDate, index: state.scanRecords[targetDate].length - 1, record };
}

async function queueManualInstantScanForBackground(files) {
  const targetDate = state.businessDate;
  const photos = await uploadScanPhotos(files, targetDate);
  const uploadedUrls = photos.filter((photo) => photo.url).map((photo) => photo.url);
  if (!uploadedUrls.length) {
    const firstError = photos.find((photo) => photo.uploadError)?.uploadError || "Ticket pages failed to upload before parsing could start.";
    throw new Error(firstError);
  }
  state.scanRecords[targetDate] = state.scanRecords[targetDate] || [];
  const record = {
    id: createScanRecordId(),
    type: "manual-instant",
    status: "processing",
    savedAt: new Date().toISOString(),
    savedBy: currentUserName(),
    selectedBusinessDate: state.businessDate,
    parsedReportDate: "",
    parsed: null,
    processingStartedAt: new Date().toISOString(),
    processingError: photos.some((photo) => photo.uploadError)
      ? photos.filter((photo) => photo.uploadError).map((photo) => photo.uploadError).join(" | ")
      : "",
    photos,
    photo: photos[0] || null,
  };
  state.scanRecords[targetDate].push(record);
  persistState();
  await saveCloudState();
  triggerBackgroundManualInstantParse(record, uploadedUrls);
  return { date: targetDate, index: state.scanRecords[targetDate].length - 1, record };
}

async function savePendingSalesSummaryScan(parsed) {
  const targetDate = parsed.reportDate || state.businessDate;
  const photoUpload = await uploadScanPhoto(scanDraft.files[0], targetDate);
  state.scanRecords[targetDate] = state.scanRecords[targetDate] || [];
  const record = {
    id: createScanRecordId(),
    type: scanDraft.type,
    status: "pending-review",
    savedAt: new Date().toISOString(),
    savedBy: currentUserName(),
    selectedBusinessDate: state.businessDate,
    parsedReportDate: parsed.reportDate || "",
    parsed,
    photo: {
      name: scanDraft.files[0]?.name || "sales-summary.jpg",
      size: scanDraft.files[0]?.size || 0,
      url: photoUpload.url || "",
      uploadError: photoUpload.error || "",
      dataUrl: "",
    },
  };
  state.scanRecords[targetDate].push(record);
  const index = state.scanRecords[targetDate].length - 1;
  persistState();
  await saveCloudState();
  elements.scanParserStatus.textContent = photoUpload.error
    ? `Upload saved for review, but photo upload failed: ${photoUpload.error}`
    : `Upload saved for admin review on ${targetDate}.`;
  return { date: targetDate, index, record };
}

function loadPendingScanForReview(index) {
  const record = state.scanRecords?.[state.businessDate]?.[index];
  if (!record || record.status !== "pending-review") return;
  scanDraft = {
    type: record.type || "sales-summary",
    files: [],
    parsed: record.type === "manual-instant"
      ? normalizeManualInstantParsed(record.parsed || {})
      : normalizeParsedSalesSummary(record.parsed || {}),
    salesSummaryReviewValues:
      record.type === "sales-summary" ? buildSalesSummaryReviewValues(record.parsed || {}) : null,
    manualReviewValues:
      record.type === "manual-instant" ? buildManualReviewValues(record.parsed || {}) : null,
    reviewRecordDate: state.businessDate,
    reviewRecordIndex: index,
  };
  const targetDate = scanDraft.type === "manual-instant"
    ? normalizeManualInstantParsed(record.parsed || {}).reportDate || state.businessDate
    : normalizeParsedSalesSummary(record.parsed || {}).reportDate || state.businessDate;
  if (targetDate !== state.businessDate) switchDate(targetDate);
  renderGames();
  renderTillInputs();
  renderTotals();
  renderScanReview();
  elements.scanParserStatus.textContent = "Pending scan loaded. Review values, then submit.";
}

function primePendingScanDraftForAdmin() {
  if (!isAdminRole() || scanDraft.files?.length || scanDraft.parsed) return;
  const savedRecords = state.scanRecords?.[state.businessDate] || [];
  const pendingIndex = [...savedRecords].map((record, index) => ({ record, index }))
    .reverse()
    .find(({ record }) => record.status === "pending-review")?.index;
  if (pendingIndex === undefined) return;
  const record = savedRecords[pendingIndex];
  scanDraft = {
    type: record.type || "sales-summary",
    files: [],
    parsed: record.type === "manual-instant"
      ? normalizeManualInstantParsed(record.parsed || {})
      : normalizeParsedSalesSummary(record.parsed || {}),
    salesSummaryReviewValues:
      record.type === "sales-summary" ? buildSalesSummaryReviewValues(record.parsed || {}) : null,
    manualReviewValues:
      record.type === "manual-instant" ? buildManualReviewValues(record.parsed || {}) : null,
    reviewRecordDate: state.businessDate,
    reviewRecordIndex: pendingIndex,
  };
}

async function invokeSalesSummaryParser(formData) {
  const functionName = "parse-sales-summary";
  let response;
  try {
    response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: formData,
    });
  } catch (error) {
    throw new Error(`Could not reach ${functionName}. Check internet connection, Supabase function deploy, and CORS. ${error.message || ""}`.trim());
  }
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    const details = payload.details || payload.raw || payload.message || "";
    const compactDetails = String(details).replace(/\s+/g, " ").trim().slice(0, 260);
    const errorMessage = payload.error || `Edge function returned HTTP ${response.status}`;
    throw new Error(compactDetails ? `${errorMessage}: ${compactDetails}` : errorMessage);
  }

  return payload;
}

async function invokeManualInstantParser(formData) {
  const functionName = "parse-manual-instant";
  let response;
  try {
    response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: formData,
    });
  } catch (error) {
    throw new Error(`Could not reach ${functionName}. This usually means the Supabase Edge Function is not deployed yet, the function name differs, or the browser blocked the request. ${error.message || ""}`.trim());
  }
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    const details = payload.details || payload.raw || payload.message || "";
    const compactDetails = String(details).replace(/\s+/g, " ").trim().slice(0, 260);
    const errorMessage = payload.error || `Edge function returned HTTP ${response.status}`;
    throw new Error(compactDetails ? `${errorMessage}: ${compactDetails}` : errorMessage);
  }

  return payload;
}

async function invokeBackgroundParser(functionName, payload) {
  let response;
  try {
    response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (error) {
    throw new Error(`Could not reach ${functionName}. ${error.message || ""}`.trim());
  }
  const text = await response.text();
  let payloadResponse = {};
  try {
    payloadResponse = text ? JSON.parse(text) : {};
  } catch {
    payloadResponse = { raw: text };
  }
  if (!response.ok) {
    const details = payloadResponse.details || payloadResponse.raw || payloadResponse.message || "";
    const compactDetails = String(details).replace(/\s+/g, " ").trim().slice(0, 260);
    const errorMessage = payloadResponse.error || `Edge function returned HTTP ${response.status}`;
    throw new Error(compactDetails ? `${errorMessage}: ${compactDetails}` : errorMessage);
  }
  return payloadResponse;
}

function triggerBackgroundSalesSummaryParse(record, imageUrl, recordDate = state.businessDate) {
  activeProcessingScanIds.add(record.id);
  invokeBackgroundParser("parse-sales-summary", {
    storeKey: CLOUD_STORE_KEY,
    recordId: record.id,
    recordDate,
    selectedBusinessDate: record.selectedBusinessDate || recordDate,
    imageUrl,
  })
    .then(() => loadCloudState({ quietIfUnchanged: false }))
    .catch((error) => {
      console.error("Background sales summary parse failed", error);
      elements.scanParserStatus.textContent = `Background parse error: ${error.message || "Sales Summary parse failed"}`;
      loadCloudState({ quietIfUnchanged: false });
    })
    .finally(() => activeProcessingScanIds.delete(record.id));
}

function triggerBackgroundManualInstantParse(record, imageUrls, recordDate = state.businessDate) {
  activeProcessingScanIds.add(record.id);
  invokeBackgroundParser("parse-manual-instant", {
    storeKey: CLOUD_STORE_KEY,
    recordId: record.id,
    recordDate,
    selectedBusinessDate: record.selectedBusinessDate || recordDate,
    imageUrls,
  })
    .then(() => loadCloudState({ quietIfUnchanged: false }))
    .catch((error) => {
      console.error("Background manual instant parse failed", error);
      elements.scanParserStatus.textContent = `Background parse error: ${error.message || "Ticket page parse failed"}`;
      loadCloudState({ quietIfUnchanged: false });
    })
    .finally(() => activeProcessingScanIds.delete(record.id));
}

async function uploadScanPhoto(file, targetDate) {
  if (!supabaseClient || !file?.blob) return { url: "", error: "Supabase is offline." };
  const safeName = String(file.name || "sales-summary.jpg").replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const path = `${targetDate}/${Date.now()}-${safeName}`;
  const { error } = await supabaseClient.storage.from("lottery-scans").upload(path, file.blob, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) {
    console.warn("Scan photo storage upload failed", error);
    return { url: "", error: error.message || "Photo upload failed." };
  }
  const { data } = supabaseClient.storage.from("lottery-scans").getPublicUrl(path);
  return { url: data?.publicUrl || "", error: "" };
}

async function uploadScanPhotos(files, targetDate) {
  const uploads = [];
  for (const file of files || []) {
    const upload = await uploadScanPhoto(file, targetDate);
    uploads.push({
      name: file?.name || "scan.jpg",
      size: file?.size || 0,
      url: upload.url || "",
      uploadError: upload.error || "",
      dataUrl: "",
    });
  }
  return uploads;
}

function currentParsedSalesSummaryFromReview() {
  if (scanDraft.salesSummaryReviewValues) {
    return normalizeParsedSalesSummary({
      ...(scanDraft.parsed || {}),
      ...scanDraft.salesSummaryReviewValues,
    });
  }
  const parsed = { ...(scanDraft.parsed || {}) };
  elements.scanReviewRows.querySelectorAll("[data-scan-field]").forEach((input) => {
    const key = input.dataset.scanField;
    if (!key) return;
    parsed[key] = key === "reportDate" ? input.value : normalizeNumber(input.value);
  });
  return normalizeParsedSalesSummary(parsed);
}

async function handleScanFiles(type, fileList) {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;

  elements.scanReviewPanel.hidden = false;
  // Auto-expand the scan body when user actively uploads
  const scanBody = document.getElementById("scanReviewBody");
  const toggleBtn = elements.scanReviewPanel.querySelector(".scan-review-toggle");
  if (scanBody && scanBody.hidden) {
    scanBody.hidden = false;
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-expanded", "true");
      const label = toggleBtn.querySelector(".toggle-label");
      if (label) label.textContent = "Hide";
    }
  }
  elements.scanReviewTitle.textContent = "Compressing photo...";
  elements.scanReviewRows.innerHTML = "";
  elements.scanPhotoPreview.innerHTML = "";
  elements.scanParserStatus.textContent = "Compressing photo...";

  const compressed = [];
  for (const file of files) {
    compressed.push(await compressScanImage(file));
  }

  if (type === "manual-instant" && scanDraft.type === "manual-instant" && !scanDraft.parsed) {
    scanDraft.files = [...(scanDraft.files || []), ...compressed];
  } else {
    (scanDraft.files || []).forEach((file) => URL.revokeObjectURL(file.url));
    scanDraft = { type, files: compressed, parsed: null, salesSummaryReviewValues: null, manualReviewValues: null };
  }
  renderScanReview();
  if (type === "sales-summary") {
    parseSalesSummaryScan();
    return;
  }
  if (type === "manual-instant") {
    elements.scanParserStatus.textContent = `Added ${scanDraft.files.length} ticket page${scanDraft.files.length === 1 ? "" : "s"}. Add every page first, then tap Parse pages.`;
    const addAnother = await showAppConfirm({
      eyebrow: "Manual ticket pages",
      title: `${scanDraft.files.length} page${scanDraft.files.length === 1 ? "" : "s"} added`,
      body: "Add another ticket history photo, or finish and parse this batch now.",
      confirmText: "Add page",
      cancelText: "Finish",
    });
    if (addAnother) {
      elements.manualInstantScanInput.value = "";
      elements.manualInstantScanInput.click();
    } else {
      parseManualInstantScan();
    }
  }
}

function clearScanReview(options = {}) {
  return (async () => {
    const normalizedOptions = typeof options === "boolean"
      ? { skipConfirm: options, clearSavedRecords: false }
      : { skipConfirm: false, clearSavedRecords: true, ...options };
    const savedRecords = state.scanRecords?.[state.businessDate] || [];
    const hasReviewContent = Boolean(scanDraft.type || scanDraft.files?.length || scanDraft.parsed || savedRecords.length);
    if (hasReviewContent && !normalizedOptions.skipConfirm) {
      const ok = await showAppConfirm({
        eyebrow: "Clear review",
        title: "Clear all Reviews",
        body: `This clears the current review draft and removes all saved sales-summary and instant-sold review entries for ${state.businessDate}. This syncs to the other devices too.`,
        confirmText: "Yes, clear all",
        cancelText: "No",
      });
      if (!ok) return false;
    }

    (scanDraft.files || []).forEach((file) => URL.revokeObjectURL(file.url));
  scanDraft = { type: "", files: [], parsed: null, salesSummaryReviewValues: null, manualReviewValues: null };
    elements.salesSummaryScanInput.value = "";
    elements.manualInstantScanInput.value = "";
    if (normalizedOptions.clearSavedRecords && savedRecords.length) {
      delete state.scanRecords[state.businessDate];
      persistState();
      await saveCloudState();
      renderCalendar();
    }
    renderScanReview();
    return true;
  })();
}

async function applySalesSummaryScan() {
  if (scanDraft.type === "manual-instant") {
    applyManualInstantScan();
    return;
  }
  if (scanDraft.type !== "sales-summary" || !scanDraft.parsed) return;

  const parsed = currentParsedSalesSummaryFromReview();
  const targetDate = parsed.reportDate || state.businessDate;
  const ok = await showAppConfirm({
    eyebrow: "Submit scan",
    title: "Apply Sales Summary to receipt date?",
    body: `This saves parsed totals to ${targetDate}. If that differs from the current app date, the app will switch to the receipt date first.`,
    confirmText: "Submit reviewed scan",
    cancelText: "Keep reviewing",
  });
  if (!ok) return;

  if (targetDate !== state.businessDate) {
    switchDate(targetDate);
  }

  const appliedTill = normalizeTill({
    ...state.till,
    grossSales: parsed.grossSales,
    onlineCancels: parsed.onlineCancels,
    onlineCashes: parsed.onlineCashes,
    cashlessOnlineOnlySales: parsed.cashlessOnlineOnlySales,
    instantCashes: parsed.instantCashes,
    cashlessInstantSales: parsed.cashlessInstantSales,
    officePayout: parsed.officePayout,
    misprintWithoutCancel: parsed.misprintWithoutCancel,
    adjustments: parsed.adjustments,
  });
  state.till = appliedTill;

  const dayLog = previousDateDraft?.date === state.businessDate ? previousDateDraft.dayLog : getDayLog();
  dayLog.till = { ...appliedTill };
  dayLog.cashCounts = { ...state.cashCounts };
  dayLog.totals = buildTotals();
  dayLog.savedAt = new Date().toISOString();
  state.dailyLogs[state.businessDate] = cloneJson(dayLog);
  previousDateDraft = null;

  state.scanRecords[state.businessDate] = state.scanRecords[state.businessDate] || [];
  let photoUpload = { url: "", error: "" };
  if (scanDraft.reviewRecordDate && scanDraft.reviewRecordIndex !== undefined) {
    const record = state.scanRecords[state.businessDate]?.[scanDraft.reviewRecordIndex];
    if (record) {
      record.status = "reviewed";
      record.reviewedAt = new Date().toISOString();
      record.reviewedBy = currentUserName();
      record.parsed = parsed;
      record.parsedReportDate = parsed.reportDate || record.parsedReportDate || "";
    }
  } else {
    photoUpload = await uploadScanPhoto(scanDraft.files[0], state.businessDate);
    state.scanRecords[state.businessDate].push({
      type: scanDraft.type,
      status: "reviewed",
      savedAt: new Date().toISOString(),
      savedBy: currentUserName(),
      reviewedAt: new Date().toISOString(),
      reviewedBy: currentUserName(),
      selectedBusinessDate: state.businessDate,
      parsedReportDate: parsed.reportDate || "",
      parsed,
      photo: {
        name: scanDraft.files[0]?.name || "sales-summary.jpg",
        size: scanDraft.files[0]?.size || 0,
        url: photoUpload.url || "",
        uploadError: photoUpload.error || "",
        dataUrl: "",
      },
    });
  }

  persistState();
  await saveCloudState();
  (scanDraft.files || []).forEach((file) => URL.revokeObjectURL(file.url));
  scanDraft = { type: "", files: [], parsed: null, salesSummaryReviewValues: null, manualReviewValues: null };
  elements.salesSummaryScanInput.value = "";
  renderCalendar();
  renderTillInputs();
  renderTotals();
  renderScanReview();
  elements.scanParserStatus.textContent = photoUpload.error
    ? `Sales Summary saved to ${state.businessDate}, but photo upload failed: ${photoUpload.error}`
    : `Sales Summary saved to ${state.businessDate}.`;
}

async function applyManualInstantScan() {
  if (scanDraft.type !== "manual-instant" || !scanDraft.parsed) return;
  const parsed = currentParsedManualInstantFromReview();
  const targetDate = parsed.reportDate || state.businessDate;
  if (targetDate !== state.businessDate) {
    switchDate(targetDate);
  }
  const parsedTotal = parsedManualInstantTotal(parsed);
  const autoTotal = calculateInstantSales(targetDate);
  const ok = await showAppConfirm({
    eyebrow: "Submit ticket scan",
    title: "Apply manual instant sold?",
    body: `This applies parsed manual instant sold of ${currency.format(parsedTotal)} against auto instant sales of ${currency.format(autoTotal)} for ${targetDate}.`,
    confirmText: "Apply manual sold",
    cancelText: "Keep reviewing",
  });
  if (!ok) return;

  applyManualInstantParsedToEntries(parsed, targetDate);

  if (scanDraft.reviewRecordDate && scanDraft.reviewRecordIndex !== undefined) {
    const record = state.scanRecords[targetDate]?.[scanDraft.reviewRecordIndex];
    if (record) {
      record.status = "reviewed";
      record.reviewedAt = new Date().toISOString();
      record.reviewedBy = currentUserName();
      record.parsed = parsed;
      record.parsedReportDate = targetDate;
      record.totals = {
        parsedManualInstant: parsedManualInstantTotal(parsed),
        instantSales: calculateInstantSales(targetDate),
        difference: parsedManualInstantTotal(parsed) - calculateInstantSales(targetDate),
      };
    }
  } else {
    await saveReviewedManualInstantScan(parsed, "reviewed", { autoApplied: false, targetDate });
  }

  persistState();
  await saveCloudState();
  scanDraft = { type: "", files: [], parsed: null, salesSummaryReviewValues: null, manualReviewValues: null };
  elements.manualInstantScanInput.value = "";
  reconcileVisible = true;
  render();
  elements.scanParserStatus.textContent = `Manual instant sold applied to ${targetDate}.`;
}

function renderInstantMismatch(instantSales, manualInstant) {
  const anyManualEntered = inventory.some(game => {
    const v = getDisplayedManualValue(game);
    return v !== "" && v !== undefined && v !== null;
  });
  const anySoldRows = inventory.some((game) => calculateGameSales(game) > 0 || hasDisplayedManualValue(game));
  const difference = manualInstant - instantSales;
  const overridden = hasManualMismatchOverride(state.businessDate, instantSales, manualInstant);
  const isMismatch = anyManualEntered && Math.abs(difference) > 0.009 && !overridden;
  const isMatch = anyManualEntered && !isMismatch;

  elements.instantMismatchAlert.hidden = !isMismatch;
  elements.instantSalesCard.classList.toggle("metric-error", isMismatch);
  elements.manualInstantCard.classList.toggle("metric-error", isMismatch);
  elements.instantSalesCard.classList.toggle("metric-match", isMatch);
  elements.manualInstantCard.classList.toggle("metric-match", isMatch);

  if (isMismatch) {
    elements.instantMismatchText.textContent = `Auto instant sales are ${currency.format(
      instantSales,
    )}, manual instant sold is ${currency.format(manualInstant)}, difference is ${currency.format(difference)}.`;
  }

  elements.reconcileButton.hidden = false;
  elements.reconcileButton.textContent = reconcileVisible ? "Normal view" : "Reconcile";
  elements.reconcileButton.classList.toggle("reconcile-active-button", reconcileVisible);
  elements.reconcileButton.classList.toggle("reconcile-inactive-button", !reconcileVisible);
  if (elements.manualOverrideButton) {
    elements.manualOverrideButton.hidden = !isMismatch || !isAdminRole();
  }
  elements.reconcilePanel.hidden = true;
}

function renderReconciliationRows() {
  if (!reconcileVisible) return;

  const rows = buildReconcileRowsData();

  if (!rows.length) {
    elements.reconcileRows.innerHTML = `<tr><td colspan="8">No sold tickets for this date.</td></tr>`;
    return;
  }

  elements.reconcileRows.innerHTML = rows
    .map(({ game, tickets, autoSales, manual, hasManual, variance, stateClass }) => {
      return `
        <tr class="${stateClass}">
          <td>${game.bookNumber || "-"}</td>
          <td>${game.box}</td>
          <td>${game.name || "-"}</td>
          <td>${formatGameValue(game)}</td>
          <td>${tickets}</td>
          <td>${currency.format(autoSales)}</td>
          <td><input data-reconcile-box="${gameId(game)}" type="number" min="0" step="0.01" inputmode="decimal" placeholder="$0.00" value="${hasManual ? formatDecimalInput(manual) : ''}" /></td>
          <td class="${Math.abs(variance)>0.009 || !hasManual ? 'reconcile-mismatch-cell' : 'reconcile-ok-cell'}">${hasManual ? currency.format(variance) : autoSales > 0 ? "Missing" : "-"}</td>
        </tr>
      `;
    })
    .join("");

  elements.reconcileRows.querySelectorAll("[data-reconcile-box]").forEach((input) => {
    input.addEventListener("input", (event) => {
      if (!canEditActiveDay(event.target)) {
        renderTotals();
        return;
      }
      const game = inventory.find((item) => gameId(item) === event.target.dataset.reconcileBox);
      if (!game) return;
      if (isActiveManualReview()) {
        scanDraft.manualReviewValues = {
          ...(scanDraft.manualReviewValues || buildManualReviewValues(scanDraft.parsed)),
          [gameId(game)]: event.target.value === "" ? "" : formatDecimalInput(event.target.value),
        };
      } else {
        getEntry(game).manualInstantSold = event.target.value === "" ? "" : normalizeNumber(event.target.value);
        syncActiveDayDraft();
        persistIfLiveDate();
      }
      renderGames();
      renderTotals();
      renderScanReview();
      renderReconciliationRows();
    });
  });
}

function updateEntry(game, key, value, row) {
  const field = row?.querySelector(`[data-field='${key}']`);
  if (!canEditActiveDay(field)) {
    renderGames();
    renderTotals();
    return;
  }

  const entry = getEntry(game);
  const nextValue = value === "" ? "" : normalizeNumber(value);
  const manualPreviewActive = key === "manualInstantSold" && isActiveManualReview();
  const changed = manualPreviewActive
    ? String((scanDraft.manualReviewValues || {})[gameId(game)] ?? "") !== String(value === "" ? "" : formatDecimalInput(nextValue))
    : String(entry[key] ?? "") !== String(nextValue);

  if (manualPreviewActive) {
    scanDraft.manualReviewValues = {
      ...(scanDraft.manualReviewValues || buildManualReviewValues(scanDraft.parsed)),
      [gameId(game)]: value === "" ? "" : formatDecimalInput(nextValue),
    };
  } else {
    entry[key] = nextValue;
  }

  if (changed && key === "todayEnding") {
    stampEntryFieldUpdate(entry, key, nextValue);
  }
  if (changed && key === "manualInstantSold" && !manualPreviewActive) {
    stampEntryFieldUpdate(entry, key, nextValue);
    clearManualMismatchOverride();
  }

  row.querySelector("[data-output='ticketsSold']").textContent = calculateTicketsSold(game);
  row.querySelector("[data-output='sales']").textContent = currency.format(calculateGameSales(game));
  row.querySelector("[data-output='runningTickets']").textContent = calculateRunningTickets(game, "month");
  const endingChip = row.querySelector(".ending-chip");
  if (endingChip) {
    const hasEndingValue = entry.todayEnding !== "" && entry.todayEnding !== undefined;
    endingChip.innerHTML = formatAuditBadge(
      hasEndingValue ? (entry.todayEndingUpdatedBy || "") : "",
      hasEndingValue ? (entry.todayEndingUpdatedAt || "") : ""
    );
    endingChip.classList.toggle("edited-chip", hasEndingValue && Boolean(entry.todayEndingUpdatedBy));
  }
  const manualChip = row.querySelector(".manual-chip");
  if (manualChip) {
    const hasManualValue = entry.manualInstantSold !== "" && entry.manualInstantSold !== undefined;
    manualChip.innerHTML = formatAuditBadge(
      hasManualValue ? (entry.manualInstantUpdatedBy || "") : "",
      hasManualValue ? (entry.manualInstantUpdatedAt || "") : ""
    );
    manualChip.classList.toggle("edited-chip", hasManualValue && Boolean(entry.manualInstantUpdatedBy));
  }

  // Fix 4: update red/green mismatch immediately without waiting for renderGames
  const manualCell = row.querySelector("[data-field='manualInstantSold']")?.closest("td");
  if (manualCell) {
    const stateClass = manualCellState(game);
    manualCell.classList.toggle("manual-mismatch-cell", stateClass === "error");
    manualCell.classList.toggle("manual-match-cell", stateClass === "match");
    const manualField = row.querySelector("[data-field='manualInstantSold']");
    manualField?.classList.toggle("manual-error-input", stateClass === "error");
    manualField?.classList.toggle("manual-match-input", stateClass === "match");
  }

  if (!manualPreviewActive) {
    persistIfLiveDate();
  }
  renderTotals();
  if (manualPreviewActive) {
    renderReconciliationRows();
    renderScanReview();
  }
  if (changed && key === "todayEnding") {
    autoCompleteEndingDayIfReady();
  }
}

function handleEntryKeydown(event, row, fieldName) {
  if (event.key !== "Enter") return;

  event.preventDefault();
  if (fieldName === "manualInstantSold" && isActiveManualReview()) {
    const reviewInputs = Array.from(elements.gameRows.querySelectorAll(".manual-error-input[data-field='manualInstantSold']"));
    const activeReviewIndex = reviewInputs.indexOf(event.target);
    const nextReviewInput = reviewInputs[activeReviewIndex + 1];
    if (nextReviewInput) {
      nextReviewInput.focus();
      nextReviewInput.select?.();
      return;
    }
  }
  const rows = Array.from(elements.gameRows.querySelectorAll("tr"));
  const currentIndex = rows.indexOf(row);
  const nextRow = rows[currentIndex + 1];
  const nextInput = nextRow?.querySelector(`[data-field='${fieldName}']`);

  if (nextInput) {
    nextInput.focus();
    nextInput.select();
  } else {
    focusFirstInputInGroup("cash-counts");
  }
}

function handleGroupedEnterKeydown(event) {
  if (event.key !== "Enter") return;

  event.preventDefault();
  const group = event.currentTarget.dataset.enterGroup;
  const currentIndex = Number(event.currentTarget.dataset.enterIndex);
  const nextInput = document.querySelector(`[data-enter-group='${group}'][data-enter-index='${currentIndex + 1}']`);

  if (nextInput) {
    nextInput.focus();
    if (typeof nextInput.select === "function") nextInput.select();
    return;
  }

  if (group === "lottery-totals") {
    elements.saveDayButton.focus();
    return;
  }

  if (group === "cash-counts") {
    focusFirstInputInGroup("lottery-totals");
    return;
  }

  if (group === "order-qty" || group === "extra-orders") {
    event.currentTarget.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function focusFirstInputInGroup(group) {
  const firstInput = document.querySelector(`[data-enter-group='${group}'][data-enter-index='0']`);
  if (firstInput) {
    firstInput.focus();
    if (typeof firstInput.select === "function") firstInput.select();
  }
}

function saveDay() {
  if (selectedDateIsClosed()) return;

  const dayLog = getDayLog();
  endingEditModeDate = "";
  syncActiveDayDraft();
  dayLog.totals = buildTotals();
  dayLog.savedAt = new Date().toISOString();
  dayLog.completedAt = dayLog.savedAt;
  dayLog.completedBy = currentUserName();
  Object.values(dayLog.entries || {}).forEach((entry) => {
    if (entry.todayEnding !== "" && entry.todayEnding !== undefined) {
      entry.completedBy = currentUserName();
      entry.completedAt = dayLog.savedAt;
    }
  });
  if (isPreviousDateDraftMode()) {
    state.dailyLogs[state.businessDate] = cloneJson(dayLog);
    previousDateDraft = null;
  }
  state.lastSavedAt = dayLog.savedAt;
  elements.syncStatus.textContent = "Day completed and locked";
  persistState();
  render();
}

function allEndingCountsEntered(date = state.businessDate) {
  if (isClosedDate(date)) return false;
  const entries = state.dailyLogs[date]?.entries || {};
  return inventory.every((game) => {
    const entry = entries[gameId(game)];
    return entry && entry.todayEnding !== "" && entry.todayEnding !== undefined;
  });
}

async function autoCompleteEndingDayIfReady() {
  if (selectedDateIsClosed() || isEndingCompleted() || !allEndingCountsEntered()) return;
  const dayLog = getDayLog();
  endingEditModeDate = "";
  syncActiveDayDraft();
  dayLog.totals = buildTotals();
  dayLog.savedAt = new Date().toISOString();
  dayLog.endingCompletedAt = dayLog.savedAt;
  dayLog.endingCompletedBy = currentUserName();
  Object.values(dayLog.entries || {}).forEach((entry) => {
    if (entry.todayEnding !== "" && entry.todayEnding !== undefined) {
      entry.endingCompletedBy = currentUserName();
      entry.endingCompletedAt = dayLog.savedAt;
    }
  });
  state.lastSavedAt = dayLog.savedAt;
  elements.syncStatus.textContent = "Ending counts complete and locked";
  persistState();
  saveCloudState();
  hydrateActiveDay();
  renderCalendar();
  // Only re-render game rows if no input is currently focused â€” avoids wiping active entry
  const activeField = document.activeElement;
  const isEntryFocused = activeField && activeField.closest("#gameRows");
  if (!isEntryFocused) {
    renderGames();
  } else {
    // Minimal update: just toggle the lock class without destroying DOM
    elements.dailyEntrySection.classList.toggle("ending-completed", isEndingCompleted());
    // Reapply lock state to all fields except the one being typed in
    elements.gameRows.querySelectorAll("[data-field='todayEnding']").forEach((f) => {
      if (f === activeField) return;
      if (isAdminRole()) {
        f.classList.add("ending-locked-field");
      } else {
        f.disabled = true;
      }
    });
  }
  renderTotals();
}

function buildMonth() {
  const selectedDate = new Date(`${state.businessDate}T12:00:00`);
  selectedDate.setDate(1);
  switchDate(selectedDate.toISOString().slice(0, 10));
}

function buildTotals() {
  const lotterySales = calculateLotterySales();
  const cashDrawer = calculateCashDrawer();
  return {
    instantSales: calculateInstantSales(),
    manualInstantSold: calculateManualInstantSales(),
    ticketsSold: calculateTicketsTotal(),
    lotterySales,
    cashDrawer,
    difference: cashDrawer - lotterySales,
  };
}

function buildAuditPayload() {
  return {
    businessDate: state.businessDate,
    totals: buildTotals(),
    games: inventory.map((game) => ({
      box: game.box,
      bookNumber: game.bookNumber,
      name: game.name,
      value: game.value,
      ticketCount: getTicketCount(game),
      previousEnding: getPreviousEnding(game),
      todayEnding: getEntry(game).todayEnding,
      ticketsSold: calculateTicketsSold(game),
      booksSold: calculateBooksSold(game, calculateTicketsSold(game)),
      sales: calculateGameSales(game),
      manualInstantSold: normalizeNumber(getEntry(game).manualInstantSold),
      monthToDateTickets: calculateRunningTickets(game, "month"),
    })),
    till: state.till,
    cashCounts: state.cashCounts,
    lastSavedAt: state.lastSavedAt,
  };
}

function exportJson() {
  const payload = buildAuditPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `lottery-close-${state.businessDate}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function renderSummary() {
  const dates = savedDatesInRange(summaryMode);
  elements.summaryRows.innerHTML = "";

  const rows = inventory
    .filter((game) => summaryValueFilter === "all" || String(game.value) === summaryValueFilter)
    .map((game) => {
    const totals = dates.reduce(
      (acc, date) => {
        acc.tickets += calculateTicketsSold(game, date);
        acc.sales += calculateGameSales(game, date);
        acc.manualInstantSold += normalizeNumber(getEntry(game, date).manualInstantSold);
        return acc;
      },
      { tickets: 0, sales: 0, manualInstantSold: 0 },
    );

      return {
        game,
        totals: {
          ...totals,
          booksSold: calculateBooksSold(game, totals.tickets),
          savedDays: dates.length,
        },
      };
    });

  rows.sort((a, b) => {
    const direction = summarySort.direction === "asc" ? 1 : -1;
    return compareSummaryRows(a, b, summarySort.key) * direction;
  });

  rows.forEach(({ game, totals }) => {
    const row = document.createElement("tr");
    row.className = valueClass(game.value);
    row.classList.toggle("dc-row", Boolean(state.orderDc[gameId(game)]));
    row.innerHTML = `
      <td>${game.box}</td>
      <td>${game.bookNumber || "-"}</td>
      <td>${game.name || "-"}</td>
      <td>${formatGameValue(game) || "-"}</td>
      <td>${totals.tickets}</td>
      <td>${totals.booksSold.toFixed(2)}</td>
      <td>${currency.format(totals.sales)}</td>
      <td>${currency.format(totals.manualInstantSold)}</td>
      <td>${dates.length}</td>
    `;
    elements.summaryRows.appendChild(row);
  });
}

function renderManagerReports() {
  if (!isAdminRole()) return;

  elements.reportRangeButtons.forEach((button) => {
    const active = button.dataset.reportRange === managerReportRange;
    button.classList.toggle("ghost-button", !active);
  });

  const dates = savedDatesInRange(managerReportRange);
  const dayRows = dates.map(getSavedDayTotals);
  const totals = dayRows.reduce(
    (acc, row) => {
      acc.lotterySales += row.lotterySales;
      acc.cashDrawer += row.cashDrawer;
      acc.variance += row.variance;
      acc.instantSales += row.instantSales;
      acc.manualInstantSold += row.manualInstantSold;
      acc.ticketsSold += row.ticketsSold;
      acc.grossSales += row.grossSales;
      acc.cashes += row.onlineCashes + row.instantCashes + row.officePayout;
      acc.cashless += row.cashlessOnlineSales + row.cashlessInstantSales;
      return acc;
    },
    {
      lotterySales: 0,
      cashDrawer: 0,
      variance: 0,
      instantSales: 0,
      manualInstantSold: 0,
      ticketsSold: 0,
      grossSales: 0,
      cashes: 0,
      cashless: 0,
    },
  );
  const avgDailyLottery = dates.length ? totals.lotterySales / dates.length : 0;
  const mismatch = totals.manualInstantSold - totals.instantSales;
  const biggestVariance = dayRows.reduce((winner, row) => (Math.abs(row.variance) > Math.abs(winner.variance || 0) ? row : winner), {});

  const cards = [
    ["Saved days", dates.length],
    ["Total lottery sales", currency.format(totals.lotterySales)],
    ["Cash drawer total", currency.format(totals.cashDrawer)],
    ["Cash +/- variance", `${totals.variance >= 0 ? "+" : ""}${currency.format(totals.variance)}`],
    ["Instant sales", currency.format(totals.instantSales)],
    ["Manual instant", currency.format(totals.manualInstantSold)],
    ["Manual mismatch", `${mismatch >= 0 ? "+" : ""}${currency.format(mismatch)}`],
    ["Tickets sold", totals.ticketsSold],
    ["Avg lottery/day", currency.format(avgDailyLottery)],
    ["Gross sales", currency.format(totals.grossSales)],
    ["Total cashes/payout", currency.format(totals.cashes)],
    ["Cashless sales", currency.format(totals.cashless)],
  ];

  elements.managerReportCards.innerHTML = cards
    .map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  const gameRows = inventory
    .filter((game) => game.value !== "")
    .map((game) => {
      const tickets = dates.reduce((sum, date) => sum + calculateTicketsSold(game, date), 0);
      const sales = tickets * normalizeNumber(game.value);
      return { game, tickets, sales };
    })
    .filter((row) => row.tickets > 0)
    .sort((a, b) => b.sales - a.sales || b.tickets - a.tickets)
    .slice(0, 12);

  elements.managerGameReportRows.innerHTML =
    gameRows
      .map(
        ({ game, tickets, sales }) => `
          <tr>
            <td>${game.box}</td>
            <td>${game.bookNumber || "-"}</td>
            <td>${game.name || "-"}</td>
            <td>${formatGameValue(game)}</td>
            <td>${tickets}</td>
            <td>${currency.format(sales)}</td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="6">No saved game sales in this range.</td></tr>`;

  const sortedDayRows = [...dayRows].sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));
  elements.managerDayReportRows.innerHTML =
    sortedDayRows
      .map(
        (row) => `
          <tr>
            <td>${row.date}${row.date === biggestVariance.date ? " *" : ""}</td>
            <td>${currency.format(row.lotterySales)}</td>
            <td>${currency.format(row.cashDrawer)}</td>
            <td class="${row.variance < 0 ? "negative-text" : "positive-text"}">${row.variance >= 0 ? "+" : ""}${currency.format(row.variance)}</td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="4">No saved daily closes in this range.</td></tr>`;
}

function compareSummaryRows(a, b, key) {
  const valueMap = {
    box: [a.game.box, b.game.box],
    bookNumber: [a.game.bookNumber || "", b.game.bookNumber || ""],
    name: [a.game.name || "", b.game.name || ""],
    value: [normalizeNumber(a.game.value), normalizeNumber(b.game.value)],
    tickets: [a.totals.tickets, b.totals.tickets],
    booksSold: [a.totals.booksSold, b.totals.booksSold],
    sales: [a.totals.sales, b.totals.sales],
    manualInstantSold: [a.totals.manualInstantSold, b.totals.manualInstantSold],
    savedDays: [a.totals.savedDays, b.totals.savedDays],
  };
  const [left, right] = valueMap[key] || valueMap.booksSold;

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right), undefined, { numeric: true });
}

function setSummaryMode(mode) {
  summaryMode = mode;
  elements.weekViewButton.classList.toggle("ghost-button", mode !== "week");
  elements.monthViewButton.classList.toggle("ghost-button", mode !== "month");
  renderSummary();
}

function setSummaryFilters() {
  const sourceValue = document.activeElement === elements.monthValueFilter ? elements.monthValueFilter.value : elements.summaryValueFilter.value;
  summaryValueFilter = sourceValue;
  elements.summaryValueFilter.value = sourceValue;
  elements.monthValueFilter.value = sourceValue;
  updateSortHeaderState();
  renderSummary();
  renderMonthMatrix();
}

function setSummarySortFromHeader(key) {
  const direction = summarySort.key === key && summarySort.direction === "asc" ? "desc" : "asc";
  summarySort = { key, direction };
  updateSortHeaderState();
  renderSummary();
}

function setMonthMatrixSort(key) {
  const direction = monthMatrixSort.key === key && monthMatrixSort.direction === "asc" ? "desc" : "asc";
  monthMatrixSort = { key, direction };
  renderMonthMatrix();
}

function updateSortHeaderState() {
  elements.sortHeaders.forEach((button) => {
    const isActive = button.dataset.sortKey === summarySort.key;
    button.classList.toggle("active", isActive);
    button.dataset.direction = isActive ? summarySort.direction : "";
  });
}

function setupSectionToggles() {
  // Only handle buttons that explicitly have the section-toggle class â€”
  // NOT the scan-review-toggle which uses its own delegated handler below.
  elements.sectionToggles.forEach((toggle) => {
    if (!toggle.classList.contains("section-toggle")) return;
    toggle.addEventListener("click", () => {
      const panelBody = document.querySelector(`#${toggle.dataset.toggleTarget}`);
      const isCollapsed = panelBody.hidden;
      panelBody.hidden = !isCollapsed;
      toggle.setAttribute("aria-expanded", String(isCollapsed));
      toggle.querySelector(".toggle-label").textContent = isCollapsed ? "Minimize" : "Maximize";
    });
  });

  // Scan review toggle â€” delegated so it works after panel becomes visible.
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".scan-review-toggle");
    if (!btn) return;
    const targetId = btn.dataset.toggleTarget;
    if (!targetId) return;
    const body = document.getElementById(targetId);
    if (!body) return;
    const isCollapsed = body.hidden;
    body.hidden = !isCollapsed;
    btn.setAttribute("aria-expanded", String(isCollapsed));
    const label = btn.querySelector(".toggle-label");
    if (label) label.textContent = isCollapsed ? "Hide" : "Show";
  });
}

function setActiveView(view, shouldScroll = false) {
  if (previousDateDraft && view !== activeView) {
    resolvePreviousDateDraftBeforeLeaving();
    hydrateActiveDay();
  }

  if (!isRoleAllowedView(view)) {
    view = "daily";
  }

  activeView = view;
  saveSessionAccess();
  elements.viewButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.viewButton === view);
  });
  elements.appViews.forEach((section) => {
    const views = section.dataset.view.split(/\s+/);
    section.classList.toggle("view-hidden", !views.includes(view));
  });

  // Scroll to the active section only when explicitly requested (nav button tap)
  if (shouldScroll) {
    const targetMap = {
      daily: elements.dailyEntrySection,
      till: elements.tillSection,
      history: document.querySelector("#history"),
      month: document.querySelector("#month-analysis"),
      order: document.querySelector("#order-sheet"),
      reports: document.querySelector("#manager-reports"),
    };
    const target = targetMap[view];
    if (target) {
      // Ensure daily entry panel is expanded before scrolling
      if (view === "daily") {
        const body = document.querySelector("#daily-entry-body");
        const toggle = document.querySelector("[data-toggle-target='daily-entry-body']");
        if (body && body.hidden) {
          body.hidden = false;
          if (toggle) {
            toggle.setAttribute("aria-expanded", "true");
            const label = toggle.querySelector(".toggle-label");
            if (label) label.textContent = "Minimize";
          }
        }
      }
      window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  }

  renderMobileEntryBar();
}

async function clearEntryColumn(column) {
  const isManual = column === "manualInstantSold";
  const dateLabel = new Date(`${state.businessDate}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const ok = await showAppConfirm({
    eyebrow: "âš ï¸ Confirm clear",
    title: isManual ? "Clear ALL manual instant sold?" : "Clear ALL today ending numbers?",
    body: isManual
      ? `This will wipe every Manual Sold entry for ${dateLabel}. The Today Ending column is untouched. This cannot be undone.`
      : `This will wipe every Today Ending # for ${dateLabel}. All other columns stay untouched. This cannot be undone.`,
    confirmText: isManual ? "Yes, clear manual" : "Yes, clear endings",
    cancelText: "Cancel",
  });
  if (!ok) return;

  const dayLog = getDayLog();
  const now = new Date().toISOString();
  Object.values(dayLog.entries || {}).forEach((entry) => {
    entry[column] = "";
    if (isManual) {
      entry.manualInstantUpdatedBy = "";
      entry.manualInstantUpdatedAt = "";
    } else {
      // Clear the timestamp too â€” don't stamp cleared cells
      entry.todayEndingUpdatedBy = "";
      entry.todayEndingUpdatedAt = "";
      // Also clear per-entry ending lock fields
      entry.endingCompletedBy = "";
      entry.endingCompletedAt = null;
    }
    if (isManual) {
      stampEntryFieldUpdate(entry, "manualInstantSold", "", now);
    } else {
      stampEntryFieldUpdate(entry, "todayEnding", "", now);
    }
  });
  dayLog.totals = buildTotals();
  dayLog.savedAt = null;
  dayLog.completedAt = null;
  dayLog.completedBy = "";
  if (!isManual) {
    // Reset ending-level lock so entries can be re-entered
    dayLog.endingCompletedAt = null;
    dayLog.endingCompletedBy = "";
    endingEditModeDate = "";
  } else {
    delete dayLog.manualMismatchOverride;
    if (scanDraft.type === "manual-instant") {
      const parsedDate = normalizeManualInstantParsed(scanDraft.parsed || {}).reportDate || state.businessDate;
      if (parsedDate === state.businessDate) {
        scanDraft = {
          type: "",
          files: [],
          parsed: null,
          salesSummaryReviewValues: null,
          manualReviewValues: null,
        };
      }
    }
  }
  state.lastSavedAt = new Date().toISOString();
  persistState();
  hydrateActiveDay();
  render();
  setActiveView(activeView);
  elements.syncStatus.textContent = isManual ? "Manual sold cleared" : "Ending numbers cleared";
  // Fire cloud save without awaiting so UI clears instantly
  saveCloudState();
}

function seedApril2026SheetData() {
  const seedVersion = "april-2026-through-14-v5";
  if (state.seedVersions?.[seedVersion]) return;

  const dates = [
    "2026-04-01",
    "2026-04-02",
    "2026-04-03",
    "2026-04-04",
    "2026-04-06",
    "2026-04-07",
    "2026-04-08",
    "2026-04-09",
    "2026-04-10",
    "2026-04-11",
    "2026-04-13",
    "2026-04-14",
  ];
  const entryDates = ["2026-03-31", ...dates];

  const endingCounts = {
    1: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    2: [18, 18, 18, 19, 20, 20, 0, 0, 0, 0, 0, 0, 0],
    3: [0, 1, 2, 3, 5, 5, 5, 5, 5, 9, 9, 13, 13],
    4: [22, 23, 24, 24, 0, 0, 2, 2, 2, 2, 2, 3, 3],
    5: [4, 4, 4, 5, 6, 8, 9, 9, 11, 12, 13, 13, 14],
    6: [7, 7, 7, 7, 9, 10, 10, 10, 12, 12, 13, 14, 15],
    7: [22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24],
    8: [31, 31, 31, 31, 32, 33, 33, 33, 33, 33, 33, 33, 33],
    9: [24, 25, 26, 27, 28, 30, 30, 30, 32, 32, 35, 35, 35],
    10: [34, 42, 46, 0, 6, 13, 17, 22, 30, 35, 41, 45, 47],
    11: [24, 24, 27, 30, 31, 32, 32, 33, 35, 37, 38, 38, 38],
    12: [37, 38, 42, 43, 44, 44, 45, 45, 46, 46, 47, 47, 47],
    13: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14, 14, 15],
    14: [21, 23, 24, 2, 5, 8, 10, 12, 15, 18, 21, 22, 24],
    15: [22, 23, 23, 23, 24, 24, 24, 25, 25, 27, 28, 28, 28],
    16: [11, 13, 14, 17, 17, 17, 19, 21, 24, 26, 28, 28, 30],
    17: [34, 36, 37, 39, 39, 39, 43, 47, 48, 2, 3, 3, 4],
    18: [12, 27, 34, 45, 14, 22, 27, 36, 42, 45, 4, 7, 10],
    19: [24, 35, 40, 48, 12, 18, 21, 29, 40, 45, 0, 4, 17],
    20: [14, 14, 16, 18, 18, 19, 20, 20, 20, 20, 20, 20, 20],
    21: [12, 15, 19, 23, 26, 30, 33, 36, 40, 42, 43, 43, 44],
    22: [13, 14, 15, 16, 18, 19, 19, 19, 19, 20, 20, 20, 20],
    23: [43, 43, 43, 43, 44, 44, 46, 46, 47, 1, 1, 1, 2],
    24: [34, 35, 38, 40, 40, 43, 43, 43, 43, 46, 47, 47, 51],
    25: [0, 23, 39, 6, 19, 34, 43, 47, 7, 20, 28, 32, 36],
    26: [30, 33, 35, 39, 41, 41, 42, 42, 43, 45, 48, 48, 50],
    27: [0, 10, 19, 32, 33, 43, 49, 3, 8, 16, 18, 23, 25],
    28: [20, 46, 19, 30, 7, 29, 2, 25, 42, 1, 30, 44, 50],
    29: [3, 4, 4, 5, 5, 5, 6, 7, 8, 9, 11, 11, 12],
    30: [0, 7, 13, 19, 22, 23, 25, 25, 26, 29, 32, 34, 36],
    31: [22, 25, 28, 30, 33, 35, 37, 39, 42, 43, 49, 1, 1],
    32: [61, 87, 99, 44, 52, 69, 88, 96, 10, 18, 40, 58, 68],
    33: [85, 85, 88, 91, 91, 91, 91, 91, 91, 97, 97, 97, 100],
    34: [28, 34, 44, 65, 84, 96, 3, 14, 23, 31, 43, 46, 57],
    35: [64, 64, 68, 77, 98, 98, 6, 7, 8, 18, 20, 20, 22],
    36: [69, 69, 74, 85, 91, 92, 94, 95, 99, 0, 0, 0, 0],
    37: [122, 129, 148, 158, 166, 184, 185, 185, 193, 4, 8, 13, 36],
    38: [17, 20, 31, 51, 62, 62, 71, 72, 72, 81, 82, 83, 90],
    39: [67, 70, 73, 81, 87, 90, 92, 97, 0, 8, 11, 12, 17],
    40: [87, 95, 3, 7, 11, 11, 13, 14, 15, 22, 25, 27, 36],
    41: [2, 24, 34, 45, 69, 76, 80, 83, 93, 114, 115, 131, 135],
    42: [58, 71, 91, 126, 150, 171, 187, 7, 24, 46, 57, 70, 95],
    43: [23, 53, 78, 85, 101, 109, 117, 127, 149, 165, 0, 26, 34],
    44: [115, 117, 117, 119, 121, 122, 122, 124, 124, 157, 159, 161, 167],
    45: [59, 69, 141, 164, 1, 29, 56, 60, 84, 104, 119, 142, 166],
    46: [0, 32, 68, 105, 177, 38, 70, 105, 136, 146, 186, 20, 28],
    A: [1, 24, 7, 17, 24, 6, 9, 12, 16, 22, 24, 28, 30],
  };

  const tillRows = {
    grossSales: [1992, 1877, 2872.5, 2247.5, 1483.5, 1720.5, 1450.5, 1920, 1606, 1611, 1402.5, 1344],
    onlineCancels: [0, 5.5, 2.5, 5, 0, 0.5, 0.5, 4, 57.5, 13, 0, 5],
    onlineCashes: [1402.5, 276.5, 1110, 771.5, 333.5, 57.5, 61.5, 329.5, 108, 2129, 149, 51.5],
    instantCashes: [682, 580, 1131, 537, 405, 467, 299, 636, 383, 413, 317, 229],
    cashlessOnlineOnlySales: [772, 708, 587.5, 1015.5, 594.5, 705, 830.5, 575, 794, 720, 474, 570.5],
    cashlessInstantSales: Array(12).fill(0),
    officePayout: [0, 0, 0, 290, 0, 0, 0, 0, 0, 1577, 0, 0],
    misprintWithoutCancel: Array(12).fill(0),
    adjustments: [50, 0, 65, 10, 0, 5, 0, 0, 0, 0, 0, 0],
  };

  const cashRows = {
    Quarters: [20, 0, 27, 60, 20, 42, 15, 27, 0, 13, 22, 0],
    Dimes: [5, 16, 43, 16, 1, 3, 17, 2, 1, 22, 10, 23],
    Nickels: [0, 6, 5, 18, 28, 6, 4, 1, 2, 7, 0, 12],
    Pennies: [0, 1, 0, 0, 0, 28, 5, 0, 11, 0, 0, 9],
    "$1": [9, 25, 22, 4, 9, 56, 32, 0, 21, 22, 4, 1],
    "$5": [1, 3, 14, 0, 10, 15, 9, 0, 8, 8, 1, 1],
    "$10": [2, 7, 7, 9, 8, 3, 0, 1, 1, 3, 1, 2],
    "$20": [13, 46, 41, 41, 34, 30, 13, 24, 40, 22, 42, 30],
    "$50": [0, 2, 1, 2, 1, 0, 2, 4, 2, 0, 2, 0],
    "$100": [0, 2, 1, 3, 2, 4, 4, 5, 2, 2, 1, 4],
    "Q Roll": [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
    "D Roll": Array(12).fill(0),
    "N Roll": Array(12).fill(0),
    "P Roll": Array(12).fill(0),
  };

  entryDates.forEach((date, index) => {
    const dayLog = getDayLog(date);
    dayLog.entries = {};
    inventory.forEach((game) => {
      const values = endingCounts[gameId(game)];
      if (!values) return;
      dayLog.entries[gameId(game)] = {
        todayEnding: values[index],
        manualInstantSold: "",
      };
    });
    dayLog.savedAt = new Date(`${date}T23:59:00`).toISOString();
  });

  dates.forEach((date, index) => {
    const dayLog = getDayLog(date);
    dayLog.till = normalizeTill(
      Object.fromEntries(Object.entries(tillRows).map(([key, values]) => [key, values[index] || 0])),
    );
    dayLog.cashCounts = Object.fromEntries(Object.entries(cashRows).map(([key, values]) => [key, values[index] || 0]));
    dayLog.savedAt = new Date(`${date}T23:59:00`).toISOString();
  });

  state.seedVersions = { ...(state.seedVersions || {}), [seedVersion]: true };
  persistState();
}

function renderMonthMatrix() {
  const dates = selectedMonthDates();

  // Sort visibleGames by monthMatrixSort
  const sortDir = monthMatrixSort.direction === "asc" ? 1 : -1;
  const visibleGames = inventory
    .filter((game) => game.value !== "")
    .filter((game) => summaryValueFilter === "all" || String(game.value) === summaryValueFilter)
    .sort((a, b) => {
      const key = monthMatrixSort.key;
      if (key === "box") return String(a.box).localeCompare(String(b.box), undefined, { numeric: true }) * sortDir;
      if (key === "value") return (normalizeNumber(a.value) - normalizeNumber(b.value)) * sortDir;
      if (key === "bookNumber") return String(a.bookNumber || "").localeCompare(String(b.bookNumber || ""), undefined, { numeric: true }) * sortDir;
      if (key === "game") return String(a.name || "").localeCompare(String(b.name || "")) * sortDir;
      // default fallback
      return (normalizeNumber(a.value) - normalizeNumber(b.value)) || String(a.box).localeCompare(String(b.box), undefined, { numeric: true });
    });

  const sortArrow = (key) => {
    if (monthMatrixSort.key !== key) return " â†•";
    return monthMatrixSort.direction === "asc" ? " â†‘" : " â†“";
  };

  elements.monthMatrixHead.innerHTML = `
    <tr>
      <th><button class="matrix-sort-btn${monthMatrixSort.key === "box" ? " active" : ""}" data-matrix-sort="box">Box${sortArrow("box")}</button></th>
      <th><button class="matrix-sort-btn${monthMatrixSort.key === "value" ? " active" : ""}" data-matrix-sort="value">Value${sortArrow("value")}</button></th>
      <th><button class="matrix-sort-btn${monthMatrixSort.key === "bookNumber" ? " active" : ""}" data-matrix-sort="bookNumber">Book #${sortArrow("bookNumber")}</button></th>
      <th><button class="matrix-sort-btn${monthMatrixSort.key === "game" ? " active" : ""}" data-matrix-sort="game">Game${sortArrow("game")}</button></th>
      ${dates
        .map((date) => {
          const day = new Date(`${date}T12:00:00`).getDate();
          return `<th class="month-day-col ${isClosedDate(date) ? "closed-matrix-day" : ""}">${day}</th>`;
        })
        .join("")}
      <th class="month-total-col">Tickets</th>
      <th class="month-total-col">Sales</th>
      <th class="month-total-col">Books</th>
    </tr>
  `;

  // Attach sort click handlers
  elements.monthMatrixHead.querySelectorAll("[data-matrix-sort]").forEach((btn) => {
    btn.addEventListener("click", () => setMonthMatrixSort(btn.dataset.matrixSort));
  });
  elements.monthMatrixRows.innerHTML = "";

  let currentValue = null;

  visibleGames.forEach((game) => {
    if (monthMatrixSort.key === "value" && currentValue !== game.value) {
      currentValue = game.value;
      const groupRow = document.createElement("tr");
      groupRow.className = "matrix-group-row";
      groupRow.innerHTML = `<td colspan="${dates.length + 7}">${formatGameValue(game)} games</td>`;
      elements.monthMatrixRows.appendChild(groupRow);
    }

    let monthlyTickets = 0;
    let monthlySales = 0;
    const dayCells = dates
      .map((date) => {
        if (isClosedDate(date)) return `<td class="closed-matrix-day"></td>`;

        const entry = state.dailyLogs[date]?.entries[gameId(game)];
        const ending = entry?.todayEnding ?? "";
        const tickets = calculateTicketsSoldFromSavedEntry(game, date);
        const sales = tickets * normalizeNumber(game.value);
        monthlyTickets += tickets;
        monthlySales += sales;

        if (ending === "") return "<td>-</td>";
        return `<td><span class="matrix-ending">${ending}</span><span class="matrix-sales">${Math.round(sales)}</span></td>`;
      })
      .join("");

    const row = document.createElement("tr");
    row.className = valueClass(game.value);
    row.classList.toggle("dc-row", Boolean(state.orderDc[gameId(game)]));
    row.innerHTML = `
      <td>${game.box}</td>
      <td>${formatGameValue(game)}</td>
      <td>${game.bookNumber || "-"}</td>
      <td>${game.name || "-"}</td>
      ${dayCells}
      <td>${monthlyTickets}</td>
      <td>${currency.format(monthlySales)}</td>
      <td>${calculateBooksSold(game, monthlyTickets).toFixed(2)}</td>
    `;
    elements.monthMatrixRows.appendChild(row);
  });
}

function renderOrderSheet() {
  elements.orderDate.disabled = isUserRole();
  elements.backstockWeeks.disabled = isUserRole();
  elements.highTicketThreshold.disabled = isUserRole();
  const orderedGames = inventory
    .filter((game) => game.value !== "")
    .sort((a, b) => normalizeNumber(a.value) - normalizeNumber(b.value) || String(a.box).localeCompare(String(b.box), undefined, { numeric: true }));

  elements.orderRows.innerHTML = "";
  const groups = new Map();

  orderedGames.forEach((game, index) => {
    const value = String(game.value);
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push({ game, index });
  });

  const leftColumn = document.createElement("div");
  const rightColumn = document.createElement("div");
  leftColumn.className = "order-block-column";
  rightColumn.className = "order-block-column";
  elements.orderRows.append(leftColumn, rightColumn);

  groups.forEach((items, value) => {
    const block = document.createElement("section");
    block.className = `order-value-block ${valueClass(value)}`;
    block.innerHTML = `
      <h3>${currency.format(Number(value)).replace(".00", "")} games</h3>
      <table class="order-table">
        <thead>
          <tr>
            <th>Box</th>
            <th>$</th>
            <th>Game #</th>
            <th>Name</th>
            <th>DC</th>
            <th>QTY</th>
            <th>Need</th>
            <th>Avg/day</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;
    const tbody = block.querySelector("tbody");

    items.forEach(({ game, index }) => {
    const id = gameId(game);
    const recommendation = calculateOrderNeed(game);
    const row = document.createElement("tr");
    row.classList.toggle("dc-row", Boolean(state.orderDc[id]));
    row.innerHTML = `
      <td>${game.box}</td>
      <td>${formatGameValue(game)}</td>
      <td>${game.bookNumber || "-"}</td>
      <td>${game.name || "-"}</td>
      <td><label class="dc-check"><input data-dc-box="${id}" type="checkbox" ${state.orderDc[id] ? "checked" : ""} /><span>DC</span></label></td>
      <td><input class="order-qty-input" data-order-box="${id}" data-enter-group="order-qty" data-enter-index="${index}" type="number" min="0" step="1" inputmode="numeric" pattern="[0-9]*" value="${state.orderInventory[id] ?? 0}" /></td>
      <td data-order-need-box="${id}" data-label="Need" class="${recommendation.need ? "order-need" : ""}">${recommendation.need}</td>
      <td data-order-avg-box="${id}">${recommendation.averageTickets.toFixed(1)}</td>
    `;
      tbody.appendChild(row);
    });

    const targetColumn = [1, 2, 5].includes(Number(value)) ? leftColumn : rightColumn;
    targetColumn.appendChild(block);
  });

  renderOrderReport(orderedGames);

  elements.orderRows.querySelectorAll("[data-order-box]").forEach((input) => {
    const saveQty = (event) => {
      const id = event.target.dataset.orderBox;
      state.orderInventory[id] = normalizeNumber(event.target.value);
      state.orderAudit[id] = {
        updatedBy: currentUserName(),
        updatedAt: new Date().toISOString(),
      };
      persistState();
      refreshOrderCalculations(orderedGames);
    };
    input.addEventListener("input", saveQty);
    input.addEventListener("change", saveQty);
    input.addEventListener("blur", saveQty);
    input.addEventListener("keydown", handleGroupedEnterKeydown);
  });

  elements.orderRows.querySelectorAll("[data-dc-box]").forEach((input) => {
    input.disabled = false;
    const requestDcChange = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const id = input.dataset.dcBox;
      const previousChecked = Boolean(state.orderDc[id]);
      const nextChecked = !previousChecked;
      const game = inventory.find((item) => gameId(item) === id);

      input.checked = previousChecked;
      const ok = await showAppConfirm({
        eyebrow: "DC safety check",
        title: nextChecked ? "Mark this game DC?" : "Remove DC from this game?",
        body: `${game?.box || id} ${game?.bookNumber || ""} ${game?.name || ""}. Confirm this DC status change before it updates every list.`,
        confirmText: nextChecked ? "Mark DC" : "Remove DC",
        cancelText: "Cancel",
      });

      if (!ok) {
        input.checked = previousChecked;
        return;
      }

      state.orderDc[id] = nextChecked;
      persistState();
      renderOrderSheet();
      renderGames();
      renderSummary();
      renderMonthMatrix();
    };

    input.addEventListener("click", requestDcChange);
    input.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") requestDcChange(event);
    });
  });

  const keepupRows = state.extraOrders
    .map((item, index) => {
      const orderNeeded = Math.max(0, normalizeNumber(item.keepUpTo) - normalizeNumber(item.qty));
      const keepLabel = `${item.keepUpTo}${item.unit ? ` ${item.unit}` : ""}`;
      return `
        <tr>
          <td>${item.name}</td>
          <td>${keepLabel}</td>
          <td><input data-extra-index="${index}" data-extra-field="qty" data-enter-group="extra-orders" data-enter-index="${index}" type="number" min="0" step="1" inputmode="numeric" pattern="[0-9]*" value="${item.qty ?? 0}" /></td>
          <td data-extra-need-index="${index}" class="${orderNeeded ? "order-need" : ""}">${orderNeeded}</td>
        </tr>
      `;
    })
    .join("");

  elements.extraBooksRows.innerHTML = `
    <section class="order-value-block keepup-block">
      <h3>Keep up to</h3>
      <table class="keepup-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Keep</th>
            <th>QTY</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>${keepupRows}</tbody>
      </table>
    </section>
  `;

  elements.extraBooksRows.querySelectorAll("[data-extra-index]").forEach((input) => {
    const saveExtraOrder = (event) => {
      const index = Number(event.target.dataset.extraIndex);
      state.extraOrders[index].qty = normalizeNumber(event.target.value);
      state.extraOrders[index].updatedBy = currentUserName();
      state.extraOrders[index].updatedAt = new Date().toISOString();
      persistState();
      refreshKeepupNeed(index);
      renderOrderReport(orderedGames);
    };
    input.addEventListener("input", saveExtraOrder);
    input.addEventListener("change", saveExtraOrder);
    input.addEventListener("blur", saveExtraOrder);
    if (input.dataset.extraField === "qty") {
      input.addEventListener("keydown", handleGroupedEnterKeydown);
    }
  });

  renderSavedOrders();
}

function refreshKeepupNeed(index) {
  const item = state.extraOrders[index];
  const needCell = elements.extraBooksRows.querySelector(`[data-extra-need-index='${index}']`);
  if (!item || !needCell) return;

  const orderNeeded = Math.max(0, normalizeNumber(item.keepUpTo) - normalizeNumber(item.qty));
  needCell.textContent = orderNeeded;
  needCell.classList.toggle("order-need", Boolean(orderNeeded));
}

function refreshOrderCalculations(orderedGames) {
  orderedGames.forEach((game) => {
    const id = gameId(game);
    const recommendation = calculateOrderNeed(game);
    const needCell = elements.orderRows.querySelector(`[data-order-need-box='${id}']`);
    const avgCell = elements.orderRows.querySelector(`[data-order-avg-box='${id}']`);

    if (needCell) {
      needCell.textContent = recommendation.need;
      needCell.classList.toggle("order-need", Boolean(recommendation.need));
    }

    if (avgCell) {
      avgCell.textContent = recommendation.averageTickets.toFixed(1);
    }
  });

  renderOrderReport(orderedGames);
}

function nextWednesdayIso(fromDate = new Date()) {
  const date = new Date(fromDate);
  date.setHours(12, 0, 0, 0);
  let daysUntilWednesday = (3 - date.getDay() + 7) % 7;
  if (daysUntilWednesday === 0) daysUntilWednesday = 7;
  date.setDate(date.getDate() + daysUntilWednesday);
  return date.toISOString().slice(0, 10);
}

function clearExpiredOrderPreview() {
  if (!state.currentOrderPreview || !state.orderPreviewClearDate) return false;
  if (todayIso() < state.orderPreviewClearDate) return false;
  state.currentOrderPreview = null;
  state.orderPreviewClearDate = "";
  persistState();
  if (supabaseClient) saveCloudState();
  return true;
}

function orderSnapshotReportItems(snapshot) {
  const gameItems = (snapshot?.rows || [])
    .filter((row) => normalizeNumber(row.need) > 0)
    .sort((a, b) => String(a.bookNumber || "").localeCompare(String(b.bookNumber || ""), undefined, { numeric: true }))
    .map((row) => ({
      box: row.box,
      value: currency.format(row.value).replace(".00", ""),
      bookNumber: row.bookNumber || "-",
      name: row.name || "-",
      order: row.need,
      className: "",
    }));

  const supplyItems = (snapshot?.extraOrders || []).map((item) => ({
    box: "-",
    value: "SUPPLY",
    bookNumber: "-",
    name: item.name,
    order: `${normalizeNumber(item.orderNeeded)}${item.unit ? ` ${item.unit}` : ""}`,
    className: "extra-order-report-row",
  }));

  return [...gameItems, ...supplyItems];
}

function renderOrderReport() {
  elements.orderReportRows.innerHTML = "";
  clearExpiredOrderPreview();
  const snapshot = state.currentOrderPreview;
  elements.orderInvoiceCard.classList.toggle("order-invoice-minimized", !snapshot);

  if (!snapshot) {
    elements.orderReportRows.innerHTML = `<div class="order-report-empty">Complete order to generate the order invoice. This preview clears automatically every Wednesday.</div>`;
    return;
  }

  const reportItems = orderSnapshotReportItems(snapshot);
  const totalBooksNeeded = (snapshot.rows || []).reduce((sum, row) => sum + normalizeNumber(row.need), 0);

  if (!reportItems.length) {
    elements.orderReportRows.innerHTML = `<div class="order-report-empty">Completed order has no books or supplies needed.</div>`;
  } else {
    const midpoint = Math.ceil(reportItems.length / 2);
    elements.orderReportRows.innerHTML = [reportItems.slice(0, midpoint), reportItems.slice(midpoint)]
      .filter((items) => items.length)
      .map(
        (items) => `
          <table class="order-report-table">
            <thead>
              <tr>
                <th>Box</th>
                <th>$</th>
                <th>Game #</th>
                <th>Game</th>
                <th>Order</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                    <tr class="${item.className}">
                      <td>${item.box}</td>
                      <td>${item.value}</td>
                      <td>${item.bookNumber}</td>
                      <td>${item.name}</td>
                      <td><span class="order-needed-pill">${item.order}</span></td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        `,
      )
      .join("");

    const totalRow = document.createElement("div");
    totalRow.className = "order-total-row order-total-strip";
    totalRow.innerHTML = `<span>Total scratch-off books</span><strong>${totalBooksNeeded}</strong>`;
    elements.orderReportRows.prepend(totalRow);
  }
}

function buildCurrentOrderSnapshot() {
  const rows = inventory
    .filter((game) => game.value !== "" && !state.orderDc[gameId(game)])
    .map((game) => {
      const recommendation = calculateOrderNeed(game);
      return {
        box: game.box,
        value: game.value,
        bookNumber: game.bookNumber,
        name: game.name,
        dc: false,
        qty: normalizeNumber(state.orderInventory[gameId(game)]),
        stockOnHand: normalizeNumber(state.orderInventory[gameId(game)]),
        need: recommendation.need,
        averageTickets: recommendation.averageTickets,
        updatedBy: state.orderAudit[gameId(game)]?.updatedBy || "",
        updatedAt: state.orderAudit[gameId(game)]?.updatedAt || "",
      };
    });

  const extraOrders = state.extraOrders
    .map((item) => ({ ...item, orderNeeded: Math.max(0, normalizeNumber(item.keepUpTo) - normalizeNumber(item.qty)) }))
    .filter((item) => item.orderNeeded > 0);

  return {
    id: `${state.orderSettings.date}-${Date.now()}`,
    date: state.orderSettings.date,
    savedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    completedBy: currentUserName(),
    totalBooks: rows.reduce((sum, row) => sum + row.need, 0),
    rows,
    extraOrders,
    inputAudit: cloneJson(state.orderAudit || {}),
  };
}

async function saveWeeklyOrder() {
  const snapshot = buildCurrentOrderSnapshot();
  const totalBooks = snapshot.rows.reduce((sum, r) => sum + r.need, 0);
  const ok = await showAppConfirm({
    eyebrow: "Complete order",
    title: "Complete & save this order?",
    body: `${totalBooks} book${totalBooks===1?"":"s"} to order. Saves to completed records and clears QTY for next week.`,
    confirmText: "Complete order",
    cancelText: "Keep editing",
  });
  if (!ok) return;
  state.savedOrders = [snapshot, ...(state.savedOrders || [])].slice(0, 12);
  state.currentOrderPreview = snapshot;
  state.orderPreviewClearDate = nextWednesdayIso();
  state.orderInventory = emptyOrderInventory();
  state.orderAudit = {};
  state.extraOrders = cloneExtraOrders();
  state.orderSettings.date = todayIso();
  elements.orderDate.value = state.orderSettings.date;
  persistState();
  elements.syncStatus.textContent = "Order completed and cleared";
  renderOrderSheet();
  renderSavedOrders();
}

function renderSavedOrders() {
  const savedOrders = state.savedOrders || [];

  if (!savedOrders.length) {
    elements.savedOrderRows.innerHTML = `<div class="saved-order-empty">No weekly order sheets saved yet.</div>`;
    return;
  }

  elements.savedOrderRows.innerHTML = savedOrders
    .map(
      (order) => {
        const orderRows = order.rows
          .filter((row) => row.need > 0)
          .sort((a, b) => String(a.bookNumber || "").localeCompare(String(b.bookNumber || ""), undefined, { numeric: true }))
          .map((row) => `<tr><td>${row.box}</td><td>${currency.format(row.value).replace(".00", "")}</td><td>${row.bookNumber || "-"}</td><td>${row.name}</td><td class="stock-on-hand-cell">${row.stockOnHand ?? row.qty ?? 0}</td><td class="order-needed-cell">${row.need}</td></tr>`)
          .join("");
        const extraRows = (order.extraOrders || [])
          .map((item) => `<tr><td>-</td><td>SUPPLY</td><td>-</td><td>${item.name}</td><td class="stock-on-hand-cell">${normalizeNumber(item.qty)}</td><td class="order-needed-cell">${normalizeNumber(item.orderNeeded)}${item.unit ? ` ${item.unit}` : ""}</td></tr>`)
          .join("");
        return `
          <details class="saved-order-item">
            <summary>
              <strong>${order.date}</strong>
              <span>${order.totalBooks} books</span>
              <small>${order.completedBy || "Unknown"} - ${new Date(order.savedAt).toLocaleString()}</small>
            </summary>
            <div class="saved-order-actions">
              <button class="ghost-button" type="button" data-download-order="${order.id}">Download CSV</button>
              <button type="button" data-print-order="${order.id}">Print sheet</button>
            </div>
            <table class="saved-order-detail">
              <thead><tr><th>Box</th><th>$</th><th>Game #</th><th>Game</th><th>Stock</th><th>Order</th></tr></thead>
              <tbody>${orderRows || `<tr><td colspan="6">No game books needed.</td></tr>`}${extraRows}</tbody>
            </table>
          </details>
        `;
      },
    )
    .join("");

  elements.savedOrderRows.querySelectorAll("[data-download-order]").forEach((button) => {
    button.addEventListener("click", () => downloadOrderSheet(button.dataset.downloadOrder));
  });
  elements.savedOrderRows.querySelectorAll("[data-print-order]").forEach((button) => {
    button.addEventListener("click", () => printOrderSheet(button.dataset.printOrder));
  });
}

function findSavedOrder(orderId) {
  return (state.savedOrders || []).find((order) => order.id === orderId);
}

function orderRowsForExport(order) {
  const gameRows = (order?.rows || [])
    .filter((row) => normalizeNumber(row.need) > 0)
    .sort((a, b) => String(a.bookNumber || "").localeCompare(String(b.bookNumber || ""), undefined, { numeric: true }))
    .map((row) => ({
      box: row.box,
      value: currency.format(row.value).replace(".00", ""),
      bookNumber: row.bookNumber || "-",
      game: row.name || "-",
      stock: row.stockOnHand ?? row.qty ?? 0,
      order: row.need,
    }));

  const supplyRows = (order?.extraOrders || []).map((item) => ({
    box: "-",
    value: "SUPPLY",
    bookNumber: "-",
    game: item.name,
    stock: normalizeNumber(item.qty),
    order: `${normalizeNumber(item.orderNeeded)}${item.unit ? ` ${item.unit}` : ""}`,
  }));

  return [...gameRows, ...supplyRows];
}

function csvEscape(value) {
  const raw = String(value ?? "");
  return /[",\n]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw;
}

function downloadOrderSheet(orderId) {
  const order = findSavedOrder(orderId);
  if (!order) return;
  const rows = orderRowsForExport(order);
  const csvRows = [
    ["Date", order.date],
    ["Completed by", order.completedBy || ""],
    ["Saved at", new Date(order.savedAt).toLocaleString()],
    [],
    ["Box", "$", "Game #", "Game", "Stock on hand", "Order"],
    ...rows.map((row) => [row.box, row.value, row.bookNumber, row.game, row.stock, row.order]),
  ];
  const csv = csvRows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lottery-order-${order.date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function printOrderSheet(orderId) {
  const order = findSavedOrder(orderId);
  if (!order) return;
  const rows = orderRowsForExport(order);
  const html = `
    <!doctype html>
    <html>
      <head>
        <title>Lottery Order ${order.date}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
          h1 { margin: 0 0 4px; font-size: 22px; }
          p { margin: 0 0 16px; color: #444; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #999; padding: 6px; text-align: left; }
          th { background: #e9efe5; }
          td:last-child { font-weight: 700; text-align: center; }
        </style>
      </head>
      <body>
        <h1>Lottery Reorder Sheet</h1>
        <p>${order.date} - Completed by ${order.completedBy || "Unknown"} - ${new Date(order.savedAt).toLocaleString()}</p>
        <table>
          <thead><tr><th>Box</th><th>$</th><th>Game #</th><th>Game</th><th>Stock on hand</th><th>Order</th></tr></thead>
          <tbody>
            ${
              rows.length
                ? rows.map((row) => `<tr><td>${row.box}</td><td>${row.value}</td><td>${row.bookNumber}</td><td>${row.game}</td><td>${row.stock}</td><td>${row.order}</td></tr>`).join("")
                : `<tr><td colspan="6">No books or supplies needed.</td></tr>`
            }
          </tbody>
        </table>
      </body>
    </html>
  `;
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function printReconcileSheet(date = state.businessDate) {
  const currentGames = (reconcileVisible ? reconcileGamesForDate(date) : inventory).filter((game) => {
    if (!gameSearchQuery) return true;
    const q = gameSearchQuery.toLowerCase();
    return (
      (game.name || "").toLowerCase().includes(q) ||
      (game.bookNumber || "").includes(q) ||
      String(game.box).includes(q)
    );
  });

  const printableRows = currentGames.map((game) => {
    const entry = getEntry(game, date);
    const tickets = calculateTicketsSold(game, date);
    const autoSales = calculateGameSales(game, date);
    const manualValue = getDisplayedManualValue(game, date);
    const hasManual = manualValue !== "" && manualValue !== undefined && manualValue !== null;
    const manual = normalizeNumber(manualValue);
    const variance = hasManual ? manual - autoSales : null;
    const mismatch = reconcileVisible && (!hasManual || Math.abs(variance || 0) > 0.009);
    return {
      game,
      entry,
      tickets,
      autoSales,
      hasManual,
      manual,
      variance,
      mismatch,
    };
  });

  const title = reconcileVisible ? "Daily Ticket Reconcile Sheet" : "Daily Ticket Count Sheet";
  const subtitle = reconcileVisible
    ? `${date} - Sorted by game # - Zero-sale books hidden`
    : `${date} - Box order view`;
  const html = `
    <!doctype html>
    <html>
      <head>
        <title>${title} ${date}</title>
        <style>
          @page { size: portrait; margin: 0.28in; }
          html, body { margin: 0; padding: 0; background: #fff; }
          body { font-family: Arial, sans-serif; padding: 10px; color: #111; }
          h1 { margin: 0 0 4px; font-size: 20px; }
          p { margin: 0 0 12px; color: #222; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 11px; }
          th, td { border: 1px solid #a9a9a9; padding: 5px 6px; text-align: left; }
          th { background: #f2f4ea; }
          td { color: #111; }
          .money { text-align: right; white-space: nowrap; }
          .center { text-align: center; }
          .variance-error { color: #9d2424; font-weight: 700; }
          th:nth-child(1), td:nth-child(1) { width: 5%; }
          th:nth-child(2), td:nth-child(2) { width: 8%; }
          th:nth-child(3), td:nth-child(3) { width: 24%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          th:nth-child(4), td:nth-child(4) { width: 6%; }
          th:nth-child(5), td:nth-child(5),
          th:nth-child(6), td:nth-child(6),
          th:nth-child(7), td:nth-child(7) { width: 8%; }
          th:nth-child(8), td:nth-child(8),
          th:nth-child(9), td:nth-child(9),
          th:nth-child(10), td:nth-child(10) { width: 11%; }
          tr { page-break-inside: avoid; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>${subtitle}</p>
        <table>
          <thead>
            <tr>
              <th>Box</th>
              <th>Book #</th>
              <th>Game</th>
              <th>$</th>
              <th>Yesterday</th>
              <th>Ending</th>
              <th>Tickets</th>
              <th>Auto sales</th>
              <th>Manual sold</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            ${
              printableRows.length
                ? printableRows.map(({ game, tickets, autoSales, manual, hasManual, variance, mismatch, entry }) => `
                    <tr>
                      <td class="center">${game.box}</td>
                      <td>${game.bookNumber || "-"}</td>
                      <td>${game.name || "-"}</td>
                      <td class="money">${formatGameValue(game) || "-"}</td>
                      <td class="center">${getPreviousEnding(game, date)}</td>
                      <td class="center">${entry.todayEnding === "" ? "" : entry.todayEnding}</td>
                      <td class="center">${tickets}</td>
                      <td class="money">${Math.abs(autoSales) > 0.009 ? currency.format(autoSales) : ""}</td>
                      <td class="money">${hasManual ? currency.format(manual) : ""}</td>
                      <td class="money ${mismatch ? "variance-error" : ""}">${hasManual ? currency.format(variance) : reconcileVisible ? "Missing" : ""}</td>
                    </tr>`).join("")
                : `<tr><td colspan="10">No rows available for this date.</td></tr>`
            }
          </tbody>
        </table>
      </body>
    </html>
  `;
  if (activePrintFrame) {
    activePrintFrame.remove();
    activePrintFrame = null;
  }

  const frame = document.createElement("iframe");
  activePrintFrame = frame;
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  frame.setAttribute("aria-hidden", "true");
  document.body.appendChild(frame);

  frame.onload = () => {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } catch {
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lottery-${reconcileVisible ? "reconcile" : "daily"}-${date}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 5000);
      alert("Print preview could not open. A printable file was downloaded instead. In the print dialog, choose Save as PDF if needed.");
    } finally {
      window.setTimeout(() => {
        frame.remove();
        if (activePrintFrame === frame) activePrintFrame = null;
      }, 1500);
    }
  };

  const doc = frame.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();
}

function render() {
  elements.businessDate.value = state.businessDate;
  setDailyEntryDateLabel(state.businessDate);
  renderCalendar();
  renderGames();
  renderCashRows();
  renderTillInputs();
  renderTotals();
  renderScanReview();
  renderOrderSheet();
  renderManagerReports();
}

elements.businessDate.value = state.businessDate;
elements.businessDate.addEventListener("change", (event) => switchDate(event.target.value));
elements.seedMonthButton.addEventListener("click", buildMonth);
elements.previousMonthButton.addEventListener("click", () => shiftDay(-1));
elements.nextMonthButton.addEventListener("click", () => shiftDay(1));
elements.todayButton.addEventListener("click", () => switchDate(todayIso()));
elements.reconcileButton.addEventListener("click", () => {
  reconcileVisible = !reconcileVisible;
  elements.reconcileButton.textContent = reconcileVisible ? "Normal view" : "Reconcile";
  renderGames();
  renderTotals();
});
elements.printReconcileButton?.addEventListener("click", () => {
  printReconcileSheet();
});
elements.manualOverrideButton?.addEventListener("click", async () => {
  const instantSales = calculateInstantSales();
  const manualInstant = isActiveManualReview() ? calculateDisplayedManualInstantSales() : calculateManualInstantSales();
  const difference = manualInstant - instantSales;
  const ok = await showAppConfirm({
    eyebrow: "Override mismatch",
    title: "Accept this instant mismatch?",
    body: `This will mark ${state.businessDate} as manager-approved with auto ${currency.format(instantSales)}, manual ${currency.format(manualInstant)}, and difference ${currency.format(difference)}.`,
    confirmText: "Override",
    cancelText: "Cancel",
  });
  if (!ok) return;
  const dayLog = getDayLog();
  dayLog.manualMismatchOverride = {
    instantSales,
    manualInstant,
    difference,
    approvedBy: currentUserName(),
    approvedAt: new Date().toISOString(),
  };
  persistState();
  saveCloudState();
  renderTotals();
  renderCalendar();
});
elements.editInventoryButton.addEventListener("click", () => {
  inventoryEditMode = !inventoryEditMode;
  elements.editInventoryButton.textContent = inventoryEditMode ? "Lock inventory" : "Edit inventory";
  elements.editInventoryButton.classList.toggle("active-edit", inventoryEditMode);
  renderGames();
});
elements.editDayButton?.addEventListener("click", toggleEditDayMode);
elements.saveDayButton.addEventListener("click", saveDay);
elements.salesSummarySubmitButton?.addEventListener("click", applySalesSummaryScan);
elements.manualReviewSubmitButton?.addEventListener("click", applyManualInstantScan);
elements.exportButton.addEventListener("click", exportJson);
const _gst = document.querySelector("#gameSearchToggle");
const _gsi = document.querySelector("#gameSearchInput");
if (_gst && _gsi) {
  _gst.addEventListener("click", () => {
    _gsi.hidden = !_gsi.hidden;
    if (_gsi.hidden) { gameSearchQuery = ""; _gsi.value = ""; renderGames(); } else { _gsi.focus(); }
  });
  _gsi.addEventListener("input", e => { gameSearchQuery = e.target.value.trim(); renderGames(); });
  _gsi.addEventListener("keydown", e => { if (e.key === "Escape") { gameSearchQuery = ""; _gsi.value = ""; _gsi.hidden = true; renderGames(); } });
}
elements.orderDate.value = state.orderSettings.date;
elements.backstockWeeks.value = state.orderSettings.backstockWeeks;
elements.highTicketThreshold.value = state.orderSettings.highTicketThreshold;
elements.orderDate.addEventListener("change", (event) => {
  state.orderSettings.date = event.target.value;
  persistState();
  renderOrderSheet();
});
elements.backstockWeeks.addEventListener("input", (event) => {
  state.orderSettings.backstockWeeks = normalizeNumber(event.target.value);
  persistState();
  renderOrderSheet();
});
elements.highTicketThreshold.addEventListener("input", (event) => {
  state.orderSettings.highTicketThreshold = normalizeNumber(event.target.value);
  persistState();
  renderOrderSheet();
});
elements.saveWeeklyOrderButton.addEventListener("click", saveWeeklyOrder);
elements.clearEndingButton.addEventListener("click", () => clearEntryColumn("todayEnding"));
elements.clearManualButton.addEventListener("click", () => clearEntryColumn("manualInstantSold"));
elements.authSignInButton.addEventListener("click", signInToCloud);
elements.authSignUpButton.addEventListener("click", signUpForCloud);
elements.authSignOutButton.addEventListener("click", signOutOfCloud);
elements.cloudSyncButton.addEventListener("click", () => {
  loadCloudState();
});
elements.mobileSyncButton.addEventListener("click", () => {
  loadCloudState();
});
elements.mobileLockButton.addEventListener("click", () => lockApp());
elements.scanSalesSummaryButton.addEventListener("click", () => {
  elements.salesSummaryScanInput.value = "";
  elements.salesSummaryScanInput.click();
});
elements.scanManualInstantButton.addEventListener("click", () => {
  elements.manualInstantScanInput.value = "";
  elements.manualInstantScanInput.click();
});
elements.salesSummaryScanInput.addEventListener("change", (event) => {
  handleScanFiles("sales-summary", event.target.files);
});
elements.manualInstantScanInput.addEventListener("change", (event) => {
  handleScanFiles("manual-instant", event.target.files);
});
elements.addScanPageButton.addEventListener("click", () => {
  elements.manualInstantScanInput.value = "";
  elements.manualInstantScanInput.click();
});
elements.parseScanPagesButton.addEventListener("click", () => {
  if (scanDraft.type === "sales-summary") {
    parseSalesSummaryScan();
  } else {
    parseManualInstantScan();
  }
});
elements.clearScanReviewButton.addEventListener("click", clearScanReview);
elements.applyScanButton.addEventListener("click", () => {
  if (scanDraft.type === "sales-summary") {
    applySalesSummaryScan();
    return;
  }
  if (scanDraft.type === "manual-instant") {
    applyManualInstantScan();
    return;
  }
  elements.scanParserStatus.textContent = "No scan is ready to apply.";
});
elements.pinEntry.addEventListener("input", (event) => {
  const value = event.target.value.replace(/\D/g, "").slice(0, 4);
  event.target.value = value;
  if (value.length === 4) unlockWithPin(value);
});
elements.pinEntry.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    unlockWithPin(elements.pinEntry.value);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    elements.pinEntry.value = "";
  }
});
["click", "pointerdown", "touchstart"].forEach((eventName) => {
  elements.pinOverlay.addEventListener(
    eventName,
    (event) => {
      if (event.target.closest("button")) return;
      focusPinEntry();
    },
    { passive: eventName === "touchstart" },
  );
});
elements.pinPadButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    pressPinPadButton(button);
    button.blur();
  });
});
elements.pinLockButton.addEventListener("click", () => lockApp());
elements.saveAdminPinButton.addEventListener("click", saveAdminPin);
elements.addUserButton.addEventListener("click", addUserPin);
elements.mobileDockToggleButton.addEventListener("click", toggleMobileEntryDock);
elements.mobilePrevBoxButton.addEventListener("click", () => focusAdjacentMobileGame(-1));
elements.mobileNextBoxButton.addEventListener("click", () => focusAdjacentMobileGame(1));
elements.viewButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.viewButton, true));
});
elements.weekViewButton.addEventListener("click", () => setSummaryMode("week"));
elements.monthViewButton.addEventListener("click", () => setSummaryMode("month"));
elements.summaryValueFilter.addEventListener("change", setSummaryFilters);
elements.monthValueFilter.addEventListener("change", setSummaryFilters);
elements.reportRangeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    managerReportRange = button.dataset.reportRange;
    renderManagerReports();
  });
});
elements.sortHeaders.forEach((button) => {
  button.addEventListener("click", () => setSummarySortFromHeader(button.dataset.sortKey));
});
document.addEventListener("focusin", (event) => {
  resetIdleTimer();
  if (event.target.matches("input:not([type='checkbox']):not([type='date']), select, textarea")) {
    event.target.dataset.focusValue = event.target.value;
  }

  if (event.target.matches("input:not([type='checkbox']):not([type='date']), textarea")) {
    try {
      event.target.select();
    } catch {
      // Some browser input types do not expose selectable text.
    }
  }
});
document.addEventListener(
  "pointerdown",
  (event) => {
    const activeInput = document.activeElement;
    if (!activeInput?.matches?.("[data-field='todayEnding']")) return;
    if (event.target === activeInput) return;
    suppressNextMobileAutoAdvance = true;
  },
  { capture: true },
);
["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
  document.addEventListener(eventName, resetIdleTimer, { passive: true });
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!event.target.matches("input:not([type='checkbox']), select, textarea")) return;

  event.preventDefault();
  event.target.value = event.target.dataset.focusValue ?? event.target.defaultValue ?? "";
  event.target.dispatchEvent(new Event("input", { bubbles: true }));
  event.target.dispatchEvent(new Event("change", { bubbles: true }));
  event.target.blur();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    writeLocalState();
    if (supabaseClient && cloudSaveTimer) {
      window.clearTimeout(cloudSaveTimer);
      cloudSaveTimer = null;
      saveCloudState();
    }
    return;
  }
  if (supabaseClient) {
    refreshCloudPolling();
    loadCloudState({ quietIfUnchanged: true });
  }
});
window.addEventListener("focus", () => {
  if (!supabaseClient) return;
  refreshCloudPolling();
  loadCloudState({ quietIfUnchanged: true });
});
window.addEventListener("pageshow", () => {
  if (!supabaseClient) return;
  refreshCloudPolling();
  loadCloudState({ quietIfUnchanged: true });
});
window.addEventListener("pagehide", () => {
  writeLocalState();
  if (supabaseClient && cloudSaveTimer) {
    window.clearTimeout(cloudSaveTimer);
    cloudSaveTimer = null;
    saveCloudState();
  }
});
setupSectionToggles();

seedApril2026SheetData();
hydrateActiveDay();
updateSortHeaderState();
const savedSession = loadSessionAccess();
if (savedSession?.activeView) activeView = savedSession.activeView;
if (savedSession?.role && savedSession?.user) currentUser = savedSession.user;
render();
applyAccessRole(savedSession?.role || null);
setActiveView(activeView);
initCloudSync();
if (!savedSession?.role) {
  focusPinEntry();
} else {
  resetIdleTimer();
}
