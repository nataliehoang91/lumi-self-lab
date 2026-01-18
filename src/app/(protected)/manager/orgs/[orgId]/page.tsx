"use client"

import { useSearchParams } from "next/navigation"
import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Building2,
  Users,
  Target,
  TrendingUp,
  Clock,
  Shield,
  EyeOff,
  Sparkles,
  Plus,
  BarChart3,
  Settings,
  UserPlus,
  Mail,
  LayoutGrid,
  FileText,
  Play,
  Pause,
  Edit,
  Trash2,
  Search,
  Crown,
  Copy,
  MoreHorizontal,
  ExternalLink,
  Send,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Smile,
  Hash,
  Type,
  ToggleLeft,
  ChevronRight,
  Eye,
  Archive,
  RefreshCw,
} from "lucide-react"
import { Suspense } from "react"

// Mock org data
const mockOrg = {
  id: "org-1",
  name: "Acme Corp",
  description: "Helping our team grow through self-reflection and personal experiments",
  memberCount: 47,
  logoColor: "from-blue-500 to-cyan-500",
  createdDate: "Aug 15, 2025",
  plan: "Team Pro",
  inviteLink: "https://selflab.app/join/acme-abc123",
}

// Mock experiment participation data (per template)
const mockExperimentParticipation = [
  {
    id: "exp-1",
    templateId: "t1",
    templateTitle: "Weekly Focus Tracking",
    totalInvited: 35,
    accepted: 28,
    declined: 3,
    pending: 4,
    activeInstances: 23,
    completedInstances: 5,
    avgProgress: 67,
    status: "active" as const,
    startDate: "2026-01-06",
    endDate: "2026-01-27",
  },
  {
    id: "exp-2",
    templateId: "t2",
    templateTitle: "Meeting Impact Assessment",
    totalInvited: 20,
    accepted: 18,
    declined: 1,
    pending: 1,
    activeInstances: 15,
    completedInstances: 3,
    avgProgress: 45,
    status: "active" as const,
    startDate: "2026-01-10",
    endDate: "2026-02-07",
  },
  {
    id: "exp-3",
    templateId: "t3",
    templateTitle: "Energy Patterns Discovery",
    totalInvited: 0,
    accepted: 0,
    declined: 0,
    pending: 0,
    activeInstances: 0,
    completedInstances: 0,
    avgProgress: 0,
    status: "draft" as const,
    startDate: null,
    endDate: null,
  },
]

// Mock pending invitations
const mockPendingInvitations = [
  { id: "inv-1", email: "john.doe@acme.com", templateTitle: "Weekly Focus Tracking", sentDate: "Jan 15, 2026", status: "pending" },
  { id: "inv-2", email: "jane.smith@acme.com", templateTitle: "Weekly Focus Tracking", sentDate: "Jan 15, 2026", status: "pending" },
  { id: "inv-3", email: "bob.wilson@acme.com", templateTitle: "Meeting Impact Assessment", sentDate: "Jan 12, 2026", status: "pending" },
]

// Mock templates with full details
const mockTemplates = [
  {
    id: "t1",
    title: "Weekly Focus Tracking",
    description: "Track daily focus levels and identify productivity patterns",
    duration: 21,
    frequency: "daily",
    status: "published" as const,
    fields: [
      { type: "emoji", label: "How focused were you today?" },
      { type: "number", label: "Deep work hours" },
      { type: "text", label: "What helped you focus?" },
    ],
    activeParticipants: 23,
    totalParticipants: 28,
    avgCompletion: 78,
    createdDate: "Dec 20, 2025",
  },
  {
    id: "t2",
    title: "Meeting Impact Assessment",
    description: "Evaluate how meetings affect your productivity and wellbeing",
    duration: 28,
    frequency: "daily",
    status: "published" as const,
    fields: [
      { type: "number", label: "Hours in meetings" },
      { type: "emoji", label: "Meeting satisfaction" },
      { type: "yesno", label: "Could any meeting be async?" },
      { type: "text", label: "Key insights" },
    ],
    activeParticipants: 15,
    totalParticipants: 18,
    avgCompletion: 82,
    createdDate: "Jan 5, 2026",
  },
  {
    id: "t3",
    title: "Energy Patterns Discovery",
    description: "Understand your natural energy rhythms throughout the day",
    duration: 14,
    frequency: "twice-daily",
    status: "draft" as const,
    fields: [
      { type: "emoji", label: "Current energy level" },
      { type: "select", label: "Time of day" },
      { type: "text", label: "What affected your energy?" },
    ],
    activeParticipants: 0,
    totalParticipants: 0,
    avgCompletion: 0,
    createdDate: "Jan 16, 2026",
  },
]

