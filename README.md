# 🌿 SWASTHYA PATH (ସ୍ୱାସ୍ଥ୍ୟ ପଥ / स्वास्थ्य पथ)

> **Tagline:** *From “I’m not feeling well” to “I know what to do next.”*  
> **Problem Statement:** *Telehealth Bridge for Underserved Rural Areas*  
> **Mission:** *Low-bandwidth access to rural care in many languages*

---

## 📌 Executive Summary

**Swasthya Path** is an offline-resilient, multilingual care navigation bridge engineered specifically for underserved rural communities, daily-wage workers, and smallholder farmers in regions like **Kalahandi, Odisha**.

Rather than serving as a generic telemedicine video directory, **Swasthya Path solves the real-world friction of rural healthcare**:
1. **Low-Bandwidth & Offline Robustness:** Fully functional digital health records and text intake operate without cellular signals. When offline, honest boundaries are enforced (no deceptive "offline AI" or fake live video).
2. **Realistic Browser-Based Video Consultation:** Powered by `navigator.mediaDevices.getUserMedia()`, this real-world teleconsultation interface adapts dynamically to network quality (Good ➔ Limited 2G ➔ Offline), features in-call chat, an in-call patient summary, clinical documentation, and a formal post-consultation discharge workflow. **No stock photos or decorative images are used inside the consultation room.**
3. **Clinical Safety by Design:** AI serves solely as an intake and navigation aid—**never giving medical diagnoses**. Deterministic safety filters intercept acute emergency warning signs (severe chest pain, respiratory distress, stroke signs) and route immediately to physical emergency care (108 Ambulance / nearest Primary Health Center).
4. **Triangulated Ecosystem:** Unifies rural patients, district tele-clinicians, and local village pharmacies (*Jan Aushadhi*) across Kalahandi blocks (Bhawanipatna, Junagarh, Dharamgarh, Kesinga, Narla) to verify medicine stock before patients undertake expensive 20–40 km bus journeys.
5. **Accessible & Multilingual:** Native support for **English**, **ଓଡ଼ିଆ (Odia)**, and **हिन्दी (Hindi)** with high-contrast UI, text-first design, text-scaling controls (`A+`), and a voice-input affordance for low-literacy users.

---

## 🔑 Fictional Demo Accounts (with 1-Click Auto-Fill)

The prototype features **three dedicated portals** with a one-click **[Use Demo Account]** button for rapid judging and demoing:

| Role | Name | Email | Mobile Number | Password | Location |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **👤 Patient** | Keshab Rout | `patient@swasthyapath.demo` | `+91 90000 10001` | `Demo@123` | Kalahandi, Odisha (Age 26) |
| **🩺 Doctor** | Dr. Ananya Mishra | `doctor@swasthyapath.demo` | `+91 90000 10002` | `Demo@123` | DHH Bhawanipatna, Kalahandi |
| **💊 Pharmacy** | Maa Laxmi Pharmacy | `pharmacy@swasthyapath.demo` | `+91 90000 10003` | `Demo@123` | Bhawanipatna Town, Kalahandi |

---

## 🚀 Quick Start Guide

### Local Development Server

```bash
# 1. Install dependencies
npm install

# 2. Run local server
npm run dev

# 3. Open in browser:
# http://localhost:5174/ (or http://localhost:5173/)
```

### Production Build & Verification

```bash
npm run build
npm run preview
```

---

## 🎬 Step-by-Step Demo Script (Evaluator Walkthrough)

