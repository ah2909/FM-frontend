# CryptoFolio Comprehensive Test Plan

## Application Overview

CryptoFolio is a Next.js 16 crypto portfolio tracker built with React 19, shadcn/ui, and Redux RTK Query. It has two route groups: public routes (login, register, welcome) and protected routes (dashboard, portfolios, transactions, exchanges, analyze). Authentication is cookie-based using an HttpOnly refreshToken cookie and an in-memory access token. Protected routes are guarded by both edge middleware (refreshToken cookie check) and a client-side AuthGuard in ProtectedShell. The app supports Google One Tap OAuth as well as email/password login. The UI is responsive: desktop uses a collapsible sidebar, mobile uses a bottom navigation bar and pull-to-refresh. Real-time price data is delivered via WebSocket. Key features include portfolio CRUD, token management with CoinGecko autocomplete, transaction history (per-token with unrealized P&L), exchange connection via API keys (Binance, Bybit, OKX), CSV transaction import, AI-powered portfolio analysis via Google Gemini, and a notification bell for recent activity. NOTE: Google One Tap OAuth cannot be tested end-to-end in an automated browser context due to third-party popup constraints; those steps must be executed manually or with a mock. Credential requirement: a valid registered account is needed to access all protected routes.

## Test Scenarios

### 1. Authentication — Public Routes

**Seed:** `seed.spec.ts`

#### 1.1. Login page renders all expected elements

**File:** `tests/auth/login-page-elements.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: The page title area shows 'Welcome back'
    - expect: A 'Sign in with Google' button is visible
    - expect: An 'Or continue with' divider is visible
    - expect: An Email input field is visible
    - expect: A Password input field is visible
    - expect: A 'Login' submit button is visible
    - expect: A 'Sign up' link pointing to /register is visible
    - expect: A 'Forgot your password?' link is visible
    - expect: A Terms of Service and Privacy Policy disclaimer is visible at the bottom

#### 1.2. Login form client-side validation — empty submission

**File:** `tests/auth/login-validation-empty.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: Login page is displayed
  2. Click the 'Login' button without entering any values
    - expect: Inline validation errors appear: 'Invalid email address' under the Email field and 'Password must be at least 6 characters' under the Password field
    - expect: No network request is made
    - expect: The user remains on /login

#### 1.3. Login form client-side validation — invalid email format

**File:** `tests/auth/login-validation-email.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: Login page is displayed
  2. Type 'notanemail' into the Email field and 'password123' into the Password field, then click 'Login'
    - expect: The error message 'Invalid email address' appears under the Email field
    - expect: No network request is made
    - expect: The user remains on /login

#### 1.4. Login form client-side validation — short password

**File:** `tests/auth/login-validation-password.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: Login page is displayed
  2. Type 'test@example.com' into the Email field and 'abc' (3 characters) into the Password field, then click 'Login'
    - expect: The error message 'Password must be at least 6 characters' appears under the Password field
    - expect: No network request is made
    - expect: The user remains on /login

#### 1.5. Login with invalid credentials shows error toast

**File:** `tests/auth/login-invalid-credentials.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: Login page is displayed
  2. Type 'wrong@example.com' into the Email field and 'wrongpassword' into the Password field, then click 'Login'
    - expect: The button shows 'Logging in...' and is disabled while the request is in-flight
  3. Wait for the request to complete
    - expect: A red error toast notification with the text 'Login failed. Please try again.' appears in the top-right corner
    - expect: The user remains on /login

#### 1.6. Successful login redirects to dashboard

**File:** `tests/auth/login-success.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: Login page is displayed
  2. Type a valid registered email into the Email field and its correct password into the Password field, then click 'Login'
    - expect: The button shows 'Logging in...' while submitting
  3. Wait for the redirect to complete
    - expect: The browser URL changes to http://localhost:3000/
    - expect: The dashboard page is displayed with the heading 'Dashboard'
    - expect: The sidebar shows the user's name and email in the footer
    - expect: A transaction sync status indicator ('Syncing...' or 'Synced') is visible

#### 1.7. Google One Tap button is clickable (manual/smoke only)

**File:** `tests/auth/login-google-onetap-smoke.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: The 'Sign in with Google' button is rendered and not disabled
  2. Click the 'Sign in with Google' button
    - expect: The Google One Tap prompt attempts to render (may be blocked by browser automation restrictions)
    - expect: No JavaScript error appears in the console from within the app code

#### 1.8. Register page renders all expected elements

**File:** `tests/auth/register-page-elements.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/register
    - expect: The page title shows 'Sign up'
    - expect: A 'Continue with Google' button is visible
    - expect: An 'Or sign up with' divider is visible
    - expect: A 'Full name' input field is visible
    - expect: An 'Email' input field is visible
    - expect: A 'Password' input field is visible
    - expect: A 'Register' submit button is visible
    - expect: A Terms of Service and Privacy Policy disclaimer is visible at the bottom

#### 1.9. Register form client-side validation — empty submission

**File:** `tests/auth/register-validation-empty.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/register
    - expect: Register page is displayed
  2. Click the 'Register' button without filling in any fields
    - expect: Inline validation errors appear: 'Full name is required' under Full name, 'Invalid email address' under Email, 'Password must be at least 6 characters' under Password
    - expect: The user remains on /register

#### 1.10. Register form validation — invalid email and short password

**File:** `tests/auth/register-validation-fields.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/register
    - expect: Register page is displayed
  2. Type 'John' into Full name, 'bademail' into Email, and 'abc' into Password, then click 'Register'
    - expect: Error 'Invalid email address' appears under Email
    - expect: Error 'Password must be at least 6 characters' appears under Password
    - expect: No network request is made

#### 1.11. Successful registration redirects to login with success toast

