
# JohorCore (JCoreIQ)

### Johor–Singapore Causeway Intelligence Platform

## Introduction

JohorCore, also known as JCoreIQ, is a web-based platform developed during an online hackathon organized by Universiti Teknologi Malaysia (UTM).

The project was originally named CausewayIQ before being renamed JohorCore.

The idea behind this project came from the traffic congestion experienced around the Johor–Singapore Causeway, especially with the large number of daily commuters, visitors, and travellers crossing between Johor and Singapore.

With Visit Johor 2026 bringing additional attention to the state, our team wanted to explore how technology could help people make better travel decisions.

Instead of focusing only on traffic conditions, we developed a platform that combines traffic information, flood alerts, currency conversion, and travel planning features into a single application.

Our goal was to create a practical solution that could help users plan their journeys more efficiently.

**Project Status:** Hackathon prototype completed

**Project Type:** Team Hackathon Project

---

## Project Objectives

The main objective of JohorCore (JCoreIQ) was to develop a web-based platform that could help commuters and travellers plan their journeys between Johor and Singapore.

Our team aimed to:

- Provide traffic congestion information for the Johor–Singapore Causeway.
- Help users identify suitable travel times based on traffic conditions.
- Display flood-related information that could affect travel.
- Provide SGD to MYR currency conversion and toll-related information.
- Integrate an AI assistant to help users with travel-related questions.
- Combine multiple travel-related services into a single accessible platform.

## Key Features

### 1. Traffic Congestion Tracker

The traffic congestion tracker uses the Google Routes API to retrieve route and traffic-related information.

This feature was developed to help users understand traffic conditions and make more informed travel decisions.

### 2. Flood Alert System

The flood alert feature uses Open-Meteo data to provide weather and flood-related information.

It was designed to help travellers become aware of possible weather-related disruptions.

### 3. Currency and Toll Tracker

The platform includes a currency conversion feature for Singapore Dollars (SGD) and Malaysian Ringgit (MYR).

We also included toll-related information to help users consider travel expenses when planning their journeys.

### 4. Best Time Finder

The Best Time Finder evaluates travel conditions across a six-hour period.

The purpose of this feature is to help users identify potentially better times to travel based on the available route information.

### 5. AI Chat Assistant

We integrated Google's Gemini API to provide an AI-powered chat assistant.

This feature allows users to ask travel-related questions and receive AI-generated responses.

### 6. Progressive Web App (PWA)

JohorCore was developed with Progressive Web App capabilities to provide a more app-like experience through a web browser.

This allows users to access the platform across different supported devices.

---

## Project Scope

JohorCore was developed as a hackathon prototype rather than a fully deployed commercial travel service.

The project demonstrates how APIs, web technologies, and AI can be combined to address a real-world transportation problem.

Some features depend on external API availability and the accuracy of the information provided by those services.

---

## Technologies Used

JohorCore (JCoreIQ) integrates multiple technologies and external APIs to provide travel-related information through a single web application.

| Technology / Service | Purpose |
|---|---|
| Google Routes API | Route information and traffic-related travel estimates |
| Open-Meteo API | Weather-related information |
| Google Gemini API | AI-powered chat assistant |
| Currency Exchange API | SGD and MYR exchange-rate information |
| Firebase | Web application deployment |
| Progressive Web App (PWA) | App-like experience on supported devices |

The project demonstrates how different services can be integrated into one application.

## System Architecture

JohorCore follows a web-based architecture in which users interact with the application through their web browsers.

The application communicates with external APIs to retrieve information and display the results through its interface.

### Simplified Architecture

```text
           
                 Users
                   |
                   v
          JohorCore Web App
                   |
       +-----------+-----------+
       |           |           |
       v           v           v
   Traffic      Weather     Currency
   Features     Features    Features
       |           |           |
       v           v           v
 Google Routes  Open-Meteo  Exchange API

            AI Assistant
                 |
                 v
             Gemini API

       Hosted using Firebase

```

### How the System Works

1. Users access JohorCore through a web browser.
2. The application provides different travel-related features.
3. External APIs supply route, weather, exchange-rate, and AI-generated information.
4. The application processes and displays the retrieved information.
5. Users can use these features to support their travel planning.

## API Integration Challenges

During development, our team encountered challenges involving API integration and the accuracy of information displayed after deployment.

One of the main issues involved differences between expected API results and the information displayed in the Firebase-hosted application.

We investigated these problems during development and continued adjusting the application.

This experience helped us understand that integrating an API involves more than obtaining an API key. It also requires testing, validating responses, and checking how the application behaves after deployment.

---

## Development Process

JohorCore (JCoreIQ) was developed during an online hackathon organized by Universiti Teknologi Malaysia (UTM) in April 2026.

Our team worked on the project for less than two weeks while also managing our university assignments and other academic responsibilities.

