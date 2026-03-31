export interface HardcodedResponse {
  keywords: string[];
  response: string;
}

export const HARDCODED_RESPONSES: HardcodedResponse[] = [
  {
    keywords: ["pricing", "price", "cost", "how much", "plan", "free", "paid"],
    response:
      "This desktop environment is completely free and open source! You can host it on GitHub Pages at no cost. For PostHog (the inspiration), they offer a generous free tier -- check posthog.com/pricing for current plans.",
  },
  {
    keywords: ["feature", "features", "what can", "capabilities", "what does"],
    response:
      "Here's what this desktop can do:\n\n- Draggable windows -- move any window by its title bar\n- Resize -- drag edges or corners\n- Minimize/maximize -- via window controls on the right\n- Search -- press / or Cmd+K to search apps\n- MDX content -- rich docs with syntax highlighting\n- Ask Max -- that's me!",
  },
  {
    keywords: ["how to", "how do", "start", "open", "launch", "run"],
    response:
      "To open an app, click its icon on the desktop or use the search (/ or Cmd+K). You can also open the Product OS to browse all available apps. Every app opens in its own window -- drag, resize, and arrange them however you like.",
  },
  {
    keywords: ["theme", "color", "appearance", "mode"],
    response:
      "The desktop uses a light theme inspired by PostHog. You can switch between OS mode (full desktop experience) and website mode from the OS menu (the PostHog logo in the top-left). Your preference is applied instantly.",
  },
  {
    keywords: ["keyboard", "shortcut", "hotkey", "key"],
    response:
      "Here are the keyboard shortcuts:\n\n- / or Cmd+K -- Open search\n- ? -- Open Ask Max (that's this!)\n- Esc -- Close the current panel or search",
  },
  {
    keywords: ["window", "windows", "manage", "managing"],
    response:
      "Click the window count pill in the taskbar to open the Active Windows panel, which lists all open windows. From there you can focus or close any window. You can also close all windows at once with the 'Close all' button.",
  },
  {
    keywords: ["posthog", "inspiration", "built", "who made"],
    response:
      "This desktop was inspired by PostHog.com's brilliant OS-style interface. PostHog is an open-source product analytics platform -- check them out at posthog.com. The windowed UI paradigm makes it feel like a real desktop app in the browser.",
  },
  {
    keywords: ["deploy", "github", "pages", "hosting", "build"],
    response:
      "To deploy to GitHub Pages:\n\n1. Run pnpm build — output goes to out/\n2. Use the included GitHub Actions workflow (Settings → Pages → GitHub Actions), or upload out/ manually\n3. In CI, GITHUB_REPOSITORY sets basePath for project sites (user.github.io/repo/); *.github.io repos use the site root\n\nSee the Docs app for more details!",
  },
  {
    keywords: ["mdx", "markdown", "content", "blog", "docs"],
    response:
      "MDX (Markdown + JSX) is used for content in this desktop. You can write .mdx files with custom React components, frontmatter metadata, and full prose styling. Check the Blog app for an example. The src/mdx-components.tsx file maps standard Markdown elements to styled components.",
  },
  {
    keywords: ["help", "hello", "hi", "hey", "support"],
    response:
      "Hi! I'm Max, your AI assistant. I can help you understand this desktop environment, its features, and how to use it. Try asking me about:\n\n- Features and capabilities\n- Keyboard shortcuts\n- Theming and appearance\n- Deployment\n- MDX content\n\nWhat would you like to know?",
  },
];

export const DEFAULT_RESPONSE =
  "That's a great question! I'm a prototype assistant with hardcoded responses for now. I work best with questions about this desktop's features, keyboard shortcuts, theming, deployment, and MDX content. What specifically would you like to know?";

export const QUICK_QUESTIONS = [
  "What can this desktop do?",
  "What are the keyboard shortcuts?",
  "How do I deploy to GitHub Pages?",
  "How do I add MDX content?",
  "How do I change the theme?",
];

export function getResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const item of HARDCODED_RESPONSES) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.response;
    }
  }
  return DEFAULT_RESPONSE;
}