**File:** `tests/auth/register-success.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/register
    - expect: Register page is displayed
  2. Enter a unique full name, a unique email address, and a password of at least 6 characters, then click 'Register'
    - expect: The button shows 'Loading...' while submitting
  3. Wait for the submission to complete
    - expect: A green success toast 'Register Successful!' appears
    - expect: The browser redirects to /login

#### 1.12. Register with duplicate email shows error toast

**File:** `tests/auth/register-duplicate-email.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/register
    - expect: Register page is displayed
  2. Enter a full name, an email address already registered in the system, and a valid password, then click 'Register'
    - expect: A red error toast 'Registration failed. Please try again.' appears
    - expect: The user remains on /register

#### 1.13. Navigation link from login to register

**File:** `tests/auth/login-to-register-link.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: Login page is displayed
  2. Click the 'Sign up' link
    - expect: The browser navigates to /register
    - expect: The register page is displayed with the 'Sign up' heading

#### 1.14. Welcome page renders correctly (unauthenticated access)

**File:** `tests/auth/welcome-page.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/welcome
    - expect: The page heading 'Welcome to Your Crypto Journey' is visible
    - expect: The subtitle 'Track, analyze, and optimize your cryptocurrency investments in one place.' is displayed
    - expect: The 'Create Portfolio' button is visible linking to /portfolios/new
    - expect: Three feature bullet points are visible: 'Track all your crypto assets in one place', 'Monitor performance with real-time data', 'Analyze your investment strategy'
    - expect: The amber info box about creating a first portfolio is visible

### 2. Protected Route Guards

**Seed:** `seed.spec.ts`

#### 2.1. Unauthenticated user is redirected from dashboard to login

**File:** `tests/guards/redirect-dashboard.spec.ts`

**Steps:**
  1. Ensure no authentication cookies are set (use a fresh browser context with no session), then navigate to http://localhost:3000/
    - expect: The browser is redirected to /login before the page content renders
    - expect: The login page is displayed

#### 2.2. Unauthenticated user is redirected from /portfolios to login

**File:** `tests/guards/redirect-portfolios.spec.ts`

**Steps:**
  1. With no session cookies set, navigate directly to http://localhost:3000/portfolios
    - expect: The browser redirects to /login
    - expect: The login page is displayed

#### 2.3. Unauthenticated user is redirected from /exchanges to login

**File:** `tests/guards/redirect-exchanges.spec.ts`

**Steps:**
  1. With no session cookies set, navigate directly to http://localhost:3000/exchanges
    - expect: The browser redirects to /login
    - expect: The login page is displayed

#### 2.4. Unauthenticated user is redirected from /analyze to login

**File:** `tests/guards/redirect-analyze.spec.ts`

**Steps:**
  1. With no session cookies set, navigate directly to http://localhost:3000/analyze
    - expect: The browser redirects to /login
    - expect: The login page is displayed

#### 2.5. Unauthenticated user is redirected from /transactions to login

**File:** `tests/guards/redirect-transactions.spec.ts`

**Steps:**
  1. With no session cookies set, navigate directly to http://localhost:3000/transactions
    - expect: The browser redirects to /login
    - expect: The login page is displayed

#### 2.6. Session loading state shows spinner before auth resolves

**File:** `tests/guards/auth-loading-state.spec.ts`

**Steps:**
  1. With a valid session, navigate to http://localhost:3000/ and observe the initial render while the AuthContext boot-time refresh call is in-flight
    - expect: A centered spinner with the text 'Securing your session...' is briefly displayed before the dashboard content appears
    - expect: After the token refresh completes and the user object is hydrated, the spinner disappears and the full dashboard renders

#### 2.7. Token revocation mid-session triggers redirect to login (client-side AuthGuard)

**File:** `tests/guards/mid-session-revocation.spec.ts`

**Steps:**
  1. Log in successfully and navigate to the dashboard
    - expect: Dashboard is displayed
  2. Simulate token expiry/revocation by clearing the refreshToken HttpOnly cookie via browser dev tools or a test helper endpoint, then navigate to /portfolios
    - expect: The AuthGuard detects the missing user state and redirects to /login
    - expect: The login page is displayed

### 3. Navigation & Layout

**Seed:** `seed.spec.ts`

#### 3.1. Desktop sidebar navigation links work correctly

**File:** `tests/navigation/desktop-sidebar.spec.ts`

**Steps:**
  1. Log in and view the app on a desktop viewport (width >= 1024px)
    - expect: The left sidebar is visible with the CryptoFolio logo/brand at the top
    - expect: Four navigation items are visible: Dashboard, Portfolios, Exchanges, Analyze
  2. Click 'Dashboard' in the sidebar
    - expect: The browser navigates to / and the Dashboard heading is shown
    - expect: The Dashboard item is highlighted as active in the sidebar
  3. Click 'Portfolios' in the sidebar
    - expect: The browser navigates to /portfolios
    - expect: The Portfolios item is highlighted as active
  4. Click 'Exchanges' in the sidebar
    - expect: The browser navigates to /exchanges
    - expect: The Exchanges item is highlighted as active
  5. Click 'Analyze' in the sidebar
    - expect: The browser navigates to /analyze
    - expect: The Analyze item is highlighted as active

#### 3.2. Sidebar collapse toggle works on desktop

**File:** `tests/navigation/sidebar-collapse.spec.ts`

**Steps:**
  1. Log in and view the app on a desktop viewport. Locate the sidebar toggle button (SidebarTrigger) in the top header
    - expect: The sidebar is expanded by default showing navigation labels
  2. Click the sidebar toggle button
    - expect: The sidebar collapses to a narrow icon-only state or fully hides, depending on the sidebar variant
    - expect: Main content area expands to fill the freed space
  3. Click the sidebar toggle button again
    - expect: The sidebar expands back to its full state with labels visible

