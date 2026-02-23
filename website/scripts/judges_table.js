(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.ScrtJudgesTable = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (inQuotes) {
        if (char === '"') {
          const next = text[i + 1];
          if (next === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += char;
        }
        continue;
      }

      if (char === '"') {
        inQuotes = true;
        continue;
      }

      if (char === ',') {
        row.push(field);
        field = '';
        continue;
      }

      if (char === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        continue;
      }

      if (char === '\r') continue;

      field += char;
    }

    if (field.length > 0 || row.length > 0) {
      row.push(field);
      rows.push(row);
    }

    return rows;
  }

  function rowsToObjects(header, rows) {
    return rows.map(values => {
      const record = {};
      for (let i = 0; i < header.length; i++) {
        record[header[i]] = values[i] ?? '';
      }
      return record;
    });
  }

  function isIsoDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  function isNumber(value) {
    return /^-?\d+(?:\.\d+)?$/.test(value);
  }

  function toSortable(value) {
    const raw = (value ?? '').toString().trim();
    if (!raw) return { blank: true, type: 'blank', value: '' };
    if (isIsoDate(raw)) return { blank: false, type: 'date', value: Date.parse(raw) };
    if (isNumber(raw)) return { blank: false, type: 'number', value: Number(raw) };
    return { blank: false, type: 'string', value: raw.toLowerCase() };
  }

  function compareNonBlankSortable(a, b) {
    if (a.type === b.type) {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    }

    const aStr = a.value.toString();
    const bStr = b.value.toString();
    if (aStr < bStr) return -1;
    if (aStr > bStr) return 1;
    return 0;
  }

  function createComparator({ key, direction }) {
    const dir = direction === 'desc' ? -1 : 1;

    return (rowA, rowB) => {
      const a = toSortable(rowA?.[key]);
      const b = toSortable(rowB?.[key]);

      if (a.blank && b.blank) return 0;
      if (a.blank) return 1;
      if (b.blank) return -1;

      return compareNonBlankSortable(a, b) * dir;
    };
  }

  function normalizeQuery(query) {
    return (query ?? '').toString().trim().toLowerCase();
  }

  function filterRows(rows, query) {
    const q = normalizeQuery(query);
    if (!q) return rows.slice();

    const parts = q.split(/\s+/).filter(Boolean);
    if (!parts.length) return rows.slice();

    return rows.filter(row => {
      const haystack = Object.values(row)
        .map(v => (v ?? '').toString().toLowerCase())
        .join(' ');
      return parts.every(part => haystack.includes(part));
    });
  }

  function setText(el, text) {
    if (!el) return;
    el.textContent = text;
  }

  function createEl(tag, { className, text, attrs } = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        el.setAttribute(k, v);
      }
    }
    return el;
  }

  function mount({
    dataUrl,
    tableId,
    searchInputId,
    statusId,
    columnLabels = {},
    defaultSort = { key: 'judge', direction: 'asc' },
  }) {
    const table = document.getElementById(tableId);
    const searchInput = document.getElementById(searchInputId);
    const statusEl = document.getElementById(statusId);

    if (!table) {
      throw new Error(`ScrtJudgesTable.mount: table element not found: #${tableId}`);
    }

    if (!dataUrl) {
      throw new Error('ScrtJudgesTable.mount: dataUrl is required');
    }

    setText(statusEl, 'Loading…');

    const thead = table.createTHead();
    const tbody = table.createTBody();

    const state = {
      header: [],
      rows: [],
      filtered: [],
      sort: { key: defaultSort.key, direction: defaultSort.direction },
      query: '',
    };

    function renderHeader() {
      thead.innerHTML = '';
      const tr = document.createElement('tr');

      state.header.forEach(key => {
        const th = createEl('th', {
          text: columnLabels[key] ?? key,
          attrs: { scope: 'col', tabindex: '0' },
        });

        const isActive = state.sort.key === key;
        th.setAttribute('aria-sort', isActive ? (state.sort.direction === 'asc' ? 'ascending' : 'descending') : 'none');
        th.dataset.key = key;

        const toggle = () => {
          const nextDirection =
            state.sort.key === key ? (state.sort.direction === 'asc' ? 'desc' : 'asc') : 'asc';
          state.sort = { key, direction: nextDirection };
          render();
        };

        th.addEventListener('click', toggle);
        th.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        });

        tr.appendChild(th);
      });

      thead.appendChild(tr);
    }

    function renderBody() {
      tbody.innerHTML = '';

      const fragment = document.createDocumentFragment();
      state.filtered.forEach(row => {
        const tr = document.createElement('tr');
        state.header.forEach(key => {
          tr.appendChild(createEl('td', { text: row[key] ?? '' }));
        });
        fragment.appendChild(tr);
      });

      tbody.appendChild(fragment);
    }

    function renderStatus() {
      const total = state.rows.length;
      const shown = state.filtered.length;
      const q = state.query ? ` • Filter: "${state.query}"` : '';
      setText(statusEl, `Showing ${shown.toLocaleString()} of ${total.toLocaleString()}${q}`);
    }

    function render() {
      state.filtered = filterRows(state.rows, state.query)
        .slice()
        .sort(createComparator(state.sort));
      renderHeader();
      renderBody();
      renderStatus();
    }

    if (searchInput) {
      let searchTimer = null;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          state.query = searchInput.value ?? '';
          render();
        }, 80);
      });
    }

    return fetch(dataUrl, { cache: 'no-store' })
      .then(resp => {
        if (!resp.ok) throw new Error(`Failed to load CSV (${resp.status})`);
        return resp.text();
      })
      .then(text => {
        const allRows = parseCsv(text).filter(r => r.some(cell => (cell ?? '').toString().trim() !== ''));
        const header = (allRows[0] ?? []).map(h => (h ?? '').toString().trim());
        if (header.length && header[0] && header[0].charCodeAt(0) === 0xfeff) {
          header[0] = header[0].slice(1);
        }
        const dataRows = allRows.slice(1);

        state.header = header;
        state.rows = rowsToObjects(header, dataRows);
        if (state.header.length && !state.header.includes(state.sort.key)) {
          state.sort = { key: state.header[0], direction: 'asc' };
        }

        render();
      })
      .catch(err => {
        setText(statusEl, `Could not load table data. ${err.message}`);
        throw err;
      });
  }

  return {
    parseCsv,
    rowsToObjects,
    createComparator,
    filterRows,
    mount,
  };
});
