# 🚀 Quick Start Guide - Finance Dashboard

## ⚡ 5-Minute Setup

### 1. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000`

### 2. You're Done! 🎉
The dashboard loads with mock transactions automatically.

---

## 🎮 Quick Interactions

### Switch Roles
```
Header → [Viewer] [Admin] buttons
Switch between Viewer (view-only) and Admin (can edit/delete)
```

### Toggle Dark Mode
```
Header → Sun/Moon icon
Preference saves automatically
```

### Add Transaction (Admin Only)
```
1. Click "Add Transaction" button
2. Fill out the modal form
3. Click "Add" to save
4. Modal closes and table updates
```

### Search Transactions
```
1. Click in the search box
2. Type description, category, or amount
3. Table filters in real-time
4. Results show matching transactions
```

### Filter Transactions
```
1. Click "All Types" dropdown → Select "Income" or "Expense"
2. Click "All Categories" dropdown → Select a category
3. Combine with search for multiple filters
4. Click "Reset" to clear all filters
```

### Sort Transactions
```
1. Select "Sort by Date" or "Sort by Amount"
2. Click ↑ (Ascending) or ↓ (Descending) icon
3. Table reorders instantly
```

### Export Data
```
CSV:  Click "CSV" button → Downloads file
JSON: Click "JSON" button → Downloads file
```

---

## 📁 Key Files for Development

### Core State Management
- **`context/app-context.tsx`** - All state and context hooks
  - Get state: `const { transactions, role } = useApp()`
  - Add transaction: `addTransaction(newTransaction)`

### Custom Hooks
- **`hooks/useDashboard.ts`** - Calculation hooks
  - `useDashboardSummary()` - Get balance/income/expenses
  - `useCategoryBreakdown()` - Get spending by category
  - `useFilteredTransactions()` - Filter & sort

### Components
- **`components/custom/Charts/Charts.tsx`** - Chart components
- **`components/custom/TransactionTable/TransactionTable.tsx`** - Table with filters
- **`components/custom/Insights/Insights.tsx`** - Financial insights cards
- **`components/screens/DashBoard/DashBoard.tsx`** - Main dashboard

### Types
- **`types/finance.ts`** - All TypeScript interfaces and types

### Utilities
- **`utils/helpers.ts`** - Helper functions for formatting and export

### Mock Data
- **`constant/mockData.ts`** - Sample transactions and categories

---

## 🔧 Common Tasks

### Add a New Category
Edit `constant/mockData.ts`:
```ts
export const SPENDING_CATEGORIES = [
  "Groceries",
  "Entertainment",
  "NEW_CATEGORY",  // ← Add here
  // ...
];
```

### Change Initial Data
Edit `constant/mockData.ts` → `MOCK_TRANSACTIONS` array

### Add a New Chart Type
1. Create chart component in `components/custom/Charts/`
2. Add to `components/screens/DashBoard/DashBoard.tsx`
3. Pass data and props

### Create New Page
1. Create file in `app/` directory
2. Import DashBoardHOC or create new screen component
3. Add navigation link

### Add New Insight Card
Edit `components/custom/Insights/Insights.tsx`:
```tsx
<div className="bg-white dark:bg-slate-800 rounded-lg border...">
  {/* Your insight card here */}
</div>
```

---

## 🎨 Styling Quick Reference

### Dark Mode Classes
```tsx
// Light mode (default)
className="bg-white text-gray-900"

// Dark mode
className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
```

### Color Classes by Type
```tsx
// Income
className="text-green-600 dark:text-green-400"

// Expense
className="text-red-600 dark:text-red-400"

// Balance
className="text-blue-600 dark:text-blue-400"
```

### Responsive Classes
```tsx
// Mobile first
<div className="
  w-full                  // 100% width
  md:w-1/2               // 50% width on tablet
  lg:w-1/3               // 33% width on desktop
  grid
  grid-cols-1            // 1 column on mobile
  md:grid-cols-2         // 2 columns on tablet
  lg:grid-cols-3         // 3 columns on desktop
">
```

---

## 📊 Data Flow

```
AppContext (Global State)
    ↓
useApp() Hook (in components)
    ↓
Component State
    ↓
Custom Hooks (useDashboard, etc)
    ↓
Memoized Calculations
    ↓
Render Components
    ↓
LocalStorage (auto-saved)
```

---

## 🔐 Authentication Notes

**Current Implementation**: Frontend-only with role toggling
- No real authentication
- Role selected via UI toggle
- Persists to localStorage

**For Production**:
- Add real authentication (JWT, OAuth)
- Get user role from backend
- Validate permissions server-side

---

## 📱 Testing the Layout

### Mobile Testing
```bash
# Option 1: Chrome DevTools
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
Set viewport: iPhone 12 (390x844)

# Option 2: Responsive Design
npm run dev → Visit on phone on same network
```

### Test Breakpoints
- **Mobile**: 375px
- **Tablet**: 768px
- **Desktop**: 1024px+

---

## 🐛 Debugging Tips

### Check Console
```bash
# Open Chrome DevTools
F12 → Console tab
```

### Check LocalStorage
```bash
# In console
localStorage.getItem('finance_transactions')
localStorage.getItem('finance_role')
localStorage.getItem('finance_darkMode')

# Clear all data
localStorage.clear()
```

### Check React State
```bash
# Visit in browser and open DevTools
React DevTools → Components tab
Click component → Inspect props and state
```

### Check Network
```bash
# DevTools → Network tab
# No network requests should be visible
# (All data is local/localStorage)
```

---

## 🎯 Next Steps

1. **Review Code**: Start with `components/screens/DashBoard/DashBoard.tsx`
2. **Read Types**: Check `types/finance.ts` for data structures
3. **Explore Hooks**: Study `hooks/useDashboard.ts`
4. **Test Features**: Try each feature in the UI
5. **Customize**: Add your own preferences/colors/categories

---

## 🚀 Deployment Checklist

- [ ] Update meta tags in `app/layout.tsx`
- [ ] Add real authentication (if needed)
- [ ] Connect to backend API (if needed)
- [ ] Test on multiple devices
- [ ] Optimize images/assets
- [ ] Run `npm run build` and check for errors
- [ ] Deploy to Vercel or your hosting service

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Data not saving | Check localStorage in DevTools; Clear and reload |
| Dark mode not working | Check `<html>` element has `dark` class |
| Filters not working | Verify transaction structure in console |
| Charts blank | Ensure transactions exist; Check console errors |
| Modal not opening | Check z-index values; Verify modal context |
| Export button missing | Check transaction count; Require > 0 transactions |

---

**Happy Building! 🎉**

For detailed feature documentation, see [FEATURES.md](FEATURES.md)
For full setup guide, see [README.md](README.md)