| Step | Action | What to Observe / Explain |
| :---: | :--- | :--- |
| **1** | Open `http://localhost:5174/` | Notice the **"Who are you?"** login screen with 3 clear role options: Patient, Doctor, Pharmacy. |
| **2** | Login as **Patient** (`Keshab Rout`) | Click **Use Demo Account** and press **Login as Patient**. Notice top bar: *Welcome, Keshab Rout • Kalahandi, Odisha*, *Connection: GOOD*, *Low-Bandwidth Mode: ON*. |
| **3** | Explore Improved Dashboard | Notice the 4 clear functional groups: **1. Care Now**, **2. My Health**, **3. Local Services**, **4. Support**. |
| **4** | Click **AI Health Assistant** | Notice pre-filled: `Fever and body weakness for two days`. Leave warning signs as `No warning signs`. Click **Check Care Pathway** ➔ Output: **Suggested Pathway: Clinician Consultation** (highlight: *no medical diagnosis is given; clinicians decide*). Click **Save to Offline Health Records**. |
| **5** | Click **Find Doctor** & **Start Consultation** | Click *Start Consultation* on Dr. Ananya Mishra. Pre-call diagnostic check screen opens (`✓ Microphone`, `✓ Camera`, `✓ Connection`). Click **Join Consultation**. |
| **6** | Inside the **Realistic Video Consultation Room** | Real webcam media feed opens! Notice clean clinical interface (no fake stock photos), call timer (`MM:SS`), call quality (`● Good connection • 4G / Fiber • ~25 ms`). Test **Mic**, **Camera**, **Speaker**, and open the **Chat** panel to exchange messages. Open the **Patient Info** side panel. |
| **7** | Demonstrate **Network Adaptation** | Click **LIMITED** in the call top bar. Notice video quality scales down, audio is prioritized, and notification appears: *"Connection is weak. Video quality has been reduced to keep the consultation stable."* |
| **8** | Demonstrate **Offline Loss & Resume** | Click **OFFLINE**. The live call pauses cleanly with message: *"Connection lost. Live consultation paused. Reconnect to continue consultation."* (No fake live call offline). Click **GOOD** ➔ call resumes seamlessly! |
| **9** | End Consultation & Review Summary | Click **End Consultation** ➔ confirm end. Post-call summary screen displays: *Consultation Completed*, duration, doctor's clinical notes, and next step selector (*Routine monitoring / Follow-up / Physical PHC / Emergency*). Click **Return to Dashboard**. |
| **10** | Check **Pharmacy Availability** | Go to *Pharmacy Availability*. Select block: `Bhawanipatna`. Search: `Paracetamol`. Observe stock status: `AVAILABLE`, distance (1.2 km), address, and travel avoidance note. Switch to `Offline` in simulator to observe stale cache notice (*Last synced: Today, 10:32 AM*). |
| **11** | Switch to **Doctor Portal** | Use bottom-right simulator to switch to **Doctor**. Open **Triage Queue**. Observe Keshab Rout's routine review card (*"AI-assisted summary — doctor must verify"*) and Demo Patient 02's **🚨 URGENT FLAG** for acute shortness of breath & chest pain. Click *Open Urgent Case* to show emergency escalation. |
| **12** | Switch to **Pharmacy Portal** | Use bottom-right simulator to switch to **Pharmacy**. View dashboard (*12 listed, 9 available, 3 low/verify*). Change `Amoxicillin 500mg` status to `AVAILABLE`. Notice feedback: *"Stock updated successfully."* Switch back to Patient to see the change reflected live! |

---

## 🛡️ Clinical Safety & Emergency Protocols

- **Navigation Aid, Not a Diagnosis:** Swasthya Path never outputs disease probabilities or medical labels. It categorizes symptoms into actionable operational pathways: *Emergency Physical Care*, *Clinician Teleconsultation*, or *ASHA Worker Home Follow-up*.
- **Deterministic Red-Flag Bypassing:** When high-acuity warning signs are selected:
  - Severe difficulty breathing
  - Severe chest pain / pressure
  - Unconsciousness / fainting
  - Severe or uncontrollable bleeding
  - Sudden stroke-like signs (facial droop, arm weakness, slurred speech)
  The system triggers an **URGENT ESCALATION BANNER** directing the patient to the nearest hospital emergency room or **108 ambulance** immediately.
- **Clinician Decision Authority:** Tele-doctors review pre-structured summaries and hold sole legal and medical authority for diagnoses and prescriptions.

