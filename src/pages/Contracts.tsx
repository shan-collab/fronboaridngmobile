import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Search, AlertCircle, CheckCircle2, ChevronRight, Home as HomeIcon, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  dateOfJoining: string;
  dateOfJoiningSort: string;
  role: string;
  status: "pending" | "signed";
  overdue: boolean;
}

// Current date: 5th March 2026. Past dates = overdue for pending.
const mockEmployees: Employee[] = [
  { id: "1", name: "Marie Dupont", employeeId: "EMP-2026-001", dateOfJoining: "01/03/2026", dateOfJoiningSort: "2026-03-01", role: "Sales Assistant", status: "pending", overdue: true },
  { id: "2", name: "Jean-Pierre Martin", employeeId: "EMP-2026-002", dateOfJoining: "02/03/2026", dateOfJoiningSort: "2026-03-02", role: "Expert", status: "pending", overdue: true },
  { id: "3", name: "Sophie Lemaire", employeeId: "EMP-2026-003", dateOfJoining: "05/03/2026", dateOfJoiningSort: "2026-03-05", role: "Sales Assistant", status: "pending", overdue: false },
  { id: "4", name: "Thomas Bernard", employeeId: "EMP-2026-004", dateOfJoining: "10/03/2026", dateOfJoiningSort: "2026-03-10", role: "Expert", status: "pending", overdue: false },
  { id: "5", name: "Camille Rousseau", employeeId: "EMP-2026-005", dateOfJoining: "15/03/2026", dateOfJoiningSort: "2026-03-15", role: "Sales Assistant", status: "signed", overdue: false },
  { id: "6", name: "Lucas Moreau", employeeId: "EMP-2026-006", dateOfJoining: "03/03/2026", dateOfJoiningSort: "2026-03-03", role: "Sales Assistant", status: "pending", overdue: true },
  { id: "7", name: "Emma Lefevre", employeeId: "EMP-2026-007", dateOfJoining: "20/03/2026", dateOfJoiningSort: "2026-03-20", role: "Expert", status: "pending", overdue: false },
];

const Contracts = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredEmployees = useMemo(() => {
    const filtered = mockEmployees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || emp.employeeId.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || emp.role === roleFilter;
      const matchesDate = dateFilter === "all" || emp.dateOfJoining === dateFilter;
      return matchesSearch && matchesRole && matchesDate;
    });
    // Sort by start date ascending
    return filtered.sort((a, b) => a.dateOfJoiningSort.localeCompare(b.dateOfJoiningSort));
  }, [search, roleFilter, dateFilter]);

  const pendingCount = mockEmployees.filter(e => e.status === "pending").length;
  const signedCount = mockEmployees.filter(e => e.status === "signed").length;

  const uniqueRoles = [...new Set(mockEmployees.map(e => e.role))];
  const uniqueDates = [...new Set(mockEmployees.map(e => e.dateOfJoining))];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <div className="smyths-gradient px-4 pt-3 pb-3 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <button onClick={() => navigate("/contracts")} className="w-7 h-7 rounded-full bg-primary-foreground/15 flex items-center justify-center">
            <ArrowLeft className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
          <button onClick={() => navigate("/dashboard")} className="w-7 h-7 rounded-full bg-primary-foreground/15 flex items-center justify-center">
            <HomeIcon className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
        </div>
        <h1 className="text-primary-foreground text-sm font-bold">{t("contract_management")}</h1>
        <p className="text-primary-foreground/70 text-[11px] mt-0.5">
          {t("total_employees")}: {mockEmployees.length} &nbsp;|&nbsp; {t("pending_sign")}: {pendingCount} &nbsp;|&nbsp; {t("signed")}: {signedCount}
        </p>
      </div>

      {/* Fixed Search + Filters */}
      <div className="px-3 pt-2 pb-1 bg-background shrink-0">
        <div className="flex gap-1.5 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder={t("search_employee")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-7 h-8 text-xs"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-8 text-[10px] w-[100px]">
              <SelectValue placeholder={t("role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_roles")}</SelectItem>
              {uniqueRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="h-8 text-[10px] w-[100px]">
              <SelectValue placeholder={t("date_of_joining")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_dates")}</SelectItem>
              {uniqueDates.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Scrollable Employee List */}
      <div className="flex-1 overflow-y-auto px-3 pt-1 pb-6 space-y-2">
        {filteredEmployees.map(emp => (
          <button
            key={emp.id}
            onClick={() => navigate(`/contracts/${emp.id}`)}
            className={`w-full bg-card border border-border rounded-xl p-3 text-left transition-all group ${
              emp.status === "signed"
                ? "opacity-50"
                : "hover:shadow-md hover:border-primary/30 active:scale-[0.99]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-card-foreground">
                {emp.name} <span className="text-[10px] font-normal text-muted-foreground">({emp.employeeId})</span>
              </span>
              <div className="flex items-center gap-1.5">
                {emp.overdue && emp.status === "pending" && (
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] h-4 gap-0.5">
                    <AlertCircle className="w-2.5 h-2.5" /> {t("overdue")}
                  </Badge>
                )}
                {!emp.overdue && emp.status === "pending" && (
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-[9px] h-4 gap-0.5">
                    {t("pending")}
                  </Badge>
                )}
                {emp.status === "signed" && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[9px] h-4 gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> {t("signed")}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-[10px] text-muted-foreground w-28">{emp.role}</span>
              <span className="text-[10px] text-muted-foreground">{emp.dateOfJoining}</span>
            </div>
          </button>
        ))}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">{t("no_results")}</div>
        )}
      </div>
    </div>
  );
};

export default Contracts;