#### 3.3. User info is displayed in sidebar footer

**File:** `tests/navigation/sidebar-user-info.spec.ts`

**Steps:**
  1. Log in with a valid account and view the desktop sidebar
    - expect: The sidebar footer shows the logged-in user's avatar or initials
    - expect: The user's full name is displayed
    - expect: The user's email address is displayed below the name

#### 3.4. Desktop header breadcrumb reflects current route

**File:** `tests/navigation/breadcrumb.spec.ts`

**Steps:**
  1. Log in and navigate to /portfolios
    - expect: The top header breadcrumb shows 'Portfolios' as the current page
  2. Navigate to /portfolios/new
    - expect: The breadcrumb shows 'Portfolios' as a clickable link followed by 'New' as the current page
  3. Navigate to /exchanges
    - expect: The breadcrumb shows 'Exchanges'

#### 3.5. Mobile bottom navigation links work correctly

**File:** `tests/navigation/mobile-bottom-nav.spec.ts`

**Steps:**
  1. Log in and resize the viewport to a mobile width (e.g., 390px wide). Confirm the bottom navigation bar is visible
    - expect: Four bottom nav items are visible: Home, Portfolios, Exchanges, Analyze
  2. Tap 'Home' in the bottom nav
    - expect: The app navigates to / and the Home icon is highlighted as active
  3. Tap 'Portfolios' in the bottom nav
    - expect: The app navigates to /portfolios and Portfolios is highlighted as active
  4. Tap 'Exchanges' in the bottom nav
    - expect: The app navigates to /exchanges and Exchanges is highlighted as active
  5. Tap 'Analyze' in the bottom nav
    - expect: The app navigates to /analyze and Analyze is highlighted as active

#### 3.6. Dark/light mode toggle works

**File:** `tests/navigation/dark-mode-toggle.spec.ts`

**Steps:**
  1. Log in and locate the ModeToggle button in the top-right header area
    - expect: The mode toggle button is visible
  2. Click the mode toggle to switch to dark mode
    - expect: The page theme changes to dark mode (dark background, light text)
    - expect: The toggle state updates to indicate dark mode
  3. Click the mode toggle again to switch to light mode
    - expect: The page theme reverts to light mode

#### 3.7. Notification bell opens popover with notification list

**File:** `tests/navigation/notification-bell.spec.ts`

**Steps:**
  1. Log in and locate the notification bell icon in the top header
    - expect: The bell icon is visible; a blue badge with unread count appears if there are unread notifications
  2. Click the notification bell
    - expect: A popover panel opens showing 'Notifications' as the heading
    - expect: If notifications exist: a list of activity items is shown, each with a coin avatar, activity type icon, description and timestamp
    - expect: If no notifications exist: 'All caught up!' and 'No notifications yet' placeholder are displayed
    - expect: If unread count > 0: a 'Mark all read' button is visible
  3. Click a single unread notification item
    - expect: The notification's blue unread indicator dot disappears
    - expect: The item background changes from the blue-tinted unread state to the neutral read state
    - expect: The unread count badge on the bell decrements by 1
  4. Click 'Mark all read' (if visible)
    - expect: All notification items switch to the read visual state
    - expect: The unread badge on the bell disappears

### 4. Dashboard

**Seed:** `seed.spec.ts`

#### 4.1. Dashboard redirects to /welcome when user has no portfolios

**File:** `tests/dashboard/no-portfolio-redirect.spec.ts`

**Steps:**
  1. Log in with an account that has no portfolios created, then navigate to /
    - expect: The dashboard briefly shows skeleton loaders while fetching portfolio data
    - expect: Once the API returns an empty portfolio list, the browser redirects to /welcome
    - expect: The welcome page is displayed with the 'Create Portfolio' button

#### 4.2. Dashboard displays portfolio performance chart with timeframe tabs

**File:** `tests/dashboard/portfolio-chart.spec.ts`

**Steps:**
  1. Log in with an account that has at least one portfolio with tokens, navigate to /
    - expect: A 'Portfolio Performance' card is visible
    - expect: The total portfolio value (e.g., '$12,345.67') is displayed in large text
    - expect: A gain/loss badge (TrendingUp or TrendingDown with percentage) is shown if balance history data exists
    - expect: Three timeframe tabs are visible: 1W, 1M, 1Y, with '1W' active by default
  2. Click the '1M' tab
    - expect: The chart re-renders with 1-month data
    - expect: The '1M' tab is now in the active state
  3. Click the '1Y' tab
    - expect: The chart re-renders with 1-year data
    - expect: The '1Y' tab is now in the active state

#### 4.3. Dashboard displays portfolio allocation donut chart

**File:** `tests/dashboard/portfolio-allocation.spec.ts`

**Steps:**
  1. Log in with a portfolio containing multiple tokens and navigate to /
    - expect: A portfolio allocation panel is visible alongside the performance chart
    - expect: The panel shows a donut/pie chart representing asset allocation percentages
    - expect: Each token slice is labeled or has a corresponding legend entry

#### 4.4. Dashboard displays Top Holdings table

**File:** `tests/dashboard/top-holdings.spec.ts`

**Steps:**
  1. Log in with a portfolio containing at least one token and navigate to /
    - expect: A 'Top Holdings' card is visible
    - expect: The card shows up to 5 tokens with their name, symbol, and value
    - expect: A description showing 'Showing top N of M assets' is displayed
    - expect: A 'View all' link pointing to /portfolios is visible
  2. Click 'View all'
    - expect: The browser navigates to /portfolios

#### 4.5. Dashboard shows skeleton loaders during data fetch

**File:** `tests/dashboard/skeleton-loaders.spec.ts`

