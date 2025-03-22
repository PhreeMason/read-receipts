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

3. **Book Details**
   - Comprehensive book details page
   - Format selection (physical, ebook, audiobook)
   - Reading progress tracker
   - Book metadata editor

### Supporting Screens
1. **Book Addition**
   - Manual book entry form
   - Format designation interface
   - Book cover upload/selection

### User Story 1.2: Updating Reading Progress
**As a** reader

**I want to** update my progress after a reading session

**So that** I can track how far I've gotten in my book

### Acceptance Criteria:

- Can enter pages read or time listened
- - if audiobook can set listening speed
- Can update current page/percentage/time position
- Progress bar visually updates
- Date of update is automatically recorded
- Can add optional notes about the session
- Can add mood for the session, with emoji

user lorem picsum for all image urls i.e: https://picsum.photos/64/96?random=10

I have attached the current UI mock ups for the MVP screens of my app. Logging user reading sessions. Based on the user story above generate the mocks for that screen. Only generate the html necessary for the book addition screen. I will make the changes to my html to add in the new code. Do not include the navigation bar since that is always the same and I can add it myself. Remember to follow the design style outlined above.


Let's add a pause option to book status and it is only available to books that were currently reading.
DNF is only available as an option after pause, or currently reading.

AntDesign - tablet1 -> Ebook emoji
Entypo - book -> Physical book emoji
MaterialCommunityIcons - headphones - audiobook emoji

Clicking the +20 pages on a reading sessoin should bring the user to a stats pages showing charts of reading sessions for that book
