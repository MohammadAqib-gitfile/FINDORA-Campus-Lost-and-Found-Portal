/**
 * FINDORA — Campus Lost & Found Portal
 * Main Frontend Application Script
 * Sai University | School of Computing and Data Science
 * Premium White & Blue Modern Theme
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    user: null,
    activeView: 'home', // 'home' | 'heroes' | 'userDashboard' | 'adminDashboard'
    searchMode: 'campus', // 'campus' | 'online'
    filters: {
      search: '',
      category: 'All',
      type: 'All',
      building: 'All',
      floor: 'All',
      locationType: 'All',
      sort: 'recent'
    },
    items: [],
    selectedItem: null,
    notifications: [],
    userTab: 'items', // 'items' | 'claims'
    selectedFeedbackRating: 5
  };

  // DOM Elements - Navigation & Header
  const navHome = document.getElementById('navHome');
  const navBrowse = document.getElementById('navBrowse');
  const navReceived = document.getElementById('navReceived');
  const navOnlineSearch = document.getElementById('navOnlineSearch');
  const navReport = document.getElementById('navReport');
  const navHeroes = document.getElementById('navHeroes');
  const navUserDash = document.getElementById('navUserDash');
  const navAdminDash = document.getElementById('navAdminDash');
  const brandLogo = document.getElementById('brandLogo');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  // Header Auth Elements
  const guestActions = document.getElementById('guestActions');
  const userActions = document.getElementById('userActions');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userPill = document.getElementById('userPill');
  const userAvatar = document.getElementById('userAvatar');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const userPointsDisplay = document.getElementById('userPointsDisplay');
  const userRoleBadge = document.getElementById('userRoleBadge');

  // Notifications
  const notifBtn = document.getElementById('notifBtn');
  const notifBadge = document.getElementById('notifBadge');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifList = document.getElementById('notifList');
  const markAllReadBtn = document.getElementById('markAllReadBtn');

  // Views
  const homeView = document.getElementById('homeView');
  const heroesView = document.getElementById('heroesView');
  const receivedView = document.getElementById('receivedView');
  const userDashboardView = document.getElementById('userDashboardView');
  const adminDashboardView = document.getElementById('adminDashboardView');

  // Received View Elements
  const receivedMetricTotal = document.getElementById('receivedMetricTotal');
  const receivedMetricRating = document.getElementById('receivedMetricRating');
  const receivedMetricPoints = document.getElementById('receivedMetricPoints');
  const receivedSearchInput = document.getElementById('receivedSearchInput');
  const receivedBuildingFilter = document.getElementById('receivedBuildingFilter');
  const receivedCategoryFilter = document.getElementById('receivedCategoryFilter');
  const receivedItemsTableBody = document.getElementById('receivedItemsTableBody');
  const receivedItemsEmpty = document.getElementById('receivedItemsEmpty');
  const refreshReceivedBtn = document.getElementById('refreshReceivedBtn');

  // Home Page Elements
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const categoryGrid = document.getElementById('categoryGrid');
  const categoryCards = [...document.querySelectorAll('.category-card')];
  const typeFilter = document.getElementById('typeFilter');
  const buildingFilter = document.getElementById('buildingFilter');
  const floorFilter = document.getElementById('floorFilter');
  const locationTypeFilter = document.getElementById('locationTypeFilter');
  const sortFilter = document.getElementById('sortFilter');
  const itemsGrid = document.getElementById('itemsGrid');
  const itemCount = document.getElementById('itemCount');
  const emptyState = document.getElementById('emptyState');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const bannerReportBtn = document.getElementById('bannerReportBtn');
  const heroReportLink = document.getElementById('heroReportLink');
  const heroExploreLink = document.getElementById('heroExploreLink');
  const allCategoriesLink = document.getElementById('allCategoriesLink');

  // Search Mode Switcher & Online Search Elements
  const tabCampusSearch = document.getElementById('tabCampusSearch');
  const tabOnlineSearch = document.getElementById('tabOnlineSearch');
  const campusSearchPanel = document.getElementById('campusSearchPanel');
  const onlineSearchPanel = document.getElementById('onlineSearchPanel');
  const heroSwitchToOnlineLink = document.getElementById('heroSwitchToOnlineLink');
  const backToCampusBtn = document.getElementById('backToCampusBtn');
  const btnBackToCampusBottom = document.getElementById('btnBackToCampusBottom');

  // Online Search Form Elements
  const onlineSearchForm = document.getElementById('onlineSearchForm');
  const onlineItemName = document.getElementById('onlineItemName');
  const onlineCategory = document.getElementById('onlineCategory');
  const onlineLocation = document.getElementById('onlineLocation');
  const onlineKeywords = document.getElementById('onlineKeywords');
  const engineGoogle = document.getElementById('engineGoogle');
  const engineBing = document.getElementById('engineBing');
  const engineGoogleLabel = document.getElementById('engineGoogleLabel');
  const engineBingLabel = document.getElementById('engineBingLabel');
  const queryPreviewEngine = document.getElementById('queryPreviewEngine');
  const queryPreviewBox = document.getElementById('queryPreviewBox');
  const externalSearchBtnText = document.getElementById('externalSearchBtnText');
  const btnLaunchExternalSearch = document.getElementById('btnLaunchExternalSearch');
  const btnResetOnlineForm = document.getElementById('btnResetOnlineForm');

  // FINDORA Heroes Elements
  const heroesLeaderboardBody = document.getElementById('heroesLeaderboardBody');

  // Dialogs
  const authDialog = document.getElementById('authDialog');
  const closeAuthDialog = document.getElementById('closeAuthDialog');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authModalTitle = document.getElementById('authModalTitle');
  const demoStudentBtn = document.getElementById('demoStudentBtn');
  const demoAdminBtn = document.getElementById('demoAdminBtn');

  const reportDialog = document.getElementById('reportDialog');
  const closeReportDialog = document.getElementById('closeReportDialog');
  const reportForm = document.getElementById('reportForm');
  const typeLostBtn = document.getElementById('typeLostBtn');
  const typeFoundBtn = document.getElementById('typeFoundBtn');
  const reportTypeInput = document.getElementById('reportTypeInput');
  const cancelReportBtn = document.getElementById('cancelReportBtn');

  const itemDetailDialog = document.getElementById('itemDetailDialog');
  const closeDetailDialog = document.getElementById('closeDetailDialog');
  const itemDetailContent = document.getElementById('itemDetailContent');

  const claimDialog = document.getElementById('claimDialog');
  const closeClaimDialog = document.getElementById('closeClaimDialog');
  const claimForm = document.getElementById('claimForm');
  const claimItemId = document.getElementById('claimItemId');
  const claimItemPreview = document.getElementById('claimItemPreview');
  const cancelClaimBtn = document.getElementById('cancelClaimBtn');

  const receivedClaimsDialog = document.getElementById('receivedClaimsDialog');
  const closeReceivedClaimsDialog = document.getElementById('closeReceivedClaimsDialog');
  const receivedClaimsList = document.getElementById('receivedClaimsList');

  // Rating & Feedback Dialog
  const feedbackDialog = document.getElementById('feedbackDialog');
  const closeFeedbackDialog = document.getElementById('closeFeedbackDialog');
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackClaimId = document.getElementById('feedbackClaimId');
  const feedbackRatingInput = document.getElementById('feedbackRatingInput');
  const feedbackTextInput = document.getElementById('feedbackTextInput');
  const starSelector = document.getElementById('starSelector');
  const cancelFeedbackBtn = document.getElementById('cancelFeedbackBtn');

  // User Dashboard Elements
  const userDashPoints = document.getElementById('userDashPoints');
  const userDashWeeklyPts = document.getElementById('userDashWeeklyPts');
  const userDashReturns = document.getElementById('userDashReturns');
  const userDashRating = document.getElementById('userDashRating');
  const userDashBadge = document.getElementById('userDashBadge');
  const userTabItems = document.getElementById('userTabItems');
  const userTabClaims = document.getElementById('userTabClaims');
  const userItemsTabContent = document.getElementById('userItemsTabContent');
  const userClaimsTabContent = document.getElementById('userClaimsTabContent');
  const userItemsGrid = document.getElementById('userItemsGrid');
  const userItemsEmpty = document.getElementById('userItemsEmpty');
  const userItemsCount = document.getElementById('userItemsCount');
  const userClaimsTableBody = document.getElementById('userClaimsTableBody');
  const userClaimsEmpty = document.getElementById('userClaimsEmpty');
  const userClaimsCount = document.getElementById('userClaimsCount');
  const dashReportBtn = document.getElementById('dashReportBtn');
  const userReportNowBtn = document.getElementById('userReportNowBtn');

  // Admin Dashboard Elements
  const refreshStatsBtn = document.getElementById('refreshStatsBtn');
  const metricTotal = document.getElementById('metricTotal');
  const metricClaimed = document.getElementById('metricClaimed');
  const metricPending = document.getElementById('metricPending');
  const metricHeroPts = document.getElementById('metricHeroPts');
  const metricRateSub = document.getElementById('metricRateSub');
  const adminClaimFilter = document.getElementById('adminClaimFilter');
  const adminClaimsTableBody = document.getElementById('adminClaimsTableBody');
  const adminItemsTableBody = document.getElementById('adminItemsTableBody');
  const adminAuditLogBody = document.getElementById('adminAuditLogBody');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // Helper: Toast Notifications
  function showToast(message, type = 'info', duration = 3500) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '✦';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'info') icon = 'ℹ';

    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity .4s, transform .4s';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Helper: Format Relative Time
  function formatRelativeTime(dateStr) {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (isNaN(diffSec)) return dateStr;
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return 'Yesterday';
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }

  // Helper: Badge Class Resolver
  function getBadgeClass(badge) {
    if (!badge) return 'helpful';
    const b = badge.toLowerCase();
    if (b.includes('hero')) return 'hero';
    if (b.includes('champion')) return 'champion';
    return 'helpful';
  }

  // ==========================================================
  // INITIALIZATION & AUTH STATE
  // ==========================================================
  async function initAuth() {
    const token = API.getToken();
    if (token) {
      try {
        const res = await API.getMe();
        if (res && res.user) {
          state.user = res.user;
          API.setUser(res.user);
        } else {
          API.logout();
          state.user = null;
        }
      } catch (err) {
        console.warn('Session expired or invalid, signing out:', err.message);
        API.logout();
        state.user = null;
      }
    } else {
      state.user = null;
    }
    updateNavUI();
    if (state.user) {
      loadNotifications();
    }
  }

  function updateNavUI() {
    if (state.user) {
      guestActions.style.display = 'none';
      userActions.style.display = 'flex';
      userNameDisplay.textContent = state.user.name.split(' ')[0];
      userAvatar.src = state.user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(state.user.name)}`;
      
      if (userPointsDisplay) {
        userPointsDisplay.textContent = `${state.user.points || 0} pts`;
      }

      const role = state.user.role || 'student';
      userRoleBadge.textContent = role === 'admin' ? 'Campus Admin' : (state.user.badge || 'Student');
      userRoleBadge.className = `role-badge ${role}`;

      navUserDash.hidden = false;
      navAdminDash.hidden = role !== 'admin';
    } else {
      guestActions.style.display = 'flex';
      userActions.style.display = 'none';
      navUserDash.hidden = true;
      navAdminDash.hidden = true;
    }
  }

  // ==========================================================
  // VIEW SWITCHING
  // ==========================================================
  function switchView(viewName) {
    state.activeView = viewName;

    // Reset nav link active states
    [navHome, navBrowse, navReceived, navOnlineSearch, navReport, navHeroes, navUserDash, navAdminDash].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    homeView.style.display = 'none';
    if (heroesView) heroesView.style.display = 'none';
    if (receivedView) receivedView.style.display = 'none';
    userDashboardView.style.display = 'none';
    adminDashboardView.style.display = 'none';

    if (viewName === 'home') {
      homeView.style.display = 'block';
      if (state.searchMode === 'online') {
        if (navOnlineSearch) navOnlineSearch.classList.add('active');
        if (tabOnlineSearch) tabOnlineSearch.classList.add('active');
        if (tabCampusSearch) tabCampusSearch.classList.remove('active');
        if (onlineSearchPanel) onlineSearchPanel.style.display = 'block';
        if (campusSearchPanel) campusSearchPanel.style.display = 'none';
      } else {
        navHome.classList.add('active');
        if (tabCampusSearch) tabCampusSearch.classList.add('active');
        if (tabOnlineSearch) tabOnlineSearch.classList.remove('active');
        if (campusSearchPanel) campusSearchPanel.style.display = 'block';
        if (onlineSearchPanel) onlineSearchPanel.style.display = 'none';
      }
      loadItems();
    } else if (viewName === 'received') {
      if (receivedView) {
        receivedView.style.display = 'block';
        if (navReceived) navReceived.classList.add('active');
        loadReceivedItems();
      }
    } else if (viewName === 'heroes') {
      if (heroesView) {
        heroesView.style.display = 'block';
        navHeroes.classList.add('active');
        loadHeroesLeaderboard();
      }
    } else if (viewName === 'userDashboard') {
      if (!state.user) {
        openAuthModal('login');
        return;
      }
      userDashboardView.style.display = 'block';
      navUserDash.classList.add('active');
      loadUserDashboard();
    } else if (viewName === 'adminDashboard') {
      if (!state.user || state.user.role !== 'admin') {
        showToast('Administrator privileges required.', 'error');
        switchView('home');
        return;
      }
      adminDashboardView.style.display = 'block';
      navAdminDash.classList.add('active');
      loadAdminDashboard();
    }

    if (mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navigation Click Listeners
  navHome.addEventListener('click', () => {
    setSearchMode('campus');
    switchView('home');
  });
  navBrowse.addEventListener('click', () => {
    setSearchMode('campus');
    switchView('home');
    document.getElementById('items').scrollIntoView({ behavior: 'smooth' });
  });
  if (navReceived) {
    navReceived.addEventListener('click', () => switchView('received'));
  }
  if (navOnlineSearch) {
    navOnlineSearch.addEventListener('click', () => {
      switchView('home');
      setSearchMode('online');
      const panel = document.getElementById('onlineSearchPanel');
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
  navReport.addEventListener('click', () => openReportModal());
  if (navHeroes) navHeroes.addEventListener('click', () => switchView('heroes'));
  navUserDash.addEventListener('click', () => switchView('userDashboard'));
  navAdminDash.addEventListener('click', () => switchView('adminDashboard'));
  brandLogo.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('home');
  });
  userPill.addEventListener('click', () => switchView('userDashboard'));

  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  // Hero section buttons
  if (heroExploreLink) {
    heroExploreLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('home');
      document.getElementById('items').scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (heroReportLink) {
    heroReportLink.addEventListener('click', (e) => {
      e.preventDefault();
      openReportModal();
    });
  }
  if (allCategoriesLink) {
    allCategoriesLink.addEventListener('click', (e) => {
      e.preventDefault();
      state.filters.category = 'All';
      categoryCards.forEach(c => c.classList.toggle('selected', c.dataset.category === 'All'));
      loadItems();
      document.getElementById('items').scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (bannerReportBtn) {
    bannerReportBtn.addEventListener('click', () => openReportModal());
  }

  // ==========================================================
  // HOME PAGE: DYNAMIC ITEMS & LIVE CAMPUS FILTERS
  // ==========================================================
  async function loadItems() {
    itemsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
        <span class="pulse-dot" style="display:inline-block; margin-bottom: 8px;"></span> Loading campus listings...
      </div>
    `;

    const params = {};
    if (state.filters.search) params.search = state.filters.search;
    if (state.filters.category !== 'All') params.category = state.filters.category;
    if (state.filters.type !== 'All') params.type = state.filters.type;
    if (state.filters.building !== 'All') params.building = state.filters.building;
    if (state.filters.floor !== 'All') params.floor = state.filters.floor;
    if (state.filters.locationType !== 'All') params.locationType = state.filters.locationType;
    if (state.filters.sort) params.sort = state.filters.sort;

    try {
      const data = await API.getItems(params);
      state.items = data.items || [];
      renderItems(state.items);
    } catch (err) {
      console.error('Failed to load items:', err);
      itemsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--danger);">
          Failed to load campus items. Please verify the server connection.
        </div>
      `;
    }
  }

  function renderItems(items) {
    itemCount.textContent = String(items.length).padStart(2, '0');

    if (!items || items.length === 0) {
      itemsGrid.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    const categoryIcons = {
      'Electronics': '▣',
      'Accessories': '◇',
      'Books': '▤',
      'ID & Cards': '▰',
      'Clothing': '⌁',
      'Other': '＋'
    };

    itemsGrid.innerHTML = items.map(item => {
      const isFound = item.type.toLowerCase() === 'found';
      let statusClass = item.status || (isFound ? 'found' : 'lost');
      let statusLabel = isFound ? 'Found' : 'Lost';

      if (item.status === 'received') {
        statusClass = 'received';
        statusLabel = '✓ Received';
      } else if (item.status === 'approved') {
        statusClass = 'approved';
        statusLabel = 'Claim Approved';
      } else if (item.status === 'claimed' || item.status === 'claim_pending') {
        statusClass = 'claimed';
        statusLabel = item.status === 'claim_pending' ? 'Claim Pending' : 'Claimed';
      } else if (item.status === 'resolved') {
        statusClass = 'resolved';
        statusLabel = 'Resolved';
      }

      const timeStr = formatRelativeTime(item.createdAt || item.date);
      const icon = categoryIcons[item.category] || '✳';

      const imageHtml = item.imageUrl
        ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';" /><span class="item-image-placeholder" style="display:none;">${icon}</span>`
        : `<span class="item-image-placeholder">${icon}</span>`;

      const locationDetails = [
        item.building || 'Campus',
        item.floor ? `${item.floor} Floor` : null,
        item.locationType ? `(${item.locationType})` : null,
        item.location ? `· ${item.location}` : null
      ].filter(Boolean).join(' ');

      const ratingBadge = (item.status === 'received' && item.rating)
        ? `<span style="display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 800; color: #D97706; background: #FEF3C7; padding: 2px 7px; border-radius: 999px;">★ ${item.rating}/5</span>`
        : '';

      return `
        <article class="item-card" data-id="${item._id}">
          <div class="item-image">
            <span class="status-pill ${statusClass}">${statusLabel}</span>
            ${imageHtml}
          </div>
          <div class="item-info">
            <div class="item-topline">
              <span>${escapeHtml(item.category || 'Other')}</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                ${ratingBadge}
                <span>${timeStr}</span>
              </div>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p class="item-desc">${escapeHtml(item.description)}</p>
            <div class="item-location">
              <span>📍</span>
              <strong>${escapeHtml(item.building || 'Campus')}</strong> ${escapeHtml(locationDetails)}
            </div>
            <div class="item-bottom">
              <span class="item-id">#${item._id.slice(-6).toUpperCase()}</span>
              <button class="arrow-btn view-item-btn" data-id="${item._id}" aria-label="View details for ${escapeHtml(item.title)}">↗</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click listeners to all item cards and arrow buttons
    itemsGrid.querySelectorAll('.view-item-btn, .item-card').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = el.dataset.id || el.closest('.item-card').dataset.id;
        if (id) openItemDetail(id);
      });
    });
  }

  // Search form handler
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.filters.search = searchInput.value.trim();
    loadItems();
    document.getElementById('items').scrollIntoView({ behavior: 'smooth' });
  });

  let searchTimeout = null;
  searchInput.addEventListener('input', () => {
    state.filters.search = searchInput.value.trim();
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadItems();
    }, 350);
  });

  // ==========================================================
  // BROWSE ONLINE / SEARCH BEYOND CAMPUS MODULE
  // ==========================================================
  const suggestedSearches = {
    laptop: {
      name: 'Laptop',
      category: 'Laptops',
      location: 'Chennai',
      keywords: 'lost missing serial charger'
    },
    phone: {
      name: 'Mobile Phone',
      category: 'Mobile Phones',
      location: 'Chennai',
      keywords: 'lost smartphone IMEI missing'
    },
    wallet: {
      name: 'Leather Wallet',
      category: 'Wallets',
      location: 'Chennai',
      keywords: 'lost cards cash missing'
    },
    idcard: {
      name: 'Student Identity Card',
      category: 'Identity Cards',
      location: 'Chennai',
      keywords: 'lost missing university ID'
    },
    other: {
      name: 'Backpack & Keys',
      category: 'Other',
      location: 'Chennai',
      keywords: 'lost belongings city'
    }
  };

  function setSearchMode(mode) {
    state.searchMode = mode;
    const hero = document.querySelector('.hero');

    if (mode === 'online') {
      if (tabCampusSearch) {
        tabCampusSearch.classList.remove('active');
        tabCampusSearch.setAttribute('aria-selected', 'false');
      }
      if (tabOnlineSearch) {
        tabOnlineSearch.classList.add('active');
        tabOnlineSearch.setAttribute('aria-selected', 'true');
      }
      if (navOnlineSearch) navOnlineSearch.classList.add('active');
      if (navHome) navHome.classList.remove('active');

      if (campusSearchPanel) campusSearchPanel.style.display = 'none';
      if (onlineSearchPanel) onlineSearchPanel.style.display = 'block';
      if (hero) hero.classList.add('online-mode');

      updateOnlineQueryPreview();
      if (onlineItemName) onlineItemName.focus();
    } else {
      if (tabOnlineSearch) {
        tabOnlineSearch.classList.remove('active');
        tabOnlineSearch.setAttribute('aria-selected', 'false');
      }
      if (tabCampusSearch) {
        tabCampusSearch.classList.add('active');
        tabCampusSearch.setAttribute('aria-selected', 'true');
      }
      if (navOnlineSearch) navOnlineSearch.classList.remove('active');
      if (navHome) navHome.classList.add('active');

      if (onlineSearchPanel) onlineSearchPanel.style.display = 'none';
      if (campusSearchPanel) campusSearchPanel.style.display = 'block';
      if (hero) hero.classList.remove('online-mode');

      if (searchInput) searchInput.focus();
    }
  }

  function getActiveSearchEngine() {
    return engineBing && engineBing.checked ? 'bing' : 'google';
  }

  function buildExternalSearchQuery() {
    const rawName = onlineItemName ? onlineItemName.value.trim() : '';
    const rawCategory = onlineCategory ? onlineCategory.value : 'All';
    const rawLocation = onlineLocation ? onlineLocation.value.trim() : '';
    const rawKeywords = onlineKeywords ? onlineKeywords.value.trim() : '';

    const parts = ['lost'];

    if (rawName) {
      parts.push(rawName.includes(' ') ? `"${rawName}"` : rawName);
    }

    if (rawCategory && rawCategory !== 'All') {
      parts.push(`"${rawCategory}"`);
    }

    if (rawLocation) {
      parts.push(rawLocation.includes(' ') ? `"${rawLocation}"` : rawLocation);
    }

    if (rawKeywords) {
      parts.push(rawKeywords);
    }

    return parts.join(' ');
  }

  function buildExternalSearchUrl(engine, query) {
    const encoded = encodeURIComponent(query);
    if (engine === 'bing') {
      return `https://www.bing.com/search?q=${encoded}`;
    }
    return `https://www.google.com/search?q=${encoded}`;
  }

  function updateOnlineQueryPreview() {
    if (!queryPreviewBox) return;

    const engine = getActiveSearchEngine();
    const query = buildExternalSearchQuery();

    if (queryPreviewEngine) {
      queryPreviewEngine.textContent = engine === 'bing' ? 'Bing Web Search' : 'Google Web Search';
    }
    if (externalSearchBtnText) {
      externalSearchBtnText.textContent = engine === 'bing' ? 'Search on Bing ↗' : 'Search on Google ↗';
    }

    const hasName = onlineItemName && onlineItemName.value.trim().length > 0;
    if (hasName) {
      queryPreviewBox.textContent = query;
    } else {
      const loc = (onlineLocation && onlineLocation.value.trim()) || 'Chennai';
      queryPreviewBox.textContent = `lost [enter item name] "${loc}"`;
    }
  }

  function executeExternalSearch(customQuery = null) {
    const engine = getActiveSearchEngine();
    const query = customQuery || buildExternalSearchQuery();

    const name = onlineItemName ? onlineItemName.value.trim() : '';
    if (!customQuery && !name) {
      showToast('Please enter an item name to search online.', 'error');
      if (onlineItemName) onlineItemName.focus();
      return;
    }

    const url = buildExternalSearchUrl(engine, query);

    // Open external results in a new tab securely (no opener, no referrer)
    window.open(url, '_blank', 'noopener,noreferrer');

    showToast(`Opening external results on ${engine === 'bing' ? 'Bing' : 'Google'} in new tab...`, 'info', 3000);
  }

  function applySuggestedSearch(key, autoLaunch = false) {
    const data = suggestedSearches[key];
    if (!data) return;

    if (onlineItemName) onlineItemName.value = data.name;
    if (onlineCategory) onlineCategory.value = data.category;
    if (onlineLocation) onlineLocation.value = data.location;
    if (onlineKeywords) onlineKeywords.value = data.keywords;

    updateOnlineQueryPreview();

    if (autoLaunch) {
      executeExternalSearch();
    } else {
      showToast(`Applied "${data.name}" suggested search.`, 'info', 2500);
      if (onlineItemName) onlineItemName.focus();
    }
  }

  // Switcher event listeners
  if (tabCampusSearch) {
    tabCampusSearch.addEventListener('click', () => setSearchMode('campus'));
  }
  if (tabOnlineSearch) {
    tabOnlineSearch.addEventListener('click', () => setSearchMode('online'));
  }
  if (heroSwitchToOnlineLink) {
    heroSwitchToOnlineLink.addEventListener('click', (e) => {
      e.preventDefault();
      setSearchMode('online');
    });
  }
  if (backToCampusBtn) {
    backToCampusBtn.addEventListener('click', () => {
      setSearchMode('campus');
      showToast('Returned to FINDORA campus search.', 'info', 2000);
    });
  }
  if (btnBackToCampusBottom) {
    btnBackToCampusBottom.addEventListener('click', () => {
      setSearchMode('campus');
      showToast('Returned to FINDORA campus search.', 'info', 2000);
    });
  }

  // Search Engine radio toggles
  if (engineGoogle && engineBing) {
    engineGoogle.addEventListener('change', () => {
      if (engineGoogleLabel) engineGoogleLabel.classList.add('active');
      if (engineBingLabel) engineBingLabel.classList.remove('active');
      updateOnlineQueryPreview();
    });
    engineBing.addEventListener('change', () => {
      if (engineBingLabel) engineBingLabel.classList.add('active');
      if (engineGoogleLabel) engineGoogleLabel.classList.remove('active');
      updateOnlineQueryPreview();
    });
  }

  // Live query preview updates on input
  [onlineItemName, onlineLocation, onlineKeywords].forEach(input => {
    if (input) {
      input.addEventListener('input', updateOnlineQueryPreview);
    }
  });
  if (onlineCategory) {
    onlineCategory.addEventListener('change', updateOnlineQueryPreview);
  }

  // Online Search Form Submit
  if (onlineSearchForm) {
    onlineSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      executeExternalSearch();
    });
  }

  // Clear / Reset Form
  if (btnResetOnlineForm) {
    btnResetOnlineForm.addEventListener('click', () => {
      if (onlineItemName) onlineItemName.value = '';
      if (onlineCategory) onlineCategory.value = 'All';
      if (onlineLocation) onlineLocation.value = 'Chennai';
      if (onlineKeywords) onlineKeywords.value = '';
      if (engineGoogle) engineGoogle.checked = true;
      if (engineGoogleLabel) engineGoogleLabel.classList.add('active');
      if (engineBingLabel) engineBingLabel.classList.remove('active');
      updateOnlineQueryPreview();
      showToast('Online search form cleared.', 'info', 2000);
      if (onlineItemName) onlineItemName.focus();
    });
  }

  // Suggested searches event delegation
  document.querySelectorAll('.suggested-card').forEach(card => {
    const key = card.dataset.suggest;

    // "Use" button
    const useBtn = card.querySelector('.btn-suggest-use');
    if (useBtn) {
      useBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        applySuggestedSearch(key, false);
      });
    }

    // "Go" button (direct search)
    const goBtn = card.querySelector('.btn-suggest-go');
    if (goBtn) {
      goBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        applySuggestedSearch(key, true);
      });
    }

    // Entire card click
    card.addEventListener('click', () => {
      applySuggestedSearch(key, false);
    });

    // Enter key
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        applySuggestedSearch(key, false);
      }
    });
  });

  // Category Selector Chips
  categoryCards.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryCards.forEach(c => c.classList.remove('selected'));
      btn.classList.add('selected');
      state.filters.category = btn.dataset.category;
      loadItems();
      document.getElementById('items').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Type Filter
  typeFilter.addEventListener('change', () => {
    state.filters.type = typeFilter.value;
    loadItems();
  });

  // Campus Building Filter
  buildingFilter.addEventListener('change', () => {
    state.filters.building = buildingFilter.value;
    loadItems();
  });

  // Floor Filter
  if (floorFilter) {
    floorFilter.addEventListener('change', () => {
      state.filters.floor = floorFilter.value;
      loadItems();
    });
  }

  // Location Type Filter
  if (locationTypeFilter) {
    locationTypeFilter.addEventListener('change', () => {
      state.filters.locationType = locationTypeFilter.value;
      loadItems();
    });
  }

  // Sort Filter
  sortFilter.addEventListener('change', () => {
    state.filters.sort = sortFilter.value;
    loadItems();
  });

  // Clear Filters
  clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    typeFilter.value = 'All';
    buildingFilter.value = 'All';
    if (floorFilter) floorFilter.value = 'All';
    if (locationTypeFilter) locationTypeFilter.value = 'All';
    sortFilter.value = 'recent';
    state.filters = {
      search: '',
      category: 'All',
      type: 'All',
      building: 'All',
      floor: 'All',
      locationType: 'All',
      sort: 'recent'
    };
    categoryCards.forEach(c => c.classList.toggle('selected', c.dataset.category === 'All'));
    loadItems();
  });

  // ==========================================================
  // RECEIVED & RETURNED ITEMS REGISTRY
  // ==========================================================
  let cachedReceivedItems = [];

  async function loadReceivedItems() {
    try {
      const res = await API.getReceivedItems();
      cachedReceivedItems = res.items || [];
      renderReceivedItems();
    } catch (err) {
      console.warn('Fallback loading received items via getItems:', err.message);
      try {
        const fallback = await API.getItems({ status: 'received' });
        cachedReceivedItems = fallback.items || [];
        renderReceivedItems();
      } catch (e) {
        showToast('Unable to load received items registry.', 'error');
      }
    }
  }

  function renderReceivedItems() {
    if (!receivedItemsTableBody) return;

    let items = [...cachedReceivedItems];
    const bldg = receivedBuildingFilter ? receivedBuildingFilter.value : 'All';
    const cat = receivedCategoryFilter ? receivedCategoryFilter.value : 'All';
    const q = receivedSearchInput ? receivedSearchInput.value.trim().toLowerCase() : '';

    if (bldg !== 'All') {
      items = items.filter(it => (it.building || '').toLowerCase() === bldg.toLowerCase());
    }
    if (cat !== 'All') {
      items = items.filter(it => (it.category || '').toLowerCase() === cat.toLowerCase());
    }
    if (q) {
      items = items.filter(it => 
        (it.title || '').toLowerCase().includes(q) ||
        (it.description || '').toLowerCase().includes(q) ||
        (it.location || '').toLowerCase().includes(q) ||
        (it.building || '').toLowerCase().includes(q)
      );
    }

    // Update metrics
    if (receivedMetricTotal) receivedMetricTotal.textContent = cachedReceivedItems.length;
    if (receivedMetricPoints) receivedMetricPoints.textContent = `+${cachedReceivedItems.length * 50}`;
    
    const ratedItems = cachedReceivedItems.filter(it => it.rating > 0);
    const avgRating = ratedItems.length > 0 
      ? (ratedItems.reduce((acc, it) => acc + it.rating, 0) / ratedItems.length).toFixed(1)
      : '5.0';
    if (receivedMetricRating) receivedMetricRating.textContent = `${avgRating} ★`;

    if (items.length === 0) {
      receivedItemsTableBody.innerHTML = '';
      if (receivedItemsEmpty) receivedItemsEmpty.style.display = 'block';
      return;
    }

    if (receivedItemsEmpty) receivedItemsEmpty.style.display = 'none';

    receivedItemsTableBody.innerHTML = items.map(item => {
      const imgThumb = item.imageUrl 
        ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" style="width: 34px; height: 34px; border-radius: 6px; object-fit: cover; margin-right: 10px;" onerror="this.style.display='none'" />` 
        : `<span style="display:inline-block; width:34px; height:34px; background:#eff6ff; color:#2563eb; border-radius:6px; text-align:center; line-height:34px; margin-right:10px; font-weight:700;">📦</span>`;

      const ratingStars = item.rating 
        ? `<span style="color:#d97706; font-weight:700;">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</span> <small>(${item.rating}.0)</small>` 
        : `<span style="color:#64748b; font-size:11px;">Handover Verified</span>`;

      const dateStr = item.receivedAt ? formatRelativeTime(item.receivedAt) : (item.date || 'Recent');

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center;">
              ${imgThumb}
              <div>
                <strong style="color: var(--primary-blue); cursor: pointer;" class="received-item-link" data-id="${item._id}">${escapeHtml(item.title)}</strong>
                <small style="display: block; color: var(--text-secondary);">${escapeHtml(item.description ? item.description.slice(0, 50) + (item.description.length > 50 ? '...' : '') : '')}</small>
              </div>
            </div>
          </td>
          <td><span class="badge-tag">${escapeHtml(item.category || 'Other')}</span></td>
          <td>
            <strong style="color: var(--primary-blue);">${escapeHtml(item.building || 'AB-1')}</strong>
            <small style="display: block; color: var(--text-secondary);">${escapeHtml(item.floor || 'Ground')} · ${escapeHtml(item.location || '')}</small>
          </td>
          <td>${dateStr}</td>
          <td>${escapeHtml(item.reportedByName || 'Student Member')}</td>
          <td><span class="status-pill found" style="position:static; display:inline-block; font-size:10px;">✓ RECEIVED</span></td>
          <td>${ratingStars}</td>
        </tr>
      `;
    }).join('');

    receivedItemsTableBody.querySelectorAll('.received-item-link').forEach(link => {
      link.addEventListener('click', () => {
        const id = link.dataset.id;
        if (id) openItemDetail(id);
      });
    });
  }

  if (refreshReceivedBtn) {
    refreshReceivedBtn.addEventListener('click', () => {
      loadReceivedItems();
      showToast('Received items registry updated.', 'info', 2000);
    });
  }

  if (receivedSearchInput) {
    receivedSearchInput.addEventListener('input', () => renderReceivedItems());
  }

  if (receivedBuildingFilter) {
    receivedBuildingFilter.addEventListener('change', () => renderReceivedItems());
  }

  if (receivedCategoryFilter) {
    receivedCategoryFilter.addEventListener('change', () => renderReceivedItems());
  }

  // ==========================================================
  // AUTHENTICATION MODAL (LOGIN / SIGNUP / DEMO)
  // ==========================================================
  function openAuthModal(initialTab = 'login') {
    if (initialTab === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      authModalTitle.textContent = 'Welcome back to FINDORA';
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
      authModalTitle.textContent = 'Create your Campus Account';
    }
    authDialog.showModal();
  }

  loginBtn.addEventListener('click', () => openAuthModal('login'));
  signupBtn.addEventListener('click', () => openAuthModal('register'));
  closeAuthDialog.addEventListener('click', () => authDialog.close());

  tabLogin.addEventListener('click', () => openAuthModal('login'));
  tabRegister.addEventListener('click', () => openAuthModal('register'));

  // Submit Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      const res = await API.login(email, password);
      state.user = res.user;
      authDialog.close();
      loginForm.reset();
      updateNavUI();
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      loadNotifications();
      if (state.activeView === 'home') loadItems();
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
    }
  });

  // Submit Registration
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    const campusId = document.getElementById('regCampusId').value.trim();
    const phone = document.getElementById('regPhone').value.trim();

    try {
      const res = await API.register({ name, email, password, role, campusId, phone });
      state.user = res.user;
      authDialog.close();
      registerForm.reset();
      updateNavUI();
      showToast(`Account created! Welcome, ${res.user.name}!`, 'success');
      loadNotifications();
      if (state.activeView === 'home') loadItems();
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    }
  });

  // 1-Click Demo Logins
  demoStudentBtn.addEventListener('click', async () => {
    try {
      const res = await API.demoLogin('student');
      state.user = res.user;
      authDialog.close();
      updateNavUI();
      showToast(`Signed in as ${res.user.name} (Student)`, 'success');
      loadNotifications();
      if (state.activeView === 'home') loadItems();
    } catch (err) {
      showToast('Demo login failed: ' + err.message, 'error');
    }
  });

  demoAdminBtn.addEventListener('click', async () => {
    try {
      const res = await API.demoLogin('admin');
      state.user = res.user;
      authDialog.close();
      updateNavUI();
      showToast(`Signed in as ${res.user.name} (Campus Security Admin)`, 'success');
      loadNotifications();
      if (state.activeView === 'home') loadItems();
    } catch (err) {
      showToast('Demo admin login failed: ' + err.message, 'error');
    }
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    API.logout();
    state.user = null;
    updateNavUI();
    showToast('You have been logged out.', 'info');
    switchView('home');
  });

  // ==========================================================
  // REPORT AN ITEM (LOST OR FOUND)
  // ==========================================================
  function openReportModal(defaultType = 'lost') {
    if (!state.user) {
      openAuthModal('login');
      showToast('Please log in or select a Demo account to submit a report.', 'info');
      return;
    }

    setReportType(defaultType);
    document.getElementById('itemDateInput').value = new Date().toISOString().split('T')[0];
    reportDialog.showModal();
  }

  function setReportType(type) {
    reportTypeInput.value = type;
    if (type === 'lost') {
      typeLostBtn.className = 'type-btn active lost';
      typeFoundBtn.className = 'type-btn found';
    } else {
      typeFoundBtn.className = 'type-btn active found';
      typeLostBtn.className = 'type-btn lost';
    }
  }

  typeLostBtn.addEventListener('click', () => setReportType('lost'));
  typeFoundBtn.addEventListener('click', () => setReportType('found'));
  closeReportDialog.addEventListener('click', () => reportDialog.close());
  cancelReportBtn.addEventListener('click', () => reportDialog.close());

  // Submit Report
  reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('itemTitleInput').value.trim();
    const type = reportTypeInput.value;
    const category = document.getElementById('itemCategoryInput').value;
    const building = document.getElementById('itemBuildingInput').value;
    const floor = document.getElementById('itemFloorInput').value;
    const locationType = document.getElementById('itemLocationTypeInput').value;
    const location = document.getElementById('itemLocationInput').value.trim();
    const date = document.getElementById('itemDateInput').value;
    const description = document.getElementById('itemDescriptionInput').value.trim();
    const secretDetails = document.getElementById('itemSecretInput').value.trim();
    const imageFile = document.getElementById('itemImageFile').files[0];
    const imageUrl = document.getElementById('itemImageUrl').value.trim();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('category', category);
    formData.append('building', building);
    formData.append('floor', floor);
    formData.append('locationType', locationType);
    formData.append('location', location);
    formData.append('date', date);
    formData.append('description', description);
    formData.append('secretDetails', secretDetails);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    }

    const submitBtn = document.getElementById('submitReportBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting report...';

    try {
      const res = await API.createItem(formData);
      reportDialog.close();
      reportForm.reset();
      
      let toastMsg = `${type.toUpperCase()} item reported successfully!`;
      if (type === 'found') {
        toastMsg += ' +5 FINDORA Hero Points awarded!';
      }
      showToast(toastMsg, 'success');
      
      if (res.matchesFound && res.matchesFound > 0) {
        showToast(`AI Match: Found ${res.matchesFound} possible matching item(s) on campus! Check notifications.`, 'info', 5000);
      }

      await initAuth();
      loadNotifications();
      if (state.activeView === 'home') {
        loadItems();
      } else if (state.activeView === 'userDashboard') {
        loadUserDashboard();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit report.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Campus Report';
    }
  });

  // ==========================================================
  // ITEM DETAILS & SMART MATCH MODAL
  // ==========================================================
  async function openItemDetail(itemId) {
    itemDetailContent.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
        <span class="pulse-dot" style="display:inline-block; margin-bottom: 8px;"></span> Loading details...
      </div>
    `;
    itemDetailDialog.showModal();

    try {
      const data = await API.getItemById(itemId);
      const item = data.item;
      const potentialMatches = data.potentialMatches || [];
      state.selectedItem = item;

      const isFound = item.type.toLowerCase() === 'found';
      let statusClass = item.status || (isFound ? 'found' : 'lost');
      let statusLabel = isFound ? 'Found' : 'Lost';

      if (item.status === 'received') {
        statusClass = 'received';
        statusLabel = '✓ Received & Returned';
      } else if (item.status === 'approved') {
        statusClass = 'approved';
        statusLabel = 'Claim Approved';
      } else if (item.status === 'claimed' || item.status === 'claim_pending') {
        statusClass = 'claimed';
        statusLabel = item.status === 'claim_pending' ? 'Claim Pending' : 'Claimed';
      } else if (item.status === 'resolved') {
        statusClass = 'resolved';
        statusLabel = 'Resolved';
      }

      const isOwner = state.user && (item.reportedBy === state.user.id || (item.reportedBy && item.reportedBy._id === state.user.id));
      const isAdmin = state.user && state.user.role === 'admin';
      const canManage = isOwner || isAdmin;

      // Smart matches HTML
      let matchesHtml = '';
      if (potentialMatches.length > 0) {
        matchesHtml = `
          <div class="match-alert-box">
            <h4>💡 Possible Matching Counterpart Found!</h4>
            <p style="margin: 0 0 8px; font-size: 11px; color: #1E3A5F;">
              Our campus matching system detected existing listing(s) that match this item's category, building, and keywords:
            </p>
            ${potentialMatches.map(m => `
              <div class="match-item-card">
                <div>
                  <strong>${escapeHtml(m.item.title)}</strong>
                  <div style="color: var(--text-secondary); font-size: 10px;">${escapeHtml(m.item.building)} · ${escapeHtml(m.item.floor ? m.item.floor + ' Floor' : '')} · ${escapeHtml(m.item.location)}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="match-score-badge">${m.score}% Match</span>
                  <button class="btn btn-outline btn-sm view-match-btn" data-id="${m.item._id}">View</button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }

      // Received Status Box
      let receivedStatusHtml = '';
      if (item.status === 'received') {
        receivedStatusHtml = `
          <div style="margin: 14px 0; padding: 14px 18px; background: #ECFDF5; border: 1px solid #6EE7B7; border-radius: 10px;">
            <div style="display: flex; align-items: center; gap: 8px; color: #047857; font-weight: 800; font-size: 14px; margin-bottom: 4px;">
              <span>✓</span> Item Successfully Received & Handed Over!
            </div>
            <p style="margin: 0; font-size: 12px; color: #065F46;">
              Handover verified on ${item.receivedAt ? new Date(item.receivedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'recently'}. 
              ${item.receivedNotes ? `<span style="font-style: italic;">"${escapeHtml(item.receivedNotes)}"</span>` : ''}
            </p>
            ${item.rating ? `
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #A7F3D0; font-size: 12px; color: #065F46;">
                <strong>Verified Recipient Rating:</strong>
                <span style="color: #D97706; font-size: 14px; font-weight: 900;">★ ${item.rating}/5</span>
                ${item.feedback ? `— <span style="font-style: italic;">"${escapeHtml(item.feedback)}"</span>` : ''}
              </div>
            ` : ''}
          </div>
        `;
      }

      // Actions HTML
      let actionButtonsHtml = '';
      if (item.status === 'received') {
        actionButtonsHtml = `
          <div style="padding: 9px 14px; background: #ECFDF5; border-radius: 8px; color: #047857; font-weight: 700; font-size: 12px; border: 1px solid #A7F3D0;">
            ✓ Return Complete & Reunited
          </div>
        `;
      } else if (item.status === 'approved' && canManage) {
        actionButtonsHtml = `
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary" id="btnHandoverFromDetail" data-id="${item._id}">
              🤝 Confirm Handover & Mark Received (+50 Pts)
            </button>
            <button class="btn btn-outline" id="btnViewItemClaims" data-id="${item._id}">View Received Claims</button>
          </div>
        `;
      } else if (canManage) {
        actionButtonsHtml = `
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary" id="btnViewItemClaims" data-id="${item._id}">View Received Claims</button>
            <button class="btn btn-outline" id="btnDeleteListing" data-id="${item._id}">Delete Listing</button>
          </div>
        `;
      } else if (state.user) {
        actionButtonsHtml = `
          <button class="btn btn-primary" id="btnOpenClaimForm" data-id="${item._id}">
            Submit Ownership Claim <span>↗</span>
          </button>
        `;
      } else {
        actionButtonsHtml = `
          <button class="btn btn-primary" id="btnLoginToClaim">
            Log in to Claim this Item <span>↗</span>
          </button>
        `;
      }

      // Secret marks display
      let secretHtml = '';
      if (item.secretDetails && canManage) {
        secretHtml = `
          <div style="margin-top: 12px; padding: 10px 14px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; font-size: 11px;">
            <strong style="color: #B45309; display: block; margin-bottom: 2px;">🔒 Secret Verification Mark (Reporter Note):</strong>
            <span style="color: #92400E;">${escapeHtml(item.secretDetails)}</span>
          </div>
        `;
      }

      itemDetailContent.innerHTML = `
        <div class="item-detail-hero">
          ${item.imageUrl 
            ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" />`
            : `<div style="font-size: 80px; color: var(--primary-blue);">✳</div>`
          }
        </div>

        <div class="item-badges-bar">
          <span class="status-pill ${statusClass}" style="position: static;">${statusLabel}</span>
          <span class="role-badge student" style="font-size: 11px;">${escapeHtml(item.category || 'Other')}</span>
          <span class="role-badge admin" style="font-size: 11px;">📍 ${escapeHtml(item.building || 'Campus')}</span>
          ${item.floor ? `<span class="role-badge student" style="font-size: 11px;">Floor: ${escapeHtml(item.floor)}</span>` : ''}
          ${item.locationType ? `<span class="role-badge admin" style="font-size: 11px;">${escapeHtml(item.locationType)}</span>` : ''}
          <span style="font-size: 11px; color: var(--text-secondary); margin-left: auto;">Reported ${formatRelativeTime(item.createdAt || item.date)}</span>
        </div>

        <h2 style="font-size: 24px; margin: 12px 0 8px; letter-spacing: -.03em; color: var(--navy);">${escapeHtml(item.title)}</h2>
        <p style="font-size: 13px; color: var(--text-primary); line-height: 1.6; margin-bottom: 16px;">${escapeHtml(item.description)}</p>

        <div class="info-keyvalue-grid">
          <div>
            <strong>Campus Building & Floor</strong>
            <span>${escapeHtml(item.building || 'AB-1')} · ${escapeHtml(item.floor || 'Ground')} Floor (${escapeHtml(item.locationType || 'Other')})</span>
          </div>
          <div>
            <strong>Specific Spot / Room</strong>
            <span>${escapeHtml(item.location)}</span>
          </div>
          <div>
            <strong>Date Reported</strong>
            <span>${escapeHtml(item.date)}</span>
          </div>
          <div>
            <strong>Reported By</strong>
            <span>${escapeHtml(item.reportedByName || 'Campus Member')}</span>
          </div>
        </div>

        ${receivedStatusHtml}
        ${secretHtml}
        ${matchesHtml}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; border-top: 1px solid var(--border); padding-top: 18px;">
          <span style="font-size: 11px; color: var(--text-secondary); font-family: monospace;">Listing ID: #${item._id}</span>
          ${actionButtonsHtml}
        </div>
      `;

      // Event listener bindings in modal
      const btnHandover = document.getElementById('btnHandoverFromDetail');
      if (btnHandover) {
        btnHandover.addEventListener('click', () => {
          itemDetailDialog.close();
          openReceivedClaimsModal(item._id, item.title);
        });
      }

      const btnOpenClaim = document.getElementById('btnOpenClaimForm');
      if (btnOpenClaim) {
        btnOpenClaim.addEventListener('click', () => {
          itemDetailDialog.close();
          openClaimModal(item);
        });
      }

      const btnLoginClaim = document.getElementById('btnLoginToClaim');
      if (btnLoginClaim) {
        btnLoginClaim.addEventListener('click', () => {
          itemDetailDialog.close();
          openAuthModal('login');
        });
      }

      const btnViewClaims = document.getElementById('btnViewItemClaims');
      if (btnViewClaims) {
        btnViewClaims.addEventListener('click', () => {
          itemDetailDialog.close();
          openReceivedClaimsModal(item._id, item.title);
        });
      }

      const btnDeleteListing = document.getElementById('btnDeleteListing');
      if (btnDeleteListing) {
        btnDeleteListing.addEventListener('click', async () => {
          if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
          try {
            await API.deleteItem(item._id);
            itemDetailDialog.close();
            showToast('Listing deleted successfully.', 'success');
            if (state.activeView === 'home') loadItems();
            if (state.activeView === 'userDashboard') loadUserDashboard();
            if (state.activeView === 'adminDashboard') loadAdminDashboard();
          } catch (err) {
            showToast(err.message || 'Failed to delete listing.', 'error');
          }
        });
      }

      // Match item view button
      itemDetailContent.querySelectorAll('.view-match-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const mId = btn.dataset.id;
          if (mId) openItemDetail(mId);
        });
      });

    } catch (err) {
      itemDetailContent.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--danger);">
          Failed to load item details: ${escapeHtml(err.message)}
        </div>
      `;
    }
  }

  closeDetailDialog.addEventListener('click', () => itemDetailDialog.close());

  // ==========================================================
  // CLAIM SUBMISSION FLOW
  // ==========================================================
  function openClaimModal(item) {
    if (!state.user) {
      openAuthModal('login');
      return;
    }
    claimItemId.value = item._id;
    claimItemPreview.textContent = `${item.title} (${item.type.toUpperCase()} at ${item.building})`;
    claimForm.reset();
    claimItemId.value = item._id;
    claimDialog.showModal();
  }

  closeClaimDialog.addEventListener('click', () => claimDialog.close());
  cancelClaimBtn.addEventListener('click', () => claimDialog.close());

  claimForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const itemId = claimItemId.value;
    const proofDescription = document.getElementById('claimProofText').value.trim();
    const verificationAnswer = document.getElementById('claimVerificationAnswer').value.trim();
    const contactPhone = document.getElementById('claimPhone').value.trim();
    const proofFile = document.getElementById('claimProofFile').files[0];

    const formData = new FormData();
    formData.append('itemId', itemId);
    formData.append('proofDescription', proofDescription);
    formData.append('verificationAnswer', verificationAnswer);
    formData.append('contactPhone', contactPhone);
    if (proofFile) {
      formData.append('proofImage', proofFile);
    }

    const submitBtn = document.getElementById('submitClaimBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting claim...';

    try {
      await API.submitClaim(formData);
      claimDialog.close();
      claimForm.reset();
      showToast('Ownership claim submitted! Finder and campus security have been notified.', 'success');
      loadNotifications();
      if (state.activeView === 'userDashboard') loadUserDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to submit claim.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Ownership Claim';
    }
  });

  // ==========================================================
  // REVIEW RECEIVED CLAIMS & HANDOVER CONFIRMATION
  // ==========================================================
  async function openReceivedClaimsModal(itemId, itemTitle) {
    receivedClaimsList.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-secondary);">
        <span class="pulse-dot" style="display:inline-block; margin-bottom: 8px;"></span> Loading received claims...
      </div>
    `;
    receivedClaimsDialog.showModal();

    try {
      const data = await API.getClaimsForItem(itemId);
      const claims = data.claims || [];

      if (claims.length === 0) {
        receivedClaimsList.innerHTML = `
          <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
            <div style="font-size: 32px; margin-bottom: 8px;">📝</div>
            <h4>No claims submitted yet</h4>
            <p style="font-size: 12px;">When someone submits a claim with proof for "${escapeHtml(itemTitle)}", it will appear here for your review.</p>
          </div>
        `;
        return;
      }

      receivedClaimsList.innerHTML = claims.map(c => {
        const isApproved = c.status === 'approved';
        const isHandedOver = c.isReceived === true;

        return `
          <div style="border: 1px solid var(--border); border-radius: 12px; padding: 18px; margin-bottom: 14px; background: #FFFFFF; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div>
                <strong style="font-size: 14px; color: var(--navy);">${escapeHtml(c.claimantName)}</strong>
                <div style="font-size: 11px; color: var(--text-secondary);">Email: ${escapeHtml(c.claimantEmail)} · Phone: ${escapeHtml(c.contactPhone || 'N/A')}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                ${isHandedOver ? '<span class="status-pill received" style="position: static;">HANDOVER COMPLETE</span>' : ''}
                <span class="status-pill ${c.status}" style="position: static;">${c.status.toUpperCase()}</span>
              </div>
            </div>

            <div style="font-size: 12px; background: #F8FAFC; padding: 12px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 10px;">
              <strong style="color: var(--navy); display: block; font-size: 11px; margin-bottom: 3px;">Proof of Ownership Description:</strong>
              <p style="margin: 0; color: var(--text-primary); line-height: 1.5;">${escapeHtml(c.proofDescription)}</p>
              ${c.verificationAnswer ? `
                <div style="margin-top: 8px; border-top: 1px dashed var(--border); padding-top: 6px;">
                  <strong style="color: #B45309; font-size: 10px;">Answer to Secret Mark / Question:</strong>
                  <div style="color: var(--text-primary);">${escapeHtml(c.verificationAnswer)}</div>
                </div>
              ` : ''}
            </div>

            ${c.proofImageUrl ? `
              <div style="margin-bottom: 10px;">
                <a href="${escapeHtml(c.proofImageUrl)}" target="_blank" style="font-size: 11px; color: var(--primary-blue); font-weight: 700;">
                  📎 View Attached Proof Document / Photo ↗
                </a>
              </div>
            ` : ''}

            ${c.reviewNotes ? `
              <div style="font-size: 11px; color: var(--text-secondary); font-style: italic; margin-bottom: 8px;">
                Note: ${escapeHtml(c.reviewNotes)} (Reviewed by ${escapeHtml(c.reviewedBy || 'Admin')})
              </div>
            ` : ''}

            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px;">
              ${c.status === 'pending' ? `
                <button class="btn btn-outline btn-sm reject-claim-btn" data-id="${c._id}">Reject Claim</button>
                <button class="btn btn-primary btn-sm approve-claim-btn" data-id="${c._id}">✓ Approve Claim</button>
              ` : ''}

              ${(isApproved && !isHandedOver) ? `
                <button class="btn btn-primary btn-sm confirm-handover-btn" data-id="${c._id}">
                  🤝 Confirm Handover & Mark Received (+50 Pts)
                </button>
              ` : ''}

              ${isHandedOver ? `
                <span style="font-size: 12px; color: #047857; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                  ✓ Returned on ${c.receivedAt ? new Date(c.receivedAt).toLocaleDateString() : 'recent'}
                  ${c.rating ? `(Rated ★ ${c.rating}/5)` : ''}
                </span>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');

      // Approve/Reject actions
      receivedClaimsList.querySelectorAll('.approve-claim-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const notes = prompt('Enter approval notes or recovery coordination instructions:', 'Ownership verified. You can retrieve the item at campus security.');
          if (notes === null) return;
          try {
            await API.updateClaimStatus(btn.dataset.id, 'approved', notes);
            showToast('Claim approved! Item has been marked as Claim Approved.', 'success');
            openReceivedClaimsModal(itemId, itemTitle);
            loadItems();
            if (state.activeView === 'userDashboard') loadUserDashboard();
          } catch (err) {
            showToast(err.message || 'Failed to approve claim.', 'error');
          }
        });
      });

      receivedClaimsList.querySelectorAll('.reject-claim-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const notes = prompt('Enter reason for rejecting claim:', 'Insufficient proof of ownership.');
          if (notes === null) return;
          try {
            await API.updateClaimStatus(btn.dataset.id, 'rejected', notes);
            showToast('Claim marked as rejected.', 'info');
            openReceivedClaimsModal(itemId, itemTitle);
          } catch (err) {
            showToast(err.message || 'Failed to reject claim.', 'error');
          }
        });
      });

      // Confirm Handover Action
      receivedClaimsList.querySelectorAll('.confirm-handover-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const notes = prompt('Enter handover confirmation notes (e.g. handed over at Security Office):', 'Item physically handed over and verified by owner.');
          if (notes === null) return;
          try {
            const res = await API.confirmHandover(btn.dataset.id, notes);
            showToast('Handover confirmed! Status changed to Received. +50 FINDORA Hero Points awarded!', 'success', 5000);
            receivedClaimsDialog.close();
            await initAuth();
            loadItems();
            if (state.activeView === 'userDashboard') loadUserDashboard();
            if (state.activeView === 'heroes') loadHeroesLeaderboard();
          } catch (err) {
            showToast(err.message || 'Failed to confirm handover.', 'error');
          }
        });
      });

    } catch (err) {
      receivedClaimsList.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--danger);">
          Failed to load claims: ${escapeHtml(err.message)}
        </div>
      `;
    }
  }

  closeReceivedClaimsDialog.addEventListener('click', () => receivedClaimsDialog.close());

  // ==========================================================
  // RATING & FEEDBACK MODAL (1-5 STARS)
  // ==========================================================
  function openFeedbackModal(claimId) {
    feedbackClaimId.value = claimId;
    feedbackForm.reset();
    feedbackClaimId.value = claimId;
    setFeedbackRating(5);
    feedbackDialog.showModal();
  }

  function setFeedbackRating(stars) {
    state.selectedFeedbackRating = stars;
    feedbackRatingInput.value = stars;
    if (starSelector) {
      const starBtns = starSelector.querySelectorAll('.star-btn');
      starBtns.forEach(btn => {
        const starVal = parseInt(btn.dataset.star, 10);
        btn.classList.toggle('active', starVal <= stars);
      });
    }
  }

  if (starSelector) {
    starSelector.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const stars = parseInt(btn.dataset.star, 10);
        setFeedbackRating(stars);
      });
    });
  }

  closeFeedbackDialog.addEventListener('click', () => feedbackDialog.close());
  cancelFeedbackBtn.addEventListener('click', () => feedbackDialog.close());

  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const claimId = feedbackClaimId.value;
    const rating = parseInt(feedbackRatingInput.value, 10);
    const feedback = feedbackTextInput.value.trim();

    try {
      const res = await API.submitFeedback(claimId, rating, feedback);
      feedbackDialog.close();
      let msg = `Thank you! Feedback recorded with ${rating} ★ rating.`;
      if (res.pointsAwarded && res.pointsAwarded > 0) {
        msg += ` Finder awarded +${res.pointsAwarded} bonus Hero Points!`;
      }
      showToast(msg, 'success', 4500);
      loadUserDashboard();
      if (state.activeView === 'heroes') loadHeroesLeaderboard();
    } catch (err) {
      showToast(err.message || 'Failed to submit feedback.', 'error');
    }
  });

  // ==========================================================
  // FINDORA HEROES & WEEKLY LEADERBOARD
  // ==========================================================
  async function loadHeroesLeaderboard() {
    if (!heroesLeaderboardBody) return;
    heroesLeaderboardBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 30px; color: var(--text-secondary);">
          <span class="pulse-dot" style="display:inline-block; margin-bottom: 8px;"></span> Loading weekly campus heroes...
        </td>
      </tr>
    `;

    try {
      const [leaderboardData, heroesStats] = await Promise.all([
        API.getLeaderboard(),
        API.getHeroesStats()
      ]);

      const heroes = leaderboardData.leaderboard || [];

      if (heroes.length === 0) {
        heroesLeaderboardBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-secondary);">
              <div style="font-size: 32px; margin-bottom: 8px;">🏅</div>
              <strong>No Campus Heroes recorded this week yet</strong>
              <p style="font-size: 12px; margin-top: 4px;">Report found items and complete handovers to earn points and claim the top ranking!</p>
            </td>
          </tr>
        `;
        return;
      }

      heroesLeaderboardBody.innerHTML = heroes.map((h, idx) => {
        const rank = idx + 1;
        let rankBadge = `#${rank}`;
        if (rank === 1) rankBadge = '🥇 #1';
        else if (rank === 2) rankBadge = '🥈 #2';
        else if (rank === 3) rankBadge = '🥉 #3';

        const badgeClass = getBadgeClass(h.badge);
        const avatarUrl = h.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(h.name)}`;
        const avgRating = (h.averageRating || 5.0).toFixed(1);

        return `
          <tr>
            <td>
              <strong style="font-size: 14px; color: var(--navy);">${rankBadge}</strong>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${avatarUrl}" alt="${escapeHtml(h.name)}" style="width: 32px; height: 32px; border-radius: 999px; border: 1px solid var(--border);" />
                <div>
                  <div style="font-weight: 700; color: var(--navy);">${escapeHtml(h.name)}</div>
                  <div style="font-size: 11px; color: var(--text-secondary);">${escapeHtml(h.email)}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge-pill ${badgeClass}">
                ${escapeHtml(h.badge || 'Helpful Student')}
              </span>
            </td>
            <td>
              <strong style="color: var(--primary-blue); font-size: 13px;">${h.returnsCount || 0}</strong> returns
            </td>
            <td>
              <span style="color: #D97706; font-weight: 800; font-size: 13px;">★ ${avgRating}</span>
              <span style="font-size: 10px; color: var(--text-secondary);">(${h.ratingsCount || 0})</span>
            </td>
            <td>
              <span class="pts-badge">+${h.weeklyPoints || 0} pts</span>
            </td>
            <td>
              <strong style="color: var(--navy); font-size: 13px;">${h.points || 0} pts</strong>
            </td>
          </tr>
        `;
      }).join('');

    } catch (err) {
      console.error('Failed to load heroes:', err);
      heroesLeaderboardBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 30px; color: var(--danger);">
            Failed to load leaderboard: ${escapeHtml(err.message)}
          </td>
        </tr>
      `;
    }
  }

  // ==========================================================
  // USER DASHBOARD (MY LISTINGS & MY CLAIMS)
  // ==========================================================
  userTabItems.addEventListener('click', () => {
    state.userTab = 'items';
    userTabItems.classList.add('active');
    userTabClaims.classList.remove('active');
    userItemsTabContent.style.display = 'block';
    userClaimsTabContent.style.display = 'none';
  });

  userTabClaims.addEventListener('click', () => {
    state.userTab = 'claims';
    userTabClaims.classList.add('active');
    userTabItems.classList.remove('active');
    userClaimsTabContent.style.display = 'block';
    userItemsTabContent.style.display = 'none';
  });

  dashReportBtn.addEventListener('click', () => openReportModal());
  userReportNowBtn.addEventListener('click', () => openReportModal());

  async function loadUserDashboard() {
    if (!state.user) return;

    userItemsGrid.innerHTML = '<div style="grid-column: 1 / -1; padding: 20px; text-align: center;">Loading your reported listings...</div>';
    userClaimsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Loading your submitted claims...</td></tr>';

    try {
      const [itemsRes, claimsRes, meRes] = await Promise.all([
        API.getMyItems(),
        API.getMyClaims(),
        API.getMe()
      ]);

      const myItems = itemsRes.items || [];
      const myClaims = claimsRes.claims || [];
      if (meRes && meRes.user) {
        state.user = meRes.user;
        API.setUser(meRes.user);
        updateNavUI();
      }

      userItemsCount.textContent = myItems.length;
      userClaimsCount.textContent = myClaims.length;

      // Update User Hero Metrics in Dashboard
      if (userDashPoints) userDashPoints.textContent = state.user.points || 0;
      if (userDashWeeklyPts) userDashWeeklyPts.textContent = `${state.user.weeklyPoints || 0} weekly points`;
      if (userDashReturns) userDashReturns.textContent = state.user.returnsCount || 0;
      if (userDashRating) userDashRating.textContent = `${(state.user.averageRating || 5.0).toFixed(1)} ★`;
      if (userDashBadge) {
        userDashBadge.textContent = state.user.badge || 'Helpful Student';
      }

      // Render My Items
      if (myItems.length === 0) {
        userItemsGrid.innerHTML = '';
        userItemsEmpty.style.display = 'block';
      } else {
        userItemsEmpty.style.display = 'none';
        userItemsGrid.innerHTML = myItems.map(item => {
          const isFound = item.type.toLowerCase() === 'found';
          let statusClass = item.status || (isFound ? 'found' : 'lost');
          let statusLabel = isFound ? 'Found' : 'Lost';

          if (item.status === 'received') {
            statusClass = 'received';
            statusLabel = '✓ Received';
          } else if (item.status === 'approved') {
            statusClass = 'approved';
            statusLabel = 'Approved';
          } else if (item.status === 'claimed' || item.status === 'claim_pending') {
            statusClass = 'claimed';
            statusLabel = item.status === 'claim_pending' ? 'Claim Pending' : 'Claimed';
          } else if (item.status === 'resolved') {
            statusClass = 'resolved';
            statusLabel = 'Resolved';
          }

          return `
            <article class="item-card">
              <div class="item-image" style="height: 140px;">
                <span class="status-pill ${statusClass}">${statusLabel}</span>
                ${item.imageUrl 
                  ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" />`
                  : `<span class="item-image-placeholder" style="font-size: 40px; color: var(--primary-blue);">✳</span>`
                }
              </div>
              <div class="item-info">
                <div class="item-topline">
                  <span>${escapeHtml(item.category)}</span>
                  <span>${formatRelativeTime(item.createdAt || item.date)}</span>
                </div>
                <h3>${escapeHtml(item.title)}</h3>
                <div class="item-location">📍 ${escapeHtml(item.building)} · ${escapeHtml(item.floor || 'Ground')} Floor</div>
                <div class="item-bottom">
                  <button class="btn btn-primary btn-sm view-item-claims-btn" data-id="${item._id}" data-title="${escapeHtml(item.title)}">
                    Received Claims
                  </button>
                  <button class="btn btn-outline btn-sm delete-my-item-btn" data-id="${item._id}">
                    Delete
                  </button>
                </div>
              </div>
            </article>
          `;
        }).join('');

        userItemsGrid.querySelectorAll('.view-item-claims-btn').forEach(btn => {
          btn.addEventListener('click', () => openReceivedClaimsModal(btn.dataset.id, btn.dataset.title));
        });

        userItemsGrid.querySelectorAll('.delete-my-item-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to delete this listing?')) return;
            try {
              await API.deleteItem(btn.dataset.id);
              showToast('Listing removed.', 'success');
              loadUserDashboard();
              loadItems();
            } catch (err) {
              showToast(err.message, 'error');
            }
          });
        });
      }

      // Render My Claims
      if (myClaims.length === 0) {
        userClaimsTableBody.innerHTML = '';
        userClaimsEmpty.style.display = 'block';
      } else {
        userClaimsEmpty.style.display = 'none';
        userClaimsTableBody.innerHTML = myClaims.map(c => {
          const isReceived = c.isReceived === true;
          const isApproved = c.status === 'approved';

          let statusDisplay = `<span class="status-pill ${c.status}" style="position: static;">${c.status.toUpperCase()}</span>`;
          if (isReceived) {
            statusDisplay = `<span class="status-pill received" style="position: static;">RECEIVED</span>`;
          }

          let actionCell = `<button class="btn btn-outline btn-sm view-claimed-item-btn" data-id="${c.itemId}">View Listing</button>`;

          if (isReceived && !c.rating) {
            actionCell = `
              <div style="display: flex; gap: 6px; align-items: center;">
                <button class="btn btn-primary btn-sm open-rate-btn" data-claim-id="${c._id}" style="background: #D97706; border-color: #D97706;">
                  ★ Rate Return
                </button>
                <button class="btn btn-outline btn-sm view-claimed-item-btn" data-id="${c.itemId}">View</button>
              </div>
            `;
          } else if (isReceived && c.rating) {
            actionCell = `
              <div style="display: flex; gap: 6px; align-items: center;">
                <span style="color: #D97706; font-weight: 800; font-size: 11px;">★ ${c.rating}/5 Rated</span>
                <button class="btn btn-outline btn-sm view-claimed-item-btn" data-id="${c.itemId}">View</button>
              </div>
            `;
          }

          return `
            <tr>
              <td>
                <strong style="color: var(--navy);">${escapeHtml(c.itemTitle)}</strong>
                <div style="font-size: 10px; color: var(--text-secondary); font-family: monospace;">#${c.itemId}</div>
              </td>
              <td>${formatRelativeTime(c.createdAt)}</td>
              <td>${statusDisplay}</td>
              <td style="max-width: 250px;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(c.proofDescription)}</div>
              </td>
              <td>${escapeHtml(c.reviewNotes || (isReceived ? 'Handover completed' : 'Pending evaluation'))}</td>
              <td>${actionCell}</td>
            </tr>
          `;
        }).join('');

        userClaimsTableBody.querySelectorAll('.view-claimed-item-btn').forEach(btn => {
          btn.addEventListener('click', () => openItemDetail(btn.dataset.id));
        });

        userClaimsTableBody.querySelectorAll('.open-rate-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            openFeedbackModal(btn.dataset.claimId);
          });
        });
      }

    } catch (err) {
      console.error('Failed to load user dashboard:', err);
      showToast('Error loading dashboard: ' + err.message, 'error');
    }
  }

  // ==========================================================
  // ADMIN DASHBOARD (METRICS, CHARTS & ANTI-CHEAT AUDIT LOGS)
  // ==========================================================
  async function loadAdminDashboard() {
    if (!state.user || state.user.role !== 'admin') return;

    try {
      const [statsRes, claimsRes, itemsRes, logsRes] = await Promise.all([
        API.getDashboardStats(),
        API.getAllClaims(adminClaimFilter ? adminClaimFilter.value : 'all'),
        API.getItems(),
        API.getRewardLogs()
      ]);

      const stats = statsRes.stats || {};
      const claims = claimsRes.claims || [];
      const allItems = itemsRes.items || [];
      const auditLogs = logsRes.logs || [];

      // Render Metrics
      metricTotal.textContent = stats.totalItems || 0;
      metricClaimed.textContent = stats.claimedItems || 0;
      metricPending.textContent = stats.pendingClaims || 0;
      if (metricHeroPts) metricHeroPts.textContent = stats.weeklyPointsTotal || 0;
      metricRateSub.textContent = `${stats.recoveryRate || '0%'} campus recovery rate`;

      // Render Charts
      if (window.Charts) {
        Charts.renderTrendChart('trendChartContainer', stats.monthlyTrend || []);
        Charts.renderCategoryBars('categoryBarsContainer', stats.categoryBreakdown || {});
      }

      // Render Admin Claims Table
      if (claims.length === 0) {
        adminClaimsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">No claims found under selected status.</td></tr>';
      } else {
        adminClaimsTableBody.innerHTML = claims.map(c => `
          <tr>
            <td>
              <strong>${escapeHtml(c.itemTitle)}</strong>
              <div style="font-size: 10px; color: var(--text-secondary); font-family: monospace;">#${c.itemId}</div>
            </td>
            <td>
              <div>${escapeHtml(c.claimantName)}</div>
              <div style="font-size: 10px; color: var(--text-secondary);">${escapeHtml(c.claimantEmail)}</div>
            </td>
            <td>${escapeHtml(c.contactPhone || 'N/A')}</td>
            <td style="max-width: 200px;">
              <div style="font-size: 11px; color: var(--text-primary);">${escapeHtml(c.proofDescription)}</div>
              ${c.verificationAnswer ? `<div style="font-size: 10px; color: #B45309;">Ans: ${escapeHtml(c.verificationAnswer)}</div>` : ''}
            </td>
            <td><span class="status-pill ${c.status}" style="position: static;">${c.status.toUpperCase()}</span></td>
            <td>
              ${c.status === 'pending' ? `
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-primary btn-sm admin-approve-btn" data-id="${c._id}">✓ Approve</button>
                  <button class="btn btn-outline btn-sm admin-reject-btn" data-id="${c._id}">Reject</button>
                </div>
              ` : `
                <span style="font-size: 11px; color: var(--text-secondary);">${escapeHtml(c.reviewNotes || 'Evaluated')}</span>
              `}
            </td>
          </tr>
        `).join('');

        adminClaimsTableBody.querySelectorAll('.admin-approve-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const notes = prompt('Enter approval instructions for claimant:', 'Verified and approved by Campus Security. Please collect at Main Gate.');
            if (notes === null) return;
            try {
              await API.updateClaimStatus(btn.dataset.id, 'approved', notes);
              showToast('Claim approved successfully!', 'success');
              loadAdminDashboard();
            } catch (err) {
              showToast(err.message, 'error');
            }
          });
        });

        adminClaimsTableBody.querySelectorAll('.admin-reject-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const notes = prompt('Enter rejection reason:', 'Claim rejected: identifying details do not match.');
            if (notes === null) return;
            try {
              await API.updateClaimStatus(btn.dataset.id, 'rejected', notes);
              showToast('Claim marked as rejected.', 'info');
              loadAdminDashboard();
            } catch (err) {
              showToast(err.message, 'error');
            }
          });
        });
      }

      // Render Admin Items Table
      if (allItems.length === 0) {
        adminItemsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No items found.</td></tr>';
      } else {
        adminItemsTableBody.innerHTML = allItems.map(item => `
          <tr>
            <td><strong>${escapeHtml(item.title)}</strong></td>
            <td><span class="status-pill ${item.type}" style="position: static;">${item.type.toUpperCase()}</span></td>
            <td>${escapeHtml(item.category)}</td>
            <td>${escapeHtml(item.building)} · ${escapeHtml(item.floor || 'Ground')} Floor</td>
            <td>${escapeHtml(item.reportedByName)}</td>
            <td><span class="status-pill ${item.status}" style="position: static;">${item.status.toUpperCase()}</span></td>
            <td>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-outline btn-sm admin-view-item-btn" data-id="${item._id}">View</button>
                <button class="btn btn-outline btn-sm admin-toggle-status-btn" data-id="${item._id}" data-status="${item.status}">
                  ${item.status === 'open' ? 'Mark Resolved' : 'Reopen'}
                </button>
                <button class="btn btn-outline btn-sm admin-delete-item-btn" data-id="${item._id}" style="color: var(--danger);">✕</button>
              </div>
            </td>
          </tr>
        `).join('');

        adminItemsTableBody.querySelectorAll('.admin-view-item-btn').forEach(btn => {
          btn.addEventListener('click', () => openItemDetail(btn.dataset.id));
        });

        adminItemsTableBody.querySelectorAll('.admin-toggle-status-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const newStatus = btn.dataset.status === 'open' ? 'resolved' : 'open';
            try {
              await API.updateItem(btn.dataset.id, { status: newStatus });
              showToast(`Item status changed to ${newStatus}.`, 'success');
              loadAdminDashboard();
            } catch (err) {
              showToast(err.message, 'error');
            }
          });
        });

        adminItemsTableBody.querySelectorAll('.admin-delete-item-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to permanently delete this item?')) return;
            try {
              await API.deleteItem(btn.dataset.id);
              showToast('Item deleted.', 'success');
              loadAdminDashboard();
            } catch (err) {
              showToast(err.message, 'error');
            }
          });
        });
      }

      // Render Admin Anti-Cheat Audit Logs Table
      if (adminAuditLogBody) {
        if (auditLogs.length === 0) {
          adminAuditLogBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">No reward point transactions recorded yet.</td></tr>';
        } else {
          adminAuditLogBody.innerHTML = auditLogs.map(log => `
            <tr>
              <td style="font-size: 11px; color: var(--text-secondary);">${new Date(log.awardedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
              <td><strong>${escapeHtml(log.userName || log.userEmail)}</strong></td>
              <td><span class="status-pill approved" style="position: static;">${escapeHtml(log.action)}</span></td>
              <td><span class="pts-badge">+${log.points} pts</span></td>
              <td style="font-size: 11px; color: var(--text-secondary);">${escapeHtml(log.reason)}</td>
              <td><span class="badge-pill hero" style="font-size: 10px; padding: 2px 8px;">✓ Verified Safe</span></td>
            </tr>
          `).join('');
        }
      }

    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      showToast('Admin error: ' + err.message, 'error');
    }
  }

  if (refreshStatsBtn) {
    refreshStatsBtn.addEventListener('click', () => {
      loadAdminDashboard();
      showToast('Metrics refreshed.', 'info');
    });
  }

  if (adminClaimFilter) {
    adminClaimFilter.addEventListener('change', () => loadAdminDashboard());
  }

  // ==========================================================
  // IN-APP NOTIFICATIONS
  // ==========================================================
  async function loadNotifications() {
    if (!state.user) return;
    try {
      const res = await API.getNotifications();
      state.notifications = res.notifications || [];
      const unreadCount = state.notifications.filter(n => !n.isRead).length;

      if (unreadCount > 0) {
        notifBadge.textContent = unreadCount;
        notifBadge.style.display = 'grid';
      } else {
        notifBadge.style.display = 'none';
      }

      renderNotificationList(state.notifications);
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
    }
  }

  function renderNotificationList(notifications) {
    if (!notifications || notifications.length === 0) {
      notifList.innerHTML = '<div class="notif-empty">No campus notifications yet.</div>';
      return;
    }

    const typeIcons = {
      'claim_submitted': '📝',
      'claim_approved': '✓',
      'claim_rejected': '✕',
      'match_alert': '💡',
      'system': '🔔'
    };

    notifList.innerHTML = notifications.map(n => `
      <div class="notif-item ${n.isRead ? '' : 'unread'}" data-id="${n._id}" data-link="${n.link || ''}">
        <span class="notif-icon">${typeIcons[n.type] || '🔔'}</span>
        <div class="notif-body">
          <strong>${escapeHtml(n.title)}</strong>
          <p>${escapeHtml(n.message)}</p>
          <span class="notif-time">${formatRelativeTime(n.createdAt)}</span>
        </div>
      </div>
    `).join('');

    notifList.querySelectorAll('.notif-item').forEach(el => {
      el.addEventListener('click', async () => {
        const id = el.dataset.id;
        const link = el.dataset.link;
        try {
          await API.markNotificationRead(id);
          el.classList.remove('unread');
          loadNotifications();
        } catch (e) {
          console.warn(e);
        }
        if (link && link.startsWith('/items/')) {
          const itemId = link.replace('/items/', '');
          openItemDetail(itemId);
          notifDropdown.style.display = 'none';
        }
      });
    });
  }

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = notifDropdown.style.display === 'flex';
    notifDropdown.style.display = isVisible ? 'none' : 'flex';
  });

  document.addEventListener('click', (e) => {
    if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
      notifDropdown.style.display = 'none';
    }
  });

  markAllReadBtn.addEventListener('click', async () => {
    try {
      await API.markAllNotificationsRead();
      loadNotifications();
      showToast('All notifications marked as read.', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // ==========================================================
  // BOOTSTRAP APPLICATION
  // ==========================================================
  initAuth();
  loadItems();
});
