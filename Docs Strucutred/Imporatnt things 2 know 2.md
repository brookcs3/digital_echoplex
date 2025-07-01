### **omprehensive Explanation of the Front Panel: Starting with RECORD** 

The front panel of the Echoplex Digital Pro Plus is the primary interface for controlling its functions.  It includes buttons, knobs, indicator lights, and displays that allow users to interact with the device.  Below is a detailed explanation of the **Record** button and its associated settings. 

### **RECORD Button**

The **Record** button is the starting point for creating loops.  It allows users to record audio into the Echoplex and defines the loop length.  The button has multiple functionalities depending on the mode and settings.  Here’s how it works:

#### **1. RecordMode**

The behavior of the **Record** button is determined by the **RecordMode** parameter, which has three options:

- 

- **Functionality**: Press the **Record** button once to start recording.  Press it again to stop recording and begin looping. 

- 

- User Experience

  :

  - 
  - When recording starts, the LoopTime Display begins counting the time of the loop. 
  - 
  - When recording ends, the loop immediately begins playback. 
  - 
  - This mode is intuitive and ideal for most users, as it allows straightforward recording and looping. 
  - 

  

- 

- **Visual Feedback**: The **Record** LED turns red while recording is active.

- 

- 

- **Functionality**: Recording is active only while the **Record** button is held down.  Releasing the button stops recording and starts looping.

- 

- User Experience

  :

  - 
  - This mode is useful for capturing short audio fragments or precise timing. 
  - 
  - Users lose the ability to reset a loop via a long press of the **Record** button. 
  - 
  - A short press while playing nothing creates a short loop with no contents. 
  - 

  

- 

- **Visual Feedback**: The **Record** LED remains red while the button is held down.

- 

- 

- **Functionality**: After recording, the feedback is automatically set to 100%, ensuring the loop is preserved without fading out. 

- 

- User Experience

  :

  - 
  - This mode is ideal for users who frequently adjust feedback but want to ensure new loops are not accidentally erased. 
  - 
  - Users cannot start a loop with reduced feedback in this mode.
  - 

  

- 

- **Visual Feedback**: The **Record** LED behaves as in Toggle mode, but feedback settings are overridden.

- 

#### **2. Reset**

- 

- **Functionality**: A long press of the **Record** button erases the current loop, putting the Echoplex into the **Reset** state. 

- 

- User Experience

  :

  - 
  - The loop is cleared, and the LoopTime Display shows a blank screen. 
  - 
  - Users can immediately start recording a new loop. 
  - 

  

- 

- **Visual Feedback**: The **Record** LED turns off, and the LoopTime Display is blank.

- 

#### **3. Alternate Endings** 

The **Record** button can also be used to end recording with alternate functions, depending on which button is pressed during recording.  These alternate endings allow users to seamlessly transition into other modes or functions:

- 

- **Functionality**: Cancels the recording and restores the previous loop. 

- 

- User Experience

  :

  - 
  - Useful for recovering a loop if the **Record** button was pressed accidentally. 
  - 
  - If memory is insufficient, Undo may not be possible. 
  - 

  

- 

- **Visual Feedback**: The **Undo** LED turns green if Undo is available. 

- 

- 

- **Functionality**: Ends recording and immediately enters **Insert** mode, allowing users to add cycles to the loop. 

- 

- User Experience

  :

  - 
  - Ideal for dividing a longer loop into multiple cycles during recording. 
  - 
  - The behavior depends on the **InsertMode** parameter (e.g., Insert, Replace, Rehearse, Reverse). 
  - 

  

- 

- **Visual Feedback**: The **Insert** LED turns red, and the LoopTime Display shows the cycle count.

- 

- 

- **Functionality**: Ends recording and mutes the loop playback. 

- 

- User Experience

  :

  - 
  - Useful for silencing the loop immediately after recording. 
  - 
  - Users can unmute the loop later using the **Mute** button. 
  - 

  

- 

- **Visual Feedback**: The **Mute** LED turns red. 

- 

- 

- **Functionality**: Ends recording and toggles **Overdub** mode, allowing users to layer new sounds over the loop. 

- 

- User Experience

  :

  - 
  - The loop begins playback, and users can immediately add new audio layers. 
  - 
  - If **Overdub** was already active, it will be turned off. 
  - 

  

- 

- **Visual Feedback**: The **Overdub** LED turns red. 

- 

- 

- **Functionality**: Ends recording and switches to the next loop (if multiple loops are set up). 

- 

- User Experience

  :

  - 
  - If **AutoRecord** is enabled, recording continues in the new loop. 
  - 
  - Useful for recording multiple loops in sequence (e.g., verse and chorus loops). 
  - 

  

- 

- **Visual Feedback**: The **NextLoop** LED turns red, and the Loop Display updates to show the new loop number. 

- 

#### **4. Synchronized Recording** 

- 

- **Functionality**: When a sync signal is received (e.g., MIDI Clock, BeatSync, or BrotherSync), recording aligns with the external device’s tempo. 

- 

- User Experience

  :

  - 
  - Users can record loops that are perfectly synchronized with external devices. 
  - 
  - The LoopTime Display shows the cycle time defined by the sync signal. 
  - 

  

- 

- **Visual Feedback**: The **Overdub** LED turns yellow during sync, and the LoopTime Display shows "ooo" while waiting for the sync point.

- 

#### **5. Threshold Recording** 

- 

- **Functionality**: If the **Threshold** parameter is set to a non-zero value, recording begins only when an audio signal exceeds the threshold. 

- 

- User Experience

  :

  - 
  - Useful for hands-free recording or capturing audio only when a sound is played.
  - 
  - The LoopTime Display shows "ooo" while waiting for the threshold to be met.
  - 

  

- 

- **Visual Feedback**: The **Record** LED turns red once recording starts.

- 

### **Summary of User Interaction**

- 
- **Visual Indicators**: The LEDs and LoopTime Display provide real-time feedback on the status of the **Record** function and its associated modes.
- 
- **Flexibility**: The **Record** button offers multiple ways to start, stop, and manage loops, making it adaptable to various musical styles and workflows. 
- 
- **Integration**: The **Record** function seamlessly integrates with other buttons and parameters, allowing users to transition between modes and functions effortlessly. 
- 

Let me know if you'd like me to continue with other buttons or settings!







thats perfect, nad step two will go be going thru each step of the Record > Praeter- so record/moreloops record/channel record;/recordMode and record/looopdelay

### **Step 2: Detailed Explanation of Record Button with Linked Parameters**

The **Record** button interacts with several parameters in the Echoplex Digital Pro Plus, allowing users to customize its behavior and functionality. Below is a detailed breakdown of how the **Record** button works with the following linked parameters: **MoreLoops**, **Channel**, **RecordMode**, and **Loop/Delay**.

### **1. Record > MoreLoops**

The **MoreLoops** parameter divides the Echoplex’s memory into multiple loops, enabling users to record and manage up to 16 separate loops. 

#### **Functionality**

- 
- **MoreLoops** determines how many loops are available for recording. 
- 
- The memory is divided evenly among the loops.  For example, if 198 seconds of memory are installed, setting **MoreLoops=4** provides 4 loops of 49.5 seconds each. 
- 
- Changing the **MoreLoops** parameter resets all existing loops, as memory must be reconfigured. 
- 

#### **User Interaction**

- 
- **Recording**: When multiple loops are set up, pressing **NextLoop** after recording switches to the next loop.  If **AutoRecord** is enabled, recording starts automatically in the new loop. 
- 
- **Loop Management**: Users can switch between loops using the **NextLoop** button or MIDI commands.  The Loop Display shows the current loop number (e.g., 1, 2, A, b, etc. ).
- 
- **GeneralReset**: Users can reset all loops simultaneously by first resetting the current loop (long press of **Record**) and then holding **Multiply**. 
- 

#### **Visual Feedback**

- 
- The Loop Display shows the current loop number. 
- 
- The **NextLoop** LED turns red when switching loops.
- 

#### **Example Use Case**

- 

- **Scenario**: A musician wants to record a verse in Loop 1 and a chorus in Loop 2. 

- 

- Steps

  :

  1. 
  2. Set **MoreLoops=2**.
  3. 
  4. Record the verse in Loop 1. 
  5. 
  6. Press **NextLoop** to switch to Loop 2.
  7. 
  8. Record the chorus in Loop 2.
  9. 

  

- 

### 

### **Comprehensive Explanation of the Front Panel: Starting with OVERDUB**

The **Overdub** button is one of the most powerful tools on the Echoplex Digital Pro Plus, allowing users to layer new sounds over an existing loop. It is central to creating complex, evolving loops and is designed to be intuitive while offering advanced functionality for creative expression.  Below is a detailed explanation of the **Overdub** button and its associated features. 

### **OVERDUB Button**

The **Overdub** button enables users to add layers of sound to an existing loop.  It works seamlessly with other functions, allowing users to build loops dynamically and interactively.  The button has multiple functionalities depending on the mode and settings. 

#### **1. Basic Overdubbing** 

- 

- **Functionality**: Press the **Overdub** button to start overdubbing.  The existing loop plays back while new audio is added to it.  Press the button again to stop overdubbing. 

- 

- User Experience

  :

  - 
  - The loop continues playing while users add new material. 
  - 
  - Each pass of the loop mixes the new audio with the existing loop, creating a layered effect. 
  - 
  - Overdubbing does not change the length of the loop or cycle. 
  - 

  

- 

- **Visual Feedback**: The **Overdub** LED turns red while overdubbing is active. 

- 

#### **2. Alternate Endings** 

The **Overdub** button can be used in combination with other buttons to execute alternate endings during overdubbing.  These allow users to transition into other modes or functions seamlessly:

- 

- **Functionality**: Ends overdubbing and starts recording a new loop. 

- 

- User Experience

  :

  - 
  - Useful for replacing the current loop with new material. 
  - 
  - The loop length is redefined based on the new recording. 
  - 

  

- 

- **Visual Feedback**: The **Record** LED turns red.

- 

- 

- **Functionality**: Ends overdubbing and starts multiplying the loop. 

- 

- User Experience

  :

  - 
  - Allows users to extend the loop length while adding new material. 
  - 
  - The loop length becomes an integer multiple of the original cycle length. 
  - 

  

- 

- **Visual Feedback**: The **Multiply** LED turns red.

- 

- 

- **Functionality**: Ends overdubbing and starts inserting cycles into the loop. 

- 

- User Experience

  :

  - 
  - Useful for dividing the loop into multiple cycles while overdubbing. 
  - 
  - The behavior depends on the **InsertMode** parameter (e.g., Insert, Replace, Reverse). 
  - 

  

- 

- **Visual Feedback**: The **Insert** LED turns red. 

- 

- 

- **Functionality**: Ends overdubbing and mutes the loop playback.

- 

- User Experience

  :

  - 
  - Useful for silencing the loop immediately after overdubbing.
  - 
  - Users can unmute the loop later using the **Mute** button. 
  - 

  

- 

- **Visual Feedback**: The **Mute** LED turns red. 

- 

- 

- **Functionality**: Cancels the overdub and restores the loop to its previous state. 

- 

- User Experience

  :

  - 
  - Useful for erasing the last overdub pass or recovering from mistakes. 
  - 
  - If memory is insufficient, Undo may not be possible. 
  - 

  

- 

- **Visual Feedback**: The **Undo** LED turns green if Undo is available. 

- 

#### **3. The Long Press**

