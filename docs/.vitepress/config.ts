import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Xtrape Capsule",
  description: "A lightweight control plane for AI-era Capsule Services.",
  base: "/xtrape-capsule-site/",
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  head: [
    ["meta", { name: "theme-color", content: "#3b82f6" }],
    ["meta", { property: "og:title", content: "Xtrape Capsule" }],
    [
      "meta",
      {
        property: "og:description",
        content: "A lightweight control plane for AI-era Capsule Services.",
      },
    ],
  ],

  themeConfig: {
    siteTitle: "Xtrape Capsule",

    nav: [
      { text: "Guide", link: "/getting-started/quick-start" },
      { text: "Concepts", link: "/concepts/capsule-service" },
      { text: "Opstage CE", link: "/opstage-ce/overview" },
      { text: "Agents", link: "/agents/node-embedded-agent" },
      { text: "Contracts", link: "/contracts/overview" },
      { text: "Use Cases", link: "/use-cases/capi-services" },
      { text: "Editions", link: "/editions/ce" },
      { text: "Roadmap", link: "/roadmap" },
      {
        text: "GitHub",
        items: [
          { text: "Opstage CE", link: "https://github.com/xtrape-com/xtrape-capsule-ce" },
          { text: "Agent SDK (Node)", link: "https://github.com/xtrape-com/xtrape-capsule-agent-node" },
          { text: "Contracts (Node)", link: "https://github.com/xtrape-com/xtrape-capsule-contracts-node" },
          { text: "Site (this repo)", link: "https://github.com/xtrape-com/xtrape-capsule-site" },
        ],
      },
    ],

    sidebar: {
      "/getting-started/": [
        {
          text: "Guide",
          items: [
            { text: "Quick Start", link: "/getting-started/quick-start" },
            { text: "Install Opstage CE", link: "/getting-started/install-opstage-ce" },
            { text: "First Capsule Service", link: "/getting-started/first-capsule-service" },
            { text: "Demo", link: "/getting-started/demo" },
          ],
        },
      ],
      "/concepts/": [
        {
          text: "Concepts",
          items: [
            { text: "Capsule Service", link: "/concepts/capsule-service" },
            { text: "Opstage", link: "/concepts/opstage" },
            { text: "Agent", link: "/concepts/agent" },
            { text: "Agent Registration", link: "/concepts/agent-registration" },
            { text: "Management Contract", link: "/concepts/management-contract" },
          ],
        },
      ],
      "/opstage-ce/": [
        {
          text: "Opstage CE",
          items: [
            { text: "Overview", link: "/opstage-ce/overview" },
            { text: "Docker Deployment", link: "/opstage-ce/docker-deployment" },
            { text: "Configuration", link: "/opstage-ce/configuration" },
            { text: "Admin UI", link: "/opstage-ce/admin-ui" },
            { text: "Backup and Upgrade", link: "/opstage-ce/backup-and-upgrade" },
          ],
        },
      ],
      "/agents/": [
        {
          text: "Agents",
          items: [
            { text: "Node Embedded Agent", link: "/agents/node-embedded-agent" },
            { text: "Action Model", link: "/agents/action-model" },
            { text: "Health Reporting", link: "/agents/health-reporting" },
            { text: "Config Reporting", link: "/agents/config-reporting" },
          ],
        },
      ],
      "/contracts/": [
        {
          text: "Contracts",
          items: [
            { text: "Overview", link: "/contracts/overview" },
            { text: "Manifest", link: "/contracts/manifest" },
            { text: "Health", link: "/contracts/health" },
            { text: "Actions", link: "/contracts/actions" },
            { text: "Errors", link: "/contracts/errors" },
          ],
        },
      ],
      "/use-cases/": [
        {
          text: "Use Cases",
          items: [
            { text: "CAPI Services", link: "/use-cases/capi-services" },
            { text: "Playwright Workers", link: "/use-cases/playwright-workers" },
            { text: "Account Pool", link: "/use-cases/account-pool" },
            { text: "AI Agent Runtime", link: "/use-cases/ai-agent-runtime" },
          ],
        },
      ],
      "/editions/": [
        {
          text: "Editions",
          items: [
            { text: "Community Edition", link: "/editions/ce" },
            { text: "Enterprise Edition", link: "/editions/ee" },
            { text: "Cloud", link: "/editions/cloud" },
          ],
        },
      ],
      "/security/": [
        {
          text: "Security",
          items: [
            { text: "Overview", link: "/security/overview" },
            { text: "Token Model", link: "/security/token-model" },
            { text: "Agent Security", link: "/security/agent-security" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/xtrape-com/xtrape-capsule-ce" },
    ],

    search: { provider: "local" },

    footer: {
      message:
        'Code and docs released under <a href="/xtrape-capsule-site/legal">Apache-2.0</a>. ' +
        '"Xtrape", "Xtrape Capsule", and "Opstage" are trademarks of their respective owners.',
      copyright: "Copyright © Xtrape",
    },

    editLink: {
      pattern: "https://github.com/xtrape-com/xtrape-capsule-site/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
  },
});