// Mock aggregate insights
const mockInsights = {
  totalExperimentInstances: 46,
  activeInstances: 38,
  avgCompletion: 78,
  avgStreak: 5.2,
  weeklyCheckIns: 156,
  participationRate: 89,
  moodDistribution: {
    veryHappy: 28,
    happy: 35,
    neutral: 22,
    sad: 12,
    verySad: 3,
  },
  topInsights: [
    { type: "positive", text: "Team focus scores are 15% higher on days with fewer meetings" },
    { type: "trend", text: "Morning check-ins (before 10am) correlate with 23% higher completion rates" },
    { type: "action", text: "4 participants haven't checked in this week - consider a gentle reminder" },
    { type: "positive", text: "Average streak improved from 3.8 to 5.2 days over the past month" },
  ],
  weeklyTrend: [
    { day: "Mon", checkIns: 42, participation: 89 },
    { day: "Tue", checkIns: 45, participation: 96 },
    { day: "Wed", checkIns: 38, participation: 81 },
    { day: "Thu", checkIns: 41, participation: 87 },
    { day: "Fri", checkIns: 35, participation: 74 },
  ],
}

// Mock members data
const mockMembers = [
  {
    id: "mem-1",
    name: "John Doe",
    email: "john.doe@acme.com",
    role: "admin",
    activeExperiments: 2,
    lastActive: "Jan 20, 2026",
  },
  {
    id: "mem-2",
    name: "Jane Smith",
    email: "jane.smith@acme.com",
    role: "member",
    activeExperiments: 1,
    lastActive: "Jan 19, 2026",
  },
  {
    id: "mem-3",
    name: "Bob Wilson",
    email: "bob.wilson@acme.com",
    role: "member",
    activeExperiments: 0,
    lastActive: "Jan 18, 2026",
  },
]

const Loading = () => null

// Helper to get field type icon
const getFieldIcon = (type: string) => {
  switch (type) {
    case "emoji": return <Smile className="w-3.5 h-3.5" />
    case "number": return <Hash className="w-3.5 h-3.5" />
    case "text": return <Type className="w-3.5 h-3.5" />
    case "yesno": return <ToggleLeft className="w-3.5 h-3.5" />
    case "select": return <LayoutGrid className="w-3.5 h-3.5" />
    default: return <Type className="w-3.5 h-3.5" />
  }
}

