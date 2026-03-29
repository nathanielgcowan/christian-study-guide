export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readingTime: string;
  relatedHref: string;
  relatedLabel: string;
  intro: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  closing: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "designing-a-daily-bible-habit-that-people-can-actually-keep",
    title: "Designing a daily Bible habit that people can actually keep",
    excerpt:
      "A look at why structure, continuity, and low-friction next steps matter more than endless feature depth.",
    category: "Product",
    date: "March 28, 2026",
    author: "Christian Study Guide Team",
    readingTime: "6 min read",
    relatedHref: "/about",
    relatedLabel: "Learn more about the product vision",
    intro: [
      "Most Bible apps have no shortage of content. The problem is not access. The problem is helping someone return tomorrow with enough clarity and motivation to keep going.",
      "A daily Bible habit is usually lost in the gap between a good intention and the next concrete action. If an app cannot close that gap, more features only make the experience feel heavier.",
    ],
    sections: [
      {
        heading: "Consistency beats intensity",
        paragraphs: [
          "People rarely build a Scripture habit by starting with maximum ambition. They build it by finding a repeatable rhythm that fits the real texture of their week.",
          "That means a good study experience should reward small acts of faithfulness. Ten attentive minutes with a clear next step is often more fruitful than a sprawling dashboard that assumes every user has an hour to spare.",
        ],
      },
      {
        heading: "The next step should always be obvious",
        paragraphs: [
          "Momentum collapses when a person opens the app and has to decide from scratch what to read, where they left off, and what to do with what they just learned.",
          "Strong product design lowers that cognitive load. It remembers progress, suggests a path, and turns uncertainty into one calm invitation to continue.",
        ],
        bullets: [
          "Resume the last reading without searching for it.",
          "Offer one recommended next action instead of ten equal options.",
          "Preserve notes, prayers, and unfinished thoughts so people feel continuity.",
        ],
      },
      {
        heading: "Structure creates freedom",
        paragraphs: [
          "Some people assume structure feels restrictive, but the opposite is usually true for beginners. A thoughtful plan gives people enough shape to start without feeling lost.",
          "Reading plans, guided paths, memory prompts, and reflection questions work best when they feel like gentle rails rather than rigid assignments. The goal is not control. The goal is confidence.",
        ],
      },
      {
        heading: "Habits grow when the experience feels pastoral",
        paragraphs: [
          "Bible software should not feel like productivity software with verses pasted onto it. People are bringing distraction, guilt, spiritual hunger, and inconsistent schedules into the experience.",
          "When the interface communicates warmth, steadiness, and realistic encouragement, users are more likely to come back after a missed day instead of assuming they have failed.",
        ],
      },
    ],
    closing: [
      "The best daily Bible habit products do not win by offering the most features. They win by helping people take the next faithful step without friction.",
      "That is the standard we want to keep building toward: a study experience that is serious enough to be useful and gentle enough to be used every day.",
    ],
  },
  {
    slug: "how-churches-can-turn-sermon-response-into-discipleship-follow-through",
    title: "How churches can turn sermon response into discipleship follow-through",
    excerpt:
      "Practical ways to connect preaching, prayer, groups, and weekday action steps inside a digital ministry workflow.",
    category: "Ministry",
    date: "March 21, 2026",
    author: "Christian Study Guide Team",
    readingTime: "7 min read",
    relatedHref: "/products",
    relatedLabel: "Explore product directions for churches",
    intro: [
      "A strong sermon can stir conviction, clarity, and hope in the room. The challenge is what happens after people walk to the parking lot.",
      "If there is no clear bridge from Sunday teaching into weekday practice, even meaningful response can fade into good intentions. Churches need follow-through, not just inspiration.",
    ],
    sections: [
      {
        heading: "The sermon moment is a starting point",
        paragraphs: [
          "Preaching does important work that no app can replace. But sermons are often most effective when they launch a discipleship pathway rather than ending as a standalone event.",
          "People usually need help translating what they heard into prayer, conversation, repentance, and next obedience. Digital tools can support that transition when they are designed around ministry realities.",
        ],
      },
      {
        heading: "Follow-through works best when it is simple",
        paragraphs: [
          "The goal is not to create a complicated workflow for every message. The goal is to give the church a repeatable way to extend one sermon into the week ahead.",
        ],
        bullets: [
          "Publish the key passage and main points in a shareable format.",
          "Offer two or three reflection questions for personal or group discussion.",
          "Attach a prayer prompt and one concrete application step.",
          "Give leaders a lightweight way to check in with people during the week.",
        ],
      },
      {
        heading: "Groups and mentors need the same source of truth",
        paragraphs: [
          "Discipleship breaks down when everyone is improvising from memory. Small-group leaders, mentors, and ministry staff benefit from a shared set of prompts that keeps follow-up aligned with the sermon’s intent.",
          "When that content is already prepared and easy to distribute, the church can move faster without sacrificing clarity.",
        ],
      },
      {
        heading: "The best ministry workflows create visibility without pressure",
        paragraphs: [
          "Leaders do not need surveillance. They need enough visibility to know whether people engaged, where questions are surfacing, and who may need personal care.",
          "Done well, follow-through systems help pastors and leaders respond with wisdom. They do not replace human shepherding. They make it easier to notice where shepherding is needed.",
        ],
      },
    ],
    closing: [
      "The sermon should echo through the week in prayer, conversation, and action. That usually requires intentional systems, not just hope.",
      "When churches connect preaching to a practical discipleship rhythm, people are more likely to remember, apply, and keep growing together.",
    ],
  },
  {
    slug: "what-new-believers-need-most-in-their-first-month-of-following-jesus",
    title: "What new believers need most in their first month of following Jesus",
    excerpt:
      "Clarity, language, community, and simple next steps matter more than complexity when someone is just getting started.",
    category: "Discipleship",
    date: "March 14, 2026",
    author: "Christian Study Guide Team",
    readingTime: "6 min read",
    relatedHref: "/new-believers",
    relatedLabel: "Open the New Believers program",
    intro: [
      "The first month after someone begins following Jesus is often full of joy, questions, confusion, and vulnerability all at once.",
      "New believers do not primarily need a giant library. They need a trustworthy path that helps them understand the Gospel, learn new language, and take simple next steps in community.",
    ],
    sections: [
      {
        heading: "Clarity matters more than volume",
        paragraphs: [
          "A new believer can be overwhelmed quickly by too many resources, too many opinions, or too many expectations. What feels rich to a mature Christian can feel disorienting to someone just starting out.",
          "In the early days, simple guidance wins. Clear explanations of Jesus, grace, prayer, Scripture, and church life create stability.",
        ],
      },
      {
        heading: "Language needs to be explained, not assumed",
        paragraphs: [
          "Many foundational Christian words carry meaning that longtime believers forget they had to learn. Words like salvation, grace, repentance, discipleship, and sanctification should be introduced patiently and in plain speech.",
          "This is not about diluting theology. It is about making theology understandable enough to become livable.",
        ],
      },
      {
        heading: "New believers need relational anchors",
        paragraphs: [
          "Growth accelerates when a person knows who to ask, where to belong, and how to process questions without embarrassment.",
          "Healthy churches and ministries make sure early discipleship includes people as well as content.",
        ],
        bullets: [
          "A mentor or mature believer who responds with patience.",
          "A church community that feels safe and welcoming.",
          "A repeatable rhythm of Bible reading, prayer, and honest questions.",
        ],
      },
      {
        heading: "The next step should feel doable",
        paragraphs: [
          "Early discipleship becomes sustainable when it is broken into manageable practices. Read one Gospel chapter. Pray honestly. Attend church. Ask one question. Share one struggle.",
          "That kind of simplicity builds confidence. Over time, confidence becomes habit, and habit becomes maturity.",
        ],
      },
    ],
    closing: [
      "The first month matters because people are forming their first instincts about what it means to walk with Jesus.",
      "When we offer clarity, encouragement, and practical next steps, we give new believers something better than information alone. We give them a path.",
    ],
  },
];

export function getAllBlogPosts() {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
