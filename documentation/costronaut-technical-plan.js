const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle, 
        WidthType, ShadingType, PageNumber, PageBreak } = require('docx');
const fs = require('fs');

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 56, bold: true, color: "1a365d", font: "Arial" },
        paragraph: { spacing: { before: 0, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: "2c5282", font: "Arial" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "2b6cb0", font: "Arial" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: "3182ce", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-overview",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-pw-setup",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-pw-core",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-pw-ext",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-pw-agent",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-nw-setup",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-nw-core",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-nw-harness",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-nw-agent",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-alt",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-cdp",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-pup",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-sel",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-impl",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Costronaut Technical Plan", italics: true, color: "666666", size: 20 })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", size: 20 }), new TextRun({ children: [PageNumber.CURRENT], size: 20 }), new TextRun({ text: " of ", size: 20 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 20 })]
      })] })
    },
    children: [
      // Title
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Costronaut")] }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "Browser Automation Tool — Technical Plan & Implementation Guide", size: 28, color: "4a5568" })]
      }),

      // Executive Summary
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Executive Summary")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("Costronaut is a browser automation tool designed to programmatically control web browsers, execute actions on web pages, and enable AI-driven automation workflows. This document outlines three distinct architectural approaches for building Costronaut, each with unique strengths and trade-offs.")
      ]}),

      // Overview of Approaches
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Overview of Approaches")] }),
      
      new Paragraph({ numbering: { reference: "numbered-overview", level: 0 }, children: [
        new TextRun({ text: "Playwright + Chrome Extension Harness: ", bold: true }),
        new TextRun("Industry-standard automation library with extension-based enhancements for real browser control")
      ]}),
      new Paragraph({ numbering: { reference: "numbered-overview", level: 0 }, children: [
        new TextRun({ text: "NW.js + Custom Harness: ", bold: true }),
        new TextRun("Desktop application framework with embedded Chromium, offering deep DOM access and native OS integration")
      ]}),
      new Paragraph({ numbering: { reference: "numbered-overview", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Alternative Approaches: ", bold: true }),
        new TextRun("Chrome DevTools Protocol (CDP), Puppeteer, Selenium WebDriver, and hybrid architectures")
      ]}),

      // Comparison Table
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Quick Comparison")] }),
      
      new Table({
        columnWidths: [2340, 2340, 2340, 2340],
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "2c5282", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Criteria", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "2c5282", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Playwright + Extension", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "2c5282", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "NW.js", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "2c5282", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "CDP Direct", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Setup Complexity", bold: true })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("Low")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("Medium")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("High")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Cross-Browser", bold: true })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Yes (Chrome, Firefox, Safari)")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Chromium only")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Chromium only")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Real User Sessions", bold: true })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("With extension")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("Yes")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("Limited")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Native OS Access", bold: true })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("No")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Yes")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("No")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Bot Detection Risk", bold: true })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("Medium (stealth plugins help)")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("Low")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("High")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Best For", bold: true })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Testing, scraping, rapid prototyping")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Desktop apps, persistent sessions")] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f7fafc", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Low-level control, custom protocols")] })] })
            ]
          })
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // APPROACH 1: Playwright
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Approach 1: Playwright + Chrome Extension Harness")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Architecture Overview")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("This approach combines Playwright's robust automation capabilities with a Chrome extension that acts as a bridge between automated scripts and real browser sessions. The extension enables features like capturing user interactions, accessing authenticated sessions, and providing visual feedback.")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Step-by-Step Implementation")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Phase 1: Project Setup (Days 1-2)")] }),
      
      new Paragraph({ numbering: { reference: "numbered-pw-setup", level: 0 }, children: [
        new TextRun({ text: "Initialize the project structure", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 720 }, children: [
        new TextRun({ text: "mkdir costronaut-playwright && cd costronaut-playwright\nnpm init -y\nmkdir -p src/{core,extension,agent} tests", font: "Consolas", size: 20 })
      ]}),
      
      new Paragraph({ numbering: { reference: "numbered-pw-setup", level: 0 }, children: [
        new TextRun({ text: "Install core dependencies", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 720 }, children: [
        new TextRun({ text: "npm install playwright playwright-extra puppeteer-extra-plugin-stealth\nnpm install typescript @types/node ts-node --save-dev\nnpm install ws express dotenv zod", font: "Consolas", size: 20 })
      ]}),

      new Paragraph({ numbering: { reference: "numbered-pw-setup", level: 0 }, children: [
        new TextRun({ text: "Configure TypeScript", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 720 }, children: [
        new TextRun("Create tsconfig.json with strict mode, ES2022 target, and module resolution set to NodeNext. Enable source maps for debugging.")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-pw-setup", level: 0 }, children: [
        new TextRun({ text: "Install Playwright browsers", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 200 }, indent: { left: 720 }, children: [
        new TextRun({ text: "npx playwright install chromium firefox webkit", font: "Consolas", size: 20 })
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Phase 2: Core Automation Engine (Days 3-7)")] }),
      
      new Paragraph({ numbering: { reference: "numbered-pw-core", level: 0 }, children: [
        new TextRun({ text: "Create the BrowserController class (src/core/BrowserController.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Implement browser launch with configurable options (headless, viewport, proxy)")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Add context management for isolated sessions with persistent storage")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Integrate playwright-extra with stealth plugin to avoid bot detection")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Implement page lifecycle hooks (beforeNavigate, afterLoad, onError)")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-pw-core", level: 0 }, children: [
        new TextRun({ text: "Build the ActionExecutor class (src/core/ActionExecutor.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Define action types: click, type, scroll, wait, screenshot, extract")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Implement smart element location (CSS, XPath, text content, ARIA labels)")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Add automatic retry logic with exponential backoff")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Create action recording/playback functionality")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-pw-core", level: 0 }, children: [
        new TextRun({ text: "Implement the ElementLocator utility (src/core/ElementLocator.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Multi-strategy element finding (prioritize stable selectors)")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Fuzzy text matching for dynamic content")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Shadow DOM traversal support")
      ]}),
      new Paragraph({ spacing: { after: 200 }, numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("iframe handling with automatic context switching")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Phase 3: Chrome Extension Harness (Days 8-14)")] }),
      
      new Paragraph({ numbering: { reference: "numbered-pw-ext", level: 0 }, children: [
        new TextRun({ text: "Create extension manifest (src/extension/manifest.json)", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 720 }, children: [
        new TextRun("Use Manifest V3 with service worker background script. Request permissions for activeTab, scripting, storage, webNavigation, and debugger APIs. Configure content scripts to run on all URLs.")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-pw-ext", level: 0 }, children: [
        new TextRun({ text: "Build the background service worker (src/extension/background.js)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Establish WebSocket connection to Costronaut server")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Handle incoming commands and route to appropriate handlers")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Manage tab lifecycle and session persistence")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Implement heartbeat mechanism for connection health")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-pw-ext", level: 0 }, children: [
        new TextRun({ text: "Create content script (src/extension/content.js)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("DOM manipulation and element interaction")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Event capture and forwarding (clicks, inputs, navigation)")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Visual highlighting of target elements")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Screenshot and DOM snapshot capabilities")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-pw-ext", level: 0 }, children: [
        new TextRun({ text: "Implement communication protocol", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Define JSON-RPC style message format with request IDs")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Create command schemas using Zod for validation")
      ]}),
      new Paragraph({ spacing: { after: 200 }, numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Handle bidirectional streaming for real-time updates")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Phase 4: AI Agent Integration (Days 15-21)")] }),
      
      new Paragraph({ numbering: { reference: "numbered-pw-agent", level: 0 }, children: [
        new TextRun({ text: "Create the AgentController class (src/agent/AgentController.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Page state extraction (DOM tree, visible text, interactive elements)")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Screenshot annotation with element bounding boxes")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Action planning interface for LLM integration")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Execution feedback loop with success/failure detection")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-pw-agent", level: 0 }, children: [
        new TextRun({ text: "Build the ScreenAnalyzer module (src/agent/ScreenAnalyzer.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Accessibility tree extraction for semantic understanding")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Interactive element identification and labeling")
      ]}),
      new Paragraph({ spacing: { after: 200 }, numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Page structure summarization for context compression")
      ]}),

      new Paragraph({ children: [new PageBreak()] }),

      // APPROACH 2: NW.js
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Approach 2: NW.js + Custom Harness")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Architecture Overview")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("NW.js (formerly node-webkit) provides a desktop application shell with embedded Chromium and full Node.js integration. This approach gives you complete control over both the browser environment and the host system, enabling features like file system access, native notifications, and custom window management.")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Step-by-Step Implementation")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Phase 1: Project Setup (Days 1-3)")] }),
      
      new Paragraph({ numbering: { reference: "numbered-nw-setup", level: 0 }, children: [
        new TextRun({ text: "Initialize the NW.js project", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 720 }, children: [
        new TextRun({ text: "mkdir costronaut-nwjs && cd costronaut-nwjs\nnpm init -y\nnpm install nw@sdk --save-dev", font: "Consolas", size: 20 })
      ]}),

      new Paragraph({ numbering: { reference: "numbered-nw-setup", level: 0 }, children: [
        new TextRun({ text: "Configure package.json for NW.js", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 720 }, children: [
        new TextRun("Add required NW.js fields: main (entry HTML file), window configuration (width, height, toolbar visibility), node-remote for Node.js access in web context, chromium-args for debugging flags.")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-nw-setup", level: 0 }, children: [
        new TextRun({ text: "Install additional dependencies", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 200 }, indent: { left: 720 }, children: [
        new TextRun({ text: "npm install electron-store ws express\nnpm install typescript @types/node ts-node --save-dev", font: "Consolas", size: 20 })
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Phase 2: Core Application Shell (Days 4-8)")] }),
      
      new Paragraph({ numbering: { reference: "numbered-nw-core", level: 0 }, children: [
        new TextRun({ text: "Create the main window (src/index.html)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Split-pane layout: navigation panel + webview container")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("DevTools integration panel for debugging")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Action log and status display area")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-nw-core", level: 0 }, children: [
        new TextRun({ text: "Implement the WindowManager class (src/core/WindowManager.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Multi-window orchestration with parent-child relationships")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Window positioning, resizing, and state persistence")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("System tray integration for background operation")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-nw-core", level: 0 }, children: [
        new TextRun({ text: "Build the WebViewManager class (src/core/WebViewManager.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Create and manage multiple webview instances")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Session isolation with separate partitions")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Cookie and storage management")
      ]}),
      new Paragraph({ spacing: { after: 200 }, numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Navigation event interception")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Phase 3: Automation Harness (Days 9-15)")] }),
      
      new Paragraph({ numbering: { reference: "numbered-nw-harness", level: 0 }, children: [
        new TextRun({ text: "Create the InjectionManager (src/harness/InjectionManager.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Script injection into webview contexts using executeScript")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("CSS injection for visual feedback (element highlighting)")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("MutationObserver setup for DOM change detection")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-nw-harness", level: 0 }, children: [
        new TextRun({ text: "Build the ActionBridge (src/harness/ActionBridge.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Bidirectional communication between Node.js and webview")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Command serialization and result passing")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Error boundary handling for crashed pages")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-nw-harness", level: 0 }, children: [
        new TextRun({ text: "Implement the RecordingEngine (src/harness/RecordingEngine.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Capture user interactions (clicks, typing, scrolling)")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Generate reproducible action scripts")
      ]}),
      new Paragraph({ spacing: { after: 200 }, numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Smart selector generation with fallbacks")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Phase 4: AI Agent Integration (Days 16-21)")] }),
      
      new Paragraph({ numbering: { reference: "numbered-nw-agent", level: 0 }, children: [
        new TextRun({ text: "Create the VisionModule (src/agent/VisionModule.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Screen capture using nw.Window.capturePage()")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Element annotation overlay generation")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Coordinate mapping between screen and DOM")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-nw-agent", level: 0 }, children: [
        new TextRun({ text: "Build the TaskOrchestrator (src/agent/TaskOrchestrator.ts)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("High-level task decomposition")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Multi-step action planning and execution")
      ]}),
      new Paragraph({ spacing: { after: 200 }, numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("State verification and recovery mechanisms")
      ]}),

      new Paragraph({ children: [new PageBreak()] }),

      // APPROACH 3: Alternative Approaches
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Approach 3: Alternative Methods")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 Chrome DevTools Protocol (CDP) Direct")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("CDP provides low-level access to Chrome's debugging interface. This approach offers maximum control but requires more implementation effort.")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Implementation Steps")] }),
      
      new Paragraph({ numbering: { reference: "numbered-cdp", level: 0 }, children: [
        new TextRun({ text: "Launch Chrome with remote debugging enabled", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 720 }, children: [
        new TextRun({ text: "chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug", font: "Consolas", size: 20 })
      ]}),

      new Paragraph({ numbering: { reference: "numbered-cdp", level: 0 }, children: [
        new TextRun({ text: "Connect via WebSocket to CDP endpoint", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Fetch available targets from http://localhost:9222/json")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Establish WebSocket connection to target's webSocketDebuggerUrl")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-cdp", level: 0 }, children: [
        new TextRun({ text: "Implement CDP domain handlers", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Page domain: Navigation, screenshots, lifecycle events")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("DOM domain: Node queries, attribute manipulation")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Input domain: Mouse, keyboard, touch events")
      ]}),
      new Paragraph({ spacing: { after: 200 }, numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Runtime domain: JavaScript execution")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 Puppeteer-Based Approach")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("Puppeteer is Google's official high-level API over CDP. It's simpler than raw CDP and battle-tested for Chrome automation.")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Implementation Steps")] }),
      
      new Paragraph({ numbering: { reference: "numbered-pup", level: 0 }, children: [
        new TextRun({ text: "Install Puppeteer with extras", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 720 }, children: [
        new TextRun({ text: "npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth", font: "Consolas", size: 20 })
      ]}),

      new Paragraph({ numbering: { reference: "numbered-pup", level: 0 }, children: [
        new TextRun({ text: "Connect to existing browser (for real sessions)", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Use puppeteer.connect() with browserWSEndpoint")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Access existing pages and sessions")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-pup", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Leverage built-in features", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Auto-waiting for elements and navigation")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("PDF generation and screenshot capabilities")
      ]}),
      new Paragraph({ spacing: { after: 200 }, numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Request interception and mocking")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.3 Selenium WebDriver")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("Selenium provides cross-browser compatibility through the WebDriver protocol. Best for scenarios requiring Firefox or Safari support.")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Implementation Steps")] }),
      
      new Paragraph({ numbering: { reference: "numbered-sel", level: 0 }, children: [
        new TextRun({ text: "Set up Selenium with Node.js bindings", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 720 }, children: [
        new TextRun({ text: "npm install selenium-webdriver chromedriver geckodriver", font: "Consolas", size: 20 })
      ]}),

      new Paragraph({ numbering: { reference: "numbered-sel", level: 0 }, children: [
        new TextRun({ text: "Configure browser-specific capabilities", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Chrome: Use Chrome options for extensions, user data directory")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Firefox: Use Firefox profile for session persistence")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-sel", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Implement wait strategies and error handling", bold: true })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Explicit waits for dynamic content")
      ]}),
      new Paragraph({ spacing: { after: 200 }, numbering: { reference: "bullet-list", level: 0 }, indent: { left: 1080, hanging: 360 }, children: [
        new TextRun("Stale element reference recovery")
      ]}),

      new Paragraph({ children: [new PageBreak()] }),

      // Recommendations
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Recommended Implementation Strategy")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 Phased Development Plan")] }),
      
      new Paragraph({ numbering: { reference: "numbered-impl", level: 0 }, children: [
        new TextRun({ text: "Phase 1 (Weeks 1-2): Start with Playwright approach", bold: true })
      ]}),
      new Paragraph({ indent: { left: 720 }, children: [
        new TextRun("Playwright offers the fastest path to a working prototype with excellent documentation and community support. Build the core automation engine and test against real websites.")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-impl", level: 0 }, children: [
        new TextRun({ text: "Phase 2 (Weeks 3-4): Add Chrome extension harness", bold: true })
      ]}),
      new Paragraph({ indent: { left: 720 }, children: [
        new TextRun("The extension enables real browser session control, which is critical for workflows requiring authentication or avoiding bot detection. This bridges the gap between automated and manual browsing.")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-impl", level: 0 }, children: [
        new TextRun({ text: "Phase 3 (Weeks 5-6): Evaluate NW.js for desktop version", bold: true })
      ]}),
      new Paragraph({ indent: { left: 720 }, children: [
        new TextRun("If desktop distribution and native OS integration are requirements, port the core engine to NW.js. The automation logic can be shared between approaches.")
      ]}),

      new Paragraph({ numbering: { reference: "numbered-impl", level: 0 }, children: [
        new TextRun({ text: "Phase 4 (Weeks 7-8): AI agent integration and polish", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 200 }, indent: { left: 720 }, children: [
        new TextRun("Implement the agent layer that can plan and execute multi-step tasks. Add visual feedback, error recovery, and user-facing documentation.")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.2 Key Success Factors")] }),
      
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Robust element location: ", bold: true }),
        new TextRun("Websites change frequently. Use multiple selector strategies with automatic fallbacks.")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Bot detection mitigation: ", bold: true }),
        new TextRun("Use stealth plugins, realistic timing, and consider extension-based approaches for sensitive sites.")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Session persistence: ", bold: true }),
        new TextRun("Save and restore browser state (cookies, local storage) between runs.")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Error recovery: ", bold: true }),
        new TextRun("Implement retry logic, screenshot capture on failure, and graceful degradation.")
      ]}),
      new Paragraph({ spacing: { after: 200 }, numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Observability: ", bold: true }),
        new TextRun("Log all actions with timestamps, maintain execution traces for debugging.")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.3 Directory Structure")] }),
      new Paragraph({ spacing: { after: 100 }, children: [
        new TextRun({ text: `costronaut/
├── packages/
│   ├── core/              # Shared automation engine
│   │   ├── src/
│   │   │   ├── actions/   # Click, type, scroll, etc.
│   │   │   ├── locators/  # Element finding strategies
│   │   │   ├── session/   # Browser session management
│   │   │   └── agent/     # AI integration layer
│   │   └── package.json
│   ├── playwright-driver/ # Playwright-specific implementation
│   │   ├── src/
│   │   └── package.json
│   ├── nwjs-app/          # NW.js desktop application
│   │   ├── src/
│   │   └── package.json
│   └── chrome-extension/  # Browser extension harness
│       ├── manifest.json
│       └── src/
├── tests/
├── docs/
└── package.json           # Monorepo root`, font: "Consolas", size: 18 })
      ]}),

      new Paragraph({ children: [new PageBreak()] }),

      // Appendix
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Appendix: Code Templates")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.1 Playwright Browser Controller")] }),
      new Paragraph({ spacing: { after: 100 }, children: [
        new TextRun({ text: `import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { addExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export class BrowserController {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  
  async launch(options: LaunchOptions = {}) {
    const chromiumExtra = addExtra(chromium);
    chromiumExtra.use(StealthPlugin());
    
    this.browser = await chromiumExtra.launch({
      headless: options.headless ?? false,
      args: ['--disable-blink-features=AutomationControlled']
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: options.userAgent
    });
    
    return this.context.newPage();
  }
  
  async close() {
    await this.context?.close();
    await this.browser?.close();
  }
}`, font: "Consolas", size: 18 })
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.2 Chrome Extension Message Handler")] }),
      new Paragraph({ spacing: { after: 100 }, children: [
        new TextRun({ text: `// background.js (Service Worker)
let ws = null;

function connect() {
  ws = new WebSocket('ws://localhost:8080');
  
  ws.onmessage = async (event) => {
    const { id, method, params } = JSON.parse(event.data);
    
    try {
      const result = await executeCommand(method, params);
      ws.send(JSON.stringify({ id, result }));
    } catch (error) {
      ws.send(JSON.stringify({ id, error: error.message }));
    }
  };
}

async function executeCommand(method, params) {
  switch (method) {
    case 'navigate':
      return chrome.tabs.update(params.tabId, { url: params.url });
    case 'click':
      return chrome.scripting.executeScript({
        target: { tabId: params.tabId },
        func: (selector) => document.querySelector(selector)?.click(),
        args: [params.selector]
      });
    case 'screenshot':
      return chrome.tabs.captureVisibleTab();
  }
}

connect();`, font: "Consolas", size: 18 })
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.3 NW.js WebView Manager")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: `export class WebViewManager {
  private webview: HTMLElement;
  
  constructor(containerId: string) {
    this.webview = document.createElement('webview');
    this.webview.setAttribute('partition', 'persist:costronaut');
    this.webview.setAttribute('nodeintegration', 'false');
    document.getElementById(containerId)?.appendChild(this.webview);
    
    this.setupEventListeners();
  }
  
  private setupEventListeners() {
    this.webview.addEventListener('did-finish-load', () => {
      this.injectAutomationScripts();
    });
  }
  
  async navigate(url: string): Promise<void> {
    this.webview.setAttribute('src', url);
    return new Promise(resolve => {
      this.webview.addEventListener('did-finish-load', () => resolve(), 
        { once: true });
    });
  }
  
  async executeScript(code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.webview.executeScript({ code }, (results) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(results?.[0]);
        }
      });
    });
  }
}`, font: "Consolas", size: 18 })
      ]})
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("./Costronaut-Technical-Plan.docx", buffer);
  console.log("Document created successfully!");
});
