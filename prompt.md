## Role
You are a **senior front-end developer**.

## Design Style
- A **perfect balance** between **elegant minimalism** and **functional design**.
- **Well-proportioned white space** for a clean layout.
- **Light and immersive** user experience.
- **Clear information hierarchy** using **subtle shadows and modular card layouts**.
- **Natural focus** on core functionalities.
- **Refined rounded corners**.
- **Delicate micro-interactions**.
- **Comfortable visual proportions**.
- **Accent colors** chosen based on the book and reading theme (warm, literary tones).

## Technical Specifications
1. **Each page should be 375x812 PX**, with outlines to **simulate a mobile device frame**.
2. **Icons**: Use an **online vector icon library** (icons **must not** have background blocks, baseplates, or outer frames).
3. **Images**: Must be sourced from **open-source image websites** and linked directly.
4. **Styles**: Use **Tailwind CSS** via **CDN** for styling.
5. **Do not display the status bar**, including time, signal, and other system indicators.
6. **Do not display non-mobile elements**, such as scrollbars.
7. **All text should be only black or white**.

## Task
This is a **Book Organizer app called "Read Receipts" where users can catalog, track, review, and share their reading experiences**.

- Simulate a **Product Manager's detailed functional and information architecture design**.
- Follow the **design style** and **technical specifications** to generate a complete **UI design plan**.
- Create a **UI.html** file that contains all pages displayed in a **horizontal layout**.
- Generate the **first two pages** now.

## Required Screens Based on User Stories

### Core Screens
1. **Authentication & Profile**
   - Account creation/login screen
   - Reading profile setup
   - User profile screen with sync status

2. **Home & Dashboard**
   - Main dashboard with reading overview
   - Reading stats visualization 
   - Active reading status and streaks

3. **Library Management**
   - Book library grid/list view
   - TBR (To Be Read) organization screen
   - Priority management interface
   - Book status filters (unread, reading, completed)

4. **Book Details**
   - Comprehensive book details page
   - Format selection (physical, ebook, audiobook)
   - Reading progress tracker
   - Book metadata editor

I have attached the current UI mock ups for the MVP screens of my app. I would like to turn this into a propper react native app. What UI Components should I create? Do not generate any code just think and plan for now, and also focus on minimal amount of UI Components


Let's add a pause option to book status and it is only available to books that were currently reading.
DNF is only available as an option after pause, or currently reading.

AntDesign - tablet1 -> Ebook emoji
Entypo - book -> Physical book emoji
MaterialCommunityIcons - headphones - audiobook emoji

Clicking the +20 pages on a reading sessoin should bring the user to a stats pages showing charts of reading sessions for that book