**Steps:**
  1. Log in with a portfolio and navigate to /, observing the page during the initial data load (throttle network if needed)
    - expect: Skeleton placeholders are rendered in place of the chart, allocation donut, and asset table while API calls are pending
    - expect: After the data loads, the skeletons are replaced by actual content

#### 4.6. Transaction sync button shows correct states

**File:** `tests/dashboard/transaction-sync-button.spec.ts`

**Steps:**
  1. Log in with a portfolio that has tokens, navigate to /, and observe the TransactionSyncButton in the header area (desktop) or mobile menu
    - expect: The button initially shows 'Syncing...' with a spinning loader icon while the sync API call is in-flight
  2. Wait for the sync to complete
    - expect: If successful: the button shows a green 'Synced' state with a checkmark icon and remains disabled
    - expect: If failed: a red error alert appears with 'Synchronization failed' message and 'Retry Sync' and 'Cancel' buttons
  3. If the error state appears, click 'Retry Sync'
    - expect: The sync restarts and the button returns to the 'Syncing...' state

### 5. Portfolios

**Seed:** `seed.spec.ts`

#### 5.1. Create Portfolio — happy path

**File:** `tests/portfolios/create-portfolio.spec.ts`

**Steps:**
  1. Log in and navigate to /portfolios/new
    - expect: The 'Create Portfolio' page is displayed
    - expect: A form with 'Portfolio Name' and 'Description' fields is visible
    - expect: A 'Create Portfolio' submit button is visible
    - expect: A 'Cancel' button linking back to /portfolios is visible
  2. Type a portfolio name of at least 2 characters (e.g., 'My Holdings') into the Portfolio Name field and optionally type a description
    - expect: The input fields accept the typed text without error
  3. Click 'Create Portfolio'
    - expect: A green success toast 'Your portfolio has been created successfully.' appears
    - expect: The browser redirects to /portfolios

#### 5.2. Create Portfolio — validation: name too short

**File:** `tests/portfolios/create-portfolio-validation.spec.ts`

**Steps:**
  1. Log in and navigate to /portfolios/new
    - expect: Create Portfolio form is displayed
  2. Type a single character 'A' into the Portfolio Name field and click 'Create Portfolio'
    - expect: A field error message 'Portfolio name must be at least 2 characters.' appears under the name field
    - expect: No API call is made
    - expect: The user remains on /portfolios/new

#### 5.3. Create Portfolio — cancel button returns to portfolios list

**File:** `tests/portfolios/create-portfolio-cancel.spec.ts`

**Steps:**
  1. Log in and navigate to /portfolios/new
    - expect: Create Portfolio form is displayed
  2. Click the 'Cancel' button
    - expect: The browser navigates to /portfolios

#### 5.4. Portfolio page displays token list with search

**File:** `tests/portfolios/portfolio-tokens-display.spec.ts`

**Steps:**
  1. Log in with a portfolio containing multiple tokens and navigate to /portfolios
    - expect: The page header shows the portfolio name and description
    - expect: A 'Portfolio Tokens' card is visible showing all tokens in a table (desktop) or card list (mobile)
    - expect: Each token row shows: name, symbol, portfolio allocation %, price, 24h change %, value, unrealized P&L, and an actions menu
  2. Type a known token symbol (e.g., 'BTC') into the search input
    - expect: The token list filters to show only tokens matching the query
    - expect: Non-matching tokens are hidden
  3. Clear the search input
    - expect: All tokens are shown again
  4. Type a query that matches no tokens (e.g., 'ZZZZZ')
    - expect: The message 'No assets found matching your search.' is displayed

#### 5.5. Portfolio page — empty portfolio shows empty state

**File:** `tests/portfolios/portfolio-empty-state.spec.ts`

**Steps:**
  1. Log in with an account that has a portfolio with zero tokens, navigate to /portfolios
    - expect: The 'Portfolio Tokens' card is shown
    - expect: The message 'No tokens in this portfolio yet.' is displayed
    - expect: No table rows are visible

#### 5.6. Edit Portfolio — happy path

**File:** `tests/portfolios/edit-portfolio.spec.ts`

**Steps:**
  1. Log in with an existing portfolio and navigate to /portfolios/edit
    - expect: The 'Edit Portfolio' page is displayed
    - expect: The form is pre-populated with the current portfolio name and description
    - expect: An 'Update Portfolio' button and a 'Cancel' button are visible
  2. Clear the Portfolio Name field and type a new name of at least 2 characters (e.g., 'Updated Portfolio')
    - expect: The name field updates
  3. Click 'Update Portfolio'
    - expect: A green success toast 'Your portfolio has been updated successfully.' appears
    - expect: The browser redirects to /portfolios
    - expect: The portfolio heading on /portfolios reflects the updated name

#### 5.7. Edit Portfolio — validation: name too short

**File:** `tests/portfolios/edit-portfolio-validation.spec.ts`

**Steps:**
  1. Log in and navigate to /portfolios/edit
    - expect: Edit Portfolio form is displayed with existing values
  2. Clear the Portfolio Name field, type 'X' (1 character), and click 'Update Portfolio'
    - expect: Error 'Portfolio name must be at least 2 characters.' appears under the name field
    - expect: No network request is made

#### 5.8. Add Token — happy path with autocomplete selection

**File:** `tests/portfolios/add-token.spec.ts`

**Steps:**
  1. Log in and navigate to /portfolios/add-token
    - expect: The 'Add Token' page is displayed
    - expect: A 'Token Symbol' field with autocomplete and an 'Amount' field are visible
    - expect: An 'Add Token' submit button is visible
  2. Type 'BTC' into the Token Symbol field and wait 500ms for the debounced CoinGecko API search
    - expect: A dropdown list of coin suggestions appears below the input, each showing a coin thumbnail, name, and symbol
  3. Click on 'Bitcoin (BTC)' from the dropdown suggestions
    - expect: The Token Symbol field is set to 'BTC'
    - expect: The suggestions dropdown closes
  4. Type '0.5' into the Amount field and click 'Add Token'
    - expect: A success toast 'The token has been added to your portfolio.' appears
    - expect: The browser navigates to /portfolios

