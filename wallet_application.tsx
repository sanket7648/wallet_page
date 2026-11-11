// @ts-expect-error React type declarations are unavailable in this project.
import React, { useState, useMemo } from 'react';
// @ts-ignore React type declarations are unavailable in this project.
declare module 'react/jsx-runtime';
import { 
  Wallet,
  Filter,
  Search,
  ArrowUpRight,
  ShoppingBag,
  Info,
  Clock,
  X
} from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}

const BILLING_HISTORY_DATA = [
  { id: "p1", request: "MEDIUM", method: "UPI QR", amount: "₹2,100", credits: "3,000", status: "Awaiting verification", when: "11 Nov 2026, 12:17 pm" },
  { id: "p2", request: "SMALL", method: "UPI QR", amount: "₹800", credits: "1,000", status: "Cancelled", when: "11 Nov 2026, 12:17 pm" },
  { id: "p3", request: "SMALL", method: "UPI QR", amount: "₹800", credits: "1,000", status: "Awaiting verification", when: "10 Nov 2026, 12:10 pm" },
  { id: "p4", request: "SMALL", method: "UPI QR", amount: "₹800", credits: "1,000", status: "Cancelled", when: "10 Nov 2026, 12:08 pm" },
  { id: "p5", request: "MEDIUM", method: "UPI QR", amount: "₹2,100", credits: "3,000", status: "Awaiting verification", when: "10 Nov 2026, 12:07 pm" },
  { id: "p6", request: "SMALL", method: "UPI QR", amount: "₹800", credits: "1,000", status: "Cancelled", when: "10 Nov 2026, 12:06 pm" },
  { id: "p7", request: "MEDIUM", method: "UPI QR", amount: "₹2,100", credits: "3,000", status: "Cancelled", when: "10 Nov 2026, 12:04 pm" },
  { id: "p8", request: "SMALL", method: "UPI QR", amount: "₹800", credits: "1,000", status: "Cancelled", when: "10 Nov 2026, 12:04 pm" },
  { id: "p9", request: "Monthly", method: "UPI QR", amount: "₹999", credits: "300", status: "Cancelled", when: "9 Nov 2026, 3:49 pm" },
  { id: "p10", request: "LARGE", method: "UPI QR", amount: "₹3,200", credits: "5,000", status: "Awaiting verification", when: "9 Nov 2026, 11:41 am" },
  { id: "p11", request: "MEDIUM", method: "UPI QR", amount: "₹2,100", credits: "3,000", status: "Awaiting verification", when: "9 Nov 2026, 11:41 am" },
  { id: "p12", request: "SMALL", method: "UPI QR", amount: "₹800", credits: "1,000", status: "Cancelled", when: "4 Nov 2026, 11:18 am" },
  { id: "p13", request: "SMALL", method: "UPI QR", amount: "₹800", credits: "1,000", status: "Successful", when: "3 Nov 2026, 10:30 am" }
];

const CREDIT_ACTIVITY_DATA = [
  { id: "c1", date: "2026-11-11", credit: 500, debit: 0, remarks: "Credited through referral", source: "Referral" },
  { id: "c2", date: "2026-11-10", credit: 0, debit: 50, remarks: "Debited for Aadhaar verification", source: "Verification" },
  { id: "c3", date: "2026-11-09", credit: 300, debit: 0, remarks: "Credited through payment", source: "Purchase" },
  { id: "c4", date: "2026-11-08", credit: 100, debit: 0, remarks: "Free credits", source: "Referral" },
  { id: "c5", date: "2026-11-07", credit: 0, debit: 100, remarks: "Expired", source: "Purchase" },
  { id: "c6", date: "2026-11-05", credit: 0, debit: 50, remarks: "Debited for Aadhaar verification", source: "Verification" }
];

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isWithinDateFilter(date, preset, startDate, endDate) {
  if (!date) return false;
  const today = new Date();
  const todayValue = formatDateInput(today);

  if (preset === 'TODAY') return date === todayValue;
  if (preset === 'LAST_WEEK') {
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    return date >= formatDateInput(start) && date <= todayValue;
  }
  if (preset === 'LAST_MONTH') {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end = new Date(today.getFullYear(), today.getMonth(), 0);
    return date >= formatDateInput(start) && date <= formatDateInput(end);
  }
  if (preset === 'CUSTOM') {
    return (!startDate || date >= startDate) && (!endDate || date <= endDate);
  }
  return true;
}

