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

type BlogSeed = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  relatedHref: string;
  relatedLabel: string;
  focus: string;
  tension: string;
  invitation: string;
  practices: string[];
};

function createGuidedPost(seed: BlogSeed): BlogPost {
  return {
    slug: seed.slug,
    title: seed.title,
    excerpt: seed.excerpt,
    category: seed.category,
    date: seed.date,
    author: "Christian Study Guide Team",
    readingTime: "5 min read",
    relatedHref: seed.relatedHref,
    relatedLabel: seed.relatedLabel,
    intro: [
      `${seed.focus} often feels more complicated in real life than it does in a sermon outline or a short social post.`,
      `Many believers live with ${seed.tension}. A healthier response starts with honesty, patience, and a clearer sense of how discipleship actually grows.`,
    ],
    sections: [
      {
        heading: "Why this matters",
        paragraphs: [
          `${seed.focus} shapes more than one moment. It affects attention, relationships, habits, and the way a person imagines God meeting them in daily life.`,
          `When this area is ignored or reduced to clichés, people can feel stuck, ashamed, or spiritually numb without knowing how to move forward.`,
        ],
      },
      {
        heading: "Common drift to avoid",
        paragraphs: [
          "One common mistake is swinging between pressure and passivity. Either we demand instant maturity from ourselves, or we assume slow growth means nothing is changing.",
          `${seed.tension} can make that cycle even worse because people begin reacting to frustration instead of receiving discipleship with steadiness.`,
        ],
      },
      {
        heading: "A steadier way forward",
        paragraphs: [
          `Scripture usually forms people through repeated patterns of grace, truth, confession, and practice. ${seed.invitation}`,
          "That kind of growth is often quieter than people expect, but it is usually more durable because it reaches the heart instead of only managing appearances.",
        ],
        bullets: seed.practices,
      },
      {
        heading: "What to do next",
        paragraphs: [
          "Choose one faithful response and stay with it long enough to notice what God is doing through repetition.",
          "The goal is not impressive performance. It is durable obedience shaped by grace, clarity, and a realistic understanding of how change happens.",
        ],
      },
    ],
    closing: [
      `${seed.focus} becomes more sustainable when it is rooted in grace instead of panic.`,
      "That is why the church needs language that is both honest about struggle and hopeful about growth in Christ.",
    ],
  };
}

