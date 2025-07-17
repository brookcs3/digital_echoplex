import { test, expect } from '@playwright/test';

test('LED Position and Color Inspector', async ({ page }) => {
  // Navigate to the Echoplex
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForSelector('#echoplex-container');
  
  console.log('=== LED POSITIONING INSPECTION ===');
  
  // Input Level LED
  const inputLED = page.locator('#input-level');
  const inputBox = await inputLED.boundingBox();
  const inputStyles = await inputLED.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      left: computed.left,
      top: computed.top,
      width: computed.width,
      height: computed.height,
      backgroundColor: computed.backgroundColor,
      boxShadow: computed.boxShadow,
      visibility: computed.visibility,
      opacity: computed.opacity,
      display: computed.display,
      position: computed.position,
      zIndex: computed.zIndex
    };
  });
  
  console.log('INPUT LED:');
  console.log('- Bounding Box:', inputBox);
  console.log('- Computed Styles:', inputStyles);
  console.log('- Inline Style:', await inputLED.getAttribute('style'));
  
  // Feedback Level LED  
  const feedbackLED = page.locator('#feedback-level');
  const feedbackBox = await feedbackLED.boundingBox();
  const feedbackStyles = await feedbackLED.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      left: computed.left,
      top: computed.top,
      width: computed.width,
      height: computed.height,
      backgroundColor: computed.backgroundColor,
      boxShadow: computed.boxShadow,
      visibility: computed.visibility,
      opacity: computed.opacity,
      display: computed.display,
      position: computed.position,
      zIndex: computed.zIndex
    };
  });
  
  console.log('FEEDBACK LED:');
  console.log('- Bounding Box:', feedbackBox);
  console.log('- Computed Styles:', feedbackStyles);
  console.log('- Inline Style:', await feedbackLED.getAttribute('style'));
  
  // Check if LEDs are visible in viewport
  const inputVisible = await inputLED.isVisible();
  const feedbackVisible = await feedbackLED.isVisible();
  
  console.log('VISIBILITY:');
  console.log('- Input LED visible:', inputVisible);
  console.log('- Feedback LED visible:', feedbackVisible);
  
  // Check container positioning for reference
  const container = page.locator('#echoplex-container');
  const containerBox = await container.boundingBox();
  
  console.log('CONTAINER:');
  console.log('- Echoplex Container Box:', containerBox);
  
  // Calculate expected positions based on percentages
  if (containerBox) {
    const expectedInputLeft = containerBox.x + (containerBox.width * 0.1315);
    const expectedInputTop = containerBox.y + (containerBox.height * 0.73);
    const expectedFeedbackLeft = containerBox.x + (containerBox.width * 0.1705);
    const expectedFeedbackTop = containerBox.y + (containerBox.height * 0.73);
    
    console.log('EXPECTED POSITIONS:');
    console.log('- Input LED should be at:', { x: expectedInputLeft, y: expectedInputTop });
    console.log('- Feedback LED should be at:', { x: expectedFeedbackLeft, y: expectedFeedbackTop });
    
    if (inputBox) {
      console.log('- Input LED actually at:', { x: inputBox.x, y: inputBox.y });
      console.log('- Input LED offset:', { 
        x: inputBox.x - expectedInputLeft, 
        y: inputBox.y - expectedInputTop 
      });
    }
    
    if (feedbackBox) {
      console.log('- Feedback LED actually at:', { x: feedbackBox.x, y: feedbackBox.y });
      console.log('- Feedback LED offset:', { 
        x: feedbackBox.x - expectedFeedbackLeft, 
        y: feedbackBox.y - expectedFeedbackTop 
      });
    }
  }
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'tests/led-inspection.png', fullPage: true });
  console.log('Screenshot saved to tests/led-inspection.png');
});