function getBillingDate(when) {
  const date = when.match(/^\d{1,2} [A-Za-z]{3} \d{4}/)?.[0];
  if (!date) return '';
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? '' : formatDateInput(parsedDate);
}

export default function App() {
  const [activeSection, setActiveSection] = useState(null);
  const [creditDatePreset, setCreditDatePreset] = useState('ALL');
  const [creditStartDate, setCreditStartDate] = useState('');
  const [creditEndDate, setCreditEndDate] = useState('');
  const [billingDatePreset, setBillingDatePreset] = useState('ALL');
  const [billingStartDate, setBillingStartDate] = useState('');
  const [billingEndDate, setBillingEndDate] = useState('');
  const [selectedCreditType, setSelectedCreditType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackFilter, setSelectedPackFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  const filteredActivity = useMemo(() => CREDIT_ACTIVITY_DATA.filter((item) => {
    const matchesDate = isWithinDateFilter(
      item.date,
      creditDatePreset,
      creditStartDate,
      creditEndDate
    );
    const matchesType = selectedCreditType === 'ALL' ||
      (selectedCreditType === 'CREDIT' ? item.credit > 0 : item.debit > 0);
    return matchesDate && matchesType;
  }), [creditDatePreset, creditStartDate, creditEndDate, selectedCreditType]);

  const filteredHistory = useMemo(() => {
    return BILLING_HISTORY_DATA.filter((item) => {
      const matchesSearch = 
        item.request.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.when.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPack = selectedPackFilter === 'ALL' || item.request.toUpperCase() === selectedPackFilter.toUpperCase();
      const matchesStatus = selectedStatusFilter === 'ALL' || item.status === selectedStatusFilter;
      const matchesDate = isWithinDateFilter(
        getBillingDate(item.when),
        billingDatePreset,
        billingStartDate,
        billingEndDate
      );

      return matchesSearch && matchesPack && matchesStatus && matchesDate;
    });
  }, [searchQuery, selectedPackFilter, selectedStatusFilter, billingDatePreset, billingStartDate, billingEndDate]);

  return (
    <div className="min-h-screen bg-[#eaf4f4] text-[#112932] font-sans selection:bg-[#0b5d51] selection:text-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#d8e6e6] sticky top-0 z-30 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <div className="bg-[#0b5d51] text-white p-2 rounded-xl shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#112932]">Wallet Console</h1>
              <p className="text-xs text-[#5b7077]">Manage credits, plan upgrades & verification status</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* TOP SUMMARY CARDS (Identical to original image style) */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-[#112932]">Wallet</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Available Credits Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#d2e2e2] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-[#5b7077] uppercase tracking-wider">Available credits</span>
                  <div className="text-4xl font-extrabold text-[#112932] mt-2">0</div>
                </div>
                <button className="bg-[#0b5d51] hover:bg-[#08483f] text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95">
                  <ShoppingBag className="w-4 h-4" />
                  Buy credits
                </button>
              </div>
            </div>

            {/* Current Plan Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#d2e2e2] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-[#5b7077] uppercase tracking-wider">Current plan</span>
                  <div className="text-4xl font-extrabold text-[#112932] mt-2">Free</div>
                </div>
                <button className="border-2 border-[#d2e2e2] hover:border-[#0b5d51] text-[#112932] hover:text-[#0b5d51] px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-all active:scale-95 bg-white">
                  Upgrade plan
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Aadhaar Check Note */}
          <div className="flex items-center gap-2 text-xs text-[#5b7077] pt-1 px-1">
            <span className="text-[#233d4d]">Successful Aadhaar check: <strong className="text-[#112932] font-semibold">50 credits</strong></span>
            <div className="relative group cursor-pointer">
              <Info className="w-3.5 h-3.5 text-[#5b7077] hover:text-[#0b5d51] transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 bg-[#112932] text-white text-[11px] p-2 rounded-lg shadow-xl text-center z-20">
                Credits earned automatically after completing Aadhaar KYC verification.
              </div>
            </div>
          </div>
        </section>


        <div className="space-y-5">
          <div
            role="tablist"
            aria-label="Wallet history"
            className="flex justify-center gap-8 border-b border-[#d8e6e6]"
          >
            <button
              type="button"
              role="tab"
              id="credit-activity-tab"
              onClick={() => setActiveSection('activity')}
              aria-selected={activeSection === 'activity'}
              aria-controls="credit-activity-panel"
              className={`relative -mb-px border-b-2 px-0 pb-3 text-sm font-semibold transition-colors ${
                activeSection === 'activity'
                  ? 'border-[#0b5d51] text-[#0b5d51]'
                  : 'border-transparent text-[#5b7077] hover:text-[#112932]'
              }`}
            >
              Credit Activity
            </button>
            <button
              type="button"
              role="tab"
              id="billing-history-tab"
              onClick={() => setActiveSection('billing')}
              aria-selected={activeSection === 'billing'}
              aria-controls="billing-history-panel"
              className={`relative -mb-px border-b-2 px-0 pb-3 text-sm font-semibold transition-colors ${
                activeSection === 'billing'
                  ? 'border-[#0b5d51] text-[#0b5d51]'
                  : 'border-transparent text-[#5b7077] hover:text-[#112932]'
              }`}
            >
              Billing History
            </button>
          </div>

          {activeSection === 'activity' && (
            <section id="credit-activity-panel" role="tabpanel" aria-labelledby="credit-activity-tab">
              <CreditActivitySection
                activity={filteredActivity}
                datePreset={creditDatePreset}
                setDatePreset={setCreditDatePreset}
                startDate={creditStartDate}
                setStartDate={setCreditStartDate}
                endDate={creditEndDate}
                setEndDate={setCreditEndDate}
                selectedType={selectedCreditType}
                setSelectedType={setSelectedCreditType}
              />
            </section>
          )}

          {activeSection === 'billing' && (
            <section id="billing-history-panel" role="tabpanel" aria-labelledby="billing-history-tab">
              <BillingHistorySection 
                history={filteredHistory}
                datePreset={billingDatePreset}
                setDatePreset={setBillingDatePreset}
                startDate={billingStartDate}
                setStartDate={setBillingStartDate}
                endDate={billingEndDate}
                setEndDate={setBillingEndDate}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedPackFilter={selectedPackFilter}
                setSelectedPackFilter={setSelectedPackFilter}
                selectedStatusFilter={selectedStatusFilter}
                setSelectedStatusFilter={setSelectedStatusFilter}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENTS (Clean Modularization)
   ========================================================================== */

// Credit Activity Table + Mobile Cards with Filters
function DateFilter({
  idPrefix,
  value,
  onChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) {
  const fieldClassName = "bg-[#eaf4f4]/60 border border-[#d8e6e6] rounded-xl px-3 py-2 text-xs text-[#112932] focus:outline-none focus:ring-2 focus:ring-[#0b5d51]/30";

  return (
    <>
      <label htmlFor={`${idPrefix}-date-filter`} className="sr-only">Filter by date</label>
      <select
        id={`${idPrefix}-date-filter`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClassName} cursor-pointer`}
      >
        <option value="ALL">All time</option>
        <option value="TODAY">Today</option>
        <option value="LAST_WEEK">Last week</option>
        <option value="LAST_MONTH">Last month</option>
        <option value="CUSTOM">Custom</option>
      </select>
      {value === 'CUSTOM' && (
        <>
          <label htmlFor={`${idPrefix}-start-date`} className="sr-only">Custom start date</label>
          <input
            id={`${idPrefix}-start-date`}
            aria-label="Custom start date"
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(event) => setStartDate(event.target.value)}
            className={fieldClassName}
          />
          <label htmlFor={`${idPrefix}-end-date`} className="sr-only">Custom end date</label>
          <input
            id={`${idPrefix}-end-date`}
            aria-label="Custom end date"
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) => setEndDate(event.target.value)}
            className={fieldClassName}
          />
        </>
      )}
    </>
  );
}

function CreditActivitySection({
  activity,
  datePreset,
  setDatePreset,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedType,
  setSelectedType
}) {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const formatActivityDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl border border-[#d2e2e2] shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
      <div className="flex flex-col gap-3 pb-2 border-b border-[#eaf4f4]">
        <button
          type="button"
          aria-expanded={filtersVisible}
          aria-controls="credit-activity-filters"
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="flex w-fit items-center gap-1.5 text-xs font-medium text-[#5b7077] hover:text-[#0b5d51]"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{filtersVisible ? 'Hide filters' : 'Filter'}</span>
        </button>
        {filtersVisible && (
          <div id="credit-activity-filters" className="flex flex-col md:flex-row md:items-end gap-3">
            <DateFilter
              idPrefix="credit-activity"
              value={datePreset}
              onChange={setDatePreset}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
            <label className="flex flex-col gap-1 text-xs font-medium text-[#5b7077]">
              Type
              <select
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
                className="bg-[#eaf4f4]/60 border border-[#d8e6e6] rounded-xl px-3 py-2 text-xs text-[#112932] focus:outline-none focus:ring-2 focus:ring-[#0b5d51]/30 cursor-pointer"
              >
                <option value="ALL">All types</option>
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
              </select>
            </label>
          </div>
        )}
      </div>

      <div className="desktop-table-view overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#eaf4f4] text-[#5b7077] font-semibold bg-[#eaf4f4]/30">
              <th className="py-3 px-4">S.N</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Credit</th>
              <th className="py-3 px-4">Debit</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f7f7]">
            {activity.length > 0 ? activity.map((row, index) => (
              <tr key={row.id} className="hover:bg-[#eaf4f4]/30 transition-colors">
                <td className="py-3.5 px-4 text-[#5b7077]">{index + 1}</td>
                <td className="py-3.5 px-4 text-[#112932]">{formatActivityDate(row.date)}</td>
                <td className="py-3.5 px-4 font-semibold text-green-700">{row.credit ? `+${row.credit}` : '—'}</td>
                <td className="py-3.5 px-4 font-semibold text-red-700">{row.debit ? `-${row.debit}` : '—'}</td>
                <td className="py-3.5 px-4 text-[#5b7077]">{row.source}</td>
                <td className="py-3.5 px-4 text-[#5b7077]">{row.remarks}</td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="py-8 text-center text-[#5b7077]">No credit activity matches the selected filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-card-view space-y-3">
        {activity.length > 0 ? activity.map((row, index) => (
          <div key={row.id} className="p-3.5 rounded-xl border border-[#eaf4f4] bg-[#eaf4f4]/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#112932]">S.N {index + 1}</span>
              <span className="text-[#5b7077]">{formatActivityDate(row.date)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5b7077]">Credit</span>
              <span className="font-semibold text-green-700">{row.credit ? `+${row.credit}` : '—'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5b7077]">Debit</span>
              <span className="font-semibold text-red-700">{row.debit ? `-${row.debit}` : '—'}</span>
            </div>
            <div className="text-xs">
              <span className="text-[#5b7077]">Source: </span>
              <span className="text-[#112932]">{row.source}</span>
            </div>
            <div className="border-t border-[#eaf4f4] pt-2 text-xs">
              <span className="text-[#5b7077]">Remarks: </span>
              <span className="text-[#112932]">{row.remarks}</span>
            </div>
          </div>
        )) : (
          <div className="py-6 text-center text-xs text-[#5b7077]">No credit activity matches the selected filters.</div>
        )}
      </div>
    </div>
  );
}

// Billing History Table + Mobile Cards with Filters
function BillingHistorySection({
  history,
  datePreset,
  setDatePreset,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  searchQuery,
  setSearchQuery,
  selectedPackFilter,
  setSelectedPackFilter,
  selectedStatusFilter,
  setSelectedStatusFilter
}) {
  const [filtersVisible, setFiltersVisible] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#d2e2e2] shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
      
      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-2 border-b border-[#eaf4f4]">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5b7077] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by pack, amount or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#eaf4f4]/60 border border-[#d8e6e6] rounded-xl text-xs text-[#112932] placeholder-[#5b7077] focus:outline-none focus:ring-2 focus:ring-[#0b5d51]/30 focus:border-[#0b5d51]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-expanded={filtersVisible}
            aria-controls="billing-history-filters"
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="flex items-center gap-1.5 text-xs font-medium text-[#5b7077] hover:text-[#0b5d51]"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filtersVisible ? 'Hide filters' : 'Filter'}</span>
          </button>

          {filtersVisible && (
            <div id="billing-history-filters" className="flex flex-wrap items-center gap-2">
              <DateFilter
                idPrefix="billing-history"
                value={datePreset}
                onChange={setDatePreset}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
              <select
                aria-label="Filter by pack"
                value={selectedPackFilter}
                onChange={(e) => setSelectedPackFilter(e.target.value)}
                className="bg-[#eaf4f4]/60 border border-[#d8e6e6] rounded-xl px-3 py-1.5 text-xs font-medium text-[#112932] focus:outline-none focus:ring-2 focus:ring-[#0b5d51]/30 cursor-pointer"
              >
                <option value="ALL">All Packs</option>
                <option value="SMALL">SMALL</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LARGE">LARGE</option>
                <option value="MONTHLY">Monthly</option>
              </select>
              <select
                aria-label="Filter by status"
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-[#eaf4f4]/60 border border-[#d8e6e6] rounded-xl px-3 py-1.5 text-xs font-medium text-[#112932] focus:outline-none focus:ring-2 focus:ring-[#0b5d51]/30 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Awaiting verification">Awaiting verification</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Successful">Successful</option>
              </select>
            </div>
          )}
        </div>

      </div>

      {/* Desktop Table View */}
      <div className="desktop-table-view overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#eaf4f4] text-[#5b7077] font-semibold bg-[#eaf4f4]/30">
              <th className="py-3 px-4">Request</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Credits</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">When</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f7f7]">
            {history.length > 0 ? (
              history.map((row) => (
                <tr key={row.id} className="hover:bg-[#eaf4f4]/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#112932]">{row.request}</td>
                  <td className="py-3.5 px-4 text-[#5b7077] font-medium">{row.method}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#112932]">{row.amount}</td>
                  <td className="py-3.5 px-4 text-[#112932] font-medium">{row.credits}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="py-3.5 px-4 text-[#5b7077]">{row.when}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-[#0b5d51] hover:underline font-medium text-xs">
                      View details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#5b7077]">
                  No records matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (Fallback for small screens) */}
      <div className="mobile-card-view space-y-3">
        {history.length > 0 ? (
          history.map((row) => (
            <div key={row.id} className="p-3.5 rounded-xl border border-[#eaf4f4] bg-[#eaf4f4]/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-[#112932] text-sm">
                  {row.request} <span className="text-xs font-normal text-[#5b7077]">({row.method})</span>
                </div>
                <StatusBadge status={row.status} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#eaf4f4]">
                <div>
                  <span className="text-[#5b7077]">Amount: </span>
                  <span className="font-semibold text-[#112932]">{row.amount}</span>
                </div>
                <div>
                  <span className="text-[#5b7077]">Credits: </span>
                  <span className="font-semibold text-[#112932]">{row.credits}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#5b7077] pt-0.5">
                {row.when}
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-xs text-[#5b7077]">
            No records matching the selected filters.
          </div>
        )}
      </div>

    </div>
  );
}

// 4. Status Badge Helper
function StatusBadge({ status }) {
  if (status === 'Awaiting verification') {
    return (
      <span className="inline-flex items-center gap-1 bg-[#fef3c7] text-[#92400e] text-[11px] px-2.5 py-0.5 rounded-full font-medium">
        <Clock className="w-3 h-3" />
        Awaiting verification
      </span>
    );
  }
  if (status === 'Successful') {
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[11px] px-2.5 py-0.5 rounded-full font-medium">
        Successful
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-[#f3f4f6] text-[#4b5563] text-[11px] px-2.5 py-0.5 rounded-full font-medium">
      <X className="w-3 h-3" />
      Cancelled
    </span>
  );
}