#### 5.9. Add Token — validation: empty fields

**File:** `tests/portfolios/add-token-validation.spec.ts`

**Steps:**
  1. Log in and navigate to /portfolios/add-token
    - expect: Add Token form is displayed
  2. Click 'Add Token' without entering any values
    - expect: Error 'Token symbol is required.' appears under the Token Symbol field
    - expect: Error 'Amount must be a positive number.' appears under the Amount field
    - expect: No API call is made

#### 5.10. Add Token — validation: zero and negative amounts

**File:** `tests/portfolios/add-token-amount-validation.spec.ts`

**Steps:**
  1. Log in and navigate to /portfolios/add-token
    - expect: Add Token form is displayed
  2. Type 'BTC' into the Token Symbol field, type '0' into the Amount field, and click 'Add Token'
    - expect: Error 'Amount must be a positive number.' appears under the Amount field
  3. Change the amount to '-1' and click 'Add Token'
    - expect: Error 'Amount must be a positive number.' still appears

#### 5.11. Add Token — autocomplete with short query (less than 2 chars) shows no results

**File:** `tests/portfolios/add-token-autocomplete-short.spec.ts`

**Steps:**
  1. Log in and navigate to /portfolios/add-token
    - expect: Add Token form is displayed
  2. Type 'B' (single character) into the Token Symbol field and wait 600ms
    - expect: No autocomplete dropdown appears (query is below the 2-character threshold)

#### 5.12. Remove Token — confirmation dialog and successful deletion

**File:** `tests/portfolios/remove-token.spec.ts`

**Steps:**
  1. Log in with a portfolio containing at least one token, navigate to /portfolios
    - expect: The Portfolio Tokens table is displayed with token rows
  2. Click the actions menu (three-dot icon) on any token row and select 'Remove' or the delete option
    - expect: An alert dialog appears with title 'Remove Token?' and description 'This will remove "[TOKEN]" from your portfolio. This action cannot be undone.'
    - expect: A 'Cancel' and a 'Remove Token' button are visible in the dialog
  3. Click 'Cancel' in the dialog
    - expect: The dialog closes
    - expect: The token remains in the portfolio list
  4. Open the actions menu and remove option again, then click 'Remove Token' in the dialog
    - expect: A green toast 'The token has been removed from your portfolio.' appears
    - expect: The token disappears from the portfolio token list

#### 5.13. Portfolio overview statistics are visible when tokens exist

**File:** `tests/portfolios/portfolio-overview.spec.ts`

**Steps:**
  1. Log in with a portfolio that has tokens, navigate to /portfolios
    - expect: A portfolio overview section is rendered above the token table showing aggregate stats (total value, performance metrics)
    - expect: The token count, total value, and any P&L indicators are visible

### 6. Transactions

**Seed:** `seed.spec.ts`

#### 6.1. Transactions page without token ID shows guidance message

**File:** `tests/transactions/no-token-selected.spec.ts`

**Steps:**
  1. Log in with a portfolio that has tokens and navigate to /transactions (without any query parameters)
    - expect: The heading 'Transactions' is displayed
    - expect: The message 'Please select a token to view transactions.' is shown in the content area
    - expect: A TransactionHistoryWarning banner may be visible at the top

#### 6.2. Transactions page with valid token ID shows transaction details

**File:** `tests/transactions/token-transactions.spec.ts`

**Steps:**
  1. Log in with a portfolio where a token has known transactions. Navigate to /portfolios and click on a token to reach /transactions?id=[TOKEN_ID]
    - expect: A summary card at the top shows the token avatar, name, symbol badge, 'Average Buy Price' in USD, and 'Unrealized P&L' amount colored green (profit) or red (loss)
    - expect: The transaction list below shows chronologically sorted entries (newest first)
  2. Observe individual transaction rows (desktop view)
    - expect: Each row shows: token avatar, transaction type badge (BUY/SELL/DEPOSIT/WITHDRAWAL), buy price, quantity and total value, exchange logo and name, and transaction date
    - expect: BUY transactions show green badge; SELL shows red badge; DEPOSIT shows blue badge; WITHDRAWAL shows yellow badge

#### 6.3. Transactions page with invalid token ID shows no-data message

**File:** `tests/transactions/invalid-token-id.spec.ts`

**Steps:**
  1. Log in and navigate to /transactions?id=99999999 (an ID that does not exist in the portfolio)
    - expect: The message 'Please select a token to view transactions.' is displayed
    - expect: No summary card or transaction list is shown

#### 6.4. Transactions page for token with zero transactions shows empty state

**File:** `tests/transactions/empty-transactions.spec.ts`

**Steps:**
  1. Log in with a portfolio where a specific token has zero transactions recorded. Navigate to /transactions?id=[THAT_TOKEN_ID]
    - expect: The message 'No transactions found for [TOKEN_NAME].' is displayed
    - expect: No summary card is shown

#### 6.5. Back button on Transactions page returns to previous page

**File:** `tests/transactions/back-button.spec.ts`

**Steps:**
  1. Log in, navigate to /portfolios, then navigate to /transactions?id=[some_id]
    - expect: The Transactions page is displayed with a 'Back' button in the header
  2. Click the 'Back' button
    - expect: The browser navigates back to /portfolios

#### 6.6. Transaction History Warning banner is visible

**File:** `tests/transactions/history-warning.spec.ts`

