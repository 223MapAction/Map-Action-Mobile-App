// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Mobile App Documentation',
  tagline: 'Map Action',
  favicon: 'img/logobleu.png',

  url: 'https://223MapAction.github.io',
  baseUrl: '/Map-Action-Mobile-App/',

  organizationName: '223MapAction', 
  projectName: 'Map-Action-Mobile-App', 
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/223MapAction/Map-Action-Mobile-App/documentation',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/223MapAction/Map-Action-Mobile-App',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/iconApp.png',
      navbar: {
        title: 'Map Action',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logobleu.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'right',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/223MapAction/Map-Action-Mobile-App',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {},
          {},
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation',
                to: '/docs/intro',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/223MapAction/Map-Action-Mobile-App',
              },
            ],
          },
          {},
          {},
          
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Map Action, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
