(function () {
  const userId = localStorage.getItem('userId');
  const storeOwnerId = localStorage.getItem('storeOwnerId');
  const supplierId = localStorage.getItem('supplierId');

  if (!userId && !storeOwnerId && !supplierId) return;

  const style = document.createElement('style');
  style.textContent = `
    .nav-user-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--lime-cream, #f0f7ee);
      border: 1.5px solid var(--turf-green, #2c5f2d);
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 600;
      color: var(--dusk-blue, #1a2e4a);
      margin-left: 8px;
      white-space: nowrap;
    }
    .nav-user-name {
      color: var(--dusk-blue, #465775);
      text-decoration: none;
      font-weight: 700;
    }
    .nav-user-name:hover {
      color: var(--turf-green, #297045);
      text-decoration: underline;
    }
    .nav-user-role {
      color: var(--turf-green, #297045);
      font-size: 12px;
      font-weight: 700;
    }
    .nav-signout-btn {
      background: none;
      border: 1px solid var(--dusk-blue, #465775);
      color: var(--dusk-blue, #465775);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      padding: 2px 8px;
      border-radius: 10px;
      text-decoration: none;
    }
    .nav-signout-btn:hover {
      background: var(--dusk-blue, #465775);
      color: var(--lime-cream, #d2f898);
    }
  `;
  document.head.appendChild(style);

  // Identify each dropdown by a known link in its menu
  function findDropdownByLink(href) {
    var dropdowns = document.querySelectorAll('.dropdown');
    for (var i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].querySelector('a[href="' + href + '"]')) return dropdowns[i];
    }
    return null;
  }

  var customerDropdown = findDropdownByLink('/signin');
  var storeDropdown    = findDropdownByLink('/store-signin');
  var supplierDropdown = findDropdownByLink('/supplier-signin');

  // Hide the two dropdowns that don't belong to the logged-in account type
  function hideOtherDropdowns(activeDropdown) {
    [customerDropdown, storeDropdown, supplierDropdown].forEach(function (d) {
      if (d && d !== activeDropdown) d.style.display = 'none';
    });
  }

  // Replace sign-in + register links in a dropdown's Account section with
  // a dashboard link and a sign-out link
  function replaceAccountLinks(dropdown, signinHref, registerHref, dashHref, clearKey) {
    var menu = dropdown.querySelector('.dropdown-menu');
    if (!menu) return;

    var signinLink   = menu.querySelector('a[href="' + signinHref + '"]');
    var registerLink = menu.querySelector('a[href="' + registerHref + '"]');
    if (signinLink)   signinLink.remove();
    if (registerLink) registerLink.remove();

    var dashLink = document.createElement('a');
    dashLink.href = dashHref;
    dashLink.textContent = 'My Dashboard';

    var logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.textContent = 'Sign Out';
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem(clearKey);
      window.location.href = '/';
    });

    menu.appendChild(dashLink);
    menu.appendChild(logoutLink);
  }

  function injectPill(displayName, role, clearKey, profileUrl) {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    var pill = document.createElement('div');
    pill.className = 'nav-user-pill';
    pill.innerHTML =
      '\uD83D\uDC64 <a class="nav-user-name" href="' + profileUrl + '">' + displayName + '</a>' +
      ' <span class="nav-user-role">(' + role + ')</span>' +
      '&nbsp;&nbsp;<button class="nav-signout-btn" id="navSignOutBtn">Sign Out</button>';

    nav.appendChild(pill);

    document.getElementById('navSignOutBtn').addEventListener('click', function () {
      localStorage.removeItem(clearKey);
      window.location.href = '/';
    });
  }

  if (userId) {
    hideOtherDropdowns(customerDropdown);
    if (customerDropdown) {
      replaceAccountLinks(customerDropdown, '/signin', '/signup', '/profile', 'userId');
    }
    fetch('/api/user/' + userId)
      .then(function (r) { return r.json(); })
      .then(function (data) { injectPill(data.name || 'Customer', 'Customer', 'userId', '/profile'); })
      .catch(function () { injectPill('Customer', 'Customer', 'userId', '/profile'); });

  } else if (storeOwnerId) {
    hideOtherDropdowns(storeDropdown);
    if (storeDropdown) {
      replaceAccountLinks(storeDropdown, '/store-signin', '/store-signup', '/store-dashboard', 'storeOwnerId');
    }
    fetch('/api/store-owner/' + storeOwnerId)
      .then(function (r) { return r.json(); })
      .then(function (data) { injectPill(data.storeName || 'Store', 'Store', 'storeOwnerId', '/store-dashboard'); })
      .catch(function () { injectPill('Store', 'Store', 'storeOwnerId', '/store-dashboard'); });

  } else if (supplierId) {
    hideOtherDropdowns(supplierDropdown);
    if (supplierDropdown) {
      replaceAccountLinks(supplierDropdown, '/supplier-signin', '/supplier-signup', '/supplier-dashboard', 'supplierId');
    }
    fetch('/api/supplier/' + supplierId)
      .then(function (r) { return r.json(); })
      .then(function (data) { injectPill(data.companyName || 'Supplier', 'Supplier', 'supplierId', '/supplier-dashboard'); })
      .catch(function () { injectPill('Supplier', 'Supplier', 'supplierId', '/supplier-dashboard'); });
  }
})();
