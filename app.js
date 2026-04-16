const STORAGE_KEY = "lotteryTillState:v2";
const CLOUD_STORE_KEY = "lottery-till-main";
const IDLE_LOCK_MS = 180000;
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

const elements = {
  businessDate: document.querySelector("#businessDate"),
  previousMonthButton: document.querySelector("#previousMonthButton"),
  nextMonthButton: document.querySelector("#nextMonthButton"),
  todayButton: document.querySelector("#todayButton"),
  seedMonthButton: document.querySelector("#seedMonthButton"),
  calendarDays: document.querySelector("#calendarDays"),
  monthTitle: document.querySelector("#monthTitle"),
  dailyCountDate: document.querySelector("#dailyCountDate"),
  gameRows: document.querySelector("#gameRows"),
  dailyEntrySection: document.querySelector("#daily-entry"),
  tillSection: document.querySelector("#till"),
  gameRowTemplate: document.querySelector("#gameRowTemplate"),
  editInventoryButton: document.querySelector("#editInventoryButton"),
  saveDayButton: document.querySelector("#saveDayButton"),
  previousDateGuard: document.querySelector("#previousDateGuard"),
  previousDateGuardText: document.querySelector("#previousDateGuardText"),
  unlockPreviousDateButton: document.querySelector("#unlockPreviousDateButton"),
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
  reconcileButton: document.querySelector("#reconcileButton"),
  reconcilePanel: document.querySelector("#reconcilePanel"),
  reconcileRows: document.querySelector("#reconcileRows"),
  cashRows: document.querySelector("#cashRows"),
  auditLog: document.querySelector("#auditLog"),
  exportButton: document.querySelector("#exportButton"),
  syncStatus: document.querySelector("#syncStatus"),
  weekViewButton: document.querySelector("#weekViewButton"),
  monthViewButton: document.querySelector("#monthViewButton"),
  summaryValueFilter: document.querySelector("#summaryValueFilter"),
  monthValueFilter: document.querySelector("#monthValueFilter"),
  summaryRows: document.querySelector("#summaryRows"),
  monthMatrixHead: document.querySelector("#monthMatrixHead"),
  monthMatrixRows: document.querySelector("#monthMatrixRows"),
  orderDate: document.querySelector("#orderDate"),
  backstockWeeks: document.querySelector("#backstockWeeks"),
  highTicketThreshold: document.querySelector("#highTicketThreshold"),
  orderRows: document.querySelector("#orderRows"),
  orderReportRows: document.querySelector("#orderReportRows"),
  extraBooksRows: document.querySelector("#extraBooksRows"),
  saveWeeklyOrderButton: document.querySelector("#saveWeeklyOrderButton"),
  savedOrderRows: document.querySelector("#savedOrderRows"),
  clearActiveTabButton: document.querySelector("#clearActiveTabButton"),
  authEmail: document.querySelector("#authEmail"),
  authPassword: document.querySelector("#authPassword"),
  authUserLabel: document.querySelector("#authUserLabel"),
  authSignInButton: document.querySelector("#authSignInButton"),
  authSignUpButton: document.querySelector("#authSignUpButton"),
  authSignOutButton: document.querySelector("#authSignOutButton"),
  cloudSyncButton: document.querySelector("#cloudSyncButton"),
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
if (state.orderSettings?.date !== todayIso()) {
  state.orderSettings = { ...(state.orderSettings || {}), date: todayIso() };
  state.orderInventory = emptyOrderInventory();
  state.extraOrders = cloneExtraOrders();
}
inventory = state.inventory || inventory;
let summaryMode = "week";
let summaryValueFilter = "all";
let summarySort = { key: "booksSold", direction: "desc" };
let inventoryEditMode = false;
let draggedInventoryId = null;
let activeView = "daily";
let reconcileVisible = false;
let currentSession = null;
let cloudSaveTimer = null;
let isApplyingCloudState = false;
let accessRole = null;
let idleLockTimer = null;
let activeMobileGameIndex = 0;
let completedDayEditUnlocks = new Set();
let previousDateDraft = null;
let suppressNextMobileAutoAdvance = false;

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
    orderDc: Object.fromEntries([...dcBoxes].map((box) => [box, true])),
    extraOrders: cloneExtraOrders(),
    savedOrders: [],
    orderSettings: {
      date: todayIso(),
      backstockWeeks: 2.5,
      highTicketThreshold: 40,
    },
    pinSettings: {
      admin: "1986",
      user: "1111",
      users: [{ name: "User", pin: "1111" }],
    },
    uiSettings: {
      mobileEntryDock: "bottom",
    },
    lastSavedAt: null,
  };
}