const guidedPosts: BlogPost[] = [
  createGuidedPost({
    slug: "when-prayer-feels-dry-and-repetitive",
    title: "When prayer feels dry and repetitive",
    excerpt:
      "A practical reflection on spiritual dryness, repeated prayers, and how faithfulness often grows quietly.",
    category: "Prayer",
    date: "March 27, 2026",
    relatedHref: "/prayer",
    relatedLabel: "Open the Prayer page",
    focus: "Prayer",
    tension: "disappointment, distraction, and the fear that repeated prayers no longer mean anything",
    invitation:
      "The invitation is not to manufacture emotion, but to keep showing up before God with truth and dependence.",
    practices: [
      "Pray one Psalm each day for a week.",
      "Use the same short prayer prompt morning and evening.",
      "Write down one honest request and one reason for gratitude.",
    ],
  }),
  createGuidedPost({
    slug: "how-to-read-the-bible-when-you-feel-overwhelmed",
    title: "How to read the Bible when you feel overwhelmed",
    excerpt:
      "Start smaller, read slower, and trade information pressure for consistent attention to Scripture.",
    category: "Bible Study",
    date: "March 26, 2026",
    relatedHref: "/study",
    relatedLabel: "Open the Study page",
    focus: "Reading the Bible",
    tension: "too many plans, too many opinions, and too much pressure to understand everything at once",
    invitation:
      "The invitation is to move from overload toward a simple rhythm that values consistency and comprehension over speed.",
    practices: [
      "Read one chapter from a Gospel for seven days.",
      "Write one sentence about what the passage shows you about Jesus.",
      "End each reading with one prayer of response.",
    ],
  }),
  createGuidedPost({
    slug: "what-church-hurt-does-to-trust-and-how-healing-begins",
    title: "What church hurt does to trust and how healing begins",
    excerpt:
      "A sober look at disappointment, spiritual wounds, and the slow work of rebuilding trust without denial.",
    category: "Community",
    date: "March 25, 2026",
    relatedHref: "/community",
    relatedLabel: "Explore community features",
    focus: "Healing from church hurt",
    tension: "grief, defensiveness, and uncertainty about whether Christian community is still safe",
    invitation:
      "The invitation is to tell the truth about what happened while refusing to let injury have the final word over belonging.",
    practices: [
      "Name what happened without minimizing it.",
      "Talk with one trustworthy believer or counselor.",
      "Take one wise step back toward healthy Christian community.",
    ],
  }),
  createGuidedPost({
    slug: "practicing-sabbath-in-a-distracted-life",
    title: "Practicing Sabbath in a distracted life",
    excerpt:
      "Rest is more than stopping work. It is also learning to receive limits, delight, and trust.",
    category: "Formation",
    date: "March 24, 2026",
    relatedHref: "/today",
    relatedLabel: "Open Today",
    focus: "Sabbath practice",
    tension: "constant digital stimulation, productivity pressure, and guilt about resting",
    invitation:
      "The invitation is to receive rest as trustful surrender rather than as a reward for finally finishing everything.",
    practices: [
      "Choose a recurring window for unhurried worship and rest.",
      "Turn off the noisiest digital inputs for that window.",
      "Do one restful activity that cultivates gratitude instead of output.",
    ],
  }),
  createGuidedPost({
    slug: "why-christian-friendship-needs-more-than-shared-interests",
    title: "Why Christian friendship needs more than shared interests",
    excerpt:
      "Real spiritual friendship is built through presence, truthfulness, prayer, and mutual encouragement.",
    category: "Discipleship",
    date: "March 23, 2026",
    relatedHref: "/groups",
    relatedLabel: "Explore groups",
    focus: "Christian friendship",
    tension: "surface-level connection, busyness, and uncertainty about how to move from acquaintance to spiritual friendship",
    invitation:
      "The invitation is to pursue friendships that can carry honesty, prayer, and real encouragement instead of only shared preferences.",
    practices: [
      "Ask one deeper question the next time you meet with a friend.",
      "Pray together before you leave.",
      "Follow up on one burden they shared instead of letting it fade.",
    ],
  }),
  createGuidedPost({
    slug: "when-unanswered-prayer-makes-faith-feel-harder",
    title: "When unanswered prayer makes faith feel harder",
    excerpt:
      "How to stay honest with God when the silence is long and the need feels urgent.",
    category: "Prayer",
    date: "March 22, 2026",
    relatedHref: "/prayer",
    relatedLabel: "Return to Prayer",
    focus: "Unanswered prayer",
    tension: "silence, confusion, and the temptation to treat delay as indifference from God",
    invitation:
      "The invitation is to keep bringing the real ache to God while letting Scripture retrain what faithfulness looks like in waiting.",
    practices: [
      "Pray specific requests instead of vague frustration.",
      "Read a lament Psalm slowly.",
      "Ask one trusted believer to carry the burden with you in prayer.",
    ],
  }),
  createGuidedPost({
    slug: "scripture-memory-for-people-who-think-they-are-bad-at-memorizing",
    title: "Scripture memory for people who think they are bad at memorizing",
    excerpt:
      "Memorizing Scripture does not require a perfect memory. It requires repetition, patience, and a realistic plan.",
    category: "Bible Study",
    date: "March 21, 2026",
    relatedHref: "/memorize",
    relatedLabel: "Open Memorize",
    focus: "Scripture memory",
    tension: "discouragement, inconsistency, and the assumption that memorization belongs only to naturally gifted people",
    invitation:
      "The invitation is to treat memorization as patient formation rather than as a test of talent.",
    practices: [
      "Choose one short verse for the week.",
      "Say it aloud in the morning, midday, and evening.",
      "Connect the verse to one specific prayer request or struggle.",
    ],
  }),
  createGuidedPost({
    slug: "how-to-forgive-without-pretending-the-wound-was-small",
    title: "How to forgive without pretending the wound was small",
    excerpt:
      "Forgiveness is not denial. It is a costly act of obedience that can still make room for grief and boundaries.",
    category: "Discipleship",
    date: "March 20, 2026",
    relatedHref: "/topics",
    relatedLabel: "Open Topics",
    focus: "Forgiveness",
    tension: "real pain, unresolved anger, and confusion about whether forgiveness means minimizing wrong",
    invitation:
      "The invitation is to bring both the wound and the command of Christ into the same honest process instead of flattening either one.",
    practices: [
      "Name the offense truthfully before God.",
      "Pray for willingness before you feel emotional resolution.",
      "Keep wise boundaries where trust has not yet been rebuilt.",
    ],
  }),
  createGuidedPost({
    slug: "following-jesus-through-anxiety-without-spiritual-cliches",
    title: "Following Jesus through anxiety without spiritual cliches",
    excerpt:
      "A more grounded approach to fear, prayer, embodiment, and the ordinary practices that help people keep going.",
    category: "Care",
    date: "March 19, 2026",
    relatedHref: "/topics",
    relatedLabel: "Explore topic studies",
    focus: "Walking with anxiety",
    tension: "persistent fear, shame about struggling, and shallow advice that increases pressure instead of hope",
    invitation:
      "The invitation is to bring anxiety into honest prayer, wise support, and embodied rhythms instead of pretending faith cancels complexity.",
    practices: [
      "Pair a short prayer with slow breathing.",
      "Read one grounding passage such as Psalm 23 or Philippians 4.",
      "Tell one safe person what feels heavy this week.",
    ],
  }),
  createGuidedPost({
    slug: "building-a-faith-that-lasts-after-graduation",
    title: "Building a faith that lasts after graduation",
    excerpt:
      "Transitions expose habits. A durable faith after school needs intention, community, and a plan for ordinary life.",
    category: "Discipleship",
    date: "March 18, 2026",
    relatedHref: "/paths",
    relatedLabel: "Open Guided Paths",
    focus: "Post-graduation faith",
    tension: "disrupted routines, new environments, and the temptation to let spiritual life drift without noticing",
    invitation:
      "The invitation is to build a few durable anchors before the new season becomes crowded with competing priorities.",
    practices: [
      "Find a church before you feel fully settled.",
      "Choose one daily Scripture and prayer rhythm.",
      "Ask one mature believer to check in with you during the transition.",
    ],
  }),
];

