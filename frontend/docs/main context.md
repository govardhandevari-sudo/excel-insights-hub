# Project Report Implementation Architecture Context

## 1️⃣ Project Stack

Frontend:
- React (Vite)
- Tailwind
- shadcn/ui
- recharts
- lucide-react

Backend:
- Node.js (Express)
- MVC architecture (controller → model → DB)
- MySQL
- Server-side pagination, search, filtering

Database:
- Monetary values stored in rupees
- Reporting must convert and return in Lakhs (divide by 100000)
- Dates stored in proper DATE/DATETIME format
- Never store formatted currency in DB

---

## 2️⃣ Implementation Philosophy

All reports must follow:

- Schema-first understanding
- Git repo code review before assumptions
- UI page (PDF or live URL) must be analyzed before writing APIs
- Backend and frontend implemented in phases
- One report at a time
- No deviation from architecture unless discussed

---

## 3️⃣ Standard API Response Format (MANDATORY)

All report APIs must return:

{
  success: true,
  message: "Success",
  data: {
    rows: [],
    pagination: {
      page,
      perPage,
      totalRecords,
      totalPages
    }
  }
}

Summary APIs:

{
  success: true,
  message: "Success",
  data: {
    summary: { ... }
  }
}

Filters API:

{
  success: true,
  message: "Success",
  data: {
    filters: {
      states: [],
      cities: [],
      centres: []
    }
  }
}

---

## 4️⃣ Backend Rules

### Architecture
- MVC pattern
- models/*.model.js
- controllers/*.controller.js
- routes/*.routes.js
- No business logic inside routes
- No SQL inside controller

### Reporting Rules
- All monetary values returned in Lakhs
- Do not ROUND inside nested SUM
- Use SUM() first, then divide by 100000
- Avoid invalid GROUP functions
- Always optimize queries (EXPLAIN friendly)

### Pagination
- Server-side only
- Accept page + perPage
- Return totalRecords
- Do NOT paginate on frontend

### Search
- Server-side only
- Accept search query param
- Should search across required columns
- Should reset to page 1 on new search

### Export
- Export must respect:
  - date range
  - filters
  - search
- Must NOT export total data ignoring filters
- XLSX preferred (ExcelJS)
- Include date range in header
- Include grand total
- Apply minimal styling
- No client-side export

---

## 5️⃣ Frontend Report Layout Standard

Each report must follow layout:

PageHeader
ReportFilters
KPI Row (if applicable)
Charts Section
DataTable Section

---

## 6️⃣ ReportFilters Rules

- Reusable dynamic dropdowns
- Searchable dropdown if > 10 items
- Sticky search input
- Date range picker with presets:
  - Last 7 days
  - Last 1 month
  - Last 3 months
  - This month
  - This year
- Mobile friendly
- Date range must have Apply/Cancel
- Defaults to last 3 months
- Clearing state resets dependent dropdowns

---

## 7️⃣ DataTable Rules

- Server-side pagination
- Server-side search (submit button based)
- Enter key triggers search
- Disable search button if unchanged
- Show spinner while loading
- Rows per page selectable
- Export button small icon-based
- Global search must call API (not local filtering)

---

## 8️⃣ Chart Rules

- Use recharts
- Active legend toggling must NOT remove legend
- Legend items should toggle visibility only
- Prevent disabling last active series
- Values displayed in Lakhs
- Y axis formatted as ₹XL
- Sticky Y-axis if horizontally scrollable
- Dynamic bar width based on data size
- Horizontal scroll for large datasets
- Pie chart animated
- Charts must handle large dataset gracefully

---

## 9️⃣ Monetary Rules (MANDATORY)

- All report monetary numbers are in Lakhs
- Never mix rupees and lakhs in UI
- Always format as:

₹{value}L

Example:
₹25.4L

---

## 🔟 Workflow For New Report

1. Understand UI page (PDF or URL)
2. Identify:
   - Required KPIs
   - Required filters
   - Required charts
   - Required table columns
3. Review schema
4. Design API endpoints
5. Implement backend first
6. Test with Postman
7. Integrate frontend
8. Test filters, search, export
9. Optimize query if slow

---

## 1️⃣1️⃣ Git Repo Review Requirement

Before writing APIs:
- Review existing frontend code from Git
- Check how components structured
- Maintain consistent naming conventions
- Follow existing folder structure

Do not assume structure — inspect first.

---

## 1️⃣2️⃣ Performance Rules

- Avoid N+1 queries
- Use proper indexing
- Use SQL grouping correctly
- Avoid nested aggregation errors
- Avoid sending unnecessary fields
- Avoid client heavy computation
- Keep charts performant

---

## 1️⃣3️⃣ Code Standards

- Clear naming
- No unused state
- No duplicate API calls
- No unnecessary re-renders
- Keep useEffect dependency clean
- Always handle null safely
- Always protect against undefined arrays

---

## 1️⃣4️⃣ Development Discipline

- One report at a time
- Finish backend fully before frontend
- Confirm API format before integrating
- No UI redesign unless required
- No breaking architecture decisions

---

End of Context