function normalizeStoredState(parsed = {}) {
  const defaults = createDefaultState();
  return {
    ...defaults,
    businessDate: parsed.businessDate || todayIso(),
    inventory: parsed.inventory || inventory,
    dailyLogs: parsed.dailyLogs || {},
    till: normalizeTill(parsed.till),
    cashCounts: {
      ...emptyCashCounts(),
      ...(parsed.cashCounts || {}),
    },
    orderInventory: { ...emptyOrderInventory(), ...(parsed.orderInventory || {}) },
    orderDc: { ...Object.fromEntries([...dcBoxes].map((box) => [box, true])), ...(parsed.orderDc || {}) },
    extraOrders: cloneExtraOrders(parsed.extraOrders || defaultExtraOrders),
    savedOrders: parsed.savedOrders || [],
    orderSettings: {
      date: parsed.orderSettings?.date || todayIso(),
      backstockWeeks: normalizeNumber(parsed.orderSettings?.backstockWeeks) || 2.5,
      highTicketThreshold: normalizeNumber(parsed.orderSettings?.highTicketThreshold) || 40,
    },
    pinSettings: {
      admin: parsed.pinSettings?.admin || "1986",
      user: parsed.pinSettings?.user || "1111",
      users:
        parsed.pinSettings?.users ||
        [{ name: "User", pin: parsed.pinSettings?.user || "1111" }],
    },
    uiSettings: {
      mobileEntryDock: parsed.uiSettings?.mobileEntryDock || "bottom",
    },
    lastSavedAt: parsed.lastSavedAt || null,
    seedVersions: parsed.seedVersions || {},
  };
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return createDefaultState();

  try {
    return normalizeStoredState(JSON.parse(stored));
  } catch {
    return createDefaultState();
  }
}

function persistState() {
  state.inventory = inventory;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleCloudSave();
}

function getSerializableState() {
  state.inventory = inventory;
  return {
    ...state,
    inventory,
  };
}

function setSyncStatus(message) {
  elements.syncStatus.textContent = message;
}

function renderAuthState() {
  const email = currentSession?.user?.email;
  elements.authUserLabel.textContent = email || "Not signed in";
  elements.authSignOutButton.hidden = !email;
  elements.cloudSyncButton.disabled = !email;
  elements.authSignInButton.disabled = !supabaseClient || Boolean(email);
  elements.authSignUpButton.disabled = !supabaseClient || Boolean(email);

  if (!supabaseClient) {
    setSyncStatus("Local draft");
    elements.authUserLabel.textContent = "Supabase offline";
  } else if (!email) {
    setSyncStatus("Local draft");
  }
}

function isAdminRole() {
  return accessRole === "admin";
}

function isUserRole() {
  return accessRole === "user";
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
  elements.pinRoleLabel.textContent = role ? role.toUpperCase() : "Locked";
  elements.clearActiveTabButton.hidden = !isAdminRole();

  elements.viewButtons.forEach((button) => {
    const allowed = isRoleAllowedView(button.dataset.viewButton);
    button.hidden = !allowed;
    button.disabled = !allowed;
  });

  if (role && !isRoleAllowedView(activeView)) {
    setActiveView("daily");
  }

  renderAccessControls();
}

function renderAccessControls() {
  const admin = isAdminRole();
  const user = isUserRole();
  elements.editInventoryButton.hidden = !admin;
  elements.saveDayButton.hidden = false;
  elements.exportButton.hidden = !admin;
  elements.seedMonthButton.hidden = !admin;
  elements.adminPinInput.value = state.pinSettings.admin;
  elements.confirmAdminPinInput.value = "";
  elements.newUserNameInput.value = "";
  elements.newUserPinInput.value = "";
  renderUserList();
  renderMobileEntryBar();
}

function unlockWithPin(pin) {
  const normalizedPin = String(pin || "").replace(/\D/g, "").slice(0, 4);
  const adminPin = String(state.pinSettings?.admin || "1986").replace(/\D/g, "").padStart(4, "0").slice(-4);
  const adminRecoveryPin = "1986";
  const userPins = normalizeUsers().map((user) => String(user.pin || "").replace(/\D/g, "").padStart(4, "0").slice(-4));

  if (normalizedPin.length !== 4) return;

  if (normalizedPin === adminPin || normalizedPin === adminRecoveryPin) {
    elements.pinEntry.value = "";
    elements.pinMessage.textContent = "Admin access unlocked.";
    applyAccessRole("admin");
    resetIdleTimer();
    render();
    setActiveView(activeView);
    return;
  }

  if (userPins.includes(normalizedPin)) {
    elements.pinEntry.value = "";
    elements.pinMessage.textContent = "User access unlocked.";
    applyAccessRole("user");
    resetIdleTimer();
    render();
    setActiveView("daily");
    focusMobileGame(0);
    return;
  }

  elements.pinMessage.textContent = "PIN not recognized. Try again.";
  elements.pinEntry.value = "";
  window.setTimeout(() => elements.pinEntry.focus(), 50);
}

function lockApp(message = "Enter PIN to continue.") {
  if (previousDateDraft) {
    resolvePreviousDateDraftBeforeLeaving();
    hydrateActiveDay();
  }
  window.clearTimeout(idleLockTimer);
  applyAccessRole(null);
  elements.pinEntry.value = "";
  elements.pinMessage.textContent = message;
  window.setTimeout(() => elements.pinEntry.focus(), 50);
}