**Steps:**
  1. Log in and navigate to /transactions
    - expect: A TransactionHistoryWarning banner is displayed at the top of the transactions content area with relevant informational text about data limitations

#### 6.7. Import page — renders exchange selection tabs

**File:** `tests/transactions/import-exchange-tabs.spec.ts`

**Steps:**
  1. Log in and navigate to /transactions/import
    - expect: The heading 'Import Transaction History' is displayed
    - expect: A 'Select Your Exchange' card is visible with three tabs: Binance, Bybit, OKX
    - expect: Bybit is the default selected tab
  2. Click the 'Binance' tab
    - expect: The Binance tab is now active
    - expect: Content for Binance is shown
  3. Click the 'OKX' tab
    - expect: The OKX tab is now active
    - expect: Content for OKX is shown

#### 6.8. Import page — shows 'No exchanges connected' alert when no exchange is connected

**File:** `tests/transactions/import-no-exchanges.spec.ts`

**Steps:**
  1. Log in with an account that has no connected exchanges and navigate to /transactions/import
    - expect: A blue info alert is displayed with the text 'No exchanges connected'
    - expect: The alert contains a 'Connect Exchanges' button
    - expect: Each exchange tab shows an amber 'not connected' alert with a pulsing amber dot indicator
  2. Click 'Connect Exchanges' inside the alert
    - expect: The browser navigates to /exchanges

#### 6.9. Import page — shows export instructions only for connected exchanges

**File:** `tests/transactions/import-connected-exchange-guide.spec.ts`

**Steps:**
  1. Log in with an account that has Bybit connected and navigate to /transactions/import
    - expect: A green 'Connected Exchanges (1)' status card is shown at the top listing Bybit with its logo
    - expect: Navigating to the Bybit tab shows the step-by-step export instructions and notes
    - expect: The Binance and OKX tabs still show the amber 'not connected' alert for those exchanges

#### 6.10. Import page — CSV file upload area accepts valid CSV

**File:** `tests/transactions/import-csv-upload.spec.ts`

**Steps:**
  1. Log in with an account where at least one supported exchange (not Binance) is connected and navigate to /transactions/import, select that exchange's tab
    - expect: An 'Upload CSV File' card appears below the exchange selection
    - expect: A dashed drag-and-drop zone is visible with 'Drop your CSV file here or click to browse'
  2. Click the upload zone and select a valid .csv file from the file system
    - expect: The upload zone updates to show the file name and file size in MB
    - expect: The 'Import Transactions' button becomes enabled
  3. Attempt to select a non-CSV file (e.g., a .txt or .png file)
    - expect: A red error toast 'Please select a valid CSV file' appears
    - expect: The upload zone does not update to show the file

#### 6.11. Import page — drag and drop CSV file works

**File:** `tests/transactions/import-csv-drag-drop.spec.ts`

**Steps:**
  1. Log in with a connected exchange (non-Binance), navigate to /transactions/import, select that exchange's tab
    - expect: The dashed CSV upload zone is visible
  2. Drag a valid .csv file from the file system and drop it onto the upload zone
    - expect: The upload zone updates to show the file name and size
    - expect: The 'Import Transactions' button becomes enabled
  3. Drag a non-CSV file (e.g., .png) and drop it onto the upload zone
    - expect: A red error toast 'Please drop a valid CSV file' appears

#### 6.12. Import page — Binance CSV upload is blocked (unsupported)

**File:** `tests/transactions/import-binance-unsupported.spec.ts`

**Steps:**
  1. Log in with a Binance exchange connected, navigate to /transactions/import and click the Binance tab
    - expect: Even with Binance connected, no 'Upload CSV File' section appears for Binance
    - expect: The Binance tab notes state 'We do not support with importing Binance CSV file now.'

### 7. Exchanges

**Seed:** `seed.spec.ts`

#### 7.1. Exchanges page renders correctly with no connected exchanges

**File:** `tests/exchanges/no-exchanges.spec.ts`

**Steps:**
  1. Log in with an account that has no connected exchanges and navigate to /exchanges
    - expect: The heading 'Exchanges' is displayed with subtitle 'Connect and manage your cryptocurrency exchange accounts'
    - expect: A 'Your Connected Exchanges' section heading is visible
    - expect: A 'Connect Exchange' button with a Plus icon is visible
    - expect: A card with 'No Connected Exchanges' title and descriptive text is displayed in the content area

#### 7.2. Connect Exchange dialog opens and shows exchange list

**File:** `tests/exchanges/connect-dialog-opens.spec.ts`

**Steps:**
  1. Log in, navigate to /exchanges, and click the 'Connect Exchange' button
    - expect: A modal dialog opens with the title 'Connect Exchange'
    - expect: A blue info note about automatic portfolio updates is displayed
    - expect: A 'Centralized Exchanges' tab is selected by default
    - expect: Exchange cards for Binance, OKX, and Bybit are shown with their logos and names
    - expect: Connected exchanges (if any) have a green border and a green checkmark; unconnected ones have a red X icon

#### 7.3. Clicking an already-connected exchange shows info toast

**File:** `tests/exchanges/click-already-connected.spec.ts`

**Steps:**
  1. Log in with at least one connected exchange, navigate to /exchanges, and click 'Connect Exchange' to open the dialog
    - expect: The already-connected exchange card is highlighted in green
  2. Click the already-connected exchange card
    - expect: The dialog does not switch to the API key entry form
    - expect: An info toast '[Exchange] is already connected' appears

#### 7.4. Connect Exchange — enter API credentials form appears on exchange selection

**File:** `tests/exchanges/api-credentials-form.spec.ts`

