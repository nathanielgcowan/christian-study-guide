export type SiteMapLink = {
  href: string;
  label: string;
};

export type SiteMapSection = {
  title: string;
  description: string;
  links: SiteMapLink[];
};

export const siteMapSections: SiteMapSection[] = [
  {
    title: "Core Study",
    description: "The quickest paths into daily reading, prayer, and Scripture study.",
    links: [
      { href: "/", label: "Home" },
      { href: "/today", label: "Today" },
      { href: "/study", label: "Study" },
      { href: "/bible", label: "Bible" },
      { href: "/paths", label: "Guided Paths" },
      { href: "/prayer", label: "Prayer" },
      { href: "/search", label: "Search" },
      { href: "/studies", label: "Studies" },
      { href: "/devotionals", label: "Devotionals" },
      { href: "/reading-plans", label: "Reading Plans" },
      { href: "/reading-progress", label: "Reading Progress" },
      { href: "/verse-by-verse", label: "Verse by Verse" },
      { href: "/memorize", label: "Memorize" },
      { href: "/topics", label: "Topics" },
      { href: "/questions", label: "Questions" },
      { href: "/theology", label: "Theology" },
      { href: "/apologetics", label: "Apologetics" },
      { href: "/commentaries", label: "Commentaries" },
      { href: "/translations", label: "Translations" },
      { href: "/timeline", label: "Timeline" },
      { href: "/characters", label: "Characters" },
      { href: "/maps", label: "Maps" },
      { href: "/bible-world", label: "Bible World" },
      { href: "/images", label: "Images" },
    ],
  },
  {
    title: "Dashboard and Growth",
    description: "Saved progress, recommendations, and discipleship momentum.",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/command-center", label: "Command Center" },
      { href: "/recommendations", label: "Recommendations" },
      { href: "/goals", label: "Goals" },
      { href: "/notes", label: "Notes" },
      { href: "/bookmarks", label: "Bookmarks" },
      { href: "/workspace", label: "Workspace" },
      { href: "/study-workspace", label: "Study Workspace" },
      { href: "/passage-dashboard", label: "Passage Dashboard" },
      { href: "/collections", label: "Collections" },
      { href: "/shared-studies", label: "Shared Studies" },
      { href: "/plan-builder", label: "Plan Builder" },
      { href: "/mentor-chat", label: "Mentor Chat" },
      { href: "/voice", label: "Voice" },
      { href: "/fun", label: "Fun" },
      { href: "/gamification", label: "Gamification" },
      { href: "/quiz", label: "Quiz" },
      { href: "/certificates", label: "Certificates" },
      { href: "/new-believers", label: "New Believers" },
      { href: "/courses", label: "Courses" },
      { href: "/devotional-library", label: "Devotional Library" },
    ],
  },
  {
    title: "Community and Leadership",
    description: "Collaboration, groups, church tools, and shared discipleship.",
    links: [
      { href: "/community", label: "Community" },
      { href: "/groups", label: "Groups" },
      { href: "/rooms", label: "Rooms" },
      { href: "/collaboration", label: "Collaboration" },
      { href: "/journeys", label: "Journeys" },
      { href: "/leaders", label: "Leaders" },
      { href: "/church-admin", label: "Church Admin" },
      { href: "/team-access", label: "Team Access" },
      { href: "/publishing", label: "Publishing" },
      { href: "/sermon", label: "Sermon" },
      { href: "/notifications", label: "Notifications" },
      { href: "/mobile", label: "Mobile" },
      { href: "/profile", label: "Profile" },
      { href: "/account", label: "Account" },
    ],
  },
  {
    title: "Platform",
    description: "Advanced product layers, quality, and operations pages.",
    links: [
      { href: "/ai-studio", label: "AI Studio" },
      { href: "/orchestration", label: "AI Workflows" },
      { href: "/intelligence", label: "Intelligence" },
      { href: "/personalization", label: "Personalization" },
      { href: "/subscriptions", label: "Subscriptions" },
      { href: "/launch", label: "Launch" },
      { href: "/quality", label: "Quality" },
      { href: "/trust", label: "Trust" },
      { href: "/permissions", label: "Permissions" },
      { href: "/admin-analytics", label: "Admin Analytics" },
      { href: "/products", label: "Products" },
      { href: "/beta", label: "Beta" },
    ],
  },
  {
    title: "Company and Help",
    description: "About pages, legal pages, and site support.",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Blog" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/onboarding", label: "Onboarding" },
      { href: "/auth/signin", label: "Sign In" },
      { href: "/auth/signup", label: "Sign Up" },
      { href: "/studies/lords-prayer", label: "The Lord's Prayer Study" },
    ],
  },
];

export function getAllSiteMapLinks(): SiteMapLink[] {
  const seen = new Set<string>();
  const links: SiteMapLink[] = [];

  for (const section of siteMapSections) {
    for (const link of section.links) {
      if (seen.has(link.href)) {
        continue;
      }

      seen.add(link.href);
      links.push(link);
    }
  }

  return links;
}

export function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!envUrl) {
    return "http://localhost:3000";
  }

  return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
}
