const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');

// Color palette
const colors = {
  darkBlue: rgb(0.1, 0.21, 0.36),      // #1a365d - Title
  mediumBlue: rgb(0.17, 0.32, 0.51),   // #2c5282 - Heading 1
  lightBlue: rgb(0.17, 0.42, 0.69),    // #2b6cb0 - Heading 2
  accentBlue: rgb(0.19, 0.51, 0.81),   // #3182ce - Heading 3
  darkGray: rgb(0.29, 0.33, 0.41),     // #4a5568 - Subtitle
  black: rgb(0, 0, 0),
  white: rgb(1, 1, 1),
  lightGray: rgb(0.97, 0.98, 0.99),    // #f7fafc - Table alt row
  headerBg: rgb(0.17, 0.32, 0.51),     // Table header background
};

async function createPDF() {
  const pdfDoc = await PDFDocument.create();
  
  // Embed fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const courier = await pdfDoc.embedFont(StandardFonts.Courier);
  
  // Page settings
  const pageWidth = 612;  // Letter size
  const pageHeight = 792;
  const margin = 72;      // 1 inch
  const contentWidth = pageWidth - (margin * 2);
  
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPos = pageHeight - margin;
  
  // Helper functions
  function addPage() {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    yPos = pageHeight - margin;
    addHeader();
    addFooter();
    return currentPage;
  }
  
  function addHeader() {
    currentPage.drawText('Costronaut Technical Plan', {
      x: pageWidth - margin - 150,
      y: pageHeight - 40,
      size: 10,
      font: helveticaOblique,
      color: rgb(0.4, 0.4, 0.4),
    });
  }
  
  function addFooter() {
    const pageNum = pdfDoc.getPageCount();
    currentPage.drawText(`Page ${pageNum}`, {
      x: pageWidth / 2 - 20,
      y: 30,
      size: 10,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    });
  }
  
  function checkPageBreak(neededSpace) {
    if (yPos - neededSpace < margin + 50) {
      addPage();
      return true;
    }
    return false;
  }
  
  function drawTitle(text) {
    checkPageBreak(60);
    currentPage.drawText(text, {
      x: pageWidth / 2 - helveticaBold.widthOfTextAtSize(text, 28) / 2,
      y: yPos,
      size: 28,
      font: helveticaBold,
      color: colors.darkBlue,
    });
    yPos -= 40;
  }
  
  function drawSubtitle(text) {
    currentPage.drawText(text, {
      x: pageWidth / 2 - helvetica.widthOfTextAtSize(text, 14) / 2,
      y: yPos,
      size: 14,
      font: helvetica,
      color: colors.darkGray,
    });
    yPos -= 40;
  }
  
  function drawHeading1(text) {
    checkPageBreak(50);
    yPos -= 20;
    currentPage.drawText(text, {
      x: margin,
      y: yPos,
      size: 18,
      font: helveticaBold,
      color: colors.mediumBlue,
    });
    yPos -= 25;
  }
  
  function drawHeading2(text) {
    checkPageBreak(40);
    yPos -= 15;
    currentPage.drawText(text, {
      x: margin,
      y: yPos,
      size: 14,
      font: helveticaBold,
      color: colors.lightBlue,
    });
    yPos -= 20;
  }
  
  function drawHeading3(text) {
    checkPageBreak(35);
    yPos -= 12;
    currentPage.drawText(text, {
      x: margin,
      y: yPos,
      size: 12,
      font: helveticaBold,
      color: colors.accentBlue,
    });
    yPos -= 18;
  }
  
  function wrapText(text, maxWidth, font, fontSize) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }
  
  function drawParagraph(text, indent = 0) {
    const fontSize = 11;
    const lineHeight = 16;
    const lines = wrapText(text, contentWidth - indent, helvetica, fontSize);
    
    checkPageBreak(lines.length * lineHeight + 10);
    
    for (const line of lines) {
      currentPage.drawText(line, {
        x: margin + indent,
        y: yPos,
        size: fontSize,
        font: helvetica,
        color: colors.black,
      });
      yPos -= lineHeight;
    }
    yPos -= 8;
  }
  
  function drawBullet(text, indent = 20) {
    const fontSize = 11;
    const lineHeight = 16;
    const bulletIndent = indent;
    const textIndent = indent + 15;
    const lines = wrapText(text, contentWidth - textIndent, helvetica, fontSize);
    
    checkPageBreak(lines.length * lineHeight + 5);
    
    // Draw bullet
    currentPage.drawText('•', {
      x: margin + bulletIndent,
      y: yPos,
      size: fontSize,
      font: helvetica,
      color: colors.black,
    });
    
    // Draw text
    for (let i = 0; i < lines.length; i++) {
      currentPage.drawText(lines[i], {
        x: margin + textIndent,
        y: yPos,
        size: fontSize,
        font: helvetica,
        color: colors.black,
      });
      yPos -= lineHeight;
    }
    yPos -= 2;
  }
  
  function drawNumberedItem(number, text, boldPrefix = '') {
    const fontSize = 11;
    const lineHeight = 16;
    const numIndent = 20;
    const textIndent = 35;
    
    // Combine bold prefix with regular text for wrapping calculation
    const fullText = boldPrefix ? `${boldPrefix} ${text}` : text;
    const lines = wrapText(fullText, contentWidth - textIndent, helvetica, fontSize);
    
    checkPageBreak(lines.length * lineHeight + 8);
    
    // Draw number
    currentPage.drawText(`${number}.`, {
      x: margin + numIndent,
      y: yPos,
      size: fontSize,
      font: helveticaBold,
      color: colors.black,
    });
    
    // Draw text (first line may have bold prefix)
    for (let i = 0; i < lines.length; i++) {
      let xOffset = margin + textIndent;
      
      if (i === 0 && boldPrefix) {
        // Draw bold prefix
        currentPage.drawText(boldPrefix, {
          x: xOffset,
          y: yPos,
          size: fontSize,
          font: helveticaBold,
          color: colors.black,
        });
        xOffset += helveticaBold.widthOfTextAtSize(boldPrefix + ' ', fontSize);
        
        // Draw rest of first line
        const restOfLine = lines[0].substring(boldPrefix.length).trim();
        if (restOfLine) {
          currentPage.drawText(restOfLine, {
            x: xOffset,
            y: yPos,
            size: fontSize,
            font: helvetica,
            color: colors.black,
          });
        }
      } else {
        currentPage.drawText(lines[i], {
          x: xOffset,
          y: yPos,
          size: fontSize,
          font: helvetica,
          color: colors.black,
        });
      }
      yPos -= lineHeight;
    }
    yPos -= 4;
  }
  
  function drawCode(text, indent = 20) {
    const fontSize = 9;
    const lineHeight = 12;
    const lines = text.split('\n');
    
    checkPageBreak(lines.length * lineHeight + 10);
    
    // Draw background
    const bgHeight = lines.length * lineHeight + 10;
    currentPage.drawRectangle({
      x: margin + indent,
      y: yPos - bgHeight + lineHeight,
      width: contentWidth - indent,
      height: bgHeight,
      color: rgb(0.95, 0.95, 0.95),
    });
    
    yPos -= 5;
    for (const line of lines) {
      currentPage.drawText(line, {
        x: margin + indent + 5,
        y: yPos,
        size: fontSize,
        font: courier,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPos -= lineHeight;
    }
    yPos -= 10;
  }
  
  function drawTable(headers, rows, colWidths) {
    const fontSize = 9;
    const cellPadding = 5;
    const rowHeight = 25;
    const tableWidth = colWidths.reduce((a, b) => a + b, 0);
    
    checkPageBreak((rows.length + 1) * rowHeight + 20);
    
    let xPos = margin;
    
    // Draw header row
    currentPage.drawRectangle({
      x: xPos,
      y: yPos - rowHeight,
      width: tableWidth,
      height: rowHeight,
      color: colors.headerBg,
    });
    
    for (let i = 0; i < headers.length; i++) {
      currentPage.drawText(headers[i], {
        x: xPos + cellPadding,
        y: yPos - rowHeight + 8,
        size: fontSize,
        font: helveticaBold,
        color: colors.white,
      });
      xPos += colWidths[i];
    }
    yPos -= rowHeight;
    
    // Draw data rows
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      const row = rows[rowIdx];
      xPos = margin;
      
      // Alternating row background
      if (rowIdx % 2 === 1) {
        currentPage.drawRectangle({
          x: xPos,
          y: yPos - rowHeight,
          width: tableWidth,
          height: rowHeight,
          color: colors.lightGray,
        });
      }
      
      // Draw cell borders
      currentPage.drawRectangle({
        x: margin,
        y: yPos - rowHeight,
        width: tableWidth,
        height: rowHeight,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.5,
      });
      
      for (let i = 0; i < row.length; i++) {
        const cellText = row[i];
        // Truncate if too long
        let displayText = cellText;
        while (helvetica.widthOfTextAtSize(displayText, fontSize) > colWidths[i] - cellPadding * 2 && displayText.length > 0) {
          displayText = displayText.slice(0, -1);
        }
        
        currentPage.drawText(displayText, {
          x: xPos + cellPadding,
          y: yPos - rowHeight + 8,
          size: fontSize,
          font: rowIdx === -1 ? helveticaBold : helvetica,
          color: colors.black,
        });
        xPos += colWidths[i];
      }
      yPos -= rowHeight;
    }
    yPos -= 15;
  }
  
  // ============================================
  // BUILD THE DOCUMENT
  // ============================================
  
  // Title Page
  drawTitle('Costronaut');
  drawSubtitle('Browser Automation Tool — Technical Plan & Implementation Guide');
  yPos -= 20;
  
  // 1. Executive Summary
  drawHeading1('1. Executive Summary');
  drawParagraph('Costronaut is a browser automation tool designed to programmatically control web browsers, execute actions on web pages, and enable AI-driven automation workflows. This document outlines three distinct architectural approaches for building Costronaut, each with unique strengths and trade-offs.');
  
  // 2. Overview of Approaches
  drawHeading1('2. Overview of Approaches');
  drawNumberedItem(1, 'Industry-standard automation library with extension-based enhancements for real browser control', 'Playwright + Chrome Extension Harness:');
  drawNumberedItem(2, 'Desktop application framework with embedded Chromium, offering deep DOM access and native OS integration', 'NW.js + Custom Harness:');
  drawNumberedItem(3, 'Chrome DevTools Protocol (CDP), Puppeteer, Selenium WebDriver, and hybrid architectures', 'Alternative Approaches:');
  
  // 2.1 Quick Comparison Table
  drawHeading2('2.1 Quick Comparison');
  
  const tableHeaders = ['Criteria', 'Playwright + Ext', 'NW.js', 'CDP Direct'];
  const tableRows = [
    ['Setup Complexity', 'Low', 'Medium', 'High'],
    ['Cross-Browser', 'Yes (Chrome, FF, Safari)', 'Chromium only', 'Chromium only'],
    ['Real User Sessions', 'With extension', 'Yes', 'Limited'],
    ['Native OS Access', 'No', 'Yes', 'No'],
    ['Bot Detection Risk', 'Medium', 'Low', 'High'],
    ['Best For', 'Testing, scraping', 'Desktop apps', 'Low-level control'],
  ];
  drawTable(tableHeaders, tableRows, [120, 110, 110, 110]);
  
  // Page break
  addPage();
  
  // 3. Approach 1: Playwright
  drawHeading1('3. Approach 1: Playwright + Chrome Extension Harness');
  
  drawHeading2('3.1 Architecture Overview');
  drawParagraph('This approach combines Playwright\'s robust automation capabilities with a Chrome extension that acts as a bridge between automated scripts and real browser sessions. The extension enables features like capturing user interactions, accessing authenticated sessions, and providing visual feedback.');
  
  drawHeading2('3.2 Step-by-Step Implementation');
  
  drawHeading3('Phase 1: Project Setup (Days 1-2)');
  drawNumberedItem(1, '', 'Initialize the project structure');
  drawCode('mkdir costronaut-playwright && cd costronaut-playwright\nnpm init -y\nmkdir -p src/{core,extension,agent} tests');
  
  drawNumberedItem(2, '', 'Install core dependencies');
  drawCode('npm install playwright playwright-extra puppeteer-extra-plugin-stealth\nnpm install typescript @types/node ts-node --save-dev\nnpm install ws express dotenv zod');
  
  drawNumberedItem(3, 'Create tsconfig.json with strict mode, ES2022 target, and NodeNext module resolution.', 'Configure TypeScript');
  
  drawNumberedItem(4, '', 'Install Playwright browsers');
  drawCode('npx playwright install chromium firefox webkit');
  
  drawHeading3('Phase 2: Core Automation Engine (Days 3-7)');
  drawNumberedItem(1, '', 'Create the BrowserController class (src/core/BrowserController.ts)');
  drawBullet('Implement browser launch with configurable options (headless, viewport, proxy)', 35);
  drawBullet('Add context management for isolated sessions with persistent storage', 35);
  drawBullet('Integrate playwright-extra with stealth plugin to avoid bot detection', 35);
  drawBullet('Implement page lifecycle hooks (beforeNavigate, afterLoad, onError)', 35);
  
  drawNumberedItem(2, '', 'Build the ActionExecutor class (src/core/ActionExecutor.ts)');
  drawBullet('Define action types: click, type, scroll, wait, screenshot, extract', 35);
  drawBullet('Implement smart element location (CSS, XPath, text content, ARIA labels)', 35);
  drawBullet('Add automatic retry logic with exponential backoff', 35);
  drawBullet('Create action recording/playback functionality', 35);
  
  // Page break
  addPage();
  
  drawHeading3('Phase 3: Chrome Extension Harness (Days 8-14)');
  drawNumberedItem(1, 'Use Manifest V3 with service worker. Request permissions for activeTab, scripting, storage, webNavigation, and debugger APIs.', 'Create extension manifest (src/extension/manifest.json)');
  
  drawNumberedItem(2, '', 'Build the background service worker (src/extension/background.js)');
  drawBullet('Establish WebSocket connection to Costronaut server', 35);
  drawBullet('Handle incoming commands and route to appropriate handlers', 35);
  drawBullet('Manage tab lifecycle and session persistence', 35);
  drawBullet('Implement heartbeat mechanism for connection health', 35);
  
  drawNumberedItem(3, '', 'Create content script (src/extension/content.js)');
  drawBullet('DOM manipulation and element interaction', 35);
  drawBullet('Event capture and forwarding (clicks, inputs, navigation)', 35);
  drawBullet('Visual highlighting of target elements', 35);
  drawBullet('Screenshot and DOM snapshot capabilities', 35);
  
  drawHeading3('Phase 4: AI Agent Integration (Days 15-21)');
  drawNumberedItem(1, '', 'Create the AgentController class (src/agent/AgentController.ts)');
  drawBullet('Page state extraction (DOM tree, visible text, interactive elements)', 35);
  drawBullet('Screenshot annotation with element bounding boxes', 35);
  drawBullet('Action planning interface for LLM integration', 35);
  drawBullet('Execution feedback loop with success/failure detection', 35);
  
  // Page break
  addPage();
  
  // 4. Approach 2: NW.js
  drawHeading1('4. Approach 2: NW.js + Custom Harness');
  
  drawHeading2('4.1 Architecture Overview');
  drawParagraph('NW.js (formerly node-webkit) provides a desktop application shell with embedded Chromium and full Node.js integration. This approach gives you complete control over both the browser environment and the host system, enabling features like file system access, native notifications, and custom window management.');
  
  drawHeading2('4.2 Step-by-Step Implementation');
  
  drawHeading3('Phase 1: Project Setup (Days 1-3)');
  drawNumberedItem(1, '', 'Initialize the NW.js project');
  drawCode('mkdir costronaut-nwjs && cd costronaut-nwjs\nnpm init -y\nnpm install nw@sdk --save-dev');
  
  drawNumberedItem(2, 'Add required NW.js fields: main (entry HTML file), window configuration, node-remote for Node.js access in web context, chromium-args for debugging flags.', 'Configure package.json for NW.js');
  
  drawHeading3('Phase 2: Core Application Shell (Days 4-8)');
  drawNumberedItem(1, '', 'Create the main window (src/index.html)');
  drawBullet('Split-pane layout: navigation panel + webview container', 35);
  drawBullet('DevTools integration panel for debugging', 35);
  drawBullet('Action log and status display area', 35);
  
  drawNumberedItem(2, '', 'Implement the WindowManager class (src/core/WindowManager.ts)');
  drawBullet('Multi-window orchestration with parent-child relationships', 35);
  drawBullet('Window positioning, resizing, and state persistence', 35);
  drawBullet('System tray integration for background operation', 35);
  
  drawHeading3('Phase 3: Automation Harness (Days 9-15)');
  drawNumberedItem(1, '', 'Create the InjectionManager (src/harness/InjectionManager.ts)');
  drawBullet('Script injection into webview contexts using executeScript', 35);
  drawBullet('CSS injection for visual feedback (element highlighting)', 35);
  drawBullet('MutationObserver setup for DOM change detection', 35);
  
  drawNumberedItem(2, '', 'Build the ActionBridge (src/harness/ActionBridge.ts)');
  drawBullet('Bidirectional communication between Node.js and webview', 35);
  drawBullet('Command serialization and result passing', 35);
  drawBullet('Error boundary handling for crashed pages', 35);
  
  // Page break
  addPage();
  
  // 5. Alternative Approaches
  drawHeading1('5. Approach 3: Alternative Methods');
  
  drawHeading2('5.1 Chrome DevTools Protocol (CDP) Direct');
  drawParagraph('CDP provides low-level access to Chrome\'s debugging interface. This approach offers maximum control but requires more implementation effort.');
  
  drawHeading3('Implementation Steps');
  drawNumberedItem(1, '', 'Launch Chrome with remote debugging enabled');
  drawCode('chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug');
  
  drawNumberedItem(2, '', 'Connect via WebSocket to CDP endpoint');
  drawBullet('Fetch available targets from http://localhost:9222/json', 35);
  drawBullet('Establish WebSocket connection to target\'s webSocketDebuggerUrl', 35);
  
  drawNumberedItem(3, '', 'Implement CDP domain handlers');
  drawBullet('Page domain: Navigation, screenshots, lifecycle events', 35);
  drawBullet('DOM domain: Node queries, attribute manipulation', 35);
  drawBullet('Input domain: Mouse, keyboard, touch events', 35);
  drawBullet('Runtime domain: JavaScript execution', 35);
  
  drawHeading2('5.2 Puppeteer-Based Approach');
  drawParagraph('Puppeteer is Google\'s official high-level API over CDP. It\'s simpler than raw CDP and battle-tested for Chrome automation.');
  
  drawNumberedItem(1, '', 'Install Puppeteer with extras');
  drawCode('npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth');
  
  drawNumberedItem(2, '', 'Connect to existing browser (for real sessions)');
  drawBullet('Use puppeteer.connect() with browserWSEndpoint', 35);
  drawBullet('Access existing pages and sessions', 35);
  
  drawHeading2('5.3 Selenium WebDriver');
  drawParagraph('Selenium provides cross-browser compatibility through the WebDriver protocol. Best for scenarios requiring Firefox or Safari support.');
  
  drawNumberedItem(1, '', 'Set up Selenium with Node.js bindings');
  drawCode('npm install selenium-webdriver chromedriver geckodriver');
  
  // Page break
  addPage();
  
  // 6. Recommendations
  drawHeading1('6. Recommended Implementation Strategy');
  
  drawHeading2('6.1 Phased Development Plan');
  
  drawNumberedItem(1, 'Playwright offers the fastest path to a working prototype with excellent documentation and community support. Build the core automation engine and test against real websites.', 'Phase 1 (Weeks 1-2): Start with Playwright approach');
  
  drawNumberedItem(2, 'The extension enables real browser session control, which is critical for workflows requiring authentication or avoiding bot detection.', 'Phase 2 (Weeks 3-4): Add Chrome extension harness');
  
  drawNumberedItem(3, 'If desktop distribution and native OS integration are requirements, port the core engine to NW.js. The automation logic can be shared between approaches.', 'Phase 3 (Weeks 5-6): Evaluate NW.js for desktop version');
  
  drawNumberedItem(4, 'Implement the agent layer that can plan and execute multi-step tasks. Add visual feedback, error recovery, and user-facing documentation.', 'Phase 4 (Weeks 7-8): AI agent integration and polish');
  
  drawHeading2('6.2 Key Success Factors');
  
  drawBullet('Robust element location: Websites change frequently. Use multiple selector strategies with automatic fallbacks.');
  drawBullet('Bot detection mitigation: Use stealth plugins, realistic timing, and consider extension-based approaches for sensitive sites.');
  drawBullet('Session persistence: Save and restore browser state (cookies, local storage) between runs.');
  drawBullet('Error recovery: Implement retry logic, screenshot capture on failure, and graceful degradation.');
  drawBullet('Observability: Log all actions with timestamps, maintain execution traces for debugging.');
  
  drawHeading2('6.3 Directory Structure');
  yPos -= 10;
  drawCode(`costronaut/
+-- packages/
|   +-- core/              # Shared automation engine
|   |   +-- src/
|   |   |   +-- actions/   # Click, type, scroll, etc.
|   |   |   +-- locators/  # Element finding strategies
|   |   |   +-- session/   # Browser session management
|   |   |   +-- agent/     # AI integration layer
|   |   +-- package.json
|   +-- playwright-driver/ # Playwright implementation
|   +-- nwjs-app/          # NW.js desktop application
|   +-- chrome-extension/  # Browser extension harness
+-- tests/
+-- docs/
+-- package.json           # Monorepo root`);
  
  // Add footers to all pages
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    page.drawText(`Page ${i + 1} of ${pages.length}`, {
      x: pageWidth / 2 - 30,
      y: 30,
      size: 10,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    });
  }
  
  // Save PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('./Costronaut-Technical-Plan.pdf', pdfBytes);
  console.log('PDF created successfully: Costronaut-Technical-Plan.pdf');
}

createPDF().catch(console.error);