**Steps:**
  1. Log in, navigate to /exchanges, click 'Connect Exchange', then click an unconnected exchange (e.g., Bybit)
    - expect: The dialog switches to an API credentials form
    - expect: Fields for 'API Key', 'API Secret', and 'Passphrase (Optional)' are visible
    - expect: A security note 'Your API keys are encrypted and stored securely.' is shown
    - expect: A 'Connect Exchange' submit button and a 'Cancel' button are visible

#### 7.5. Connect Exchange — validation: empty API credentials

**File:** `tests/exchanges/api-credentials-validation.spec.ts`

**Steps:**
  1. Open the Connect Exchange dialog, select an unconnected exchange to reach the credentials form, and click 'Connect Exchange' without entering any credentials
    - expect: Error 'API Key is required' appears under API Key field
    - expect: Error 'API Secret is required' appears under API Secret field
    - expect: No API call is made

#### 7.6. Connect Exchange — invalid API key returns error toast

**File:** `tests/exchanges/invalid-api-key.spec.ts`

**Steps:**
  1. Open the Connect Exchange dialog, select an unconnected exchange, enter invalid/fake API Key and API Secret values, and click 'Connect Exchange'
    - expect: The button shows 'Connecting...' with a spinning icon while the request is in-flight
    - expect: A loading toast 'Connecting to [Exchange]...' appears
  2. Wait for the response
    - expect: If the backend returns a 400 status: a red error toast 'Invalid API Key or Secret' appears
    - expect: The dialog remains open for the user to correct the credentials

#### 7.7. Connect Exchange — cancel returns to exchange list view

**File:** `tests/exchanges/connect-cancel.spec.ts`

**Steps:**
  1. Open the Connect Exchange dialog, select an unconnected exchange to reach the credentials form, and click 'Cancel'
    - expect: The form is dismissed and the dialog returns to the exchange selection list view
    - expect: The selected exchange is deselected

#### 7.8. Successfully connected exchange appears in the main page list

**File:** `tests/exchanges/connected-exchange-list.spec.ts`

**Steps:**
  1. Log in with an account that has at least one connected exchange and navigate to /exchanges
    - expect: The connected exchange(s) are shown in a grid of cards in the 'Your Connected Exchanges' section
    - expect: Each card shows the exchange logo, name, and '✅ Connected and ready' description
    - expect: The 'No Connected Exchanges' empty state card is not shown

### 8. Analyze

**Seed:** `seed.spec.ts`

#### 8.1. Analyze page shows AnalyzingInterface when no analysis data is available

**File:** `tests/analyze/analyzing-interface.spec.ts`

**Steps:**
  1. Log in with an account that has no portfolio analysis data yet (first-time analysis), navigate to /analyze
    - expect: The AnalyzingInterface component is displayed indicating that analysis is being generated or is not yet available

#### 8.2. Analyze page shows loading skeleton while fetching analysis

**File:** `tests/analyze/loading-skeleton.spec.ts`

**Steps:**
  1. Log in with an account that has a portfolio, navigate to /analyze while the API request is in-flight (throttle network if needed)
    - expect: Skeleton loading placeholders are displayed with the text 'Crunching numbers and market data…' instead of actual analysis panels

#### 8.3. Analyze page displays all four summary panels with data

**File:** `tests/analyze/summary-panels.spec.ts`

**Steps:**
  1. Log in with a portfolio that has valid analysis data returned from the API, navigate to /analyze
    - expect: Four panels are visible in the first row: 'Risk Profile', 'Total Value', 'Unrealized P&L', and 'Concentration Analysis'
  2. Verify the Risk Profile panel
    - expect: A risk score gauge is displayed
    - expect: A volatility badge (e.g., 'Volatility: medium') is shown
    - expect: If applicable, overbought assets (red ↑) and oversold assets (blue ↓) are shown
  3. Verify the Total Value panel
    - expect: The current portfolio value is shown in large monospace font
    - expect: The invested amount is shown below
    - expect: Market trend alignment is displayed at the bottom (e.g., 'bullish', 'bearish')
  4. Verify the Unrealized P&L panel
    - expect: The unrealized P&L value is shown in green (positive) or red (negative)
    - expect: A percentage gain/loss is shown
    - expect: A TrendingUp or TrendingDown icon is present

#### 8.4. Analyze page displays Active Alerts panel

**File:** `tests/analyze/active-alerts.spec.ts`

**Steps:**
  1. Log in with a portfolio that has analysis data containing at least one alert, navigate to /analyze
    - expect: The 'Active Alerts' panel is shown in the second row
    - expect: Each alert is displayed as an AlertCard with the asset symbol and alert details
    - expect: A red badge shows the count of active alerts
  2. Verify the behavior when there are zero alerts
    - expect: The panel shows a green badge with '0' and a 'CheckCircle2' icon with the text 'No active alerts'

#### 8.5. Analyze page displays Recommendations panel

**File:** `tests/analyze/recommendations.spec.ts`

**Steps:**
  1. Log in with a portfolio that has analysis with recommendations, navigate to /analyze
    - expect: The 'Recommendations' panel is shown
    - expect: Each recommendation is displayed as a numbered card with the recommendation text
    - expect: Hovering a recommendation card changes its border color to accent/primary

#### 8.6. Analyze page displays Asset Performance panel with best and worst performers

**File:** `tests/analyze/asset-performance.spec.ts`

**Steps:**
  1. Log in with a portfolio that has analysis data containing performer data, navigate to /analyze
    - expect: The 'Asset Performance' panel is shown with two sections: 'Top Performers' and 'Underperformers'
    - expect: Each performer entry shows the asset symbol and performance percentage
  2. Verify empty performer sections
    - expect: If no best or worst performers exist, the text 'No data' is shown in that section

#### 8.7. Analyze page shows Google Gemini AI badge

**File:** `tests/analyze/gemini-badge.spec.ts`

