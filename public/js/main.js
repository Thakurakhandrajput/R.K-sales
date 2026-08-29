(function () {
  "use strict";

  /* ---------------- Toast ---------------- */
  var toastEl = document.getElementById("toast");
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 1800);
  }

  /* ---------------- Side drawer ---------------- */
  var menuBtn = document.getElementById("menuBtn");
  var sideDrawer = document.getElementById("sideDrawer");
  var scrim = document.getElementById("scrim");

  function openSideDrawer() {
    sideDrawer && sideDrawer.classList.add("open");
    scrim && scrim.classList.add("show");
  }
  function closeSideDrawer() {
    sideDrawer && sideDrawer.classList.remove("open");
    if (!document.getElementById("wishlistDrawer").classList.contains("open")) {
      scrim && scrim.classList.remove("show");
    }
  }
  menuBtn && menuBtn.addEventListener("click", openSideDrawer);
  scrim && scrim.addEventListener("click", function () {
    closeSideDrawer();
    closeWishlistDrawer();
  });

  /* ---------------- Wishlist (localStorage) ---------------- */
  var WISHLIST_KEY = "rksales_wishlist";

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function saveWishlist(map) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(map));
  }
  function isSaved(id) {
    return !!getWishlist()[id];
  }

  function updateBadge() {
    var count = Object.keys(getWishlist()).length;
    var badge = document.getElementById("wishlistCount");
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle("show", count > 0);
  }

  function syncFavButtons() {
    var map = getWishlist();
    document.querySelectorAll("[data-fav]").forEach(function (btn) {
      var id = btn.getAttribute("data-fav");
      btn.classList.toggle("active", !!map[id]);
      var use = btn.querySelector("use");
      if (use) use.setAttribute("href", map[id] ? "#i-heart-fill" : "#i-heart");
    });
    var pdBtn = document.getElementById("pdWishlistBtn");
    if (pdBtn) {
      var pid = pdBtn.getAttribute("data-fav-btn");
      pdBtn.classList.toggle("active", !!map[pid]);
      pdBtn.innerHTML = map[pid]
        ? '<svg><use href="#i-heart-fill"/></svg> Saved'
        : '<svg><use href="#i-heart"/></svg> Save';
    }
  }

  function toggleWishlist(id, meta) {
    var map = getWishlist();
    if (map[id]) {
      delete map[id];
      toast("Removed from wishlist");
    } else {
      map[id] = meta || { id: id };
      toast("Saved to wishlist");
    }
    saveWishlist(map);
    updateBadge();
    syncFavButtons();
    renderWishlistDrawer();
  }

  function cardMetaFromEl(cardEl) {
    if (!cardEl) return null;
    return {
      id: cardEl.getAttribute("data-id"),
      name: cardEl.querySelector(".p-name") ? cardEl.querySelector(".p-name").textContent : "",
      price: cardEl.querySelector(".p-price") ? cardEl.querySelector(".p-price").textContent : "",
      cat: cardEl.querySelector(".p-cat") ? cardEl.querySelector(".p-cat").textContent : ""
    };
  }

  document.addEventListener("click", function (e) {
    var favBtn = e.target.closest("[data-fav]");
    if (favBtn) {
      e.preventDefault();
      var id = favBtn.getAttribute("data-fav");
      var card = favBtn.closest(".p-card");
      toggleWishlist(id, cardMetaFromEl(card) || { id: id });
      return;
    }
    var pdBtn = e.target.closest("[data-fav-btn]");
    if (pdBtn) {
      e.preventDefault();
      var pid = pdBtn.getAttribute("data-fav-btn");
      toggleWishlist(pid, {
        id: pid,
        name: document.querySelector(".pd-name") ? document.querySelector(".pd-name").textContent : "",
        price: document.querySelector(".pd-price") ? document.querySelector(".pd-price").textContent : "",
        cat: document.querySelector(".pd-cat") ? document.querySelector(".pd-cat").textContent : ""
      });
    }
  });

  /* ---------------- Wishlist drawer (right) ---------------- */
  var wishlistDrawer = document.getElementById("wishlistDrawer");
  var wishlistBody = document.getElementById("wishlistBody");

  function openWishlistDrawer() {
    renderWishlistDrawer();
    wishlistDrawer && wishlistDrawer.classList.add("open");
    scrim && scrim.classList.add("show");
  }
  function closeWishlistDrawer() {
    wishlistDrawer && wishlistDrawer.classList.remove("open");
    if (!sideDrawer.classList.contains("open")) {
      scrim && scrim.classList.remove("show");
    }
  }
  function renderWishlistDrawer() {
    if (!wishlistBody) return;
    var map = getWishlist();
    var items = Object.keys(map).map(function (k) { return map[k]; });
    if (!items.length) {
      wishlistBody.innerHTML = '<p class="wishlist-empty">No products saved yet. Tap the heart on any product to save it here.</p>';
      return;
    }
    wishlistBody.innerHTML = items.map(function (it) {
      return (
        '<div class="wishlist-item">' +
        '<div class="wi-thumb" style="background:linear-gradient(155deg,var(--cream-soft),var(--gold-soft))"></div>' +
        '<div><p class="wi-name">' + (it.name || "Product") + "</p>" +
        '<span class="wi-price">' + (it.price || "") + "</span></div>" +
        '<button class="wi-remove" data-remove="' + it.id + '" aria-label="Remove">&times;</button>' +
        "</div>"
      );
    }).join("");
  }
  document.getElementById("wishlistBtn") && document.getElementById("wishlistBtn").addEventListener("click", openWishlistDrawer);
  document.getElementById("navWishlistBtn") && document.getElementById("navWishlistBtn").addEventListener("click", openWishlistDrawer);
  document.getElementById("closeWishlist") && document.getElementById("closeWishlist").addEventListener("click", closeWishlistDrawer);
  wishlistBody && wishlistBody.addEventListener("click", function (e) {
    var rm = e.target.closest("[data-remove]");
    if (rm) toggleWishlist(rm.getAttribute("data-remove"));
  });

  updateBadge();
  syncFavButtons();

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------------- Icon map for product thumbnails ---------------- */
  function iconForCategory(cat) {
    if (cat === "Locks") return "lock";
    if (cat === "Door Handles") return "handle";
    if (cat === "Hinges") return "hinge";
    if (cat === "Drawer Slides") return "slide";
    return "lock";
  }

  function buildCardHTML(p, idAttr) {
    var icon = iconForCategory(p.category);
    return (
      '<article class="p-card" data-id="' + idAttr + '">' +
      '<div class="p-thumb"><svg><use href="#i-' + icon + '"/></svg>' +
      '<button class="p-fav" data-fav="' + idAttr + '" aria-label="Save to wishlist"><svg><use href="#i-heart"/></svg></button>' +
      "</div>" +
      '<div class="p-body">' +
      '<span class="p-cat">' + p.category + "</span>" +
      '<span class="p-name">' + p.name + "</span>" +
      '<span class="p-brand">' + p.brand + " &middot; " + p.finish + "</span>" +
      '<span class="p-price">' + p.price + "</span>" +
      '<a href="/shop/' + p.id + '" class="p-view">View Details</a>' +
      "</div></article>"
    );
  }

  /* ---------------- Infinite scroll feed (home page) ---------------- */
  var feedGrid = document.getElementById("feedGrid");
  var sentinel = document.getElementById("feedSentinel");
  var MAX_PAGES = 60; // safety cap on the endless demo feed

  if (feedGrid && sentinel) {
    var loading = false;
    var nextPage = parseInt(feedGrid.getAttribute("data-page"), 10) + 1;

    function loadMore() {
      if (loading) return;
      loading = true;
      if (nextPage > MAX_PAGES) {
        sentinel.innerHTML = '<span class="feed-end">You have reached the end for now — new stock added daily.</span>';
        return;
      }
      sentinel.innerHTML = '<span class="spinner"></span> Loading more products&hellip;';
      fetch("/api/feed?page=" + nextPage + "&limit=8")
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var frag = document.createDocumentFragment();
          var wrap = document.createElement("div");
          data.items.forEach(function (p) {
            wrap.innerHTML += buildCardHTML(p, p.feedId);
          });
          while (wrap.firstChild) frag.appendChild(wrap.firstChild);
          feedGrid.appendChild(frag);
          feedGrid.setAttribute("data-page", nextPage);
          nextPage += 1;
          loading = false;
          syncFavButtons();
        })
        .catch(function () {
          sentinel.innerHTML = '<span class="feed-end">Could not load more right now.</span>';
          loading = false;
        });
    }

    if ("IntersectionObserver" in window) {
      var feedObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) loadMore();
        });
      }, { rootMargin: "300px 0px" });
      feedObserver.observe(sentinel);
    } else {
      window.addEventListener("scroll", function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) loadMore();
      });
    }
  }

  /* ---------------- Products page: chip filter + search ---------------- */
  var chipRow = document.querySelector(".chip-row");
  var productGrid = document.getElementById("productGrid");
  var emptyState = document.getElementById("emptyState");
  var searchInput = document.getElementById("siteSearch");

  function applyFilters() {
    if (!productGrid) return;
    var activeChip = chipRow ? chipRow.querySelector(".chip.active") : null;
    var cat = activeChip ? activeChip.getAttribute("data-filter") : "All";
    var q = (searchInput && searchInput.value ? searchInput.value : "").trim().toLowerCase();
    var visibleCount = 0;

    productGrid.querySelectorAll(".p-card").forEach(function (card) {
      var cardCat = card.querySelector(".p-cat").textContent;
      var name = card.querySelector(".p-name").textContent.toLowerCase();
      var brand = card.querySelector(".p-brand").textContent.toLowerCase();
      var matchesCat = cat === "All" || cardCat === cat;
      var matchesQuery = !q || name.indexOf(q) !== -1 || brand.indexOf(q) !== -1 || cardCat.toLowerCase().indexOf(q) !== -1;
      var show = matchesCat && matchesQuery;
      card.style.display = show ? "" : "none";
      if (show) visibleCount++;
    });
    if (emptyState) emptyState.style.display = visibleCount === 0 ? "block" : "none";
  }

  if (chipRow) {
    chipRow.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      chipRow.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      applyFilters();
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  // Jump to category via hash (e.g. /products#Locks) on the products page
  if (productGrid && window.location.hash) {
    var hashCat = decodeURIComponent(window.location.hash.replace("#", ""));
    var targetChip = chipRow && chipRow.querySelector('[data-filter="' + hashCat + '"]');
    if (targetChip) {
      chipRow.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
      targetChip.classList.add("active");
      applyFilters();
    }
  }
})();
