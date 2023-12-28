// modified version of this: https://github.com/Klaudeta/lit-pagination
import {
  html,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

class LitPagination extends LitElement {
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
    // default values
    this.limit = 20;
    this.page = 1;
    this.size = 2;
    this.items = [];
    this.total = 20;
    this.sortDir = "";
    this.sortField = "";
    this.searchField = "";
    this.searchTerm = "";
    this.hasBefore = this.computeBefore(this.page, this.pages);
    this.hasNext = this.computeNext(this.page, this.pages);
    this.hasPages = this.computeHasPage(this.items.length, this.total);
    this.iconSize = "12px";
  }

  set page(val) {
    this._page = Math.ceil(val);
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
      <link href="/styles/lit-pagination.css" rel="stylesheet" />
      <div id="lit-pagination-container">
        <button
          @click=${() => this.onBegin()}
        >
          <img
            alt="show first pagination buttons"
            width="${this.iconSize}"
            src="/icons/double-chevron-left.svg"
          />
        </button>
        <button
          @click=${() => this.onBefore()}
        >
          <img
            alt="shift pagination buttons back by one"
            width="${this.iconSize}"
            src="/icons/chevron-left.svg"
          />
        </button>
        <span>Page</span>
        <div class="page-button-container"
        ">
        ${this.items.map((item) => {
          return html`
            <button
              class=${this.offset === (item - 1) * 20
                ? "lit-pagination-btn active"
                : "lit-pagination-btn"}
              hx-on="click: () => this.onChange(item)"
              hx-get="${this.createUrl(item)}"
              hx-push-url="true"
              hx-target="#table"
            >
              ${item}
            </button>
          `;
        })}
      </div>

      <span>of</span>
      ${this.pages}
      <button
        @click=${() => this.onNext()}
      >
        <img
          alt="shift pagination buttons forward by one"
          width="${this.iconSize}"
          src="/icons/chevron-right.svg"
        />
      </button>
      <button
        @click=${() => this.onEnd()}
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

  updated(changedProps) {
    if (changedProps.get("page") !== this.page) {
      const pagination = htmx.find("lit-pagination");
      htmx.process(pagination);
      super.update(changedProps);
    }
  }

  createRenderRoot() {
    // this disables the shadow dom
    return this;
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

      for (let num = firstIndex; num <= lastIndex; num++) {
        items.push(num);
      }
      this.items = items;
    }
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
    let index = Math.ceil(page) + Math.ceil(size);
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
    this.makePaginationRequest();
  }

  makePaginationRequest() {
    const btns = document.querySelectorAll(".lit-pagination-btn");
    btns.forEach((btn) => {
      if (btn.innerText === `${this.page}`) {
        btn.click();
      }
    });
  }

  onNext() {
    this.page = this.page < this.pages ? Math.ceil(this.page) + 1 : this.pages;
    this.makePaginationRequest();
  }

  onBegin() {
    this.page = 1;
  }

  onEnd() {
    this.page = this.pages;
  }
}

customElements.define("lit-pagination", LitPagination);