---

## 🏗️ Low-Bandwidth Video & Network Adaptation Matrix

| Network State | Video Behaviour | Audio Behaviour | UI & Records | Messaging Displayed |
| :--- | :--- | :--- | :--- | :--- |
| **Good (4G/WiFi)** | 720p / 30fps Full Stream | Full HD Audio | Live Sync Active | `● Good connection • 4G / Fiber • ~25 ms` |
| **Limited (2G/EDGE)** | Resolution scaled down, reduced framerate | Prioritized Audio | Chat & Info Active | `● Limited connection • 2G / unstable network` — *Video quality reduced to keep consultation stable* |
| **Offline (Dead Zone)** | **Disabled / Paused** | **Disabled / Paused** | Offline Records Active | `Connection lost. Live consultation paused. Reconnect to continue.` |

---

## 🏛️ eSanjeevani & MoHFW-Inspired Upgraded Telemedicine Workflows

Swasthya Path implements official MoHFW / eSanjeevani telemedicine concepts adapted for low-bandwidth rural operations:

1. **Patient ID Identification:**
   - Universal identifier: `RHB-OD-KLH-0941` bound across Patient profile, Health Card, Consultation Queue, Longitudinal Records, E-Prescriptions, and Doctor Dashboard.
2. **Kalahandi Rural Digital Health Card:**
   - Displays Patient Name, ID, Age, Gender, Blood Group (`B+`), Allergies, Chronic Conditions, Emergency Contact, and ABHA ID with offline download option.
3. **eSanjeevani Consultation Token & Queue Simulation:**
   - Token: `A-024` • Queue Position: `#3` • Estimated Wait: `12 minutes`.
   - Real-time queue progression, calling, and pre-call diagnostic checks.
4. **Specialist Preference & Clinician Fallback:**
   - Patients can define preferred specialty disciplines (General Medicine, Internal Medicine, Paediatrics, Dermatology).
   - If the requested doctor is unavailable, an interactive fallback dialog asks: *"Your selected doctor is unavailable. Would you like to continue with the next available clinician?"* (`[Continue]` / `[Keep Waiting]`).
5. **Physiological Parameters (Vitals):**
   - Temperature, Pulse, Blood Pressure, SpO2, Respiratory Rate, and Weight.
   - Formally labeled as: *"Patient-entered / manually entered"*.
6. **Diagnostic Reports & Imaging Viewer:**
   - Supports previewing Lab Reports (Complete Blood Count - CBC), Chest X-Rays, and Referrals.
   - Interactive DICOM inversion, zoom, and rotation controls.
   - Prominently labeled: *"Diagnostic image viewer — clinician review required."*
7. **Clinician E-Prescriptions with Local Drug Availability:**
   - Generates doctor-authorized digital prescriptions with digital signatures.
   - Integrates live **"LOCAL MEDICINE AVAILABILITY"** preview from Kalahandi pharmacies (Maa Laxmi / Jan Aushadhi) with disclaimer: *"Availability depends on pharmacy updates."*
8. **Doctor-to-Doctor Telemedicine (Specialist Opinion):**
   - Licensed medical officers can request secondary opinions from medical college specialists (MKCG / SCB) with urgency categorization and case summary.
9. **In-App SMS & Notification Engine:**
   - Simulated in-app SMS notifications for queue token issuance, doctor readiness, and pharmacy stock updates.
10. **"MY CARE JOURNEY" 6-Stage Continuity Tracker:**
    - Visual care progression: 1. Symptom reported ✓ ➔ 2. Safety check ✓ ➔ 3. Doctor consultation ✓ ➔ 4. Prescription ✓ ➔ 5. Medicine availability ✓ ➔ 6. Follow-up (Pending).
11. **Activity History & Demo Audit Trail:**
    - Transparent audit logs recording queue entry, clinician review, prescription creation, and synchronization actions.

---

*Swasthya Path — Built for rural resilience, clinician safety, and genuine grassroots community impact.*
