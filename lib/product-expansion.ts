export type ProductFeature = {
  title: string;
  detail: string;
  href?: string;
};

export type ProductPillar = {
  title: string;
  eyebrow?: string;
  detail: string;
  accent: string;
  href?: string;
};

export const growthPillars: ProductPillar[] = [
  {
    title: "Today engine",
    eyebrow: "Personalized daily flow",
    detail:
      "Give every user one reading, one reflection, one prayer prompt, one memory review, and one next step based on momentum.",
    accent: "blue",
    href: "/today",
  },
  {
    title: "Guided discipleship paths",
    eyebrow: "Structured growth tracks",
    detail:
      "Launch beginner, grief, anxiety, apologetics, leadership, marriage, and new believer tracks with checkpoints and completion moments.",
    accent: "emerald",
    href: "/reading-plans",
  },
  {
    title: "Sermon companion",
    eyebrow: "Church-ready tools",
    detail:
      "Turn a sermon text into notes, questions, prayer follow-up, and leader-ready next steps for groups and families.",
    accent: "amber",
    href: "/sermon",
  },
  {
    title: "Collaborative study rooms",
    eyebrow: "Live group discipleship",
    detail:
      "Support shared notes, leader prompts, attendance, prayer lists, and recap exports for classes, groups, and ministry teams.",
    accent: "violet",
    href: "/groups",
  },
  {
    title: "Memory and retention",
    eyebrow: "Habit-forming practice",
    detail:
      "Use spaced repetition, reminder loops, milestone celebrations, and adaptive plans to keep people engaged without shame.",
    accent: "rose",
    href: "/memorize",
  },
  {
    title: "Publishing and trust",
    eyebrow: "Operational maturity",
    detail:
      "Add AI safeguards, moderation, editorial queues, church oversight, and mobile polish so the product can scale responsibly.",
    accent: "slate",
    href: "/admin",
  },
];

export const guidedPaths: ProductFeature[] = [
  {
    title: "New believer path",
    detail:
      "Build confidence with identity in Christ, prayer, Gospel foundations, and first spiritual habits.",
  },
  {
    title: "Anxiety and peace",
    detail:
      "Pair short readings, prayer exercises, and breath-friendly reflection prompts around trust and rest.",
  },
  {
    title: "Marriage and family",
    detail:
      "Give couples and households one shared reading rhythm, one discussion question, and one weekly application.",
  },
  {
    title: "Leadership and service",
    detail:
      "Train volunteers and leaders with Scripture, reflection checkpoints, and ministry follow-through.",
  },
  {
    title: "Apologetics track",
    detail:
      "Move through hard questions with source-based answers, careful reasoning, and pastoral application.",
  },
  {
    title: "Grief and suffering",
    detail:
      "Offer a gentler pace with lament passages, testimony prompts, and hope-centered follow-up.",
  },
];

export const dailyEngineMoments: ProductFeature[] = [
  {
    title: "Reading selection",
    detail: "Choose the passage of the day from active plans, recent history, and missed-day recovery rules.",
  },
  {
    title: "Reflection prompt",
    detail: "Ask one question tailored to the passage theme and the user's active season of discipleship.",
  },
  {
    title: "Prayer cue",
    detail: "Generate a prayer direction tied directly to the reading rather than a generic encouragement.",
  },
  {
    title: "Memory review",
    detail: "Pull one verse due for review, with easier and harder practice modes depending on mastery.",
  },
  {
    title: "Next action",
    detail: "Close the loop with one visible step such as journaling, sharing, or a practical obedience challenge.",
  },
];

export const sermonCompanionModes: ProductFeature[] = [
  {
    title: "Listener notes",
    detail: "Capture the main idea, supporting points, and one personal takeaway in a clean guided structure.",
  },
  {
    title: "Leader outline",
    detail: "Convert the sermon text into small-group prompts, Scripture cross references, and pastoral follow-up.",
  },
  {
    title: "Family devotion",
    detail: "Reframe the message into simpler questions, one household activity, and one shared prayer.",
  },
  {
    title: "Midweek recap",
    detail: "Send a summary with action steps, prayer needs, and one next reading for the week.",
  },
];

export const aiSafeguards: ProductFeature[] = [
  {
    title: "Citation-first answers",
    detail: "Show the source verse or passage before offering generated explanation or application.",
  },
  {
    title: "Interpretation labeling",
    detail: "Separate direct Scripture, commentary summary, and AI synthesis so users know what they are reading.",
  },
  {
    title: "Tradition-aware tone",
    detail: "Let churches and users choose how denominational nuance should shape explanations.",
  },
  {
    title: "Safety escalations",
    detail: "Detect high-stakes moments and steer users toward trusted human support instead of overconfident advice.",
  },
];