- 

- **Functionality**: Pressing holding the **Overdub** button for longer than half a second starts overdubbing. Releasing the button stops overdubbing. 

- 

- User Experience

  :

  - 
  - This is similar to **OverdubMode=Sustain**, but works regardless of the mode setting.
  - 
  - Useful for capturing short audio fragments or precise timing. 
  - 

  

- 

- **Visual Feedback**: The **Overdub** LED remains red while the button is held down.

- 

#### **4. OverdubMode**

The behavior of the **Overdub** button is influenced by the **OverdubMode** parameter, which has two options:

- 

- **Functionality**: Press once to start overdubbing, press again to stop. 

- 

- User Experience

  :

  - 
  - Ideal for extended overdubbing sessions. 
  - 
  - Users can leave overdubbing on while playing multiple passes of the loop. 
  - 

  

- 

- **Visual Feedback**: The **Overdub** LED toggles between red (active) and off (inactive). 

- 

- 

- **Functionality**: Overdubbing is active only while the button is held down.  Releasing the button stops overdubbing. 

- 

- User Experience

  :

  - 
  - Useful for capturing short audio fragments or precise timing. 
  - 
  - Prevents accidental extended overdubbing. 
  - 

  

- 

- **Visual Feedback**: The **Overdub** LED remains red while the button is held down.

- 

#### **5. Quantized Overdubbing** 

The **Quantize** parameter affects the timing of overdubbing, ensuring that overdub operations align with rhythmic points in the loop. 

- 

- **Functionality**: Overdubbing starts and stops immediately when the button is pressed. 

- 

- User Experience

  :

  - 
  - Provides maximum flexibility for freeform looping.
  - 
  - Ideal for non-rhythmic or textural loops. 
  - 

  

- 

- 

- **Functionality**: Overdubbing starts and stops at the end of the current cycle.

- 

- User Experience

  :

  - 
  - Ensures overdubs align with the cycle length. 
  - 
  - Useful for maintaining rhythmic precision. 
  - 

  

- 

- 

- **Functionality**: Overdubbing starts and stops at the end of the current loop. 

- 

- User Experience

  :

  - 
  - Ensures overdubs align with the overall loop length. 
  - 
  - Useful for loops with multiple cycles. 
  - 

  

- 

- 

- **Functionality**: Overdubbing starts and stops at the next sub-cycle point (e.g., 8th notes).

- 

- User Experience

  :

  - 
  - Provides near-instantaneous overdubbing while maintaining rhythmic precision.
  - 
  - Ideal for creating intricate rhythmic patterns. 
  - 

  

- 

#### **6. Undoing Overdubs** 

- 

- **Functionality**: The **Undo** button can erase the last overdub pass or multiple passes, depending on memory availability. 

- 

- User Experience

  :

  - 
  - A long press of **Undo** erases the entire last layer of sound added. 
  - 
  - A short press removes only the tail end of the last layer, starting from the point of the button press. 
  - 

  

- 

- **Visual Feedback**: The **Undo** LED turns green if Undo is available. 

- 

#### **7. Feedback During Overdubbing** 

- 

- **Functionality**: While overdubbing, the feedback level is automatically scaled back to about 95% to prevent overloading the loop. 

- 

- User Experience

  :

  - 
  - Users can adjust feedback to control how quickly older layers fade out. 
  - 
  - Feedback changes are displayed briefly on the LoopTime Display. 
  - 

  

- 

#### **8. Advanced Techniques** 

- 

- **Simultaneous Functions**: Users can hold the **Overdub** button and press other buttons (e.g., Reverse) to execute simultaneous functions. 

- 

- **Granular Overdubbing**: Combine **OverdubMode=Sustain** with **Quant

