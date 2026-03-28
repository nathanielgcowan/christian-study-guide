'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { User } from '@supabase/supabase-js';
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Copy,
  Share2,
  Loader2,
  Languages,
  Clock,
  AlertCircle,
  CheckCircle,
  Heart,
  Home,
  PenTool,
  PlayCircle,
  Volume2,
  Users,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  logStudySession,
  getNotesForReference,
  getMentorHistory,
  saveNote,
  saveStudySession,
  saveMentorHistory,
} from '@/lib/persistence';

const NotesPanel = dynamic(() => import('@/components/NotesPanel'), {
  loading: () => (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin text-[#1e40af]" />
        Loading notes...
      </div>
    </div>
  ),
});

const AuthModal = dynamic(() => import('@/components/AuthModal'));

const translations = [
  { code: 'web', name: 'World English Bible' },
  { code: 'kjv', name: 'King James Version' },
  { code: 'asv', name: 'American Standard Version' },
];

interface PassageData {
  reference: string;
  text: string;
}

interface DevotionalContent {
  devotional: string;
  reflectionQuestions: string[];
  prayer: string;
  journalPrompts: string[];
  actionStep: string;
}

interface GroupStudyContent {
  studyTitle: string;
  fifteenMinuteStudy: string[];
  discussionQuestions: string[];
  youthLesson: string;
  sermonOutlineStarter: string[];
  familyDevotion: string;
}

interface CrossReference {
  verse: string;
  reason: string;
}

interface HistoricalContext {
  author: string;
  date: string;
  audience: string;
  historical: string;
  background: string;
  timeline: string;
}

interface OriginalLanguageTerm {
  language: 'Greek' | 'Hebrew' | 'Aramaic';
  word: string;
  transliteration: string;
  pronunciation: string;
  meaning: string;
  usage: string;
  otherVerses: string[];
  rootFamily: string;
  morphology: string;
  lexicalRange: string[];
  theologicalDepth: string;
}

interface SermonBuilderContent {
  sermonOutline: string[];
  keyPoints: string[];
  illustrations: string[];
  discussionQuestions: string[];
  prayer: string;
}

interface MentorResponse {
  title: string;
  guidance: string;
  suggestedPassages: string[];
  nextSteps: string[];
  encouragement: string;
}

interface QuizContent {
  questions: string[];
  answers: string[];
  memoryPrompt: string;
}

interface PrayerModeContent {
  confession: string;
  gratitude: string;
  intercession: string;
  surrender: string;
}

interface MentorJourney {
  title: string;
  duration: string;
  steps: string[];
}

interface CommentaryPerspective {
  label: string;
  summary: string;
}

interface VerseBreakdownItem {
  label: string;
  snippet: string;
  insight: string;
  application: string;
}

interface FamilyModeContent {
  bigIdea: string;
  familyTalkQuestion: string;
  kidFriendlyPrayer: string;
  activity: string;
}

interface ApologeticsContent {
  question: string;
  response: string;
  supportingIdeas: string[];
}

interface MentorThreadEntry {
  id: string;
  prompt: string;
  title: string;
  createdAt: string;
}

type Tradition =
  | 'overview'
  | 'baptist'
  | 'reformed'
  | 'non-denominational'
  | 'catholic';


const getPassageTheme = (ref: string) => {
  const reference = ref.toLowerCase();

  if (reference.includes('3:16') || reference.includes('john')) {
    return {
      title: "God's love",
      emphasis: 'receiving and reflecting the love of God',
      action: 'show Christlike love to one specific person',
    };
  }

  if (reference.includes('8:28') || reference.includes('romans 8')) {
    return {
      title: 'steady hope',
      emphasis: 'trusting God in confusing or painful seasons',
      action: 'surrender one unresolved burden to God in prayer each day',
    };
  }

  if (reference.includes('2:8') || reference.includes('ephesians')) {
    return {
      title: 'grace',
      emphasis: 'resting in what God has done rather than striving',
      action: 'thank God daily for grace instead of measuring yourself by performance',
    };
  }

  if (reference.includes('psalm 23') || reference.includes('23:')) {
    return {
      title: "God's shepherding care",
      emphasis: 'walking with confidence because God is near',
      action: 'pause in anxious moments and name one way God is providing for you',
    };
  }

  return {
    title: 'faithful obedience',
    emphasis: 'letting Scripture shape your next step',
    action: 'put one truth from this passage into practice in a visible way',
  };
};

const getReflectionQuestions = (ref: string): string[] => {
  const reference = ref.toLowerCase();

  if (reference.includes('3:16')) {
    return [
      "What does this passage show you about the depth of God's love?",
      'Where do you need to receive that love personally instead of just understanding it intellectually?',
      'How does this verse reshape the way you see your worth and identity today?',
    ];
  }

  if (reference.includes('8:28') || reference.includes('romans 8')) {
    return [
      'What circumstance feels hardest to trust God with right now?',
      'How does this passage invite you to see suffering through the lens of hope?',
      'What would trust-filled obedience look like this week?',
    ];
  }

  return [
    "What does this passage reveal about God's character?",
    'What part of this passage feels most personal to your current season?',
    'What is one practical step of obedience this text invites you to take?',
  ];
};

const getTraditionPerspective = (tradition: Tradition) => {
  switch (tradition) {
    case 'baptist':
      return 'with an emphasis on personal faith, conversion, and obedience';
    case 'reformed':
      return 'with an emphasis on God’s sovereignty, grace, and covenant faithfulness';
    case 'non-denominational':
      return 'with a simple Christ-centered emphasis on practical discipleship';
    case 'catholic':
      return 'with attention to spiritual formation, historic faith, and life in the Church';
    default:
      return 'with a broad Christian overview for everyday believers';
  }
};

const buildDevotionalContent = (
  currentPassage: PassageData,
  slug: string
): DevotionalContent => {
  const reference = currentPassage.reference || slug;
  const theme = getPassageTheme(reference);
  const passagePreview = currentPassage.text.replace(/\s+/g, ' ').trim();
  const excerpt =
    passagePreview.length > 180
      ? `${passagePreview.slice(0, 177).trim()}...`
      : passagePreview;

  return {
    devotional: `Spend a few quiet moments with ${reference}. This passage draws your attention to ${theme.title} and invites you into ${theme.emphasis}. As you sit with these words, notice how God is not only giving truth to understand, but grace to live by. Let "${excerpt}" move from something you read into something you carry with you today.`,
    reflectionQuestions: getReflectionQuestions(reference),
    prayer: `Father, thank You for speaking through ${reference}. Write this truth deeper into my heart and help me respond with faith, humility, and obedience. Shape my thoughts, words, and habits so this passage changes the way I live this week. In Jesus' name, Amen.`,
    journalPrompts: [
      `What phrase from ${reference} stayed with me most, and why?`,
      `Where is God inviting me to trust Him more fully through this passage?`,
      `What would it look like to live out this truth before the week is over?`,
    ],
    actionStep: `Weekly action step: ${theme.action}. Set aside one intentional moment each day this week to revisit ${reference} and ask God to help you live it out.`,
  };
};

const buildQuizContent = (passageRef: string): QuizContent => {
  const reflectionQuestions = getReflectionQuestions(passageRef);

  return {
    questions: [
      `What does ${passageRef} reveal about God's character?`,
      `What truth from ${passageRef} should shape the way you live this week?`,
      reflectionQuestions[0],
    ],
    answers: [
      'It shows that God is trustworthy, present, and active in the lives of His people.',
      'A faithful answer will name one practical step of obedience connected to the passage.',
      'A strong answer should connect the passage to a real current struggle or opportunity for trust.',
    ],
    memoryPrompt: `Read ${passageRef} aloud three times, cover one phrase, and repeat it from memory before checking again.`,
  };
};

const buildPrayerModeContent = (passageRef: string): PrayerModeContent => {
  const theme = getPassageTheme(passageRef);

  return {
    confession: `Lord, where I have resisted ${theme.title} or ignored what You are showing me through ${passageRef}, I confess it. Forgive my fear, pride, distraction, and slow obedience.`,
    gratitude: `Father, thank You for speaking clearly through ${passageRef}. Thank You that Your Word is not distant from my real life, but full of grace, direction, and hope for this very week.`,
    intercession: `Please use ${passageRef} to strengthen my family, friends, church, and anyone carrying the same need for ${theme.title}. Let this truth become encouragement for someone besides me.`,
    surrender: `I surrender my plans, worries, and reactions to You. Help me live out ${theme.action} and trust that Your Spirit can make this passage fruitful in ordinary life.`,
  };
};

const buildCommentaryCompare = (
  passageRef: string
): CommentaryPerspective[] => [
  {
    label: 'Overview',
    summary: `${passageRef} calls everyday believers to trust God, understand His character, and respond with practical obedience.`,
  },
  {
    label: 'Baptist',
    summary: `${passageRef} highlights personal faith, conversion-shaped living, and a clear call to respond to God in obedience.`,
  },
  {
    label: 'Reformed',
    summary: `${passageRef} can be read with an emphasis on God's sovereignty, grace, covenant faithfulness, and His work in forming His people.`,
  },
  {
    label: 'Non-denominational',
    summary: `${passageRef} speaks directly to discipleship, spiritual growth, and living a Christ-centered life in ordinary circumstances.`,
  },
  {
    label: 'Catholic',
    summary: `${passageRef} can be read through the lens of spiritual formation, historic Christian practice, and faith lived within the Church.`,
  },
];

const buildVerseBreakdown = (passage: PassageData): VerseBreakdownItem[] => {
  const parts = passage.text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  const theme = getPassageTheme(passage.reference);

  if (parts.length === 0) {
    return [
      {
        label: `${passage.reference} insight`,
        snippet: passage.text,
        insight: `This passage draws attention to ${theme.title} and shows how God speaks into real life, not abstract religion.`,
        application: `Ask where ${theme.title} needs to shape your week in visible ways.`,
      },
    ];
  }

  return parts.map((part, index) => ({
    label: `Step ${index + 1}`,
    snippet: part,
    insight:
      index === 0
        ? `This opening movement introduces ${theme.title} and sets the tone for understanding the whole passage.`
        : index === parts.length - 1
          ? 'This closing movement turns truth toward response and invites a practical next step.'
          : 'This part deepens the main idea and helps the passage move from meaning into application.',
    application:
      index === 0
        ? 'Write one phrase here that reveals something true about God.'
        : 'Ask how this sentence should affect your attitude, decision, or prayer today.',
  }));
};

const buildFamilyModeContent = (passageRef: string): FamilyModeContent => {
  const theme = getPassageTheme(passageRef);

  return {
    bigIdea: `${passageRef} teaches families that God helps His people live with ${theme.title}.`,
    familyTalkQuestion: `What is one simple way our home can practice ${theme.title} this week?`,
    kidFriendlyPrayer: `Jesus, thank You for loving our family and teaching us through ${passageRef}. Help us trust You, obey You, and encourage each other this week. Amen.`,
    activity: `Read ${passageRef} together, let each person repeat one short phrase they remember, then draw or write one way to live it out before next Sunday.`,
  };
};

const buildApologeticsContent = (passageRef: string): ApologeticsContent => ({
  question: `What if someone says ${passageRef} sounds unrealistic or too simplistic for the real world?`,
  response: `${passageRef} should not be read as pretending suffering, doubt, or complexity do not exist. Instead, it speaks into real human need with a God-centered answer. An apologetics reading asks not only whether the passage sounds difficult, but whether Scripture offers a deeper and more coherent account of hope, truth, suffering, sin, and redemption than the alternatives around us.`,
  supportingIdeas: [
    'Christianity is not built on wishful thinking, but on a historical and theological claim about God acting in Christ.',
    'The passage should be interpreted within the whole biblical story, not isolated from the gospel.',
    'A hard question often becomes clearer when we ask what worldview best explains human dignity, brokenness, and hope.',
  ],
});

const buildGroupStudyContent = (
  currentPassage: PassageData,
  slug: string
): GroupStudyContent => {
  const reference = currentPassage.reference || slug;
  const theme = getPassageTheme(reference);
  const reflectionQuestions = getReflectionQuestions(reference);

  return {
    studyTitle: `${reference} in Simple, Everyday Language`,
    fifteenMinuteStudy: [
      `1. Welcome and frame the passage in one sentence: today we are looking at ${theme.title} through ${reference}.`,
      `2. Read the passage out loud together and ask everyone to notice one word or phrase that stands out.`,
      `3. Explain the main idea simply: this passage calls us into ${theme.emphasis}.`,
      `4. Use one reflection question for group sharing: ${reflectionQuestions[0]}`,
      `5. Close with one action and prayer: ${theme.action}. Finish by praying the truth of the passage back to God.`,
    ],
    discussionQuestions: [
      reflectionQuestions[0],
      reflectionQuestions[1],
      'What would it look like for our group to practice this passage together this week?',
      'Who else might need encouragement from this truth right now?',
    ],
    youthLesson: `Youth lesson idea: start with a real-life scenario about pressure, identity, or belonging, then connect it to ${reference}. Keep the teaching focused on ${theme.title}, ask students where this truth meets real life, and end by inviting them to take one visible step of faith this week.`,
    sermonOutlineStarter: [
      `Big idea: ${reference} teaches us to live with ${theme.title}.`,
      `Point 1: What this passage reveals about God.`,
      `Point 2: What this passage reveals about the human heart.`,
      `Point 3: How the gospel reshapes our response this week.`,
      `Closing application: ${theme.action}.`,
    ],
    familyDevotion: `Family devotion: read ${reference} together, let each person share one phrase they noticed, explain in simple language that this passage is about ${theme.title}, then ask, "How can our home live this out this week?" End with a short prayer thanking God for His help and presence.`,
  };
};

const getCrossReferences = (ref: string): CrossReference[] => {
  const reference = ref.toLowerCase();

  if (reference.includes('romans 5:1')) {
    return [
      {
        verse: 'John 3:16',
        reason:
          'Both passages center on salvation through faith and the peace with God that comes through Jesus.',
      },
      {
        verse: 'Ephesians 2:8-9',
        reason:
          'Ephesians 2:8-9 explains that justification is received by grace through faith, which matches the foundation of Romans 5:1.',
      },
      {
        verse: 'Galatians 2:16',
        reason:
          'Galatians 2:16 reinforces that people are made right with God through faith in Christ rather than by works of the law.',
      },
    ];
  }

  if (reference.includes('3:16') || reference.includes('john')) {
    return [
      {
        verse: 'Romans 5:8',
        reason:
          "Romans 5:8 expands on God's love by showing that Christ died for us while we were still sinners.",
      },
      {
        verse: 'Ephesians 2:8-9',
        reason:
          'This passage connects the gift of eternal life in John 3:16 with salvation by grace through faith.',
      },
      {
        verse: '1 John 4:9-10',
        reason:
          '1 John 4:9-10 echoes John 3:16 by describing God showing His love through sending His Son.',
      },
    ];
  }

  if (reference.includes('8:28') || reference.includes('romans 8')) {
    return [
      {
        verse: 'Romans 8:38-39',
        reason:
          'These verses continue the same chapter and ground Romans 8 hope in the unbreakable love of God.',
      },
      {
        verse: 'James 1:2-4',
        reason:
          'James shows how God uses trials to mature believers, which complements the promise that He works all things for good.',
      },
      {
        verse: 'Genesis 50:20',
        reason:
          'Genesis 50:20 gives a concrete example of God turning human evil toward redemptive purposes.',
      },
    ];
  }

  if (reference.includes('2:8') || reference.includes('ephesians')) {
    return [
      {
        verse: 'Romans 3:23-24',
        reason:
          'Romans 3:23-24 explains humanity’s need for grace and God’s gift of justification through Christ.',
      },
      {
        verse: 'Titus 3:5',
        reason:
          'Titus 3:5 reinforces that salvation is not earned by righteous deeds but given by God’s mercy.',
      },
      {
        verse: 'Galatians 2:21',
        reason:
          'Galatians 2:21 emphasizes that grace would be emptied of meaning if righteousness came by the law.',
      },
    ];
  }

  if (reference.includes('psalm 23') || reference.includes('23:')) {
    return [
      {
        verse: 'John 10:11',
        reason:
          'Jesus identifies Himself as the Good Shepherd, deepening the shepherd imagery of Psalm 23.',
      },
      {
        verse: 'Isaiah 41:10',
        reason:
          'Isaiah 41:10 connects with Psalm 23 by emphasizing God’s nearness, help, and steady presence.',
      },
      {
        verse: 'Philippians 4:19',
        reason:
          'Philippians 4:19 mirrors the theme of God’s provision that runs through Psalm 23.',
      },
    ];
  }

  return [
    {
      verse: 'John 3:16',
      reason:
        'This passage connects through the broader gospel story of God’s love and salvation in Christ.',
    },
    {
      verse: '2 Timothy 3:16-17',
      reason:
        '2 Timothy 3:16-17 helps frame how all Scripture teaches, corrects, and equips believers for faithful living.',
    },
    {
      verse: 'James 1:22',
      reason:
        'James 1:22 reinforces the move from hearing God’s Word to actually living it out.',
    },
  ];
};

const getHistoricalContext = (ref: string): HistoricalContext => {
  const reference = ref.toLowerCase();

  if (reference.includes('1 corinthians') || reference.includes('corinthians')) {
    return {
      author: 'Apostle Paul',
      date: 'Around AD 55',
      audience: 'The church in Corinth',
      historical: 'Corinth was a wealthy port city known for status-seeking, division, and moral compromise.',
      background: 'Paul wrote to address church conflict, sexual immorality, misuse of spiritual gifts, and confusion about resurrection.',
      timeline: "Written during Paul's third missionary journey, likely from Ephesus.",
    };
  }

  if (reference.includes('romans')) {
    return {
      author: 'Apostle Paul',
      date: 'Around AD 57',
      audience: 'Christians in Rome, both Jewish and Gentile believers',
      historical: 'The Roman church lived in the center of the empire and faced tension over identity, law, and unity.',
      background: 'Paul wrote to explain the gospel clearly, show the righteousness of God, and unify believers around faith in Christ.',
      timeline: "Written near the end of Paul's third missionary journey, likely before traveling to Jerusalem.",
    };
  }

  if (reference.includes('3:16') || reference.includes('john')) {
    return {
      author: 'Apostle John',
      date: 'Around AD 85-95',
      audience: 'Early Christian communities',
      historical: 'John wrote near the end of the first century when the church was facing pressure, confusion, and false teaching.',
      background: 'The Gospel of John was written to help people believe that Jesus is the Son of God and find life in Him.',
      timeline: 'One of the later New Testament books, written after the life, death, and resurrection of Jesus.',
    };
  }

  if (reference.includes('ephesians')) {
    return {
      author: 'Apostle Paul',
      date: 'Around AD 60-62',
      audience: 'The church in Ephesus and likely nearby believers',
      historical: 'Ephesus was a major city shaped by trade, pagan worship, and spiritual tension.',
      background: 'Paul emphasizes the believer’s identity in Christ, unity in the church, and daily spiritual maturity.',
      timeline: "Written during Paul's first Roman imprisonment.",
    };
  }

  if (reference.includes('psalm')) {
    return {
      author: 'Primarily David and other worship leaders of Israel',
      date: 'Written across many centuries, roughly 1000-400 BC',
      audience: 'The people of Israel in worship and prayer',
      historical: 'The Psalms were used in personal devotion and public worship across many different seasons of Israel’s history.',
      background: 'They give language for praise, lament, trust, repentance, and hope in God.',
      timeline: 'Collected over time and used throughout Israel’s worship life before the New Testament era.',
    };
  }

  return {
    author: 'Biblical author depends on the book being studied',
    date: 'Written within the broader biblical timeline',
    audience: 'The original readers or hearers of that book',
    historical: 'Each book was written in a real historical setting with real people, pressures, and purposes.',
    background: 'Understanding the original setting helps beginners read the passage more clearly and apply it more wisely.',
    timeline: 'This passage fits into the larger story of creation, Israel, Christ, and the early church.',
  };
};

const getOriginalLanguageInfo = (ref: string): OriginalLanguageTerm[] => {
  const reference = ref.toLowerCase();

  if (reference.includes('john 21:15')) {
    return [
      {
        language: 'Greek',
        word: 'agapas (ἀγαπᾷς)',
        transliteration: 'agapao',
        pronunciation: 'ah-gah-PAHS',
        meaning: 'Self-giving, devoted love',
        usage: 'In John 21:15, Jesus uses this form of agapao when asking Peter about wholehearted love and loyalty.',
        otherVerses: ['John 3:16', 'Ephesians 5:25', '1 John 4:10'],
        rootFamily: 'agapao / agape love vocabulary',
        morphology: 'Present active indicative, second-person singular',
        lexicalRange: ['love', 'devotion', 'self-giving loyalty'],
        theologicalDepth:
          'This form sharpens the restoration scene by centering covenant-shaped love, not mere affection. Jesus presses Peter toward costly, shepherd-like devotion.',
      },
    ];
  }

  if (reference.includes('3:16') || reference.includes('john')) {
    return [
      {
        language: 'Greek',
        word: 'agape (ἀγάπη)',
        transliteration: 'agape',
        pronunciation: 'ah-GAH-pay',
        meaning: 'Self-sacrificial, unconditional love',
        usage: 'This word highlights God’s initiating, generous love rather than a merely emotional feeling.',
        otherVerses: ['Romans 5:8', '1 John 4:9-10', 'Ephesians 2:4-5'],
        rootFamily: 'agapao / agape love vocabulary',
        morphology: 'Noun describing the character of love',
        lexicalRange: ['love', 'charity', 'sacrificial affection'],
        theologicalDepth:
          'Agape helps readers see that salvation flows from God’s initiating character. The emphasis is not simply intensity of feeling, but covenant mercy expressed in action.',
      },
    ];
  }

  if (reference.includes('romans 5:1') || reference.includes('romans')) {
    return [
      {
        language: 'Greek',
        word: 'dikaiothentes (δικαιωθέντες)',
        transliteration: 'dikaioo',
        pronunciation: 'dee-kai-oh-THEN-tes',
        meaning: 'Having been justified, declared righteous',
        usage: 'Paul uses this term to describe believers being declared right with God through faith in Christ.',
        otherVerses: ['Galatians 2:16', 'Romans 3:24', 'Titus 3:7'],
        rootFamily: 'dikaioo / dikaios / dikaiosyne righteousness vocabulary',
        morphology: 'Aorist passive participle, nominative plural',
        lexicalRange: ['justify', 'declare righteous', 'vindicate'],
        theologicalDepth:
          'The passive form underscores that justification is received, not achieved. Paul is grounding peace with God in a finished verdict from God Himself.',
      },
    ];
  }

  if (reference.includes('psalm')) {
    return [
      {
        language: 'Hebrew',
        word: 'hesed (חֶסֶד)',
        transliteration: 'hesed',
        pronunciation: 'HEH-sed',
        meaning: 'Steadfast love, covenant mercy',
        usage: 'This word often describes God’s faithful love toward His people across the Psalms.',
        otherVerses: ['Psalm 23:6', 'Psalm 136:1', 'Lamentations 3:22'],
        rootFamily: 'hesed covenant-faithfulness vocabulary',
        morphology: 'Hebrew noun describing covenant loyalty',
        lexicalRange: ['steadfast love', 'mercy', 'loyal kindness', 'covenant faithfulness'],
        theologicalDepth:
          'Hesed gives the Psalms their covenant texture. It points beyond momentary help to God’s enduring, relational faithfulness toward His people.',
      },
    ];
  }

  return [
    {
      language: 'Greek',
      word: 'logos (λόγος)',
      transliteration: 'logos',
      pronunciation: 'LOH-gos',
      meaning: 'Word, message, divine expression',
      usage: 'A helpful starter term for seeing how Scripture often ties God’s Word to truth, revelation, and promise.',
      otherVerses: ['John 1:1', 'Hebrews 4:12', '2 Timothy 2:15'],
      rootFamily: 'logos / lego speaking and message vocabulary',
      morphology: 'Greek noun with a broad semantic range',
      lexicalRange: ['word', 'message', 'reason', 'speech'],
      theologicalDepth:
        'Logos can carry more than verbal content. In key passages it becomes a doorway into revelation, wisdom, and the self-disclosure of God.',
    },
  ];
};

const buildSermonBuilderContent = (
  topic: string,
  passageRef: string,
  audience: string,
  tradition: Tradition
): SermonBuilderContent => {
  const theme = getPassageTheme(`${topic} ${passageRef}`);
  const reflectionQuestions = getReflectionQuestions(passageRef);
  const normalizedAudience = audience.trim() || 'small group';
  const normalizedTopic = topic.trim() || theme.title;
  const traditionPerspective = getTraditionPerspective(tradition);

  return {
    sermonOutline: [
      `Opening: introduce ${normalizedTopic} through ${passageRef} and name why it matters for a ${normalizedAudience}.`,
      `Point 1: What ${passageRef} teaches about God in the middle of real-life pressure.`,
      `Point 2: How this passage reframes struggle, growth, and obedience.`,
      `Point 3: What faithful response looks like for this audience this week ${traditionPerspective}.`,
      `Closing call: invite the group to trust God through ${theme.emphasis}.`,
    ],
    keyPoints: [
      `${passageRef} shows that God uses trials to form maturity, not waste pain.`,
      `${normalizedTopic} grows when believers see hardship through God's perspective instead of only their feelings.`,
      `A ${normalizedAudience} needs practical next-step obedience, not just information.`,
    ],
    illustrations: [
      'Strength training builds endurance through resistance, not comfort.',
      'A tree deepens its roots when strong winds force it to hold fast.',
      `Use a relatable ${normalizedAudience} example from school, work, friendship, or family pressure to make the passage concrete.`,
    ],
    discussionQuestions: [
      `Where does ${normalizedTopic} feel hardest to practice right now?`,
      reflectionQuestions[0],
      `What pressure is this ${normalizedAudience} most likely facing that makes ${passageRef} especially relevant?`,
      'What is one action step we can take this week because of this passage?',
    ],
    prayer: `Lord, thank You for speaking through ${passageRef}. Teach this ${normalizedAudience} to live with courage, endurance, and trust. Use this message on ${normalizedTopic} to lead us toward deeper faith and faithful obedience this week. Amen.`,
  };
};

const buildMentorResponse = (
  prompt: string,
  passageRef: string,
  tradition: Tradition
): MentorResponse => {
  const lowerPrompt = prompt.toLowerCase().trim();
  const reflectionQuestions = getReflectionQuestions(passageRef);
  const traditionPerspective = getTraditionPerspective(tradition);

  if (lowerPrompt.includes('anxiety') || lowerPrompt.includes('worry')) {
    return {
      title: 'Biblical Perspective on Anxiety',
      guidance: `Anxiety is not something to hide from God. Scripture invites you to bring your fears honestly into His presence and to exchange panic for trust. ${passageRef} reminds you that God is still at work even when your emotions feel unsettled. A biblical response to anxiety includes prayer, honest dependence, and filling your mind with what is true about God's character ${traditionPerspective}.`,
      suggestedPassages: ['Philippians 4:6-8', 'Matthew 6:25-34', '1 Peter 5:7'],
      nextSteps: [
        'Set aside five minutes each day this week to name your worries to God in prayer.',
        'Write one truth from Scripture on your phone lock screen or a note card.',
        `Reflect on this question: ${reflectionQuestions[0]}`,
      ],
      encouragement:
        'You are not failing because you feel anxious. God meets people in weakness and teaches them to trust Him one step at a time.',
    };
  }

  if (lowerPrompt.includes('prayer habit') || lowerPrompt.includes('pray more')) {
    return {
      title: 'Building a Prayer Habit',
      guidance: `A healthy prayer habit grows through consistency more than intensity. Start small, connect prayer to a daily rhythm, and use ${passageRef} as a prompt for conversation with God. Prayer becomes sustainable when it is honest, simple, and rooted in Scripture rather than guilt ${traditionPerspective}.`,
      suggestedPassages: ['Luke 11:1-4', 'Psalm 5:3', '1 Thessalonians 5:16-18'],
      nextSteps: [
        'Choose one daily anchor time like breakfast, commute, or bedtime.',
        'Pray one sentence of thanks, one sentence of confession, and one sentence of request.',
        `Use ${passageRef} to guide one short prayer each day this week.`,
      ],
      encouragement:
        'Small faithful rhythms matter. A steady prayer life is built one ordinary day at a time.',
    };
  }

  if (
    lowerPrompt.includes('study plan') ||
    lowerPrompt.includes('where should i read') ||
    lowerPrompt.includes('what should i study')
  ) {
    return {
      title: 'Suggested Study Direction',
      guidance: `A good study plan connects your current need with a manageable set of passages. Since you are already in ${passageRef}, it can help to pair this passage with a few supporting Scriptures and a simple weekly rhythm of reading, reflection, and prayer ${traditionPerspective}.`,
      suggestedPassages: [passageRef, 'Psalm 1', 'John 15', 'James 1'],
      nextSteps: [
        'Read one short passage a day for seven days instead of trying to cover too much.',
        'Write one observation, one question, and one application after each reading.',
        'End each study time by asking God what obedience looks like today.',
      ],
      encouragement:
        'You do not need a complex plan to grow. Consistent time in Scripture shapes the heart over time.',
    };
  }

  if (
    lowerPrompt.includes('discouraged') ||
    lowerPrompt.includes('tired') ||
    lowerPrompt.includes('hopeless') ||
    lowerPrompt.includes('encouragement')
  ) {
    return {
      title: 'Spiritual Encouragement',
      guidance: `God often strengthens His people by reminding them who He is before changing their circumstances. ${passageRef} can become an anchor for hope as you remember that your story is not outside His care. Biblical encouragement is not pretending things are easy; it is learning to trust God in the middle of what is hard ${traditionPerspective}.`,
      suggestedPassages: ['Isaiah 41:10', 'Psalm 34:18', 'Romans 8:31-39'],
      nextSteps: [
        'Tell God honestly where you feel discouraged today.',
        'Reach out to one trusted Christian friend for prayer this week.',
        `Meditate on ${passageRef} once in the morning and once before bed.`,
      ],
      encouragement:
        'The Lord is near to weary people. You are not alone, and this season is not unseen by Him.',
    };
  }

  return {
    title: 'Christian AI Mentor',
    guidance: `I can help you think through your question with Scripture, prayer, and practical next steps. Starting from ${passageRef}, I’ll focus on helping you grow as a disciple, not just collecting information ${traditionPerspective}.`,
    suggestedPassages: [passageRef, 'Psalm 119:105', 'James 1:5'],
    nextSteps: [
      'Ask your question as honestly and specifically as you can.',
      'Look for one truth to believe and one action step to practice.',
      'Return to the passage and pray it back to God.',
    ],
    encouragement:
      'God uses ordinary Scripture, prayer, and faithful next steps to shape deep spiritual growth.',
  };
};

const buildMentorJourney = (
  prompt: string,
  passageRef: string,
  tradition: Tradition
): MentorJourney => {
  const lowerPrompt = prompt.toLowerCase();
  const traditionPerspective = getTraditionPerspective(tradition);

  if (lowerPrompt.includes('anxiety') || lowerPrompt.includes('worry')) {
    return {
      title: '7-Day Peace Journey',
      duration: '7 days',
      steps: [
        'Day 1: Read Philippians 4:6-8 and write down your biggest current worry.',
        'Day 2: Pray Matthew 6:25-34 aloud and name one area where you need daily trust.',
        'Day 3: Return to the current passage and list what it says about God, not just about your feelings.',
        'Day 4: Reach out to one trusted Christian friend and ask for prayer.',
        'Day 5: Replace one anxious thought with one specific Scripture truth.',
        'Day 6: Take one practical act of obedience instead of spiraling into fear.',
        `Day 7: Review what God has been teaching you ${traditionPerspective}.`,
      ],
    };
  }

  if (lowerPrompt.includes('prayer')) {
    return {
      title: '7-Day Prayer Habit Journey',
      duration: '7 days',
      steps: [
        'Day 1: Choose one anchor time for prayer and keep it small.',
        `Day 2: Use ${passageRef} to guide one short prayer of gratitude.`,
        'Day 3: Add one minute of silence before you begin praying.',
        'Day 4: Write down three requests in your prayer journal.',
        'Day 5: Pray for one other person by name.',
        'Day 6: End your prayer time by asking for one act of obedience.',
        `Day 7: Reflect on what made prayer feel more natural ${traditionPerspective}.`,
      ],
    };
  }

  return {
    title: '7-Day Discipleship Journey',
    duration: '7 days',
    steps: [
      `Day 1: Read ${passageRef} slowly and write one honest takeaway.`,
      'Day 2: Ask one question about the passage and bring it to God in prayer.',
      'Day 3: Revisit the historical context and cross references.',
      'Day 4: Practice one memory prompt from this study.',
      'Day 5: Share one insight with a friend, group, or family member.',
      'Day 6: Take one concrete action step flowing from the passage.',
      `Day 7: Review what God has highlighted for you ${traditionPerspective}.`,
    ],
  };
};

export default function PassageStudy() {
  const params = useParams();
  const slug = (params.reference as string)?.toLowerCase() || '';

  // Bible & Display
  const [passage, setPassage] = useState<PassageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState('web');

  // Persistence
  const [isSaved, setIsSaved] = useState(false);
  const [notesCount, setNotesCount] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState('');

  // Authentication
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [supabase] = useState(() => createClient());

  // UI
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [studyStartTime] = useState(Date.now());
  const [devotionalContent, setDevotionalContent] =
    useState<DevotionalContent | null>(null);
  const [groupStudyContent, setGroupStudyContent] =
    useState<GroupStudyContent | null>(null);
  const [builderTopic, setBuilderTopic] = useState('Faith during trials');
  const [builderAudience, setBuilderAudience] = useState('Youth group');
  const [sermonBuilderContent, setSermonBuilderContent] =
    useState<SermonBuilderContent | null>(null);
  const [quizContent, setQuizContent] = useState<QuizContent | null>(null);
  const [prayerModeContent, setPrayerModeContent] =
    useState<PrayerModeContent | null>(null);
  const [commentaryCompare, setCommentaryCompare] = useState<CommentaryPerspective[]>([]);
  const [verseBreakdown, setVerseBreakdown] = useState<VerseBreakdownItem[]>([]);
  const [familyModeContent, setFamilyModeContent] = useState<FamilyModeContent | null>(
    null
  );
  const [apologeticsContent, setApologeticsContent] =
    useState<ApologeticsContent | null>(null);
  const [showQuizAnswers, setShowQuizAnswers] = useState(false);
  const [studyTradition, setStudyTradition] = useState<Tradition>('overview');
  const [selectedMode, setSelectedMode] = useState('overview');
  const [shareFeedback, setShareFeedback] = useState('');
  const [studySaveFeedback, setStudySaveFeedback] = useState('');
  const [mentorDraftPrompt, setMentorDraftPrompt] = useState(
    'Help me understand anxiety from a Biblical perspective.'
  );
  const [mentorPrompt, setMentorPrompt] = useState(
    'Help me understand anxiety from a Biblical perspective.'
  );
  const [mentorResponse, setMentorResponse] = useState<MentorResponse | null>(null);
  const [mentorJourney, setMentorJourney] = useState<MentorJourney | null>(null);
  const [mentorThreadEntries, setMentorThreadEntries] = useState<MentorThreadEntry[]>([]);
  const [mentorSaveFeedback, setMentorSaveFeedback] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    try {
      const savedTradition = localStorage.getItem('christian-study-guide:tradition');
      if (
        savedTradition === 'overview' ||
        savedTradition === 'baptist' ||
        savedTradition === 'reformed' ||
        savedTradition === 'non-denominational' ||
        savedTradition === 'catholic'
      ) {
        setStudyTradition(savedTradition);
      }
    } catch {}
  }, []);

  const fetchPassage = useEffectEvent(async () => {
    setLoading(true);
    setError(false);

    try {
      let apiRef = slug.replace(/-/g, ' ').trim();
      apiRef = apiRef.replace(/(\d+)\s+(\d+)\s+(\d+)/g, '$1:$2-$3');
      apiRef = apiRef.replace(/(\d+)\s+(\d+)/g, '$1:$2');
      apiRef = apiRef.replace(/\s+/g, '+');

      const res = await fetch(
        `https://bible-api.com/${apiRef}?translation=${selectedTranslation}`
      );

      if (!res.ok) throw new Error('Passage not found');

      const data = await res.json();
      setPassage(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (slug) fetchPassage();
  }, [slug, selectedTranslation]);

  useEffect(() => {
    if (passage?.reference && passage.text) {
      setDevotionalContent(buildDevotionalContent(passage, slug));
      setGroupStudyContent(buildGroupStudyContent(passage, slug));
      setSermonBuilderContent(
        buildSermonBuilderContent(
          builderTopic,
          passage.reference,
          builderAudience,
          studyTradition
        )
      );
      setQuizContent(buildQuizContent(passage.reference));
      setPrayerModeContent(buildPrayerModeContent(passage.reference));
      setCommentaryCompare(buildCommentaryCompare(passage.reference));
      setVerseBreakdown(buildVerseBreakdown(passage));
      setFamilyModeContent(buildFamilyModeContent(passage.reference));
      setApologeticsContent(buildApologeticsContent(passage.reference));
      setMentorResponse(
        buildMentorResponse(mentorPrompt, passage.reference, studyTradition)
      );
      setMentorJourney(
        buildMentorJourney(mentorPrompt, passage.reference, studyTradition)
      );
    } else {
      setDevotionalContent(null);
      setGroupStudyContent(null);
      setSermonBuilderContent(null);
      setQuizContent(null);
      setPrayerModeContent(null);
      setCommentaryCompare([]);
      setVerseBreakdown([]);
      setFamilyModeContent(null);
      setApologeticsContent(null);
      setMentorResponse(null);
      setMentorJourney(null);
    }
  }, [passage, slug, builderAudience, builderTopic, mentorPrompt, studyTradition]);

  useEffect(() => {
    const loadMentorThread = async () => {
      if (!passage?.reference) {
        setMentorThreadEntries([]);
        return;
      }

      try {
        if (user) {
          const history = (await getMentorHistory()) as Array<{
            id: string;
            reference: string;
            question: string;
            answer: string | null;
            created_at: string;
          }>;

          const filtered = history
            .filter((item) => item.reference === passage.reference)
            .slice(0, 5)
            .map((item) => {
              let parsed: { title?: string } = {};
              try {
                parsed = item.answer ? JSON.parse(item.answer) : {};
              } catch {}

              return {
                id: item.id,
                prompt: item.question,
                title: parsed.title || 'Christian AI Mentor',
                createdAt: item.created_at,
              };
            });

          setMentorThreadEntries(filtered);
        } else {
          const mentorHistory = JSON.parse(
            localStorage.getItem('christian-study-guide:mentor-history') || '[]'
          ) as Array<{
            id: string;
            reference: string;
            prompt: string;
            title: string;
            createdAt: string;
          }>;

          setMentorThreadEntries(
            mentorHistory
              .filter((item) => item.reference === passage.reference)
              .slice(0, 5)
              .map((item) => ({
                id: item.id,
                prompt: item.prompt,
                title: item.title,
                createdAt: item.createdAt,
              }))
          );
        }
      } catch {}
    };

    loadMentorThread();
  }, [passage?.reference, user]);

  useEffect(() => {
    const syncTradition = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/profile');
        if (!response.ok) return;

        const data = await response.json();
        const tradition = data?.tradition as Tradition | undefined;

        if (
          tradition === 'overview' ||
          tradition === 'baptist' ||
          tradition === 'reformed' ||
          tradition === 'non-denominational' ||
          tradition === 'catholic'
        ) {
          setStudyTradition(tradition);
          localStorage.setItem('christian-study-guide:tradition', tradition);
        }
      } catch {}
    };

    syncTradition();
  }, [user]);

  const loadUserData = useEffectEvent(async () => {
    try {
      const [bookmarksData, notesData] = await Promise.all([
        getBookmarks(),
        getNotesForReference(passage?.reference || slug),
      ]);

      setNotesCount(notesData.length);

      const isBookmarked = bookmarksData.some(
        (b: { reference: string }) => b.reference === passage?.reference
      );
      setIsSaved(isBookmarked);
    } catch {
      console.error('Error loading user data');
    }
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [passage?.reference, user]);

  useEffect(() => {
    // Log study session when user navigates away
    return () => {
      if (passage?.reference) {
        const timeSpent = Math.round((Date.now() - studyStartTime) / 60000);
        if (timeSpent > 0) {
          logStudySession(passage.reference, selectedTranslation, timeSpent).catch(
            () => {}
          );
        }
      }
    };
  }, [passage?.reference, selectedTranslation, studyStartTime]);

  const handleToggleBookmark = async () => {
    if (!passage) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (isSaved) {
        await removeBookmark(passage.reference);
        setIsSaved(false);
      } else {
        await addBookmark(passage.reference);
        setIsSaved(true);
      }
    } catch {
      alert('Failed to save bookmark');
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopyFeedback('Copied!');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const handleSharePage = async () => {
    const shareUrl = `${window.location.origin}/passage/${slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: passage?.reference || 'Christian Study Guide',
          text: `Study ${passage?.reference} with me.`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }

      setShareFeedback('Shared!');
      setTimeout(() => setShareFeedback(''), 2000);
    } catch {
      setShareFeedback('Share unavailable');
      setTimeout(() => setShareFeedback(''), 2000);
    }
  };

  const handleExportStudy = () => {
    window.print();
  };

  const handleSaveStudySession = () => {
    if (!passage) return;

    const persist = async () => {
      try {
        if (user) {
          await saveStudySession(
            passage.reference,
            selectedMode,
            `Saved from ${selectedMode} mode with ${studyTradition} tradition selected.`
          );
        } else {
          const existingSessions = JSON.parse(
            localStorage.getItem('christian-study-guide:saved-sessions') || '[]'
          ) as Array<{
            id: string;
            reference: string;
            createdAt: string;
            mode: string;
            summary: string;
          }>;

          const nextSession = {
            id: `${passage.reference}-${Date.now()}`,
            reference: passage.reference,
            createdAt: new Date().toISOString(),
            mode: selectedMode,
            summary: `Saved from ${selectedMode} mode with ${studyTradition} tradition selected.`,
          };

          localStorage.setItem(
            'christian-study-guide:saved-sessions',
            JSON.stringify([nextSession, ...existingSessions].slice(0, 30))
          );
          const existingActivity = JSON.parse(
            localStorage.getItem('christian-study-guide:activity-timeline') || '[]'
          ) as Array<Record<string, unknown>>;
          localStorage.setItem(
            'christian-study-guide:activity-timeline',
            JSON.stringify([
              {
                id: `study-session-${Date.now()}`,
                event_type: 'study_session_saved',
                reference: passage.reference,
                metadata: {
                  mode: selectedMode,
                },
                created_at: new Date().toISOString(),
              },
              ...existingActivity,
            ].slice(0, 30))
          );
        }

        setStudySaveFeedback('Study saved');
      } catch {
        setStudySaveFeedback('Save failed');
      } finally {
        setTimeout(() => setStudySaveFeedback(''), 2000);
      }
    };

    persist();
  };

  const handleTraditionChange = async (nextTradition: Tradition) => {
    setStudyTradition(nextTradition);
    localStorage.setItem('christian-study-guide:tradition', nextTradition);

    if (!user) return;

    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradition: nextTradition }),
      });
    } catch {}
  };

  const handleAskMentor = () => {
    if (!passage) return;

    const trimmedPrompt = mentorDraftPrompt.trim();
    if (!trimmedPrompt) return;

    setMentorPrompt(trimmedPrompt);
    const nextResponse = buildMentorResponse(
      trimmedPrompt,
      passage.reference,
      studyTradition
    );
    setMentorResponse(nextResponse);
    setMentorJourney(
      buildMentorJourney(trimmedPrompt, passage.reference, studyTradition)
    );

    const persist = async () => {
      try {
        if (user) {
          await saveMentorHistory(passage.reference, trimmedPrompt, nextResponse);
        } else {
          const mentorHistory = JSON.parse(
            localStorage.getItem('christian-study-guide:mentor-history') || '[]'
          ) as Array<{
            id: string;
            reference: string;
            prompt: string;
            title: string;
            createdAt: string;
          }>;

          const nextHistoryItem = {
            id: `${passage.reference}-${Date.now()}`,
            reference: passage.reference,
            prompt: trimmedPrompt,
            title: nextResponse.title,
            createdAt: new Date().toISOString(),
          };

          localStorage.setItem(
            'christian-study-guide:mentor-history',
            JSON.stringify([nextHistoryItem, ...mentorHistory].slice(0, 40))
          );
          const existingActivity = JSON.parse(
            localStorage.getItem('christian-study-guide:activity-timeline') || '[]'
          ) as Array<Record<string, unknown>>;
          localStorage.setItem(
            'christian-study-guide:activity-timeline',
            JSON.stringify([
              {
                id: `mentor-${Date.now()}`,
                event_type: 'mentor_question_saved',
                reference: passage.reference,
                metadata: {
                  question: trimmedPrompt,
                },
                created_at: new Date().toISOString(),
              },
              ...existingActivity,
            ].slice(0, 30))
          );
        }
      } catch {}
    };

    persist();
    setMentorThreadEntries((current) => [
      {
        id: `${passage.reference}-${Date.now()}`,
        prompt: trimmedPrompt,
        title: nextResponse.title,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ].slice(0, 5));
  };

  const handleSaveMentorConversation = async () => {
    if (!passage || !mentorResponse) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const noteContent = [
      `Christian AI Mentor`,
      `Prompt: ${mentorPrompt}`,
      '',
      `${mentorResponse.title}`,
      mentorResponse.guidance,
      '',
      `Suggested Passages: ${mentorResponse.suggestedPassages.join(', ')}`,
      '',
      `Next Steps:`,
      ...mentorResponse.nextSteps.map((step) => `- ${step}`),
      '',
      `Encouragement: ${mentorResponse.encouragement}`,
    ].join('\n');

    try {
      await saveNote(passage.reference, noteContent, 'note', '#d9f99d', [
        'mentor',
        'discipleship',
      ]);
      setNotesCount((current) => current + 1);
      setMentorSaveFeedback('Saved to notes');
      setTimeout(() => setMentorSaveFeedback(''), 2000);
    } catch {
      setMentorSaveFeedback('Failed to save');
      setTimeout(() => setMentorSaveFeedback(''), 2000);
    }
  };

  const handleToggleAudio = () => {
    if (!passage || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isAudioPlaying) {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `${passage.reference}. ${passage.text}`
    );
    utterance.onend = () => setIsAudioPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsAudioPlaying(true);
  };

  const crossReferences = passage ? getCrossReferences(passage.reference) : [];
  const historicalContext = passage
    ? getHistoricalContext(passage.reference)
    : null;
  const originalLanguageTerms = passage
    ? getOriginalLanguageInfo(passage.reference)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1e40af]" />
          <p className="text-gray-600">Loading passage...</p>
        </div>
      </div>
    );
  }

  if (error || !passage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0f172a] mb-2">
            Passage Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find that Bible passage. Please try searching for another one.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#1e40af] to-[#0f172a] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <h1 className="text-3xl font-bold">{passage.reference}</h1>
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-lg transition ${
                isSaved
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <Bookmark className="h-6 w-6" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Translation Selector */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-blue-200" />
              <select
                value={selectedTranslation}
                onChange={(e) => setSelectedTranslation(e.target.value)}
                className="bg-white/20 border border-white/40 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {translations.map((t) => (
                  <option key={t.code} value={t.code} className="text-[#0f172a]">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-100">Tradition</span>
              <select
                value={studyTradition}
                onChange={(e) => handleTraditionChange(e.target.value as Tradition)}
                className="bg-white/20 border border-white/40 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="overview" className="text-[#0f172a]">Overview</option>
                <option value="baptist" className="text-[#0f172a]">Baptist</option>
                <option value="reformed" className="text-[#0f172a]">Reformed</option>
                <option value="non-denominational" className="text-[#0f172a]">Non-denominational</option>
                <option value="catholic" className="text-[#0f172a]">Catholic</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8 py-12">
          {/* Passage Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
              <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  {[
                    ['overview', 'Overview'],
                    ['context', 'Context'],
                    ['compare', 'Commentary Compare'],
                    ['breakdown', 'Verse Breakdown'],
                    ['language', 'Language'],
                    ['apologetics', 'Apologetics'],
                    ['crossrefs', 'Cross References'],
                    ['devotional', 'Devotional'],
                    ['prayer', 'Prayer'],
                    ['family', 'Family'],
                    ['group', 'Group'],
                    ['sermon', 'Sermon'],
                    ['mentor', 'Mentor'],
                    ['quiz', 'Quiz'],
                  ].map(([mode, label]) => (
                    <a
                      key={mode}
                      href={`#${mode}`}
                      onClick={() => setSelectedMode(mode)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        selectedMode === mode
                          ? 'bg-[#1e40af] text-white'
                          : 'bg-white text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      {label}
                    </a>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSaveStudySession}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      studySaveFeedback
                        ? 'bg-lime-100 text-lime-900'
                        : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                    }`}
                  >
                    {studySaveFeedback || 'Save Study Session'}
                  </button>
                  <button
                    onClick={handleSharePage}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      shareFeedback
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {shareFeedback || 'Share Study Page'}
                  </button>
                  <button
                    onClick={handleExportStudy}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                  >
                    Export / Print
                  </button>
                  <button
                    onClick={handleToggleAudio}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                  >
                    {isAudioPlaying ? 'Stop Audio' : 'Play Audio'}
                  </button>
                </div>
              </div>

              {/* Passage Text */}
              <div className="mb-10" id="overview">
                <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap font-serif">
                  {passage.text}
                </p>

                {/* Copy & Share Buttons */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => handleCopy(`${passage.text}\n\n— ${passage.reference}`)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                      copyFeedback
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {copyFeedback ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        {copyFeedback}
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSharePage}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                  >
                    <Share2 className="h-5 w-5" />
                    {shareFeedback || 'Share'}
                  </button>
                </div>
              </div>

              {commentaryCompare.length > 0 && (
                <div className="mt-12 pt-8 border-t" id="compare">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#0f172a]">
                      Theology Compare Mode
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      A simple side-by-side look at how different Christian
                      traditions might frame the same passage.
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {commentaryCompare.map((item) => (
                      <section
                        key={item.label}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-6"
                      >
                        <h4 className="font-semibold text-slate-950">{item.label}</h4>
                        <p className="mt-3 text-sm leading-7 text-slate-700">
                          {item.summary}
                        </p>
                      </section>
                    ))}
                  </div>
                </div>
              )}

              {verseBreakdown.length > 0 && (
                <div className="mt-12 pt-8 border-t" id="breakdown">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#0f172a]">
                      Verse-by-Verse Breakdown
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      A simpler, slower walk through the flow of the passage.
                    </p>
                  </div>
                  <div className="grid gap-5">
                    {verseBreakdown.map((item) => (
                      <section
                        key={`${item.label}-${item.snippet}`}
                        className="rounded-xl border border-blue-200 bg-blue-50 p-6"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                          {item.label}
                        </p>
                        <p className="mt-3 rounded-xl bg-white p-4 text-sm leading-7 text-slate-800">
                          {item.snippet}
                        </p>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-semibold text-blue-950">Explanation</h4>
                            <p className="mt-2 text-sm leading-7 text-blue-950">
                              {item.insight}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-950">Application</h4>
                            <p className="mt-2 text-sm leading-7 text-blue-950">
                              {item.application}
                            </p>
                          </div>
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              )}

              {/* Cross-Reference Explorer */}
              {historicalContext && (
                <div className="mt-12 pt-8 border-t" id="context">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#0f172a]">
                      Historical & Cultural Context
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Get the basic background behind this passage so the meaning is
                      easier to understand.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl border border-stone-200 bg-stone-50 p-6">
                      <h4 className="mb-4 font-semibold text-stone-950">
                        Background Snapshot
                      </h4>
                      <div className="space-y-4 text-sm leading-6 text-stone-900">
                        <div>
                          <p className="font-semibold">Who wrote the book</p>
                          <p>{historicalContext.author}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Who the audience was</p>
                          <p>{historicalContext.audience}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Timeline placement</p>
                          <p>{historicalContext.timeline}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                      <h4 className="mb-4 font-semibold text-amber-950">
                        Historical Setting
                      </h4>
                      <div className="space-y-4 text-sm leading-6 text-amber-950">
                        <div>
                          <p className="font-semibold">When it was written</p>
                          <p>{historicalContext.date}</p>
                        </div>
                        <div>
                          <p className="font-semibold">What was happening historically</p>
                          <p>{historicalContext.historical}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Cultural background</p>
                          <p>{historicalContext.background}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {originalLanguageTerms.length > 0 && (
                <div className="mt-12 pt-8 border-t" id="language">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#0f172a]">
                      Original Greek / Hebrew Tools
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      See a key original-language word, what it means, how to say it,
                      where else it appears in Scripture, and how its deeper range
                      shapes theology in this passage.
                    </p>
                  </div>

                  <div className="grid gap-5">
                    {originalLanguageTerms.map((term) => (
                      <section
                        key={`${term.language}-${term.word}`}
                        className="rounded-xl border border-purple-200 bg-purple-50 p-6"
                      >
                        <div className="mb-4 flex items-center gap-2 text-purple-950">
                          <Languages className="h-5 w-5" />
                          <h4 className="font-semibold">
                            {term.language} Word: {term.word}
                          </h4>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="space-y-4 text-sm leading-6 text-purple-950">
                            <div>
                              <p className="font-semibold">Meaning</p>
                              <p>{term.meaning}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Pronunciation</p>
                              <p>{term.pronunciation}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Transliteration</p>
                              <p>{term.transliteration}</p>
                            </div>
                          </div>

                          <div className="space-y-4 text-sm leading-6 text-purple-950">
                            <div>
                              <p className="font-semibold">Why it matters here</p>
                              <p>{term.usage}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Other verses using this word</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {term.otherVerses.map((verse) => (
                                  <Link
                                    key={verse}
                                    href={`/passage/${verse.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="rounded-lg border border-purple-300 bg-white px-3 py-2 text-sm font-medium text-purple-900 transition hover:bg-purple-100"
                                  >
                                    {verse}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 rounded-xl border border-purple-300 bg-white/80 p-5">
                          <div className="mb-4 flex items-center gap-2 text-purple-950">
                            <Languages className="h-4 w-4" />
                            <h5 className="font-semibold">Original Language Depth Mode</h5>
                          </div>
                          <div className="grid gap-4 text-sm leading-6 text-purple-950 md:grid-cols-2">
                            <div>
                              <p className="font-semibold">Root family</p>
                              <p>{term.rootFamily}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Morphology</p>
                              <p>{term.morphology}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Lexical range</p>
                              <p>{term.lexicalRange.join(', ')}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Why the depth matters</p>
                              <p>{term.theologicalDepth}</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 pt-8 border-t" id="crossrefs">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#0f172a]">
                    Bible Cross-Reference Explorer
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    See how Scripture interprets Scripture with connected passages and
                    simple explanations of why they relate.
                  </p>
                </div>
                <div className="grid gap-4">
                  {crossReferences.map((item) => (
                    <div
                      key={item.verse}
                      className="rounded-xl border border-blue-200 bg-blue-50 p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <Link
                            href={`/passage/${item.verse.toLowerCase().replace(/\s+/g, '-')}`}
                            className="inline-flex rounded-lg bg-white px-3 py-2 font-semibold text-blue-900 transition hover:bg-blue-100"
                          >
                            {item.verse}
                          </Link>
                          <p className="mt-3 text-sm leading-6 text-blue-950">
                            {item.reason}
                          </p>
                        </div>
                        <Link
                          href={`/passage/${item.verse.toLowerCase().replace(/\s+/g, '-')}`}
                          className="shrink-0 rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-100"
                        >
                          Study This Verse
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {devotionalContent && (
                <div className="mt-12 pt-8 border-t" id="devotional">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0f172a]">
                        Devotional & Application Mode
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Turn this passage into reflection, prayer, and action for the week.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setDevotionalContent(buildDevotionalContent(passage, slug))
                      }
                      className="shrink-0 rounded-lg bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-200"
                    >
                      Refresh
                    </button>
                  </div>

                  <div className="grid gap-5">
                    <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                      <div className="mb-3 flex items-center gap-2 text-amber-900">
                        <Heart className="h-5 w-5" />
                        <h4 className="font-semibold">Personal Devotional</h4>
                      </div>
                      <p className="whitespace-pre-wrap leading-7 text-amber-950">
                        {devotionalContent.devotional}
                      </p>
                    </section>

                    <section className="grid gap-5 md:grid-cols-2">
                      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                        <h4 className="mb-3 font-semibold text-blue-950">
                          Reflection Questions
                        </h4>
                        <ul className="space-y-3 text-sm leading-6 text-blue-950">
                          {devotionalContent.reflectionQuestions.map((question) => (
                            <li key={question}>• {question}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                        <h4 className="mb-3 font-semibold text-emerald-950">
                          Prayer Based on the Passage
                        </h4>
                        <p className="whitespace-pre-wrap text-sm leading-7 text-emerald-950">
                          {devotionalContent.prayer}
                        </p>
                      </div>
                    </section>

                    <section className="grid gap-5 md:grid-cols-2">
                      <div className="rounded-xl border border-violet-200 bg-violet-50 p-6">
                        <div className="mb-3 flex items-center gap-2 text-violet-950">
                          <PenTool className="h-5 w-5" />
                          <h4 className="font-semibold">Journaling Prompts</h4>
                        </div>
                        <ul className="space-y-3 text-sm leading-6 text-violet-950">
                          {devotionalContent.journalPrompts.map((prompt) => (
                            <li key={prompt}>• {prompt}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
                        <h4 className="mb-3 font-semibold text-rose-950">
                          Weekly Action Step
                        </h4>
                        <p className="text-sm leading-7 text-rose-950">
                          {devotionalContent.actionStep}
                        </p>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {prayerModeContent && (
                <div className="mt-12 pt-8 border-t" id="prayer">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0f172a]">
                        Prayer Mode
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Pray the passage through confession, gratitude, intercession,
                        and surrender.
                      </p>
                    </div>
                    <button
                      onClick={() => setPrayerModeContent(buildPrayerModeContent(passage.reference))}
                      className="shrink-0 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-200"
                    >
                      Refresh
                    </button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <section className="rounded-xl border border-rose-200 bg-rose-50 p-6">
                      <h4 className="mb-3 font-semibold text-rose-950">Confession</h4>
                      <p className="text-sm leading-7 text-rose-950">
                        {prayerModeContent.confession}
                      </p>
                    </section>
                    <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                      <h4 className="mb-3 font-semibold text-amber-950">Gratitude</h4>
                      <p className="text-sm leading-7 text-amber-950">
                        {prayerModeContent.gratitude}
                      </p>
                    </section>
                    <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                      <h4 className="mb-3 font-semibold text-blue-950">Intercession</h4>
                      <p className="text-sm leading-7 text-blue-950">
                        {prayerModeContent.intercession}
                      </p>
                    </section>
                    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                      <h4 className="mb-3 font-semibold text-emerald-950">Surrender</h4>
                      <p className="text-sm leading-7 text-emerald-950">
                        {prayerModeContent.surrender}
                      </p>
                    </section>
                  </div>
                </div>
              )}

              {apologeticsContent && (
                <div className="mt-12 pt-8 border-t" id="apologetics">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#0f172a]">
                      Apologetics & Hard Questions Mode
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      A guided way to think through doubts, objections, and worldview questions from a Christian perspective.
                    </p>
                  </div>
                  <div className="grid gap-5">
                    <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                      <h4 className="font-semibold text-amber-950">
                        Hard question
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-amber-950">
                        {apologeticsContent.question}
                      </p>
                    </section>
                    <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                      <h4 className="font-semibold text-blue-950">
                        Christian response
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-blue-950">
                        {apologeticsContent.response}
                      </p>
                    </section>
                    <section className="rounded-xl border border-violet-200 bg-violet-50 p-6">
                      <h4 className="font-semibold text-violet-950">
                        Supporting ideas
                      </h4>
                      <ul className="mt-3 space-y-3 text-sm leading-6 text-violet-950">
                        {apologeticsContent.supportingIdeas.map((idea) => (
                          <li key={idea}>• {idea}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </div>
              )}

              {familyModeContent && (
                <div className="mt-12 pt-8 border-t" id="family">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#0f172a]">
                      Family Mode
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      A shorter, simpler version of the study flow for homes,
                      kids, and family devotions.
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <section className="rounded-xl border border-pink-200 bg-pink-50 p-6">
                      <div className="mb-3 flex items-center gap-2 text-pink-950">
                        <Home className="h-5 w-5" />
                        <h4 className="font-semibold">Big Idea for Families</h4>
                      </div>
                      <p className="text-sm leading-7 text-pink-950">
                        {familyModeContent.bigIdea}
                      </p>
                    </section>
                    <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                      <h4 className="font-semibold text-amber-950">
                        Family Talk Question
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-amber-950">
                        {familyModeContent.familyTalkQuestion}
                      </p>
                    </section>
                    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                      <h4 className="font-semibold text-emerald-950">
                        Kid-Friendly Prayer
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-emerald-950">
                        {familyModeContent.kidFriendlyPrayer}
                      </p>
                    </section>
                    <section className="rounded-xl border border-violet-200 bg-violet-50 p-6">
                      <h4 className="font-semibold text-violet-950">
                        Family Activity
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-violet-950">
                        {familyModeContent.activity}
                      </p>
                    </section>
                  </div>
                </div>
              )}

              {groupStudyContent && (
                <div className="mt-12 pt-8 border-t" id="group">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0f172a]">
                        Small Group & Teaching Tools
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Turn this passage into a simple study plan for leading others.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setGroupStudyContent(buildGroupStudyContent(passage, slug))
                      }
                      className="shrink-0 rounded-lg bg-sky-100 px-4 py-2 text-sm font-medium text-sky-900 transition hover:bg-sky-200"
                    >
                      Refresh
                    </button>
                  </div>

                  <div className="grid gap-5">
                    <section className="rounded-xl border border-sky-200 bg-sky-50 p-6">
                      <div className="mb-3 flex items-center gap-2 text-sky-900">
                        <BookOpen className="h-5 w-5" />
                        <h4 className="font-semibold">15-Minute Bible Study</h4>
                      </div>
                      <p className="mb-4 text-sm font-medium text-sky-950">
                        {groupStudyContent.studyTitle}
                      </p>
                      <ul className="space-y-3 text-sm leading-6 text-sky-950">
                        {groupStudyContent.fifteenMinuteStudy.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>

                    <section className="grid gap-5 md:grid-cols-2">
                      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
                        <div className="mb-3 flex items-center gap-2 text-indigo-950">
                          <Users className="h-5 w-5" />
                          <h4 className="font-semibold">Discussion Questions</h4>
                        </div>
                        <ul className="space-y-3 text-sm leading-6 text-indigo-950">
                          {groupStudyContent.discussionQuestions.map((question) => (
                            <li key={question}>• {question}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
                        <h4 className="mb-3 font-semibold text-orange-950">
                          Youth Lesson
                        </h4>
                        <p className="text-sm leading-7 text-orange-950">
                          {groupStudyContent.youthLesson}
                        </p>
                      </div>
                    </section>

                    <section className="grid gap-5 md:grid-cols-2">
                      <div className="rounded-xl border border-teal-200 bg-teal-50 p-6">
                        <h4 className="mb-3 font-semibold text-teal-950">
                          Sermon Outline Starter
                        </h4>
                        <ul className="space-y-3 text-sm leading-6 text-teal-950">
                          {groupStudyContent.sermonOutlineStarter.map((point) => (
                            <li key={point}>• {point}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-pink-200 bg-pink-50 p-6">
                        <h4 className="mb-3 font-semibold text-pink-950">
                          Family Devotion
                        </h4>
                        <p className="text-sm leading-7 text-pink-950">
                          {groupStudyContent.familyDevotion}
                        </p>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {sermonBuilderContent && (
                <div className="mt-12 pt-8 border-t" id="sermon">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0f172a]">
                        AI Sermon & Bible Study Builder
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Build a message or study plan for pastors, leaders, and youth workers.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSermonBuilderContent(
                          buildSermonBuilderContent(
                            builderTopic,
                            passage.reference,
                            builderAudience,
                            studyTradition
                          )
                        )
                      }
                      className="shrink-0 rounded-lg bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 transition hover:bg-indigo-200"
                    >
                      Generate
                    </button>
                    <button
                      onClick={() =>
                        handleCopy(
                          [
                            'AI Sermon & Bible Study Builder',
                            `Topic: ${builderTopic}`,
                            `Passage: ${passage.reference}`,
                            `Audience: ${builderAudience}`,
                            '',
                            'Sermon Outline:',
                            ...sermonBuilderContent.sermonOutline,
                            '',
                            'Key Points:',
                            ...sermonBuilderContent.keyPoints.map((item) => `- ${item}`),
                          ].join('\n')
                        )
                      }
                      className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-900 transition hover:bg-indigo-50"
                    >
                      Copy Builder
                    </button>
                  </div>

                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 mb-5">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-indigo-950">
                          Topic
                        </label>
                        <input
                          value={builderTopic}
                          onChange={(e) => setBuilderTopic(e.target.value)}
                          className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-indigo-950">
                          Passage
                        </label>
                        <input
                          value={passage.reference}
                          readOnly
                          className="w-full rounded-lg border border-indigo-200 bg-indigo-100 px-4 py-3 text-sm text-indigo-950 outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-indigo-950">
                          Audience
                        </label>
                        <input
                          value={builderAudience}
                          onChange={(e) => setBuilderAudience(e.target.value)}
                          className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5">
                    <section className="rounded-xl border border-indigo-200 bg-white p-6">
                      <h4 className="mb-3 font-semibold text-indigo-950">
                        Sermon Outline
                      </h4>
                      <ul className="space-y-3 text-sm leading-6 text-slate-800">
                        {sermonBuilderContent.sermonOutline.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>

                    <section className="grid gap-5 md:grid-cols-2">
                      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                        <h4 className="mb-3 font-semibold text-blue-950">
                          Key Points
                        </h4>
                        <ul className="space-y-3 text-sm leading-6 text-blue-950">
                          {sermonBuilderContent.keyPoints.map((point) => (
                            <li key={point}>• {point}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                        <h4 className="mb-3 font-semibold text-amber-950">
                          Illustrations
                        </h4>
                        <ul className="space-y-3 text-sm leading-6 text-amber-950">
                          {sermonBuilderContent.illustrations.map((illustration) => (
                            <li key={illustration}>• {illustration}</li>
                          ))}
                        </ul>
                      </div>
                    </section>

                    <section className="grid gap-5 md:grid-cols-2">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                        <h4 className="mb-3 font-semibold text-emerald-950">
                          Discussion Questions
                        </h4>
                        <ul className="space-y-3 text-sm leading-6 text-emerald-950">
                          {sermonBuilderContent.discussionQuestions.map((question) => (
                            <li key={question}>• {question}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
                        <h4 className="mb-3 font-semibold text-rose-950">
                          Prayer
                        </h4>
                        <p className="text-sm leading-7 text-rose-950">
                          {sermonBuilderContent.prayer}
                        </p>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {mentorResponse && (
                <div className="mt-12 pt-8 border-t" id="mentor">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0f172a]">
                        Christian AI Mentor
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        A discipleship coach for prayer habits, struggles, Scripture direction,
                        and spiritual encouragement.
                      </p>
                    </div>
                    <button
                      onClick={handleAskMentor}
                      className="shrink-0 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-200"
                    >
                      Ask Mentor
                    </button>
                  </div>

                  <form
                    className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 mb-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAskMentor();
                    }}
                  >
                    <label className="mb-2 block text-sm font-semibold text-emerald-950">
                      Ask for discipleship help
                    </label>
                    <textarea
                      value={mentorDraftPrompt}
                      onChange={(e) => setMentorDraftPrompt(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[
                        'Help me understand anxiety from a Biblical perspective.',
                        'Help me build a daily prayer habit.',
                        'What Bible passages should I study when I feel discouraged?',
                      ].map((example) => (
                        <button
                          key={example}
                          type="button"
                          onClick={() => {
                            setMentorDraftPrompt(example);
                            setMentorPrompt(example);
                            setMentorResponse(
                              buildMentorResponse(
                                example,
                                passage.reference,
                                studyTradition
                              )
                            );
                            setMentorJourney(
                              buildMentorJourney(
                                example,
                                passage.reference,
                                studyTradition
                              )
                            );
                          }}
                          className="rounded-full border border-emerald-300 bg-white px-3 py-2 text-xs font-medium text-emerald-900 transition hover:bg-emerald-100"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </form>

                  <div className="grid gap-5">
                    <section className="rounded-xl border border-emerald-200 bg-white p-6">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-emerald-950">
                            {mentorResponse.title}
                          </h4>
                          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-emerald-700">
                            Response to: {mentorPrompt}
                          </p>
                        </div>
                        <button
                          onClick={handleSaveMentorConversation}
                          className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
                            mentorSaveFeedback === 'Saved to notes'
                              ? 'bg-lime-100 text-lime-900'
                              : mentorSaveFeedback === 'Failed to save'
                                ? 'bg-rose-100 text-rose-900'
                                : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          }`}
                        >
                          {mentorSaveFeedback || 'Save to Notes'}
                        </button>
                        <button
                          onClick={() =>
                            handleCopy(
                              [
                                `Prompt: ${mentorPrompt}`,
                                '',
                                mentorResponse.title,
                                mentorResponse.guidance,
                                '',
                                `Suggested Passages: ${mentorResponse.suggestedPassages.join(', ')}`,
                                '',
                                'Next Steps:',
                                ...mentorResponse.nextSteps.map((step) => `- ${step}`),
                                '',
                                `Encouragement: ${mentorResponse.encouragement}`,
                              ].join('\n')
                            )
                          }
                          className="shrink-0 rounded-lg bg-white px-3 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-50"
                        >
                          Copy Response
                        </button>
                      </div>
                      <p className="text-sm leading-7 text-slate-800">
                        {mentorResponse.guidance}
                      </p>
                    </section>

                    <section className="grid gap-5 md:grid-cols-2">
                      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                        <h4 className="mb-3 font-semibold text-blue-950">
                          Suggested Passages
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {mentorResponse.suggestedPassages.map((verse) => (
                            <Link
                              key={verse}
                              href={`/passage/${verse.toLowerCase().replace(/\s+/g, '-')}`}
                              className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-100"
                            >
                              {verse}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-violet-200 bg-violet-50 p-6">
                        <h4 className="mb-3 font-semibold text-violet-950">
                          Next Steps
                        </h4>
                        <ul className="space-y-3 text-sm leading-6 text-violet-950">
                          {mentorResponse.nextSteps.map((step) => (
                            <li key={step}>• {step}</li>
                          ))}
                        </ul>
                      </div>
                    </section>

                    <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                      <h4 className="mb-3 font-semibold text-amber-950">
                        Spiritual Encouragement
                      </h4>
                      <p className="text-sm leading-7 text-amber-950">
                        {mentorResponse.encouragement}
                      </p>
                    </section>

                    {mentorJourney && (
                      <section className="rounded-xl border border-teal-200 bg-teal-50 p-6">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-teal-950">
                              Mentor Follow-Up Journey
                            </h4>
                            <p className="mt-1 text-sm text-teal-800">
                              {mentorJourney.title} • {mentorJourney.duration}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleCopy(
                                [
                                  mentorJourney.title,
                                  `Duration: ${mentorJourney.duration}`,
                                  '',
                                  ...mentorJourney.steps.map((step) => `- ${step}`),
                                ].join('\n')
                              )
                            }
                            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-teal-900 transition hover:bg-teal-100"
                          >
                            Copy Journey
                          </button>
                        </div>
                        <ul className="space-y-3 text-sm leading-6 text-teal-950">
                          {mentorJourney.steps.map((step) => (
                            <li key={step}>• {step}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {mentorThreadEntries.length > 0 && (
                      <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                        <h4 className="mb-3 font-semibold text-slate-900">
                          Passage Companion Thread
                        </h4>
                        <p className="mb-4 text-sm leading-6 text-slate-600">
                          Keep a running mentor conversation attached to this passage so
                          follow-up questions feel like one ongoing thread instead of one-off prompts.
                        </p>
                        <div className="space-y-3">
                          {mentorThreadEntries.map((entry) => (
                            <article
                              key={entry.id}
                              className="rounded-xl border border-slate-200 bg-white p-4"
                            >
                              <p className="text-sm font-semibold text-slate-900">
                                {entry.title}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-700">
                                {entry.prompt}
                              </p>
                              <p className="mt-2 text-xs text-slate-500">
                                {new Date(entry.createdAt).toLocaleString()}
                              </p>
                            </article>
                          ))}
                        </div>
                      </section>
                    )}

                    <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-slate-950">
                            Shareable Study Card
                          </h4>
                          <p className="mt-1 text-sm text-slate-600">
                            Copy a compact summary for a text thread, group chat, or note.
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleCopy(
                              [
                                passage.reference,
                                '',
                                mentorResponse.title,
                                mentorResponse.guidance,
                                '',
                                `Try next: ${mentorResponse.nextSteps[0]}`,
                              ].join('\n')
                            )
                          }
                          className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                        >
                          Copy Card
                        </button>
                      </div>
                      <div className="rounded-xl border border-white bg-white p-5 text-sm leading-7 text-slate-700">
                        <p className="font-semibold text-slate-950">{passage.reference}</p>
                        <p className="mt-3">{mentorResponse.title}</p>
                        <p className="mt-3">{mentorResponse.guidance}</p>
                        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Next step
                        </p>
                        <p className="mt-1">{mentorResponse.nextSteps[0]}</p>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {quizContent && (
                <div className="mt-12 pt-8 border-t" id="quiz">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0f172a]">
                        Quiz & Memory Mode
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Review the passage with a few study questions and a simple memory prompt.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowQuizAnswers((current) => !current)}
                      className="shrink-0 rounded-lg bg-violet-100 px-4 py-2 text-sm font-medium text-violet-900 transition hover:bg-violet-200"
                    >
                      {showQuizAnswers ? 'Hide Answers' : 'Show Answers'}
                    </button>
                  </div>

                  <div className="grid gap-5">
                    <section className="rounded-xl border border-violet-200 bg-violet-50 p-6">
                      <h4 className="mb-3 font-semibold text-violet-950">Study Questions</h4>
                      <ul className="space-y-4 text-sm leading-6 text-violet-950">
                        {quizContent.questions.map((question, index) => (
                          <li key={question}>
                            <p>{index + 1}. {question}</p>
                            {showQuizAnswers && (
                              <p className="mt-2 rounded-lg bg-white px-3 py-2 text-slate-700">
                                {quizContent.answers[index]}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="rounded-xl border border-rose-200 bg-rose-50 p-6">
                      <h4 className="mb-3 font-semibold text-rose-950">Verse Memory Prompt</h4>
                      <p className="text-sm leading-7 text-rose-950">
                        {quizContent.memoryPrompt}
                      </p>
                    </section>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {showNotesPanel ? (
              <NotesPanel reference={passage.reference} onClose={() => setShowNotesPanel(false)} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                {/* Study Info Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold text-lg text-blue-900">
                      Study Tools
                    </h3>
                  </div>
                  <p className="text-sm text-blue-800 mb-4">
                    Keep track of your spiritual growth with notes and highlights.
                  </p>
                  <button
                    onClick={() => {
                      if (!user) {
                        setShowAuthModal(true);
                      } else {
                        setShowNotesPanel(true);
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-5 w-5" />
                    Open Notes Panel
                    {notesCount > 0 && (
                      <span className="bg-white/30 px-2 py-1 rounded text-sm font-bold">
                        {notesCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Devotional Ideas */}
                <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="h-5 w-5 text-amber-700" />
                    <h4 className="font-semibold text-amber-900">
                      Devotional Mode
                    </h4>
                  </div>
                  <p className="text-sm text-amber-900 mb-4">
                    Generate a personal devotional, guided prayer, journaling prompts,
                    and a weekly action step from this passage.
                  </p>
                  <button
                    onClick={() => {
                      if (passage) {
                        setDevotionalContent(buildDevotionalContent(passage, slug));
                      }
                    }}
                    className="w-full rounded-lg bg-amber-600 px-4 py-3 font-medium text-white transition hover:bg-amber-700"
                  >
                    Open Devotional & Application
                  </button>
                </div>

                <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="h-5 w-5 text-emerald-700" />
                    <h4 className="font-semibold text-emerald-900">
                      Prayer Mode
                    </h4>
                  </div>
                  <p className="text-sm text-emerald-900 mb-4">
                    Turn this passage into guided confession, gratitude,
                    intercession, and surrender.
                  </p>
                  <a
                    href="#prayer"
                    onClick={() => setSelectedMode('prayer')}
                    className="block w-full rounded-lg bg-emerald-600 px-4 py-3 text-center font-medium text-white transition hover:bg-emerald-700"
                  >
                    Open Prayer Mode
                  </a>
                </div>

                {historicalContext && (
                  <div className="bg-stone-50 rounded-lg p-6 border border-stone-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="h-5 w-5 text-stone-700" />
                      <h4 className="font-semibold text-stone-900">
                        Historical Context
                      </h4>
                    </div>
                    <p className="text-sm text-stone-900 mb-4">
                      {historicalContext.author} wrote this around {historicalContext.date},
                      and it was addressed to {historicalContext.audience.toLowerCase()}.
                    </p>
                    <p className="text-sm text-stone-700">
                      {historicalContext.historical}
                    </p>
                  </div>
                )}

                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Volume2 className="h-5 w-5 text-slate-700" />
                    <h4 className="font-semibold text-slate-900">
                      Passage Audio
                    </h4>
                  </div>
                  <p className="text-sm text-slate-700 mb-4">
                    Listen to the passage out loud for mobile-friendly study and review.
                  </p>
                  <button
                    onClick={handleToggleAudio}
                    className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800"
                  >
                    {isAudioPlaying ? 'Stop Passage Audio' : 'Play Passage Audio'}
                  </button>
                </div>

                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="h-5 w-5 text-slate-700" />
                    <h4 className="font-semibold text-slate-900">
                      Commentary Compare
                    </h4>
                  </div>
                  <p className="text-sm text-slate-700 mb-4">
                    See a simple tradition-aware summary of how this passage may be framed.
                  </p>
                  <a
                    href="#compare"
                    onClick={() => setSelectedMode('compare')}
                    className="block w-full rounded-lg bg-slate-900 px-4 py-3 text-center font-medium text-white transition hover:bg-slate-800"
                  >
                    Open Compare Mode
                  </a>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <PlayCircle className="h-5 w-5 text-blue-700" />
                    <h4 className="font-semibold text-blue-900">
                      Verse Breakdown
                    </h4>
                  </div>
                  <p className="text-sm text-blue-900 mb-4">
                    Walk through the passage in smaller chunks with explanation and application.
                  </p>
                  <a
                    href="#breakdown"
                    onClick={() => setSelectedMode('breakdown')}
                    className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition hover:bg-blue-700"
                  >
                    Open Verse Breakdown
                  </a>
                </div>

                {originalLanguageTerms.length > 0 && (
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Languages className="h-5 w-5 text-purple-700" />
                      <h4 className="font-semibold text-purple-900">
                        Original Language
                      </h4>
                    </div>
                    <p className="text-sm text-purple-900 mb-3">
                      {originalLanguageTerms[0].language} word: {originalLanguageTerms[0].word}
                    </p>
                    <p className="text-sm text-purple-700">
                      {originalLanguageTerms[0].meaning}. Pronounced{' '}
                      {originalLanguageTerms[0].pronunciation}.
                    </p>
                  </div>
                )}

                <div className="bg-sky-50 rounded-lg p-6 border border-sky-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-5 w-5 text-sky-700" />
                    <h4 className="font-semibold text-sky-900">
                      Group Leader Tools
                    </h4>
                  </div>
                  <p className="text-sm text-sky-900 mb-4">
                    Build a 15-minute Bible study, discussion questions, a youth lesson,
                    a sermon starter, and a family devotion from this passage.
                  </p>
                  <button
                    onClick={() => {
                      if (passage) {
                        setGroupStudyContent(buildGroupStudyContent(passage, slug));
                      }
                    }}
                    className="w-full rounded-lg bg-sky-600 px-4 py-3 font-medium text-white transition hover:bg-sky-700"
                  >
                    Open Small Group & Teaching Tools
                  </button>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="h-5 w-5 text-indigo-700" />
                    <h4 className="font-semibold text-indigo-900">
                      Sermon Builder
                    </h4>
                  </div>
                  <p className="text-sm text-indigo-900 mb-4">
                    Turn this passage into a sermon outline, key points, illustrations,
                    questions, and a closing prayer for your audience.
                  </p>
                  <button
                    onClick={() =>
                      setSermonBuilderContent(
                        buildSermonBuilderContent(
                          builderTopic,
                          passage.reference,
                          builderAudience,
                          studyTradition
                        )
                      )
                    }
                    className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700"
                  >
                    Open AI Sermon & Study Builder
                  </button>
                </div>

                <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="h-5 w-5 text-emerald-700" />
                    <h4 className="font-semibold text-emerald-900">
                      Christian AI Mentor
                    </h4>
                  </div>
                  <p className="text-sm text-emerald-900 mb-4">
                    Get discipleship help with prayer habits, anxiety, study direction,
                    and spiritual encouragement rooted in Scripture.
                  </p>
                  <button
                    onClick={handleAskMentor}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700"
                  >
                    Open Christian AI Mentor
                  </button>
                </div>

                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Share2 className="h-5 w-5 text-slate-700" />
                    <h4 className="font-semibold text-slate-900">
                      Shareable Study Card
                    </h4>
                  </div>
                  <p className="text-sm text-slate-700 mb-4">
                    Copy a compact version of this study to send to a friend or group.
                  </p>
                  <button
                    onClick={() =>
                      handleCopy(
                        [
                          passage.reference,
                          '',
                          mentorResponse?.title || 'Study summary',
                          mentorResponse?.guidance ||
                            'Study this passage with prayer, context, and application.',
                        ].join('\n')
                      )
                    }
                    className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800"
                  >
                    Copy Study Card
                  </button>
                </div>

                <div className="bg-violet-50 rounded-lg p-6 border border-violet-200">
                  <div className="flex items-center gap-3 mb-3">
                    <PenTool className="h-5 w-5 text-violet-700" />
                    <h4 className="font-semibold text-violet-900">
                      Quiz & Memory
                    </h4>
                  </div>
                  <p className="text-sm text-violet-900 mb-4">
                    Review the passage with quick questions and a verse memory prompt.
                  </p>
                  <a
                    href="#quiz"
                    onClick={() => setSelectedMode('quiz')}
                    className="block w-full rounded-lg bg-violet-600 px-4 py-3 text-center font-medium text-white transition hover:bg-violet-700"
                  >
                    Open Quiz & Memory Mode
                  </a>
                </div>

                <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Home className="h-5 w-5 text-pink-700" />
                    <h4 className="font-semibold text-pink-900">
                      Family Mode
                    </h4>
                  </div>
                  <p className="text-sm text-pink-900 mb-4">
                    Turn this passage into a simple family devotion with one question,
                    one prayer, and one activity.
                  </p>
                  <a
                    href="#family"
                    onClick={() => setSelectedMode('family')}
                    className="block w-full rounded-lg bg-pink-600 px-4 py-3 text-center font-medium text-white transition hover:bg-pink-700"
                  >
                    Open Family Mode
                  </a>
                </div>

                {/* Continue Reading */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">
                      Keep Reading
                    </h4>
                  </div>
                  <p className="text-sm text-green-900 mb-3">
                    Continue your Bible study with a structured reading plan.
                  </p>
                  <Link
                    href="/studies"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                  >
                    View Plans
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </div>
  );
}