const featuredPosts: BlogPost[] = [
  {
    slug: "rethinking-purity-culture-with-truth-grace-and-discipleship",
    title: "Rethinking purity culture with truth, grace, and discipleship",
    excerpt:
      "A pastoral reflection on sexual integrity, shame, healing, and why discipleship has to be deeper than fear-based messaging.",
    category: "Discipleship",
    date: "March 28, 2026",
    author: "Christian Study Guide Team",
    readingTime: "7 min read",
    relatedHref: "/theology",
    relatedLabel: "Explore theology and formation topics",
    intro: [
      "Many Christians use the phrase purity culture to describe a set of messages about sex, holiness, dating, modesty, and worth that shaped churches, youth ministries, and families for years.",
      "Some of those messages came from a sincere desire to honor God. But in many settings, the result was a culture driven more by fear, shame, and image management than by mature discipleship in Christ.",
    ],
    sections: [
      {
        heading: "The problem was not calling people to holiness",
        paragraphs: [
          "Scripture does call believers to holiness, self-control, and sexual integrity. The problem was often not the existence of moral conviction, but the way conviction was framed and enforced.",
          "When holiness is reduced to rule-keeping, external performance, or a narrow focus on virginity, people can learn to manage appearances without learning how desire, repentance, grace, and sanctification actually work.",
        ],
      },
      {
        heading: "Fear and shame are weak discipleship tools",
        paragraphs: [
          "Fear can produce short-term conformity, but it rarely produces lasting spiritual maturity. Shame can silence people, but it does not teach them how to confess, heal, and walk in the light.",
          "A fear-based framework often leaves people unprepared for real temptation, real failure, and real complexity. When they do struggle, they may assume they are permanently damaged rather than invited into repentance and restoration.",
        ],
        bullets: [
          "People may hide sin instead of confessing it.",
          "Survivors of abuse may carry false guilt for what was done to them.",
          "Married life can feel confusing when desire was only discussed as danger.",
        ],
      },
      {
        heading: "Sexual ethics need a larger Gospel framework",
        paragraphs: [
          "Christian teaching about sex makes more sense when it is placed inside the larger story of creation, covenant, embodiment, sin, redemption, and hope. Without that framework, the message can shrink into a list of warnings.",
          "The Gospel gives a deeper vision. Our bodies matter. Holiness matters. Sin is serious. Grace is real. No one is beyond repentance, and no one’s worth is determined by sexual history.",
        ],
      },
      {
        heading: "Healing requires honesty and patience",
        paragraphs: [
          "Many people are still untangling how purity culture affected their relationship with God, their bodies, dating, marriage, or the church. Some need to grieve bad teaching. Some need to relearn trust. Some need careful pastoral care.",
          "Churches should make room for truthful conversation without panic. That means listening well, distinguishing biblical conviction from cultural baggage, and refusing to treat hard questions as rebellion.",
        ],
      },
      {
        heading: "A better path is whole-life discipleship",
        paragraphs: [
          "A healthier approach to sexual ethics forms the whole person. It teaches theology, cultivates wisdom, and helps people practice confession, boundaries, community, and dependence on the Spirit.",
          "That kind of discipleship is more demanding than slogans, but it is also more humane. It aims not merely at image preservation, but at deep obedience shaped by grace.",
        ],
      },
    ],
    closing: [
      "The answer to harmful purity culture is not abandoning holiness. It is recovering a more biblical, more honest, and more grace-filled vision of holiness in Christ.",
      "When churches tell the truth about sin and the truth about grace at the same time, people have a better chance of finding both conviction and healing.",
    ],
  },
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

export const blogPosts: BlogPost[] = [...featuredPosts, ...guidedPosts];

export function getAllBlogPosts() {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