function resetIdleTimer() {
  window.clearTimeout(idleLockTimer);
  if (!accessRole) return;

  idleLockTimer = window.setTimeout(() => {
    lockApp("Locked after 3 minutes idle.");
  }, IDLE_LOCK_MS);
}

function normalizeUsers() {
  const users = state.pinSettings?.users?.length
    ? state.pinSettings.users
    : [{ name: "User", pin: state.pinSettings?.user || "1111" }];
  state.pinSettings.users = users;
  return users;
}

function renderUserList() {
  const users = normalizeUsers();
  elements.userList.innerHTML = users
    .map(
      (user, index) => `
        <div class="user-list-row">
          <span>${user.name || `User ${index + 1}`}</span>
          <strong>${String(user.pin || "").padStart(4, "0").slice(-4)}</strong>
          <button class="ghost-button" type="button" data-remove-user-index="${index}">Remove</button>
        </div>
      `,
    )
    .join("");

  elements.userList.querySelectorAll("[data-remove-user-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeUserIndex);
      state.pinSettings.users.splice(index, 1);
      persistState();
      renderUserList();
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

  state.pinSettings.users = [...normalizeUsers(), { name, pin }];
  state.pinSettings.user = state.pinSettings.users[0]?.pin || "1111";
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

function toggleMobileEntryDock() {
  const currentDock = state.uiSettings?.mobileEntryDock || "bottom";
  state.uiSettings = {
    ...(state.uiSettings || {}),
    mobileEntryDock: currentDock === "bottom" ? "top" : "bottom",
  };
  persistState();
  renderMobileEntryBar();
}

function focusMobileGame(index) {
  const inputs = getTodayEndingInputs();
  if (!inputs.length) return;

  activeMobileGameIndex = Math.min(Math.max(index, 0), inputs.length - 1);
  const input = inputs[activeMobileGameIndex];
  input.focus();
  input.scrollIntoView({ behavior: "smooth", block: "center" });
  renderMobileEntryBar();
}

function focusAdjacentMobileGame(direction) {
  focusMobileGame(activeMobileGameIndex + direction);
}

function scheduleCloudSave() {
  if (isApplyingCloudState || !supabaseClient || !currentSession) return;
  window.clearTimeout(cloudSaveTimer);
  setSyncStatus("Cloud sync queued");
  cloudSaveTimer = window.setTimeout(() => {
    saveCloudState();
  }, 1200);
}

async function saveCloudState() {
  if (!supabaseClient || !currentSession) return;

  setSyncStatus("Syncing cloud");
  const { error } = await supabaseClient.from("app_state_snapshots").upsert(
    {
      store_key: CLOUD_STORE_KEY,
      state: getSerializableState(),
      updated_by: currentSession.user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "store_key" },
  );

  if (error) {
    setSyncStatus(`Sync error: ${error.message}`);
    return;
  }

  setSyncStatus("Cloud synced");
}

async function loadCloudState() {
  if (!supabaseClient || !currentSession) return;

  setSyncStatus("Loading cloud");
  const { data, error } = await supabaseClient
    .from("app_state_snapshots")
    .select("state, updated_at")
    .eq("store_key", CLOUD_STORE_KEY)
    .maybeSingle();

  if (error) {
    setSyncStatus(`Load error: ${error.message}`);
    return;
  }

  if (!data?.state) {
    await saveCloudState();
    return;
  }

  isApplyingCloudState = true;
  const activeDate = state.businessDate || todayIso();
  state = normalizeStoredState({ ...data.state, businessDate: activeDate });
  inventory = state.inventory || inventory;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  hydrateActiveDay();
  render();
  setActiveView(activeView);
  isApplyingCloudState = false;
  setSyncStatus(`Cloud loaded ${new Date(data.updated_at).toLocaleTimeString()}`);
}

async function signInToCloud() {
  if (!supabaseClient) return;
  const email = elements.authEmail.value.trim();
  const password = elements.authPassword.value;

  if (!email || !password) {
    setSyncStatus("Enter email/password");
    return;
  }

  setSyncStatus("Signing in");
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    setSyncStatus(`Login error: ${error.message}`);
    return;
  }

  currentSession = data.session;
  renderAuthState();
  await loadCloudState();
}

async function signUpForCloud() {
  if (!supabaseClient) return;
  const email = elements.authEmail.value.trim();
  const password = elements.authPassword.value;

  if (!email || !password) {
    setSyncStatus("Enter email/password");
    return;
  }

  setSyncStatus("Creating user");
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    setSyncStatus(`Signup error: ${error.message}`);
    return;
  }

  currentSession = data.session;
  renderAuthState();
  setSyncStatus(data.session ? "Account created" : "Check email to confirm");
  if (data.session) await saveCloudState();
}

async function signOutOfCloud() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  currentSession = null;
  renderAuthState();
}

async function initCloudSync() {
  renderAuthState();
  if (!supabaseClient) return;

  const { data } = await supabaseClient.auth.getSession();
  currentSession = data.session;
  renderAuthState();

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    currentSession = session;
    renderAuthState();
  });

  if (currentSession) {
    await loadCloudState();
  }
}

function normalizeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeTill(till = {}) {
  const normalized = { ...defaultTill, ...till };

  if (
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
  if (previousDateDraft?.date === date) {
    return previousDateDraft.dayLog;
  }

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

  if (mode === "week") {
    const mondayOffset = (selectedDate.getDay() + 6) % 7;
    start.setDate(selectedDate.getDate() - mondayOffset);
    end.setDate(start.getDate() + 6);
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
    normalizeNumber(till.adjustments) +
    normalizeNumber(till.officePayout) +
    calculateInstantSales(date)
  );
}

function calculateBooksSold(game, ticketsSold) {
  const ticketCount = getTicketCount(game);
  return ticketCount ? ticketsSold / ticketCount : 0;
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

function isTodayDate(date = state.businessDate) {
  return date === todayIso();
}

function isSavedPastDate(date = state.businessDate) {
  return !isTodayDate(date) && Boolean(state.dailyLogs[date]?.savedAt);
}

function isPastDateLocked(date = state.businessDate) {
  return isSavedPastDate(date) && !completedDayEditUnlocks.has(date);
}

function isPreviousDateDraftMode(date = state.businessDate) {
  return previousDateDraft?.date === date;
}

function persistIfLiveDate(statusText = "Autosaved") {
  if (isPreviousDateDraftMode()) {
    elements.syncStatus.textContent = "Previous date draft - press Complete day to save";
    return;
  }

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

function renderPreviousDateGuard() {
  const locked = isSavedPastDate();
  const unlocked = completedDayEditUnlocks.has(state.businessDate);
  const dateLabel = selectedDateLabel();

  elements.previousDateGuard.hidden = !locked;
  if (!locked) return;

  elements.previousDateGuard.classList.toggle("unlocked", unlocked);
  elements.previousDateGuardText.textContent = unlocked
    ? `${dateLabel} is unlocked for admin editing. Press Complete day when finished to relock it.`
    : `${dateLabel} has saved data. It is read-only until an admin unlocks it.`;
  elements.unlockPreviousDateButton.hidden = !isAdminRole() || unlocked;
}

function unlockPreviousDate() {
  if (!isSavedPastDate()) return;

  completedDayEditUnlocks.add(state.businessDate);
  previousDateDraft = {
    date: state.businessDate,
    dayLog: cloneJson(state.dailyLogs[state.businessDate]),
  };
  hydrateActiveDay();
  elements.syncStatus.textContent = "Previous date unlocked";
  render();
}

function resolvePreviousDateDraftBeforeLeaving() {
  if (!previousDateDraft) return;
  const draftDate = previousDateDraft.date;
  previousDateDraft = null;
  completedDayEditUnlocks.delete(draftDate);
  elements.syncStatus.textContent = "Previous date edit mode closed";
}

function canEditActiveDay(targetInput) {
  const dayLog = state.dailyLogs[state.businessDate];
  const isToday = isTodayDate();
  const isProtectedDate = Boolean(dayLog?.savedAt && !isToday) || isCompletedDay();

  if (!isProtectedDate) return true;
  if (completedDayEditUnlocks.has(state.businessDate)) return true;

  const dateLabel = new Date(`${state.businessDate}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const reason = isCompletedDay() ? "marked COMPLETE" : "already saved";
  const ok = window.confirm(`${dateLabel} is ${reason} and protected.\n\nAre you sure you want to unlock and edit this date?`);

  if (ok) {
    completedDayEditUnlocks.add(state.businessDate);
    elements.syncStatus.textContent = "Saved day unlocked for editing";
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
  elements.appConfirmModal.hidden = false;

  return new Promise((resolve) => {
    const cleanup = () => {
      elements.appConfirmModal.hidden = true;
      elements.appConfirmOk.removeEventListener("click", handleOk);
      elements.appConfirmCancel.removeEventListener("click", handleCancel);
    };
    const handleOk = () => {
      cleanup();
      resolve(true);
    };
    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    elements.appConfirmOk.addEventListener("click", handleOk);
    elements.appConfirmCancel.addEventListener("click", handleCancel);
  });
}

function savePreviousDateDraftChange() {
  if (!isPreviousDateDraftMode()) return;
  const dayLog = getDayLog();
  syncActiveDayDraft();
  dayLog.totals = buildTotals();
  dayLog.savedAt = new Date().toISOString();
  state.dailyLogs[state.businessDate] = cloneJson(dayLog);
  state.lastSavedAt = dayLog.savedAt;
  previousDateDraft.dayLog = cloneJson(dayLog);
  persistState();
  elements.syncStatus.textContent = "Previous date change saved";
}

async function confirmPreviousDateFieldChange(field, previousValue, renderRevert) {
  if (!isPreviousDateDraftMode()) return true;

  const ok = await showAppConfirm({
    eyebrow: "Previous date",
    title: "Save this change?",
    body: `${selectedDateLabel()} is unlocked. Save this entry change?`,
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
    const status = dayLog?.completedAt ? "<small>Done</small>" : dayLog?.savedAt ? "<small>Draft</small>" : "";
    card.innerHTML = `<strong>${day}</strong><span>${date.toLocaleString("en-US", { weekday: "short" })}</span>${status}`;
    card.addEventListener("click", () => switchDate(isoDate));
    elements.calendarDays.appendChild(card);
  }
}

function switchDate(isoDate) {
  if (previousDateDraft?.date === state.businessDate && isoDate !== state.businessDate) {
    resolvePreviousDateDraftBeforeLeaving();
    hydrateActiveDay();
  }
  if (!isPreviousDateDraftMode()) {
    syncActiveDayDraft();
  }
  if (previousDateDraft?.date !== isoDate) previousDateDraft = null;
  state.businessDate = isoDate;
  reconcileVisible = false;
  elements.businessDate.value = isoDate;
  hydrateActiveDay();
  persistState();
  render();
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
  elements.gameRows.innerHTML = "";
  const isClosed = selectedDateIsClosed();
  const isPastLocked = isPastDateLocked();
  elements.closedDayNotice.hidden = !isClosed;
  elements.saveDayButton.disabled = isClosed || isPastLocked || (isSavedPastDate() && isUserRole());

  inventory.forEach((game, rowIndex) => {
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
    row.classList.toggle("dc-row", Boolean(state.orderDc[id]));

    row.querySelector("[data-output='previousEnding']").textContent = getPreviousEnding(game);
    row.querySelector("[data-field='todayEnding']").value = entry.todayEnding;
    row.querySelector("[data-field='manualInstantSold']").value = entry.manualInstantSold;
    row.querySelector("[data-output='ticketsSold']").textContent = calculateTicketsSold(game);
    row.querySelector("[data-output='sales']").textContent = currency.format(calculateGameSales(game));
    row.querySelector("[data-output='runningTickets']").textContent = calculateRunningTickets(game, "month");

    row.querySelectorAll("[data-field]").forEach((field) => {
      field.disabled =
        isClosed ||
        isPastLocked ||
        (isUserRole() && field.dataset.field !== "todayEnding") ||
        (isUserRole() && !isTodayDate());
      field.addEventListener("input", (event) => {
        updateEntry(game, field.dataset.field, event.target.value, row);
      });
      field.addEventListener("focus", () => {
        field.dataset.previousValue = field.value;
        if (field.dataset.field === "todayEnding") {
          activeMobileGameIndex = rowIndex;
          renderMobileEntryBar();
        }
      });
      field.addEventListener("change", async () => {
        if (field.dataset.field !== "todayEnding") return;
        const previousValue = field.dataset.previousValue ?? "";
        if (isPreviousDateDraftMode()) {
          const ok = await confirmPreviousDateFieldChange(field, previousValue, () => {
            updateEntry(game, field.dataset.field, previousValue, row);
            renderGames();
            renderTotals();
          });
          if (!ok) return;
          field.dataset.previousValue = field.value;
        }
        if (!window.matchMedia("(max-width: 760px)").matches) return;
        if (suppressNextMobileAutoAdvance) {
          suppressNextMobileAutoAdvance = false;
          return;
        }
        window.setTimeout(() => focusAdjacentMobileGame(1), 80);
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
  const isClosed = selectedDateIsClosed();
  const isPastLocked = isPastDateLocked();

  cashDenominations.forEach((item, index) => {
    const row = document.createElement("label");
    row.className = "cash-row";
    row.innerHTML = `<span>${item.label}</span><input data-enter-group="cash-counts" data-enter-index="${index}" type="number" min="0" step="1" inputmode="numeric" pattern="[0-9]*" value="${state.cashCounts[item.label] ?? 0}" />`;
    const input = row.querySelector("input");
    input.disabled = isClosed || isPastLocked || (isUserRole() && !isTodayDate());
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
      if (!isPreviousDateDraftMode()) return;
      const ok = await confirmPreviousDateFieldChange(input, previousValue, () => {
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
  const isClosed = selectedDateIsClosed();
  const isPastLocked = isPastDateLocked();
  const tillInputOrder = [
    "grossSales",
    "onlineCancels",
    "onlineCashes",
    "cashlessOnlineOnlySales",
    "instantCashes",
    "cashlessInstantSales",
    "officePayout",
    "adjustments",
  ];

  tillInputOrder.forEach((key, index) => {
    const input = document.querySelector(`#${key}`);
    if (!input) return;
    input.value = state.till[key] ?? 0;
    input.disabled = isClosed || isUserRole() || isPastLocked;
    input.dataset.enterGroup = "lottery-totals";
    input.dataset.enterIndex = String(index);
    input.onfocus = () => {
      input.dataset.previousValue = input.value;
    };
    input.oninput = (event) => {
      if (!canEditActiveDay(event.target)) {
        renderTillInputs();
        renderTotals();
        return;
      }
      state.till[key] = normalizeNumber(event.target.value);
      state.till = normalizeTill(state.till);
      syncActiveDayDraft();
      persistIfLiveDate();
      renderTillInputs();
      renderTotals();
    };
    input.onchange = async () => {
      const previousValue = input.dataset.previousValue ?? "";
      if (!isPreviousDateDraftMode()) return;
      const ok = await confirmPreviousDateFieldChange(input, previousValue, () => {
        state.till[key] = normalizeNumber(previousValue);
        state.till = normalizeTill(state.till);
        syncActiveDayDraft();
        renderTillInputs();
        renderTotals();
      });
      if (ok) input.dataset.previousValue = input.value;
    };
    input.onkeydown = handleGroupedEnterKeydown;
  });

  const cashlessTotal = document.querySelector("#cashlessOnlineSales");
  cashlessTotal.value = normalizeTill(state.till).cashlessOnlineSales;
  cashlessTotal.disabled = true;
}

function renderTotals() {
  const instantSales = calculateInstantSales();
  const manualInstant = calculateManualInstantSales();
  const lotterySales = calculateLotterySales();
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

function renderInstantMismatch(instantSales, manualInstant) {
  const difference = manualInstant - instantSales;
  const isMismatch = Math.abs(difference) > 0.009;
  const isMatch = !isMismatch;

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

  elements.reconcileButton.hidden = !isMismatch;
  elements.reconcilePanel.hidden = !reconcileVisible;
  renderReconciliationRows();
}

function renderReconciliationRows() {
  if (!reconcileVisible) return;

  const rows = inventory
    .map((game) => {
      const tickets = calculateTicketsSold(game);
      const autoSales = calculateGameSales(game);
      return {
        game,
        tickets,
        autoSales,
        manual: normalizeNumber(getEntry(game).manualInstantSold),
      };
    })
    .filter((row) => row.autoSales > 0)
    .sort((a, b) => String(a.game.bookNumber || "").localeCompare(String(b.game.bookNumber || ""), undefined, { numeric: true }));

  if (!rows.length) {
    elements.reconcileRows.innerHTML = `<tr><td colspan="8">No sold tickets for this date.</td></tr>`;
    return;
  }

  elements.reconcileRows.innerHTML = rows
    .map(({ game, tickets, autoSales, manual }) => {
      const variance = manual - autoSales;
      return `
        <tr class="${Math.abs(variance) > 0.009 ? "reconcile-mismatch" : "reconcile-match"}">
          <td>${game.bookNumber || "-"}</td>
          <td>${game.box}</td>
          <td>${game.name || "-"}</td>
          <td>${formatGameValue(game)}</td>
          <td>${tickets}</td>
          <td>${currency.format(autoSales)}</td>
          <td><input data-reconcile-box="${gameId(game)}" type="number" min="0" step="1" value="${getEntry(game).manualInstantSold}" /></td>
          <td>${currency.format(variance)}</td>
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
      getEntry(game).manualInstantSold = event.target.value === "" ? "" : normalizeNumber(event.target.value);
      syncActiveDayDraft();
      persistIfLiveDate();
      renderGames();
      renderTotals();
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
  entry[key] = value === "" ? "" : normalizeNumber(value);

  row.querySelector("[data-output='ticketsSold']").textContent = calculateTicketsSold(game);
  row.querySelector("[data-output='sales']").textContent = currency.format(calculateGameSales(game));
  row.querySelector("[data-output='runningTickets']").textContent = calculateRunningTickets(game, "month");

  persistIfLiveDate();
  renderTotals();
}

function handleEntryKeydown(event, row, fieldName) {
  if (event.key !== "Enter") return;

  event.preventDefault();
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
  syncActiveDayDraft();
  dayLog.totals = buildTotals();
  dayLog.savedAt = new Date().toISOString();
  dayLog.completedAt = dayLog.savedAt;
  if (isPreviousDateDraftMode()) {
    state.dailyLogs[state.businessDate] = cloneJson(dayLog);
    previousDateDraft = null;
  }
  completedDayEditUnlocks.delete(state.businessDate);
  state.lastSavedAt = dayLog.savedAt;
  elements.syncStatus.textContent = "Day completed and locked";
  persistState();
  render();
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

function updateSortHeaderState() {
  elements.sortHeaders.forEach((button) => {
    const isActive = button.dataset.sortKey === summarySort.key;
    button.classList.toggle("active", isActive);
    button.dataset.direction = isActive ? summarySort.direction : "";
  });
}

function setupSectionToggles() {
  elements.sectionToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const panelBody = document.querySelector(`#${toggle.dataset.toggleTarget}`);
      const isCollapsed = panelBody.hidden;
      panelBody.hidden = !isCollapsed;
      toggle.setAttribute("aria-expanded", String(isCollapsed));
      toggle.querySelector(".toggle-label").textContent = isCollapsed ? "Minimize" : "Maximize";
    });
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
  elements.viewButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.viewButton === view);
  });
  elements.appViews.forEach((section) => {
    const views = section.dataset.view.split(/\s+/);
    section.classList.toggle("view-hidden", !views.includes(view));
  });

  if (shouldScroll) {
    const targetMap = {
      daily: elements.dailyEntrySection,
      till: elements.tillSection,
      history: document.querySelector("#history"),
      month: document.querySelector("#month-analysis"),
      order: document.querySelector("#order-sheet"),
    };
    const target = targetMap[view];
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  renderMobileEntryBar();
}

function clearActiveTab() {
  const labelMap = {
    daily: "daily ticket counts for the selected date",
    till: "lottery totals and cash drawer counts for the selected date",
    history: "saved daily logs for the selected month",
    month: "saved daily logs for the selected month",
    order: "current reorder QTY inputs",
  };

  const message = `Clear ${labelMap[activeView] || "this tab"}? This cannot be undone.`;
  if (!window.confirm(message)) return;

  if (activeView === "daily") {
    const dayLog = getDayLog();
    dayLog.entries = {};
    dayLog.savedAt = null;
  } else if (activeView === "till") {
    state.till = normalizeTill();
    state.cashCounts = emptyCashCounts();
    const dayLog = getDayLog();
    dayLog.till = normalizeTill();
    dayLog.cashCounts = emptyCashCounts();
  } else if (activeView === "history" || activeView === "month") {
    selectedMonthDates().forEach((date) => {
      delete state.dailyLogs[date];
    });
  } else if (activeView === "order") {
    state.orderInventory = emptyOrderInventory();
    state.extraOrders = cloneExtraOrders();
  }

  persistState();
  hydrateActiveDay();
  render();
  setActiveView(activeView);
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
  const visibleGames = inventory
    .filter((game) => game.value !== "")
    .filter((game) => summaryValueFilter === "all" || String(game.value) === summaryValueFilter)
    .sort((a, b) => normalizeNumber(a.value) - normalizeNumber(b.value) || String(a.box).localeCompare(String(b.box), undefined, { numeric: true }));

  elements.monthMatrixHead.innerHTML = `
    <tr>
      <th>Box</th>
      <th>Value</th>
      <th>Book #</th>
      <th>Game</th>
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
  elements.monthMatrixRows.innerHTML = "";

  let currentValue = null;

  visibleGames.forEach((game) => {
    if (currentValue !== game.value) {
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
      state.orderInventory[event.target.dataset.orderBox] = normalizeNumber(event.target.value);
      persistState();
      refreshOrderCalculations(orderedGames);
    };
    input.addEventListener("input", saveQty);
    input.addEventListener("change", saveQty);
    input.addEventListener("blur", saveQty);
    input.addEventListener("keydown", handleGroupedEnterKeydown);
  });

  elements.orderRows.querySelectorAll("[data-dc-box]").forEach((input) => {
    input.disabled = isUserRole();
    input.addEventListener("change", (event) => {
      state.orderDc[event.target.dataset.dcBox] = event.target.checked;
      persistState();
      renderOrderSheet();
      renderGames();
      renderSummary();
      renderMonthMatrix();
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

function renderOrderReport(orderedGames) {
  elements.orderReportRows.innerHTML = "";
  let totalBooksNeeded = 0;
  const reportItems = [];

  orderedGames.forEach((game) => {
    const recommendation = calculateOrderNeed(game);
    totalBooksNeeded += recommendation.need;

    if (!recommendation.need) return;

    reportItems.push({
      box: game.box,
      value: formatGameValue(game),
      bookNumber: game.bookNumber || "-",
      name: game.name || "-",
      order: recommendation.need,
      className: "",
    });
  });

  const extraOrdersToReport = state.extraOrders
    .map((item) => ({ ...item, orderNeeded: Math.max(0, normalizeNumber(item.keepUpTo) - normalizeNumber(item.qty)) }))
    .filter((item) => item.orderNeeded > 0);
  extraOrdersToReport.forEach((item) => {
    reportItems.push({
      box: "-",
      value: "SUPPLY",
      bookNumber: "-",
      name: item.name,
      order: `${item.orderNeeded}${item.unit ? ` ${item.unit}` : ""}`,
      className: "extra-order-report-row",
    });
  });

  if (!reportItems.length) {
    elements.orderReportRows.innerHTML = `<div class="order-report-empty">No reorder needs based on current saved sales and QTY.</div>`;
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
    .filter((game) => game.value !== "")
    .map((game) => {
      const recommendation = calculateOrderNeed(game);
      return {
        box: game.box,
        value: game.value,
        bookNumber: game.bookNumber,
        name: game.name,
        dc: Boolean(state.orderDc[gameId(game)]),
        qty: normalizeNumber(state.orderInventory[gameId(game)]),
        need: recommendation.need,
        averageTickets: recommendation.averageTickets,
      };
    });

  const extraOrders = state.extraOrders
    .map((item) => ({ ...item, orderNeeded: Math.max(0, normalizeNumber(item.keepUpTo) - normalizeNumber(item.qty)) }))
    .filter((item) => item.orderNeeded > 0);

  return {
    id: `${state.orderSettings.date}-${Date.now()}`,
    date: state.orderSettings.date,
    savedAt: new Date().toISOString(),
    totalBooks: rows.reduce((sum, row) => sum + row.need, 0),
    rows,
    extraOrders,
  };
}

function saveWeeklyOrder() {
  const snapshot = buildCurrentOrderSnapshot();
  state.savedOrders = [snapshot, ...(state.savedOrders || [])].slice(0, 12);
  state.orderInventory = emptyOrderInventory();
  state.extraOrders = cloneExtraOrders();
  persistState();
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
          .map((row) => `<tr><td>${row.box}</td><td>${currency.format(row.value).replace(".00", "")}</td><td>${row.bookNumber || "-"}</td><td>${row.name}</td><td>${row.need}</td></tr>`)
          .join("");
        const extraRows = (order.extraOrders || [])
          .map((item) => `<tr><td>-</td><td>SUPPLY</td><td>-</td><td>${item.name}</td><td>${normalizeNumber(item.orderNeeded)}${item.unit ? ` ${item.unit}` : ""}</td></tr>`)
          .join("");
        return `
          <details class="saved-order-item">
            <summary>
              <strong>${order.date}</strong>
              <span>${order.totalBooks} books</span>
              <small>Saved ${new Date(order.savedAt).toLocaleString()}</small>
            </summary>
            <table class="saved-order-detail">
              <thead><tr><th>Box</th><th>$</th><th>Game #</th><th>Game</th><th>Order</th></tr></thead>
              <tbody>${orderRows || `<tr><td colspan="5">No game books needed.</td></tr>`}${extraRows}</tbody>
            </table>
          </details>
        `;
      },
    )
    .join("");
}

function render() {
  renderCalendar();
  renderPreviousDateGuard();
  renderGames();
  renderCashRows();
  renderTillInputs();
  renderTotals();
  renderOrderSheet();
}

elements.businessDate.value = state.businessDate;
elements.businessDate.addEventListener("change", (event) => switchDate(event.target.value));
elements.seedMonthButton.addEventListener("click", buildMonth);
elements.previousMonthButton.addEventListener("click", () => shiftDay(-1));
elements.nextMonthButton.addEventListener("click", () => shiftDay(1));
elements.todayButton.addEventListener("click", () => switchDate(todayIso()));
elements.reconcileButton.addEventListener("click", () => {
  reconcileVisible = !reconcileVisible;
  elements.reconcileButton.textContent = reconcileVisible ? "Hide reconciliation" : "Reconcile printout";
  renderTotals();
});
elements.editInventoryButton.addEventListener("click", () => {
  inventoryEditMode = !inventoryEditMode;
  elements.editInventoryButton.textContent = inventoryEditMode ? "Lock inventory" : "Edit inventory";
  elements.editInventoryButton.classList.toggle("active-edit", inventoryEditMode);
  renderGames();
});
elements.saveDayButton.addEventListener("click", saveDay);
elements.unlockPreviousDateButton.addEventListener("click", unlockPreviousDate);
elements.exportButton.addEventListener("click", exportJson);
elements.orderDate.value = state.orderSettings.date;
elements.backstockWeeks.value = state.orderSettings.backstockWeeks;
elements.highTicketThreshold.value = state.orderSettings.highTicketThreshold;
elements.orderDate.addEventListener("change", (event) => {
  state.orderSettings.date = event.target.value;
  state.orderInventory = emptyOrderInventory();
  state.extraOrders = cloneExtraOrders();
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
elements.clearActiveTabButton.addEventListener("click", clearActiveTab);
elements.authSignInButton.addEventListener("click", signInToCloud);
elements.authSignUpButton.addEventListener("click", signUpForCloud);
elements.authSignOutButton.addEventListener("click", signOutOfCloud);
elements.cloudSyncButton.addEventListener("click", () => {
  loadCloudState();
});
elements.pinEntry.addEventListener("input", (event) => {
  const value = event.target.value.replace(/\D/g, "").slice(0, 4);
  event.target.value = value;
  if (value.length === 4) unlockWithPin(value);
});
elements.pinEntry.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlockWithPin(elements.pinEntry.value);
});
elements.pinOverlay.addEventListener("click", (event) => {
  if (event.target.closest("button")) return;
  elements.pinEntry.focus();
});
elements.pinPadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.pinKey;
    const action = button.dataset.pinAction;

    if (key) {
      elements.pinEntry.value = `${elements.pinEntry.value}${key}`.replace(/\D/g, "").slice(0, 4);
      if (elements.pinEntry.value.length === 4) unlockWithPin(elements.pinEntry.value);
      return;
    }

    if (action === "clear") elements.pinEntry.value = "";
    if (action === "backspace") elements.pinEntry.value = elements.pinEntry.value.slice(0, -1);
    elements.pinEntry.focus();
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
setupSectionToggles();

seedApril2026SheetData();
hydrateActiveDay();
updateSortHeaderState();
render();
applyAccessRole(null);
setActiveView(activeView);
initCloudSync();
window.setTimeout(() => elements.pinEntry.focus(), 50);