This was our first experience developing a project under hackathon conditions, where we had limited time to plan, develop, test, and present our solution.

### 1. Project Planning

Our project idea was inspired by the traffic congestion around the Johor–Singapore Causeway.

We wanted to explore how technology could help commuters and travellers access useful travel information through a single platform.

The project was initially named CausewayIQ before being renamed JohorCore (JCoreIQ).

### 2. Application Development

During development, we worked on integrating several features into the application, including:

- Traffic and route information.
- Weather and flood-related information.
- Currency conversion and toll information.
- Best Time Finder.
- AI-powered chat assistant.
- Progressive Web App functionality.

We used external APIs to provide information for these features.

### 3. Testing and Deployment

We deployed the application using Firebase.

During testing, we encountered issues involving API responses and the accuracy of information displayed in the deployed application.

We investigated these problems and made adjustments while continuing to develop the project.

### 4. Project Presentation

As part of the hackathon submission, we prepared a demonstration video showcasing the application and its features.

Our team participated in the competition but was not selected among the Top 50 finalists.

Although we did not advance to the final selection, the hackathon provided practical experience in application development, teamwork, troubleshooting, and project presentation.

---

## Team Contributions

JohorCore was developed by a team of four members.

Although responsibilities were shared, the level of participation varied throughout the development process.

I was actively involved in multiple stages of the project, from development and API integration to testing and preparing the final submission.

### My Contributions

My involvement included:

- Participating in project discussions and development.
- Working with teammates on application features.
- Exploring and integrating external APIs.
- Using Google Antigravity as an AI-assisted development environment.
- Investigating API-related problems during Firebase deployment.
- Participating in application testing and troubleshooting.
- Contributing to the preparation and editing of the project demonstration video.

As this was a collaborative project, I acknowledge the contributions of my teammates and the original repository owner.

---

## Challenges Encountered

### 1. Limited Development Time

Our team had less than two weeks to complete the project while managing academic assignments.

This required us to prioritize important features and work within a limited development period.

### 2. API Integration and Data Accuracy

One of our main challenges involved integrating external APIs and ensuring that the application displayed useful information.

We encountered differences between expected API responses and the results displayed after deploying the application on Firebase.

This required additional testing and troubleshooting.

### 3. Team Coordination

Coordinating a team during a short online hackathon was challenging.

This experience taught me the importance of communication, task distribution, and managing responsibilities in a collaborative project.

### 4. Balancing Academic Responsibilities

The hackathon took place while we were also completing university assignments.

Managing both responsibilities required us to adjust our schedules and prioritize tasks.

---

## Lessons Learned

Through this project, I gained experience in:

- Developing a web application as part of a team.
- Integrating multiple external APIs.
- Testing applications after deployment.
- Troubleshooting API-related problems.
- Using AI-assisted development tools.
- Working under time constraints.
- Preparing a technical project demonstration.
- Understanding the importance of teamwork and communication.

This was my first hackathon experience, and it gave me a better understanding of the challenges involved in developing and presenting a working application within a limited timeframe.


---

## Project Results

JohorCore (JCoreIQ) was developed and submitted as a working hackathon prototype during the UTM online hackathon in April 2026.

### Project Achievements

- Developed a web-based travel information platform.
- Integrated multiple external APIs into one application.
- Implemented traffic, weather, currency, and AI-assisted features.
- Deployed the application using Firebase.
- Developed Progressive Web App (PWA) capabilities.
- Prepared and submitted a project demonstration video.
- Gained practical experience in collaborative software development.

### Hackathon Outcome

Our team successfully completed the project submission but was not selected among the Top 50 finalists.

Although we did not advance to the final round, the project gave us experience developing an application under time constraints while balancing academic responsibilities.

The hackathon also helped us understand the importance of API reliability, teamwork, testing, and presenting a technical solution.

---

## Future Improvements

Although the hackathon has ended, there are several areas where JohorCore could be improved.

Possible improvements include:

- Improving the accuracy and reliability of traffic information.
- Strengthening API error handling and response validation.
- Improving the user interface across different screen sizes.
- Expanding travel planning features.
- Improving application performance and loading times.
- Strengthening the security of API integrations.
- Performing additional testing before future deployments.

These are proposed improvements and have not all been implemented.

---

## Project Links

- **Source Code:** [JohorCore GitHub Repository](https://github.com/MeshachJeret/JohorCore)
- **Live Application:** [Link to be added after verification](https://johor-core-33d8c.firebaseapp.com/).
- **Demonstration Video:** [Link to be added](https://www.youtube.com/watch?v=fiayrnp5Iow).

---

## Acknowledgements

JohorCore was developed as a collaborative hackathon project.

I would like to acknowledge my teammates for their contributions to the project, including Divesh, whose repository was used as the source of this fork.

The experience gave our team an opportunity to explore web development, API integration, and real-world problem-solving.