export const adaptivePlanSignals: ProductFeature[] = [
  {
    title: "Missed-day recovery",
    detail: "Shorten the next reading instead of simply marking the user as behind.",
  },
  {
    title: "Momentum pacing",
    detail: "Expand or simplify the next day based on recent completion patterns and available time.",
  },
  {
    title: "Season-based recommendations",
    detail: "Suggest a gentler path during grief or burnout and a deeper track when momentum is rising.",
  },
  {
    title: "Leader mode",
    detail: "Let church leaders assign a shared path with optional checkpoints and discussion prompts.",
  },
];

export const memorizationSystems: ProductFeature[] = [
  {
    title: "Spaced repetition queue",
    detail: "Review verses based on due date, mastery, and recent struggle instead of only chronology.",
  },
  {
    title: "Audio recitation",
    detail: "Practice by listening, speaking, and self-scoring confidence after each round.",
  },
  {
    title: "Difficulty ladders",
    detail: "Move from full verse review to fill-in-the-blank to first-letter recall as confidence rises.",
  },
  {
    title: "Weekly wins",
    detail: "Celebrate review consistency, mastery streaks, and memory battle progress without turning it into shame.",
  },
];

export const collaborationSystems: ProductFeature[] = [
  {
    title: "Shared study notes",
    detail: "Keep a live note canvas for observations, applications, and prayer requests during a room session.",
  },
  {
    title: "Leader stage control",
    detail: "Move the room through read, observe, discuss, pray, and apply stages together.",
  },
  {
    title: "Attendance and follow-up",
    detail: "Track who joined, who needs follow-up, and what action items came out of the conversation.",
  },
  {
    title: "Weekly recap export",
    detail: "Send a clean summary with key notes, prayer themes, and next-session prep.",
  },
];

export const prayerAnalyticsSystems: ProductFeature[] = [
  {
    title: "Answered prayer timeline",
    detail: "Show when prayer requests changed status so gratitude becomes visible over time.",
  },
  {
    title: "Theme detection",
    detail: "Highlight recurring categories such as family, peace, healing, work, or church life.",
  },
  {
    title: "Milestone moments",
    detail: "Celebrate first answered prayer, 7-day prayer rhythm, and testimony-sharing moments.",
  },
  {
    title: "Reflection summaries",
    detail: "Surface what the journal reveals about trust, burdens, and spiritual growth patterns.",
  },
];

export const familyChurchSystems: ProductFeature[] = [
  {
    title: "Shared household plans",
    detail: "Run one reading plan across parents, kids, and leaders with role-sensitive prompts.",
  },
  {
    title: "Parent and child progress",
    detail: "Track consistency separately while keeping a shared devotional rhythm.",
  },
  {
    title: "Leader dashboards",
    detail: "Show room engagement, plan adoption, and pastoral follow-up needs at a ministry level.",
  },
  {
    title: "Printable session guides",
    detail: "Export group questions, leader notes, and family devotion sheets for offline use.",
  },
];

export const publishingSystems: ProductFeature[] = [
  {
    title: "Featured content curation",
    detail: "Choose what appears on the homepage, in campaigns, and inside themed discipleship tracks.",
  },
  {
    title: "Editorial approval queues",
    detail: "Review devotionals, studies, and leader resources before they go live.",
  },
  {
    title: "Seasonal campaign launches",
    detail: "Coordinate Lent, Advent, church initiatives, or sermon series from one publishing layer.",
  },
  {
    title: "Premium packaging",
    detail: "Bundle church kits, leader packs, and premium resources with clear access controls.",
  },
];

export const retentionSystems: ProductFeature[] = [
  {
    title: "Onboarding quiz",
    detail: "Learn the user's season, tradition, and goals so the product can start with relevance.",
  },
  {
    title: "Reminder stack",
    detail: "Schedule daily reading nudges, prayer follow-ups, and memory verse check-ins.",
  },
  {
    title: "Streak recovery",
    detail: "Use grace-based recovery language and smaller re-entry actions after missed days.",
  },
  {
    title: "Milestone celebrations",
    detail: "Mark path completions, answered prayers, and memorization wins in ways that feel pastoral.",
  },
];

export const mobileSystems: ProductFeature[] = [
  {
    title: "Offline passage packs",
    detail: "Save the Today flow, recent readings, and devotionals for travel and low-connection use.",
  },
  {
    title: "Background audio",
    detail: "Keep Scripture and prayer audio steady while the phone is locked or other apps are open.",
  },
  {
    title: "Install-first polish",
    detail: "Improve homescreen install prompts, reconnect states, and daily return behavior.",
  },
  {
    title: "Touch-first navigation",
    detail: "Favor larger controls, shorter flows, and fewer crowded layouts for real mobile sessions.",
  },
];