**Steps:**
  1. Log in and navigate to /analyze with analysis data available
    - expect: A badge with a lightning bolt icon and 'Google Gemini' text is visible in the page header (desktop) or mobile menu

### 9. Real-Time & Connectivity

**Seed:** `seed.spec.ts`

#### 9.1. Offline indicator appears when network is lost

**File:** `tests/connectivity/offline-indicator.spec.ts`

**Steps:**
  1. Log in and navigate to any protected page, then simulate network disconnection (e.g., via browser DevTools > Network > Offline)
    - expect: An OfflineIndicator component becomes visible (likely a banner or toast) indicating the user is offline
  2. Restore the network connection
    - expect: The offline indicator disappears or updates to indicate reconnection

#### 9.2. WebSocket real-time price updates on portfolio page

**File:** `tests/connectivity/websocket-price-updates.spec.ts`

**Steps:**
  1. Log in with a portfolio containing at least one token, navigate to /portfolios, and observe the token price column
    - expect: After a short wait (WebSocket connection established), the price values in the token table may update in real time as new ticker data arrives
    - expect: The portfolio total value updates dynamically as individual token prices change via WebSocket

#### 9.3. PWA install prompt appears on supported browsers

**File:** `tests/connectivity/pwa-install-prompt.spec.ts`

**Steps:**
  1. Log in using a browser that supports PWA installation (e.g., Chrome on Android), navigate to any protected page
    - expect: The PWAInstallPrompt component is rendered (it may appear as a bottom sheet or prompt)
    - expect: The user can interact with the prompt to install the app or dismiss it

#### 9.4. Pull-to-refresh on mobile triggers page data reload

**File:** `tests/connectivity/pull-to-refresh.spec.ts`

**Steps:**
  1. Log in on a mobile viewport and navigate to any protected page wrapped in PullToRefresh (all mobile-layout pages)
    - expect: Pulling down at the top of the scrollable content triggers a refresh animation
  2. Complete the pull gesture beyond the threshold
    - expect: The page data is refreshed (API calls are re-triggered)
    - expect: The pull-to-refresh animation completes and the page returns to normal

### 10. Edge Cases & Error Handling

**Seed:** `seed.spec.ts`

#### 10.1. API error on portfolio load shows error feedback

**File:** `tests/edge-cases/api-error-portfolio.spec.ts`

**Steps:**
  1. Log in with a valid session. Simulate a server error on the GET portfolios endpoint (e.g., block the /api/* requests via proxy or DevTools), then navigate to /portfolios
    - expect: The page does not crash with an unhandled exception
    - expect: Either a skeleton remains (indicating the fetch failed silently) or an error toast/message is displayed
    - expect: The user can still interact with the navigation sidebar

#### 10.2. Dashboard portfolio chart handles no balance history gracefully

**File:** `tests/edge-cases/dashboard-no-balance-history.spec.ts`

**Steps:**
  1. Log in with an account whose portfolio has tokens but no historical balance data points in the API response
    - expect: The PortfolioChart renders without crashing (may show an empty chart or no-data placeholder)
    - expect: No GainLossBadge is rendered next to the total value (since there is no previous balance to compare)
    - expect: The total value still displays the current portfolio value

#### 10.3. Add Token — CoinGecko API unavailable shows no suggestions

**File:** `tests/edge-cases/add-token-coingecko-error.spec.ts`

**Steps:**
  1. Log in, navigate to /portfolios/add-token, and simulate a network failure or CoinGecko API error by blocking requests to api.coingecko.com
    - expect: Typing 2+ characters into the Token Symbol field does not show a spinner indefinitely or crash the UI
    - expect: After the fetch attempt fails, the suggestions list is empty
    - expect: No error is thrown to the user in the form itself (error is silently caught)

#### 10.4. Transactions page for token with no price data shows P&L as --

**File:** `tests/edge-cases/transactions-zero-pnl.spec.ts`

**Steps:**
  1. Log in and navigate to /transactions?id=[TOKEN_ID] where the token has avg_price = 0 or value = 0
    - expect: The Unrealized P&L section displays '--' instead of a dollar amount
    - expect: No TrendingUp or TrendingDown icon is shown next to the P&L value

#### 10.5. Edit Portfolio page shows 404 when no portfolio is in Redux state

**File:** `tests/edge-cases/edit-portfolio-no-state.spec.ts`

**Steps:**
  1. Log in and navigate directly to /portfolios/edit without first having visited /portfolios (so the Redux portfolio state is empty/null)
    - expect: The Next.js notFound() function is called and a 404 page is displayed
    - expect: The user is not shown a broken/empty form

#### 10.6. Notification bell shows 99+ when unread count exceeds 99

**File:** `tests/edge-cases/notification-overflow-count.spec.ts`

**Steps:**
  1. Log in with an account that has more than 99 unread notifications
    - expect: The notification badge on the bell icon shows '99+' instead of the exact number

#### 10.7. Import page — no file selected keeps Import button disabled

**File:** `tests/edge-cases/import-button-disabled-no-file.spec.ts`

**Steps:**
  1. Log in with a connected exchange (non-Binance) and navigate to /transactions/import, select that exchange's tab so the upload card appears
    - expect: The 'Import Transactions' button is disabled (grayed out) when no file has been selected
    - expect: The button only becomes enabled after a valid CSV file is selected

#### 10.8. Exchange connection progress component is visible during async sync

**File:** `tests/edge-cases/exchange-connection-progress.spec.ts`

**Steps:**
  1. Log in and connect a new exchange via the Connect Exchange dialog with valid credentials
    - expect: After submission, a ConnectionProgress component is rendered (visible as a progress bar or status indicator) showing the background sync progress
    - expect: A loading toast 'Connected! Syncing assets in background...' appears