export default function ManagerOrgDetailPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = use(params)
  const [activeTab, setActiveTab] = useState<"experiments" | "templates" | "invitations" | "insights">("experiments")
  const [searchQuery, setSearchQuery] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockOrg.inviteLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-violet-50 dark:from-background dark:via-background dark:to-violet-950/20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild className="rounded-2xl hover:bg-violet/10 hover:text-violet">
              <Link href="/manager">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Manager
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-2xl gap-2 bg-transparent">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Org Header */}
          <Card className="p-6 bg-card border-border/50 rounded-3xl mb-6">
            <div className="flex flex-col md:flex-row md:items-start gap-5">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mockOrg.logoColor} flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}
              >
                {mockOrg.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{mockOrg.name}</h1>
                  <Badge className="bg-violet/10 text-violet border-violet/20 rounded-full">
                    <Crown className="w-3 h-3 mr-1" />
                    Owner
                  </Badge>
                  <Badge variant="outline" className="rounded-full text-xs">
                    {mockOrg.plan}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">{mockOrg.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-4 h-4" />
                    {mockInsights.totalExperimentInstances} experiment instances
                  </span>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    {mockInsights.avgCompletion}% avg completion
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Created {mockOrg.createdDate}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  className="rounded-2xl gap-2 bg-transparent"
                  onClick={handleCopyLink}
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copiedLink ? "Copied!" : "Invite Link"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-2xl bg-transparent">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem className="gap-2 rounded-lg">
                      <Settings className="w-4 h-4" />
                      Organization Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 rounded-lg">
                      <ExternalLink className="w-4 h-4" />
                      View Public Page
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 rounded-lg text-red-600">
                      <Archive className="w-4 h-4" />
                      Archive Organization
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-2xl w-fit overflow-x-auto">
            {[
              { id: "experiments", label: "Experiments", icon: Target, badge: mockExperimentParticipation.filter(e => e.status === "active").length },
              { id: "templates", label: "Templates", icon: LayoutGrid, badge: mockTemplates.length },
              { id: "invitations", label: "Invitations", icon: Mail, badge: mockPendingInvitations.length },
              { id: "insights", label: "Insights", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <Badge variant="secondary" className="rounded-full text-xs px-1.5 py-0 min-w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Experiments Tab - Shows active experiment campaigns */}
          {activeTab === "experiments" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-card border-border/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Play className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{mockInsights.activeInstances}</p>
                      <p className="text-xs text-muted-foreground">Active Instances</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-card border-border/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{mockInsights.avgCompletion}%</p>
                      <p className="text-xs text-muted-foreground">Avg Completion</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-card border-border/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-violet" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{mockInsights.weeklyCheckIns}</p>
                      <p className="text-xs text-muted-foreground">Weekly Check-ins</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-card border-border/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{mockInsights.avgStreak}</p>
                      <p className="text-xs text-muted-foreground">Avg Streak (days)</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Active Experiments */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Active Experiments</h2>
                  <Button className="rounded-2xl gap-2 bg-violet hover:bg-violet/90 text-white">
                    <Send className="w-4 h-4" />
                    Launch New Experiment
                  </Button>
                </div>

                <div className="grid gap-4">
                  {mockExperimentParticipation.filter(e => e.status === "active").map((exp) => (
                    <Card key={exp.id} className="p-5 bg-card border-border/50 rounded-3xl hover:shadow-lg hover:shadow-violet/5 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{exp.templateTitle}</h3>
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs">
                              Active
                            </Badge>
                          </div>
                          
                          {/* Participation funnel */}
                          <div className="flex flex-wrap gap-3 text-sm mb-3">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Send className="w-3.5 h-3.5" />
                              {exp.totalInvited} invited
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {exp.accepted} accepted
                            </span>
                            <span className="flex items-center gap-1.5 text-orange-600">
                              <Clock className="w-3.5 h-3.5" />
                              {exp.pending} pending
                            </span>
                            {exp.declined > 0 && (
                              <span className="flex items-center gap-1.5 text-red-500">
                                <XCircle className="w-3.5 h-3.5" />
                                {exp.declined} declined
                              </span>
                            )}
                          </div>

                          {/* Progress */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-xs">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-violet transition-all"
                                style={{ width: `${exp.avgProgress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{exp.avgProgress}% avg progress</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 bg-transparent">
                            <Eye className="w-4 h-4" />
                            View Insights
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 bg-transparent">
                            <UserPlus className="w-4 h-4" />
                            Invite More
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-xl">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem className="gap-2 rounded-lg">
                                <Pause className="w-4 h-4" />
                                Pause Experiment
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 rounded-lg">
                                <RefreshCw className="w-4 h-4" />
                                Send Reminder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 rounded-lg text-red-600">
                                <XCircle className="w-4 h-4" />
                                End Experiment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Privacy Notice */}
              <Card className="p-4 bg-violet/5 border-violet/20 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-violet mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Privacy-first design</p>
                    <p className="text-sm text-muted-foreground">
                      You see participation rates and aggregate scores only. Individual responses and personal reflections are never visible to protect participant privacy.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === "templates" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-muted-foreground">{mockTemplates.length} experiment templates</p>
                <Link href="/manager/templates/create">
                  <Button className="rounded-2xl gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                    Create Template
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="p-5 bg-card border-border/50 rounded-3xl hover:shadow-lg hover:shadow-primary/5 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{template.title}</h3>
                          <Badge
                            variant="outline"
                            className={`rounded-full text-xs ${
                              template.status === "published"
                                ? "border-green-500/50 text-green-600 bg-green-50 dark:bg-green-900/20"
                                : "border-orange-400/50 text-orange-600 bg-orange-50 dark:bg-orange-900/20"
                            }`}
                          >
                            {template.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                        
                        {/* Template details */}
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {template.duration} days
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {template.frequency}
                          </span>
                          {template.activeParticipants > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5" />
                              {template.activeParticipants}/{template.totalParticipants} active
                            </span>
                          )}
                          {template.avgCompletion > 0 && (
                            <span className="flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5" />
                              {template.avgCompletion}% completion
                            </span>
                          )}
                        </div>

                        {/* Fields preview */}
                        <div className="flex flex-wrap gap-2">
                          {template.fields.map((field, idx) => (
                            <Badge key={idx} variant="secondary" className="rounded-full text-xs gap-1.5 font-normal">
                              {getFieldIcon(field.type)}
                              {field.label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        {template.status === "published" ? (
                          <Button className="rounded-xl gap-1.5 bg-violet hover:bg-violet/90 text-white flex-1 md:flex-none">
                            <Send className="w-4 h-4" />
                            Launch
                          </Button>
                        ) : (
                          <Button variant="outline" className="rounded-xl gap-1.5 bg-transparent flex-1 md:flex-none">
                            <Edit className="w-4 h-4" />
                            Edit Draft
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-xl bg-transparent">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem className="gap-2 rounded-lg">
                              <Eye className="w-4 h-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 rounded-lg">
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 rounded-lg">
                              <Edit className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 rounded-lg text-red-600">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Create new template card */}
                <Link href="/manager/templates/create">
                  <Card className="p-8 bg-card/50 border-dashed border-2 border-primary/30 rounded-3xl text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                    <Plus className="w-10 h-10 mx-auto text-primary/50 mb-3" />
                    <h3 className="font-medium text-foreground mb-1">Create New Template</h3>
                    <p className="text-sm text-muted-foreground">Design a new experiment for your team</p>
                  </Card>
                </Link>
              </div>
            </div>
          )}

          {/* Invitations Tab */}
          {activeTab === "invitations" && (
            <div className="space-y-6">
              {/* Invite actions */}
              <Card className="p-5 bg-card border-border/50 rounded-3xl">
                <h3 className="font-semibold text-foreground mb-4">Invite Participants</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-border/50 hover:border-violet/50 hover:bg-violet/5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-violet" />
                      </div>
                      <h4 className="font-medium text-foreground group-hover:text-violet transition-colors">Email Invitation</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Send invites directly to email addresses</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">Share Link</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Copy a link anyone can use to join</p>
                  </div>
                </div>
              </Card>

              {/* Pending invitations */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Pending Invitations ({mockPendingInvitations.length})</h3>
                {mockPendingInvitations.length > 0 ? (
                  <Card className="divide-y divide-border/50 rounded-3xl overflow-hidden border-border/50">
                    {mockPendingInvitations.map((inv) => (
                      <div key={inv.id} className="p-4 bg-card flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-muted/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{inv.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Invited to <span className="text-foreground">{inv.templateTitle}</span> on {inv.sentDate}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 bg-transparent">
                            <RefreshCw className="w-3.5 h-3.5" />
                            Resend
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-xl text-red-600 hover:bg-red-50">
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Card>
                ) : (
                  <Card className="p-8 bg-card/50 border-border/50 rounded-3xl text-center">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
                    <h3 className="font-medium text-foreground mb-1">All caught up!</h3>
                    <p className="text-sm text-muted-foreground">No pending invitations</p>
                  </Card>
                )}
              </div>
            </div>
          )}

{/* Insights Tab */}
          {activeTab === "insights" && (
            <div className="space-y-6">
              {/* Privacy notice */}
              <Card className="p-4 bg-violet/5 border-violet/20 rounded-2xl">
                <div className="flex items-start gap-3">
                  <EyeOff className="w-5 h-5 text-violet mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Privacy-protected insights</p>
                    <p className="text-sm text-muted-foreground">
                      All data shown is aggregated and anonymized. Individual responses, personal reflections, and text entries are never visible to protect participant privacy.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Overview stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-card border-border/50 rounded-2xl text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{mockInsights.participationRate}%</p>
                  <p className="text-xs text-muted-foreground">Participation Rate</p>
                </Card>
                <Card className="p-4 bg-card border-border/50 rounded-2xl text-center">
                  <p className="text-3xl font-bold text-violet mb-1">{mockInsights.avgCompletion}%</p>
                  <p className="text-xs text-muted-foreground">Avg Completion</p>
                </Card>
                <Card className="p-4 bg-card border-border/50 rounded-2xl text-center">
                  <p className="text-3xl font-bold text-emerald-600 mb-1">{mockInsights.weeklyCheckIns}</p>
                  <p className="text-xs text-muted-foreground">Weekly Check-ins</p>
                </Card>
                <Card className="p-4 bg-card border-border/50 rounded-2xl text-center">
                  <p className="text-3xl font-bold text-orange-600 mb-1">{mockInsights.avgStreak}</p>
                  <p className="text-xs text-muted-foreground">Avg Streak (days)</p>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* AI Insights */}
                <Card className="p-6 bg-card border-border/50 rounded-3xl">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI-Generated Insights
                  </h3>
                  <div className="space-y-3">
                    {mockInsights.topInsights.map((insight, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          insight.type === "positive"
                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                            : insight.type === "trend"
                            ? "bg-violet/10 border-violet/20"
                            : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {insight.type === "positive" && <TrendingUp className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />}
                          {insight.type === "trend" && <BarChart3 className="w-4 h-4 text-violet mt-0.5 flex-shrink-0" />}
                          {insight.type === "action" && <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />}
                          <p className="text-sm">{insight.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Weekly Participation */}
                <Card className="p-6 bg-card border-border/50 rounded-3xl">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-violet" />
                    Weekly Participation
                  </h3>
                  <div className="space-y-4">
                    {mockInsights.weeklyTrend.map((day) => (
                      <div key={day.day} className="flex items-center gap-3">
                        <span className="w-10 text-sm text-muted-foreground">{day.day}</span>
                        <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-violet transition-all rounded-full"
                            style={{ width: `${day.participation}%` }}
                          />
                        </div>
                        <span className="w-16 text-sm text-right">
                          <span className="font-medium">{day.participation}%</span>
                          <span className="text-muted-foreground text-xs ml-1">({day.checkIns})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Mood Distribution (Aggregate) */}
                <Card className="p-6 bg-card border-border/50 rounded-3xl">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Smile className="w-5 h-5 text-primary" />
                    Sentiment Distribution
                    <Badge variant="secondary" className="rounded-full text-xs ml-auto">Aggregate</Badge>
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Very Positive", value: mockInsights.moodDistribution.veryHappy, color: "bg-emerald-500" },
                      { label: "Positive", value: mockInsights.moodDistribution.happy, color: "bg-emerald-400" },
                      { label: "Neutral", value: mockInsights.moodDistribution.neutral, color: "bg-gray-400" },
                      { label: "Negative", value: mockInsights.moodDistribution.sad, color: "bg-orange-400" },
                      { label: "Very Negative", value: mockInsights.moodDistribution.verySad, color: "bg-red-400" },
                    ].map((mood) => {
                      const total = Object.values(mockInsights.moodDistribution).reduce((a, b) => a + b, 0)
                      const percent = Math.round((mood.value / total) * 100)
                      return (
                        <div key={mood.label} className="flex items-center gap-3">
                          <span className="w-28 text-sm text-muted-foreground">{mood.label}</span>
                          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${mood.color} transition-all rounded-full`} style={{ width: `${percent}%` }} />
                          </div>
                          <span className="w-12 text-sm text-right font-medium">{percent}%</span>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6 bg-card border-border/50 rounded-3xl">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-violet" />
                    Recommended Actions
                  </h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start rounded-xl gap-3 h-auto py-3 bg-transparent">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <RefreshCw className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">Send Check-in Reminder</p>
                        <p className="text-xs text-muted-foreground">4 participants missed this week</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl gap-3 h-auto py-3 bg-transparent">
                      <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-violet" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">Export Report</p>
                        <p className="text-xs text-muted-foreground">Download aggregate insights as PDF</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl gap-3 h-auto py-3 bg-transparent">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                        <Send className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">Share Team Wins</p>
                        <p className="text-xs text-muted-foreground">Celebrate positive trends anonymously</p>
                      </div>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  )
}