- ### **Detailed Walkthrough of Overdub Parameter Settings and Functions**

  This section provides a step-by-step explanation of how the **Overdub** button interacts with the following parameters: **Overdub**, **AutoRecord**, **ControlSource**, **OverdubMode**, and **Quantize**. Each parameter enhances the functionality of **Overdub**, allowing users to customize their looping experience.

  ### **1. Overdub**

  The **Overdub** button is the core function for layering sounds over an existing loop. 

  #### **Functionality**

  - 
  - Press **Overdub** to start layering new audio over the current loop. 
  - 
  - Press again to stop overdubbing. 
  - 
  - Overdubbing does not change the loop length or cycle. 
  - 

  #### **Key Features**

  - 
  - **Layering**: Adds new material to the loop while preserving the existing audio. 
  - 
  - **Feedback Control**: Feedback is automatically scaled to prevent overloading the loop during overdubbing. 
  - 
  - **Undo**: Erase the last overdub pass or multiple passes using the **Undo** button. 
  - 

  #### **Example Use Case**

  - 

  - **Scenario**: A musician wants to add a melody over a rhythm loop. 

  - 

  - Steps

    :

    1. 
    2. Record a rhythm loop. 
    3. 
    4. Press **Overdub** and play the melody. 
    5. 
    6. Press **Overdub** again to stop layering. 
    7. 

    

  - 

  ### **2. AutoRecord**

  The **AutoRecord** parameter determines whether recording starts automatically when entering an empty loop. 

  #### **Parameter Settings**

  - 
  - **Off**: Recording does not start automatically. 
  - 
  - **On**: Recording starts immediately upon entering an empty loop. 
  - 

  #### **Interaction with Overdub** 

  - 
  - When **AutoRecord=On**, users can seamlessly transition into overdubbing after recording the first loop. 
  - 
  - **Overdub** can be used to layer sounds immediately after the initial recording. 
  - 

  #### **Example Use Case**

  - 

  - **Scenario**: A musician wants to record multiple loops without manually starting recording each time. 

  - 

  - Steps

    :

    1. 
    2. Set **AutoRecord=On**.
    3. 
    4. Enter an empty loop (e.g., Loop 1) and record the first layer. 
    5. 
    6. Press **NextLoop** to move to Loop 2, where recording starts automatically. 
    7. 
    8. Use **Overdub** to add layers to each loop. 
    9. 

    

  - 

  ### **3. ControlSource**

  The **ControlSource** parameter configures how MIDI commands control the Echoplex’s operations, including **Overdub**.

  #### **Parameter Settings**

  - 
  - **Notes**: MIDI NoteOn and NoteOff messages control functions. 
  - 
  - **Controllers**: MIDI Continuous Controller messages control functions. 
  - 
  - **Off**: MIDI control is disabled.
  - 

  #### **Interaction with Overdub** 

  - 
  - MIDI commands can start and stop **Overdub** operations remotely.
  - 
  - **Overdub** can be toggled or sustained using MIDI NoteOn/NoteOff or Continuous Controller messages.
  - 

  #### **Example Use Case**

  - 

  - **Scenario**: A user wants to control **Overdub** via a MIDI foot controller. 

  - 

  - Steps

    :

    1. 
    2. Set **ControlSource=Notes**. 
    3. 
    4. Program the foot controller to send NoteOn and NoteOff messages for **Overdub**. 
    5. 
    6. Use the foot controller to toggle or sustain **Overdub**. 
    7. 

    

  - 

  ### **4. OverdubMode**

  The **OverdubMode** parameter defines how the **Overdub** button behaves. 

  #### **Parameter Settings**

  - 
  - **Toggle (Default)**: Press once to start overdubbing, press again to stop. 
  - 
  - **Sustain**: Overdubbing is active only while the button is held down. 
  - 

  #### **Interaction with Overdub** 

  - 
  - **Toggle**: Ideal for extended overdubbing sessions where users want to layer multiple passes.
  - 
  - **Sustain**: Useful for capturing short audio fragments or precise timing. 
  - 

  #### **Example Use Case**

  - 

  - **Scenario**: A musician wants to capture short sound snippets for layering. 

  - 

  - Steps

    :

    1. 
    2. Set **OverdubMode=Sustain**. 
    3. 
    4. Hold down the **Overdub** button to record a snippet. 
    5. 
    6. Release the button to stop overdubbing. 
    7. 

    

  - 

  ### **5. Quantize**

  The **Quantize** parameter ensures that overdub operations align with rhythmic points in the loop. 

  #### **Parameter Settings**

  - 
  - **Off**: Overdubbing starts and stops immediately when the button is pressed. 
  - 
  - **Cycle**: Overdubbing starts and stops at the end of the current cycle.
  - 
  - **Loop**: Overdubbing starts and stops at the end of the current loop.
  - 
  - **8th**: Overdubbing starts and stops at the next sub-cycle point (e.g., 8th notes). 
  - 

  #### **Interaction with Overdub** 

  - 
  - **Quantize=Off**: Provides maximum flexibility for freeform looping. 
  - 
  - **Quantize=Cycle**: Ensures overdubs align with the cycle length.
  - 
  - **Quantize=Loop**: Ensures overdubs align with the overall loop length.
  - 
  - **Quantize=8th**: Allows near-instantaneous overdubbing while maintaining rhythmic precision.
  - 

  #### **Example Use Case**

  - 

  - **Scenario**: A musician wants to overdub rhythmic patterns that align with 8th notes. 

  - 

  - Steps

    :

    1. 
    2. Set **Quantize=8th**. 
    3. 
    4. Press **Overdub** to start layering sounds. 
    5. 
    6. Press **Overdub** again to stop at the next 8th note.
    7. 

    

  - 

  ### **Summary**

  The **Overdub** button, combined with parameters like **AutoRecord**, **ControlSource**, **OverdubMode**, and **Quantize**, provides a highly customizable looping experience. Users can layer sounds dynamically, control operations via MIDI, and ensure precise rhythmic alignment. These features make **Overdub** an essential tool for creating complex, evolving loops. 

  Let me know if you'd like to continue with other buttons or parameters!

  ### **Comprehensive Explanation of Multiply**

  The **Multiply** function is one of the most versatile and powerful features of the Echoplex Digital Pro Plus.  It allows users to extend the length of a loop by layering longer passages over shorter cycles, creating loops that are integer multiples of the original cycle length.  This feature is essential for building complex musical structures, such as layering melodies over rhythm patterns or creating dynamic transitions in live performances.

  ### **Multiply Button**

  The **Multiply** button enables users to expand the loop length while adding new material.  It works seamlessly with other functions, allowing users to dynamically adjust the loop structure during performance. 

  #### **1. Basic Multiply Operation**

  - 

  - **Functionality**: Press the **Multiply** button to start multiplying the loop.  Press it again to stop multiplying. 

  - 

  - Behavior

    :

    - 
    - The original cycle is repeated multiple times while new audio is added. 
    - 
    - The resulting loop length is an integer multiple of the original cycle length. 
    - 

    

  - 

  - **Visual Feedback**: The **Multiply** LED turns red while multiplying is active.

  - 

  #### **2. Unquantized Multiplication**

  - 

  - **Functionality**: When **Quantize=Off**, multiplying starts immediately when the button is pressed and ends at the next cycle point.

  - 

  - Behavior

    :

    - 
    - The timing of the second press determines the number of cycles added. 
    - 
    - The loop length is rounded to the nearest cycle point. 
    - 

    

  - 

  - Key Parameter

    : 

    RoundMode

     

    

    - 
    - **RoundMode=Round**: The timing of the second press is not critical; the entire cycle is recorded. 
    - 
    - **RoundMode=Off**: The overdubbing stops immediately, but the loop length is still rounded to the nearest cycle. 
    - 

    

  - 

  #### **3. Quantized Multiplication** 

  - 

  - **Functionality**: When **Quantize=On**, multiplying starts at the beginning of the next cycle and ends at the end of the current cycle. 

  - 

  - Behavior

    :

    - 
    - Ensures precise alignment with the cycle length. 
    - 
    - Useful for maintaining rhythmic precision in loops. 
    - 

    

  - 

  - Key Parameter

    : 

    Quantize

     

    

    - 
    - **Quantize=Cycle**: Multiplication aligns with the cycle length. 
    - 
    - **Quantize=Loop**: Multiplication aligns with the overall loop length. 
    - 

    

  - 

  #### **4. Alternate Endings** 

  The **Multiply** button can be used in combination with other buttons to execute alternate endings during multiplication.  These allow users to transition into other modes or functions seamlessly:

  - 

  - **Functionality**: Ends multiplication and starts recording a new loop.

  - 

  - Behavior

    :

    - 
    - The loop length is redefined based on the new recording. 
    - 
    - Useful for replacing the current loop with new material. 
    - 

    

  - 

  - 

  - **Functionality**: Ends multiplication and toggles overdubbing. 

  - 

  - Behavior

    :

    - 
    - Allows users to immediately start layering sounds over the multiplied loop. 
    - 
    - If overdubbing was active before multiplication, this action turns it off. 
    - 

    

  - 

  - 

  - **Functionality**: Ends multiplication and starts inserting cycles into the loop.

  - 

  - Behavior

    :

    - 
    - Useful for dividing the loop into multiple cycles while multiplying. 
    - 
    - The behavior depends on the **InsertMode** parameter (e.g., Insert, Replace, Reverse). 
    - 

    

  - 

  - 

  - **Functionality**: Ends multiplication and mutes the loop playback. 

  - 

  - Behavior

    :

    - 
    - Useful for silencing the loop immediately after multiplication. 
    - 
    - Users can unmute the loop later using the **Mute** button. 
    - 

    

  - 

  - 

  - **Functionality**: Cancels the multiplication and restores the loop to its previous state. 

  - 

  - Behavior

    :

    - 
    - Useful for recovering from mistakes or reverting to the original loop. 
    - 
    - If memory is insufficient, Undo may not be possible. 
    - 

    

  - 

  #### **5. Overflow Handling** 

  - 

  - **Functionality**: If the loop exceeds the memory capacity during multiplication, the operation is canceled, and the loop is reset. 

  - 

  - Key Parameter

    : 

    Overflow

     

    

    - 
    - **Overflow=Stop**: Multiplication stops immediately when memory is exceeded. 
    - 
    - **Overflow=Play**: The loop length is set to the maximum available memory. 
    - 

    

  - 

  #### **6. MultiIncrease**

  The **MultiIncrease** feature allows users to predetermine the final cycle count of a multiplication. 

  - 

  - **Functionality**: After starting multiplication, users can tap the **Multiply** button multiple times to set the desired number of cycles. 

  - 

  - Behavior

    :

    - 
    - Each tap increases the cycle count. 
    - 
    - The loop automatically stops multiplying after the specified number of cycles. 
    - 

    

  - 

  - Example

    :

    - 
    - Tap **Multiply** 4 times to create a loop with 4 cycles.
    - 

    

  - 

  #### **7. Unrounded Multiply**

  - 

  - **Functionality**: Ends multiplication immediately without rounding to the nearest cycle point. 

  - 

  - Behavior

    :

    - 
    - The loop length is redefined based on the exact timing of the button press.
    - 
    - Useful for creating loops with irregular lengths or changing tempos. 
    - 

    

  - 

  #### **8. Changing the Number of Cycles in an Existing Loop** 

  Users can modify the number of cycles in a loop by initiating a new multiplication. 

  - 

  - **Scenario**: A user wants to reduce a 4-cycle loop to 2 cycles.

  - 

  - Steps

    :

    1. 
    2. Press **Multiply** at the start of the loop. 
    3. 
    4. Press **Multiply** again after 2 cycles. 
    5. 

    

  - 

  - 

  - **Scenario**: A user wants to increase a 2-cycle loop to 3 cycles. 

  - 

  - Steps

    :

    1. 
    2. Press **Multiply** at the start of the loop. 
    3. 
    4. Press **Multiply** again after 3 cycles.
    5. 

    

  - 

  #### **9. The Long Press** 

  - 

  - **Functionality**: Pressing and holding the **Multiply** button has the same effect as a pair of press-and-releases. 

  - 

  - Behavior

    :

    - 
    - Starts and ends multiplication with a single long press.
    - 
    - Useful for quick transitions during live performance. 
    - 

    

  - 

  #### **10. Resetting All Loops** 

  The **Multiply** button can be used to reset all loops when multiple loops are set up. 

  1. 
  2. Reset the current loop by holding the **Record** button. 
  3. 
  4. Hold the **Multiply** button to reset all loops. 
  5. 

  ### **Advanced Techniques** 

  - 
  - **Granular Multiplication**: Combine **Quantize=8th** with **Unrounded Multiply** to create intricate rhythmic patterns. 
  - 
  - **Simultaneous Functions**: Use **Multiply** with other buttons (e.g., Reverse) to execute simultaneous functions.
  - 

  ### **Summary**

  The **Multiply** button is a powerful tool for dynamically adjusting loop length and structure. With features like **MultiIncrease**, **Unrounded Multiply**, and alternate endings, users can create complex, evolving loops tailored to their musical needs. Whether extending a rhythm pattern or layering melodies, **Multiply** is essential for creative looping. 

  Let me know if you'd like to explore other functions or parameters!

  ### **Parameter Functions and Features Related to Multiply**

  The **Multiply** function interacts with several parameters that enhance its capabilities, allowing users to customize how loops are extended, copied, and synchronized. Below is a detailed explanation of the relevant parameters: **LoopCopy**, **Source#**, **RoundMode**, and **8ths/Cycle**.

  ### **1. LoopCopy**

  The **LoopCopy** parameter determines how the current loop is copied into the next loop when switching loops. 

  #### **Parameter Settings**

  - 
  - **Off**: No copying occurs when switching to a reset loop. 
  - 
  - **Sound (Snd)**: Copies the audio content of the current loop into the next loop. 
  - 
  - **Timing (ti)**: Copies the timing (cycle length) of the current loop into the next loop. 
  - 

  #### **Interaction with Multiply** 

  - 
  - **Sound Copy**: Works like a Multiply operation into the new loop.  The audio from the current loop is copied into multiple cycles in the new loop, and new material can be overdubbed on top. 
  - 
  - **Timing Copy**: Works like an Insert operation into the new loop. The timing of the current loop is copied, and new material can be added. 
  - 

  #### **Example Use Case**

  - 

  - **Scenario**: A user wants to create variations of a loop in a new loop. 

  - 

  - Steps

    :

    1. 
    2. Set **LoopCopy=Sound**. 
    3. 
    4. Press **NextLoop** to move to a reset loop.
    5. 
    6. The audio from the current loop is copied into the new loop. 
    7. 
    8. Use **Multiply** to add layers to the copied loop. 
    9. 

    

  - 

  ### **2. Source#**

  The **Source#** parameter defines the starting MIDI note or controller number for controlling Echoplex operations, including **Multiply**.

  #### **Parameter Settings**

  - 
  - **Values**: 0–99 (default: 36) 
  - 

  #### **Interaction with Multiply** 

  - 
  - **MIDI Control**: The **Multiply** function can be triggered via MIDI NoteOn or Continuous Controller messages. 
  - 
  - **Offset**: The MIDI note or controller number for **Multiply** is determined by adding the **Source#** value to the offset for **Multiply** (offset = 4).
  - 

  #### **Example Use Case**

  - 

  - **Scenario**: A user wants to control **Multiply** via a MIDI keyboard. 

  - 

  - Steps

    :

    1. 
    2. Set **Source#=36**. 
    3. 
    4. Program the MIDI keyboard to send NoteOn messages for MIDI note 40 (Source# + 4).
    5. 
    6. Use the keyboard to start and stop **Multiply**.
    7. 

    

  - 

  ### **3. RoundMode**

  The **RoundMode** parameter determines whether new material played after the second press of the **Multiply** button is recorded. 

  #### **Parameter Settings**

  - 
  - **Off (OFF)**: New material played after the second press is not recorded. 
  - 
  - **Round (rnd)**: New material played after the second press is recorded until the end of the current cycle. 
  - 

  #### **Interaction with Multiply** 

  - 
  - **RoundMode=Round**: Ensures that the loop length is rounded to the nearest cycle, capturing all audio played during the cycle. 
  - 
  - **RoundMode=Off**: Stops recording immediately after the second press, but still rounds the loop length to the nearest cycle. 
  - 

  #### **Example Use Case**

  - 

  - **Scenario**: A user wants to ensure smooth transitions between cycles during multiplication.

  - 

  - Steps

    :

    1. 
    2. Set **RoundMode=Round**.
    3. 
    4. Press **Multiply** to start multiplying. 
    5. 
    6. Press **Multiply** again to stop, ensuring all audio played during the cycle is captured. 
    7. 

    

  - 

  ### **4. 8ths/Cycle** 

  The **8ths/Cycle** parameter defines the number of rhythmic subdivisions (e.g., 8th notes) in each cycle. 

  #### **Parameter Settings**

  - 
  - **Values**: 1–96, 128, 256 (default: 8) 
  - 

  #### **Interaction with Multiply** 

  - 
  - **Quantized Multiply**: When **Quantize=8th**, the **Multiply** function aligns with the rhythmic subdivisions defined by **8ths/Cycle**. 
  - 
  - **LoopDividing**: Allows users to divide the loop into smaller rhythmic units for precise control during multiplication. 
  - 

  #### **Example Use Case**

  - 

  - **Scenario**: A user wants to create rhythmic patterns aligned with 8th notes. 

  - 

  - Steps

    :

    1. 
    2. Set **8ths/Cycle=8**. 
    3. 
    4. Set **Quantize=8th**. 
    5. 
    6. Press **Multiply** to start layering sounds aligned with 8th notes.
    7. 

    

  - 

  ### **Summary**

  The parameters **LoopCopy**, **Source#**, **RoundMode**, and **8ths/Cycle** provide advanced control over the **Multiply** function, enabling users to copy loops, control operations via MIDI, manage rounding behavior, and align loops with rhythmic subdivisions. These features make **Multiply** a highly customizable tool for creating complex, synchronized loops. 

  Let me know if you'd like to explore additional parameters or functions!

  ### **Comprehensive Guide to Ins/Rev (Insert/Reverse)**

  The **Ins/Rev** button on the Echoplex Digital Pro Plus is a multi-functional control that can perform **Insert** operations or **Reverse** playback, depending on the configuration of the **InsertMode** parameter. This button is highly versatile, allowing users to manipulate loops in real-time by adding cycles, reversing playback, or replacing sections of the loop. 

  ### **InsertMode Parameter** 

  The behavior of the **Ins/Rev** button is determined by the **InsertMode** parameter.  This parameter redefines the function of the button, enabling different operations such as **Insert**, **Reverse**, **Replace**, **Substitute**, **HalfSpeed**, **Rehearse**, or **Sustain**. 

  #### **InsertMode Values** 

  - 
  - **Insert (InS)**: Adds cycles to the loop. 
  - 
  - **Reverse (rEV)**: Reverses the playback direction of the loop. 
  - 
  - **Replace (rPL)**: Replaces sections of the loop with new material. 
  - 
  - **Substitute (Sub)**: Replaces sections while keeping the original loop playing as a guide. 
  - 
  - **HalfSpeed (h.SP)**: Plays the loop at half speed (one octave lower). 
  - 
  - **Rehearse (rhr)**: Allows users to practice a part before committing it to the loop. 
  - 
  - **Sustain (SUS)**: Turns the button into a real-time granular loop tool. 
  - 

  ### **1. Insert (InS)** 

  The **Insert** function allows users to add cycles to the loop, extending its length while recording new material. 

  #### **Basic Operation**

  - 
  - **Start Insert**: Press the **Ins/Rev** button.
  - 
  - **End Insert**: Press the **Ins/Rev** button again. 
  - 
  - **Result**: The loop length is extended by an integer number of cycles. 
  - 

  #### **Quantized Insert** 

  - 
  - **Behavior**: When **Quantize=On**, the insertion starts at the next cycle point and ends at the end of the current cycle. 
  - 
  - **Use Case**: Ensures precise alignment with the loop's rhythm. 
  - 

  #### **Alternate Endings** 

  - 
  - **Undo**: Cancels the insertion and restores the loop to its previous state. 
  - 
  - **Record**: Ends the insertion immediately and redefines the loop length. 
  - 
  - **Overdub**: Ends the insertion and toggles overdubbing. 
  - 
  - **Multiply**: Ends the insertion and starts multiplying. 
  - 
  - **Mute**: Ends the insertion and mutes the loop playback. 
  - 

  #### **Long Press** 

  - 
  - **Replace**: Holding down the **Ins/Rev** button replaces sections of the loop with new material.
  - 

  ### **2. Reverse (rEV)**

  The **Reverse** function flips the playback direction of the loop, allowing users to create unique effects and textures. 

  #### **Basic Operation** 

  - 
  - **Start Reverse**: Press the **Ins/Rev** button (when **InsertMode=Reverse**). 
  - 
  - **End Reverse**: Press the **Ins/Rev** button again to return to forward playback.
  - 

  #### **Behavior**

  - 
  - **Overdub**: Overdubbing while the loop is reversed creates layers with mixed playback directions (e.g., forward and backward). 
  - 
  - **Quantize**: When **Quantize=On**, the reverse playback starts at the next cycle point.
  - 

  #### **Use Case**

  - 
  - **Creative Effects**: Ideal for creating backward guitar solos, rhythmic reversals, or secret messages. 
  - 
  - **Live Performance**: Allows users to toggle between forward and reverse playback seamlessly.
  - 

  ### **3. Replace (rPL)**

  The **Replace** function overwrites sections of the loop with new material. 

  #### **Basic Operation** 

  - 
  - **Start Replace**: Hold down the **Ins/Rev** button (when **InsertMode=Replace**). 
  - 
  - **End Replace**: Release the button. 
  - 

  #### **Behavior**

  - 
  - **Quantized Replace**: When **Quantize=On**, the replacement starts at the next cycle point and ends at the next cycle point after the button is released. 
  - 

  #### **Use Case**

  - 
  - **Live Editing**: Replace sections of the loop to create dynamic changes during performance. 
  - 

  ### **4. Substitute (Sub)** 

  The **Substitute** function replaces sections of the loop while keeping the original loop playing as a guide. 

  #### **Basic Operation**

  - 
  - **Start Substitute**: Press the **Ins/Rev** button (when **InsertMode=Substitute**). 
  - 
  - **End Substitute**: Release the button. 
  - 

  #### **Behavior**

  - 
  - **Quantized Substitute**: When **Quantize=On**, the substitution starts and ends at precise rhythmic points. 
  - 

  #### **Use Case**

  - 
  - **Groove Maintenance**: Keeps the rhythm intact while replacing sections of the loop. 
  - 

  ### **5. HalfSpeed (h.SP)** 

  The **HalfSpeed** function plays the loop at half the normal speed, lowering the pitch by one octave. 

  #### **Basic Operation**

  - 
  - **Start HalfSpeed**: Press the **Ins/Rev** button (when **InsertMode=HalfSpeed**). 
  - 
  - **End HalfSpeed**: Press the button again to return to full speed.
  - 

  #### **Behavior**

  - 
  - **Overdub**: Overdubbing while in HalfSpeed creates layers with pitch and speed variations. 
  - 

  #### **Use Case**

  - 
  - **Pitch Effects**: Useful for creating bass-like textures or slowing down loops for dramatic effect.
  - 

  ### **6. Rehearse (rhr)**

  The **Rehearse** function allows users to practice a part before committing it to the loop. 

  #### **Basic Operation**

  - 
  - **Start Rehearse**: Press the **Ins/Rev** button (when **InsertMode=Rehearse**) at the end of a recording. 
  - 
  - **End Rehearse**: Press the button again to commit the material to the loop.
  - 

  #### **Behavior**

  - 
  - **Playback**: The recorded cycle plays back once, allowing users to rehearse over it. 
  - 

  #### **Use Case**

  - 
  - **Practice**: Ideal for rehearsing ideas before finalizing them in the loop. 
  - 

  ### **7. Sustain (SUS)** 

  The **Sustain** function turns the **Ins/Rev** button into a real-time granular loop tool.

  #### **Basic Operation**

  - 
  - **Start SUS**: Press and hold the **Ins/Rev** button (when **InsertMode=Sustain**). 
  - 
  - **End SUS**: Release the button. 
  - 

  #### **Behavior**

  - 
  - **Unrounded Insert**: The loop length is redefined immediately when the button is released. 
  - 

  #### **Use Case**

  - 
  - **Granular Effects**: Allows users to splice together fragments of sound in real-time. 
  - 

  ### **Advanced Techniques** 

  - 
  - **Combining Functions**: Use **Ins/Rev** with other buttons (e.g., Multiply, Overdub) to create complex loop manipulations.
  - 
  - **Quantized Operations**: Combine **Quantize=8th** with **InsertMode=Insert** or **Reverse** for precise rhythmic control. 
  - 

  ### **Summary**

  The **Ins/Rev** button is a powerful tool for real-time loop manipulation, offering a wide range of functions through the **InsertMode** parameter.  Whether adding cycles, reversing playback, replacing sections, or creating granular effects, this button provides unparalleled flexibility for live performance and creative looping.

  Let me know if

  ### **Parameter Settings and Functions for Ins/Rev: SwitchQuant, VolumeCont, InsertMode, and Sync** 

  The **Ins/Rev** button interacts with several parameters that define its behavior and expand its functionality.  Below is a detailed explanation of how **SwitchQuant**, **VolumeCont**, **InsertMode**, and **Sync** influence the **Ins/Rev** button.

  ### **1. SwitchQuant**

  The **SwitchQuant** parameter determines how loop switching is quantized when using the **NextLoop** button or MIDI commands.  It indirectly affects **Ins/Rev** when switching loops and performing functions like **Insert** or **Reverse** in the new loop. 

  #### **Parameter Settings**

  - 
  - **Off (OFF)**: Loop switching happens immediately. 
  - 
  - **Confirm (CnF)**: Loop switching waits for a confirming action (e.g., Undo, Record, Multiply, etc. ).
  - 
  - **Cycle (CYC)**: Loop switching occurs at the end of the current cycle. 
  - 
  - **ConfirmCycle (CCY)**: Combines **Confirm** and **Cycle**—switching waits for confirmation and occurs at the next cycle point. 
  - 
  - **Loop (LOP)**: Loop switching occurs at the end of the current loop. 
  - 
  - **ConfirmLoop (CLP)**: Combines **Confirm** and **Loop**—switching waits for confirmation and occurs at the next loop point. 
  - 

  #### **Interaction with Ins/Rev** 

  - 
  - **Insert in New Loop**: When **SwitchQuant=Cycle** or **Loop**, pressing **Insert** during the quantizing period copies the timing of the current loop into the new loop. 
  - 
  - **Reverse in New Loop**: When **SwitchQuant=Cycle** or **Loop**, pressing **Reverse** during the quantizing period aligns the reverse playback with the new loop's timing. 
  - 

  #### **Use Case**

  - 

  - **Scenario**: A user wants to switch loops and perform **Insert** or **Reverse** precisely in rhythm. 

  - 

  - Steps

    :

    1. 
    2. Set **SwitchQuant=Cycle**.
    3. 
    4. Press **NextLoop** to switch loops. 
    5. 
    6. During the quantizing period, press **Insert** or **Reverse** to execute the function in the new loop.
    7. 

    

  - 

  ### **2. VolumeCont**

  The **VolumeCont** parameter assigns a MIDI Continuous Controller to control the output volume of the loop. 

  #### **Parameter Settings**

  - 
  - **Values**: 1–99 (default: 7)
  - 

  #### **Interaction with Ins/Rev** 

  - 
  - **InsertMode=Replace**: The **VolumeCont** parameter can be used to dynamically adjust the loop's output volume while replacing sections of the loop.
  - 
  - **InsertMode=Substitute**: Volume control can be used to balance the new material with the existing loop during substitution.
  - 

  #### **Use Case**

  - 

  - **Scenario**: A user wants to control the loop's volume while performing **Insert** or **Reverse** operations.

  - 

  - Steps

    :

    1. 
    2. Set **VolumeCont=7** (or another MIDI Continuous Controller number). 
    3. 
    4. Use a MIDI controller to adjust the loop's volume while pressing **Ins/Rev**.
    5. 

    

  - 

  ### **3. InsertMode**

  The **InsertMode** parameter directly defines the behavior of the **Ins/Rev** button, enabling different functions such as **Insert**, **Reverse**, **Replace**, **Substitute**, **HalfSpeed**, **Rehearse**, or **Sustain**.

  #### **Parameter Settings**

  - 
  - **Insert (InS)**: Adds cycles to the loop. 
  - 
  - **Reverse (rEV)**: Reverses the playback direction of the loop. 
  - 
  - **Replace (rPL)**: Replaces sections of the loop with new material. 
  - 
  - **Substitute (Sub)**: Replaces sections while keeping the original loop playing as a guide. 
  - 
  - **HalfSpeed (h.SP)**: Plays the loop at half speed (one octave lower). 
  - 
  - **Rehearse (rhr)**: Allows users to practice a part before committing it to the loop. 
  - 
  - **Sustain (SUS)**: Turns the button into a real-time granular loop tool. 
  - 

  #### **Interaction with Ins/Rev** 

  - 
  - **Insert**: Adds cycles to the loop, extending its length. 
  - 
  - **Reverse**: Flips the playback direction of the loop. 
  - 
  - **Replace**: Overwrites sections of the loop with new material. 
  - 
  - **Substitute**: Replaces sections while maintaining the rhythm. 
  - 
  - **HalfSpeed**: Slows down the loop playback and lowers the pitch. 
  - 
  - **Rehearse**: Allows users to practice before committing material to the loop. 
  - 
  - **Sustain**: Enables granular loop manipulation. 
  - 

  #### **Use Case**

  - 

  - **Scenario**: A user wants to toggle between **Insert** and **Reverse**. 

  - 

  - Steps

    :

    1. 
    2. Set **InsertMode=Insert** to add cycles. 
    3. 
    4. Change **InsertMode=Reverse** to flip playback direction. 
    5. 

    

  - 

  ### **4. Sync**

  The **Sync** parameter determines how the Echoplex synchronizes with external devices or other Echoplexes. 

  #### **Parameter Settings**

  - 
  - **Off (OFF)**: No synchronization signals are sent or received. 
  - 
  - **Out (Out)**: Sends MIDI clocks and synchronization pulses.
  - 
  - **OutUserStart (OuS)**: Sends MIDI clocks but requires user commands to send StartSong messages. 
  - 
  - **In (In)**: Receives MIDI clocks and synchronization pulses. 
  - 

  #### **Interaction with Ins/Rev** 

  - 
  - **Insert in Sync**: When **Sync=In**, pressing **Insert** aligns the new cycles with the external clock.
  - 
  - **Reverse in Sync**: When **Sync=In**, pressing **Reverse** aligns the playback direction with the external clock.
  - 

  #### **Use Case**

  - 

  - **Scenario**: A user wants to synchronize **Insert** and **Reverse** operations with a drum machine.

  - 

  - Steps

    :

    1. 
    2. Set **Sync=In**. 
    3. 
    4. Connect the Echoplex to the drum machine via MIDI. 
    5. 
    6. Press **Ins/Rev** to perform synchronized **Insert** or **Reverse** operations.
    7. 

    

  - 

  ### **Summary**

  The **Ins/Rev** button's functionality is enhanced by parameters like **SwitchQuant**, **VolumeCont**, **InsertMode**, and **Sync**, enabling precise control over loop manipulation, synchronization, and volume adjustments. These parameters make **Ins/Rev** a versatile tool for live performance and creative looping.

  Let me know if you'd like further clarification or examples!

  ### **Comprehensive Guide to the Mute Button**

  The **Mute** button on the Echoplex Digital Pro Plus is a versatile control that silences the loop output and provides multiple ways to restart playback.  It is a powerful tool for live performance, allowing users to create dynamic pauses, stuttering effects, and rhythmic variations.  The behavior of the **Mute** button is influenced by the **MuteMode** parameter and can be combined with other functions for advanced looping techniques. 

  ### **Basic Functionality**

  The **Mute** button silences the loop output immediately when pressed.  The loop continues running in the background, and playback can be restarted in various ways depending on the settings. 

  ### **MuteMode Parameter** 

  The **MuteMode** parameter determines how the loop restarts after being muted. 

  #### **Parameter Settings**

  1. 
  2. **Continuous (Cnt)**: The loop continues counting even when muted.  When unmuted, playback resumes wherever the loop happens to be. 
  3. 
  4. **Start (StA)**: The loop restarts from the beginning when unmuted.
  5. 

  ### **1. MuteMode=Continuous (Cnt)** 

  - 
  - **Behavior**: The loop continues running silently in the background.  When unmuted, playback resumes at the current position. 
  - 
  - **Use Case**: Ideal for short pauses or fills while keeping the loop in sync with other musicians or devices. 
  - 

  #### **Example**

  1. 
  2. Press **Mute** to silence the loop. 
  3. 
  4. Play a fill or solo.
  5. 
  6. Press **Mute** again to resume playback at the current position. 
  7. 

  ### **2. MuteMode=Start (StA)** 

  - 
  - **Behavior**: The loop restarts from the beginning when unmuted. 
  - 
  - **Use Case**: Useful for solo performances where restarting the loop at the beginning is musically appropriate. 
  - 

  #### **Example**

  1. 
  2. Press **Mute** to silence the loop. 
  3. 
  4. Press **Mute** again to restart playback from the beginning.
  5. 

  ### **Alternate Endings** 

  The **Mute** button can be combined with other buttons to end the mute state in creative ways. 

  #### **Undo**

  - 

  - Behavior

    : Acts like the second press of the 

    Mute

     button but uses the opposite value of 

    MuteMode

    . 

    

    - 
    - If **MuteMode=Start**, **Undo** resumes playback at the current position.
    - 
    - If **MuteMode=Continuous**, **Undo** restarts playback from the beginning. 
    - 

    

  - 

  #### **Insert** 

  - 
  - **Behavior**: Plays the loop once and then returns to the mute state.  Repeated presses retrigger the loop. 
  - 
  - **Use Case**: Great for stuttering effects. 
  - 

  #### **Multiply**

  - 
  - **Behavior**: Executes the **ReAlign** function, aligning the loop with external devices or other loops. 
  - 

  ### **Long Press** 

  Holding down the **Mute** button silences the loop output until the button is released.  Playback resumes immediately upon release, regardless of the **MuteMode** setting. 

  ### **Advanced Techniques** 

  The **Mute** button can be used in combination with other functions for advanced looping techniques. 

  #### **Mute-Undo** 

  - 
  - **Behavior**: Silences the loop and restarts playback from the beginning when **Undo** is pressed. 
  - 
  - **Use Case**: Useful for creating rhythmic pauses and retriggering loops.
  - 

  #### **Mute-Insert** 

  - 
  - **Behavior**: Silences the loop and triggers playback once when **Insert** is pressed. 
  - 
  - **Use Case**: Ideal for stuttering effects or creating rhythmic accents. 
  - 

  #### **Mute-Multiply**

  - 
  - **Behavior**: Silences the loop and aligns it with external devices or other loops when **Multiply** is pressed. 
  - 
  - **Use Case**: Useful for syncing loops with external sequencers or drum machines. 
  - 

  ### **Interaction with Other Parameters**

  The **Mute** button's behavior can be influenced by other parameters, such as **Quantize**, **SwitchQuant**, and **Sync**. 

  #### **Quantize** 

  - 
  - **Behavior**: When **Quantize=On**, unmuting or alternate endings occur at the end of the current cycle or loop. 
  - 
  - **Use Case**: Ensures precise rhythmic alignment when unmuting.
  - 

  #### **SwitchQuant**

  - 
  - **Behavior**: When switching loops, the mute state can be maintained until the next loop starts. 
  - 
  - **Use Case**: Useful for transitioning between loops seamlessly. 
  - 

  #### **Sync**

  - 
  - **Behavior**: When **Sync=In**, muting and unmuting can align with external MIDI clocks or pulses. 
  - 
  - **Use Case**: Keeps the loop in sync with external devices. 
  - 

  ### **Creative Applications**

  The **Mute** button is a powerful tool for live performance and creative looping. Here are some examples of how it can be used:

  #### **1. Dynamic Pauses**

  - 
  - Use **MuteMode=Continuous** to create short pauses while keeping the loop in sync with other musicians.
  - 

  #### **2. Stuttering Effects** 

  - 
  - Combine **Mute** with **Insert** to retrigger the loop for rhythmic stuttering effects. 
  - 

  #### **3. Loop Alignment** 

  - 
  - Use **Mute-Multiply** to align the loop with external devices or other loops.
  - 

  #### **4. Rhythmic Variations**

  - 
  - Use **MuteMode=Start** to restart the loop at the beginning for dramatic rhythmic changes.
  - 

  ### **Summary**

  The **Mute** button is a versatile control that allows users to silence the loop output and restart playback in various ways.  With the ability to combine it with other functions and parameters, it provides endless possibilities for live performance and creative looping. 

  Let me know if you'd like further clarification or examples!

  ### **Parameter Settings and Functions for Mute: LoopTrig, FeedBkCont, MuteMode, and Threshold** 

  The **Mute** button's behavior is influenced by several parameters that define how it interacts with loops, feedback, and audio thresholds.  Below is a detailed explanation of how **LoopTrig**, **FeedBkCont**, **MuteMode**, and **Threshold** affect the **Mute** button.

  ### **1. LoopTrig**

  The **LoopTrig** parameter determines which MIDI note numbers can trigger loops, including muting and unmuting operations. 

  #### **Parameter Settings**

  - 

  - **Values**: 0–127 (default: 84)

     

    

    - 
    - **Loop 1** is triggered by the MIDI note number set in **LoopTrig**. 
    - 
    - Subsequent loops are triggered by successive note numbers (e.g., Loop 2 = LoopTrig + 1, Loop 3 = LoopTrig + 2). 
    - 

    

  - 

  #### **Interaction with Mute**

  - 
  - **Mute via MIDI**: Incoming MIDI NoteOn messages can mute or unmute loops based on the **LoopTrig** setting.
  - 
  - **Stuttering Effects**: When combined with **SamplerStyle=One**, MIDI NoteOn messages can trigger loops to play once and then mute.
  - 

  #### **Use Case**

  - 

  - **Scenario**: A user wants to mute and unmute loops using a MIDI controller. 

  - 

  - Steps

    :

    1. 
    2. Set **LoopTrig=84**. 
    3. 
    4. Use MIDI NoteOn messages (e.g., Note 84 for Loop 1) to mute/unmute the loop.
    5. 

    

  - 

  ### **2. FeedBkCont**

  The **FeedBkCont** parameter assigns a MIDI Continuous Controller to control the feedback level of the loop. 

  #### **Parameter Settings**

  - 
  - **Values**: 0–99 (default: 1)
  - 

  #### **Interaction with Mute**

  - 
  - **Feedback Control During Mute**: While the loop is muted, the feedback level can be adjusted using the assigned MIDI Continuous Controller. 
  - 
  - **Undo Feedback Changes**: After feedback adjustments during mute, pressing **Undo** can restore the previous feedback level. 
  - 

  #### **Use Case**

  - 

  - **Scenario**: A user wants to fade out the loop while it is muted.

  - 

  - Steps

    :

    1. 
    2. Set **FeedBkCont=1** (or another MIDI Continuous Controller number). 
    3. 
    4. Press **Mute** to silence the loop. 
    5. 
    6. Use the MIDI controller to lower the feedback level gradually. 
    7. 

    

  - 

  ### **3. MuteMode**

  The **MuteMode** parameter defines how the loop restarts after being muted. 

  #### **Parameter Settings**

  - 
  - **Continuous (Cnt)**: The loop continues running silently in the background.  When unmuted, playback resumes at the current position. 
  - 
  - **Start (StA)**: The loop restarts from the beginning when unmuted.
  - 

  #### **Interaction with Mute**

  - 
  - **Continuous Mode**: Ideal for short pauses while keeping the loop in sync with external devices or other musicians. 
  - 
  - **Start Mode**: Useful for restarting the loop at the beginning for dramatic rhythmic changes.
  - 

  #### **Use Case**

  - 

  - **Scenario**: A user wants to toggle between continuous playback and restarting the loop.

  - 

  - Steps

    :

    1. 
    2. Set **MuteMode=Continuous** for seamless pauses. 
    3. 
    4. Switch to **MuteMode=Start** for restarting the loop at the beginning.
    5. 

    

  - 

  ### **4. Threshold**

  The **Threshold** parameter sets the audio level required to trigger recording or other actions. 

  #### **Parameter Settings**

  - 

  - Values

    : 0–8 (default: 0)

    - 
    - **0**: Disables threshold-based triggering.
    - 
    - **1–8**: Sets increasing sensitivity levels (1 = very sensitive, 8 = least sensitive). 
    - 

    

  - 

  #### **Interaction with Mute**

  - 
  - **Threshold-Based Recording**: When **Threshold > 0**, the loop can be muted until an audio signal exceeds the threshold, triggering recording or playback. 
  - 
  - **Dynamic Mute Control**: Use audio input levels to control when the loop unmutes.
  - 

  #### **Use Case**

  - 

  - **Scenario**: A user wants the loop to unmute automatically when a loud audio signal is detected.

  - 

  - Steps

    :

    1. 
    2. Set **Threshold=3** (medium sensitivity). 
    3. 
    4. Press **Mute** to silence the loop. 
    5. 
    6. Play a loud note or sound to unmute the loop automatically.
    7. 

    

  - 

  ### **Summary**

  The **Mute** button's functionality is enhanced by parameters like **LoopTrig**, **FeedBkCont**, **MuteMode**, and **Threshold**, enabling precise control over loop muting, feedback adjustments, and dynamic audio triggering. These settings make the **Mute** button a versatile tool for live performance and creative looping. 

  Let me know if you'd like further clarification or examples!

  ### **Comprehensive Guide to the Undo Button**

  The **Undo** button on the Echoplex Digital Pro Plus is a powerful tool for canceling actions, erasing overdubs, and restoring previous loop states.  It provides flexibility for live performance and creative looping, allowing users to correct mistakes, evolve loops, and experiment with layering.  Below is a detailed guide to its functionality, alternate endings, and advanced techniques. 

  ### **Basic Functionality**

  The **Undo** button serves two primary purposes:

  1. 
  2. **Canceling Actions**: Undo can cancel a function that has already started, such as recording or overdubbing. 
  3. 
  4. **Erasing Overdub Layers**: Undo can remove the most recent overdub pass or feedback changes, restoring the loop to its previous state. 
  5. 

  ### **Undo Modes**

  The **Undo** button operates in two modes: **Short Press** and **Long Press**.

  #### **1. Short Press** 

  - 
  - **Behavior**: Removes the tail end of the last overdub or feedback change, starting from the time of the button press to the end of the loop. 
  - 
  - **Use Case**: Ideal for fixing small mistakes, such as a bad note at the end of an overdub. 
  - 

  #### **2. Long Press** 

  - 
  - **Behavior**: Erases the entire last overdub pass or feedback change. 
  - 
  - **Use Case**: Useful for completely removing a layer of sound added to the loop. 
  - 

  ### **Advanced Undo Features**

  #### **Undo Feedback** 

  - 
  - **Behavior**: If feedback has been reduced, Undo can restore the loop to its original state by stepping back through previous loop passes. 
  - 
  - **Use Case**: Allows users to fade loops down and then bring them back up using Undo. 
  - 

  #### **Undo Overdub Layers** 

  - 
  - **Behavior**: If multiple overdub passes have been made, Undo can erase them one by one, starting with the most recent. 
  - 
  - **Use Case**: Enables users to peel back layers of sound to return to earlier versions of the loop. 
  - 

  #### **Undo Memory Management** 

  - 
  - **Behavior**: Undo depends on available memory.  If memory is tight, Undo may not be able to restore earlier loop states. 
  - 
  - **Use Case**: Monitor the **Undo LED** to check if Undo is possible (green = available, off = unavailable). 
  - 

  ### **Alternate Roles for Undo** 

  The **Undo** button can serve alternate roles in specific situations:

  #### **1. Escape from SamplePlay** 

  - 
  - **Behavior**: Pressing Undo during **SamplePlay** seamlessly transitions the loop back into **PlayMode**, allowing the loop to continue playing instead of stopping at the end. 
  - 
  - **Use Case**: Useful for stuttering effects or retriggering loops. 
  - 

  #### **2. Restart from Mute** 

  - 
  - **Behavior**: When the loop is muted, pressing Undo triggers playback from the **StartPoint**. 
  - 
  - **Use Case**: Allows users to restart the loop rhythmically after muting. 
  - 

  #### **3. TempoSelect**

  - 
  - **Behavior**: Pressing Undo in **Reset** activates the **TempoSelect** function, allowing users to set a tempo for the loop in Beats Per Minute (BPM). 
  - 
  - **Use Case**: Useful for predefining loop tempos before recording. 
  - 

  ### **Interaction with Other Functions** 

  The **Undo** button interacts with several other functions for advanced looping techniques. 

  #### **Undo and Feedback** 

  - 
  - **Behavior**: Undo can reverse feedback changes, restoring the loop to its original volume. 
  - 
  - **Use Case**: Combine feedback control with Undo to evolve loops dynamically. 
  - 

  #### **Undo and Overdub** 

  - 
  - **Behavior**: Undo can erase overdub layers one by one or remove only the tail end of the last overdub. 
  - 
  - **Use Case**: Allows users to refine loops by removing unwanted layers. 
  - 

  #### **Undo and Quantize**

  - 
  - **Behavior**: When **Quantize=On**, Undo actions are aligned to the end of the current cycle or loop. 
  - 
  - **Use Case**: Ensures precise rhythmic alignment when undoing changes.
  - 

  ### **Undo LED** 

  The **Undo LED** provides visual feedback on the availability of Undo:

  - 
  - **Green**: Undo is possible. 
  - 
  - **Off**: Undo is unavailable due to memory limitations. 
  - 

  ### **Advanced Techniques** 

  #### **1. Undo Feedback Evolution** 

  - 

  - Steps

    :

    1. 
    2. Reduce feedback to fade the loop down. 
    3. 
    4. Press Undo to restore the loop to its original state. 
    5. 
    6. Repeat to create dynamic loop evolution. 
    7. 

    

  - 

  #### **2. Undo Overdub Layers** 

  - 

  - Steps

    :

    1. 
    2. Overdub multiple layers onto the loop. 
    3. 
    4. Press Undo repeatedly to peel back layers one by one.
    5. 
    6. Stop when the desired loop state is restored. 
    7. 

    

  - 

  #### **3. Escape from SamplePlay** 

  - 

  - Steps

    :

    1. 
    2. Trigger the loop using **SamplePlay**. 
    3. 
    4. Press Undo to transition seamlessly into **PlayMode**. 
    5. 

    

  - 

  #### **4. Restart from Mute** 

  - 

  - Steps

    :

    1. 
    2. Mute the loop. 
    3. 
    4. Press Undo to restart playback from the **StartPoint**. 
    5. 

    

  - 

  ### **Creative Applications**

  The **Undo** button is a versatile tool for live performance and creative looping.  Here are some examples of how it can be used:

  #### **1. Correct Mistakes**

  - 
  - Use **Short Press** to remove small errors, such as a bad note at the end of an overdub. 
  - 

  #### **2. Layer Management**

  - 
  - Use **Long Press** to erase entire overdub layers and refine the loop. 
  - 

  #### **3. Dynamic Loop Evolution**

  - 
  - Combine feedback control with Undo to create loops that fade down and then return to their original state. 
  - 

  #### **4. Seamless Transitions** 

  - 
  - Use Undo to escape from **SamplePlay** or restart the loop from mute. 
  - 

  ### **Summary**

  The **Undo** button is a powerful and flexible tool for managing loops, correcting mistakes, and creating dynamic transitions.  With its ability to interact with feedback, overdubs, and other functions, it provides endless possibilities for live performance and creative looping. 

  Let me know if you'd like further clarification or examples!**Parameter Settings and Functions for Undo: Velocity, Dump, Overflow, and Reverse**

  The **Undo** button's behavior is influenced by several parameters that define how it interacts with loop playback, MIDI commands, memory management, and playback direction.  Below is a detailed explanation of how **Velocity**, **Dump**, **Overflow**, and **Reverse** affect the **Undo** button.

  ### **1. Velocity**

  The **Velocity** parameter determines how MIDI NoteOn messages affect the playback volume of loops. 

  #### **Parameter Settings**

  - 

  - Values

    :

    - 
    - **Off (OFF)**: Loops triggered by MIDI NoteOn messages play at full volume. 
    - 
    - **On (On)**: Loops triggered by MIDI NoteOn messages scale their playback volume based on the velocity of the NoteOn message (e.g., velocity 127 = full volume, velocity 1 = very quiet). 
    - 

    

  - 

  #### **Interaction with Undo**

  - 
  - **Undo and Velocity**: Undo does not directly affect the velocity of loops but can be used to restore a loop to its previous state after changes triggered by MIDI NoteOn messages.
  - 
  - **Use Case**: If a loop's playback volume is altered by MIDI velocity, Undo can restore the loop to its original state.
  - 

  #### **Example**

  - 

  - **Scenario**: A user triggers a loop with a MIDI NoteOn message at low velocity, resulting in quiet playback. 

  - 

  - Steps

    :

    1. 
    2. Set **Velocity=On**. 
    3. 
    4. Trigger the loop with a MIDI NoteOn message (e.g., velocity 50). 
    5. 
    6. Press **Undo** to restore the loop to its original playback state. 
    7. 

    

  - 

  ### **2. Dump**

  The **Dump** parameter allows the contents of the current loop to be sent out via MIDI Sample Dump format. 

  #### **Parameter Settings**

  - 
  - **Immediate Action**: Pressing **Undo (Dump)** sends the current loop to a connected MIDI device. 
  - 

  #### **Interaction with Undo**

  - 
  - **Undo and Dump**: Undo can be used to cancel a dump operation if it was initiated by mistake. Additionally, Undo can restore the loop to its previous state after a dump operation.
  - 
  - **Use Case**: Useful for saving loops to external devices and recovering from accidental dumps. 
  - 

  #### **Example**

  - 

  - **Scenario**: A user wants to save the current loop to a MIDI sampler but accidentally initiates a dump. 

  - 

  - Steps

    :

    1. 
    2. Press **Undo (Dump)** to start the dump. 
    3. 
    4. Press **Undo** again to cancel the dump and restore the loop. 
    5. 

    

  - 

  ### **3. Overflow**

  The **Overflow** parameter determines how the Echoplex handles memory overflows during recording operations. 

  #### **Parameter Settings**

  - 

  - Values

    :

    - 
    - **Stop (StP)**: Exceeding memory capacity cancels the recording operation and resets the current loop. 
    - 
    - **Play (PLY)**: Exceeding memory capacity sets the cycle length to the maximum available memory and loops the recorded material. 
    - 

    

  - 

  #### **Interaction with Undo**

  - 
  - **Undo and Overflow**: Undo can restore the loop to its previous state after an overflow occurs, provided there is enough memory available.
  - 
  - **Use Case**: Useful for recovering loops after accidental memory overflows.
  - 

  #### **Example**

  - 

  - **Scenario**: A user accidentally exceeds the memory capacity while recording a loop. 

  - 

  - Steps

    :

    1. 
    2. Set **Overflow=Play**. 
    3. 
    4. Record a loop that exceeds memory capacity. 
    5. 
    6. Press **Undo** to restore the loop to its previous state. 
    7. 

    

  - 

  ### **4. Reverse**

  The **Reverse** parameter allows the playback direction of the loop to be toggled between forward and backward.

  #### **Parameter Settings**

  - 
  - **Immediate Action**: Pressing **Undo** while the loop is reversed restores the loop to its previous state, including its original playback direction. 
  - 

  #### **Interaction with Undo**

  - 
  - **Undo and Reverse**: Undo can cancel a reverse operation or restore the loop to its original state after changes made while the loop is reversed. 
  - 
  - **Use Case**: Useful for experimenting with reversed playback and recovering original loop states. 
  - 

  #### **Example**

  - 

  - **Scenario**: A user reverses the loop and overdubs new material but wants to restore the original loop. 

  - 

  - Steps

    :

    1. 
    2. Press **Reverse** to toggle playback direction. 
    3. 
    4. Overdub new material while the loop is reversed. 
    5. 
    6. Press **Undo** to restore the loop to its original state and playback direction. 
    7. 

    

  - 

  ### **Summary**

  The **Undo** button interacts with parameters like **Velocity**, **Dump**, **Overflow**, and **Reverse** to provide flexible control over loop playback, memory management, and MIDI integration. These settings enhance the Undo button's functionality, making it a versatile tool for live performance and creative looping. 

  Let me know if you'd like further clarification or examples!

  ### **Comprehensive Guide to the NextLoop Button**

  The **NextLoop** button is a key feature of the Echoplex Digital Pro Plus, enabling users to switch between multiple loops seamlessly. It is especially useful for creating dynamic performances, managing multiple loops, and transitioning between different musical sections.  Below is a detailed guide to its functionality, alternate endings, and advanced techniques. 

  ### **Basic Functionality**

  The **NextLoop** button allows users to:

  1. 
  2. **Switch to the Next Loop**: Move to the next loop when multiple loops are set up using the **MoreLoops** parameter. 
  3. 
  4. **Record-to-NextLoop**: End recording in the current loop and immediately move to the next loop. 
  5. 
  6. **Trigger Loop Actions**: Execute additional functions during loop switching, depending on the **SwitchQuant** parameter. 
  7. 

  ### **Parameter Settings**

  The behavior of the **NextLoop** button is influenced by several parameters:

  #### **1. MoreLoops**

  - 
  - **Values**: 1–16 
  - 
  - **Description**: Divides memory into multiple loops.  The **NextLoop** button switches between these loops. 
  - 
  - **Use Case**: Set up multiple loops for different song sections (e.g., verse, chorus, bridge). 
  - 

  #### **2. SwitchQuant**

  - 
  - **Values**: Off, Confirm, Cycle, ConfirmCycle, Loop, ConfirmLoop 
  - 
  - **Description**: Determines when the switch to the next loop occurs after pressing **NextLoop**. 
  - 
  - **Use Case**: Quantize loop switches to maintain rhythmic precision. 
  - 

  #### **3. AutoRecord**

  - 
  - **Values**: Off, On
  - 
  - **Description**: Automatically starts recording when entering an empty loop. 
  - 
  - **Use Case**: Useful for live performances where continuous recording is needed. 
  - 

  #### **4. LoopCopy**

  - 
  - **Values**: Off, Timing, Sound 
  - 
  - **Description**: Copies the current loop into the next loop when switching. 
  - 
  - **Use Case**: Create variations of a loop in a new loop. 
  - 

  ### **Basic Operations**

  #### **Switch to the Next Loop**

  - 

  - Steps

    :

    1. 
    2. Set **MoreLoops** to a value greater than 1. 
    3. 
    4. Press **NextLoop** to move to the next loop. 
    5. 
    6. The display shows the number of the current loop. 
    7. 

    

  - 

  #### **Record-to-NextLoop** 

  - 

  - Steps

    :

    1. 
    2. Record a loop. 
    3. 
    4. Press **NextLoop** to end recording and move to the next loop. 
    5. 
    6. If **AutoRecord=On**, recording starts automatically in the new loop. 
    7. 

    

  - 

  ### **Advanced Features**

  #### **Quantized Loop Switching** 

  The **SwitchQuant** parameter allows users to quantize loop switches for precise timing. 

  - 

  - Options

    :

    - 
    - **Off**: Switch loops immediately. 
    - 
    - **Confirm**: Wait for a confirming action before switching. 
    - 
    - **Cycle**: Switch at the end of the current cycle. 
    - 
    - **ConfirmCycle**: Wait for confirmation, then switch at the end of the cycle. 
    - 
    - **Loop**: Switch at the end of the current loop. 
    - 
    - **ConfirmLoop**: Wait for confirmation, then switch at the end of the loop. 
    - 

    

  - 

  #### **Example: Quantized Loop Switching**

  - 

  - **Scenario**: A user wants to switch loops at the end of the current cycle. 

  - 

  - Steps

    :

    1. 
    2. Set **SwitchQuant=Cycle**.
    3. 
    4. Press **NextLoop** during the current cycle. 
    5. 
    6. The switch occurs at the end of the cycle. 
    7. 

    

  - 

  #### **LoopCopy** 

  The **LoopCopy** parameter allows users to copy the current loop into the next loop during switching. 

  - 

  - Options

    :

    - 
    - **Off**: No copy occurs. 
    - 
    - **Timing**: Copies the timing of the current loop. 
    - 
    - **Sound**: Copies the audio content of the current loop. 
    - 

    

  - 

  #### **Example: Copying a Loop** 

  - 

  - **Scenario**: A user wants to copy the audio content of the current loop into the next loop. 

  - 

  - Steps

    :

    1. 
    2. Set **LoopCopy=Sound**. 
    3. 
    4. Press **NextLoop** to move to the next loop. 
    5. 
    6. The audio content of the current loop is copied into the new loop. 
    7. 

    

  - 

  ### **Alternate Endings** 

  The **NextLoop** button can be combined with other buttons to execute additional functions during loop switching. 

  #### **1. Multiply**

  - 
  - **Behavior**: Copies the current loop into the next loop and enters **Multiply** mode. 
  - 
  - **Use Case**: Create variations of the loop with additional layers. 
  - 

  #### **2. Insert**

  - 
  - **Behavior**: Copies the timing of the current loop into the next loop and enters **Insert** mode. 
  - 
  - **Use Case**: Create a new loop with the same timing as the current loop. 
  - 

  #### **3. Record**

  - 
  - **Behavior**: Starts recording immediately in the next loop. 
  - 
  - **Use Case**: Useful for live performances where continuous recording is needed. 
  - 

  #### **4. Mute**

  - 
  - **Behavior**: Mutes the next loop upon switching. 
  - 
  - **Use Case**: Silence the loop for transitions or breaks. 
  - 

  ### **Creative Applications**

  The **NextLoop** button is a versatile tool for live performance and creative looping.  Here are some examples of how it can be used:

  #### **1. Song Sections**

  - 
  - Use **MoreLoops** to set up loops for different song sections (e.g., verse, chorus, bridge). 
  - 
  - Use **NextLoop** to transition between sections seamlessly. 
  - 

  #### **2. Loop Variations** 

  - 
  - Use **LoopCopy=Sound** to create variations of a loop in a new loop. 
  - 
  - Add overdubs or edits to the copied loop. 
  - 

  #### **3. Dynamic Transitions**

  - 
  - Use **SwitchQuant=Cycle** to switch loops rhythmically. 
  - 
  - Combine **NextLoop** with **Mute** for silent transitions.
  - 

  #### **4. Continuous Recording**

  - 
  - Use **AutoRecord=On** to record continuously across multiple loops. 
  - 
  - Press **NextLoop** to move to the next loop while recording. 
  - 

  ### **Summary**

  The **NextLoop** button is a powerful feature for managing multiple loops, creating dynamic transitions, and enhancing live performances.  With its ability to interact with parameters like **MoreLoops**, **SwitchQuant**, **AutoRecord**, and **LoopCopy**, it provides endless possibilities for creative looping. 

  Let me know if you'd like further clarification or examples!

- ### **Parameter Functions and Settings for NextLoop**

  The **NextLoop** button's behavior is influenced by several parameters that define how it interacts with loop switching, recording, copying, and quantization.  Below is a detailed explanation of the relevant parameters and their functions. 

  ### **1. MoreLoops**

  #### **Function** 

  - 
  - Divides the Echoplex's memory into multiple loops, allowing the **NextLoop** button to switch between them. 
  - 

  #### **Settings**

  - 
  - **Values**: 1–16 
  - 
  - **Default**: 1
  - 
  - **Description**: Determines the number of loops available.  Memory is divided evenly among the loops. 
  - 

  #### **Key Points**

  - 
  - Changing the **MoreLoops** parameter resets all existing loops. 
  - 
  - The **NextLoop** button switches between loops in numerical order (e.g., Loop 1 → Loop 2 → Loop 3). 
  - 

  ### **2. SwitchQuant**

  #### **Function** 

  - 
  - Quantizes loop switching to specific rhythmic points or requires confirmation before switching. 
  - 

  #### **Settings**

  - 

  - Values

    :

    - 
    - **Off (OFF)**: Switch loops immediately. 
    - 
    - **Confirm (CnF)**: Wait for confirmation before switching. 
    - 
    - **Cycle (CYC)**: Switch at the end of the current cycle. 
    - 
    - **ConfirmCycle (CCY)**: Wait for confirmation, then switch at the end of the cycle. 
    - 
    - **Loop (LOP)**: Switch at the end of the current loop. 
    - 
    - **ConfirmLoop (CLP)**: Wait for confirmation, then switch at the end of the loop. 
    - 

    

  - 

  #### **Key Points**

  - 
  - **Quantized Switching**: Ensures loop transitions occur at precise rhythmic points. 
  - 
  - **Confirm Options**: Allows users to "arm" additional functions (e.g., Record, Multiply) during the quantizing period. 
  - 

  ### **3. AutoRecord**

  #### **Function** 

  - 
  - Automatically starts recording when entering an empty loop. 
  - 

  #### **Settings**

  - 

  - Values

    :

    - 
    - **Off**: Recording does not start automatically. 
    - 
    - **On**: Recording starts immediately upon entering an empty loop. 
    - 

    

  - 

  #### **Key Points**

  - 
  - **Continuous Recording**: Useful for live performances where uninterrupted recording is needed. 
  - 
  - **Interaction with NextLoop**: Pressing **NextLoop** moves to the next loop and starts recording if **AutoRecord=On**.
  - 

  ### **4. LoopCopy**

  #### **Function** 

  - 
  - Copies the current loop into the next loop during switching. 
  - 

  #### **Settings**

  - 

  - Values

    :

    - 
    - **Off**: No copy occurs. 
    - 
    - **Timing (ti)**: Copies the timing of the current loop. 
    - 
    - **Sound (Snd)**: Copies the audio content of the current loop. 
    - 

    

  - 

  #### **Key Points**

  - 
  - **Timing Copy**: Creates a new loop with the same timing as the current loop. 
  - 
  - **Sound Copy**: Copies the audio content of the current loop into the new loop. 
  - 

  ### **5. SamplerStyle**

  #### **Function** 

  - 
  - Determines how loops are triggered when switching or using MIDI commands. 
  - 

  #### **Settings**

  - 

  - Values

    :

    - 
    - **Run**: Loops play continuously. 
    - 
    - **Start (StA)**: Loops trigger from the start point and play continuously. 
    - 
    - **Once (OnE)**: Loops play once and then mute. 
    - 
    - **Attack (Att)**: Loops play as long as the triggering note is held. 
    - 

    

  - 

  #### **Key Points**

  - 
  - **Interaction with NextLoop**: Defines playback behavior when switching loops. 
  - 

  ### **6. Velocity**

  #### **Function** 

  - 
  - Determines whether MIDI NoteOn messages affect the playback volume of loops. 
  - 

  #### **Settings**

  - 

  - Values

    :

    - 
    - **Off (OFF)**: Loops play at full volume. 
    - 
    - **On (On)**: Playback volume scales based on MIDI velocity. 
    - 

    

  - 

  #### **Key Points**

  - 
  - **Dynamic Playback**: Useful for controlling loop volume via MIDI. 
  - 

  ### **7. Quantize**

  #### **Function** 

  - 
  - Defines whether certain functions (e.g., Multiply, Insert, Reverse) are executed immediately or at rhythmic points. 
  - 

  #### **Settings**

  - 

  - Values

    :

    - 
    - **Off (OFF)**: Functions execute immediately. 
    - 
    - **Cycle (CYC)**: Functions execute at the end of the current cycle. 
    - 
    - **Sub-Cycle (8th)**: Functions execute at the next sub-cycle (e.g., 8th note). 
    - 
    - **Loop (LOP)**: Functions execute at the end of the current loop. 
    - 

    

  - 

  #### **Key Points**

  - 
  - **Interaction with NextLoop**: Ensures loop switches occur in rhythm. 
  - 

  ### **8. Presets**

  #### **Function** 

  - 
  - Allows users to save and recall parameter setups, including **NextLoop** behavior.
  - 

  #### **Settings**

  - 
  - **Values**: 15 memory spaces for presets. 
  - 
  - **Description**: Save parameter setups for quick recall during performances. 
  - 

  #### **Key Points**

  - 
  - **Preset Recall**: Use MIDI Program Change commands or front-panel buttons to load presets. 
  - 

  ### **Summary**

  The **NextLoop** button's functionality is highly customizable through parameters like **MoreLoops**, **SwitchQuant**, **AutoRecord**, **LoopCopy**, and **SamplerStyle**. These settings allow users to tailor loop switching to their specific needs, whether for live performance, studio recording, or creative experimentation. 

  Let me know if you'd like further clarification or examples!

  ### Feature Overview and Tips for Use:

  #### **Half Speed** 

  - 
  - **Description**: Switches playback speed to half, making the loop an octave lower and twice as long.  Press Insert when InsertMode is set to Half Speed. 
  - 
  - **Tips**: Use during overdubbing to create octave jumps.  Reset returns to full speed. 
  - 

  #### **SUS Commands – Real-Time Granular Looping** 

  - 
  - **Description**: Sustain action for Multiply and Insert, allowing real-time granular sound splicing. 
  - 
  - **Tips**: Combine with Quantize = OFF for freeform splicing or Quantize = CYC for rhythmic sequences. 
  - 

  #### **Substitute**

  - 
  - **Description**: Replaces loop audio while keeping playback active for continuity. 
  - 
  - **Tips**: Use InsertMode = Sub for precise substitutions.  Adjust feedback for blending old and new audio. 
  - 

  #### **Feedback Display** 

  - 
  - **Description**: Displays feedback values on the LoopTime display during adjustments. 
  - 
  - **Tips**: Use this to fine-tune feedback settings, especially when using a pedal. 
  - 

  #### **Tempo Select** 

  - 
  - **Description**: Set loop tempo in BPM before recording. 
  - 
  - **Tips**: Use Undo in Reset to enter Tempo Select.  Adjust tempo with the Feedback knob and fine-tune with Insert/Mute. 
  - 

  #### **SyncRecord** 

  - 
  - **Description**: Records loops synchronized to external clock without quantization. 
  - 
  - **Tips**: Use when external sync is active. Overdub LED turns yellow to indicate sync arrival. 
  - 

  #### **Sync ReAlign** 

  - 
  - **Description**: Aligns loops with external sequencers after de-aligning. 
  - 
  - **Tips**: Use Mute-Multiply or MIDI commands for precise realignment. 
  - 

  #### **MultiIncrease**

  - 
  - **Description**: Quickly set the number of multiples during Multiply or Insert. 
  - 
  - **Tips**: Tap Multiply multiple times during rounding to set desired multiples. 
  - 

  #### **Record-to-NextLoop** 

  - 
  - **Description**: Ends recording and jumps to the next loop. 
  - 
  - **Tips**: Use AutoRecord to immediately start recording in the next loop. 
  - 

  #### **LoopWindowing** 

  - 
  - **Description**: Define and move a smaller loop segment within a larger loop. 
  - 
  - **Tips**: Use Undo to move the window backward through memory.  Experiment with rhythmic alignment using Quantize = CYC. 
  - 

  #### **LoopDividing** 

  - 
  - **Description**: Subdivide loops into smaller rhythmic units using Quantize = 8th. 
  - 
  - **Tips**: Combine with Replace or Substitute for precise edits to subdivisions.
  - 

  #### **16 Loops** 

  - 
  - **Description**: Expanded loop count from 9 to 16. 
  - 
  - **Tips**: Use letters (A-G) for loops beyond 9.  Manage loops efficiently with NextLoop and presets.
  - 

  #### **InterfaceModes – Stutter, Expert, Input, Replace, Flip** 

  - 
  - **Description**: New modes for controlling feedback, input, and output levels. 
  - 
  - **Tips**: Experiment with StutterMode for rhythmic effects and FlipMode for crossfading loops.
  - 

  #### **NextOverdub** 

  - 
  - **Description**: Overdub in the next loop, automatically copying the previous loop if empty. 
  - 
  - **Tips**: Use SwitchQuantize for seamless transitions between loops.
  - 

  #### **SimpleCopy** 

  - 
  - **Description**: Copies the previous loop into the next loop without adding multiples. 
  - 
  - **Tips**: Use NextOverdub in an empty loop for quick copying. 
  - 

  #### **Improved Reverse** 

  - 
  - **Description**: Undo is now possible while in Reverse. 
  - 
  - **Tips**: Use Reverse for creative playback effects and Undo to remove overdubs.
  - 

  #### **Improved Undo** 

  - 
  - **Description**: Undo can now be executed even when the Undo LED is not green. 
  - 
  - **Tips**: Tap Undo anytime to maximize undoable changes. 
  - 

  #### **Improved Multiply & Insert Cross-Functions** 

  - 
  - **Description**: Multiply and Insert now round off to Cycle points when ended with alternate functions. 
  - 
  - **Tips**: Use Record during rounding to force unrounded endings. 
  - 

  #### **8th/Cycle and Sync Changes Occur in Rhythm** 

  - 
  - **Description**: Changes to 8ths/Cycle or Sync parameters activate at the next Loop StartPoint. 
  - 
  - **Tips**: Use this feature to smoothly transition between time signatures. 
  - 

  These features provide enhanced control and creative possibilities for looping, synchronization, and sound manipulation.  Experiment with combinations to discover unique effects tailored to your workflow. 

### **Feature 1: LoopWindowing** 

LoopWindowing is a unique and powerful feature that allows you to define a smaller segment (or "window") within a larger loop and manipulate it independently.  This technique is particularly useful for creating dynamic variations, rhythmic effects, or exploring memory fragments of your loop. 

#### **Step-by-Step Guide to LoopWindowing**

1. 

2. 

   **Create a Loop**:

   

   - 
   - Record a loop as usual by pressing the **Record** button. 
   - 
   - Add overdubs or multiply the loop to create a longer loop with multiple cycles. 
   - 

   

3. 

4. 

   **Define the LoopWindow**:

   

   - 

   - Re-Multiply

     :

     - 
     - Press **Multiply** on a loop that already has multiple cycles.
     - 
     - End the Multiply before the loop completes to chop out a segment. 
     - 
     - The new loop length will be rounded to the previous cycle length. 
     - 

     

   - 

   - Unrounded Multiply

     :

     - 
     - Press **Multiply** to start multiplying. 
     - 
     - End the Multiply with **Record** to stop immediately and redefine the loop length at that exact point. 
     - 
     - This creates an unrounded window that can be rhythmically or freely defined. 
     - 

     

   - 

   

5. 

6. 

   **Move the LoopWindow**:

   

   - 
   - Press **Undo** to move the window backward through the loop memory. 
   - 
   - Each press of Undo shifts the window by the size of the defined LoopWindow. 
   - 
   - **Short Undo**: Press Undo briefly to set the window's end at the current point and start at a window length before that. 
   - 
   - **Long Undo**: Press Undo for a longer duration to jump back a full window length. 
   - 

   

7. 

8. 

   **Modify the LoopWindow**:

   

   - 
   - Overdub new material onto the defined window. 
   - 
   - Press Undo to remove overdubs and return to the original window. 
   - 
   - Redefine the window size by performing another Multiply or Unrounded Multiply. 
   - 

   

9. 

10. 

    **Experiment with Rhythmic Effects**:

    

    - 
    - Use **Quantize = CYC** or **Quantize = 8th** to align the window to rhythmic subdivisions. 
    - 
    - Combine with Reverse or Substitute to create glitchy or rhythmic variations.
    - 

    

11. 

#### **Tips for Blind Users**

- 

- **Audio Feedback**: Pay attention to the sound changes as you press Undo. Each Undo press shifts the window backward, and you’ll hear a different segment of the loop repeating.

- 

- Button Presses

  :

  - 
  - Multiply defines the window. 
  - 
  - Undo moves the window backward. 
  - 
  - Record ends Multiply for unrounded windows. 
  - 

  

- 

- **Memory Exploration**: Use Undo repeatedly to explore the loop’s memory, moving back to the very first point where the loop was recorded. 

- 

### **Feature 2: Sync ReAlign** 

Sync ReAlign is a groundbreaking feature that allows you to realign your loop with an external sequencer or other loops after they’ve been shifted out of sync.  This is perfect for creating rhythmic variations and then seamlessly bringing everything back into alignment. 

#### **Step-by-Step Guide to Sync ReAlign**

1. 

2. 

   **Set Up External Sync**:

   

   - 
   - Ensure your Echoplex is connected to an external sequencer or MIDI clock source. 
   - 
   - Set the **Sync Parameter** to **In** (to receive sync) or **Out** (to send sync). 
   - 

   

3. 

4. 

   **De-Align the Loop**:

   

   - 
   - Perform actions like Reverse, HalfSpeed, or triggering samples to shift the loop’s StartPoint away from the external sequencer’s downbeat. 
   - 
   - The loop will now play out of phase with the external clock. 
   - 

   

5. 

6. 

   **ReAlign the Loop**:

   

   - 

   - Mute-Multiply Combination

     :

     - 
     - Press **Mute** to silence the loop. 
     - 
     - Press **Multiply** while muted to arm the ReAlign function. 
     - 
     - The display will show "AL" to indicate ReAlign is waiting for the next Global MIDI StartPoint. 
     - 
     - When the external sequencer reaches its downbeat, the loop will retrigger and play in perfect sync. 
     - 

     

   - 

   - MIDI Command

     :

     - 
     - Use the **MIDIReAlign** command (source# + 38) to execute ReAlign directly without muting the loop. 
     - 
     - The loop will retrigger at the next Global MIDI StartPoint. 
     - 

     

   - 

   

7. 

8. 

   **Cancel ReAlign**:

   

   - 
   - If no sync arrives or you change your mind, press **Multiply** again to cancel the ReAlign state. 
   - 

   

9. 

10. 

    **Experiment with Rhythmic Variations**:

    

    - 
    - Shift the loop out of sync intentionally using Reverse or HalfSpeed. 
    - 
    - Use ReAlign to bring it back into sync at the right moment for dramatic musical effects. 
    - 

    

11. 

#### **Tips for Blind Users**

- 

- **Audio Feedback**: Listen for the loop retriggering when ReAlign occurs. The loop will start playing in sync with the external sequencer’s downbeat. 

- 

- Button Presses

  :

  - 
  - Mute silences the loop. 
  - 
  - Multiply arms ReAlign.
  - 
  - Press Multiply again to cancel ReAlign. 
  - 

  

- 

- **Waiting State**: The Multiply LED will turn red while ReAlign is armed, indicating it’s waiting for the external sync signal. 

- 

These two features—LoopWindowing and Sync ReAlign—are unique and powerful tools for advanced looping and synchronization. They allow for creative exploration and precise control over your loops, making them invaluable for live performance and studio work.