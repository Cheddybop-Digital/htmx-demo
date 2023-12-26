// eslint-disable-file
// modified version of this: https://github.com/Klaudeta/lit-pagination
import {
  html,
  css,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";
import "https://unpkg.com/htmx.org@1.9.9";

class LitPagination extends LitElement {
  static styles = css`
    div.pagination-container {
      height: 40px;
      margin-top: 30px;
      display: block;
      font-size: 14px;
    }

    div.pagination-container button {
      margin: 0 4px;
      padding: 2px 8px;
      position: relative;
      min-width: 30px;
      outline: none;
      border: 1px solid #000000;
      cursor: pointer;
      color: #000000;
      background-color: transparent;
      border-radius: 6px;
      transition: all 200ms;
    }

    div.pagination-container button:hover {
      transform: scale(1.1);
    }

    div.pagination-container button:disabled {
      color: #000000;
      background-color: gray;
    }

    div.pagination-container button.active {
      background-color: black;
      color: #ffffff;
    }

    div.pagination-container span {
      margin: 0 4px;
    }
  `;

  static properties = {
    sortDir: {
      type: String,
      reflect: true,
      attribute: true,
    },
    sortField: {
      type: String,
      reflect: true,
      attribute: true,
    },
    searchField: {
      type: String,
      reflect: true,
      attribute: true,
    },
    searchTerm: {
      type: String,
      reflect: true,
      attribute: true,
    },
    offset: {
      type: Number,
      reflect: true,
      attribute: true,
    },
    /** Per-page limit of the elements. */
    limit: {
      type: Number,
      reflect: true,
      attribute: true,
    },
    /** Total count of the elements. */
    total: {
      type: Number,
      reflect: true,
      attribute: true,
    },
    /** Current page. */
    page: {
      type: Number,
      reflect: true,
      attribute: true,
    },
    /** Count of the pages displayed before or after the current page. */
    size: {
      type: Number,
      reflect: true,
      attribute: true,
    },
    /** Number of paginated pages. */
    pages: {
      type: Number,
    },
    /** Has pages before the current page. */
    hasBefore: {
      type: Boolean,
    },
    /** Has pages after the current page. */
    hasNext: {
      type: Boolean,
    },
    /** Has pages. */
    hasPages: {
      type: Boolean,
    },
    /** Displayed page elements */
    items: {
      type: Array,
    },
  };

  constructor() {
    super();
    this.limit = 2;
    this.page = 2;
    this.size = 2;
    this.items = {};
    this.total = 20;
    this.sortDir = "";
    this.sortField = "";
    this.searchField = "";
    this.searchTerm = "";
    this.hasBefore = this.computeBefore(this.page, this.pages);
    this.hasNext = this.computeNext(this.page, this.pages);
    this.hasPages = this.computeHasPage(this.items.size, this.total);
    this.iconSize = "12px";
  }

  set page(val) {
    let oldVal = this._page;
    this._page = Math.ceil(val);
    this.onPageChange(this._page, oldVal);
    this.observePageCount(this._page, this.limit, this.total);
  }

  get page() {
    return this._page;
  }

  set limit(val) {
    this._limit = val;
    this.observePageCount(this.page, this._limit, this.total);
  }

  get limit() {
    return this._limit;
  }

  set total(val) {
    this._total = val;
    this.observePageCount(this.page, this.limit, this._total);
  }

  get total() {
    return this._total;
  }

  set size(val) {
    this._size = val;
  }

  get size() {
    return this._size;
  }

  render() {
    return html`
      <div class="pagination-container">
        <button
          @click=${() => this.onBegin()}
          style=${this.hasBefore ? "display: inline-block" : "display: none"}
        >
          <img
            alt="show first pagination buttons"
            width="${this.iconSize}"
            src="/icons/double-chevron-left.svg"
          />
        </button>
        <button
          @click=${() => this.onBefore()}
          style=${this.hasBefore ? "display: inline-block" : "display: none"}
        >
          <img
            alt="shift pagination buttons back by one"
            width="${this.iconSize}"
            src="/icons/chevron-left.svg"
          />
        </button>
        <span>Page</span>
        ${this.items.map(
          (item) => html`
            <button
              class=${this.offset === (item - 1) * 20 ? "active" : ""}
              @click=${async () => {
                this.onChange(item);
                try {
                  const url = this.createUrl(item);
                  const res = await fetch(url, {
                    method: "GET",
                    headers: {
                      "HX-Request": true,
                    },
                  });
                  const data = await res.text();
                  const table = document.getElementById("table");
                  table.outerHTML = data;

                  // TODO: update the url without page load
                  window.history.pushState({}, "HTMX Demo", url);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              ${item}
            </button>
          `,
        )}

        <span>of</span>
        ${this.pages}
        <button
          @click=${() => this.onNext()}
          style=${this.hasNext ? "display: inline-block" : "display: none"}
        >
          <img
            alt="shift pagination buttons forward by one"
            width="${this.iconSize}"
            src="/icons/chevron-right.svg"
          />
        </button>
        <button
          @click=${() => this.onEnd()}
          style=${this.hasBefore ? "display: inline-block" : "display: none"}
        >
          <img
            alt="show last pagination buttons"
            width="${this.iconSize}"
            src="/icons/double-chevron-right.svg"
          />
        </button>
      </div>
    `;
  }

  createUrl(index) {
    const url = new URL("/users", location);
    if (this.sortDir) url.searchParams.set("sortDir", this.sortDir);
    if (this.sortField) url.searchParams.set("sortField", this.sortField);
    if (this.searchField) url.searchParams.set("searchField", this.searchField);
    if (this.searchTerm) url.searchParams.set("searchTerm", this.searchTerm);
    url.searchParams.set("limit", "20");
    url.searchParams.set("offset", `${(index - 1) * 20}`);
    return url;
  }

  computeBefore(page, pages) {
    return page > 1;
  }

  computeNext(page, pages) {
    return page < pages;
  }

  computeHasPage(itemsLength, total) {
    return itemsLength < total;
  }

  observePageCount(page, limit, total) {
    if (limit && total) {
      this.pages = Math.ceil(total / limit);
    }

    if (page && limit && total) {
      let items = [];
      let firstIndex = this._firstIndex(page, this.size);
      let lastIndex = this._lastIndex(page, this.size);

      for (var num = firstIndex; num <= lastIndex; num++) {
        items.push(num);
      }
      this.items = items;
    }
  }

  onPageChange(newValue, oldValue) {
    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: { newPage: newValue, oldPage: oldValue },
      }),
    );
  }

  _firstIndex(page, size) {
    let index = page - size;
    if (index < 1) {
      return 1;
    } else {
      return index;
    }
  }

  _lastIndex(page, size) {
    let index = parseInt(page) + parseInt(size);
    if (index > this.pages) {
      return this.pages;
    } else {
      return index;
    }
  }

  onChange(item) {
    this.page = item;
  }

  onBefore() {
    this.page = this.page > 0 ? this.page - 1 : 1;
  }

  onNext() {
    this.page = this.page < this.pages ? parseInt(this.page) + 1 : this.pages;
  }

  onBegin() {
    this.page = 1;
  }

  onEnd() {
    this.page = this.pages;
  }
}

customElements.define("lit-pagination", LitPagination);
